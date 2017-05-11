var load_file = function(indicator, year) {
	var indicator_file = indicator + ".csv"

    $.ajax({
        url: 'test.csv',
        success: function(data) {
            var csv_processed = $.csv.toArray(data);
            var first_idx = 1;
            var values_in_year = []
            var selected_idx = -1;
            var column_headers = csv_processed[0];
            
            // the first row defines the csv header column names
            for (var i = first_idx; i < csv_processed.length; ++i) {
            	if (csv_processed[i][0] == year) {
            		selected_idx = i;
            		break;
            	}
            }

            // get all values and columns
            for (var i = first_idx; i < csv_processed[selected_idx].length; ++i) {
            	var country_name = column_headers[i];
            	var indicator_value = csv_processed[selected_idx][i];
            	values_in_year.push({
            		name : country_name,
            		id : map_country_name_to_codes(country_name),
            		value : indicator_value
            	});           	
            }

            // set the results in the web page
        },
        error: function(err) {
        	alert(err);
        },
        dataType: 'text'
    });
}

var map_country_name_to_codes = function(country_name) {
	var country_code = "";

	// long switch cases
	
	return country_code;
}