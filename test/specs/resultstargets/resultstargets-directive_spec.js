describe('Results targets select directive', function () {
    var $scope;
    var innerScope;
    var element;
    var $rootScope;
    var dedupeServiceMock;
    var $compile;

    var periodSettingsResponse;

    beforeEach(module('resultstargets/resultstargets.html'));
    beforeEach(module('PEPFAR.dedupe', function ($provide) {
        periodSettingsResponse = {
            targets: {
                '2016Oct': {
                    start: 1473412860,
                    end: 1483176060,
                    datasets: ['tCIW2VFd8uu', 'lbwuIo56YoG', 'qRvKHvlzNdv', 'JXKUYJqmyDd', 'Om3TJBRH8G8', 'xxo1G5V1JG2']
                }
            },
            results: {
                '2016Q3': {
                    start: 1473412860,
                    end: 1483176060,
                    datasets: ['lD9O8vQgH8R', 'ovYEbELCknv', 'hIm0HGCKiPv', 'i29foJcLY9Y', 'j1i6JjOpxEq', 'STL4izfLznL', 'asHh1YkxBU5']
                }
            }
        };

        $provide.factory('dedupeRecordFilters', function () {
            return {
                changeFilterResultsTargets: jasmine.createSpy('dedupeRecordFilters.updateResultsTargetsFilter')
            };
        });

        $provide.factory('dataStore', function ($q) {
            return {
                getPeriodSettings: function () {
                    return $q.when(periodSettingsResponse);
                }
            };
        });
    }));

    beforeEach(inject(function ($injector) {
        $compile = $injector.get('$compile');
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

    it('should only show targets in the dropdown when results is not available in the periodSettings', inject(function () {
        delete periodSettingsResponse.results;

        element = angular.element('<results-targets-select></results-targets-select>');

        $scope = $rootScope.$new();

        $compile(element)($scope);
        $rootScope.$digest();

        innerScope = angular.element(element[0].querySelector('.ui-select-bootstrap')).scope();
        innerScope.$select.open = true;
        innerScope.$apply();

        var elements = element[0].querySelectorAll('.ui-select-choices-row');

        expect(elements.length).toBe(1);
    }));
});
