describe('Period service', function () {
    var service;
    var $httpBackend;
    var $rootScope;
    var systemInfoRequest;

    beforeEach(module('PEPFAR.dedupe'));
    beforeEach(inject(function ($injector) {
        jQuery.ajax = jQuery.getScript = jasmine.createSpy('jQuery.getScript')
            .and.callFake(function (url, callback) {
                callback();
                return {
                    error: jasmine.createSpy('jQuery.getScript.error')
                };
            });

        jQuery.calendars = {
            instance: jasmine.createSpy('jquery.calendars.instance')
        };

        window.dhis2 = {
            period: {
                PeriodGenerator: jasmine.createSpy('dhis2.period.periodGenerator')
                    .and.returnValue({
                        generateReversedPeriods: jasmine.createSpy('dhis2.period.generator.generateReversedPeriods'),
                        filterFuturePeriodsExceptCurrent: jasmine.createSpy('dhis2.period.generator.filterFuturePeriodsExceptCurrent')
                    })
            }
        };

        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');

        systemInfoRequest = $httpBackend.expectGET('/dhis/api/system/info')
            .respond(200, {
                calendar: 'iso8601',
                dateFormat: 'yyyy-mm-dd'
            });

        service = $injector.get('periodService');
    }));

    it('should be an object', function () {
        expect(service).toBeAnObject();
    });

    describe('getPastPeriodsRecentFirst', function () {
        beforeEach(function () {
            $httpBackend.flush();
        });

        it('should be a function', function () {
            expect(service.getPastPeriodsRecentFirst).toBeAFunction();
        });

        it('should initially return undefined', function () {
            expect(service.getPastPeriodsRecentFirst()).toEqual(undefined);
        });

        it('should return the period generator when a periodtype has been set', function () {
            var generatedPeriods = window.dhis2.period.generator.filterFuturePeriodsExceptCurrent(window.dhis2.period.generator.generateReversedPeriods('Monthly', 0));

            service.setPeriodType('Monthly');
            $rootScope.$apply();

            expect(service.getPastPeriodsRecentFirst()).toEqual(generatedPeriods);
        });
    });

    describe('setPeriodType', function () {
        beforeEach(function () {
            $httpBackend.flush();
        });

        it('should be a function', function () {
            expect(service.setPeriodType).toBeAFunction();
        });

        it('should return a promise like object', function () {
            expect(service.setPeriodType('Monthly')).toBeAPromiseLikeObject();
        });

        it('should call the dhis2 period object for the periods to use', function () {
            service.setPeriodType('Monthly');
            $rootScope.$apply();

            expect(window.dhis2.period.generator.generateReversedPeriods).toHaveBeenCalled();
        });
    });

    it('should reject the set of period when the dependencies have not been loaded', function () {
        var errorCallback = jasmine.createSpy();

        jQuery.getScript.and.callFake(function () {
            return {
                error: function (callback) {
                    callback();
                }
            };
        });
        $httpBackend.flush();

        service.setPeriodType('Monthly')
            .catch(errorCallback);

        $rootScope.$apply();

        expect(jQuery.calendars.instance).not.toHaveBeenCalled();
        expect(errorCallback).toHaveBeenCalled();
    });

    describe('different calendar type', function () {
        beforeEach(function () {
            systemInfoRequest.respond(200, {
                calendar: 'julian',
                dateFormat: 'yyyy-mm-dd'
            });

            $httpBackend.flush();
        });

        it('should load the calendar script', function () {
            expect(jQuery.getScript).toHaveBeenCalled();
        });

        it('should call the success function after the script has been loaded', function () {
            expect(jQuery.calendars.instance).toHaveBeenCalledWith('julian');
        });
    });

    describe('calendar errors', function () {
        beforeEach(function () {
            systemInfoRequest.respond(200, {
                calendar: 'thisisnotacalendar',
                dateFormat: 'yyyy-mm-dd'
            });

            jQuery.getScript.and.callFake(function () {
                return {
                    error: function (callback) {
                        callback();
                    }
                };
            });
        });

        it('should throw when calendar type does not exist', function () {
            function shouldThrow() {
                $httpBackend.flush();
            }

            expect(shouldThrow).toThrowError('Calendar type "thisisnotacalendar" is not supported.');
        });

        it('should throw when calendar script can not be loaded', function () {
            systemInfoRequest.respond(200, {
                calendar: 'julian',
                dateFormat: 'yyyy-mm-dd'
            });

            function shouldThrow() {
                $httpBackend.flush();
            }

            expect(shouldThrow).toThrowError('Unable to load julian calendar');
        });
    });
});