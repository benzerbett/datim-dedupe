describe('Organisation unit select directive', function () {
    var fixtures = window.fixtures;
    var $scope;
    var element;
    var $rootScope;

    beforeEach(module('organisationunits/organisation-select.html'));
    beforeEach(module('PEPFAR.dedupe', function ($provide) {
        $provide.service('organisationUnitService', function () {
            this.getOrganisationUnitsForLevel = function () {
                return {
                    then: function (callback) {
                        callback(fixtures.get('organisationUnits').organisationUnits);
                    }
                };
            };
        });

        $provide.factory('currentUserService', function ($q) {
            return {
                getCurrentUser: function () {
                    return $q.when({
                        organisationUnits: [{
                            id:'W73PRZcjFIU',
                            name:'Indonesia',
                            code:'ID'
                        }]
                    });
                }
            };
        });
    }));

    beforeEach(inject(function ($injector) {
        var innerScope;
        var $compile = $injector.get('$compile');
        $rootScope = $injector.get('$rootScope');

        element = angular.element('<organisation-unit-select on-orgunit-selected="ctrl.callbackSpy"></organisation-unit-select>');

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
        expect(element).toHaveClass('organisation-unit-select');
    });

    it('should have all the elements in the list', function () {
        var elements = element[0].querySelectorAll('.ui-select-choices-row');

        expect(elements.length).toBe(fixtures.get('organisationUnits').organisationUnits.length);
    });

    it('should call the callback when the users organisation unit is found within the orgunit list', function () {
        expect($scope.ctrl.callbackSpy.calls.argsFor(0)[0].id).toBe('W73PRZcjFIU');
    });
});
