describe('Dedupe service', function () {
    var currentUserService;
    var $httpBackend;
    var userRequest;
    var notifyMock;

    beforeEach(module('PEPFAR.dedupe', function ($provide) {
        $provide.factory('notify', function () {
            return {
                error: jasmine.createSpy('notify.error')
            };
        });
    }));

    beforeEach(inject(function ($injector) {
        notifyMock = $injector.get('notify');
        currentUserService = $injector.get('currentUserService');
        $httpBackend = $injector.get('$httpBackend');

        userRequest = $httpBackend.expectGET('/dhis/api/me?fields=:all,userCredentials%5B:owner,!userGroupAccesses%5D,!userGroupAccesses')
            .respond(200, {name:'John'});

        $httpBackend.expectGET('/dhis/api/me/authorization')
            .respond(200, ['ALL']);

    }));

    it('should be an object', function () {
        expect(currentUserService).toBeAnObject();
    });

    describe('initialise', function () {
        afterEach(function () {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('should request the user and its authorities', function () {
            $httpBackend.flush();
        });

        it('should call the error function when a request fails', function () {
            userRequest.respond(400, 'Bad request');
            $httpBackend.flush();

            expect(notifyMock.error).toHaveBeenCalledWith('(400) Bad request');
        });
    });

    describe('getCurrentUser', function () {
        it('should be a function', function () {
            expect(currentUserService.getCurrentUser).toBeAFunction();
        });

        it('should return a promise', function () {
            expect(currentUserService.getCurrentUser()).toBeAPromiseLikeObject();
        });

        it('should have the user object as the promise result', function () {
            var currentUser;

            currentUserService.getCurrentUser()
                .then(function (result) {
                    currentUser = result;
                });
            $httpBackend.flush();

            expect(currentUser.name).toBe('John');
        });

        it('should have the authorities set onto the currentUser', function () {
            var currentUser;
            var authorities = [];

            currentUserService.getCurrentUser()
                .then(function (result) {
                    currentUser = result;
                });
            $httpBackend.flush();

            currentUser.authorities.forEach(function (authority) {
                authorities.push(authority);
            });
            expect(authorities).toEqual(['ALL']);
        });
    });
});
