describe('Organisation unit select directive', function () {
    var fixtures = window.fixtures;
    var $scope;
    var element;
    var $rootScope;
    var innerScope;
    var dedupeRecordFiltersMock;
    var periodServiceMock;

    beforeEach(module('period/periodselector.html'));
    beforeEach(module('PEPFAR.dedupe', function ($provide) {
        $provide.factory('dedupeRecordFilters', function () {
            return {
                changePeriodFilter: jasmine.createSpy('dedupeRecordFilters.changePeriodFilter'),
                getResultsTargetsFilter: jasmine.createSpy('dedupeRecordFilters.getResultsTargetsFilter')
                    .and.returnValue(undefined)
            };
        });

        $provide.factory('periodService', function ($q) {
            return {
                getPastPeriodsRecentFirst: jasmine.createSpy('periodService.getPastPeriodsRecentFirst')
                    .and.returnValue(fixtures.get('generatedPeriods')),
                setPeriodType: jasmine.createSpy('periodService.setPeriodType')
                    .and.returnValue($q.when(true))
            };
        });
    }));

    beforeEach(inject(function ($injector) {
        var $compile = $injector.get('$compile');
        $rootScope = $injector.get('$rootScope');
        dedupeRecordFiltersMock = $injector.get('dedupeRecordFilters');
        periodServiceMock = $injector.get('periodService');

        element = angular.element('<period-selector></period-selector>');

        $scope = $rootScope.$new();

        $compile(element)($scope);
        $rootScope.$digest();

        dedupeRecordFiltersMock.getResultsTargetsFilter.and.returnValue('Targets');

        innerScope = angular.element(element[0].querySelector('.ui-select-bootstrap')).scope();
        innerScope.$select.open = true;
        innerScope.$apply();
    }));

    it('should compile', function () {
        expect(element).toHaveClass('period-selector');
    });

    it('should have all the elements in the list', function () {
        var elements = element[0].querySelectorAll('.ui-select-choices-row');

        expect(elements.length).toBe(fixtures.get('generatedPeriods').length);
    });

    describe('changePeriod', function () {
        beforeEach(function () {
            //Reset spy as it is called once on initialise
            dedupeRecordFiltersMock.changePeriodFilter.calls.reset();
        });

        it('should call the changePeriod method on the dedupeRecord', function () {
            innerScope.changePeriod({});

            expect(dedupeRecordFiltersMock.changePeriodFilter).toHaveBeenCalled();
        });

        it('should not call the changePeriod method when the period is undefined', function () {
            innerScope.changePeriod(undefined);

            expect(dedupeRecordFiltersMock.changePeriodFilter).not.toHaveBeenCalled();
        });

        it('should call the changePeriod method with the correct period', function () {
            var myPeriod = {iso: '2014Oct'};

            innerScope.changePeriod(myPeriod);

            expect(dedupeRecordFiltersMock.changePeriodFilter).toHaveBeenCalledWith(myPeriod);
        });
    });

    describe('changed period type', function () {
        it('should update the values when the getResultsTargetsFilter changes', function () {
            dedupeRecordFiltersMock.getResultsTargetsFilter.and.returnValue('Results');
            $scope.$apply();

            expect(periodServiceMock.setPeriodType).toHaveBeenCalledWith('Quarterly');
        });
    });
});
