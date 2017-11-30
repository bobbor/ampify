var cheerio = require('cheerio');

var defaults = {
	tagsToRemove: [], // array of strings,
	tagsToAmpify: ['img', 'video'],
	clientId: false,
	canonical: false,
	responsiveImages:false// boolean: to tell if client-id-api should be used. see: https://support.google.com/analytics/answer/7486764
};

module.exports = function(html, options) {
	var $, head;
	options = Object.assign({}, defaults, options);

	$ = cheerio.load(html, {
		normalizeWhitespace: false,
		xmlMode: false,
		decodeEntities: false,
		cwd: 'amp',
		round: true
	});

	/* html ⚡ */
	$('html').each(function() { $(this).attr('amp', ''); });

	/* head */
	head = $('head');
	/* main amp library */
	if ($('head script[src="https://cdn.ampproject.org/v0.js"]').length === 0) {
		head.prepend('<script async src="https://cdn.ampproject.org/v0.js"></script>');
	}

	/* meta charset */
	$('head meta[charset="utf-8"]').remove();
	$('head meta[charset="UTF-8"]').remove();
	head.prepend('<meta charset="utf-8">');

	/* meta viewport */
	$('head meta[name="viewport"]').remove();
	head.append('<meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">');

	/* style amp-boilerplate */
	if ($('head style[amp-boilerplate]').length === 0) {
		head.append('<style amp-boilerplate="">body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style><noscript><style amp-boilerplate="">body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>');
	}

	if(options.clientId) {
		head.append('<meta name="amp-google-client-id-api" content="googleanalytics">');
	}
	if(options.canonical) {
		if ($('head link[rel="canonical"]').length === 0) {
			head.append('<link rel="canonical" href="'+options.canonical+'">');
		}
	}

	$(options.tagsToRemove.join(', ')).each(function() {
		$(this).remove();
	});
	$('img:not([height]):not([width])').each(function() {
		$(this).attr('fill')
	});
	$('img[height]:not([width])').each(function() {
		$(this).attr('fixed-height')
	});
	if(options.responsiveImages) {
		$('img[height][width]').each(function() {
			$(this).attr('responsive')
		});
	}
	/* amp tags */
	$(options.tagsToAmpify.join(',')).each(function() {
		this.name = 'amp-' + this.name;
	});

	return $.html();
};
