describe('Dedupe record service', function () {
    var fixtures = window.fixtures;
    var $httpBackend;
    var dedupeRecordService;
    var getRecordsRequest;
    var dedupeSystemSetting;

    beforeEach(module('PEPFAR.dedupe'));
    beforeEach(inject(function ($injector) {
        $httpBackend = $injector.get('$httpBackend');

        dedupeRecordService = $injector.get('dedupeRecordService');

        dedupeSystemSetting = $httpBackend.expectGET('/dhis/api/systemSettings/keyDedupeSqlViewId')
            .respond(200, {
                id: 'AuL6zTSLxNc'
            });

        getRecordsRequest = $httpBackend.expectGET('/dhis/api/sqlViews/AuL6zTSLxNc/data')
            .respond(200, fixtures.get('smallerDedupe'));
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

        describe('results', function () {
            var dedupeRecords;

            beforeEach(function () {
                dedupeRecordService.getRecords()
                    .then(function (records) {
                        dedupeRecords = records;
                    });

                $httpBackend.flush();
            });

            afterEach(function () {
                $httpBackend.verifyNoOutstandingExpectation();
                $httpBackend.verifyNoOutstandingRequest();
            });

            it('should return an array from the promise', function () {
                expect(dedupeRecords).toBeAnArray();
            });

            it('should set the orgunit onto the dedupe record object', function () {
                expect(dedupeRecords[0].details.orgUnitName).toBe('Cardinal Site');
                expect(dedupeRecords[5].details.orgUnitName).toBe('Demoland');
            });

            it('should set the orgunitId onto the dedupe record object', function () {
                expect(dedupeRecords[0].details.orgUnitId).toBe('HfiOUYEPgLK');
                expect(dedupeRecords[5].details.orgUnitId).toBe('KKFzPM8LoXs');
            });

            it('should set the timePeriod onto the dedupe record object', function () {
                expect(dedupeRecords[0].details.timePeriodName).toBe('2013Oct');
                expect(dedupeRecords[5].details.timePeriodName).toBe('2013Oct');
            });

            it('should set isResolved to false for the first dedupe record', function () {
                expect(dedupeRecords[0].resolve.isResolved).toBe(false);
            });

            it('should set the data element name', function () {
                expect(dedupeRecords[0].details.dataElementName).toBe('HTC_TST (N, DSD): HTC received results');
            });

            it('should set the data element id', function () {
                expect(dedupeRecords[0].details.dataElementId).toBe('K6f6jR0NOcZ');
            });

            it('should set the category option combo id', function () {
                expect(dedupeRecords[0].details.categoryOptionComboId).toBe('HllvX50cXC0');
            });

            it('should set the category option combo name', function () {
                expect(dedupeRecords[0].details.categoryOptionComboName).toBe('(default)');
            });

            it('should set the groupId as the id onto the record', function () {
                expect(dedupeRecords[0].id).toBe('2364f5b15e57185fc6564ce64cc9c629');
            });

            describe('data rows', function () {
                var firstDataRow;

                beforeEach(function () {
                    firstDataRow = dedupeRecords[0].data[0];
                });

                it('should set correct amount of data onto the dedupeRecord', function () {
                    expect(dedupeRecords[0].data.length).toBe(5);
                });

                it('should set the partner onto the data object', function () {
                    expect(firstDataRow.partner).toBe('Demoland Cardinal IP');
                });

                it('should set the agency onto the data object', function () {
                    expect(firstDataRow.agency).toBe('USAID');
                });

                it('should set the value onto the data object', function () {
                    expect(firstDataRow.value).toBe(23);
                });
            });
        });

        describe('resolved', function () {
            var dedupeRecord;

            beforeEach(function () {
                getRecordsRequest.respond(200, fixtures.get('resolvedDedupe'));

                dedupeRecordService.getRecords()
                    .then(function (records) {
                        dedupeRecord = records[0];
                    });

                $httpBackend.flush();
            });

            it('should set resolve.isResolved to true', function () {
                expect(dedupeRecord.resolve.isResolved).toBe(true);
            });

            it('should set the resolve.value to the actual number', function () {
                expect(dedupeRecord.resolve.value).toBe(12);
            });

            it('should set the resolved type to custom', function () {
                expect(dedupeRecord.resolve.type).toBe('custom');
            });
        });
    });

    describe('dedupeSystemSetting error handling', function () {
        it('should reject the promise when the systemsetting could not be found', function () {
            var message;
            $httpBackend.resetExpectations();

            $httpBackend.expectGET('/dhis/api/systemSettings/keyDedupeSqlViewId')
                .respond(200, '');

            dedupeRecordService.getRecords()
                .catch(function (errorMessage) {
                    message = errorMessage;
                });

            $httpBackend.flush();

            expect(message).toBe('System setting with id of sqlview not found. Please check if your app is configured correctly.');
        });
    });
});
