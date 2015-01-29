angular.module('PEPFAR.dedupe').directive('dedupe', dedupeDirective);

function dedupeDirective() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'dedupe/dedupe.html',
        controller: dedupeDirectiveController,
        controllerAs: 'dedupeCtrl',
        scope: {dedupeRecord: '='}
    };
}

function dedupeDirectiveController($scope, dedupeService) {
    var ctrl = this;

    //Properties
    ctrl.details = $scope.dedupeRecord.details;
    ctrl.data = $scope.dedupeRecord.data;
    ctrl.resolve = $scope.dedupeRecord.resolve;

    //Controller methods
    ctrl.getMax = getMax;
    ctrl.getSum = getSum;
    ctrl.resolveWithMax = resolveWithMax;
    ctrl.resolveWithSum = resolveWithSum;

    function getMax() {
        return dedupeService.getMax(ctrl.data);
    }

    function getSum() {
        return dedupeService.getSum(ctrl.data);
    }

    function resolveWithMax() {
        ctrl.resolve.value = getMax();
    }

    function resolveWithSum() {
        ctrl.resolve.value = getSum();
    }
}
