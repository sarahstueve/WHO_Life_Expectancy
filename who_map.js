import {Legend} from "./legend.js";

let data;
let colorScale;
let lastGeoLayer;
let selectedVar = "status";
let year = 2000;
let map;

window.addEventListener('load', async function() {
    // set select values using 2000 as initial year
    await selectGeoFile(year);
    // populate select
    populateSelect(data);
    loadButtons();
    setScale(selectedVar);
    updateLegend();
    map = L.map("map").setView([51.505, -0.09], 1);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
            '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map);
    drawMap();

});

let drawMap = function() {
    console.log("drawing map");
    
    if (lastGeoLayer){
        lastGeoLayer.remove();
    }
    lastGeoLayer = L.geoJSON(data, {
        style: function (feature) {
            return {
                color: colorScale(feature.properties[selectedVar]),
            };
        },
        onEachFeature: onEachFeature
    }).addTo(map);
    // Legend(colorScale(feature.properties[selectedVar])).addTo(d3.select("body"));
}

// Functions referenced from leaflet tutorial:
// https://leafletjs.com/examples/choropleth/

let highlightFeature = function(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#bcbcbc',
        dashArray: '',
        fillOpacity: 0.5
    });

    layer.bringToFront();

    let props = e.target.feature.properties;
    let prop_name= selectedVar.replace("_", " ")
    layer.bindPopup("<b>" + props.ADMIN + "</b><br/>" +
                     prop_name + ": " + props[selectedVar]).openPopup();
}

let resetHighlight = function(e) {
    lastGeoLayer.resetStyle(e.target);
}

let zoomToFeature = function(e) {
    map.fitBounds(e.target.getBounds());
}

let onEachFeature = function(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature,
    });
    
}

let updateLegend = function() {
    // if (Legend != undefined) {
    let legend = Legend(colorScale, d3.interpolateInferno);
    let legendDiv = d3.select("#legend");
    let child = legendDiv.select("svg");
    if (child) {
        child.remove();
    }
    legendDiv.node().append(legend);
    // }else{
    //     console.log("wait");
    // }
}
//////////////////////////////////////////////



let setScale = function(selectVar) {
    console.log(data)
    let varData =  [...new Set(data.features.map(o => o.properties[selectVar]))];
    if (/status/.test(selectVar)){
        colorScale = d3.scaleOrdinal()
            .domain(varData)
            .range(d3.schemeCategory10);
    }else{
        let temp = d3.scaleLinear()
                .domain(d3.extent(varData))
                .range(['teal', 'purple']);
        // colorScale = function(num) {
        //     return d3.interpolateInferno(temp(num));
        // }
        colorScale = temp;
    }
}

let populateSelect = function(data) {
    /*
    This function populates the select that allows users to choose which
    variable to visualize.
    Parameter(s): 
        :data: an Object
    Returns:
        Null
    */
    console.log("in populateSelect");
    let options = data.features[0].properties;
    let select = d3.select('#color-select');
    for (let option in options) {
        if (!/ISO_A2|ADMIN|ISO_A3/.test(option)){
            select.append("option").text(option).attr("value", option);
        } 
    }
    select.node().onchange = setSelectedVar;
}

let loadButtons = function() {
    let select = d3.select('#year-footer')
    for (let i = 0; i < 16; i++) {
        select.append("button")
            .text(2000 + i)
            .attr("value", 2000 + i);

    }
    select.node().onclick = setSelectedYear;
}

let setSelectedVar = function(e) {
    selectedVar = e.target.value;
    setScale(selectedVar);
    drawMap();
    updateLegend();
}

let setSelectedYear = function(e) {
    year = e.target.value;
    selectGeoFile(year);
    drawMap();
    updateLegend();
}

let selectGeoFile = async function(year) {
    /*
    This function reads in a json file based on a year of interest.
    Parameter(s):
        :year: int
    Returns:
        An object
    */
    data = await fetch('data/geo_json/life_expect_country_' + year + '.json')
            .then((response) => response.json());
}