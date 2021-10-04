/*
	fasterperlin.js

	Same idea as perlin.js, just a bit more optmized.
	It's still slower than noisejs perlin2, though.

	Iterations  perlin (s)              fasterperlin (s)        noisejs (s)
	----------  ----------------------  ----------------------  -----------------------
	100         0.0003035999983549118   0.00011900000274181366  0.00011980000138282776
	10000       0.0015553000122308731   0.00556470000743866     0.0028118000030517578
	1000000     0.03510169999301434     0.024636500000953673    0.019387100011110305
	1000000000  35.34731039999426       24.955485500007867      19.50329739999771
*/

function randomVector() {
	let rX = (Math.random() >= 0.5) ? 1 : -1;
	let rY = (Math.random() >= 0.5) ? 1 : -1;
	return [rX, rY];
}

function fade(t) {
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

	return gradient;
}

class PerlinNoise {

	constructor(rows, cols) {
		this.rows = rows;
		this.cols = cols;
		this.grad = generateGradient(rows, cols);
	}

	influence(x, y, cx, cy) {
		// grad is probably the bottleneck
		let grad = this.grad[cy][cx];
		return (x - cx) * grad[0] + (y - cy) * grad[1];
	}

	perlin2(x, y) {
		x = x % this.cols;
		y = y % this.rows;

		let x0 = Math.floor(x);
		let y0 = Math.floor(y);
		let x1 = x0 + 1;
		let y1 = y0 + 1;

		let d1 = this.influence(x, y, x0, y0);
		let d2 = this.influence(x, y, x1, y0);
		let d3 = this.influence(x, y, x0, y1);
		let d4 = this.influence(x, y, x1, y1);

		let dx = fade(x - x0);

		let value = interpolate(
			interpolate(d1, d2, dx),
			interpolate(d3, d4, dx),
			fade(y - y0)
		);

		// Remap to [0, 1]
		return (value + 1) / 2;
	}

	octave(x, y, octaves) {
		let freq = 1;
		let ampl = 1;
		let totl = 0;
		let norm = 0;

		for (let octave = 0; octave < octaves; octave++) {
			totl += ampl * this.perlin2(freq * x, freq * y);
			norm += ampl;
			ampl /= 2;
			freq *= 2;
		}

		return totl / norm;
	}
}

module.exports = PerlinNoise;