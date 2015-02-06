angular.module('PEPFAR.dedupe').controller('appController', appController);

function appController(dedupeService, $scope) {
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

    //Call init method to get data from services
    initialise();

    $scope.$on('DEDUPE_DIRECTIVE.resolve', function (event, dedupeRecordId/*, saveStatus*/) {
        ctrl.dedupeRecords = ctrl.dedupeRecords.filter(function (dedupeRecord) {
            return dedupeRecord.id !== dedupeRecordId;
        });
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
        if (ctrl.isIncludeResolved) {
            ctrl.dedupeRecords = ctrl.allDedupeRecords;
        } else {
            ctrl.dedupeRecords = getNonResolvedRecords(ctrl.allDedupeRecords);
        }

        window.console.log(ctrl.dedupeRecords);
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
            .finally(setProcessingToFalse);
    }

    function setProcessingToFalse() {
        ctrl.isProcessing = false;
    }
}
