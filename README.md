# Introduction

This is a Plugin to embed [echarts](http://echarts.baidu.com/index.html) into [Tianditu](http://lbs.tianditu.com/), developed based on [echarts.bmap](https://github.com/ecomfe/echarts/tree/master/extension/bmap) 
extension and [Tianditu's HeatMapOverlay](http://lbs.tianditu.com/api/js4.0/opensource/demo/HeatmapOverlay.html).

# Usage

* Simply import `echarts.tianditu.js` in your html header;
* Instantiate a `T.EChartsOverlay` and add it to your map with `T.Map.addOverLay`;
* Define your echarts option, if your data are coordinate-related, set `coordinateSystem` as `'tianditu'`:
* Add a section of `tianditu` to your option, **use `overlayIndex` field to connect the `EChartsOverlay` instantiated above**:
```
var config = {};
var overlay = T.EChartsOverlay(config);
map.addOverlay(overlay);

var option = {
  // ...
  tianditu: {
    overlayIndex: overlay.getIndex(),  // IMPORTANT !!
    center: [113.6253, 34.7466],       // optional
    zoom: 5,                           // optional
  },
  series: [
    {
      name: 'your series name',
      type: 'your series type',
      coordinateSystem: 'tianditu',    // IMPORTANT if you want to display spatial data on map.
      data: [],                        // your series data
    },
    // ...
  ]
  // ...
}

overlay.initializeECharts(option);
```
* Initialize echarts with the option defined above, with `T.EChartsOverlay.initializeECharts`
* Done.

