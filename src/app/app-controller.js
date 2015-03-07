angular.module('PEPFAR.dedupe').controller('appController', appController);

function appController(dedupeService, dedupeRecordFilters, $scope, notify, DEDUPE_PAGE_SIZE) {
    var ctrl = this;
    var dedupeFilters = {
        includeResolved: false
    };

    ctrl.isFilterToggle = false;
    ctrl.isProcessing = true;
    ctrl.dedupeRecords = [];
    ctrl.allDedupeRecords = [];
    ctrl.pager = {
        current: 1,
        total: 0,
        pageSize: DEDUPE_PAGE_SIZE
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
    ctrl.pageChanged = pageChanged;

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

        dedupeService.getDuplicateRecords(dedupeFilters.ou, dedupeFilters.pe, dedupeFilters.includeResolved, dedupeFilters.tr, ctrl.pager.current)
            .then(function (duplicateRecords) {
                ctrl.allDedupeRecords = ctrl.dedupeRecords = duplicateRecords;

                adjustPager(duplicateRecords.totalNumber);
                notifyUserIfNoRecordsWereFound();

                return duplicateRecords;
            })
            .catch(function (errorMessage) {
                notify.error(errorMessage);
            })
            .finally(setProcessingToFalse);
    }

    function adjustPager(total) {
        if (total) {
            ctrl.pager.total = total;
        }
    }

    function notifyUserIfNoRecordsWereFound() {
        notify.warning('No records were found for the given criteria');
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

    function changedIncludeResolved() {
        dedupeFilters.includeResolved = !dedupeFilters.includeResolved;

        getDuplicateRecords();
    }

    function pageChanged() {
        return getDuplicateRecords();
    }

    function changedOnlyTypeCrosswalk() {
        if (isAllTypeCrosswalk()) {
            ctrl.dedupeRecords = ctrl.allDedupeRecords;
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
