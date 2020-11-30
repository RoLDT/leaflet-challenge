var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
var tectonicPlateUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

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
    
    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 10,
        id: "dark-v10",
        accessToken: API_KEY
      });
    
    var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/satellite-streets-v11",
        accessToken: API_KEY
      });

    var baseMaps = {
        "Dark": darkmap,
        "Light": lightmap,
        "Satellite": satellite
    };

    var tectonicplates = new L.LayerGroup();

    d3.json(tectonicPlateUrl, function(data){
        L.geoJSON(data, {
            color: "orange",
            weight: 3
        }).addTo(tectonicplates);
    });


    var overlayMaps = {
        "Earthquakes": earthquakes,
        "Tectonic Plates": tectonicplates
    };

    var myMap = L.map("map", {
        center: [
            0, -0
        ],
        zoom: 2.2,
        layers: [darkmap,earthquakes, tectonicplates]
    });

    L.control.layers(baseMaps, overlayMaps,{
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
        var div = L.DomUtil.create("div", "legend"),
        magnitudes = [0,1,2,3,4,5];
        
        var legendInfo = "<h2>Magnitudes</h2>" +
        "<p class='mag5'>Magnitude 5+</p>" +
        "<p class='mag4'>Magnitude 4-5</p>" +
        "<p class='mag3'>Magnitude 3-4</p>" +
        "<p class='mag2'>Magnitude 2-3</p>" +
        "<p class='mag1'>Magnitude 1-2</p>";

        div.innerHTML = legendInfo;

        return div

    };

    legend.addTo(myMap);
}


