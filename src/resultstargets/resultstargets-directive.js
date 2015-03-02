angular.module('PEPFAR.dedupe').directive('resultsTargetsSelect', resultsTargetsSelectDirective);

function resultsTargetsSelectDirective() {
    return {
        replace: true,
        restrict: 'E',
        scope: {
            onResultsTargetsSelected: '='
        },
        templateUrl: 'resultstargets/resultstargets.html',
        link: resultsTargetsDirectiveLink
    };
}

function resultsTargetsDirectiveLink(scope) {
    scope.selectbox = {
        items: [{name: '-- No Filter --'}, {name: 'Results'}, {name: 'Targets'}],
        placeholder: 'Filter between Results and Targets',
        onSelect: function ($model, $item) {
            if ($item === scope.selectbox.items[0]) {
                $item = scope.selectbox.resultsTargets = undefined;
            }
            scope.onResultsTargetsSelected($item);
        }
    };
}
