describe('Period service', function () {
    var service;
    var $httpBackend;
    var $rootScope;
    var systemInfoRequest;
    var periodGeneratorMock;
    var periodSettingsRequest;
    var currentYear = new Date().getFullYear();

    function createFakePeriodSettingsResponseFor(settingsConfig) {
        return Object
            .keys(settingsConfig) // `results` or `targets`
            .reduce(function (acc, key) {
                acc[key] = settingsConfig[key]
                    .reduce(function (periodSettings, periodName) {
                        periodSettings[periodName] = {};
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
