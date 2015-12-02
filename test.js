if (typeof require != 'undefined') {
	var expect = require('chai').expect;
}

describe('CanVis', function() {
	describe('Entities', function () {
		describe('Series', function () {
			it('Must create series and define attributes correctly', function () {
				expect(new Series().end()).to.be.equal(400000,
					'Must have default values if called with no parameters');
				expect(new Series({start: 0, interval: 1, points: 10}).end()).to.be.equal(9,
					'Must have the number of points between start and end with the specified interval');
				expect(new Series({start: 1, interval: 3, points: 10}).end()).to.be.equal(28,
					'Must have the number of points between start and end with the specified interval');
			});
			it('Must create example sinusoid with 360 degrees', function () {
				var sinusoid = Series.createSinusoid({start: 0, points: 361, interval: 1});
				expect(sinusoid.end()).to.be.equal(360, 'Sinusoid must have 360 points');
				expect(sinusoid.data[0]).to.be.equal(0, 'Sin of 0 equals 0');
				expect(sinusoid.data[90]).to.be.equal(1, 'Sin of 90 degrees equals 1');
				expect(sinusoid.data[360]).to.be.closeTo(0, 0.0001, 'Sin of 360 degrees equals 0');
			});
			it('Create two sinusoids with 360 degrees', function () {
				var sinusoids = Series.createSinusoid({start: 0, points: 361, interval: 1}, 2);
				expect(sinusoids.length).to.be.equal(2, 'Must have created 2 sinusoids');
				expect(sinusoids[0].end()).to.be.equal(360, 'Sinusoid one must have 360 points');
				expect(sinusoids[0].data[90]).to.be.equal(1, 'Sinusoid one for 90 degrees equals 1');
				expect(sinusoids[1].end()).to.be.equal(360, 'Sinusoid two must have 360 points');
				expect(sinusoids[1].data[90]).to.be.closeTo(0.5, 0.0001, 'Second sinusoid is half the size of the first one');
			});
		});
	});
	describe('Performance', function () {
		describe('Series construction', function () {
			it('Must create 1 series in the more efficient way', function () {
				//expect(timer.profile(Series.createSinusoid, true)).to.be.below(100);
				expect(timer.profile(Series.createSinusoid)).to.be.below(100);
			});
			it('Must create 10 series in the more efficient way', function () {
				//expect(timer.profile(Series.createSinusoid, true)).to.be.below(100);
				expect(timer.profile(function() { Series.createSinusoid(null, 10); })).to.be.below(100);
			});
		});
	});
});

/**
 * Constructor of time series
 * @config Configuration object with start, end and interval
 * Ex: {start: 0, end: 400000, interval: 1}
 */
function Series(config) {
	config = config || {};
	this.start = typeof config.start != 'undefined' ? config.start : 1;
	this.points = typeof config.points != 'undefined' ? config.points : 400000;
	this.interval = config.interval || 1;
	this.end = function() {
		return this.start + this.interval * (this.points - 1);
	};
	this.data = new Float32Array(this.points);
}

/**
 * Build example sinusoid series.
 * @config Configuration of the series
 * @instances Number of instances to return
 */
Series.createSinusoid = function(config, instances) {
	instances = instances || 1;
	var degree = Math.PI/180,
		seriesArray = new Array(instances);
	for (var j = 0; j < instances; j++) {
		seriesArray[j] = new Series(config);
	}
	var series = seriesArray[0];
	for (var i = 0; i < series.points; i++) {
		var x = (series.start + i * series.interval) * degree;
		var value = Math.sin(x);
		for (var k = 0; k < instances; k++) {
			seriesArray[k].data[i] = value / (k+1);
		}
	}
	return instances == 1 ? series : seriesArray;
}


/**
 * Utility to measure time elapsed 
 * or to profile function executions
 */
var timer = {
	start: function() {
		this.begin = new Date().getTime();
	},
	end: function(verbose) {
		if (this.begin) {
			this.diff = new Date().getTime() - this.begin;
			this.begin = null;
			if (verbose) console.log('Time: %d ms', this.diff);
			return this.diff;
		}
	},
	profile: function(callback, verbose, times) {
		times = times || 10;
		var total = 0;
		for(var i=0; i<times; i++) {
			this.start();
			callback();
			total += this.end(verbose);
		}
		var avg = Math.round(total/times); 
		if (verbose) console.log('Avg:  %d ms, Total: %d ms, Times: %d', avg, total, times);
		return avg;
	}
}

