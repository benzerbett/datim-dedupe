angular.module('PEPFAR.dedupe').factory('dedupeRecordFilters', dedupeRecordFilters);

function dedupeRecordFilters() {
    var filters = {
        onlyNonResolvedRecords: onlyNonResolvedRecords,
        onlyTypeCrosswalk: onlyTypeCrosswalk
    };
    return filters;

    function onlyNonResolvedRecords(records) {
        return records.filter(function (dedupeRecord) {
            return (dedupeRecord && dedupeRecord.resolve) && !dedupeRecord.resolve.isResolved;
        });
    }

    function onlyTypeCrosswalk(records) {
        return records.filter(function (dedupeRecord) {
            return (dedupeRecord && dedupeRecord.details) && dedupeRecord.details.type === 'CROSSWALK';
        });
    }
}
