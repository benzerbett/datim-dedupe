angular.module('PEPFAR.dedupe').factory('dedupeService', dedupeService);

function dedupeService(dedupeRecordService, dedupeSaverService, $q) {
    return {
        getDuplicateRecords: getDuplicateRecords,
        getMax: getMax,
        getSum: getSum,
        resolveDuplicates: resolveDuplicates
    };

    function getDuplicateRecords() {
        return dedupeRecordService.getRecords();
    }

    function getMax(dedupeRecordData) {
        throwIfNotArray(dedupeRecordData, 'getMax');

        return dedupeRecordData
            .map(pick('value'))
            .map(parseFloat)
            .reduce(max, 0);
    }

    function getSum(dedupeRecordData) {
        throwIfNotArray(dedupeRecordData, 'getSum');

        return dedupeRecordData
            .map(pick('value'))
            .reduce(add, 0);
    }

    function throwIfNotArray(dedupeRecordData, functionName) {
        if (!Array.isArray(dedupeRecordData)) {
            throw new Error('Parameter dedupeRecordData that was passed to ' + functionName + ' is not an array');
        }
    }

    function pick(property) {
        return function (item) {
            return item[property];
        };
    }

    function add(left, right) {
        return parseFloat(left) + parseFloat(right);
    }

    function max(left, right) {
        return Math.max(left, right);
    }

    function resolveDuplicates(dedupeRecords) {
        if (!Array.isArray(dedupeRecords) || dedupeRecords.length === 0) {
            return $q.reject('Duplicate records passed to resolveDuplicates should be an array with at least one element');
        }

        var adjustedRecords = _.chain(dedupeRecords)
            .filter(function (dedupeRecord) {
                return dedupeRecord && dedupeRecord.resolve && angular.isNumber(dedupeRecord.resolve.value);
            })
            .forEach(function (dedupeRecord) {
                dedupeRecord.resolve.adjustedValue = dedupeRecord.resolve.value - getSum(dedupeRecord.data);
            })
            .value();

        if (adjustedRecords.length > 0) {
            return dedupeSaverService.saveDeduplication(adjustedRecords);
        }
        return $q.reject('Non of the passed dedupe records had resolved values that should be saved.');
    }
}
