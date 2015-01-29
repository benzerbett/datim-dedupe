angular.module('PEPFAR.dedupe', []) //;
.controller('appController', function (dedupeService, $scope) {
        var ctrl = this;

        ctrl.print = function (value) {
            window.console.log(JSON.stringify(value, null, 4));
        };

        $scope.$watch(function () {
            return ctrl.dedupeRecords;
        }, function (newVal, oldVal) {
            if (newVal !== oldVal) {
                ctrl.print(newVal);
            }
        }, true);

        ctrl.dedupeRecords = [{
            details: {
                orgUnitName: 'Glady\'s clinic',
                timePeriodName: 'FY 2014'
            },
            data: [
                {agency: 'USAID', partner: 'PartnerA', value: 60},
                {agency: 'USAID', partner: 'PartnerB', value: 40},
                {agency: 'USAID', partner: 'PartnerC', value: 20}
            ],
            resolve: {
                type: undefined,
                value: undefined
            }
        }, {
            details: {
                orgUnitName: 'Glady\'s clinic',
                timePeriodName: 'FY 2014'
            },
            data: [
                {agency: 'CDC', partner: 'PartnerA', value: 12},
                {agency: 'CDC', partner: 'PartnerD', value: 30},
                {agency: 'CDC', partner: 'PartnerG', value: 10}
            ],
            resolve: {
                type: undefined,
                value: undefined
            }
        }];

        ctrl.useMax = function () {
            ctrl.dedupeRecords.forEach(function (item) {
                item.resolve.type = 'max';
                item.resolve.value = dedupeService.getMax(item.data);
            });
        };

        ctrl.useSum = function () {
            ctrl.dedupeRecords.forEach(function (item) {
                item.resolve.type = 'sum';
                item.resolve.value = dedupeService.getSum(item.data);
            });
        };
    });
