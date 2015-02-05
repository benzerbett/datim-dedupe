angular.module('PEPFAR.dedupe').factory('dedupeSaverService', dedupeSaverService);

function dedupeSaverService($q, Restangular, DEDUPE_CATEGORY_OPTION_COMBO_ID) {
    return {
        saveDeduplication: saveDeduplication
    };

    function saveDeduplication(dedupeRecords) {
        var dataValueSet = getDataValueSet();

        if (!Array.isArray(dedupeRecords)) {
            return $q.reject('Expected passed argument to dedupeSaverService.saveDeduplication to be an array.');
        }

        if (dedupeRecords.length === 0) {
            return $q.reject('No dedupe records passed to dedupeSaverService.saveDeduplication. (Empty array)');
        }

        try {
            dedupeRecords
                .forEach(function (dedupeRecord) {
                    dataValueSet.dataValues.push(getDataValue(dedupeRecord));
                });

        } catch (e) {
            return window.console.log(e);
        }

        return Restangular.all('dataValueSets')
            .post(dataValueSet);
    }

    function getDataValueSet() {
        return {
            dataValues: []
        };
    }

    function getDataValue(dedupeRecord) {
        return {
            dataElement: getValueFromObjectorThrow('dataElementId', dedupeRecord.details),
            period: getValueFromObjectorThrow('timePeriodName', dedupeRecord.details),
            orgUnit: getValueFromObjectorThrow('orgUnitId', dedupeRecord.details),
            categoryOptionCombo: getValueFromObjectorThrow('categoryOptionComboId', dedupeRecord.details),
            attributeOptionCombo: DEDUPE_CATEGORY_OPTION_COMBO_ID,
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
}
