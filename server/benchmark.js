const perlin        = require('./perlin');
const fasterperlin    = require('./fasterperlin');
const noisejs       = require('noisejs');
const Table         = require('easy-table');
const {performance} = require('perf_hooks');

function benchmarkNoise(max, iters, noise) {
	let randX = Math.random() * max;
	let randY = Math.random() * max;

	const start = performance.now()

	for (let i = 0; i < iters; i++)
		noise.perlin2(randX, randY);

	return performance.now() - start;
}

DIM  = 10

p1 = new perlin(DIM, DIM);
p2 = new fasterperlin(DIM, DIM);
p3 = new noisejs.Noise(Math.random());

//console.log("-- perlin --");
//benchmarkNoise(DIM, ITER, p1);

var t = new Table

iters = 1
for (let p = 0; p < 10; p++)  {
	t.cell('Iterations', iters);

	let time = 0;
	
	time = benchmarkNoise(DIM, iters, p1) / 1000;
	t.cell("perlin (s)", time);

	time = benchmarkNoise(DIM, iters, p2) / 1000;
	t.cell('fasterperlin (s)', time);

	time = benchmarkNoise(DIM, iters, p3) / 1000;
	t.cell('noisejs (s)', time);

	iters *= 10;
	t.newRow();
}

console.log(t.toString());