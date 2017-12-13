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
			return new echarts.graphics.BoundingRect(0, 0, api.getWidth(), api.getHeight());
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
				return __TMapOverlayWithEChart[this.option.overlayIndex];
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
		version: '0.0.2'
	};
})();