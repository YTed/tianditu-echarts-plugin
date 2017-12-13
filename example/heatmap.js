$(function() {

	var points = [].concat.apply([], data.map(function (track) {
		return track.map(function (seg) {
			return seg.coord.concat([1]);
		});
	}));
	
	
	var map = new T.Map('mapDiv');
	map.centerAndZoom(new T.LngLat(116.40969, 39.89945), 13);
	
	var config = {};
	var overlay = new T.EChartsOverlay(config);
	map.addOverLay(overlay);
	var option = {
		animation: false,
		tianditu: {
			overlayIndex: overlay.getIndex(),
			center: [120.13066322374, 30.240018034923],
			zoom: 14,
		},
		visualMap: {
			show: false,
			top: 'top',
			min: 0,
			max: 5,
			seriesIndex: 0,
			calculable: true,
			inRange: {
				color: ['blue', 'blue', 'green', 'yellow', 'red']
			}
		},
		series: [{
			type: 'heatmap',
			coordinateSystem: 'tianditu',
			data: points,
			pointSize: 5,
			blurSize: 6
		}]
	};
	overlay.initializeECharts(option);
});