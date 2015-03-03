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
            scope.period = {
                selectedPeriod: undefined,
                periodsRecentFirst: []
            };

            periodService.setPeriodType('FinancialOct')
                .then(function () {
                    scope.period.periodsRecentFirst = periodService.getPastPeriodsRecentFirst();
                    if (scope.period.periodsRecentFirst.length > 0) {
                        scope.period.selectedPeriod = scope.period.periodsRecentFirst[0];
                        scope.changePeriod(scope.period.selectedPeriod);
                    }
                });

            scope.changePeriod = function ($item) {
                if ($item === undefined) { return; }
                scope.onPeriodSelected($item);
            };
        }
    };
}
