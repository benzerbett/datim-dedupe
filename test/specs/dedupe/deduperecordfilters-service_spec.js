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
