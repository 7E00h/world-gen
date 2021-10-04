const http          = require('http');
const url           = require('url');
const fs            = require('fs');
const generateRoute = require('./routes/generate');
const fileRoute     = require('./routes/file');

const indexFile = fs.readFileSync("../www/index.html");

const PORT = 8080;

function router(req, res) {
	const urlObj = url.parse(req.url, true);
	switch (urlObj.pathname) {
		case "/generate":
			generateRoute(req, res, urlObj);
			break;

		case "/":
		case "":
			defaultRoute(req, res, urlObj);
			break;

		default:
			fileRoute(req, res, urlObj);
			break;
	}
}

function defaultRoute(req, res, urlObj) {
	res.writeHead(200, {'Content-Type': "text/html"});
	res.write(indexFile);
	res.end();
}

const server = http.createServer(router);
server.listen(PORT, _ => console.log(`Listening on port ${PORT}`));