var obj = {};

var load_file = function(directory) {
    var indicator_codes = []; // instantiated with all country codes

    obj = {};

    for (var idx = 0; idx < filenames.length; idx++) {
        var indicator_file = directory + "/" + indicator_codes[idx] + ".csv";

        $.ajax({
            url: indicator_file,
            success: function(data) {
                var csv_processed = $.csv.toArray(data);
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

                    // push the results from the year
                    // to the main major results
                    indicator_obj.push(obj_per_year);
                }

                obj[indicator_codes[idx]] = indicator_obj;
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

var map_country_name_to_codes = function(country_name) {
	var country_code = "";

	// long switch cases
	
	return country_code;
}

var map_indicator_code_to_name = function(indicator_code) {
    var indicator_name = "";

    // long switch cases
    
    return indicator_name;
}