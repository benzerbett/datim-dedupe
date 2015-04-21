describe('Dedupe orgunit parents', function () {
    var $scope;
    var element;
    var $rootScope;
    var $httpBackend;

    beforeEach(module('dedupe/dedupe.html'));
    beforeEach(module('PEPFAR.dedupe'));

    beforeEach(inject(function ($injector) {
        var $compile = $injector.get('$compile');
        $rootScope = $injector.get('$rootScope');
        $httpBackend = $injector.get('$httpBackend');
        element = angular.element('<div orgunit-parents-hover org-unit-id="orgUnitId"></div>');

        $httpBackend.expectGET('/dhis/api/organisationUnits/N4TfJIX2bNK?fields=level,name&includeAncestors=true')
            .respond(200, {
                organisationUnits: [
                    {id: 'N4TfJIX2bNK', level: 6, name: 'Ostrich Site'},
                    {id: 'LnGaK6y98gC', level: 5, name: 'Bird District'},
                    {id: 'L3L1p64KPdC', level: 4, name: 'Animal Region'},
                    {id: 'KKFzPM8LoXs', level: 3, name: 'Demoland'},
                    {id: 'gOfQFn8TbKN', level: 2, name: 'Demoana'},
                    {id: 'ybg3MO3hcf4', level: 1, name: 'Global'}
                ]
            });

        $scope = $rootScope.$new();
        $scope.orgUnitId = 'N4TfJIX2bNK';

        $compile(element)($scope);
        $scope.$digest();
    }));

    it('should compile', function () {
        expect(element).toHaveClass('orgunit-parents-wrap');
    });

    it('should not have any data for this orgunit', function () {
        expect(element.data.orgUnits).not.toBeDefined();
    });

    it('should have loaded data for this orgunit', function () {
        element.trigger('mouseenter');
        $httpBackend.flush();

        expect($scope.orgUnits).not.toBeDefined();
        expect(element.scope().orgUnits).toBeDefined();
    });

    it('should not request the same list twice', function () {
        element.trigger('mouseenter');
        $httpBackend.flush();

        element.trigger('mouseenter');
        function shouldThrow() {
            $httpBackend.flush();
        }

        expect(shouldThrow).toThrowError('No pending request to flush !');
    });

    it('should not launch the request twice', function () {
        element.trigger('mouseenter');
        element.trigger('mouseenter');

        $httpBackend.flush();

        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    describe('hover element', function () {
        var orgUnitHoverElement;

        beforeEach(function () {
            orgUnitHoverElement = element.find('.orgunit-hover');
        });

        it('should have added the hover element to the page', function () {
            expect(orgUnitHoverElement.length).toEqual(1);
        });

        it('should have added the hover element to the page', function () {
            expect(orgUnitHoverElement).toHaveClass('orgunit-hover');
        });
    });

    describe('should display the orgunits in a ul list', function () {
        var orgUnitHoverElement;

        beforeEach(function () {
            element.trigger('mouseenter');
            $httpBackend.flush();

            orgUnitHoverElement = element.find('.orgunit-hover');
        });

        it('should have the correct amount of orgunits', function () {
            expect(orgUnitHoverElement.find('li').length).toEqual(4);
        });

        it('should have set the names onto the list elements', function () {
            var listElements = orgUnitHoverElement.find('li');

            expect(listElements[0].textContent).toEqual('Demoland');
            expect(listElements[1].textContent).toEqual('Animal Region');
            expect(listElements[2].textContent).toEqual('Bird District');
            expect(listElements[3].textContent).toEqual('Ostrich Site');
        });
    });
});
