describe('Period service', function () {
    var service;
    var $httpBackend;
    var $rootScope;
    var systemInfoRequest;
    var periodGeneratorMock;
    var periodSettingsRequest;
    var currentYear = new Date().getFullYear();
    var timeStampForNow = Math.floor(Date.now() / 1000);

    function getISODateFromSeconds(seconds) {
        return new Date(seconds * 1000).toISOString();
    }

    function createFakePeriodSettingsResponseFor(settingsConfig) {
        return Object
            .keys(settingsConfig) // `results` or `targets`
            .reduce(function (acc, key) {
                acc[key] = settingsConfig[key]
                    .reduce(function (periodSettings, periodName) {
                        periodSettings[periodName] = {
                            start: getISODateFromSeconds(timeStampForNow - 2000),
                            end: getISODateFromSeconds(timeStampForNow + 2000)
                        };
                        return periodSettings;
                    }, {});

                return acc;
            }, {});
    }

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

        periodGeneratorMock = {
            generatePeriods: jasmine.createSpy('dhis2.period.generator.generatePeriods')
                .and.returnValue([
                    {iso: '2016'},
                    {iso: '2015'},
                    {iso: '2014'}
                ]),
            generateReversedPeriods: jasmine.createSpy('dhis2.period.generator.generateReversedPeriods')
                .and.returnValue([
                    {iso: '2016'},
                    {iso: '2015'},
                    {iso: '2014'}
                ]),
            filterFuturePeriodsExceptCurrent: jasmine.createSpy('dhis2.period.generator.filterFuturePeriodsExceptCurrent')
                .and.returnValue([])
        };
        window.dhis2 = {
            period: {
                PeriodGenerator: jasmine.createSpy('dhis2.period.periodGenerator')
                    .and.returnValue(periodGeneratorMock)
            }
        };

        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');

        systemInfoRequest = $httpBackend.expectGET('/dhis/api/system/info')
            .respond(200, {
                calendar: 'iso8601',
                dateFormat: 'yyyy-mm-dd'
            });

        periodSettingsRequest = $httpBackend.whenGET('/dhis/api/dataStore/dedupe/periodSettings')
            .respond(200, createFakePeriodSettingsResponseFor({
                TARGETS: [currentYear + 'Oct'],
                RESULTS:[currentYear + 'Q1']
            }));

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

        it('should return the correct generated periods for FinancialOct', function () {
            service.setPeriodType('FinancialOct', 'Targets');
            $httpBackend.flush();

            expect(periodGeneratorMock.generatePeriods).toHaveBeenCalledWith('FinancialOct', 5);
        });

        it('should return the correct generated periods for Quarterly', function () {
            service.setPeriodType('Quarterly', 'Results');
            $httpBackend.flush();

            expect(periodGeneratorMock.generatePeriods).toHaveBeenCalledWith('Quarterly', 0);
        });
    });

    describe('isPeriodSettingISOFormat', function () {
        beforeEach(function () {
            $httpBackend.flush();
        });

        it('should be a function', function () {
            expect(service.isPeriodSettingISOFormat).toBeAFunction();
        });

        it('should validate wrong format for period start date', function () {
            var periodSettings = {
                start: '2018-08-31T19:00:00',
                end: '2018-09-21T19:00:00Z'
            };
            expect(service.isPeriodSettingISOFormat('2018Q2', periodSettings)).toBeFalsy();
            periodSettings = {
                start: '2018-08-31T19:00:00.000',
                end: '2018-09-21T19:00:00Z'
            };
            expect(service.isPeriodSettingISOFormat('2018Q2', periodSettings)).toBeFalsy();
            periodSettings = {
                start: '2018-08-31Z',
                end: '2018-09-21T19:00:00Z'
            };
            expect(service.isPeriodSettingISOFormat('2018Q2', periodSettings)).toBeFalsy();
            periodSettings = {
                start: 'Jul 01 2018 01:00:00 GMT-0500',
                end: '2018-09-21T19:00:00Z'
            };
            expect(service.isPeriodSettingISOFormat('2018Q2', periodSettings)).toBeFalsy();
            periodSettings = {
                start: 'Jul 01 2018 01:00:00 GMT+0000',
                end: '2018-09-21T19:00:00Z'
            };
            expect(service.isPeriodSettingISOFormat('2018Q2', periodSettings)).toBeFalsy();
        });

        it('should validate wrong format for period end date', function () {
            var periodSettings = {
                start: '2018-08-31T19:00:00Z',
                end: '2018-09-21T19:00:00'
            };
            expect(service.isPeriodSettingISOFormat('2018Q2', periodSettings)).toBeFalsy();
            periodSettings = {
                start: '2018-08-31T19:00:00Z',
                end: '2018-09-21T19:00:000'
            };
            expect(service.isPeriodSettingISOFormat('2018Q2', periodSettings)).toBeFalsy();
            periodSettings = {
                start: '2018-08-31T19:00:00Z',
                end: '2018-09-21Z'
            };
            expect(service.isPeriodSettingISOFormat('2018Q2', periodSettings)).toBeFalsy();
            periodSettings = {
                start: '2018-08-31T19:00:00Z',
                end: 'Oct 01 2018 01:00:00 GMT-0500'
            };
            expect(service.isPeriodSettingISOFormat('2018Q2', periodSettings)).toBeFalsy();
            periodSettings = {
                start: '2018-08-31T19:00:00Z',
                end: 'Oct 01 2018 01:00:00 GMT-0500'
            };
            expect(service.isPeriodSettingISOFormat('2018Q2', periodSettings)).toBeFalsy();
        });

        it('should accept correct date format for period setting', function () {
            var periodSettings = {
                start: '2018-08-31T19:00:00Z',
                end: '2018-09-21T19:00:00Z'
            };
            expect(service.isPeriodSettingISOFormat('2018Q2', periodSettings)).toBeTruthy();
            periodSettings = {
                start: '2018-08-31T19:00:00.000Z',
                end: '2018-09-21T19:00:00.000Z'
            };
            expect(service.isPeriodSettingISOFormat('2018Q2', periodSettings)).toBeTruthy();
            periodSettings = {
                start: '2017-09-29T20:00:00+00:00',
                end: '2017-04-01T21:00:00+00:00'
            };
            expect(service.isPeriodSettingISOFormat('2018Q2', periodSettings)).toBeTruthy();
        });

    });

    describe('getPastPeriodsRecentFirst with a year in the past', function () {
        it('should return the periods from the periodSettings', function () {
            periodSettingsRequest.respond(200, createFakePeriodSettingsResponseFor({
                TARGETS: [(currentYear - 1) + 'Oct'],
                RESULTS:[currentYear + 'Q1']
            }));

            periodGeneratorMock.generatePeriods.and.returnValue([
                {iso: (currentYear - 1) + 'Oct'},
                {iso: (currentYear - 2) + 'Oct'},
                {iso: (currentYear - 3) + 'Oct'},
                {iso: (currentYear - 4) + 'Oct'},
                {iso: (currentYear - 5) + 'Oct'}
            ]);

            service.setPeriodType('FinancialOct', 'Targets');
            $httpBackend.flush();

            expect(periodGeneratorMock.generatePeriods).toHaveBeenCalledWith('FinancialOct', 4);
            expect(service.getPastPeriodsRecentFirst()).toEqual([
                {iso: (currentYear - 1) + 'Oct'}
            ]);
        });

        it('should not return the the period when the data dedupe period has expired', function () {
            var targets = {};
            targets[(currentYear - 1) + 'Oct'] = {
                start:  getISODateFromSeconds(timeStampForNow - 200),
                end:  getISODateFromSeconds(timeStampForNow - 100)
            };
            periodSettingsRequest.respond(200, {
                TARGETS: targets
            });

            periodGeneratorMock.generatePeriods.and.returnValue([
                {iso: (currentYear - 1) + 'Oct'},
                {iso: (currentYear - 2) + 'Oct'},
                {iso: (currentYear - 3) + 'Oct'},
                {iso: (currentYear - 4) + 'Oct'},
                {iso: (currentYear - 5) + 'Oct'}
            ]);

            service.setPeriodType('FinancialOct', 'Targets');
            $httpBackend.flush();

            expect(service.getPastPeriodsRecentFirst()).toEqual([]);
        });

        it('should not return the the period when the data dedupe period has not yet started', function () {
            var targets = {};
            targets[(currentYear - 1) + 'Oct'] = {
                start:  getISODateFromSeconds(timeStampForNow + 500),
                end:  getISODateFromSeconds(timeStampForNow + 600)
            };
            periodSettingsRequest.respond(200, {
                TARGETS: targets
            });

            periodGeneratorMock.generatePeriods.and.returnValue([
                {iso: (currentYear - 1) + 'Oct'},
                {iso: (currentYear - 2) + 'Oct'},
                {iso: (currentYear - 3) + 'Oct'},
                {iso: (currentYear - 4) + 'Oct'},
                {iso: (currentYear - 5) + 'Oct'}
            ]);

            service.setPeriodType('FinancialOct', 'Targets');
            $httpBackend.flush();

            expect(service.getPastPeriodsRecentFirst()).toEqual([]);
        });

        it('should call the period generator for multiple years', function () {
            periodSettingsRequest.respond(200, createFakePeriodSettingsResponseFor({
                TARGETS: [(currentYear - 1) + 'Oct', (currentYear - 2) + 'Oct'],
                RESULTS:[currentYear + 'Q1']
            }));

            periodGeneratorMock.generatePeriods.and.returnValue([
                {iso: (currentYear - 1) + 'Oct'},
                {iso: (currentYear - 2) + 'Oct'},
                {iso: (currentYear - 3) + 'Oct'},
                {iso: (currentYear - 4) + 'Oct'},
                {iso: (currentYear - 5) + 'Oct'}
            ]);

            service.setPeriodType('FinancialOct', 'Targets');
            $httpBackend.flush();

            expect(periodGeneratorMock.generatePeriods).toHaveBeenCalledWith('FinancialOct', 4);
            expect(periodGeneratorMock.generatePeriods).toHaveBeenCalledWith('FinancialOct', 3);
            expect(service.getPastPeriodsRecentFirst()).toEqual([
                {iso: (currentYear - 1) + 'Oct'},
                {iso: (currentYear - 2) + 'Oct'}
            ]);
        });

        it('should call the period generator correctly for Quarterly periods', function () {
            periodSettingsRequest.respond(200, createFakePeriodSettingsResponseFor({
                targets: [(currentYear - 1) + 'Oct', (currentYear - 2) + 'Oct'],
                RESULTS:[(currentYear - 1) + 'Q2']
            }));

            periodGeneratorMock.generatePeriods.and.returnValue([
                {iso: (currentYear - 1) + 'Q1'},
                {iso: (currentYear - 1) + 'Q2'},
                {iso: (currentYear - 1) + 'Q3'},
                {iso: (currentYear - 1) + 'Q4'}
            ]);

            service.setPeriodType('Quarterly', 'Results');
            $httpBackend.flush();

            expect(periodGeneratorMock.generatePeriods).toHaveBeenCalledWith('Quarterly', -1);
            expect(service.getPastPeriodsRecentFirst()).toEqual([
                {iso: (currentYear - 1) + 'Q2'}
            ]);
        });

        it('should call the period generator correctly for Quarterly periods with multiple values', function () {
            periodSettingsRequest.respond(200, createFakePeriodSettingsResponseFor({
                targets: [(currentYear - 1) + 'Oct', (currentYear - 2) + 'Oct'],
                RESULTS:[(currentYear - 1) + 'Q2', (currentYear - 5) + 'Q3']
            }));

            periodGeneratorMock.generatePeriods.and.callFake(function (p, yearDifference) {
                if (yearDifference === -5) {
                    return [
                        {iso: (currentYear - 5) + 'Q1'},
                        {iso: (currentYear - 5) + 'Q2'},
                        {iso: (currentYear - 5) + 'Q3'},
                        {iso: (currentYear - 5) + 'Q4'}
                    ];
                }
                return [
                    {iso: (currentYear - 1) + 'Q1'},
                    {iso: (currentYear - 1) + 'Q2'},
                    {iso: (currentYear - 1) + 'Q3'},
                    {iso: (currentYear - 1) + 'Q4'}
                ];
            });

            service.setPeriodType('Quarterly', 'Results');
            $httpBackend.flush();

            expect(periodGeneratorMock.generatePeriods).toHaveBeenCalledWith('Quarterly', -1);
            expect(periodGeneratorMock.generatePeriods).toHaveBeenCalledWith('Quarterly', -5);
            expect(service.getPastPeriodsRecentFirst()).toEqual([
                {iso: (currentYear - 1) + 'Q2'}, {iso: (currentYear - 5) + 'Q3'}
            ]);
        });
    });

    describe('getPastPeriodsRecentFirst with a year in the future', function () {
        it('should return the periods from the periodSettings', function () {
            periodSettingsRequest.respond(200, createFakePeriodSettingsResponseFor({
                TARGETS: [(currentYear + 1) + 'Oct']
            }));

            periodGeneratorMock.generatePeriods.and.returnValue([
                {iso: (currentYear + 1) + 'Oct'},
                {iso: (currentYear + 2) + 'Oct'},
                {iso: (currentYear + 3) + 'Oct'},
                {iso: (currentYear + 4) + 'Oct'},
                {iso: (currentYear + 5) + 'Oct'}
            ]);

            service.setPeriodType('FinancialOct', 'Targets');
            $httpBackend.flush();

            expect(periodGeneratorMock.generatePeriods).toHaveBeenCalledWith('FinancialOct', 6);
            expect(service.getPastPeriodsRecentFirst()).toEqual([
                {iso: (currentYear + 1) + 'Oct'}
            ]);
        });

        it('should call the period generator correctly for Quarterly periods with multiple values', function () {
            periodSettingsRequest.respond(200, createFakePeriodSettingsResponseFor({
                TARGETS: [(currentYear + 1) + 'Oct', (currentYear + 2) + 'Oct'],
                RESULTS:[(currentYear + 1) + 'Q2', (currentYear + 5) + 'Q3']
            }));

            periodGeneratorMock.generatePeriods.and.callFake(function (p, yearDifference) {
                if (yearDifference === +5) {
                    return [
                        {iso: (currentYear + 5) + 'Q1'},
                        {iso: (currentYear + 5) + 'Q2'},
                        {iso: (currentYear + 5) + 'Q3'},
                        {iso: (currentYear + 5) + 'Q4'}
                    ];
                }
                return [
                    {iso: (currentYear + 1) + 'Q1'},
                    {iso: (currentYear + 1) + 'Q2'},
                    {iso: (currentYear + 1) + 'Q3'},
                    {iso: (currentYear + 1) + 'Q4'}
                ];
            });

            service.setPeriodType('Quarterly', 'Results');
            $httpBackend.flush();

            expect(periodGeneratorMock.generatePeriods).toHaveBeenCalledWith('Quarterly', 1);
            expect(periodGeneratorMock.generatePeriods).toHaveBeenCalledWith('Quarterly', 5);
            expect(service.getPastPeriodsRecentFirst()).toEqual([
                {iso: (currentYear + 1) + 'Q2'},
                {iso: (currentYear + 5) + 'Q3'}
            ]);
        });

        it('should filter out the periods that resulted into undefined', function () {
            periodSettingsRequest.respond(200, createFakePeriodSettingsResponseFor({
                RESULTS:[(currentYear + 1) + 'Q22']
            }));

            periodGeneratorMock.generatePeriods.and.returnValue([
                {iso: (currentYear + 1) + 'Q1'},
                {iso: (currentYear + 1) + 'Q2'},
                {iso: (currentYear + 1) + 'Q3'},
                {iso: (currentYear + 1) + 'Q4'}
            ]);

            service.setPeriodType('Quarterly', 'Results');
            $httpBackend.flush();

            expect(periodGeneratorMock.generatePeriods).toHaveBeenCalledWith('Quarterly', 1);
            expect(service.getPastPeriodsRecentFirst()).toEqual([]);
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
            service.setPeriodType('Monthly', 'Targets');
            $httpBackend.flush();

            expect(window.dhis2.period.generator.generatePeriods).toHaveBeenCalledWith('Monthly', 0);
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
