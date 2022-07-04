import express from "express";
import morgan from "morgan";
import multer from "multer";
import identifyPokemonFromImage from "./model/model.js";
import fs from "fs";

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "./uploads");
	},
	filename: function (req, file, cb) {
		cb(null, `${Date.now()}-${file.originalname}`);
	},
});

const upload = multer({ storage });

const port = 4000;
const app = express();
app.use(morgan("dev"));
app.use(express.json());

app.post("/api/identify", upload.single("image"), async (req, res) => {
	const image = fs.readFileSync(req.file.path);
	const predictions = await identifyPokemonFromImage(image);
	fs.unlink(req.file.path, () => {});
	res.json(predictions[0]);
});

app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});
