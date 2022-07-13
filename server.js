import express from "express";
import morgan from "morgan";
import multer from "multer";
import identifyPokemonFromImage from "./tfmodel/model.js";
import fs from "fs";
import axios from "axios";
import { pokemonList } from "./services/pokemonService.js";

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
	const obj = { ...predictions[0] };
	try {
		const pokemonData = await axios.get(`https://pokeapi.co/api/v2/pokemon/${obj.label.toLowerCase()}`);
		console.log(pokemonData.data);
		obj.image = pokemonData.data.sprites.other["official-artwork"]["front_default"];
		res.json(obj);
		return;
	} catch (err) {
		console.log(err);
		res.json(obj);
		return;
	}
});

app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});
