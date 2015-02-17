describe('Period service', function () {
    var service;
    var $httpBackend;

    beforeEach(module('PEPFAR.dedupe'));
    beforeEach(inject(function ($injector) {
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

        $httpBackend.expectGET('/dhis/api/system/info')
            .respond(200, {
                calendar: 'iso8601'
            });

        service = $injector.get('periodService');

        $httpBackend.flush();
    }));

    it('should be an object', function () {
        expect(service).toBeAnObject();
    });

    describe('getPastPeriodsRecentFirst', function () {
        it('should be a function', function () {
            expect(service.getPastPeriodsRecentFirst).toBeAFunction();
        });
    });

    describe('setPeriodType', function () {
        it('should be a function', function () {
            expect(service.setPeriodType).toBeAFunction();
        });

        it('should return a promise like object', function () {
            expect(service.setPeriodType('Monthly')).toBeAPromiseLikeObject();
        });
    });
});
