var obj = {};
var indicator_codes = ["AG.LND.TOTL.K2", "EN.POP.DNST", "SP.ADO.TFRT", "SP.DYN.AMRT.FE", "SP.DYN.AMRT.MA", "SP.DYN.CBRT.IN", "SP.DYN.CDRT.IN", "SP.DYN.LE00.FE.IN", "SP.DYN.LE00.IN", "SP.DYN.LE00.MA.IN", "SP.DYN.TFRT.IN", "SP.DYN.TO65.FE.ZS", "SP.DYN.TO65.MA.ZS", "SP.POP.0014.TO.ZS", "SP.POP.65UP.TO.ZS", "SP.POP.1564.TO.ZS", "SP.POP.GROW", "SP.POP.TOTL", "SP.POP.TOTL.FE.ZS"]; // instantiated with all country codes

var load_file = function(directory) {
    obj = {};

    for (var idx = 0; idx < indicator_codes.length; idx++) {
        var indicator_code = indicator_codes[idx];
        var indicator_file = directory + "/" + indicator_codes[idx] + ".csv";

        $.ajax({
            url: indicator_file,
            context: {
                code : indicator_code
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

    console.log(obj);
    console.log(new_obj);

    var year_value = [];
    for (var i = 0; i < new_obj.length; i++) {
        if (new_obj[i]['year'] == year) {
            year_value = new_obj[i]['values'];
            break;
        }
    }

    return year_value;
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
    "PH" : "phillipines",
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

var indicator_code_to_name_map = {
    "SP.ADO.TFRT" : "Adolescent fertility rate (births per 1,000 women ages 15-19)",
    "SP.POP.DPND" : "Age dependency ratio (% of working-age population)",
    "SP.POP.DPND.OL" : "Age dependency ratio, old (% of working-age population)",
    "SP.POP.DPND.YG" : "Age dependency ratio, young (% of working-age population)",
    "SP.DYN.CBRT.IN" : "Birth rate, crude (per 1,000 people)",
    "EN.ATM.CO2E.KT" : "CO2 emissions (kt)",
    "EN.ATM.CO2E.PC" : "CO2 emissions (metric tons per capita)",
    "EN.ATM.CO2E.GF.ZS" : "CO2 emissions from gaseous fuel consumption (% of total)",
    "EN.ATM.CO2E.GF.KT" : "CO2 emissions from gaseous fuel consumption (kt)",
    "EN.ATM.CO2E.LF.ZS" : "CO2 emissions from liquid fuel consumption (% of total)",
    "EN.ATM.CO2E.LF.KT" : "CO2 emissions from liquid fuel consumption (kt)",
    "EN.ATM.CO2E.SF.ZS" : "CO2 emissions from solid fuel consumption (% of total)",
    "EN.ATM.CO2E.SF.KT" : "CO2 emissions from solid fuel consumption (kt)",
    "SP.DYN.CDRT.IN" : "Death rate, crude (per 1,000 people)",
    "SP.DYN.TFRT.IN" : "Fertility rate, total (births per woman)",
    "IT.MLT.MAIN" : "Fixed telephone subscriptions",
    "IT.MLT.MAIN.P2" : "Fixed telephone subscriptions (per 100 people)",
    "SP.DYN.LE00.FE.IN" : "Life expectancy at birth, female (years)",
    "SP.DYN.LE00.MA.IN" : "Life expectancy at birth, male (years)",
    "SP.DYN.LE00.IN" : "Life expectancy at birth, total (years)",
    "TX.VAL.MRCH.CD.WT" : "Merchandise exports (current US$)",
    "TM.VAL.MRCH.CD.WT" : "Merchandise imports (current US$)",
    "IT.CEL.SETS" : "Mobile cellular subscriptions",
    "IT.CEL.SETS.P2" : "Mobile cellular subscriptions (per 100 people)",
    "SP.DYN.AMRT.FE" : "Mortality rate, adult, female (per 1,000 female adults)",
    "SP.DYN.AMRT.MA" : "Mortality rate, adult, male (per 1,000 male adults)",
    "SP.POP.65UP.TO.ZS" : "Population ages 65 and above (% of total)",
    "SP.POP.GROW" : "Population growth (annual %)",
    "SP.POP.0014.TO.ZS" : "Population, ages 0-14 (% of total)",
    "SP.POP.1564.TO.ZS" : "Population, ages 15-64 (% of total)",
    "SP.POP.TOTL.FE.ZS" : "Population, female (% of total)",
    "SP.POP.TOTL" : "Population, total",
    "SP.RUR.TOTL" : "Rural population",
    "SP.RUR.TOTL.ZS" : "Rural population (% of total population)",
    "SP.DYN.TO65.FE.ZS" : "Survival to age 65, female (% of cohort)",
    "SP.DYN.TO65.MA.ZS" : "Survival to age 65, male (% of cohort)",
    "SP.URB.TOTL" : "Urban population",
    "SP.URB.TOTL.IN.ZS" : "Urban population (% of total)",
    "SP.URB.GROW" : "Urban population growth (annual %)",
    "AG.PRD.CROP.XD" : "Crop production index (2004-2006 = 100)",
    "AG.PRD.FOOD.XD" : "Food production index (2004-2006 = 100)",
    "AG.LND.TOTL.K2" : "Land area (sq. km)",
    "AG.PRD.LVSK.XD" : "Livestock production index (2004-2006 = 100)",
    "EN.POP.DNST" : "Population density (people per sq. km of land area)",
    "AG.SRF.TOTL.K2" : "Surface area (sq. km)",
    "NY.ADJ.DCO2.CD" : "Adjusted savings: carbon dioxide damage (current US$)",
    "NY.ADJ.DMIN.CD" : "Adjusted savings: mineral depletion (current US$)",
    "SE.SEC.AGES" : "Official entrance age to lower secondary education (years)",
    "SE.PRM.AGES" : "Official entrance age to primary education (years)",
    "SE.PRM.DURS" : "Theoretical duration of primary education (years)",
    "SE.SEC.DURS" : "Theoretical duration of secondary education (years)",
    "TX.VAL.MRCH.XD.WD" : "Export value index (2000 = 100)",
    "TM.VAL.MRCH.XD.WD" : "Import value index (2000 = 100)",
    "SH.TBS.INCD" : "Incidence of tuberculosis (per 100,000 people)",
    "IT.NET.USER.P2" : "Internet users (per 100 people)",
    "SL.TLF.ACTI.1524.FE.ZS" : "Labor force participation rate for ages 15-24, female (%) (modeled ILO estimate)",
    "SL.TLF.ACTI.1524.MA.ZS" : "Labor force participation rate for ages 15-24, male (%) (modeled ILO estimate)",
    "SL.TLF.ACTI.1524.ZS" : "Labor force participation rate for ages 15-24, total (%) (modeled ILO estimate)",
    "SL.TLF.CACT.FE.ZS" : "Labor force participation rate, female (% of female population ages 15+) (modeled ILO estimate)",
    "SL.TLF.ACTI.FE.ZS" : "Labor force participation rate, female (% of female population ages 15-64) (modeled ILO estimate)",
    "SL.TLF.CACT.MA.ZS" : "Labor force participation rate, male (% of male population ages 15+) (modeled ILO estimate)",
    "SL.TLF.ACTI.MA.ZS" : "Labor force participation rate, male (% of male population ages 15-64) (modeled ILO estimate)",
    "SL.TLF.CACT.ZS" : "Labor force participation rate, total (% of total population ages 15+) (modeled ILO estimate)",
    "SL.TLF.ACTI.ZS" : "Labor force participation rate, total (% of total population ages 15-64) (modeled ILO estimate)",
    "SL.TLF.TOTL.FE.ZS" : "Labor force, female (% of total labor force)",
    "SL.TLF.TOTL.IN" : "Labor force, total",
    "SL.TLF.CACT.FM.ZS" : "Ratio of female to male labor force participation rate (%) (modeled ILO estimate)",
    "SH.TBS.DTEC.ZS" : "Tuberculosis case detection rate (%, all forms)",
    "SL.EMP.TOTL.SP.FE.ZS" : "Employment to population ratio, 15+, female (%) (modeled ILO estimate)",
    "SL.EMP.TOTL.SP.MA.ZS" : "Employment to population ratio, 15+, male (%) (modeled ILO estimate)",
    "SL.EMP.TOTL.SP.ZS" : "Employment to population ratio, 15+, total (%) (modeled ILO estimate)",
    "SL.EMP.1524.SP.FE.ZS" : "Employment to population ratio, ages 15-24, female (%) (modeled ILO estimate)",
    "SL.EMP.1524.SP.MA.ZS" : "Employment to population ratio, ages 15-24, male (%) (modeled ILO estimate)",
    "SL.EMP.1524.SP.ZS" : "Employment to population ratio, ages 15-24, total (%) (modeled ILO estimate)",
    "SL.UEM.TOTL.FE.ZS" : "Unemployment, female (% of female labor force)",
    "SL.UEM.TOTL.MA.ZS" : "Unemployment, male (% of male labor force)",
    "SL.UEM.TOTL.ZS" : "Unemployment, total (% of total labor force)",
    "SL.UEM.1524.FE.ZS" : "Unemployment, youth female (% of female labor force ages 15-24) (modeled ILO estimate)",
    "SL.UEM.1524.MA.ZS" : "Unemployment, youth male (% of male labor force ages 15-24) (modeled ILO estimate)",
    "SL.UEM.1524.ZS" : "Unemployment, youth total (% of total labor force ages 15-24) (modeled ILO estimate)",
    "SH.TBS.CURE.ZS" : "Tuberculosis treatment success rate (% of new cases)",
    "TX.QTY.MRCH.XD.WD" : "Export volume index (2000 = 100)",
    "TM.QTY.MRCH.XD.WD" : "Import volume index (2000 = 100)",
    "TT.PRI.MRCH.XD.WD" : "Net barter terms of trade index (2000 = 100)",
    "BX.KLT.DINV.CD.WD" : "Foreign direct investment, net inflows (BoP, current US$)",
    "SM.POP.REFG.OR" : "Refugee population by country or territory of origin",
    "NY.ADJ.DNGY.CD" : "Adjusted savings: energy depletion (current US$)"
};
