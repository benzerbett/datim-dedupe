angular.module('PEPFAR.dedupe').factory('dedupeService', dedupeService);

function dedupeService(dedupeRecordService, dedupeSaverService) {
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
        return dedupeSaverService.saveDeduplication(dedupeRecords);
    }
}
