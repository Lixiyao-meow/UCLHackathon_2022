// import HeatCanvas from '../heatcanvas/dist/heatcanvas.js';
//const HeatCanvas = require('../heatcanvas/dist/heatcanvas.js');
var map, layer;
var init = function(){
    map = new OpenLayers.Map ("map", {
            controls: [
                new OpenLayers.Control.Attribution(),
                new OpenLayers.Control.Navigation()],
            maxExtent: new OpenLayers.Bounds(-20037508.34,-20037508.34,
                                            20037508.34,20037508.34),
            numZoomLevels: 12,
            maxResolution: 156543.0339,
            displayProjection: new OpenLayers.Projection("EPSG:4326"),
            units: 'm',
            projection: new OpenLayers.Projection("EPSG:4326")
            });

    var mapnik = new OpenLayers.Layer.OSM.Mapnik("Mapnik", {
            displayOutsideMaxExtent: true,
            wrapDateLine: true});

    map.addLayer(mapnik);
    map.setBaseLayer(mapnik);

    //var bounds = OpenLayers.Bounds.fromArray([70.4,15.2,136.2,53.7])
    //        .transform(map.displayProjection, map.getProjectionObject());
    //map.zoomToExtent(bounds);
    map.setCenter(new OpenLayers.LonLat(-0.1300, 51.523).transform(map.displayProjection, map.getProjectionObject()), 16);

    var size = map.getSize();
    if (size.h > 320) {
        map.addControl(new OpenLayers.Control.PanZoomBar());
    } else {
        map.addControl(new OpenLayers.Control.PanZoom());
    }
    var heatmap = new OpenLayers.Layer.HeatCanvas("Heat Canvas", map, {},
                  {'step':0.5, 'degree':HeatCanvas.LINEAR, 'opacity':0.7});

    LoadData().then(data=> {
        console.log(data)
        for(var i=0; i<data.length; i++) {
            if (data[i][2]==0)
                data[i][2] = 0.3;
            heatmap.pushData(data[i][0], data[i][1], Math.sqrt(data[i][2]) * 0);
        }
        map.addLayer(heatmap);
    });

};

var LoadData = async function(){
    var traffic;
    var data = await d3.json("../static/traffic.json", function (json) {return json;});
    return data;
}
//window.map = map;