describe('Dedupe saver service', function () {
    var fixtures = window.fixtures;
    var $httpBackend;
    var $rootScope;
    var dedupeSaverService;
    var dedupeRecords;

    beforeEach(module('PEPFAR.dedupe'));
    beforeEach(inject(function ($injector) {
        $rootScope = $injector.get('$rootScope');
        $httpBackend = $injector.get('$httpBackend');

        dedupeSaverService = $injector.get('dedupeSaverService');

        dedupeRecords = fixtures.get('dedupeRecords');

        dedupeRecords[0].resolve.isResolved = true;
        dedupeRecords[0].resolve.type = 'custom';
        dedupeRecords[0].resolve.value = 600;
    }));

    it('should be an object', function () {
        expect(dedupeSaverService).toBeAnObject();
    });

    describe('saveDeduplication', function () {
        it('should be a function', function () {
            expect(dedupeSaverService.saveDeduplication).toBeAFunction();
        });

        it('should expect one argument', function () {
            expect(dedupeSaverService.saveDeduplication.length).toBe(1);
        });

        it('should return a promise like object on wrong input', function () {
            expect(dedupeSaverService.saveDeduplication({})).toBeAPromiseLikeObject();
        });

        it('should return a promise on correct input', function () {
            expect(dedupeSaverService.saveDeduplication([])).toBeAPromiseLikeObject();
        });

        it('should throw if argument passed is not an array', function () {
            var catchFunction = jasmine.createSpy('saveDeduplication.catch');

            dedupeSaverService.saveDeduplication({})
                .catch(catchFunction);

            $rootScope.$apply();

            expect(catchFunction).toHaveBeenCalledWith('Expected passed argument to dedupeSaverService.saveDeduplication to be an array.');
        });

        it('should reject if the argument is an empty array', function () {
            var catchFunction = jasmine.createSpy('saveDeduplication.catch');

            dedupeSaverService.saveDeduplication([])
                .catch(catchFunction);

            $rootScope.$apply();

            expect(catchFunction).toHaveBeenCalledWith('No dedupe records passed to dedupeSaverService.saveDeduplication. (Empty array)');
        });

        describe('save requests', function () {
            var dedupeRecordOne;
            var dedupeRecordTwo;

            beforeEach(function () {
                var dedupeRecords = fixtures.get('dedupeRecords');

                dedupeRecordOne = dedupeRecords[0];
                dedupeRecordTwo = dedupeRecords[1];

                dedupeRecordOne.resolve.adjustedValue = -400;
                dedupeRecordTwo.resolve.adjustedValue = 124;
            });

            afterEach(function () {
                $httpBackend.verifyNoOutstandingExpectation();
                $httpBackend.verifyNoOutstandingRequest();
            });

            it('should not call the api when there are no records', function () {
                dedupeSaverService.saveDeduplication([]);
            });

            describe('single value', function () {
                beforeEach(function () {
                    dedupeRecordOne.details.dedupeType = 'PURE';
                    dedupeRecordTwo.details.dedupeType = 'PURE';
                });

                it('should call the api with the correct dataValueSet structure', function () {
                    $httpBackend.expectPOST('/dhis/api/dataValues?cc=wUpfppgjEza&co=HllvX50cXC0&cp=xEzelmtHWPn&de=K6f6jR0NOcZ&ou=HfiOUYEPgLK&pe=2013Oct&value=-400')
                        .respond(200, fixtures.get('importResponse'));

                    dedupeSaverService.saveDeduplication([dedupeRecordOne]);

                    $httpBackend.flush();
                });

                it('should return the response structure', function () {
                    var responseStructure;
                    $httpBackend.expectPOST('/dhis/api/dataValues?cc=wUpfppgjEza&co=HllvX50cXC0&cp=xEzelmtHWPn&de=K6f6jR0NOcZ&ou=HfiOUYEPgLK&pe=2013Oct&value=-400')
                        .respond(200, fixtures.get('importResponse'));

                    dedupeSaverService.saveDeduplication([dedupeRecordOne])
                        .then(function (response) {
                            responseStructure = response;
                        });

                    $httpBackend.flush();

                    expect(responseStructure.successCount).toBe(1);
                    expect(responseStructure.errorCount).toBe(0);
                    expect(responseStructure.errors).toEqual([]);
                });

                it('should reject the promise and not call the api when a value is incorrect', function () {
                    var catchFunction = jasmine.createSpy('catchFunction');

                    delete dedupeRecordOne.resolve.adjustedValue;

                    dedupeSaverService.saveDeduplication([dedupeRecordOne])
                        .catch(catchFunction);
                    $rootScope.$apply();

                    expect(catchFunction).toHaveBeenCalledWith('Did not find a value for "adjustedValue" on passed record. {"isResolved":true,"type":"custom","value":2023}');
                });

                it('should return the error structure when saving fails', function () {
                    var catchFunction = jasmine.createSpy('catchFunction');

                    $httpBackend.expectPOST('/dhis/api/dataValues?cc=wUpfppgjEza&co=HllvX50cXC0&cp=xEzelmtHWPn&de=K6f6jR0NOcZ&ou=HfiOUYEPgLK&pe=2013Oct&value=-400')
                        .respond(409, 'html error message');

                    dedupeSaverService.saveDeduplication([dedupeRecordOne])
                        .catch(catchFunction);
                    $httpBackend.flush();

                    expect(catchFunction).toHaveBeenCalledWith({successCount: 0, errorCount: 1, errors: [new Error('Saving failed (409: html error message)')]});
                });

                describe('crosswalk', function () {
                    beforeEach(function () {
                        dedupeRecordOne.details.dedupeType = 'CROSSWALK';
                    });

                    it('should call the api with the correct dataValueSet structure', function () {
                        $httpBackend.expectPOST('/dhis/api/dataValues?cc=wUpfppgjEza&co=HllvX50cXC0&cp=OM58NubPbx1&de=K6f6jR0NOcZ&ou=HfiOUYEPgLK&pe=2013Oct&value=-400')
                            .respond(200, fixtures.get('importResponse'));

                        dedupeSaverService.saveDeduplication([dedupeRecordOne]);

                        $httpBackend.flush();
                    });
                });
            });

            describe('multiple values', function () {
                beforeEach(function () {
                    dedupeRecordOne.details.dedupeType = 'PURE';
                    dedupeRecordTwo.details.dedupeType = 'PURE';
                });

                it('should call the api with multiple values when passed multiple', function () {
                    $httpBackend.expectPOST('/dhis/api/dataValueSets?preheatCache=false', {
                        dataValues: [
                            {
                                dataElement: 'K6f6jR0NOcZ',
                                period: '2013Oct',
                                orgUnit: 'HfiOUYEPgLK',
                                categoryOptionCombo: 'HllvX50cXC0',
                                attributeOptionCombo: 'X8hrDf6bLDC',
                                value: '-400'
                            },
                            {
                                dataElement: 'H9Q2jDZ76ih',
                                period: '2013Oct',
                                orgUnit: 'HfiOUYEPgLK',
                                categoryOptionCombo: 'TbYpjxM5j6w',
                                attributeOptionCombo: 'X8hrDf6bLDC',
                                value: '124'
                            }
                        ]
                    }).respond(200, fixtures.get('importResponse'));

                    dedupeSaverService.saveDeduplication([dedupeRecordOne, dedupeRecordTwo]);

                    $httpBackend.flush();
                });

                it('should call the api with the resulting values if one of the values was incorrect', function () {
                    $httpBackend.expectPOST('/dhis/api/dataValueSets?preheatCache=false', {
                        dataValues: [
                            {
                                dataElement: 'K6f6jR0NOcZ',
                                period: '2013Oct',
                                orgUnit: 'HfiOUYEPgLK',
                                categoryOptionCombo: 'HllvX50cXC0',
                                attributeOptionCombo: 'X8hrDf6bLDC',
                                value: '-400'
                            }
                        ]
                    }).respond(200, fixtures.get('importResponse'));

                    delete dedupeRecordTwo.resolve.adjustedValue;

                    dedupeSaverService.saveDeduplication([dedupeRecordOne, dedupeRecordTwo]);

                    $httpBackend.flush();
                });

                describe('crosswalk', function () {
                    beforeEach(function () {
                        dedupeRecordOne.details.dedupeType = 'CROSSWALK';
                        dedupeRecordTwo.details.dedupeType = 'CROSSWALK';
                    });

                    it('should call the api with multiple values when passed multiple', function () {
                        $httpBackend.expectPOST('/dhis/api/dataValueSets?preheatCache=false', {
                            dataValues: [
                                {
                                    dataElement: 'K6f6jR0NOcZ',
                                    period: '2013Oct',
                                    orgUnit: 'HfiOUYEPgLK',
                                    categoryOptionCombo: 'HllvX50cXC0',
                                    attributeOptionCombo: 'YGT1o7UxfFu',
                                    value: '-400'
                                },
                                {
                                    dataElement: 'H9Q2jDZ76ih',
                                    period: '2013Oct',
                                    orgUnit: 'HfiOUYEPgLK',
                                    categoryOptionCombo: 'TbYpjxM5j6w',
                                    attributeOptionCombo: 'YGT1o7UxfFu',
                                    value: '124'
                                }
                            ]
                        }).respond(200, fixtures.get('importResponse'));

                        dedupeSaverService.saveDeduplication([dedupeRecordOne, dedupeRecordTwo]);

                        $httpBackend.flush();
                    });

                    it('should call the api with the resulting values if one of the values was incorrect', function () {
                        $httpBackend.expectPOST('/dhis/api/dataValueSets?preheatCache=false', {
                            dataValues: [
                                {
                                    dataElement: 'K6f6jR0NOcZ',
                                    period: '2013Oct',
                                    orgUnit: 'HfiOUYEPgLK',
                                    categoryOptionCombo: 'HllvX50cXC0',
                                    attributeOptionCombo: 'YGT1o7UxfFu',
                                    value: '-400'
                                }
                            ]
                        }).respond(200, fixtures.get('importResponse'));

                        delete dedupeRecordTwo.resolve.adjustedValue;

                        dedupeSaverService.saveDeduplication([dedupeRecordOne, dedupeRecordTwo]);

                        $httpBackend.flush();
                    });
                });

                it('should return an object with the number of success', function () {
                    var promiseResult;
                    var importResponse = fixtures.get('importResponse');
                    importResponse.importCount.imported = 2;

                    $httpBackend.expectPOST('/dhis/api/dataValueSets?preheatCache=false').respond(200, importResponse);

                    dedupeSaverService.saveDeduplication([dedupeRecordOne, dedupeRecordTwo])
                        .then(function (data) {
                            promiseResult = data;
                        });
                    $httpBackend.flush();

                    expect(promiseResult.successCount).toBe(2);
                    expect(promiseResult.errorCount).toBe(0);
                    expect(promiseResult.errors).toEqual([]);
                });

                it('should return an object with the errors', function () {
                    var promiseResult;

                    delete dedupeRecordOne.resolve.adjustedValue;
                    delete dedupeRecordTwo.details.orgUnitId;

                    dedupeSaverService.saveDeduplication([dedupeRecordOne, dedupeRecordTwo])
                        .catch(function (data) {
                            promiseResult = data;
                        });
                    $rootScope.$apply();

                    expect(promiseResult.successCount).toBe(0);
                    expect(promiseResult.errorCount).toBe(2);
                    expect(promiseResult.errors).toEqual([
                        new Error('Did not find a value for "adjustedValue" on passed record. {"isResolved":true,"type":"custom","value":2023}'),
                        new Error('Did not find a value for "orgUnitId" on passed record. ' +
                        '{"orgUnitName":"Cardinal Site","timePeriodName":"2013Oct","dataElementId":"H9Q2jDZ76ih",' +
                        '"dataElementName":"TX_CURR (N, DSD, Age/Sex Aggregated): Receiving ART",' +
                        '"categoryOptionComboId":"TbYpjxM5j6w","categoryOptionComboName":"(15+, Female)","dedupeType":"PURE"}')
                    ]);
                });

                it('should add the conflicts as errors', function () {
                    var promiseResult;
                    var importResponse = fixtures.get('importResponse');
                    importResponse.importCount.imported = 1;
                    importResponse.importCount.ignored = 1;
                    importResponse.conflicts = [
                        {value:'Data element not found or not acccessible'}
                    ];
                    delete dedupeRecordOne.resolve.adjustedValue;

                    $httpBackend.expectPOST('/dhis/api/dataValueSets?preheatCache=false').respond(200, importResponse);

                    dedupeSaverService.saveDeduplication([dedupeRecordOne, dedupeRecordTwo])
                        .then(function (data) {
                            promiseResult = data;
                        });
                    $httpBackend.flush();

                    expect(promiseResult.successCount).toBe(1);
                    expect(promiseResult.errorCount).toBe(2);
                    expect(promiseResult.errors).toEqual([
                        new Error('Did not find a value for "adjustedValue" on passed record. {"isResolved":true,"type":"custom","value":2023}'),
                        new Error('Data element not found or not acccessible')
                    ]);
                });
            });
        });
    });
});
