/* global xit */
describe('DataStore Service', function () {
    var $httpBackend;
    var $rootScope;
    var dataStore;
    var periodSettingsFixture =
        {
            RESULTS: {
                '2017Q1': {
                    start: 1490986800,
                    end: 1492196400,
                    datasets: ['MqNLEXmzIzr',
                        'kkXf2zXqTM0',
                        'CGoi5wjLHDy',
                        'tG2hjDIaYQD'
                    ]
                }
            },

            TARGETS: {
                '2017Oct': {
                    start: 1485554400,
                    end: 1517090400,
                    datasets: [
                        'YWZrOj5KS1c',
                        'BuRoS9i851o',
                        'ePndtmDbOJj',
                        'AitXBHsC7RA'
                    ]
                },
                '2016Oct': {
                    start: 1485554400,
                    end: 1517090400,
                    datasets: [
                        'Dd5c9117ukD',
                        'tCIW2VFd8uu',
                        'qRvKHvlzNdv',
                        'Om3TJBRH8G8',
                        'xxo1G5V1JG2'
                    ]
                }
            }
        };

    beforeEach(module('PEPFAR.dedupe'));
    beforeEach(inject(function ($injector) {
        dataStore = $injector.get('dataStore');
        $rootScope = $injector.get('$rootScope');
    }));

    it('should have a getPeriodSettings method', function () {
        expect(typeof dataStore.getPeriodSettings).toBe('function');
    });

    describe('getPeriodSettings', function () {
        beforeEach(inject(function ($injector) {
            $httpBackend = $injector.get('$httpBackend');

            $httpBackend.expectGET('/dhis/api/dataStore/dedupe/periodSettings')
                .respond(200, periodSettingsFixture);
        }));

        afterEach(function () {
            $httpBackend.verifyNoOutstandingRequest();
            $httpBackend.verifyNoOutstandingExpectation();
        });

        it('should return a Promise like object', function () {
            expect(typeof dataStore.getPeriodSettings().then).toBe('function');
        });

        it('should request the dataStore for the period settings when called', function () {
            // Expectations are explicitly tested by the afterEach
            dataStore.getPeriodSettings();
        });

        // TODO: Mock Restangular?
        xit('should return the expected structure', function (done) {
            dataStore.getPeriodSettings()
                .then(function (periodSettings) {
                    expect(periodSettings).toEqual(periodSettingsFixture);
                    done();
                })
                .catch(done);
        });

        it('should return the same promise when it was once called', function () {
            expect(dataStore.getPeriodSettings()).toEqual(dataStore.getPeriodSettings());
        });
    });
});
