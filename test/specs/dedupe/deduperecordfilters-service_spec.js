describe('Dedupefilter service', function () {
    var fixtures = window.fixtures;
    var service;

    beforeEach(module('PEPFAR.dedupe'));
    beforeEach(inject(function ($injector) {
        service = $injector.get('dedupeRecordFilters');
    }));

    it('should be an object', function () {
        expect(service).toBeAnObject();
    });

    describe('onlyNonResolvedRecords', function () {
        it('should be a function', function () {
            expect(service.onlyNonResolvedRecords).toBeAFunction();
        });

        it('should return only records that are marked as resolved', function () {
            var expectedRecords = fixtures.get('dedupeRecords');
            expectedRecords.shift();

            expect(service.onlyNonResolvedRecords(fixtures.get('dedupeRecords')).length).toBe(5);
            expect(service.onlyNonResolvedRecords(fixtures.get('dedupeRecords'))).toEqual(expectedRecords);
        });
    });

    describe('onlyTypeCrosswalk', function () {
        it('should be a function', function () {
            expect(service.onlyTypeCrosswalk).toBeAFunction();
        });

        it('should return only the records that are marked as crosswalk', function () {
            var expectedRecords = [fixtures.get('dedupeRecords')[0], fixtures.get('dedupeRecords').pop()];

            expect(service.onlyTypeCrosswalk(fixtures.get('dedupeRecords'))).toEqual(expectedRecords);
        });
    });
});
