describe('Dedupe service', function () {
    var fixtures = window.fixtures;
    var dedupeService;

    beforeEach(module('PEPFAR.dedupe', function ($provide) {
        $provide.factory('dedupeRecordService', function ($q) {
            return {
                getRecords: jasmine.createSpy('dedupeRecordService.getRecords')
                    .and.returnValue($q.when(window.fixtures.get('dedupeRecords')))
            };
        });

        $provide.factory('dedupeSaverService', function ($q) {
            return {
                saveDeduplication: jasmine.createSpy('dedupeSaverService.saveDeduplication')
                    .and.returnValue($q.when(true))
            };
        });
    }));
    beforeEach(inject(function ($injector) {
        dedupeService = $injector.get('dedupeService');
    }));

    it('should be an object', function () {
        expect(dedupeService).toBeAnObject();
    });

    describe('getMax', function () {
        it('should be a function', function () {
            expect(dedupeService.getMax).toBeAFunction();
        });

        it('should throw if dedupeRecords is not an array', function () {
            function shouldThrow() {
                dedupeService.getMax();
            }

            expect(shouldThrow).toThrowError('Parameter dedupeRecordData that was passed to getMax is not an array');
        });

        it('should return a number', function () {
            expect(dedupeService.getMax([])).toBeANumber();
        });

        it('should return the max of the numbers', function () {
            var dedupeValues = [
                {agency: 'USAID', partner: 'PartnerA', value: 60},
                {agency: 'USAID', partner: 'PartnerB', value: 40},
                {agency: 'USAID', partner: 'PartnerC', value: 20}
            ];

            expect(dedupeService.getMax(dedupeValues)).toBe(60);
        });
    });

    describe('getSum', function () {
        it('should be a function', function () {
            expect(dedupeService.getSum).toBeAFunction();
        });

        it('should throw if dedupeRecords is not an array', function () {
            function shouldThrow() {
                dedupeService.getSum();
            }

            expect(shouldThrow).toThrowError('Parameter dedupeRecordData that was passed to getSum is not an array');
        });

        it('should return a number', function () {
            expect(dedupeService.getSum([])).toBeANumber();
        });

        it('should return the sum of the numbers', function () {
            var dedupeValues = [
                {agency: 'USAID', partner: 'PartnerA', value: 60},
                {agency: 'USAID', partner: 'PartnerB', value: 40},
                {agency: 'USAID', partner: 'PartnerC', value: 20}
            ];

            expect(dedupeService.getSum(dedupeValues)).toBe(120);
        });
    });

    describe('getDuplicateRecords', function () {
        var dedupeRecordServiceMock;

        beforeEach(inject(function (dedupeRecordService) {
            dedupeRecordServiceMock = dedupeRecordService;
        }));

        it('should be a function', function () {
            expect(dedupeService.getDuplicateRecords).toBeAFunction();
        });

        it('should return an array', function () {
            expect(dedupeService.getDuplicateRecords()).toBeAPromiseLikeObject();
        });

        it('should call getRecords on the dedupeRecordsService', function () {
            dedupeService.getDuplicateRecords();

            expect(dedupeRecordServiceMock.getRecords).toHaveBeenCalledWith({});
        });

        it('should call the dedupeRecordsService with ou filter when supplied', function () {
            dedupeService.getDuplicateRecords('myOrgUnitId');

            expect(dedupeRecordServiceMock.getRecords).toHaveBeenCalledWith({ou: 'myOrgUnitId'});
        });

        it('should call the dedupeRecordsService with ou and pe filter when supplied', function () {
            dedupeService.getDuplicateRecords('myOrgUnitId', '2013Oct');

            expect(dedupeRecordServiceMock.getRecords).toHaveBeenCalledWith({ou: 'myOrgUnitId', pe: '2013Oct'});
        });

        it('should call the dedupeRecordsService with pe filter when supplied', function () {
            dedupeService.getDuplicateRecords(undefined, '2013Oct');

            expect(dedupeRecordServiceMock.getRecords).toHaveBeenCalledWith({pe: '2013Oct'});
        });
    });

    describe('resolveDeduplication', function () {
        var dedupeSaverServiceMock;
        var dedupeRecords;
        var dedupeRecord;

        beforeEach(inject(function (dedupeSaverService) {
            dedupeSaverServiceMock = dedupeSaverService;
            dedupeRecords = fixtures.get('dedupeRecords');
            dedupeRecord = dedupeRecords[0];
        }));

        it('should be a function', function () {
            expect(dedupeService.resolveDuplicates).toBeAFunction();
        });

        it('should take one argument', function () {
            expect(dedupeService.resolveDuplicates.length).toBe(1);
        });

        it('should call the saveDuplicates on the dedupesaver service', function () {
            dedupeService.resolveDuplicates([dedupeRecord]);

            expect(dedupeSaverServiceMock.saveDeduplication).toHaveBeenCalled();
        });

        it('should return a promise', function () {
            expect(dedupeService.resolveDuplicates([dedupeRecord])).toBeAPromiseLikeObject();
        });

        it('should reject when the passed records is not an array', inject(function ($rootScope) {
            var catchCallBack = jasmine.createSpy('catchCallback');

            dedupeService.resolveDuplicates()
                .catch(catchCallBack);
            $rootScope.$apply();

            expect(catchCallBack).toHaveBeenCalledWith('Duplicate records passed to resolveDuplicates should be an array with at least one element');
        }));

        it('should reject when the passed records is an empty array', inject(function ($rootScope) {
            var catchCallBack = jasmine.createSpy('catchCallback');

            dedupeService.resolveDuplicates([])
                .catch(catchCallBack);
            $rootScope.$apply();

            expect(catchCallBack).toHaveBeenCalledWith('Duplicate records passed to resolveDuplicates should be an array with at least one element');
        }));

        it('should set the adjustedvalue onto the dedupe record', function () {
            dedupeService.resolveDuplicates([dedupeRecord]);

            expect(dedupeRecord.resolve.adjustedValue).toBe(-1600);
        });

        it('should filter out unresolved dedupes', function () {
            dedupeService.resolveDuplicates(dedupeRecords);

            expect(dedupeSaverServiceMock.saveDeduplication).toHaveBeenCalledWith([dedupeRecord]);
        });

        it('should not call saveDeduplicates if there are no resolved records', function () {
            delete dedupeRecords[0];
            dedupeService.resolveDuplicates(dedupeRecords);

            expect(dedupeSaverServiceMock.saveDeduplication).not.toHaveBeenCalled();
        });

        it('should reject the promise when there are no records to save', inject(function ($rootScope) {
            var catchCallBack = jasmine.createSpy('catchCallback');
            delete dedupeRecords[0];

            dedupeService.resolveDuplicates(dedupeRecords)
                .catch(catchCallBack);
            $rootScope.$apply();

            expect(catchCallBack).toHaveBeenCalledWith('Non of the passed dedupe records had resolved values that should be saved.');
        }));
    });
});
