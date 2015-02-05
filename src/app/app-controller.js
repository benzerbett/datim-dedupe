angular.module('PEPFAR.dedupe').controller('appController', appController);

function appController(dedupeService) {
    var ctrl = this;

    ctrl.isProcessing = true;
    ctrl.dedupeRecords = [];

    //Controller methods
    ctrl.useMax = useMax;
    ctrl.useSum = useSum;
    ctrl.resolveDuplicates = resolveDuplicates;

    //Call init method to get data from services
    initialise();

    function initialise() {
        dedupeService.getDuplicateRecords()
            .then(function (duplicateRecords) {
                ctrl.dedupeRecords = duplicateRecords;
            })
            .finally(setProcessingToFalse);
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
