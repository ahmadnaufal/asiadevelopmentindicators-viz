function onReady(callback) {
    var intervalID = window.setInterval(checkReady, 1000);
    function checkReady() {
        var count = 0;
        for (var k in obj) {
            ++count;
        }

        // the number of indicators is 19,
        // so we wait until all indicators data are loaded
        if (count == 19) {
            console.log("READY!");
            window.clearInterval(intervalID);
            callback.call(this);
        }
    }
}

window.onload = function() {
    var data_dir = "data";
    load_file("data");  // call function to load data
};

onReady(function() {
    var indicator_code = "EN.POP.DNST";
    anychart.onDocumentReady(function () {
        map = anychart.map();

        map.title().enabled(true).padding([10, 0, 10, 0]).useHtml(true).text(
                indicator_code_to_name_map[indicator_code] + '<br/><span  style="color:#929292; font-size: 12px;">(Data source: Kaggle, 2015)</span>');

        map.geoData(anychart.maps.world);
        map.interactivity().selectionMode(false);
        map.padding(0);

        // The data used in this sample can be obtained from the CDN
        // http://cdn.anychart.com/samples-data/maps-general-features/world-choropleth-map/data.js
        var dataSet = anychart.data.set(get_data_indicator_year(indicator_code, '2003'));
        var density_data = dataSet.mapAs(undefined, {'value': 'value'});
        var series = map.choropleth(density_data);

        series.hoverFill('#f48fb1');
        series.hoverStroke(anychart.color.darken('#f48fb1'));
        series.selectFill('#c2185b');
        series.selectStroke(anychart.color.darken('#c2185b'));
        series.labels().enabled(false);
        series.tooltip().textWrap('byLetter').useHtml(true);

        var scale = anychart.scales.ordinalColor([
            {less: 10},
            {from: 10, to: 30},
            {from: 30, to: 50},
            {from: 50, to: 100},
            {from: 100, to: 200},
            {from: 200, to: 300},
            {from: 300, to: 500},
            {from: 500, to: 1000},
            {greater: 1000}
        ]);
        scale.colors(['#81d4fa', '#4fc3f7', '#29b6f6', '#039be5', '#0288d1', '#0277bd', '#01579b', '#014377', '#000000']);


        var colorRange = map.colorRange();
        colorRange.enabled(true).padding([0, 0, 20, 0]);
        colorRange.ticks().stroke('3 #ffffff').position('center').length(7).enabled(true);
        colorRange.colorLineSize(5);
        colorRange.marker().size(7);
        colorRange.labels().fontSize(11).padding(3, 0, 0, 0).format(function () {
            var range = this.colorRange;
            var name;
            if (isFinite(range.start + range.end)) {
                name = range.start + ' - ' + range.end;
            } else if (isFinite(range.start)) {
                name = 'More than ' + range.start;
            } else {
                name = 'Less than ' + range.end;
            }
            return name
        });

        series.colorScale(scale);

        // create zoom controls
        var zoomController = anychart.ui.zoom();
        zoomController.render(map);

        map.container('container');
        map.draw();
    });
    
});