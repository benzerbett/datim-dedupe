angular.module('PEPFAR.dedupe').directive('dedupe', dedupeDirective);

function dedupeDirective() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'dedupe/dedupe.html',
        controller: dedupeDirectiveController,
        controllerAs: 'dedupeCtrl',
        bindToController: true,
        scope: {dedupeRecord: '='}
    };
}

function dedupeDirectiveController(dedupeService) {
    var ctrl = this;

    //Controller methods
    ctrl.getMax = getMax;
    ctrl.getSum = getSum;
    ctrl.resolveWithMax = resolveWithMax;
    ctrl.resolveWithSum = resolveWithSum;

    function getMax() {
        return dedupeService.getMax(ctrl.dedupeRecord.data);
    }

    function getSum() {
        return dedupeService.getSum(ctrl.dedupeRecord.data);
    }

    function resolveWithMax() {
        ctrl.dedupeRecord.resolve.value = getMax();
    }

    function resolveWithSum() {
        ctrl.dedupeRecord.resolve.value = getSum();
    }
}
