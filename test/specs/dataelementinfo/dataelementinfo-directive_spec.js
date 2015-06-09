describe('Dedupe data element description', function () {
    var $scope;
    var element;
    var $rootScope;
    var $httpBackend;
    var displayDescriptionRequest;

    beforeEach(module('PEPFAR.dedupe'));

    beforeEach(inject(function ($injector) {
        var $compile = $injector.get('$compile');
        $rootScope = $injector.get('$rootScope');
        $httpBackend = $injector.get('$httpBackend');
        element = angular.element('<div dataelement-info dataelement-id="dataElementId"></div>');

        displayDescriptionRequest = $httpBackend.expectGET('/dhis/api/dataElements/N4TfJIX2bNK/displayDescription')
            .respond(200, {
                displayDescription: 'Target the total number of blood units that were donated in the country network.'
            });

        $scope = $rootScope.$new();
        $scope.dataElementId = 'N4TfJIX2bNK';

        $compile(element)($scope);
        $scope.$digest();
    }));

    it('should compile', function () {
        expect(element).toHaveClass('data-element-info-wrap');
    });

    it('should not have any data for this dataElementDescription', function () {
        expect(element.data.dataElementDescription).not.toBeDefined();
    });

    it('should have loaded data for this dataElement', function () {
        element.trigger('mouseenter');
        $httpBackend.flush();

        expect($scope.dataElementDescription).not.toBeDefined();
        expect(element.scope().dataElementDescription).toBeDefined();
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
        var dataElementHoverElement;

        beforeEach(function () {
            dataElementHoverElement = element.find('.data-element-hover');
        });

        it('should have added the hover element to the page', function () {
            expect(dataElementHoverElement.length).toEqual(1);
        });

        it('should have added the hover element to the page', function () {
            expect(dataElementHoverElement).toHaveClass('data-element-hover');
        });
    });

    describe('should display the data element description', function () {
        var dataElementHoverElement;

        beforeEach(function () {
            element.trigger('mouseenter');
            $httpBackend.flush();

            dataElementHoverElement = element.find('.data-element-hover');
        });

        it('should have set the description onto the description element', function () {
            var descriptionElement = dataElementHoverElement.find('p');

            expect(descriptionElement[0].textContent).toEqual('Target the total number of blood units that were donated in the country network.');
        });
    });

    describe('request failure', function () {
        var dataElementHoverElement;

        beforeEach(function () {
            displayDescriptionRequest.respond(200, {});

            element.trigger('mouseenter');
            $httpBackend.flush();

            dataElementHoverElement = element.find('.data-element-hover');
        });

        it('should display correct text when no discription has been found', function () {
            var descriptionElement = dataElementHoverElement.find('p');

            expect(descriptionElement[0].textContent).toEqual('No description found.');
        });
    });
});
