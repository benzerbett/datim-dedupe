describe('Organisation unit select directive', function () {
    var fixtures = window.fixtures;
    var $scope;
    var innerScope;
    var element;
    var $rootScope;
    var dedupeRecordFiltersMock;

    beforeEach(module('organisationunits/organisation-select.html'));
    beforeEach(module('PEPFAR.dedupe', function ($provide) {
        $provide.service('dedupeRecordFilters', function () {
            return {
                changeOrganisationUnit: jasmine.createSpy('dedupeRecordFilters.changeOrganisationUnit')
            };
        });

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

        $provide.factory('notify', function () {
            return {
                error: jasmine.createSpy('notify.error')
            };
        });
    }));

    beforeEach(inject(function ($injector) {
        var $compile = $injector.get('$compile');
        $rootScope = $injector.get('$rootScope');
        dedupeRecordFiltersMock = $injector.get('dedupeRecordFilters');

        element = angular.element('<organisation-unit-select></organisation-unit-select>');

        $scope = $rootScope.$new();

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
        expect(dedupeRecordFiltersMock.changeOrganisationUnit.calls.argsFor(0)[0].id).toBe('W73PRZcjFIU');
    });

    it('should call the passed callback when the selection is changed', function () {
        innerScope.selectbox.onSelect();

        expect(dedupeRecordFiltersMock.changeOrganisationUnit.calls.count()).toBe(2);
    });

    describe('failed current user', function () {
        var notifyMock;

        beforeEach(inject(function ($injector) {
            var $compile = $injector.get('$compile');
            var currentUserServiceMock = $injector.get('currentUserService');
            var $q = $injector.get('$q');
            $rootScope = $injector.get('$rootScope');
            notifyMock = $injector.get('notify');

            currentUserServiceMock.getCurrentUser = function () {
                return $q.reject();
            };

            element = angular.element('<organisation-unit-select on-orgunit-selected="ctrl.callbackSpy"></organisation-unit-select>');

            $scope = $rootScope.$new();

            $scope.ctrl = {
                callbackSpy: jasmine.createSpy('callbackSpy')
            };

            $compile(element)($scope);
            $rootScope.$digest();
        }));

        it('should call the notify error on failed getting the current user', function () {
            expect(notifyMock.error).toHaveBeenCalledWith('Failed to load current user object');
        });
    });

    describe('isGlobalOrgUnit', function () {
        it('should be a function', function () {
            expect(innerScope.isGlobalOrgUnit).toEqual(jasmine.any(Function));
        });

        it('should return true when current user organisationUnits[0].id and dataViewOrganisationUnits[0].id match', function () {
            var mockCurrentUser = {
                organisationUnits: [{id: 'ybg3MO3hcf4'}],
                dataViewOrganisationUnits: [{id: 'ybg3MO3hcf4'}]
            };
            expect(innerScope.isGlobalOrgUnit(mockCurrentUser)).toBe(true);
        });

        it('should return false when current user organisationUnits[0].id differs from dataViewOrganisationUnits[0].id', function () {
            var mockCurrentUser = {
                organisationUnits: [{id: 'ybg3MO3hc99'}],
                dataViewOrganisationUnits: [{id: 'ybg3MO3hcf4'}]
            };
            expect(innerScope.isGlobalOrgUnit(mockCurrentUser)).toBe(false);
        });

        it('should return false when current user does not have dataViewOrganisationUnits', function () {
            var mockCurrentUser = {
                organisationUnits: [{id: 'ybg3MO3hcf4'}]
            };
            expect(innerScope.isGlobalOrgUnit(mockCurrentUser)).toBe(false);
            mockCurrentUser = {
                organisationUnits: [{id: 'ybg3MO3hcf4'}],
                dataViewOrganisationUnits: []
            };
            expect(innerScope.isGlobalOrgUnit(mockCurrentUser)).toBe(false);
        });
    });

    describe('isUserHasAnOrgUnit', function () {
        it('should be a function', function () {
            expect(innerScope.isUserHasAnOrgUnit).toEqual(jasmine.any(Function));
        });

        it('should return false when current user does not have organisationUnits', function () {
            var mockCurrentUser = {
                dataViewOrganisationUnits: [{id: 'ybg3MO3hcf4'}]
            };
            expect(innerScope.isUserHasAnOrgUnit(mockCurrentUser)).toBeFalsy();
            mockCurrentUser = {
                organisationUnits: [],
                dataViewOrganisationUnits: []
            };
            expect(innerScope.isGlobalOrgUnit(mockCurrentUser)).toBeFalsy();
            mockCurrentUser = {
                organisationUnits: [{}],
                dataViewOrganisationUnits: []
            };
            expect(innerScope.isGlobalOrgUnit(mockCurrentUser)).toBeFalsy();
        });
    });
});
