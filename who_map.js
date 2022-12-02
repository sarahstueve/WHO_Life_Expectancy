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
    setScale(selectedVar);
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
    }).addTo(map);
}

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
                .range([0, 1]);
        colorScale = function(num) {
            return d3.interpolateInferno(temp(num));
        }
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

// this is where you would do the button loading
// in this function do for loop 
// for (let i =0 ;i < 20 ;i++)
// use number in text of button, but also as the value
// set the .onclick function to be setSelected year
// use d3 to append the button to the #year footer

let setSelectedVar = function(e) {
    selectedVar = e.target.value;
    setScale(selectedVar);
    drawMap();
}

let setSelectedYear = function(e) {
    year = e.target.value;
    selectGeoFile(year);
    drawMap();
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