$(function() {

	var viewport = [];
	var points = [].concat.apply([], data.map(function (track) {
		return track.map(function (seg) {
			viewport.push(new T.LngLat(seg.coord[0], seg.coord[1]));
			return seg.coord.concat([1]);
		});
	}));
	
	
	var map = new T.Map('mapDiv');
	map.setViewport(viewport);
	
	var config = {};
	var overlay = new T.EChartsOverlay(config);
	map.addOverLay(overlay);
	var option = {
		animation: false,
		tianditu: {
			overlayIndex: overlay.getIndex(),
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