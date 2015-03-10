describe('Dedupefilter service', function () {
    var service;

    beforeEach(module('PEPFAR.dedupe'));
    beforeEach(inject(function ($injector) {
        service = $injector.get('dedupeRecordFilters');
    }));

    it('should be an object', function () {
        expect(service).toBeAnObject();
    });
});
