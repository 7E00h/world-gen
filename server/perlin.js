/*
	perlin.js

	Simple implementation of Ken Perlin's gradient noise algorithm.
	Does *not* use the recommended gradients; they are generated randomly.
	The quintic fade function is used however.
*/

function randomVector() {
	// IMPORTANT
	// By creating vectors of random length, this in turn
	// creates a random range. In order to constrain the
	// range, the length of vectors must be constrained.
	// Here, the vectors are limited to sqrt(2) magnitude
	// to set range to [-1, 1]
	let rX = 1 * (Math.random() >= 0.5) ? 1 : -1;
	let rY = 1 * (Math.random() >= 0.5) ? 1 : -1;
	return [rX, rY];
}

function fade(t) {
	// 6t^5 - 15t^4 + 10t^3
	// t^3 * (6t^2 - 15t + 10)
	//        t * (6t - 15) + 10
	return t * t * t * (t * (6 * t - 15) + 10);
}

function interpolate(a, b, t) {
	return (b - a) * t + a;
}

function generateGradient(m, n) {
	let gradient = Array.from(Array(m + 1), _ => new Array(n + 1));
	for (let row = 0; row <= m; row++)
		for (let col = 0; col <= n; col++)
			gradient[row][col] = randomVector();
			// gradient[row][col] = [random(), random()];

	return gradient;
}

function offset(a, b) {
	return [b[0] - a[0], b[1] - a[1]];
}

function dot(a, b) {
	return a[0] * b[0] + a[1] * b[1];
}

class PerlinNoise {

	constructor(rows, cols, seed = null) {
		this.rows = rows;
		this.cols = cols;
		this.grad = generateGradient(rows, cols, seed);
	}

	perlin2(x, y) {

		x = x % this.cols;
		y = y % this.rows;

		let point = [x, y];

		// Calculate the unit square containing (x, y)
		let x0 = Math.floor(x);
		let y0 = Math.floor(y);
		let x1 = x0 + 1;
		let y1 = y0 + 1;

		// Calculate offset vectors from each corner
		let offsets = [
			offset([x0, y0], point),
			offset([x1, y0], point),
			offset([x0, y1], point),
			offset([x1, y1], point)
		];

		// Calculate dot products
		let dots = [
			dot(offsets[0], this.grad[y0][x0]),
			dot(offsets[1], this.grad[y0][x1]),
			dot(offsets[2], this.grad[y1][x0]),
			dot(offsets[3], this.grad[y1][x1])
		];

		// Interpolate (bilinear)
		// The fade function reduces sharpness as coordinates approach integers
		let dx = fade(x - x0);
		let dy = fade(y - y0);

		let value = interpolate(
			interpolate(dots[0], dots[1], dx),
			interpolate(dots[2], dots[3], dx),
			dy
		);

		return (value + 1) / 2;
	}
}

module.exports = PerlinNoise;