describe('Dedupe record service', function () {
    var dedupeRecordService;

    beforeEach(module('PEPFAR.dedupe'));
    beforeEach(inject(function ($injector) {
        dedupeRecordService = $injector.get('dedupeRecordService');
    }));

    it('should be an object', function () {
        expect(dedupeRecordService).toBeAnObject();
    });
});