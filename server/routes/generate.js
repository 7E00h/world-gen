const World = require('../world');

function generateRoute(req, res, urlObj) {
	let query = urlObj.query;

	const width    = parseInt(query.width);
	const height   = parseInt(query.height);
	const exponent = 1 + query.exponent / 100;
	const octaves  = parseInt(query.octaves);

	let world = new World(height, width);

	world.generate(octaves, exponent);

	world.exportToBuffer((err, data) => {
		if (!err) {
			res.writeHead(200, {"Content-Type": "text/plain"});
			res.write(data.toString('base64'));
			res.end();
		}
	});
}

module.exports = generateRoute;