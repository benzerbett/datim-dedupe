angular.module('PEPFAR.dedupe').factory('dedupeRecordService', dedupeRecordService);

function dedupeRecordService(Restangular) {
    return {
        getRecords: getRecords
    };

    function getRecords() {
        return executeSqlViewOnApi()
            .then(processRecords);
    }

    function executeSqlViewOnApi() {
        return Restangular.all('sqlViews')
            .all('I3vdXPDm1Ye')
            .get('execute');
    }

    function processRecords(recordObjects) {
        var value = _.chain(recordObjects.rows)
            .groupBy(recordGroupIdentifier)
            .values()
            .map(function (records) {
                var resultObject = {
                    details: {
                        orgUnitName: records[0][4],
                        timePeriodName: undefined
                    },
                    data: [],
                    resolve: {
                        type: undefined,
                        value: undefined
                    }
                };

                records.forEach(function (record) {
                    var mechanism = record[10];
                    var partnerName = record[11];
                    var value = record[12];

                    if (partnerName === '' && mechanism === '(00000 De-duplication adjustment)') {
                        resultObject.resolve.value = parseFloat(value);
                    } else {
                        resultObject.data.push({
                            agency: '',
                            partner: partnerName,
                            value: parseFloat(value)
                        });
                    }
                });

                return resultObject;
            })
            .value();

        return value;
    }

    function recordGroupIdentifier(recordObject) {
        //TODO: Check if string concat is faster if this gives trouble
        //TODO: See if we can create an identifier serverside?
        return [
            recordObject[0], //oulevel2_name
            recordObject[1], //oulevel3_name
            recordObject[2], //oulevel4_name
            recordObject[3], //oulevel5_name
            recordObject[4], //orgunit_name
            recordObject[5], //orgunit_level
            recordObject[6], //startdate
            recordObject[7], //enddate
            recordObject[8], //dataelement
            recordObject[9]  //disaggregation
                             //mechanism
                             //partner
                             //value
                             //duplication type
                             //duplicate_status
        ].join('_');
    }
}
