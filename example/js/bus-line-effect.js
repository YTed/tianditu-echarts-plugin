$(function() {
	
	var map = new T.Map('mapDiv');
	map.centerAndZoom(new T.LngLat(116.46, 39.92), 10);
	var config = {};
	var overlay = new T.EChartsOverlay(config);
	map.addOverLay(overlay);
	var option = generateOption(overlay);
	overlay.initializeECharts(option);
	
});

var generateOption = function(overlay) {
	var hStep = 300 / (data.length - 1);
	var busLines = [].concat.apply([], data.map(function (busLine, idx) {
		var prevPt;
		var points = [];
		for (var i = 0; i < busLine.length; i += 2) {
			var pt = [busLine[i], busLine[i + 1]];
			if (i > 0) {
				pt = [
					prevPt[0] + pt[0],
					prevPt[1] + pt[1]
				];
			}
			prevPt = pt;

			points.push([pt[0] / 1e4, pt[1] / 1e4]);
		}
		return {
			coords: points,
			lineStyle: {
				normal: {
					color: echarts.color.modifyHSL('#5A94DF', Math.round(hStep * idx))
				}
			}
		};
	}));
	return {
		tianditu: {
			overlayIndex: overlay.getIndex(),
		},
		series: [{
			type: 'lines',
			coordinateSystem: 'tianditu',
			polyline: true,
			data: busLines,
			silent: true,
			lineStyle: {
				normal: {
					// color: '#c23531',
					// color: 'rgb(200, 35, 45)',
					opacity: 0.2,
					width: 1
				}
			},
			progressiveThreshold: 500,
			progressive: 200
		}, {
			type: 'lines',
			coordinateSystem: 'tianditu',
			polyline: true,
			data: busLines,
			lineStyle: {
				normal: {
					width: 0
				}
			},
			effect: {
				constantSpeed: 20,
				show: true,
				trailLength: 0.1,
				symbolSize: 1.5
			},
			zlevel: 1
		}]
	};
};