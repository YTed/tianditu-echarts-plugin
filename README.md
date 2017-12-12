# Introduction

This is a Plugin to embed [echarts](http://echarts.baidu.com/index.html) into [Tianditu](http://lbs.tianditu.com/), developed based on [echarts.bmap](https://github.com/ecomfe/echarts/tree/master/extension/bmap) 
extension and [Tianditu's HeatMapOverlay](http://lbs.tianditu.com/api/js4.0/opensource/demo/HeatmapOverlay.html).

# Usage

* Simply import `T.EChartsOverlay.js` and `echarts.tianditu.js` in your html header.;
* Instantiate a `T.EChartsOverlay` and add it to your map with `T.Map.addOverLay`;
* Define your echarts option, if your data are coordinate-related, set `coordinateSystem` as `'tianditu'`;
* Initialize echarts with the option defined above.
* Done.

An example is provided as `map.html` and `map.js`.
