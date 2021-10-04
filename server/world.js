/*
	world.js
*/

const Noise = require('./fasterperlin');
const sharp = require('sharp');

function createMatrix(m, n) {
	return Array.from(Array(m), _ => new Array(n));
}

SNOW          = [220, 220, 220];
TALL_MOUNTAIN = [134, 94, 33];
MOUNTAIN      = [183, 128, 45];
HILL          = [74, 183, 45];
GRASS         = [89, 237, 49];
BEACH         = [232, 183, 23];
SHALLOW       = [23, 138, 232];
DEEP          = [0, 0, 128];

class World {

	constructor(rows, cols) {
		this.rows = rows;
		this.cols = cols;

		this.grid      = createMatrix(rows, cols);
		this.heightMap = new Noise(256, 256);
	}

	sampleHeight(x, y, octaves) {
		// 16 magical number
		return this.heightMap.octave(x, y, octaves);
	}

	generate(octaves, exponent) {
		let freq = 6;
		let min  = 1;
		let max  = 0;

		// Generate heightmap
		for (let row = 0; row < this.rows; row++) {

			let ySamp = row / this.rows;
			ySamp *= freq;

			for (let col = 0; col < this.cols; col++) {

				let xSamp = col / this.cols;
				xSamp *= freq;
				
				let noise = this.sampleHeight(xSamp, ySamp, octaves);
				
				if (noise < min)
					min = noise;
				if (noise > max)
					max = noise

				this.grid[row][col] = Math.pow(noise, exponent);
			}
		}

		
		let range = max - min;

		for (let row = 0; row < this.rows; row++)
			for (let col = 0; col < this.cols; col++) {
				let noise = this.grid[row][col];
				noise = (noise - min) / range;
				
				
				let color = [0, 0, 128];

				if (noise > 0.95)
					color = SNOW;
				else if (noise > 0.85)
					color = TALL_MOUNTAIN;
				else if (noise > 0.7)
					color = MOUNTAIN;
				else if (noise > 0.575)
					color = HILL;
				else if (noise > 0.3)
					color = GRASS;
				else if (noise > 0.25)
					color = BEACH;
				else if (noise > 0.15)
					color = SHALLOW;
				
				this.grid[row][col] = color;
			}
			
	}

	generateImage() {
		let imageData = Buffer.alloc(this.rows * this.cols * 3);
		const cols = this.cols;

		function setPixel(x, y, color) {
			let idx = 3 * (y * cols + x);
			imageData[idx++] = color[0];
			imageData[idx++] = color[1];
			imageData[idx]   = color[2];
		}

		for (let row = 0; row < this.rows; row++)
			for (let col = 0; col < this.cols; col++) {
				// let i = 255 * this.grid[row][col];
				// setPixel(col, row, [i, i, i]); grayscale
				setPixel(col, row, this.grid[row][col]);
			}

		return imageData;
	}

	exportToBuffer(callback) {
		sharp(this.generateImage(), {
			raw: {
				width: this.cols,
				height: this.rows,
				channels: 3
			}
		}).png().toBuffer((err, data, info) => {
			callback(err, data);
		});
	}

	exportToImage() {
		sharp(this.generateImage(), {
			raw: {
				width: this.cols,
				height: this.rows,
				channels: 3
			}
		}).toFile("world.png");
	}
}

let w = new World(512, 512);
// w.generate(16);
//w.exportToImage();
module.exports = World;