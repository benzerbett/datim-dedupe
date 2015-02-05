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

        it('should throw if the argument is an empty array', function () {

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

            it('should call the api with the correct dataValueSet structure', function () {
                $httpBackend.expectPOST('', {
                        dataValues: [
                            {
                                dataElement: 'K6f6jR0NOcZ',
                                period: '2013Oct',
                                orgUnit: 'HfiOUYEPgLK',
                                categoryOptionCombo: 'HllvX50cXC0',
                                attributeOptionCombo: 'LJ8K9VORX9s',
                                value: '-400'
                            }
                        ]
                    }).respond(200, fixtures.get('importResponse'));

                dedupeSaverService.saveDeduplication([dedupeRecordOne]);

                $httpBackend.flush();
            });

            it('should call the api with multiple values when passed multiple', function () {
                $httpBackend.expectPOST('', {
                    dataValues: [
                        {
                            dataElement: 'K6f6jR0NOcZ',
                            period: '2013Oct',
                            orgUnit: 'HfiOUYEPgLK',
                            categoryOptionCombo: 'HllvX50cXC0',
                            attributeOptionCombo: 'LJ8K9VORX9s',
                            value: '-400'
                        },
                        {
                            dataElement: 'H9Q2jDZ76ih',
                            period: '2013Oct',
                            orgUnit: 'HfiOUYEPgLK',
                            categoryOptionCombo: 'TbYpjxM5j6w',
                            attributeOptionCombo: 'LJ8K9VORX9s',
                            value: '124'
                        }
                    ]
                }).respond(200, fixtures.get('importResponse'));

                dedupeSaverService.saveDeduplication([dedupeRecordOne, dedupeRecordTwo]);

                $httpBackend.flush();
            });
        });
    });
});
