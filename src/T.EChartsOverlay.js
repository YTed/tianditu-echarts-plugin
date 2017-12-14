var __TMapOverlayWithEChart = { count: 0 };

T.EChartsOverlay = T.Overlay.extend({
	
	initialize: function(options) {
		this.options = options;
		this._div = null;
		this._index = 0;
	},
	
	onAdd: function(map) {
		map.setViewport(this.options.viewport);
		
		this._map = map;
		
		var elem = document.createElement("div");
		elem.style.position = "absolute";
		elem.style.top = 0;
		elem.style.left = 0;
		elem.style.width = map.getSize().x + "px";
		elem.style.height = map.getSize().y + "px";
		
		map.getPanes().overlayPane.appendChild(elem);
		map.on("moveend", this._handleMoveEnd, this);
		map.on("resize", this._handleResize, this);
		this._div = elem;
		
		this._echarts = echarts.init(elem);
		
		this._index = __TMapOverlayWithEChart.count;
		__TMapOverlayWithEChart.count++;
		__TMapOverlayWithEChart[this._index] = this;
		
		this._handleMoveEnd();
	},
	
	onRemove: function(map) {
		this._echarts.dispose();
		map.getPanes().overlayPane.removeChild(this._div);
		map.off("moveend", this._handleMoveEnd, this);
		map.off("resize", this._handleResize, this);
	},
	
	getElement: function() {
		return this._div;
	},
	
	getMap: function() {
		return this._map;
	},
	
	draw: function() {
		if(this._chartView) {
			this._chartView.update();
		}
	},
	
	setChartView: function(setChartView) {
		this._chartView = setChartView;
	},
	
	getIndex: function() {
		return this._index;
	},
	
	initializeECharts: function(echartsOption) {
		this._echarts.setOption(echartsOption);
		this.draw();
	},
	
	setOptions: function(options) {
	},
	
	_handleMoveEnd: function() {
		this._div.style.display = 'none';
        var currentBounds = this._map.getBounds();
        if (!this.isadd && currentBounds.equals(this.bounds)) {
            this.isadd = false;
            return;
        }
        this.bounds = currentBounds;

        var ne = this._map.lngLatToLayerPoint(currentBounds.getNorthEast()),
            sw = this._map.lngLatToLayerPoint(currentBounds.getSouthWest()),
            topY = ne.y,
            leftX = sw.x,
            h = sw.y - ne.y,
            w = ne.x - sw.x;

        this._div.style.width = w + 'px';
        this._div.style.height = h + 'px';
        this._div.style[this.CSS_TRANSFORM()] = 'translate(' + Math.round(leftX) + 'px,' + Math.round(topY) + 'px)';
		this.draw();
		
		var div = this._div;
		setTimeout(function() {
			div.style.display = 'block';
		}, 50);
	},
	
	_handleResize: function(event) {
		var size = event.newSize;
		this._div.style.width = size.x + "px";
		this._div.style.height = size.y + "px";
	},

    CSS_TRANSFORM: function () {
        var div = document.createElement('div');
        var props = [
            'transform',
            'WebkitTransform',
            'MozTransform',
            'OTransform',
            'msTransform'
        ];

        for (var i = 0; i < props.length; i++) {
            var prop = props[i];
            if (div.style[prop] !== undefined) {
                return prop;
            }
        }
        return props[0];
    },
});