var map, layer;
var heatmap;

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

    var markers = new OpenLayers.Layer.Markers("Markers");
    map.addLayer(markers);
    var size = new OpenLayers.Size(50, 50);
    var offset = new OpenLayers.Pixel(-(size.w / 2), -size.h);
    var icon = new OpenLayers.Icon("../static/food.png", size, offset);
  
    
    markers.addMarker(
      new OpenLayers.Marker(new OpenLayers.LonLat(-0.1333457, 51.5241198).transform(
          map.displayProjection,
          map.getProjectionObject()
        ),
        icon),
    );

    map.setCenter(new OpenLayers.LonLat(-0.1300, 51.523).transform(map.displayProjection, map.getProjectionObject()), 16);

    var size = map.getSize();
    if (size.h > 320) {
        map.addControl(new OpenLayers.Control.PanZoomBar());
    } else {
        map.addControl(new OpenLayers.Control.PanZoom());
    }
    heatmap = new OpenLayers.Layer.HeatCanvas("Heat Canvas", map, {},
                  {'step':0.5, 'degree':HeatCanvas.LINEAR, 'opacity':0.5});
    
    var path =  "../static/traffic.json";
    LoadData(path).then(data=> {
        for(var i=0; i<data.length; i++) {
            if (data[i][2]==0)
                data[i][2] = Math.random();
            heatmap.pushData(data[i][0], data[i][1], Math.sqrt(data[i][2]) * 20);
        }
        map.addLayer(heatmap);
    });

    setInterval(update, 2000);

};

var LoadData = async function(path){
    var data = await d3.json(path, function (json) {return json;});
    return data;
};

var update = function(){
    if (heatmap.data.length) {
        heatmap.heatmap.clear();
        heatmap.data.length = 0;
    }

    var mode = document.querySelector("#Select_Mode").value;
    if (mode == "Study Space")
        path = "../static/traffic.json";
    if (mode == "Food")
        path = "../static/food.json";
    if (mode == "Commuting")
        path = "../static/commuting.json";

    const newHeatmap = new OpenLayers.Layer.HeatCanvas("Heat Canvas", map, {},
              {'step':0.5, 'degree':HeatCanvas.LINEAR, 'opacity':0.5});

    LoadData(path).then(data=> {
        for(var i=0; i<data.length; i++) {
            newHeatmap.pushData(data[i][0], data[i][1], Math.sqrt(data[i][2]) * 20);
        }
        map.removeLayer(heatmap);
        map.addLayer(newHeatmap);
        heatmap = newHeatmap;
    });
    console.log("updated");
};