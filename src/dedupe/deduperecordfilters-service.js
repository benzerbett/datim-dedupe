angular.module('PEPFAR.dedupe').factory('dedupeRecordFilters', dedupeRecordFilters);

function dedupeRecordFilters($rootScope) {
    var periodDisplayName;
    var dedupeFilters = {
        ty: 'PURE'
    };

    return {
        changeOrganisationUnit: changeOrganisationUnit,
        changeFilterResultsTargets: changeFilterResultsTargets,
        changePeriodFilter: changePeriodFilter,
        changeIsCrosswalk: changeIsCrosswalk,
        getResultsTargetsFilter: getResultsTargetsFilter,
        getFilters: getFilters,
        getPeriodName: getPeriodName,
        getPeriodDisplayName: getPeriodDisplayName,
        getDedupeType: getDedupeType
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
            dedupeFilters.ty = 'PURE';
            dedupeFilters.ou = organisationUnit.id;
            fireUpdateEvent();
        }
    }

    function changePeriodFilter(period) {
        if (period) {
            dedupeFilters.ty = 'PURE';
            periodDisplayName = period.name;
            dedupeFilters.pe = period.iso;
            fireUpdateEvent();
        }
    }

    function changeIsCrosswalk(value) {
        if (value === false || value === true) {
            dedupeFilters.ty = value ? 'CROSSWALK' : 'PURE';
            fireUpdateEvent();
        }
        return dedupeFilters.ty;
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

    function getDedupeType() {
        return dedupeFilters.ty;
    }

    function getFilters() {
        return dedupeFilters;
    }

    function fireUpdateEvent() {
        $rootScope.$broadcast('DEDUPE_RECORDFILTER_SERVICE.updated', dedupeFilters);
    }
}
