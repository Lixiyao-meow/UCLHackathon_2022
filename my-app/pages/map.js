import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import {transform, fromLonLat} from 'ol/proj';

const lat = 51.5242;
const long = -0.1329;

const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM()
    })
  ],
  view: new View({
    //center: transform([long, lat], 'EPSG:4326', 'EPSG:3857'),
    center: fromLonLat([long, lat]),
    zoom: 15
  })
});

export default map