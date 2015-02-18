describe('Period service', function () {
    var service;
    var $httpBackend;
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
                    .and.returnValue([{name: 'period1'}, {name: 'period2'}])
            }
        };

        $httpBackend = $injector.get('$httpBackend');

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
