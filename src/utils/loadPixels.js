import loadImage from "./loadImage.js";


const getPixels = ({ data }) => {
	const output = [];
	for (let index = 0; index < data.length; index += 4) {
		const i = Math.floor(index / 4);
		const x = i % width;
		const y = Math.floor(i / width);
		const r = data[index];
		const g = data[index + 1];
		const b = data[index + 2];
		const a = data[index + 3];
		const rgb = `rgb(${r},${g},${b})`;
		output.push({
			i,
			x,
			y,
			r,
			g,
			b,
			a,
			rgb
		});
	}
	return output;
}

export default function loadPixels(src) {
	return new Promise((resolve, reject) => {
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext("2d");

		loadImage(src)
			.then((img) => {
				canvas.width = img.width;
				canvas.height = img.height;
				ctx.drawImage(img, 0, 0, img.width, img.height);
				const { data, width } = ctx.getImageData(0, 0, img.width, img.height);
				const pixels = getPixels({ data, width });
				resolve(pixels);
			})
			.catch(reject);
	});
}