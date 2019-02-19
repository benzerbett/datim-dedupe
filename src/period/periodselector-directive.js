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

                periodService.setPeriodType(periodType, dedupeRecordFilters.getResultsTargetsFilter(), dedupeRecordFilters.getOrgUnit())
                    .then(function (periodSettings) {
                        scope.period.periodsRecentFirst = periodService.getPastPeriodsRecentFirst();

                        function getDefaultPeriod(periodsRecentFirst) {
                            return periodsRecentFirst
                                .filter(function (period) {
                                    return period.iso === periodSettings.default;
                                })
                                .reduce(function (acc, period) {
                                    return period;
                                }, undefined);
                        }

                        function hasDefaultPeriod(periodsRecentFirst, periodSettings) {
                            return periodSettings.default && getDefaultPeriod(periodsRecentFirst);
                        }

                        if (hasDefaultPeriod(scope.period.periodsRecentFirst, periodSettings)) {
                            scope.period.selectedPeriod = getDefaultPeriod(scope.period.periodsRecentFirst);
                            scope.changePeriod(scope.period.selectedPeriod);
                        } else {
                            scope.period.selectedPeriod = scope.period.periodsRecentFirst[periodSettings.future || 0];
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
