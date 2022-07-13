import * as tf from "@tensorflow/tfjs-node";
import automl from "@tensorflow/tfjs-automl";
import dictArray from "../tensorflow/dict.js";

const handler = tf.io.fileSystem("./tensorflow/model.json");

async function identifyPokemonFromImage(data) {
	const graphModel = await tf.loadGraphModel(handler);
	const model = new automl.ImageClassificationModel(graphModel, dictArray);
	const image = tf.node.decodeImage(data, 3);
	const predictions = await model.classify(image);
	predictions.sort((a, b) => b.prob - a.prob);
	return predictions;
}

export default identifyPokemonFromImage;
