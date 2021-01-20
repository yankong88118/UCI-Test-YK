// Creating map object
var myMap = L.map("mapid", {
    center: [36.44, -119.46],
    zoom: 11
  });
  
  // Adding tile layer to the map
  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  }).addTo(myMap);

// url
var url="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Function that will determine the color of magnitude
function chooseColor(magnitude) {
    switch (magnitude) {
    case magnitude>5:
      return "#800020";
    case magnitude>4:
      return "FF0000";
    case magnitude>3:
      return "#FF7F00";
    case magnitude>2:
      return "#FFFF00";
    case magnitude>1:
      return "#00FF00";
    default:
      return "#e2fab9k";
    }
  }

//function that will determine radius
function chooseRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }

    return magnitude * 4;
  }

// Grabbing our GeoJSON data..
d3.json(url, function(data) {
    // Creating a geoJSON layer with the retrieved data
    L.geoJson(data, {
      style: function styleInfo(features) {
        return {
          color: "white",
          fillColor: chooseColor(features.properties.mag),
          fillOpacity: 0.8,
          radius:chooseRadius(features.properties.mag),
          weight: 1.5
        };
      }
    }).addTo(myMap);
  });

   // create GeoJSON layer
d3.json(url, function(data) {
   L.geoJson(data, {
    // Make cricles
    pointToLayer: function(features, latlng) {
      return L.circleMarker(latlng);
    },
    // cirecle style
    style: function styleInfo(features) {
      return {
        color: "white",
        fillColor: chooseColor(features.properties.mag),
        fillOpacity: 0.8,
        radius:chooseRadius(features.properties.mag),
        weight: 1.5
      };
    },
    // popup for each marker
    onEachFeature: function(features, layer) {
      layer.bindPopup("Magnitude: " + features.properties.mag + "<br>Location: " + features.properties.place);
    }
  }).addTo(myMap);
});
  
  // Set up the legend
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var grades = [0,1,2,3,4,5];
    var colors = ["#e2fab9k","#00FF00","#FFFF00","#FF7F00","FF0000","#800020"];

// Looping through
for (var i = 0; i < grades.length; i++) {
    div.innerHTML +=
      "<i style='background: " + colors[i] + "'></i> " +
      grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
  }
  return div;
};

legend.addTo(myMap)