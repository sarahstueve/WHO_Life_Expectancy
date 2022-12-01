window.addEventListener('load', function() {
    let data = selectGeoFile(2000);
    populateSelect(data);

});

let populateSelect = function(data) {
    let options = data.features[0].properties
    let select = d3.select('#color-select')
        .attr("onchange", d => "changeMap()")
        .selectAll("dropOptions")
            .data(options)
            .join(
                enter => enter.append(option)
                    .text(d => d)
                    .attr("value", d => d)
            );
}

let selectGeoFile = function(year) {
    return fetch('data/geojson/life_expect_country_' + year + '.json')
            .then((response) => response.json());
    // let reader = new FileReader();
    // reader.onload = receivedText;
    // let data = reader.readAsText(new File('data/geojson/life_expect_country_' + year + '.json'));
    // return data;

    // function receivedText(e){
    //     let lines = e.target.result;
    //     let geo = JSON.parse(lines);
    // }
}