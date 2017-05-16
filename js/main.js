var asia_map = null;

function onReady(callback) {
    var intervalID = window.setInterval(checkReady, 1000);
    function checkReady() {
        var count = 0;
        for (var k in obj) {
            ++count;
        }

        // the number of indicators is 19,
        // so we wait until all indicators data are loaded
        if (count == 19 && asia_map != null) {
            window.clearInterval(intervalID);
            callback.call(this);
        }
    }
}

function loadJSON(callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'js/asia.geojson', true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
    };
    xobj.send(null);  
}

window.onload = function() {
    var data_dir = "data";
    load_file("data");  // call function to load data
    loadJSON(function(response) {
        asia_map = JSON.parse(response);
    });
};

function appendIndicatorOptions() {
    for (var key in obj) {
        $("#indicator_selector").append($('<option>', {
            value: key,
            text: indicator_code_to_name_map[key]
        }));
    }
}

function appendYearPerIndicator(indicator_code) {
    var new_obj = obj[indicator_code];
    $("#year_selector").html('');

    for (var i = 0; i < new_obj.length; ++i) {
        $("#year_selector").append($('<option>', {
            value: new_obj[i]['year'],
            text: new_obj[i]['year']
        }));
    }
}

var updateMap = function(indicator_code, year) {

    map = anychart.map();
    map.geoData(asia_map);
    map.interactivity().selectionMode(false);
    map.padding(0);

    map.title().enabled(true).padding([10, 0, 10, 0]).useHtml(true).text(
            indicator_code_to_name_map[indicator_code] + '<br/><span  style="color:#929292; font-size: 12px;">(Data source: Kaggle, 2015)</span>');
    var ds = get_data_indicator_year(indicator_code, year);
    
    var dataSet = anychart.data.set(ds);
    var series = map.choropleth(dataSet);

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
        return name;
    });

    series.colorScale(scale);

    $("#container").html('');
    map.container('container');
    map.draw();
}

onReady(function() {

    // initializations
    appendIndicatorOptions();

    var init_selected_indicator = $('#indicator_selector').val();
    appendYearPerIndicator(init_selected_indicator);

    var init_selected_year = $('#year_selector').val();

    // The data used in this sample can be obtained from the CDN
    // http://cdn.anychart.com/samples-data/maps-general-features/world-choropleth-map/data.js
    updateMap(init_selected_indicator, init_selected_year);

    $("#indicator_selector").on('change', function() {
        console.log("Indicator changed!");
        appendYearPerIndicator(this.value);
        var init_selected_year = $('#year_selector').val();

        updateMap(this.value, init_selected_year);
    });

    $("#year_selector").on('change', function() {
        console.log("Year changed!");
        var init_selected_indicator = $('#indicator_selector').val();

        updateMap(init_selected_indicator, this.value);
    });
});