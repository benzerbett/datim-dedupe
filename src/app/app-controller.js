angular.module('PEPFAR.dedupe').controller('appController', appController);

function appController(dedupeService, dedupeRecordFilters, $scope, notify) {
    var ctrl = this;
    var dedupeFilters = {
        includeResolved: false
    };

    ctrl.isFilterToggle = false;
    ctrl.isProcessing = true;
    ctrl.dedupeRecords = [];
    ctrl.allDedupeRecords = [];
    ctrl.pager = {
        current: 0,
        total: 0
    };

    //Controller methods
    ctrl.useMax = useMax;
    ctrl.useSum = useSum;
    ctrl.resolveDuplicates = resolveDuplicates;
    ctrl.changedIncludeResolved = changedIncludeResolved;
    ctrl.isShowingAll = isShowingAll;
    ctrl.changeOrgUnit = changeOrgUnit;
    ctrl.changePeriod = changePeriod;
    ctrl.changeFilterResultsTargets = changeFilterResultsTargets;
    ctrl.getDuplicateRecords = getDuplicateRecords;
    ctrl.isAllTypeCrosswalk = isAllTypeCrosswalk;
    ctrl.changedOnlyTypeCrosswalk = changedOnlyTypeCrosswalk;

    //Call init method to get data from services
    initialise();

    $scope.$on('DEDUPE_DIRECTIVE.resolve', function (event, dedupeRecordId, saveStatus) {

        //Remove the resolved record from the list of shown records
        ctrl.dedupeRecords = ctrl.dedupeRecords.filter(function (dedupeRecord) {
            return dedupeRecord.id !== dedupeRecordId;
        });

        reportStatusToUser(saveStatus);
    });

    function initialise() {

    }

    function getDuplicateRecords() {
        ctrl.isProcessing = true;

        dedupeService.getDuplicateRecords(dedupeFilters.ou, dedupeFilters.pe, dedupeFilters.includeResolved, dedupeFilters.tr)
            .then(function (duplicateRecords) {
                ctrl.allDedupeRecords = duplicateRecords;
                adjustPager(duplicateRecords.totalNumber, duplicateRecords.pageNumber);

                ctrl.dedupeRecords = ctrl.isIncludeResolved ? ctrl.allDedupeRecords : getNonResolvedRecords(duplicateRecords);

                return duplicateRecords;
            })
            .catch(function (errorMessage) {
                notify.error(errorMessage);
            })
            .finally(setProcessingToFalse);
    }

    function adjustPager(total, current) {
        if (total && current) {
            ctrl.pager.total = total;
            ctrl.pager.current = current;
        }
    }

    function changeOrgUnit(newOrgUnit) {
        if (newOrgUnit && newOrgUnit.id) {
            dedupeFilters.ou = newOrgUnit.id;
            getDuplicateRecords();
        }
    }

    function changePeriod(newPeriod) {
        if (newPeriod && newPeriod.iso && angular.isString(newPeriod.iso)) {
            dedupeFilters.pe = newPeriod.iso;
            getDuplicateRecords();
        }
    }

    function changeFilterResultsTargets(newResultsTargets) {
        if ((!dedupeFilters.tr || !newResultsTargets || dedupeFilters.tr !== newResultsTargets.name)) {
            dedupeFilters.tr = newResultsTargets && angular.isString(newResultsTargets.name) ? newResultsTargets.name.toLowerCase() : undefined;
            getDuplicateRecords();
        }
    }

    function getNonResolvedRecords(dedupeRecords) {
        return dedupeRecordFilters.onlyNonResolvedRecords(dedupeRecords);
    }

    function changedIncludeResolved() {
        dedupeFilters.includeResolved = !dedupeFilters.includeResolved;

        getDuplicateRecords();
    }

    function changedOnlyTypeCrosswalk() {
        if (isAllTypeCrosswalk()) {
            ctrl.dedupeRecords = getNonResolvedRecords(ctrl.allDedupeRecords);
        } else {
            ctrl.dedupeRecords = dedupeRecordFilters.onlyTypeCrosswalk(ctrl.dedupeRecords);
        }
    }

    function isShowingAll() {
        return dedupeFilters.includeResolved;
    }

    function isAllTypeCrosswalk() {
        return ctrl.dedupeRecords.every(function (dedupeRecord) {
            return (dedupeRecord && dedupeRecord.details) && dedupeRecord.details.type === 'CROSSWALK';
        });
    }

    function reportStatusToUser(saveStatus) {
        if (saveStatus.successCount > 0) {
            notify.success(saveStatus.successCount === 1 ? 'Deduplication resolved.' : [saveStatus.successCount, ' deduplication(s) resolved.'].join(' '));
        }

        if (saveStatus.errorCount > 0) {
            notify.error(['Unable to resolve', saveStatus.successCount, 'dedupe(s).'].join(' '));
        }

        (saveStatus.errors || []).forEach(function (error) {
            notify.warning(error.message);
        });
    }

    function useMax() {
        resolveDedupeRecordsUsingPredefinedType('max', dedupeService.getMax);
    }

    function useSum() {
        resolveDedupeRecordsUsingPredefinedType('sum', dedupeService.getSum);
    }

    function resolveDedupeRecordsUsingPredefinedType(typeName, typeFunction) {
        if (!Array.isArray(ctrl.dedupeRecords)) { return; }

        ctrl.dedupeRecords.forEach(function (item) {
            item.resolve.type = typeName;
            item.resolve.value = typeFunction.apply(dedupeService, [item.data]);
        });
    }

    function resolveDuplicates() {
        ctrl.isProcessing = true;

        dedupeService.resolveDuplicates(ctrl.dedupeRecords)
            .then(function (saveStatus) {
                reportStatusToUser(saveStatus);
            })
            .catch(function (errorMessage) {
                notify.error(errorMessage);
            })
            .finally(setProcessingToFalse);
    }

    function setProcessingToFalse() {
        ctrl.isProcessing = false;
    }
}
