var assert = require('assert');
var expect = require('chai').expect;
var POINTS = 100000;

describe('CanVis', function() {
	describe('Performance', function () {
		describe('Criação das séries', function () {
			it('Array sem tamanho e push', function () {
				timer.start();
				arraySizelessAndPush();
				delta = timer.finish();
				assert.equal(delta, 100, 'Rodou em menos de 100ms');
			});
		});
	});
});

function arraySizelessAndPush() {
	var serie = [];
	var step = (Math.PI/180);
	for (var i=0; i < POINTS; i++) {
		serie.push( step * i );
	}
}

function arraySizelessAndPush() {
	var serie = [];
	var step = (Math.PI/180);
	for (var i=0; i < POINTS; i++) {
		serie.push( step * i );
	}
}

var timer = {
	start: function() {
		this.counter = process.hrtime();
	},
	finish: function() {
		if (this.counter) {
			var diffArray = process.hrtime(this.counter);
			var diff = (diffArray[0] * 1e3 + diffArray[1] * 1e-6).toFixed(2);
			console.log('Time: %d ms', diff);
			this.counter = 0;
			return diff;
		}
	}
}

