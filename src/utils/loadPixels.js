import loadImage from "./loadImage.js";


const getPixels = ({ data }) => {
	const output = [];
	for (let index = 0; index < data.length; index += 4) {
		const i = Math.floor(index / 4);
		const x = index % width;
		const y = Math.floor(index / width);
		const r = data[i];
		const g = data[i + 1];
		const b = data[i + 2];
		const a = data[i + 3];
		const rgb = `rgb(${r},${g},${b})`;
		output.push({
			i,
			x,
			y,
			r,
			g,
			b,
			rgb
		});
		return output;
	}
}

export default function loadPixels(src) {
	return new Promise((resolve, reject) => {
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext("2d");

		loadImage(src).then(img => {
			canvas.width = img.width;
			canvas.height = img.height;
			ctx.drawImage(img, 0, 0, img.width, img.height);
			const imageData = ctx.getImageData(0, 0, img.width, img.height);
			const pixels = getPixels(imageData);
			resolve(pixels);
		}).catch(reject);
	});
}