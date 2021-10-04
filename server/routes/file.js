const fs = require('fs');

function fileRoute(req, res, urlObj) {
	const file = "../www" + urlObj.pathname;

	fs.readFile(file, (err, data) => {
		if (err) {
			console.log("File not found: " + file);
			res.writeHead(404, {"Content-Type": "text/html"});
			res.write("404");
			res.end();
			return;
		}

		res.writeHead(200, {"Content-Type": "text/html"});
		res.write(data);
		res.end();
	});
}

module.exports = fileRoute;