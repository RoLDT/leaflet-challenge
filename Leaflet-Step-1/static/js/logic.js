var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

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

    //Establish the radius and color functions before creating the earthquakes map.
    function circleRadius(mag){
        return mag * 50000;
    }

    function circleColor(mag){
        if (mag >= 5) {
            return "#FF0000";//red
        }
        else if (mag >= 4){
            return "#FF8C00";//darkorange
        }
        else if (mag >= 3){
            return "#FFD700";//gold"#FFFF00"
        }
        else if (mag >= 2){
            return "#FFFF00";//yellow
        }
        else if (mag >= 1){
            return "#32CD32";//limegreen
        }
        else {
            return "#7CFC00";//lawngreen
        }
    }

    var earthquakes = L.geoJSON(earthquakeData, {
        //Use "pointToLayer" to turn markers into circles by adding a circle layer to the earthquake map.
        pointToLayer: function(earthquakeData, latlng){
            return L.circle(latlng, {
                radius: circleRadius(earthquakeData.properties.mag),
                fillColor: circleColor(earthquakeData.properties.mag),
                color: "white",
                stroke: .1,
                fillOpacity: .8
            });
        },
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

    function legendColor(x){
        if (x >= 5) {
            return "#FF0000";//red
        }
        else if (x >= 4){
            return "#FF8C00";//darkorange
        }
        else if (x >= 3){
            return "#FFD700";//gold"#FFFF00"
        }
        else if (x >= 2){
            return "#FFFF00";//yellow
        }
        else if (x >= 1){
            return "#32CD32";//limegreen
        }
        else {
            return "#7CFC00";//lawngreen
        }
    }

    
    var legend = L.control({position: "bottomright"});

    legend.onAdd = function(){
        var div = L.DomUtil.create("div", "info legend"),
        magnitudes = [0,1,2,3,4,5],
        
    

    }
}


