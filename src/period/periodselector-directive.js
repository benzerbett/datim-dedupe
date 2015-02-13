angular.module('PEPFAR.dedupe').directive('periodSelector', periodSelectorDirective);

function periodSelectorDirective(periodService) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            onPeriodSelected: '='
        },
        templateUrl: 'period/periodselector.html',
        link: function (scope) {
            periodService.setPeriodType('FinancialApril');

            scope.period = {
                selectedPeriod: undefined,
                periodsRecentFirst: periodService.getPastPeriodsRecentFirst()
            };

            scope.changePeriod = function ($item) {
                if ($item === undefined) { return; }
                window.console.log($item);
                scope.onPeriodSelected($item);
            };
        }
    };
}
