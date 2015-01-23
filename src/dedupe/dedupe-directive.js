angular.module('PEPFAR.dedupe').directive('dedupe', dedupeDirective);

function dedupeDirective() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'dedupe/dedupe.html'
    };
}
