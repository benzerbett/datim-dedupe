angular.module('PEPFAR.dedupe').factory('dedupeSaverService', dedupeSaverService);

function dedupeSaverService($q, Restangular,
                            DEDUPE_CATEGORY_OPTION_ID,
                            DEDUPE_CATEGORY_OPTION_COMBO_ID,
                            DEDUPE_CROSSWALK_CATEGORY_OPTION_ID,
                            DEDUPE_CROSSWALK_CATEGORY_OPTION_COMBO_ID,
                            DEDUPE_CATEGORY_COMBO_ID) {
    return {
        saveDeduplication: saveDeduplication
    };

    function saveDeduplication(dedupeRecords) {
        if (!Array.isArray(dedupeRecords)) {
            return $q.reject('Expected passed argument to dedupeSaverService.saveDeduplication to be an array.');
        }

        if (dedupeRecords.length === 0) {
            return $q.reject('No dedupe records passed to dedupeSaverService.saveDeduplication. (Empty array)');
        }

        if (dedupeRecords.length > 1) {
            return saveMultiple(dedupeRecords);
        }
        return saveSingle(_.first(dedupeRecords));
    }

    function saveMultiple(dedupeRecords) {
        var dataValueSet = getDataValueSet();
        var errorCount = 0;
        var errors = [];

        dedupeRecords
            .forEach(function (dedupeRecord) {
                try {
                    dataValueSet.dataValues.push(getDataValue(dedupeRecord));
                } catch (e) {
                    errorCount += 1;
                    errors.push(e);
                }
            });

        if (dataValueSet.dataValues.length === 0) {
            return $q.reject(getResponseStructure(0, errorCount, errors));
        }

        return Restangular.all('dataValueSets')
            .post(dataValueSet, {
                preheatCache: false
            })
            .then(function (importResult) {
                return getResponseStructure(
                    importResult.dataValueCount.imported + importResult.dataValueCount.updated,
                    errorCount + importResult.dataValueCount.ignored,
                    _.union(errors, (importResult.conflicts || []))
                        .map(function (error) {
                            if (angular.isString(error.value) && !(error instanceof Error)) {
                                return new Error(error.value);
                            }
                            return error;
                        })
                );
            });
    }

    function saveSingle(dedupeRecord) {
        try {
            return Restangular.all('dataValues')
                .customPOST('', undefined, getDataValuesQueryParameters(dedupeRecord))
                .then(function () {
                    return getResponseStructure(1, 0, []);
                })
                .catch(function (response) {
                    return $q.reject(getResponseStructure(0, 1, [new Error('Saving failed (' + response.status + ': ' + response.data + ')')]));
                });
        } catch (e) {
            return $q.reject(e.message);
        }
    }

    function getResponseStructure(successCount, errorCount, errors) {
        return {
            successCount: successCount,
            errorCount: errorCount,
            errors: errors
        };
    }

    function getDataValueSet() {
        return {
            dataValues: []
        };
    }

    function getDataValuesQueryParameters(dedupeRecord) {
        return {
            de: getValueFromObjectorThrow('dataElementId', dedupeRecord.details),
            pe: getValueFromObjectorThrow('timePeriodName', dedupeRecord.details),
            ou: getValueFromObjectorThrow('orgUnitId', dedupeRecord.details),
            co: getValueFromObjectorThrow('categoryOptionComboId', dedupeRecord.details),
            cc: DEDUPE_CATEGORY_COMBO_ID,
            cp: isCrosswalkRecord(dedupeRecord) ? DEDUPE_CROSSWALK_CATEGORY_OPTION_ID : DEDUPE_CATEGORY_OPTION_ID,
            value: getValueFromObjectorThrow('adjustedValue', dedupeRecord.resolve).toString()
        };
    }

    function getDataValue(dedupeRecord) {
        return {
            dataElement: getValueFromObjectorThrow('dataElementId', dedupeRecord.details),
            period: getValueFromObjectorThrow('timePeriodName', dedupeRecord.details),
            orgUnit: getValueFromObjectorThrow('orgUnitId', dedupeRecord.details),
            categoryOptionCombo: getValueFromObjectorThrow('categoryOptionComboId', dedupeRecord.details),
            attributeOptionCombo: isCrosswalkRecord(dedupeRecord) ? DEDUPE_CROSSWALK_CATEGORY_OPTION_COMBO_ID : DEDUPE_CATEGORY_OPTION_COMBO_ID,
            value: getValueFromObjectorThrow('adjustedValue', dedupeRecord.resolve).toString()
        };
    }

    function getValueFromObjectorThrow(valueName, record) {
        if (record && valueName && (isValidStringValue(record[valueName]) || isValidNumberValue(record[valueName]))) {
            return record[valueName];
        }
        throw new Error('Did not find a value for "' + valueName + '" on passed record. ' + JSON.stringify(record));
    }

    function isValidStringValue(value) {
        return angular.isDefined(value) && angular.isString(value);
    }

    function isValidNumberValue(value) {
        return angular.isDefined(value) && angular.isNumber(value);
    }

    function isCrosswalkRecord(dedupeRecord) {
        return dedupeRecord.details.dedupeType === 'CROSSWALK';
    }
}
