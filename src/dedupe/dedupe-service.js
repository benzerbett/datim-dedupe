angular.module('PEPFAR.dedupe').factory('dedupeService', dedupeService);

function dedupeService(dedupeRecordService, dedupeSaverService, $q, DEDUPE_PAGE_SIZE) {
    var requiredFilters = ['ou', 'pe', 'rs', 'ps', 'pg', 'dt', 'ty'];

    return {
        getDuplicateRecords: getDuplicateRecords,
        getCsvUrl: getCsvUrl,
        getMax: getMax,
        getSum: getSum,
        resolveDuplicates: resolveDuplicates
    };

    function getDuplicateRecords(organisationUnitId, periodId, includeResolved, targetsResults, pageNumber, dedupeType, pageSize) {
        var filters = getFilters(organisationUnitId, periodId, includeResolved, targetsResults, pageNumber, dedupeType, pageSize);

        if (isRequiredFiltersPresent(filters)) {
            return dedupeRecordService.getRecords(filters);
        }

        return $q.when([]);
    }

    function getCsvUrl(organisationUnitId, periodId, includeResolved, targetsResults, pageNumber, dedupeType, pageSize) {
        var filters = getFilters(organisationUnitId, periodId, includeResolved, targetsResults, pageNumber, dedupeType, pageSize);

        if (isRequiredFiltersPresent(filters)) {
            return dedupeRecordService.getCsvUrl(filters);
        }

        return $q.reject('Unable to get the correct url, because filters are not correct');
    }

    function getFilters(organisationUnitId, periodId, includeResolved, targetsResults, pageNumber, dedupeType, pageSize) {
        var filters = {};

        if (organisationUnitId && angular.isString(organisationUnitId)) {
            filters.ou = organisationUnitId;
        }

        if (periodId && angular.isString(periodId)) {
            filters.pe = periodId;
        }

        filters.rs = includeResolved || false;
        filters.ps = pageSize || DEDUPE_PAGE_SIZE;
        filters.pg = pageNumber || 1;
        filters.dt = (angular.isString(targetsResults) && targetsResults.toUpperCase()) || 'ALL';
        filters.ty = dedupeType;

        return filters;
    }

    function isRequiredFiltersPresent(filters) {
        return requiredFilters.every(function (requiredFilter) {
            return _.contains(Object.keys(filters), requiredFilter);
        });
    }

    function getMax(dedupeRecordData) {
        throwIfNotArray(dedupeRecordData, 'getMax');

        return dedupeRecordData
            .filter(function (record) {
                return record.calculate;
            })
            .map(pick('value'))
            .map(parseFloat)
            .filter(function (value) {
                return !isNaN(value);
            })
            .reduce(max, 0);
    }

    function getSum(dedupeRecordData) {
        throwIfNotArray(dedupeRecordData, 'getSum');

        return dedupeRecordData
            .filter(function (record) {
                return record.calculate;
            })
            .map(pick('value'))
            .map(parseFloat)
            .filter(function (value) {
                return !isNaN(value);
            })
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
