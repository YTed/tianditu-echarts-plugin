# Introduction

This is a Plugin to embed [echarts](http://echarts.baidu.com/index.html) into [Tianditu](http://lbs.tianditu.com/), developed based on [echarts.bmap](https://github.com/ecomfe/echarts/tree/master/extension/bmap) 
extension and [Tianditu's HeatMapOverlay](http://lbs.tianditu.com/api/js4.0/opensource/demo/HeatmapOverlay.html).

# Usage

* Simply import `T.EChartsOverlay.js` and `echarts.tianditu.js` in your html header.;
* Instantiate a `T.EChartsOverlay` and add it to your map with `T.Map.addOverLay`;
* Define your echarts option, if your data are coordinate-related, set `coordinateSystem` as `'tianditu'`:
* Add a section of `tianditu` to your option:
```
var option = {
  // ...
  tianditu: {
    overlayIndex: overlay.getIndex(),
    center: [113.6253, 34.7466],
    zoom: 5,
  },
  series: [
    {
      name: 'your series name',
      type: 'your series type',
      coordinateSystem: 'tianditu',
      data: [], // your series data
    },
    // ...
  ]
  // ...
}
```
* Initialize echarts with the option defined above, with `T.EChartsOverlay.initializeECharts`
* Done.

An example is provided as `map.html` and `map.js`.
