var url="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Perform a GET request to the query URL
d3.json(url, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place, mag and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + "Mag:"+ feature.properties.mag + "</p>"+"<br><p>"+new Date(feature.properties.time)+"</p></br>");
  };

  function getColor(magnitude) {
    
    if (magnitude>5) {
      return "#0d0887";
    }
    else if (magnitude>4){
      return "#983db3";
    }
    else if (magnitude>3){
      return "#ce3da9";
    }
    else if (magnitude>2){
      return "#ff4d80";
    }
    else if (magnitude>1){
      return "#ff6758";
    }
    else{
      return "#c1dc41";
    }
  }

//function that will determine radius
function chooseRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }

    return magnitude * 10;
  }

  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng,{
        radius: chooseRadius(feature.properties.mag),
        color: getColor(feature.properties.mag),
        fillOpacity: 0.8
      });
    },
    onEachFeature: onEachFeature
  });

  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };
  var myMap = L.map("map", {
    center: [36.44, -119.46],
    zoom: 8
  });

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  function getColor(d) {
    return d === 5  ? '#983db3' :
           d === 4  ? '#ce3da9' :
           d === 3 ? '#ff4d80' :
           d === 2 ? '#ff6758':
           d ===1 ? '#c1dc41':
                    "#0d0887"
} 
// Add legend to the map
  var legend = L.control({position: 'bottomright'});
  
  legend.onAdd = function (map) {
  
      var div = L.DomUtil.create('div', 'info legend'),
          mags = [0, 1, 2, 3, 4, 5]
          
      for (var i = 0; i < mags.length; i++) {
          div.innerHTML +=
              '<i style="background:' +getColor(mags[i] + 1) + '"></i> ' +
              mags[i] + (mags[i + 1] ? '&ndash;' + mags[i + 1] + '<br>' : '+');
      }
  
      return div;
  };
  
  legend.addTo(myMap);


}

