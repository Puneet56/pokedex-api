import dictArray from "./../tensorflow/dict.js";

export const pokemonList = () => {
	const list = dictArray.map((item, index) => ({ name: item, id: index }));
	return list;
};
