var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson"

d3.json(queryUrl, function(data) {
    createFeatures(data.features);
    console.log(data.features);
    //each feature was read correctly.
});

function createFeatures(earthquakeData) {
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h2>Magnitude: "+ feature.properties.mag +"</h2><hr>" + "<h3>Where: " + feature.properties.place +
        "</h3><hr><p>When: " + new Date(feature.properties.time) + "</p>");
    }

    var earthquakes = L.geoJSON(earthquakeData, {
        //Needed to be called "OnEachFeature" and not anything else as I had it before.
        onEachFeature: onEachFeature
    });

    createMap(earthquakes);
}

function createMap(earthquakes) {
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 10,
        id: "light-v10",
        accessToken: API_KEY
      });

      var overlayMaps = {
        Earthquakes: earthquakes
    };

    var myMap = L.map("map", {
        center: [
            0, -0
        ],
        zoom: 2.2,
        layers: [lightmap,earthquakes]
    });

    L.control.layers("", overlayMaps,{
        collapsed: false
    }).addTo(myMap);
}


