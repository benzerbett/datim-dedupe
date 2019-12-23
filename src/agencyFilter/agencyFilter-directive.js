angular.module('PEPFAR.dedupe').directive('agencyFilterSelect', agencyFilterSelect);

function agencyFilterSelectController($scope, dataStore, notify, dedupeRecordFilters) {
    // var ctrl = this;
    // ctrl.items = [];
    // ctrl.resultsTargets = undefined;
    //
    // dataStore.getPeriodSettings()
    //     .then(function (periodSettings) {
    //         ctrl.items = Object.keys(periodSettings || {})
    //             .map(function (key) { return key.charAt(0).toUpperCase() + key.slice(1).toLowerCase(); })
    //             .map(function (key) { return {name: key}; });
    //
    //         if (ctrl.items.length === 1) {
    //             ctrl.resultsTargets = ctrl.items[0];
    //             dedupeRecordFilters.changeFilterResultsTargets(ctrl.items[0]);
    //         }
    //     })
    //     .catch(function () {
    //         notify.warn('Could not load period settings from dataStore.');
    //     });
}

function agencyFilterSelect(dedupeRecordFilters) {
    return {
        replace: true,
        restrict: 'E',
        scope: {},
        templateUrl: 'agencyFilter/agencyFilter.html',
        link: resultsTargetsDirectiveLink,
        controller: agencyFilterSelectController,
        controllerAs: 'ctrl'
    };

    function resultsTargetsDirectiveLink(scope) {
        scope.placeholder= 'Filter between Results and Targets';
        scope.selectAgency= function ($model, $item) {
            console.log($item);
            // dedupeRecordFilters.changeFilterResultsTargets($item);
        }
    }
}
