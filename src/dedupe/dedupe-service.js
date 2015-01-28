angular.module('PEPFAR.dedupe').factory('dedupeService', dedupeService);

function dedupeService() {
    return {
        getMax: getMax,
        getSum: getSum
    };

    function getMax(dedupeRecords) {
        if (!Array.isArray(dedupeRecords)) {
            throw new Error('Parameter dedupeRecords that was passed to getMax is not an array');
        }

        return dedupeRecords.reduce(function (currentValue, dedupeRecord) {
            if (currentValue < parseFloat(dedupeRecord.value)) {
                return dedupeRecord.value;
            }
            return currentValue;
        }, 0);
    }

    function getSum(dedupeRecords) {
        if (!Array.isArray(dedupeRecords)) {
            throw new Error('Parameter dedupeRecords that was passed to getSum is not an array');
        }

        return dedupeRecords.reduce(function (currentValue, dedupeRecord) {
            return currentValue + parseFloat(dedupeRecord.value);
        }, 0);
    }
}
