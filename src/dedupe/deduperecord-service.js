angular.module('PEPFAR.dedupe').factory('dedupeRecordService', dedupeRecordService);

function dedupeRecordService($q, Restangular, DEDUPE_MECHANISM_NAME, DEDUPE_MECHANISM_CROSSWALK_NAME) {
    var headers;

    return {
        getRecords: getRecords
    };

    function getRecords(filters) {
        var dataRows = executeSqlViewOnApi(filters)
            .then(extractHeaders);

        if (filters.ty === 'CROSSWALK') {
            return dataRows.then(createCrosswalkDedupeRecords);
        }
        return dataRows.then(createDedupeRecords);
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
            .map(addDedupeType('PURE'))
            .filter(function (dedupeRecord) {
                return dedupeRecord.data.length;
            })
            .value();

        dedupeRecords.totalNumber = parseInt(totalNumber, 10);

        return dedupeRecords;
    }

    function createCrosswalkDedupeRecords(rows) {
        var totalNumber;

        var dedupeRecords = _.chain(rows)
            .tap(function (rows) {
                if (rows.length > 0) {
                    totalNumber = getColumnValue('total_groups', rows[0]);
                }
            })
            .groupBy(recordGroupIdentifier)
            .values()
            .map(createCrosswalkDedupeRecord)
            .map(addDedupeType('CROSSWALK'))
            .filter(function (dedupeRecord) {
                return dedupeRecord.data.length;
            })
            .value();

        dedupeRecords.totalNumber = parseInt(totalNumber, 10);

        return dedupeRecords;
    }

    function addDedupeType(dedupeType) {
        return function (dedupeRecord) {
            dedupeRecord.details.dedupeType = dedupeType;
            return dedupeRecord;
        };
    }

    function getBasicRecord(rows) {
        return {
            id: getColumnValue('group_count', rows[0]),
            details: {
                orgUnitId: getColumnValue('ou_uid', rows[0]),
                orgUnitName: getOrganisationUnitName(rows),
                dataElementId: getColumnValue('de_uid', rows[0]),
                dataElementName: getColumnValue('dataelement', rows[0]),
                disaggregation: getColumnValue('disaggregation', rows[0]),
                categoryOptionComboId: getColumnValue('coc_uid', rows[0]),
                categoryOptionComboName: getColumnValue('disaggregation', rows[0])
            },
            data: [],
            resolve: {
                isResolved: false,
                type: undefined,
                value: undefined
            }
        };

        function getOrganisationUnitName(rows) {
            var combinedOuName = [
                getColumnValue('oulevel3_name', rows[0]),
                getColumnValue('oulevel4_name', rows[0]),
                getColumnValue('oulevel5_name', rows[0]),
                getColumnValue('oulevel6_name', rows[0])
            ].filter(function (ouName) {
                    return angular.isString(ouName) && ouName.length > 0;
                }).join(' / ');

            if (combinedOuName) {
                return combinedOuName;
            }
            return getColumnValue('ou_name', rows[0]);
        }
    }

    function createCrosswalkDedupeRecord(rows) {
        var dedupeRecord = getBasicRecord(rows);

        //Crosswalk records will always be marked as resolved
        dedupeRecord.resolve.isResolved = true;

        if (isCrosswalkResolved(rows)) {
            dedupeRecord.resolve.type = getDedupeType(rows);
            dedupeRecord.resolve.value = calculateActualDedupedValue(rows);
        } else {
            dedupeRecord.resolve.type = 'custom';
            dedupeRecord.resolve.value = 0;
        }

        getNonCrosswalkDedupeRows(rows).forEach(processRecord(dedupeRecord));

        return dedupeRecord;
    }

    function createDedupeRecord(rows) {
        var dedupeRecord = getBasicRecord(rows);

        if (isResolved(rows)) {
            dedupeRecord.resolve.isResolved = true;
            dedupeRecord.resolve.type = getDedupeType(rows);
            dedupeRecord.resolve.value = calculateActualDedupedValue(rows);
        }

        getNonDedupeRows(rows).forEach(processRecord(dedupeRecord));

        return dedupeRecord;
    }

    function processRecord(dedupeRecord) {
        return function (record) {
            var partnerName = getColumnValue('partner', record);
            var agencyName = getColumnValue('agency', record);
            var value = getColumnValue('value', record);

            if (isDedupeMechanismRow(record)) {
                agencyName = 'Dedupe adjustment';
                partnerName = 'Dedupe adjustment';
            }

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

    function isCrosswalkResolved(dataRows) {
        return dataRows.some(isDedupeCrosswalkMechanismRow) && dataRows.every(function (row) {
                return (getColumnValue('duplicate_status', row) === 'RESOLVED');
            });
    }

    function getDedupeType(dataRows, isCrosswalk) {
        if (isCrosswalk) {
            switch (calculateActualCrosswalkDedupedValue(dataRows)) {
                case getTotalOfAllRows(getNonDedupeRows(dataRows)):
                    return 'sum';
                case getMaxOfAllNonDedupedRows(getNonDedupeRows(dataRows)):
                    return 'max';
            }
            return 'custom';
        }

        switch (calculateActualDedupedValue(dataRows)) {
            case getTotalOfAllRows(getNonDedupeRows(dataRows)):
                return 'sum';
            case getMaxOfAllNonDedupedRows(getNonDedupeRows(dataRows)):
                return 'max';
        }
        return 'custom';
    }

    function calculateActualDedupedValue(dataRows) {
        return getTotalOfAllRows(getNonDedupeRows(dataRows)) + getDedupeAdjustmentValue(dataRows);
    }

    function calculateActualCrosswalkDedupedValue(dataRows) {
        return getTotalOfAllRows(getNonCrosswalkDedupeRows(dataRows)) + getCrosswalkDedupeAdjustmentValue(dataRows);
    }

    function recordGroupIdentifier(record) {
        return getColumnValue('group_count', record);
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

        if (dedupeAdjustmentRow.length > 1) {
            throw new Error('More than 1 dedupe adjustment row found');
        }

        return dedupeAdjustmentRow.reduce(add, 0);
    }

    function getCrosswalkDedupeAdjustmentValue(dataRows) {
        var dedupeAdjustmentRow = _.chain(dataRows)
            .filter(isDedupeCrosswalkMechanismRow)
            .map(pickValueColumn)
            .value();

        if (dedupeAdjustmentRow.length > 1) {
            throw new Error('More than 1 dedupe adjustment row found');
        }

        return dedupeAdjustmentRow.reduce(add, 0);
    }

    function getTotalOfAllRows(dataRows) {
        return _.chain(dataRows)
            .map(pickValueColumn)
            .reduce(add, 0)
            .value();
    }

    function getMaxOfAllNonDedupedRows(dataRows) {
        var rowValues = _.chain(dataRows)
            .map(pickValueColumn)
            .value();

        return Math.max.apply(Math, rowValues);
    }

    function getNonDedupeRows(dataRows) {
        return _.chain(dataRows)
            .reject(isDedupeMechanismRow)
            .value();
    }

    function getNonCrosswalkDedupeRows(dataRows) {
        return _.chain(dataRows)
            .reject(isDedupeCrosswalkMechanismRow)
            .value();
    }

    function isDedupeMechanismRow(row) {
        return getColumnValue('mechanism', row) === DEDUPE_MECHANISM_NAME;
    }

    function isDedupeCrosswalkMechanismRow(row) {
        return getColumnValue('mechanism', row) === DEDUPE_MECHANISM_CROSSWALK_NAME;
    }

    function pickValueColumn(row) {
        return parseFloat(getColumnValue('value', row));
    }

    function add(left, right) {
        return left + right;
    }
}
