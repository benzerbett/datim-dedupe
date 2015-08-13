angular.module('PEPFAR.dedupe').directive('periodSelector', periodSelectorDirective);

function periodSelectorDirective(periodService, dedupeRecordFilters) {
    return {
        restrict: 'E',
        replace: true,
        scope: {},
        templateUrl: 'period/periodselector.html',
        link: function (scope) {
            scope.period = {
                selectedPeriod: undefined,
                periodsRecentFirst: []
            };

            scope.$watch(function () {
                return dedupeRecordFilters.getResultsTargetsFilter();
            }, function (newVal, oldVal) {
                var periodType = 'FinancialOct';

                if (!angular.isString(newVal)  || angular.isUndefined(newVal) || newVal === oldVal) { return; }

                if (newVal.toLowerCase() === 'results') {
                    periodType = 'Quarterly';
                }

                periodService.setPeriodType(periodType)
                    .then(function () {
                        scope.period.periodsRecentFirst = periodService.getPastPeriodsRecentFirst();
                        if (scope.period.periodsRecentFirst.length > 0) {

                            scope.period.selectedPeriod = scope.period.periodsRecentFirst[1];
                            scope.changePeriod(scope.period.selectedPeriod);
                        }
                    });
            });

            scope.changePeriod = function ($item) {
                if ($item === undefined) { return; }
                dedupeRecordFilters.changePeriodFilter($item);
            };
        }
    };
}
