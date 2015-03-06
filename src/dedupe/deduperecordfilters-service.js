angular.module('PEPFAR.dedupe').factory('dedupeRecordFilters', dedupeRecordFilters);

function dedupeRecordFilters() {
    var filters = {
        onlyTypeCrosswalk: onlyTypeCrosswalk
    };
    return filters;

    function onlyTypeCrosswalk(records) {
        return records.filter(function (dedupeRecord) {
            return (dedupeRecord && dedupeRecord.details) && dedupeRecord.details.type === 'CROSSWALK';
        });
    }
}
