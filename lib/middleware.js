const core = require('./core');

module.exports = function(req, res, next) {
	const send = res.send;
	const render = res.render;
	res.send = function(html) {
		if('string' !== typeof html) {
			send.call(this, html)
		}
		send.call(this, core(html));
	};

	res.render = function(layout, content) {
		render.call(this, layout, content, function(err, html) {
			if(err) {
				return next(err);
			}
			res.send(html)
		});
	};
};
