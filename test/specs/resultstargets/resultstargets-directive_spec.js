describe('Results targets select directive', function () {
    var $scope;
    var innerScope;
    var element;
    var $rootScope;
    var dedupeServiceMock;

    beforeEach(module('resultstargets/resultstargets.html'));
    beforeEach(module('PEPFAR.dedupe', function ($provide) {
        $provide.factory('dedupeRecordFilters', function () {
            return {
                changeFilterResultsTargets: jasmine.createSpy('dedupeRecordFilters.updateResultsTargetsFilter')
            };
        });
    }));

    beforeEach(inject(function ($injector) {
        var $compile = $injector.get('$compile');
        $rootScope = $injector.get('$rootScope');
        dedupeServiceMock = $injector.get('dedupeRecordFilters');

        element = angular.element('<results-targets-select></results-targets-select>');

        $scope = $rootScope.$new();

        $compile(element)($scope);
        $rootScope.$digest();

        innerScope = angular.element(element[0].querySelector('.ui-select-bootstrap')).scope();
        innerScope.$select.open = true;
        innerScope.$apply();
    }));

    it('should compile', function () {
        expect(element).toHaveClass('results-targets-select');
    });

    it('should have all the elements in the list', function () {
        var elements = element[0].querySelectorAll('.ui-select-choices-row');

        expect(elements.length).toBe(2);
    });

    it('should call the updateResultsTargetsFilter method on the dedupeRecordFilterService', function () {
        innerScope.selectbox.onSelect();

        expect(dedupeServiceMock.changeFilterResultsTargets).toHaveBeenCalled();
    });

    it('should call the updateResultsTargetsFilter with the correct data object', function () {
        innerScope.selectbox.onSelect({name: 'Results'}, {name: 'Results'});

        expect(dedupeServiceMock.changeFilterResultsTargets).toHaveBeenCalledWith({name: 'Results'});
    });
});
