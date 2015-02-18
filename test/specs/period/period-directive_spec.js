describe('Organisation unit select directive', function () {
    var fixtures = window.fixtures;
    var $scope;
    var element;
    var $rootScope;

    beforeEach(module('period/periodselector.html'));
    beforeEach(module('PEPFAR.dedupe', function ($provide) {
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
        var innerScope;
        var $compile = $injector.get('$compile');
        $rootScope = $injector.get('$rootScope');

        element = angular.element('<period-selector on-period-selected="ctrl.callbackSpy"></period-selector>');

        $scope = $rootScope.$new();

        $scope.ctrl = {
            callbackSpy: jasmine.createSpy('callbackSpy')
        };

        $compile(element)($scope);
        $rootScope.$digest();

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

    it('should call the period change when more than 1 period is found', function () {
        expect($scope.ctrl.callbackSpy.calls.argsFor(0)[0]).toEqual(jasmine.objectContaining(fixtures.get('generatedPeriods')[0]));
    });
});
