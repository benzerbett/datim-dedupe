angular.module('PEPFAR.dedupe').directive('resultsTargetsSelect', resultsTargetsSelectDirective);

function resultsTargetsSelectDirective(dedupeRecordFilters) {
    return {
        replace: true,
        restrict: 'E',
        scope: {},
        templateUrl: 'resultstargets/resultstargets.html',
        link: resultsTargetsDirectiveLink
    };

    function resultsTargetsDirectiveLink(scope) {
        scope.selectbox = {
            items: [{name: 'Results'}, {name: 'Targets'}],
            placeholder: 'Filter between Results and Targets',
            onSelect: function ($model, $item) {
                dedupeRecordFilters.changeFilterResultsTargets($item);
            }
        };
    }
}
