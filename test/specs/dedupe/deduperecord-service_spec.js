describe('Dedupe record service', function () {
    var fixtures = window.fixtures;
    var $httpBackend;
    var dedupeRecordService;

    beforeEach(module('PEPFAR.dedupe'));
    beforeEach(inject(function ($injector) {
        $httpBackend = $injector.get('$httpBackend');

        dedupeRecordService = $injector.get('dedupeRecordService');

        //TODO: Exchange this for the "real" url
        $httpBackend.expectGET('/dhis/api/sqlViews/I3vdXPDm1Ye/execute')
            .respond(200, fixtures.get('dedupe'));
    }));

    it('should be an object', function () {
        expect(dedupeRecordService).toBeAnObject();
    });

    describe('getRecords', function () {
        it('should be a function', function () {
            expect(dedupeRecordService.getRecords).toBeAFunction();
        });

        it('should return a promise', function () {
            expect(dedupeRecordService.getRecords()).toBeAPromiseLikeObject();
        });

        it('should return an array from the promise', function () {
            var dedupeRecords;
            dedupeRecordService.getRecords()
                .then(function (records) {
                    dedupeRecords = records;
                });

            $httpBackend.flush();

            expect(dedupeRecords).toBeAnArray();
        });

        it('should set the orgunits onto the deduperecord object', function () {
            var dedupeRecords;

            dedupeRecordService.getRecords()
                .then(function (records) {
                    dedupeRecords = records;
                });

            $httpBackend.flush();

            //TODO: This is a bit of a volatile test...
            expect(dedupeRecords[0].details.orgUnitName).toBe('Crow Site');
            expect(dedupeRecords[4].details.orgUnitName).toBe('Hawk Site');
            expect(dedupeRecords[6].details.orgUnitName).toBe('Ostrich Site');
        });

        it('should have set a resolved value for the first dedupeRecord', function () {
            var dedupeRecords;

            dedupeRecordService.getRecords()
                .then(function (records) {
                    dedupeRecords = records;
                });

            $httpBackend.flush();

            //TODO: This is a bit of a volatile test...
            expect(dedupeRecords[0].resolve.value).toBe(450);
        });
    });
});
