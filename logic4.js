// // Function to determine marker size based on population
function markerSize(earthquake_size) {
    return Math.pow((earthquake_size *100.5),2);
  }
  
function createMap(magnitudes, earthquakes) {
  
    // Define streetmap and darkmap layers
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
      "access_token=pk.eyJ1IjoiY2thcm5hcyIsImEiOiJjamh4aHJzcXgwYndpM3dydmV6aHNtNXdqIn0.LkWE7jBeB8nZmUqZNLgLvg");
  
    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/ctopham/cjis5dcbs1rre2so1wae9r4ei/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiY3RvcGhhbSIsImEiOiJjamh4aHJ4amgwYnhiM3FtcTNrNnhyMHZ3In0.A5V1_2ns65IgvuxqNHvDgQ");
  
    // Define a baseMaps object to hold our base layers
    var baseMaps = {
      "Street Map": streetmap,
      "Plate Boundaries": darkmap
    };
  
  
    // Create overlay object to hold our overlay layer
    var overlayMaps = {
      Magnitudes: magnitudes,
      Earthquakes: earthquakes,
    };
    console.log("++++++++++++++++")
    console.log(overlayMaps.Earthquakes)
    console.log(overlayMaps.Magnitudes)
    
    console.log("++++++++++++++")

    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map", {
      center: [
        37.09, -15.71
      ],
      zoom: 2,
      layers: [streetmap, magnitudes,earthquakes]
    });
    
  
    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
  }
  var sizeMarkers = [];
  
  function createFeatures(earthquakeData) {
  
    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature, layer) {
  
      layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  
        var two_coords =[]
        two_coords.push(feature.geometry.coordinates[1]); 
        two_coords.push(feature.geometry.coordinates[0]); 
        console.log(feature.properties.mag);
  
          sizeMarkers.push(
          L.circle(two_coords, {
            color: 'red',
            stroke: false,
            fillColor: '#f03',
            fillOpacity: (.20),
            radius: markerSize(feature.properties.mag)
          })
        );
    }

    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: onEachFeature
    });
    var magnitudes = L.layerGroup(sizeMarkers);
  
    // Sending our earthquakes layer to the createMap function
    createMap(magnitudes,earthquakes);
    //console.log(sizeMarkers)
}
  // Store our API endpoint inside queryUrl
  var queryUrl="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson";

  // Perform a GET request to the query URL
  d3.json(queryUrl, function(data) {
    // Once we get a response, send the data.features object to the createFeatures function

    createFeatures(data.features);
    
  });