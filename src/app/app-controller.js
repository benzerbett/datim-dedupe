angular.module('PEPFAR.dedupe').controller('appController', appController);

function appController(dedupeService, $scope, notify) {
    var ctrl = this;

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
        dedupeService.getDuplicateRecords()
            .then(function (duplicateRecords) {
                ctrl.allDedupeRecords = duplicateRecords;
                return duplicateRecords;
            })
            .then(function (dedupeRecords) {
                if (ctrl.isIncludeResolved) {
                    return dedupeRecords;
                }
                return (ctrl.dedupeRecords = getNonResolvedRecords(dedupeRecords));
            })
            .finally(setProcessingToFalse);
    }

    function getNonResolvedRecords(dedupeRecords) {
        return dedupeRecords.filter(function (dedupeRecord) {
            return (dedupeRecord && dedupeRecord.resolve) && !dedupeRecord.resolve.isResolved;
        });
    }

    function changedIncludeResolved() {
        if (isShowingAll()) {
            ctrl.dedupeRecords = getNonResolvedRecords(ctrl.allDedupeRecords);
        } else {
            ctrl.dedupeRecords = ctrl.allDedupeRecords;
        }
    }

    function isShowingAll() {
        return ctrl.allDedupeRecords.length === ctrl.dedupeRecords.length;
    }

    //TODO: Write tests for this
    function reportStatusToUser(saveStatus) {
        if (saveStatus.successCount > 0) {
            notify.success(['Successfully saved', saveStatus.successCount, 'dedupe(s).'].join(' '));
        }

        if (saveStatus.errorCount > 0) {
            notify.error(['Unable to save', saveStatus.successCount, 'dedupe(s).'].join(' '));
        }

        saveStatus.errors.forEach(function (error) {
            notify.warning(error.message);
        });
    }

    function useMax() {
        if (!Array.isArray(ctrl.dedupeRecords)) {
            return;
        }

        ctrl.dedupeRecords.forEach(function (item) {
            item.resolve.type = 'max';
            item.resolve.value = dedupeService.getMax(item.data);
        });
    }

    function useSum() {
        if (!Array.isArray(ctrl.dedupeRecords)) {
            return;
        }

        ctrl.dedupeRecords.forEach(function (item) {
            item.resolve.type = 'sum';
            item.resolve.value = dedupeService.getSum(item.data);
        });
    }

    function resolveDuplicates() {
        ctrl.isProcessing = true;

        dedupeService.resolveDuplicates(ctrl.dedupeRecords)
            .then(function (saveStatus) {
                reportStatusToUser(saveStatus); //TODO: Write tests for this
            })
            .catch(function (saveStatus) {
                reportStatusToUser(saveStatus); //TODO: Write tests for this
            })
            .finally(setProcessingToFalse);
    }

    function setProcessingToFalse() {
        ctrl.isProcessing = false;
    }
}
