angular.module('PEPFAR.dedupe').controller('appController', appController);

function appController(dedupeService, dedupeRecordFilters, $scope, notify) {
    var ctrl = this;
    var dedupeFilters = {};

    ctrl.isFilterToggle = false;
    ctrl.isProcessing = true;
    ctrl.isIncludeResolved = false;
    ctrl.dedupeRecords = [];
    ctrl.allDedupeRecords = [];

    //Controller methods
    ctrl.useMax = useMax;
    ctrl.useSum = useSum;
    ctrl.resolveDuplicates = resolveDuplicates;
    ctrl.changedIncludeResolved = changedIncludeResolved;
    ctrl.isShowingAll = isShowingAll;
    ctrl.changeOrgUnit = changeOrgUnit;
    ctrl.changePeriod = changePeriod;
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

        dedupeService.getDuplicateRecords(dedupeFilters.ou, dedupeFilters.pe)
            .then(function (duplicateRecords) {
                ctrl.allDedupeRecords = duplicateRecords;

                ctrl.dedupeRecords = ctrl.isIncludeResolved ? ctrl.allDedupeRecords : getNonResolvedRecords(duplicateRecords);

                return duplicateRecords;
            })
            .catch(function (errorMessage) {
                notify.error(errorMessage);
            })
            .finally(setProcessingToFalse);
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

    function getNonResolvedRecords(dedupeRecords) {
        return dedupeRecordFilters.onlyNonResolvedRecords(dedupeRecords);
    }

    function changedIncludeResolved() {
        if (isShowingAll()) {
            ctrl.dedupeRecords = getNonResolvedRecords(ctrl.allDedupeRecords);
        } else {
            ctrl.dedupeRecords = ctrl.allDedupeRecords;
        }
    }

    function changedOnlyTypeCrosswalk() {
        if (isAllTypeCrosswalk()) {
            ctrl.dedupeRecords = getNonResolvedRecords(ctrl.allDedupeRecords);
        } else {
            ctrl.dedupeRecords = dedupeRecordFilters.onlyTypeCrosswalk(ctrl.dedupeRecords);
        }
    }

    function isShowingAll() {
        return ctrl.allDedupeRecords.length === ctrl.dedupeRecords.length;
    }

    function isAllTypeCrosswalk() {
        return ctrl.dedupeRecords.every(function (dedupeRecord) {
            return (dedupeRecord && dedupeRecord.details) && dedupeRecord.details.type === 'CROSSWALK';
        });
    }

    //TODO: Write tests for this
    function reportStatusToUser(saveStatus) {
        if (saveStatus.successCount > 0) {
            notify.success(['Successfully saved', saveStatus.successCount, 'dedupe(s).'].join(' '));
        }

        if (saveStatus.errorCount > 0) {
            notify.error(['Unable to save', saveStatus.successCount, 'dedupe(s).'].join(' '));
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
                reportStatusToUser(saveStatus); //TODO: Write tests for this
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
