var expect = require('chai').expect;

describe('CanVis', function() {
	describe('Performance', function () {
		describe('Criação das séries', function () {
			it('Deve criar série com 400 mil pontos em menos de 100 ms', function () {
				var serie = [], step = (Math.PI/180);
				timer.start();
				for (var i=0; i < 400000; i++) {
					serie.push( step * i );
				}
				timer.finish();
				expect(timer.elapsed()).to.be.below(100);
			});
			it('Deve criar série com 400 mil pontos em menos de 10 ms', function () {
				var serie = new Array(400000);
				var step = Math.PI/180;
				timer.start();
				for (var i=0; i < 400000; i++) {
					serie[i] = step * i;
				}
				timer.finish();
				expect(timer.elapsed()).to.be.below(10);
			});
		});
	});
});

var timer = {
	start: function() {
		this.counter = process.hrtime();
	},
	finish: function() {
		if (this.counter) {
			var diffArray = process.hrtime(this.counter);
			this.diff = (diffArray[0] * 1e3 + diffArray[1] * 1e-6).toFixed(3);
			this.counter = 0;
			//console.log('Time: %d ms', this.diff);
		}
	},
	elapsed: function() {
		return this.diff;
	},
}

