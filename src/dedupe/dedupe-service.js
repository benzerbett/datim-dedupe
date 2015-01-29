angular.module('PEPFAR.dedupe').factory('dedupeService', dedupeService);

function dedupeService() {
    return {
        getMax: getMax,
        getSum: getSum
    };

    function getMax(dedupeRecords) {
        throwIfNotArray(dedupeRecords, 'getMax');

        return dedupeRecords
            .map(pick('value'))
            .map(parseFloat)
            .reduce(max, 0);
    }

    function getSum(dedupeRecords) {
        throwIfNotArray(dedupeRecords, 'getSum');

        return dedupeRecords
            .map(pick('value'))
            .reduce(add, 0);
    }

    function throwIfNotArray(dedupeRecords, functionName) {
        if (!Array.isArray(dedupeRecords)) {
            throw new Error('Parameter dedupeRecords that was passed to ' + functionName + ' is not an array');
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
}
