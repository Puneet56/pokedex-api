import * as tf from "@tensorflow/tfjs-node";
import express from "express";
import modelData from "./tensorflow/model.json" assert { type: "json" };
import fs from "fs";

const port = 4000;

async function run() {
	const image = fs.readFile("./pikachu.png", async (err, data) => {
		if (err) {
			console.log(err);
		} else {
			const model = await tf.automl.loadImageClassification(modelData);
			//get image to test
			const predictions = await model.classify(image);
			//sort prediction by highest prob, take the first one
			predictions.sort(sortByProperty("prob"));
			//Add prediction result inside output element

			return predictions;
		}
	});
}

async function runServer() {
	const app = express();

	app.use(express.json());

	app.get("*", async (req, res) => {
		const data = await run();
		res.json(data);
	});

	app.listen(port, () => {
		console.log(`Listening on port ${port}`);
	});
}

runServer();
