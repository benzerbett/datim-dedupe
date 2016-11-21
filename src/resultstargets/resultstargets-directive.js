angular.module('PEPFAR.dedupe').directive('resultsTargetsSelect', resultsTargetsSelectDirective);

function resultsTargetsSelectDirectiveController($scope, dataStore, notify, dedupeRecordFilters) {
    var ctrl = this;
    ctrl.items = [];
    ctrl.resultsTargets = undefined;

    dataStore.getPeriodSettings()
        .then(function (periodSettings) {
            ctrl.items = Object.keys(periodSettings || {})
                .map(function (key) { return key.charAt(0).toUpperCase() + key.slice(1).toLowerCase(); })
                .map(function (key) { return {name: key}; });

            if (ctrl.items.length === 1) {
                ctrl.resultsTargets = ctrl.items[0];
                dedupeRecordFilters.changeFilterResultsTargets(ctrl.items[0]);
            }
        })
        .catch(function () {
            notify.warn('Could not load period settings from dataStore.');
        });
}

function resultsTargetsSelectDirective(dedupeRecordFilters) {
    return {
        replace: true,
        restrict: 'E',
        scope: {},
        templateUrl: 'resultstargets/resultstargets.html',
        link: resultsTargetsDirectiveLink,
        controller: resultsTargetsSelectDirectiveController,
        controllerAs: 'ctrl'
    };

    function resultsTargetsDirectiveLink(scope) {
        scope.selectbox = {
            placeholder: 'Filter between Results and Targets',
            onSelect: function ($model, $item) {
                dedupeRecordFilters.changeFilterResultsTargets($item);
            }
        };
    }
}
