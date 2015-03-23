angular.module('PEPFAR.dedupe').factory('dedupeRecordService', dedupeRecordService);

function dedupeRecordService($q, Restangular, DEDUPE_MECHANISM_NAME) {
    var headers;

    return {
        getRecords: getRecords
    };

    function getRecords(filters) {
        return executeSqlViewOnApi(filters)
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

    function executeSqlViewOnApi(filters) {
        var queryParameters = {var: getFilterArrayFromFilters(filters)};

        return getSqlViewIdFromSystemSettings()
            .then(function (sqlViewId) {
                return Restangular.all('sqlViews')
                    .all(sqlViewId)
                    .get('data', queryParameters);
            });
    }

    function getSqlViewIdFromSystemSettings() {
        return Restangular.all('systemSettings').withHttpConfig({cache: true})
            .get('keyDedupeSqlViewId')
            .then(function (settingsObject) {
                if (settingsObject && angular.isString(settingsObject.id)) {
                    return settingsObject.id;
                }

                return $q.reject('System setting with id of sqlview not found. Please check if your app is configured correctly.');
            });
    }

    function getFilterArrayFromFilters(filters) {
        return _.map(filters, function (value, key) {
            return [key, value].join(':');
        });
    }

    function createDedupeRecords(rows) {
        var totalNumber;

        var dedupeRecords = _.chain(rows)
            .tap(function (rows) {
                if (rows.length > 0) {
                    totalNumber = getColumnValue('total_groups', rows[0]);
                }
            })
            .groupBy(recordGroupIdentifier)
            .values()
            .map(createDedupeRecord)
            .value();

        dedupeRecords.totalNumber = parseInt(totalNumber, 10);

        return dedupeRecords;
    }

    function createDedupeRecord(rows) {
        var dedupeRecord = {
            id: getColumnValue('group_id', rows[0]),
            details: {
                orgUnitId: getColumnValue('ou_uid', rows[0]),
                orgUnitName: [
                    getColumnValue('oulevel2_name', rows[0]),
                    getColumnValue('oulevel3_name', rows[0]),
                    getColumnValue('oulevel4_name', rows[0]),
                    getColumnValue('oulevel5_name', rows[0])
                ].filter(function (ouName) { return ouName.length > 0; }).join(' / '),
                dataElementId: getColumnValue('de_uid', rows[0]),
                dataElementName: getColumnValue('dataelement', rows[0]),
                disaggregation: getColumnValue('disaggregation',  rows[0]),
                categoryOptionComboId: getColumnValue('coc_uid', rows[0]),
                categoryOptionComboName: getColumnValue('disaggregation', rows[0])
            },
            data: [],
            resolve: {
                isResolved: isResolved(rows),
                type: undefined,
                value: undefined
            }
        };

        if (isResolved(rows)) {
            dedupeRecord.resolve.type = getDedupeType(rows);
            dedupeRecord.resolve.value = calculateActualDedupedValue(rows);
        }

        getNonDedupeRows(rows).forEach(processRecord(dedupeRecord));

        return dedupeRecord;
    }
    function processRecord(dedupeRecord) {
        return function (record) {
            //var mechanism = getColumnValue('mechanism', record);
            var partnerName = getColumnValue('partner', record);
            var agencyName = getColumnValue('agency', record);
            var value = getColumnValue('value', record);

            dedupeRecord.data.push({
                agency: agencyName,
                partner: partnerName,
                value: parseFloat(value)
            });
        };
    }

    function isResolved(dataRows) {
        return dataRows.some(isDedupeMechanismRow) && dataRows.every(function (row) {
                return (getColumnValue('duplicate_status', row) === 'RESOLVED');
            });
    }

    function getDedupeType(dataRows) {
        switch (calculateActualDedupedValue(dataRows)) {
            case getTotalOfAllNonDedupeRows(dataRows):
                return 'sum';
            case getMaxOfAllNonDedupedRows(dataRows):
                return 'max';
        }
        return 'custom';
    }

    function calculateActualDedupedValue(dataRows) {
        return getTotalOfAllNonDedupeRows(dataRows) + getDedupeAdjustmentValue(dataRows);
    }

    function recordGroupIdentifier(record) {
        return getColumnValue('group_id', record);
    }

    function getColumnValue(columnName, record) {
        var columnIndex = headers.indexOf(columnName);

        return columnIndex >= 0 ? record[columnIndex] : undefined;
    }

    function getDedupeAdjustmentValue(dataRows) {
        var dedupeAdjustmentRow = _.chain(dataRows)
            .filter(isDedupeMechanismRow)
            .map(pickValueColumn)
            .value();

        if (dedupeAdjustmentRow.length > 1) { throw new Error('More than 1 dedupe adjustment row found'); }

        return dedupeAdjustmentRow.reduce(add, 0);
    }

    function getTotalOfAllNonDedupeRows(dataRows) {
        return _.chain(getNonDedupeRows(dataRows))
            .map(pickValueColumn)
            .reduce(add, 0)
            .value();
    }

    function getMaxOfAllNonDedupedRows(dataRows) {
        var rowValues = _.chain(getNonDedupeRows(dataRows))
            .map(pickValueColumn)
            .value();

        return Math.max.apply(Math, rowValues);
    }

    function getNonDedupeRows(dataRows) {
        return _.chain(dataRows)
            .reject(isDedupeMechanismRow)
            .value();
    }

    function isDedupeMechanismRow(row) {
        return getColumnValue('mechanism', row) === DEDUPE_MECHANISM_NAME;
    }

    function pickValueColumn(row) {
        return parseFloat(getColumnValue('value', row));
    }

    function add(left, right) {
        return left + right;
    }
}
