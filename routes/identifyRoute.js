import express from "express";
import identifyPokemonFromImage from "../model/model.js";
import fs from "fs";
import multer from "multer";
import path from "path";

const __dirname = path.dirname(new URL(import.meta.url).pathname).slice(1);

console.log(__dirname);

console.log(path.join(__dirname, "../uploads"));

const identifyRouter = express.Router();

identifyRouter.post("/", upload.single("image"), async (req, res) => {
	res.send(req);

	// console.log(req.file);
	// const image = fs.readFileSync(req.file.path);
	// const predictions = await identifyPokemonFromImage(image);
	// fs.unlink(req.file.path, () => {});
	// res.json(predictions[0]);
});

export default identifyRouter;
