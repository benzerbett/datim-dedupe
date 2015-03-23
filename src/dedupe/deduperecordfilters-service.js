angular.module('PEPFAR.dedupe').factory('dedupeRecordFilters', dedupeRecordFilters);

function dedupeRecordFilters($rootScope) {
    var periodDisplayName;
    var dedupeFilters = {

    };

    return {
        changeOrganisationUnit: changeOrganisationUnit,
        changeFilterResultsTargets: changeFilterResultsTargets,
        changePeriodFilter: changePeriodFilter,
        getResultsTargetsFilter: getResultsTargetsFilter,
        getFilters: getFilters,
        getPeriodName: getPeriodName,
        getPeriodDisplayName: getPeriodDisplayName
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
            periodDisplayName = period.name;
            dedupeFilters.pe = period.iso;
            fireUpdateEvent();
        }
    }

    function getPeriodName() {
        return dedupeFilters.pe;
    }

    function getPeriodDisplayName() {
        return periodDisplayName;
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
