(function () {
    var fixtures = {
        dedupe: {
            "title": "DEDUPLICATION Demoland",
            "headers": [{
                "name": "oulevel2_name",
                "column": "oulevel2_name",
                "type": "java.lang.String",
                "hidden": false,
                "meta": false
            }, {
                "name": "oulevel3_name",
                "column": "oulevel3_name",
                "type": "java.lang.String",
                "hidden": false,
                "meta": false
            }, {
                "name": "oulevel4_name",
                "column": "oulevel4_name",
                "type": "java.lang.String",
                "hidden": false,
                "meta": false
            }, {
                "name": "oulevel5_name",
                "column": "oulevel5_name",
                "type": "java.lang.String",
                "hidden": false,
                "meta": false
            }, {
                "name": "orgunit_name",
                "column": "orgunit_name",
                "type": "java.lang.String",
                "hidden": false,
                "meta": false
            }, {
                "name": "orgunit_level",
                "column": "orgunit_level",
                "type": "java.lang.String",
                "hidden": false,
                "meta": false
            }, {
                "name": "startdate",
                "column": "startdate",
                "type": "java.lang.String",
                "hidden": false,
                "meta": false
            }, {
                "name": "enddate",
                "column": "enddate",
                "type": "java.lang.String",
                "hidden": false,
                "meta": false
            }, {
                "name": "dataelement",
                "column": "dataelement",
                "type": "java.lang.String",
                "hidden": false,
                "meta": false
            }, {
                "name": "disaggregation",
                "column": "disaggregation",
                "type": "java.lang.String",
                "hidden": false,
                "meta": false
            }, {
                "name": "mechanism",
                "column": "mechanism",
                "type": "java.lang.String",
                "hidden": false,
                "meta": false
            }, {
                "name": "partner",
                "column": "partner",
                "type": "java.lang.String",
                "hidden": false,
                "meta": false
            }, {
                "name": "value",
                "column": "value",
                "type": "java.lang.String",
                "hidden": false,
                "meta": false
            }, {
                "name": "duplicate_type",
                "column": "duplicate_type",
                "type": "java.lang.String",
                "hidden": false,
                "meta": false
            }, {
                "name": "duplicate_status",
                "column": "duplicate_status",
                "type": "java.lang.String",
                "hidden": false,
                "meta": false
            }],
            "width": 15,
            "height": 44,
            "rows": [
                ["Animal Region", "Bird District", "Crow Site", "", "Crow Site", "6", "2013-10-01", "2014-09-30", "TX_CURR (N, DSD, Age/Sex Aggregated): Receiving ART", "(15+, Female)", "(00000 De-duplication adjustment)", "", "450", "CONCORDANT", "RESOLVED"],
                ["Animal Region", "Bird District", "Crow Site", "", "Crow Site", "6", "2013-10-01", "2014-09-30", "TX_CURR (N, DSD, Age/Sex Aggregated): Receiving ART", "(15+, Female)", "(9999 Demoland USAID IM)", "Demoland Demoland USAID IP", "450", "CONCORDANT", "RESOLVED"],
                ["Animal Region", "Bird District", "Crow Site", "", "Crow Site", "6", "2013-10-01", "2014-09-30", "TX_CURR (N, DSD, Age/Sex Aggregated): Receiving ART", "(15+, Male)", "(4015 Demoland Peace Corps Noodle IM)", "U.S. Peace Corps", "350", "CONCORDANT", ""],
                ["Animal Region", "Bird District", "Crow Site", "", "Crow Site", "6", "2013-10-01", "2014-09-30", "TX_CURR (N, DSD, Age/Sex Aggregated): Receiving ART", "(15+, Male)", "(9999 Demoland USAID IM)", "Demoland Demoland USAID IP", "350", "CONCORDANT", ""],
                ["Animal Region", "Bird District", "Crow Site", "", "Crow Site", "6", "2013-10-01", "2014-09-30", "TX_CURR (N, DSD): Receiving ART", "(default)", "(4029 Demoland Peace Corps Taffy IM)", "U.S. Peace Corps", "900", "CONCORDANT", ""],
                ["Animal Region", "Bird District", "Crow Site", "", "Crow Site", "6", "2013-10-01", "2014-09-30", "TX_CURR (N, DSD): Receiving ART", "(default)", "(9999 Demoland USAID IM)", "Demoland Demoland USAID IP", "900", "CONCORDANT", ""],
                ["Animal Region", "Bird District", "Hawk Site", "", "Hawk Site", "6", "2013-10-01", "2014-09-30", "TX_CURR (N, DSD, Age/Sex Aggregated): Receiving ART", "(15+, Female)", "(1028 Demoland USAID Dory IM)", "Demoland Dory IP", "600", "CONCORDANT", ""],
                ["Animal Region", "Bird District", "Hawk Site", "", "Hawk Site", "6", "2013-10-01", "2014-09-30", "TX_CURR (N, DSD, Age/Sex Aggregated): Receiving ART", "(15+, Female)", "(3022 Demoland DOD Cherry IM)", "Demoland Cherry IP", "600", "CONCORDANT", ""],
                ["Animal Region", "Bird District", "Hawk Site", "", "Hawk Site", "6", "2013-10-01", "2014-09-30", "TX_CURR (N, DSD, Age/Sex Aggregated): Receiving ART", "(15+, Female)", "(9999 Demoland USAID IM)", "Demoland Demoland USAID IP", "600", "CONCORDANT", ""],
                ["Animal Region", "Bird District", "Hawk Site", "", "Hawk Site", "6", "2013-10-01", "2014-09-30", "TX_CURR (N, DSD, Age/Sex Aggregated): Receiving ART", "(15+, Male)", "(1027 Demoland USAID Carp IM)", "Demoland Carp IP", "455", "CONCORDANT", ""],
                ["Animal Region", "Bird District", "Hawk Site", "", "Hawk Site", "6", "2013-10-01", "2014-09-30", "TX_CURR (N, DSD, Age/Sex Aggregated): Receiving ART", "(15+, Male)", "(4008 Demoland Peace Corps Ravioli IM)", "U.S. Peace Corps", "455", "CONCORDANT", ""],
                ["Animal Region", "Bird District", "Hawk Site", "", "Hawk Site", "6", "2013-10-01", "2014-09-30", "TX_CURR (N, DSD, Age/Sex Aggregated): Receiving ART", "(15+, Male)", "(9999 Demoland USAID IM)", "Demoland Demoland USAID IP", "455", "CONCORDANT", ""],
                ["Animal Region", "Bird District", "Hawk Site", "", "Hawk Site", "6", "2013-10-01", "2014-09-30", "TX_CURR (N, DSD): Receiving ART", "(default)", "(2003 Demoland CDC Dalmatian IM)", "Demoland Dalmatian IP", "1200", "CONCORDANT", ""],
                ["Animal Region", "Bird District", "Hawk Site", "", "Hawk Site", "6", "2013-10-01", "2014-09-30", "TX_CURR (N, DSD): Receiving ART", "(default)", "(2015 Demoland CDC Greyhound IM)", "Demoland Greyhound IP", "1200", "CONCORDANT", ""],
                ["Animal Region", "Bird District", "Hawk Site", "", "Hawk Site", "6", "2013-10-01", "2014-09-30", "TX_CURR (N, DSD): Receiving ART", "(default)", "(9999 Demoland USAID IM)", "Demoland Demoland USAID IP", "1200", "CONCORDANT", ""],
                ["Animal Region", "Bird District", "Ostrich Site", "", "Ostrich Site", "6", "2013-10-01", "2014-09-30", "TX_CURR (N, DSD, Age/Sex Aggregated): Receiving ART", "(15+, Female)", "(3004 Demoland DOD Broccoli IM)", "Demoland Broccoli IP", "150", "CONCORDANT", ""],
                ["Animal Region", "Bird District", "Ostrich Site", "", "Ostrich Site", "6", "2013-10-01", "2014-09-30", "TX_CURR (N, DSD, Age/Sex Aggregated): Receiving ART", "(15+, Female)", "(9999 Demoland USAID IM)", "Demoland Demoland USAID IP", "150", "CONCORDANT", ""],
                ["Animal Region", "Bird District", "Ostrich Site", "", "Ostrich Site", "6", "2013-10-01", "2014-09-30", "TX_CURR (N, DSD, Age/Sex Aggregated): Receiving ART", "(15+, Male)", "(2018 Demoland CDC Beetle IM)", "Demoland Beetle IP", "110", "CONCORDANT", ""],
                ["Animal Region", "Bird District", "Ostrich Site", "", "Ostrich Site", "6", "2013-10-01", "2014-09-30", "TX_CURR (N, DSD, Age/Sex Aggregated): Receiving ART", "(15+, Male)", "(9999 Demoland USAID IM)", "Demoland Demoland USAID IP", "110", "CONCORDANT", ""],
                ["Animal Region", "Bird District", "Ostrich Site", "", "Ostrich Site", "6", "2013-10-01", "2014-09-30", "TX_CURR (N, DSD): Receiving ART", "(default)", "(2006 Demoland CDC Hound IM)", "Demoland Hound IP", "300", "CONCORDANT", ""],
                ["Animal Region", "Bird District", "Ostrich Site", "", "Ostrich Site", "6", "2013-10-01", "2014-09-30", "TX_CURR (N, DSD): Receiving ART", "(default)", "(9999 Demoland USAID IM)", "Demoland Demoland USAID IP", "300", "CONCORDANT", ""],
                ["Animal Region", "Bird District", "Robin Site", "", "Robin Site", "6", "2013-10-01", "2014-09-30", "TX_CURR (N, DSD, Age/Sex Aggregated): Receiving ART", "(15+, Female)", "(3021 Demoland DOD Lemon IM)", "Demoland Lemon IP", "70", "DISCORDANT", ""],
                ["Animal Region", "Bird District", "Robin Site", "", "Robin Site", "6", "2013-10-01", "2014-09-30", "TX_CURR (N, DSD, Age/Sex Aggregated): Receiving ART", "(15+, Female)", "(3021 Demoland DOD Lemon IM)", "Demoland Lemon IP", "70", "CONCORDANT", ""],
                ["Animal Region", "Bird District", "Robin Site", "", "Robin Site", "6", "2013-10-01", "2014-09-30", "TX_CURR (N, DSD, Age/Sex Aggregated): Receiving ART", "(15+, Female)", "(3026 Demoland DOD Raspberry IM)", "Demoland Raspberry IP", "16", "DISCORDANT", ""],
                ["Animal Region", "Bird District", "Robin Site", "", "Robin Site", "6", "2013-10-01", "2014-09-30", "TX_CURR (N, DSD, Age/Sex Aggregated): Receiving ART", "(15+, Female)", "(9999 Demoland USAID IM)", "Demoland Demoland USAID IP", "70", "CONCORDANT", ""],
                ["Animal Region", "Bird District", "Robin Site", "", "Robin Site", "6", "2013-10-01", "2014-09-30", "TX_CURR (N, DSD, Age/Sex Aggregated): Receiving ART", "(15+, Female)", "(9999 Demoland USAID IM)", "Demoland Demoland USAID IP", "70", "DISCORDANT", ""],
                ["Animal Region", "Bird District", "Robin Site", "", "Robin Site", "6", "2013-10-01", "2014-09-30", "TX_CURR (N, DSD, Age/Sex Aggregated): Receiving ART", "(15+, Male)", "(1006 Demoland USAID Robin IM)", "Demoland Robin IP", "20", "DISCORDANT", ""],
                ["Animal Region", "Bird District", "Robin Site", "", "Robin Site", "6", "2013-10-01", "2014-09-30", "TX_CURR (N, DSD, Age/Sex Aggregated): Receiving ART", "(15+, Male)", "(3030 Demoland DOD Durian IM)", "Demoland Durian IP", "40", "DISCORDANT", ""],
                ["Animal Region", "Bird District", "Robin Site", "", "Robin Site", "6", "2013-10-01", "2014-09-30", "TX_CURR (N, DSD, Age/Sex Aggregated): Receiving ART", "(15+, Male)", "(3030 Demoland DOD Durian IM)", "Demoland Durian IP", "40", "CONCORDANT", ""],
                ["Animal Region", "Bird District", "Robin Site", "", "Robin Site", "6", "2013-10-01", "2014-09-30", "TX_CURR (N, DSD, Age/Sex Aggregated): Receiving ART", "(15+, Male)", "(9999 Demoland USAID IM)", "Demoland Demoland USAID IP", "40", "DISCORDANT", ""],
                ["Animal Region", "Bird District", "Robin Site", "", "Robin Site", "6", "2013-10-01", "2014-09-30", "TX_CURR (N, DSD, Age/Sex Aggregated): Receiving ART", "(15+, Male)", "(9999 Demoland USAID IM)", "Demoland Demoland USAID IP", "40", "CONCORDANT", ""],
                ["Animal Region", "Bird District", "Robin Site", "", "Robin Site", "6", "2013-10-01", "2014-09-30", "TX_CURR (N, DSD): Receiving ART", "(default)", "(00000 De-duplication adjustment)", "", "-375", "DISCORDANT", "RESOLVED"],
                ["Animal Region", "Bird District", "Robin Site", "", "Robin Site", "6", "2013-10-01", "2014-09-30", "TX_CURR (N, DSD): Receiving ART", "(default)", "(1002 Demoland USAID Cardinal IM)", "Demoland Cardinal IP", "40", "DISCORDANT", "RESOLVED"],
                ["Animal Region", "Bird District", "Robin Site", "", "Robin Site", "6", "2013-10-01", "2014-09-30", "TX_CURR (N, DSD): Receiving ART", "(default)", "(1021 Demoland USAID Trout IM)", "Demoland Trout IP", "125", "DISCORDANT", "RESOLVED"],
                ["Animal Region", "Bird District", "Robin Site", "", "Robin Site", "6", "2013-10-01", "2014-09-30", "TX_CURR (N, DSD): Receiving ART", "(default)", "(1021 Demoland USAID Trout IM)", "Demoland Trout IP", "125", "CONCORDANT", "RESOLVED"],
                ["Animal Region", "Bird District", "Robin Site", "", "Robin Site", "6", "2013-10-01", "2014-09-30", "TX_CURR (N, DSD): Receiving ART", "(default)", "(9999 Demoland USAID IM)", "Demoland Demoland USAID IP", "125", "DISCORDANT", "RESOLVED"],
                ["Animal Region", "Bird District", "Robin Site", "", "Robin Site", "6", "2013-10-01", "2014-09-30", "TX_CURR (N, DSD): Receiving ART", "(default)", "(9999 Demoland USAID IM)", "Demoland Demoland USAID IP", "125", "CONCORDANT", "RESOLVED"],
                ["Animal Region", "Bird District", "Woodpecker Site", "", "Woodpecker Site", "6", "2013-10-01", "2014-09-30", "TX_CURR (N, DSD, Age/Sex Aggregated): Receiving ART", "(15+, Female)", "(2021 Demoland CDC Honeybee IM)", "Demoland Honeybee IP", "2000", "DISCORDANT", ""],
                ["Animal Region", "Bird District", "Woodpecker Site", "", "Woodpecker Site", "6", "2013-10-01", "2014-09-30", "TX_CURR (N, DSD, Age/Sex Aggregated): Receiving ART", "(15+, Female)", "(9999 Demoland USAID IM)", "Demoland Demoland USAID IP", "1000", "DISCORDANT", ""],
                ["Animal Region", "Bird District", "Woodpecker Site", "", "Woodpecker Site", "6", "2013-10-01", "2014-09-30", "TX_CURR (N, DSD, Age/Sex Aggregated): Receiving ART", "(15+, Male)", "(2005 Demoland CDC Poodle IM)", "Demoland Poodle IP", "1300", "DISCORDANT", ""],
                ["Animal Region", "Bird District", "Woodpecker Site", "", "Woodpecker Site", "6", "2013-10-01", "2014-09-30", "TX_CURR (N, DSD, Age/Sex Aggregated): Receiving ART", "(15+, Male)", "(9999 Demoland USAID IM)", "Demoland Demoland USAID IP", "650", "DISCORDANT", ""],
                ["Animal Region", "Bird District", "Woodpecker Site", "", "Woodpecker Site", "6", "2013-10-01", "2014-09-30", "TX_CURR (N, DSD): Receiving ART", "(default)", "(00000 De-duplication adjustment)", "", "-3600", "DISCORDANT", "RESOLVED"],
                ["Animal Region", "Bird District", "Woodpecker Site", "", "Woodpecker Site", "6", "2013-10-01", "2014-09-30", "TX_CURR (N, DSD): Receiving ART", "(default)", "(2020 Demoland CDC Butterfly IM)", "Demoland Butterfly IP", "3600", "DISCORDANT", "RESOLVED"],
                ["Animal Region", "Bird District", "Woodpecker Site", "", "Woodpecker Site", "6", "2013-10-01", "2014-09-30", "TX_CURR (N, DSD): Receiving ART", "(default)", "(9999 Demoland USAID IM)", "Demoland Demoland USAID IP", "1800", "DISCORDANT", "RESOLVED"]
            ]
        }
    };

    window.fixtures = {
        get: function (fixtureName) {
            if (fixtures[fixtureName]) {
                return angular.copy(fixtures[fixtureName]);
            }
            throw new Error('Fixture named "' + fixtureName + '" does not exist');
        }
    };

}(window));
