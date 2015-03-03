describe('Results targets select directive', function () {
    var $scope;
    var innerScope;
    var element;
    var $rootScope;

    beforeEach(module('resultstargets/resultstargets.html'));
    beforeEach(module('PEPFAR.dedupe'));

    beforeEach(inject(function ($injector) {
        var $compile = $injector.get('$compile');
        $rootScope = $injector.get('$rootScope');

        element = angular.element('<results-targets-select on-results-targets-selected="ctrl.callbackSpy"></results-targets-select>');

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
        expect(element).toHaveClass('results-targets-select');
    });

    it('should have all the elements in the list', function () {
        var elements = element[0].querySelectorAll('.ui-select-choices-row');

        expect(elements.length).toBe(3);
    });

    it('should call the passed callback when the selection is changed', function () {
        innerScope.selectbox.onSelect();

        expect($scope.ctrl.callbackSpy.calls.count()).toBe(1);
    });

    it('should reset the choice back to undefined after the first option is slected', function () {
        innerScope.selectbox.resultsTargets = innerScope.selectbox.items[1];

        innerScope.selectbox.onSelect(innerScope.selectbox.resultsTargets, innerScope.selectbox.items[0]);
        innerScope.$apply();

        expect(innerScope.selectbox.resultsTargets).not.toBeDefined();
    });
});
