angular.module('PEPFAR.dedupe').factory('dedupeRecordService', dedupeRecordService);

function dedupeRecordService(Restangular) {
    var headers;

    return {
        getRecords: getRecords
    };

    function getRecords() {
        return executeSqlViewOnApi()
            .then(extractHeaders)
            .then(createDedupeRecords);
    }

    function extractHeaders(sqlViewData) {
        headers = _.chain(sqlViewData.headers)
            .map(_.compose(_.values, _.partialRight(_.pick, ['column'])))
            .flatten()
            .value();

        return sqlViewData.rows;
    }

    function executeSqlViewOnApi() {
        return Restangular.all('sqlViews')
            .all('AuL6zTSLxNc')
            .get('data');
    }

    function createDedupeRecords(rows) {
        return _.chain(rows)
            .groupBy(recordGroupIdentifier)
            .values()
            .map(createDedupeRecord)
            .value();
    }

    function createDedupeRecord(rows) {
        var dedupeRecord = {
            details: {
                orgUnitId: getColumnValue('ou_uid', rows[0]),
                orgUnitName: getColumnValue('orgunit_name', rows[0]),
                timePeriodName: getColumnValue('iso_period', rows[0]),
                dataElementId: getColumnValue('de_uid', rows[0]),
                dataElementName: getColumnValue('dataelement', rows[0]),
                categoryOptionComboId: getColumnValue('coc_uid', rows[0]),
                categoryOptionComboName: getColumnValue('disaggregation', rows[0])
            },
            data: [],
            resolve: {
                isResolved: getColumnValue('orgunit_name', rows[0]) === 'RESOLVED' ? true : false,
                type: undefined,
                value: undefined
            }
        };

        rows.forEach(processRecord(dedupeRecord));

        return dedupeRecord;
    }
    function processRecord(dedupeRecord) {
        return function (record) {
            var mechanism = getColumnValue('mechanism', record);
            var partnerName = getColumnValue('partner', record);
            var agencyName = getColumnValue('agency', record);
            var value = getColumnValue('value', record);

            if (partnerName === '' && mechanism === '(00000 De-duplication adjustment)') {
                dedupeRecord.resolve.value = parseFloat(value);
            } else {
                dedupeRecord.data.push({
                    agency: agencyName,
                    partner: partnerName,
                    value: parseFloat(value)
                });
            }
        };
    }

    function recordGroupIdentifier(record) {
        return getColumnValue('group_id', record);
    }

    function getColumnValue(columnName, record) {
        var columnIndex = headers.indexOf(columnName);

        return columnIndex >= 0 ? record[columnIndex] : undefined;
    }
}
