angular.module('PEPFAR.dedupe').factory('dedupeRecordFilters', dedupeRecordFilters);

function dedupeRecordFilters($rootScope) {
    var dedupeFilters = {

    };

    return {
        changeOrganisationUnit: changeOrganisationUnit,
        changeFilterResultsTargets: changeFilterResultsTargets,
        changePeriodFilter: changePeriodFilter,
        getResultsTargetsFilter: getResultsTargetsFilter,
        getFilters: getFilters
    };

    function changeFilterResultsTargets(newResultsTargets) {
        if (newResultsTargets && newResultsTargets.name) {
            dedupeFilters.tr = newResultsTargets.name;
        } else {
            dedupeFilters.tr = undefined;
        }
    }

    function changeOrganisationUnit(organisationUnit) {
        if (organisationUnit) {
            dedupeFilters.ou = organisationUnit.id;
            fireUpdateEvent();
        }
    }

    function changePeriodFilter(period) {
        if (period) {
            dedupeFilters.pe = period.iso;
            fireUpdateEvent();
        }
    }

    function getResultsTargetsFilter() {
        return dedupeFilters.tr;
    }

    function getFilters() {
        return dedupeFilters;
    }

    function fireUpdateEvent() {
        $rootScope.$broadcast('DEDUPE_RECORDFILTER_SERVICE.updated', dedupeFilters);
    }
}
