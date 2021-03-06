const core = require('./core');

module.exports = (options) => (req, res, next) => {
	const send = res.send;
	const render = res.render;
	res.send = function(html) {
		if('string' !== typeof html) {
			send.call(this, html)
		}
		send.call(this, core(html, options));
	};

	res.render = function(layout, content) {
		render.call(this, layout, content, function(err, html) {
			if(err) {
				return next(err);
			}
			res.send(html)
		});
	};
	req.actualUrl = req.path.replace('/amp/', '/');
	next();
};
