var cheerio = require('cheerio');
var expect = require('chai').expect;
var ampify = require('../lib').core;

describe('ampify', function() {
	var $;
	it('should add amp attribute on html tag', function() {
		const out = ampify('<html></html>');
		$ = cheerio.load(out);
		expect($('html[amp]')).to.have.length(1);
	});

	describe('head tag', function() {
		it('meta charset tag', function() {
			const out = ampify('<html><head></head></html>');
			$ = cheerio.load(out);
			expect($('meta[charset]')).to.have.length(1);
		});

		it('meta viewport tag', function() {
			const out = ampify('<html><head></head></html>');
			$ = cheerio.load(out);
			const viewport = $('meta[name=viewport]');
			expect(viewport).to.have.length(1);
			expect(viewport.attr('content')).to.equal('width=device-width,minimum-scale=1,initial-scale=1');
		});

		it('style amp-boilerplate tag', function() {
			const out = ampify('<html><head></head></html>');
			$ = cheerio.load(out);
			expect($('style[amp-boilerplate]')).to.have.length(2); // the boilerplate contains an extra noscript style
		});

		it('amp library script tag', function() {
			const out = ampify('<html><head></head></html>');
			$ = cheerio.load(out);
			expect($('script[src="https://cdn.ampproject.org/v0.js"]')).to.have.length(1);
		});
	});

		it('should replace img tag with amp-img', function() {
			const out = ampify('<img src="image.png" width="600" height="400">');
			$ = cheerio.load(out);

			const ampImg = $('amp-img');
			expect(ampImg).to.have.length(1);
			expect(ampImg.attr('width')).to.equal('600');
			expect(ampImg.attr('height')).to.equal('400');
		});

		it('should replace video tag with amp-video', function() {
			const out = ampify('<video src="test.mpg">');
			$ = cheerio.load(out);
			expect($('amp-video')).to.have.length(1);
		});

	it('should remove certain tags', function() {
		const out = ampify('<html><head><script to-remove></script></head></html>', {
			tagsToRemove: ['script[to-remove]']
		});
		$ = cheerio.load(out);
		expect($('head script[to-remove]')).to.have.length(0);
	});

	it('should add a client-id', function() {
		const out = ampify('<html><head></head></html>', {
			clientId: true
		});
		$ = cheerio.load(out);
		expect($('meta[name="amp-google-client-id-api"]')).to.have.length(1);
	});
});
