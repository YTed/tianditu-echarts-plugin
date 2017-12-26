/****************************************************************
** Author: yude
** Email: ted.yude@gmail.com
****************************************************************/
T.__TMapOverlayWithEChart = { count: 0 };

T.EChartsOverlay = T.Overlay.extend({
	/**
	 * option:
	 *   - center, T.LngLat, default null
	 *   - size, T.Point, default null
	 *   - anchor, T.Point, default null
	 *	 - followMap, boolean, default true
	 *	 - cls, String, default null
	 */
	initialize: function(options) {
		this.options = options;
		this._div = null;
		this._index = 0;
	},
	
	onAdd: function(map) {
		map.setViewport(this.options.viewport);
		
		this._map = map;
		
		var root = document.createElement("div");
		root.style.position = "absolute";
		
		var left = 0, top = 0;
		if(this.options.center) {
			var px = map.lngLatToContainerPoint(this.options.center);
			left = px.x;
			top = px.y;
		}
		if(this.options.anchor) {
			left += this.options.anchor.x;
			top += this.options.anchor.y;
		}
		
		if(this.options.cls) {
			root.classList.add(this.options.cls);
		}
		
		root.style.top = top + "px";
		root.style.left = left + "px";
		
		this._setSize(root, map.getSize().x, map.getSize().y);
			
		map.getPanes().overlayPane.appendChild(root);
		
		if(this.options.followMap === true) {
			map.on("move", this._handleMove, this);
		} else {
			map.on("moveend", this._handleMoveEnd, this);
		}
		map.on("resize", this._handleResize, this);
		this._root = root;
		
		var elem = document.createElement("div");
		root.appendChild(elem);
		elem.style.width = '100%';
		elem.style.height = '100%';
		this._div = elem;
		
		this._echarts = echarts.init(elem);
		
		this._index = T.__TMapOverlayWithEChart.count;
		T.__TMapOverlayWithEChart.count++;
		T.__TMapOverlayWithEChart[this._index] = this;
		
		this._handleMoveEnd();
	},
	
	onRemove: function(map) {
		this._echarts.dispose();
		map.getPanes().overlayPane.removeChild(this._root);
		if(this.options.followMap === true) {
			map.off("move", this._handleMove, this);
		} else {
			map.off("moveend", this._handleMoveEnd, this);	
		}
		map.off("resize", this._handleResize, this);
	},
	
	getElement: function() {
		return this._root;
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
		this._echarts.clear();
		this._echarts.setOption(echartsOption);
		this.draw();
	},
	
	addEChartsEventListener: function(event, handler) {
		this._echarts.on(event, handler);
	},
	
	removeEChartsEventListener: function(event, handler) {
		this._echarts.off(event, handler);
	},
	
	setOptions: function(options) {
	},
	
	_handleMove: function() {
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

		this._setSize(this._root, w, h);
		this._root.style[this.CSS_TRANSFORM()] = 'translate(' + Math.round(leftX) + 'px,' + Math.round(topY) + 'px)';
	},
	
	_handleMoveEnd: function() {
		this._root.style.display = 'none';
	
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

		this._setSize(this._root, w, h);
		this._root.style[this.CSS_TRANSFORM()] = 'translate(' + Math.round(leftX) + 'px,' + Math.round(topY) + 'px)';

		
		this.draw();
		var div = this._root;
		setTimeout(function() {
			div.style.display = 'block';
		}, 50);
	},
	
	_handleResize: function(event) {
		var size = event.newSize;
		this._setSize(this._root, size.x, size.y);
	},
	
	_setSize: function(elem, w, h) {
		if(this.options.size) {
			elem.style.width = this.options.size.x + "px";
			elem.style.height = this.options.size.y + "px";
		} else {
			elem.style.width = w + "px";
			elem.style.height = h + "px";
		}
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

(function() {
	
	var TMapCoordinateSystem = function() {
		var zrUtil = echarts.util;

		function TMapCoordSys(map, api) {
			this._map = map;
			this.dimensions = ['lng', 'lat'];
			this._mapOffset = [0, 0];
			this._api = api;
		}

		TMapCoordSys.prototype.dimensions = ['lng', 'lat'];

		TMapCoordSys.prototype.setZoom = function(zoom) {
			this._zoom = zoom;
		};

		TMapCoordSys.prototype.setCenter = function(center) {
			this._center = this._map.lngLatToContainerPoint(new T.LngLat(center[0], center[1]));
		};

		TMapCoordSys.prototype.setMapOffset = function(mapOffset) {
			this._mapOffset = mapOffset;
		};

		TMapCoordSys.prototype.getMap = function() {
			return this._map;
		};

		TMapCoordSys.prototype.dataToPoint = function(data) {
			var lnglat = new T.LngLat(data[0], data[1]);
			var px = this._map.lngLatToContainerPoint(lnglat);
			var mapOffset = this._mapOffset;
			return [px.x - mapOffset[0], px.y - mapOffset[1]];
		};

		TMapCoordSys.prototype.pointToData = function(pt) {
			var mapOffset = this._mapOffset;
			var point = new T.Point(pt[0] + mapOffset[0], pt[1] + mapOffset[1]);
			var lnglat = this._map.containerPointToLnglat(point);
			return [lnglat.getLng(), lnglat.getLat()];
		};

		TMapCoordSys.prototype.getViewRect = function() {
			var api = this._api;
			return new echarts.graphic.BoundingRect(0, 0, api.getWidth(), api.getHeight());
		};

		TMapCoordSys.prototype.getRoamTransform = function() {
			return echarts.matrix.create();
		};

		TMapCoordSys.prototype.prepareCustoms = function(data) {
			var rect = this.getViewRect();
			return {
				coordSys: {
					type: 'tianditu',
					x: rect.x,
					y: rect.y,
					width: rect.width,
					height:rect.height,
				},
				api: {
					coord: zrUtil.bind(this.dataToPoint, this),
					size: zrUtil.bind(dataToCoordSize, this),
				},
			};
		};

		function dataToCoordSize(dataSize, dataItem) {
			dataItem = dataItem || [0, 0];
			return zrUtil.map([0, 1], function(dimIdx) {
				var val = dataItem[dimIdx];
				var halfSize = dataSize[dimIdx] / 2;
				var p1 = [];
				var p2 = [];
				p1[dimIdx] = val - halfSize;
				p2[dimIdx] = val + halfSize;
				p1[1 - dimIdx] = p2[1 - dimIdx] = dataItem[1 - dimIdx];
				return Math.abs(this.dataToPoint(p1)[dimIdx] - this.dataToPoint(p2)[dimIdx]);
			}, this);
		};

		var overlay;

		TMapCoordSys.dimensions = TMapCoordSys.prototype.dimensions;
		TMapCoordSys.dataToPoint = TMapCoordSys.prototype.dataToPoint;

		TMapCoordSys.create = function(ecModel, api) {
			var tmapCoordSys;
			var root = api.getDom();
			
			ecModel.eachComponent('tianditu', function(tmapModel) {
				var painter = api.getZr().painter;
				var viewportRoot = painter.getViewportRoot();
				if(typeof T === 'undefined') {
					throw new Error('Tianditu api is not loaded');
				}
				if(tmapCoordSys) {
					throw new Error('Only one tianditu component can exist');
				}
				if(!tmapModel.getTMap()) {
					throw new Error('Tianditu is not initialized');
				}
				if(!tmapModel.getTOverlay()) {
					throw new Error('T.EChartsOverlay is not initialized');
				}
				
				var map = tmapModel.getTMap();
				
				var center = tmapModel.get('center');
				var zoom = tmapModel.get('zoom');
				if(center && zoom) {
					var lnglat = new T.LngLat(center[0], center[1]);
					map.centerAndZoom(lnglat, zoom);
				} else {
					center = map.getCenter();
					center = [center.getLng(), center.getLat()];
					zoom = map.getZoom();
				}
				
				tmapCoordSys = new TMapCoordSys(map, api);
				tmapCoordSys.setMapOffset(tmapModel.__mapOffset || [0, 0]);
				tmapCoordSys.setZoom(zoom);
				tmapCoordSys.setCenter(center);
				
				tmapModel.coordinateSystem = tmapCoordSys;
			});
			
			ecModel.eachSeries(function(seriesModel) {
				if(seriesModel.get('coordinateSystem') === 'tianditu') {
					seriesModel.coordinateSystem = tmapCoordSys;
				}
			});
		};

		return TMapCoordSys;
	};
	
	var TMapModel = function() {
		return {
			type: 'tianditu',
			
			_initialized: false,
			
			getTMap: function() {
				return this.getTOverlay().getMap();
			},
			
			getTOverlay: function() {
				return T.__TMapOverlayWithEChart[this.option.overlayIndex];
			},
		};
	};
	
	var TMapView = function() {
		return {
			type: 'tianditu',
			
			render: function(tmapModel, ecModel, api) {
				var rendering = true;
				
				var map = tmapModel.getTMap();
				var overlay = tmapModel.getTOverlay();
				overlay.setChartView({
					update: function() {
						api.dispatchAction({ type: 'tmapRoam' });
					},
				});
				
				rendering = false;
			},
		};
	};
	
	echarts.registerCoordinateSystem('tianditu', TMapCoordinateSystem());
	echarts.extendComponentModel(TMapModel());
	echarts.extendComponentView(TMapView());
	
	echarts.registerAction(
		{
			type: 'tmapRoam',
			event: 'tmapRoad',
			update: 'updateLayout'
		}, 
		function(payload, ecModel) { 
			/** do nothing **/
		}
	);
	
	return {
		version: '0.0.1'
	};
})();