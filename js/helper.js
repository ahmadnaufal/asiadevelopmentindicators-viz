var obj = {};
var indicator_codes = ["AG.LND.TOTL.K2", "EN.POP.DNST", "SP.ADO.TFRT", "SP.DYN.AMRT.FE", "SP.DYN.AMRT.MA", "SP.DYN.CBRT.IN", "SP.DYN.CDRT.IN", "SP.DYN.LE00.FE.IN", "SP.DYN.LE00.IN", "SP.DYN.LE00.MA.IN", "SP.DYN.TFRT.IN", "SP.DYN.TO65.FE.ZS", "SP.DYN.TO65.MA.ZS", "SP.POP.0014.TO.ZS", "SP.POP.65UP.TO.ZS", "SP.POP.1564.TO.ZS", "SP.POP.GROW", "SP.POP.TOTL", "SP.POP.TOTL.FE.ZS"]; // instantiated with all country codes

var load_file = function(directory) {
    obj = {};
    var max = [9000000,20000,200,300,500,50,12,100,100,100,10,100,100,50,30,100,20,2000000000, 100]
    var min = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-10,200000,0];
    for (var idx = 0; idx < indicator_codes.length; idx++) {
        var indicator_code = indicator_codes[idx];
        var indicator_file = directory + "/" + indicator_codes[idx] + ".csv";
        
        $.ajax({
            url: indicator_file,
            context: {
                code : indicator_code,
                curr_idx : idx
            },
            success: function(data) {
                try {
                    var csv_processed = $.csv.toArrays(data);
                    var first_idx = 1;
                    var column_headers = csv_processed[0];

                    var indicator_obj = [];

                    // the first row defines the csv header column names
                    for (var i = first_idx; i < csv_processed.length; ++i) {
                        // get the year
                        var cur_year = csv_processed[i][0];
                        var values_in_year = [];

                        // get all values and columns
                        for (var j = first_idx; j < csv_processed[i].length; ++j) {
                            var country_name = column_headers[j];
                            var indicator_value = csv_processed[i][j];
                            values_in_year.push({
                                name : country_name,
                                id : map_country_name_to_codes(country_name),
                                value : indicator_value
                            });
                        }
                        var obj_per_year = {};
                        obj_per_year['year'] = cur_year;
                        obj_per_year['values'] = values_in_year;
                        obj_per_year['max'] = max[this.curr_idx];
                        obj_per_year['min'] = min[this.curr_idx];

                        // push the results from the year
                        // to the main major results
                        indicator_obj.push(obj_per_year);
                    }

                    // append the result
                    obj[this.code] = indicator_obj;

                } catch (err) {
                    console.log(indicator_file + " : " + err);
                }
            },
            error: function(err) {
                alert(err);
            },
            dataType: 'text'
        });        
    }
}

var get_data_indicator_year = function(indicator_code, year) {
    // indicator parameters are codes
    var new_obj = obj[indicator_code];

    var year_value = [];
    for (var i = 0; i < new_obj.length; i++) {
        if (new_obj[i]['year'] == year) {
            year_value = new_obj[i]['values'];
            break;
        }
    }

    return year_value;
}

var get_data_trend_indicator = function(indicator_code, country_code) {
    var new_obj = obj[indicator_code];

    var nation_values = [];
    for (var i = 0; i < new_obj.length; i++) {
        var year = new_obj[i]['year'];
        var new_value;
        for (var j = 0; j < new_obj[i]['values'].length; j++) {
            if (new_obj[i]['values'][j]['id'] == country_code) {
                new_value = new_obj[i]['values'][j]['value'];
                break;
            }
        }

        nation_values.push({
            x: year,
            value: new_value
        });
    }

    return nation_values;
}

var get_max_indicator = function(indicator_code) {
    return obj[indicator_code][0].max;
}

var get_min_indicator = function(indicator_code) {
    return obj[indicator_code][0].min;
}

var get_country_indicator_data = function(country_code, indicator_code) {
    // indicator parameters are codes
    var new_obj = obj[indicator_code];

    // container to append the results
    var res = [];

    for (var i = 0; i < new_obj.length; i++) {
        var cur_year = new_obj[i]['year'];
        for (var j = 0; j < new_obj[i]['values'].length; j++) {
            if (new_obj[i]['values'][j]['id'] == country_code) {
                var value = new_obj[i]['values'][j].value;
                break;
            }
        }

        // append the result to the container
        res.push({
            year : cur_year,
            value : value
        });
    }

    return res;
}

var map_country_name_to_codes = function(country_name) {
    var country_code = "";

    for (var k in country_code_to_name_map) {
        if (country_code_to_name_map[k] == country_name.toLowerCase()) {
            country_code = k;
        }
    }

    return country_code;
}

var country_code_to_name_map = {
    "AF" : "afghanistan",
    "AM" : "armenia",
    "AZ" : "azerbaijan",
    "BH" : "bahrain",
    "BD" : "bangladesh",
    "BT" : "bhutan",
    "BN" : "brunei darussalam",
    "KH" : "cambodia",
    "CN" : "china",
    "GE" : "georgia",
    "HK" : "hong kong sar, china",
    "IN" : "india",
    "ID" : "indonesia",
    "IR" : "iran, islamic rep.",
    "IQ" : "iraq",
    "IL" : "israel",
    "JP" : "japan",
    "JO" : "jordan",
    "KZ" : "kazakhstan",
    "KP" : "korea, dem. rep.",
    "KR" : "korea, rep.",
    "KW" : "kuwait",
    "KG" : "kyrgyz republic",
    "LA" : "lao pdr",
    "LB" : "lebanon",
    "MO" : "macao sar, china",
    "MY" : "malaysia",
    "MV" : "maldives",
    "MN" : "mongolia",
    "MM" : "myanmar",
    "NP" : "nepal",
    "OM" : "oman",
    "PK" : "pakistan",
    "PH" : "philippines",
    "QA" : "qatar",
    "SA" : "saudi arabia",
    "SG" : "singapore",
    "LK" : "sri lanka",
    "SY" : "syrian arab republic",
    "TJ" : "tajikistan",
    "TH" : "thailand",
    "TR" : "turkey",
    "TM" : "turkmenistan",
    "AE" : "united arab emirates",
    "UZ" : "uzbekistan",
    "VN" : "vietnam",
    "YE" : "yemen, rep."
};
var indicator_code_to_desc = {
    "SP.ADO.TFRT" : "Shows the burden of fertility on young women.",
    "SP.DYN.CBRT.IN" : "Shows the number of live births per thousand of population per year.",
    "SP.DYN.CDRT.IN" : "Shows the ratio of deaths to the population of a particular area",
    "SP.DYN.TFRT.IN" : "Shows average number of children that would be born to a woman over her lifetime",
    "SP.DYN.LE00.FE.IN" : "Measure of the average time a female is expected to live",
    "SP.DYN.LE00.MA.IN" : "Measure of the average time a male is expected to live",
    "SP.DYN.LE00.IN" : "Measure of the average time a people is expected to live",
    "SP.DYN.AMRT.FE" : "Measure of the number of deaths for adult female",
    "SP.DYN.AMRT.MA" : "Measure of the number of deaths for adult male",
    "SP.POP.65UP.TO.ZS" : "Shows the proportion of people in certain age range (> 65) on the total population of the country.",
    "SP.POP.GROW" : "Population growth is the increase in the number of individuals in a population. The growth calculated in this chart is the annual growth of each countries.",
    "SP.POP.0014.TO.ZS" : "Shows the proportion of people in certain age range (0-14) on the total population of the country.",
    "SP.POP.1564.TO.ZS" : "Shows the proportion of people in certain age range (15-64) on the total population of the country.",
    "SP.POP.TOTL.FE.ZS" : "Shows the proportion of the female population on the total population of the country.",
    "SP.POP.TOTL" : "The total population of the country.",
    "SP.DYN.TO65.FE.ZS" : "The total of female population which reaches the age 65 compared to their peers who were born at the same year.",
    "SP.DYN.TO65.MA.ZS" : "The total of male population which reaches the age 65 compared to their peers who were born at the same year.",
    "AG.LND.TOTL.K2" : "The aggregate of all land within international boundaries and coastlines, excluding water area.",
    "EN.POP.DNST" : "A measurement of population per unit area or unit volume, in this case, of the land area",
};

var indicator_code_to_name_map = {
    "SP.ADO.TFRT" : "Adolescent fertility rate (births per 1,000 women ages 15-19)",
    "SP.DYN.CBRT.IN" : "Birth rate, crude (per 1,000 people)",
    "SP.DYN.CDRT.IN" : "Death rate, crude (per 1,000 people)",
    "SP.DYN.TFRT.IN" : "Fertility rate, total (births per woman)",
    "SP.DYN.LE00.FE.IN" : "Life expectancy at birth, female (years)",
    "SP.DYN.LE00.MA.IN" : "Life expectancy at birth, male (years)",
    "SP.DYN.LE00.IN" : "Life expectancy at birth, total (years)",
    "SP.DYN.AMRT.FE" : "Mortality rate, adult, female (per 1,000 female adults)",
    "SP.DYN.AMRT.MA" : "Mortality rate, adult, male (per 1,000 male adults)",
    "SP.POP.65UP.TO.ZS" : "Population ages 65 and above (% of total)",
    "SP.POP.GROW" : "Population growth (annual %)",
    "SP.POP.0014.TO.ZS" : "Population, ages 0-14 (% of total)",
    "SP.POP.1564.TO.ZS" : "Population, ages 15-64 (% of total)",
    "SP.POP.TOTL.FE.ZS" : "Population, female (% of total)",
    "SP.POP.TOTL" : "Population, total",
    "SP.DYN.TO65.FE.ZS" : "Survival to age 65, female (% of cohort)",
    "SP.DYN.TO65.MA.ZS" : "Survival to age 65, male (% of cohort)",
    "AG.LND.TOTL.K2" : "Land area (sq. km)",
    "EN.POP.DNST" : "Population density (people per sq. km of land area)",
};
