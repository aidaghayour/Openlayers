import 'ol/ol.css';
import {useGeographic} from 'ol/proj';
import {Map, View, Feature, Overlay} from 'ol/index';
import {Point} from 'ol/geom';
import {Vector as VectorLayer, Tile as TileLayer} from 'ol/layer';
import {OSM, Vector as VectorSource} from 'ol/source';
import {Style, Circle, Fill} from 'ol/style';

useGeographic();

var place = [-52.72, 47.55];
var point = new Point(place);

var place1 = [-52.72, 47.50];
var point1 = new Point(place1);


var map = new Map({
  target: 'map',
  view: new View({
    center: place,
    zoom: 11
  }),

  layers: [

    new TileLayer({
      source: new OSM() }),


    new VectorLayer({
      source: new VectorSource({
        features: [
          new Feature(point)
        ]
      }),
      style:
          new Style({ image: new Circle({ radius: 9, fill: new Fill({color: 'red'}) })
      })
    }),

       new VectorLayer({
      source: new VectorSource({
        features: [
          new Feature(point1)
        ]
      }),
      style:
          new Style({ image: new Circle({ radius: 9, fill: new Fill({color: 'red'}) })
      })
    })
  ]


});

var element = document.getElementById('popup');


var popup = new Overlay({
  element: element,
  positioning: 'bottom-center',
  stopEvent: false,
  offset: [0, -10]
});
map.addOverlay(popup);


//gets the coordinates and writes them in a stylish way
function formatCoordinate(coordinate) {
  return ("\n    <table>\n      <tbody>\n        <tr><th>lon</th><td>" + (coordinate[0].toFixed(3)) + "</td></tr>\n        <tr><th>lat</th><td>" + (coordinate[1].toFixed(3)) + "</td></tr>\n      </tbody>\n    </table>");
}


//small coordinate showing th cener of the map
var info = document.getElementById('info');
map.on('moveend', function() {
  var view = map.getView();
  var center = view.getCenter();
  info.innerHTML = formatCoordinate(center);
});



//Popping up a window showing infomration about each feature
map.on('pointermove', function(event) {
  var feature = map.getFeaturesAtPixel(event.pixel)[0];
  if (feature) {
    var coordinate = feature.getGeometry().getCoordinates();
    popup.setPosition(coordinate);
    $(element).popover({
      title: "St. John's coordinate",
      placement: 'top',
      html: true,
      content: "Which are" + formatCoordinate(coordinate)
    });
    $(element).popover('show');
  } else {
    $(element).popover('destroy');
  }
});


//changing mouse shape from flash to hand on a feature
map.on('pointermove', function(event) {
  if (map.hasFeatureAtPixel(event.pixel)) {
    map.getViewport().style.cursor = 'pointer';
  } else {
    map.getViewport().style.cursor = 'inherit';
  }
});


/////////////////////////////////////////////////////////


 
var txt = '[{"lan" : "-52.72", "lgn" : "47.55"},{"lan" : "-52.72", "lgn" : "47.50"}]'
var obj = JSON.parse(txt);
document.getElementById("demo").innerHTML = obj[0].lan + ", " + obj[1].lgn;
//document.getElementById("demo").innerHTML = obj[0].city + ", " + obj[0].admin;

var vector = new VectorLayer({
  source: new VectorSource({
    url: 'https://simplemaps.com/static/data/country-cities/ca/ca.json',
    format: new GeoJSON()
  }),
  style: function(feature) {
    return style[feature.getGeometry().getType()];
  }
});