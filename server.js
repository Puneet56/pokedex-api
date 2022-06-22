import * as tf from "@tensorflow/tfjs-node";
import automl from "@tensorflow/tfjs-automl";
import express from "express";
import fs from "fs";
import multer from "multer";
import morgan from "morgan";

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "./uploads");
	},
	filename: function (req, file, cb) {
		cb(null, `${Date.now()}-${file.originalname}`);
	},
});

const upload = multer({ storage });

const handler = tf.io.fileSystem("./tensorflow/model.json");

const port = 4000;

async function run(data) {
	const image = tf.node.decodeImage(data, 3);
	const graphModel = await tf.loadGraphModel(handler);
	let dict = fs.readFileSync("./tensorflow/dict.txt", "utf8");
	let dictArray = dict.split("\n");
	const model = new automl.ImageClassificationModel(graphModel, dictArray);
	const predictions = await model.classify(image);
	predictions.sort((a, b) => b.prob - a.prob);
	return predictions;
}

const app = express();

app.use(morgan("dev"));

app.use(express.json());

app.post("/", upload.single("image"), async (req, res) => {
	const image = fs.readFileSync(req.file.path);
	const predictions = await run(image);
	fs.unlink(req.file.path, () => {});
	res.json(predictions);
});

app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});
