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

function dedupeDirectiveController($scope) {
    var ctrl = this;

    ctrl.details = $scope.dedupeRecord.details;
    ctrl.data = $scope.dedupeRecord.data;
}
