describe('App controller', function () {
    var dedupeServiceMock;
    var controller;
    var $rootScope;

    beforeEach(module('PEPFAR.dedupe'));
    beforeEach(inject(function ($injector) {
        var $controller = $injector.get('$controller');
        var $q = $injector.get('$q');

        $rootScope = $injector.get('$rootScope');

        dedupeServiceMock = {
            getMax: jasmine.createSpy('dedupeService.getMax'),
            getSum: jasmine.createSpy('dedupeService.getSum'),
            getDuplicateRecords: jasmine.createSpy('dedupeService.getDuplicateRecords')
                .and.returnValue($q.when([{
                    details: {
                        orgUnitName: 'Glady\'s clinic',
                        timePeriodName: 'FY 2014'
                    },
                    data: [
                        {agency: 'USAID', partner: 'PartnerA', value: 60},
                        {agency: 'USAID', partner: 'PartnerB', value: 40},
                        {agency: 'USAID', partner: 'PartnerC', value: 20}
                    ],
                    resolve: {
                        type: undefined,
                        value: undefined
                    }
                }, {
                    details: {
                        orgUnitName: 'Glady\'s clinic',
                        timePeriodName: 'FY 2014'
                    },
                    data: [
                        {agency: 'CDC', partner: 'PartnerA', value: 12},
                        {agency: 'CDC', partner: 'PartnerD', value: 30},
                        {agency: 'CDC', partner: 'PartnerG', value: 10}
                    ],
                    resolve: {
                        type: undefined,
                        value: undefined
                    }
                }])),
            resolveDeduplication: jasmine.createSpy('dedupeService.resolveDeduplication')
        };

        controller = $controller('appController', {
            dedupeService: dedupeServiceMock
        });
    }));

    it('should be an object', function () {
        expect(controller).toBeAnObject();
    });

    describe('initialise', function () {
        it('should call the dedupe service for the duplicates', function () {
            expect(dedupeServiceMock.getDuplicateRecords).toHaveBeenCalled();
        });

        it('should set processing to true', function () {
            expect(controller.isProcessing).toBe(true);
        });

        it('should set the duplicate records onto the controller', inject(function ($rootScope) {
            $rootScope.$apply();

            expect(controller.dedupeRecords.length).toEqual(2);
        }));

        it('should set processing to false after duplicate records are loaded', function () {
            $rootScope.$apply();
            
            expect(controller.isProcessing).toBe(false);
        });
    });

    describe('useMax', function () {
        beforeEach(function () {
            //Apply rootscope to resolve the mock promise
            $rootScope.$apply();
        });

        it('should set the resolve type to max on all the records', function () {
            controller.useMax();

            expect(controller.dedupeRecords[0].resolve.type).toBe('max');
            expect(controller.dedupeRecords[1].resolve.type).toBe('max');
        });

        it('should call the dedupeService to get the max value', function () {
            controller.useMax();

            expect(dedupeServiceMock.getMax.calls.count()).toBe(2);
            expect(dedupeServiceMock.getMax).toHaveBeenCalledWith(controller.dedupeRecords[0].data);
            expect(dedupeServiceMock.getMax).toHaveBeenCalledWith(controller.dedupeRecords[1].data);
        });

        it('should set the max returned value onto the dedupeRecords', function () {
            dedupeServiceMock.getMax.and.returnValue(60);

            controller.useMax();

            expect(controller.dedupeRecords[0].resolve.value).toBe(60);
            expect(controller.dedupeRecords[1].resolve.value).toBe(60);
        });

        it('should not attempt to map the records if there are none', function () {
            controller.dedupeRecords = undefined;

            controller.useMax();
        });

        it('should not throw an error when dedupeRecords is an empty array', function () {
            controller.dedupeRecords = [];

            controller.useMax();
        });
    });

    describe('useSum', function () {
        beforeEach(function () {
            //Apply rootscope to resolve the mock promise
            $rootScope.$apply();
        });

        it('should set the resolve type to sum on all records', function () {
            controller.useSum();

            expect(controller.dedupeRecords[0].resolve.type).toBe('sum');
            expect(controller.dedupeRecords[1].resolve.type).toBe('sum');
        });

        it('should call the dedupeService to get the sum value', function () {
            controller.useSum();

            expect(dedupeServiceMock.getSum.calls.count()).toBe(2);
            expect(dedupeServiceMock.getSum).toHaveBeenCalledWith(controller.dedupeRecords[0].data);
            expect(dedupeServiceMock.getSum).toHaveBeenCalledWith(controller.dedupeRecords[1].data);
        });

        it('should set the sum returned value onto the dedupeRecords', function () {
            dedupeServiceMock.getSum.and.returnValue(120);

            controller.useSum();

            expect(controller.dedupeRecords[0].resolve.value).toBe(120);
            expect(controller.dedupeRecords[1].resolve.value).toBe(120);
        });

        it('should not attempt to map the records if there are none', function () {
            controller.dedupeRecords = undefined;

            controller.useSum();
        });

        it('should not throw an error when dedupeRecords is an empty array', function () {
            controller.dedupeRecords = [];

            controller.useSum();
        });
    });

    describe('resolveDeduplication', function () {
        it('should be a function', function () {
            expect(controller.resolveDeduplication).toBeAFunction();
        });

        it('should call resolveDeduplication on the dedupeService', function () {
            controller.resolveDeduplication();

            expect(dedupeServiceMock.resolveDeduplication).toHaveBeenCalledWith(controller.dedupeRecords);
        });

        it('should set processing to true', function () {
            controller.resolveDeduplication();

            expect(controller.isProcessing).toBe(true);
        });
    });
});
