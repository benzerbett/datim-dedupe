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

        getRecordsRequest = $httpBackend.expectGET('/dhis/api/sqlViews/AuL6zTSLxNc/data?var=ty:PURE')
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
            expect(dedupeRecordService.getRecords({ty: 'PURE'})).toBeAPromiseLikeObject();
        });

        describe('results', function () {
            var dedupeRecords;

            beforeEach(function () {
                dedupeRecordService.getRecords({ty: 'PURE'})
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

            it('should set isResolved to false for the first dedupe record', function () {
                expect(dedupeRecords[0].resolve.isResolved).toBe(false);
            });

            it('should set the data element name', function () {
                expect(dedupeRecords[0].details.dataElementName).toBe('HTC_TST (N, DSD): HTC received results');
            });

            it('should set the disaggregation', function () {
                expect(dedupeRecords[0].details.disaggregation).toBe('(default)');
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
                expect(dedupeRecords[0].id).toBe('1');
            });

            it('should set the total number of pages onto the result', function () {
                expect(dedupeRecords.totalNumber).toBe(243);
            });

            it('should set the dedupe type onto the result', function () {
                expect(dedupeRecords[0].details.dedupeType).toBe('PURE');
            });

            it('should return the dedupe type when calling the getDedupeType method', function () {
                expect(dedupeRecords[0].getDedupeType()).toBe('PURE');
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
            var firstDedupeRecord;
            var secondDedupeRecord;
            var thirdDedupeRecord;

            beforeEach(function () {
                getRecordsRequest.respond(200, fixtures.get('resolvedDedupe'));

                dedupeRecordService.getRecords({ty: 'PURE'})
                    .then(function (records) {
                        firstDedupeRecord = records[0];
                        secondDedupeRecord = records[1];
                        thirdDedupeRecord = records[2];
                    });

                $httpBackend.flush();
            });

            it('should set resolve.isResolved to true', function () {
                expect(firstDedupeRecord.resolve.isResolved).toBe(true);
            });

            it('should set the resolve.value to the actual number', function () {
                expect(firstDedupeRecord.resolve.value).toBe(12);
            });

            it('should set the resolved type to custom', function () {
                expect(firstDedupeRecord.resolve.type).toBe('custom');
            });

            it('should set resolved type to sum', function () {
                expect(secondDedupeRecord.resolve.type).toBe('sum');
            });

            it('should set the resolved type to max', function () {
                expect(thirdDedupeRecord.resolve.type).toBe('max');
            });
        });

        describe('messed up dedupe', function () {
            var dedupeRecords;

            beforeEach(function () {
                getRecordsRequest.respond(200, fixtures.get('messedupdedupe'));

                dedupeRecordService.getRecords({ty: 'PURE'})
                    .then(function (records) {
                        dedupeRecords = records;
                    });

                $httpBackend.flush();
            });

            it('should not show any records', function () {
                expect(dedupeRecords.length).toBe(0);
            });
        });
    });

    describe('getCrossWalkRecords', function () {
        var dedupeRecords;

        beforeEach(function () {
            $httpBackend.resetExpectations();

            $httpBackend.expectGET('/dhis/api/systemSettings/keyDedupeSqlViewId')
                .respond(200, {
                    id: 'AuL6zTSLxNc'
                });

            $httpBackend.expectGET('/dhis/api/sqlViews/AuL6zTSLxNc/data?var=ty:CROSSWALK')
                .respond(200, fixtures.get('dsdvaluedupes'));

            dedupeRecordService.getRecords({ty: 'CROSSWALK'})
                .then(function (records) {
                    dedupeRecords = records;
                });

            $httpBackend.flush();
        });

        it('should return crosswalk records', function () {
            expect(dedupeRecords[0].details.dedupeType).toEqual('CROSSWALK');
        });

        it('should not include the dedupe records', function () {
            expect(dedupeRecords[0].data.length).toEqual(2);
        });

        it('should auto resolve these prior to returning them', function () {
            expect(dedupeRecords[0].resolve.type).toEqual('custom');
            expect(dedupeRecords[0].resolve.value).toEqual(0);

            expect(dedupeRecords[1].resolve.type).toEqual('custom');
            expect(dedupeRecords[1].resolve.value).toEqual(11);
        });

        it('should set the DSD Value record to not calculate=false', function () {
            expect(dedupeRecords[0].data[0].calculate).toEqual(false);
        });

        it('should set the DSD Value record to not display=true', function () {
            expect(dedupeRecords[0].data[0].display).toEqual(true);
        });
    });

    describe('getRecords with filters', function () {
        beforeEach(function () {
            $httpBackend.resetExpectations();
        });

        afterEach(function () {
            $httpBackend.verifyNoOutstandingRequest();
            $httpBackend.verifyNoOutstandingExpectation();
        });

        describe('orgunit filter', function () {
            beforeEach(function () {
                $httpBackend.expectGET('/dhis/api/systemSettings/keyDedupeSqlViewId')
                    .respond(200, {id: 'AuL6zTSLxNc'});

                getRecordsRequest = $httpBackend.expectGET('/dhis/api/sqlViews/AuL6zTSLxNc/data?var=ou:HfiOUYEPgLK')
                    .respond(200, fixtures.get('smallerDedupe'));
            });

            it('should call the api with the correct url', function () {
                dedupeRecordService.getRecords({
                    ou: 'HfiOUYEPgLK'
                });

                $httpBackend.flush();
            });
        });

        describe('period filter', function () {
            beforeEach(function () {
                $httpBackend.expectGET('/dhis/api/systemSettings/keyDedupeSqlViewId')
                    .respond(200, {id: 'AuL6zTSLxNc'});

                $httpBackend.expectGET('/dhis/api/sqlViews/AuL6zTSLxNc/data?var=pe:2013Oct')
                    .respond(200, fixtures.get('smallerDedupe'));
            });

            it('should call the api with the correct url', function () {
                dedupeRecordService.getRecords({
                    pe: '2013Oct'
                });

                $httpBackend.flush();
            });
        });
    });

    describe('dedupeSystemSetting error handling', function () {
        it('should reject the promise when the systemsetting could not be found', function () {
            var message;
            $httpBackend.resetExpectations();

            $httpBackend.expectGET('/dhis/api/systemSettings/keyDedupeSqlViewId')
                .respond(200, '');

            dedupeRecordService.getRecords({ty: 'PURE'})
                .catch(function (errorMessage) {
                    message = errorMessage;
                });

            $httpBackend.flush();

            expect(message).toBe('System setting with id of sqlview not found. Please check if your app is configured correctly.');
        });
    });
});
