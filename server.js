import * as tf from "@tensorflow/tfjs-node";
import automl from "@tensorflow/tfjs-automl";
import express from "express";
import axios from "axios";
// import modelData from "./tensorflow/model.json" assert { type: "json" };
import fs from "fs";

const handler = tf.io.fileSystem("./tensorflow/model.json");

const port = 4000;

async function run() {
	const data = fs.readFileSync("./pokemon.jpg");
	const image = tf.node.decodeImage(data, 3);
	const graphModel = await tf.loadGraphModel(handler);
	let dict = fs.readFileSync("./tensorflow/dict.txt", "utf8");
	dict = dict.split("\r\n");
	const model = new automl.ImageClassificationModel(graphModel, dict);
	const predictions = await model.classify(image);
	predictions.sort((a, b) => b.prob - a.prob);
	return predictions;
}

const app = express();

app.use(express.json());

app.get("*", async (req, res) => {
	const data = await run();
	res.send(data);
});

app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});
