const ampify = require('ampify').middleware;
const express = require('express');

const app = express();

app.get('/amp/article', ampify, (req, res) => {
	const html = `
		<html>
			<head>
				<title>AMP page</title>
			</head>
			<body>
				<div>
					<p>This is AMP article</p>
				</div>
			</body>
		</html>
	`;
	res.send(html);
});

app.get('/article', (req, res) => {
	const html = `
		<html>
			<head>
				<title>HMTL page</title>
			</head>
			<body>
				<div>
					<p>This is HTML article</p>
				</div>
			</body>
		</html>
	`;
	res.send(html);
});

app.listen(3000, () => {
	console.log('Listening on port 3000!');
});
