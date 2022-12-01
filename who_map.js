window.addEventListener('load', async function() {
    let data = await selectGeoFile(2000);
    populateSelect(data);

});

let populateSelect = function(data) {
    let options = data.features[0].properties
    let select = d3.select('#color-select')
        .attr("onchange", d => "changeMap()")
        .selectAll("dropOptions")
            .data(options)
            .join(
                enter => enter.append("option")
                    .text(d => d)
                    .attr("value", d => d)
            );
}

let selectGeoFile = async function(year) {
    return await fetch('data/geo_json/life_expect_country_' + year + '.json')
            .then((response) => response.json());
}