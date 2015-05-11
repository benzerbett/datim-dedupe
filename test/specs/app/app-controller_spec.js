describe('App controller', function () {
    var dedupeServiceMock;
    var dedupeRecordFiltersMock;
    var notifyMock;
    var $controller;
    var controller;
    var $rootScope;
    var scope;
    var dedupeRecords;
    var $q;

    beforeEach(module('PEPFAR.dedupe'));

    beforeEach(inject(function ($injector) {
        dedupeRecords = [{
            id: '2364f5b15e57185fc6564ce64cc9c629',
            details: {
                orgUnitName: 'Glady\'s clinic'
            },
            data: [
                {agency: 'USAID', partner: 'PartnerA', value: 60},
                {agency: 'USAID', partner: 'PartnerB', value: 40},
                {agency: 'USAID', partner: 'PartnerC', value: 20}
            ],
            resolve: {
                type: undefined,
                value: undefined
            }
        }, {
            details: {
                orgUnitName: 'Glady\'s clinic'
            },
            data: [
                {agency: 'CDC', partner: 'PartnerA', value: 12},
                {agency: 'CDC', partner: 'PartnerD', value: 30},
                {agency: 'CDC', partner: 'PartnerG', value: 10}
            ],
            resolve: {
                type: undefined,
                value: undefined
            }
        }, {
            details: {
                orgUnitName: 'Mark\'s clinic',
                timePeriodName: 'FY 2014'
            },
            data: [
                {agency: 'CDC', partner: 'PartnerD', value: 50},
                {agency: 'CDC', partner: 'PartnerU', value: 20},
                {agency: 'CDC', partner: 'PartnerT', value: 17}
            ],
            resolve: {
                type: 'custom',
                value: -10,
                isResolved: true
            }
        }];

        dedupeRecords.totalNumber = 10;
        dedupeRecords.pageNumber = 1;

        $q = $injector.get('$q');
        $controller = $injector.get('$controller');

        $rootScope = $injector.get('$rootScope');

        dedupeServiceMock = {
            getMax: jasmine.createSpy('dedupeService.getMax'),
            getSum: jasmine.createSpy('dedupeService.getSum'),
            getDuplicateRecords: jasmine.createSpy('dedupeService.getDuplicateRecords')
                .and.returnValue($q.when(dedupeRecords)),
            resolveDuplicates: jasmine.createSpy('dedupeService.resolveDuplicates')
                .and.returnValue($q.when({
                    successCount: 1,
                    errorCount: 0,
                    errors: []
                })),
            getCsvUrl: jasmine.createSpy('dedupeServive.getCsvUrl')
                .and.returnValue($q.when('/dhis/api/sqlViews/AuL6zTSLxNc/data.csv?var=ou:HfiOUYEPgLK&var=pe:2013Oct&var=ty:PURE'))
        };

        dedupeRecordFiltersMock = {
            getPeriodName: jasmine.createSpy('dedupeRecordFiltersService.getPeriodName')
                .and.returnValue('2013Oct'),
            getPeriodDisplayName: jasmine.createSpy('dedupeRecordFiltersService.getPeriodDisplayName')
                .and.returnValue('October 2013')
        };

        scope = $rootScope.$new();

        notifyMock = {
            error: jasmine.createSpy('notify.error'),
            warning: jasmine.createSpy('notify.warning'),
            success: jasmine.createSpy('notify.success')
        };

        controller = $controller('appController', {
            dedupeService: dedupeServiceMock,
            dedupeRecordFilters: dedupeRecordFiltersMock,
            $scope: scope,
            notify: notifyMock
        });

        controller.allDedupeRecords = [{
            id: '2364f5b15e57185fc6564ce64cc9c629',
            details: {
                orgUnitName: 'Glady\'s clinic',
                timePeriodName: 'FY 2014',
                dedupeType: 'PURE'
            },
            data: [
                {agency: 'USAID', partner: 'PartnerA', value: 60},
                {agency: 'USAID', partner: 'PartnerB', value: 40},
                {agency: 'USAID', partner: 'PartnerC', value: 20}
            ],
            resolve: {
                type: undefined,
                value: undefined
            }
        }, {
            details: {
                orgUnitName: 'Glady\'s clinic',
                timePeriodName: 'FY 2014',
                dedupeType: 'PURE'
            },
            data: [
                {agency: 'CDC', partner: 'PartnerA', value: 12},
                {agency: 'CDC', partner: 'PartnerD', value: 30},
                {agency: 'CDC', partner: 'PartnerG', value: 10}
            ],
            resolve: {
                type: undefined,
                value: undefined
            }
        }, {
            details: {
                orgUnitName: 'Mark\'s clinic',
                timePeriodName: 'FY 2014',
                dedupeType: 'PURE'
            },
            data: [
                {agency: 'CDC', partner: 'PartnerD', value: 50},
                {agency: 'CDC', partner: 'PartnerU', value: 20},
                {agency: 'CDC', partner: 'PartnerT', value: 17}
            ],
            resolve: {
                type: 'custom',
                value: -10,
                isResolved: true
            }
        }];

        controller.dedupeRecords = [{
            id: '2364f5b15e57185fc6564ce64cc9c629',
            details: {
                orgUnitName: 'Glady\'s clinic',
                timePeriodName: 'FY 2014',
                dedupeType: 'PURE'
            },
            data: [
                {agency: 'USAID', partner: 'PartnerA', value: 60},
                {agency: 'USAID', partner: 'PartnerB', value: 40},
                {agency: 'USAID', partner: 'PartnerC', value: 20}
            ],
            resolve: {
                type: undefined,
                value: undefined
            }
        }, {
            details: {
                orgUnitName: 'Glady\'s clinic',
                timePeriodName: 'FY 2014',
                dedupeType: 'PURE'
            },
            data: [
                {agency: 'CDC', partner: 'PartnerA', value: 12},
                {agency: 'CDC', partner: 'PartnerD', value: 30},
                {agency: 'CDC', partner: 'PartnerG', value: 10}
            ],
            resolve: {
                type: undefined,
                value: undefined
            }
        }];
    }));

    it('should be an object', function () {
        expect(controller).toBeAnObject();
    });

    describe('initialise', function () {
        it('should set isProcessing to its initial state', function () {
            expect(controller.isProcessing).toBe(false);
        });
    });

    describe('useMax', function () {
        beforeEach(function () {
            //Apply rootscope to resolve the mock promise
            $rootScope.$apply();
        });

        it('should set the resolve type to max on all the records', function () {
            controller.useMax();

            expect(controller.dedupeRecords[0].resolve.type).toBe('max');
            expect(controller.dedupeRecords[1].resolve.type).toBe('max');
        });

        it('should call the dedupeService to get the max value', function () {
            controller.useMax();

            expect(dedupeServiceMock.getMax.calls.count()).toBe(2);
            expect(dedupeServiceMock.getMax).toHaveBeenCalledWith(controller.dedupeRecords[0].data);
            expect(dedupeServiceMock.getMax).toHaveBeenCalledWith(controller.dedupeRecords[1].data);
        });

        it('should set the max returned value onto the dedupeRecords', function () {
            dedupeServiceMock.getMax.and.returnValue(60);

            controller.useMax();

            expect(controller.dedupeRecords[0].resolve.value).toBe(60);
            expect(controller.dedupeRecords[1].resolve.value).toBe(60);
        });

        it('should not attempt to map the records if there are none', function () {
            controller.dedupeRecords = undefined;

            controller.useMax();
        });

        it('should not throw an error when dedupeRecords is an empty array', function () {
            controller.dedupeRecords = [];

            controller.useMax();
        });
    });

    describe('useSum', function () {
        beforeEach(function () {
            //Apply rootscope to resolve the mock promise
            $rootScope.$apply();
        });

        it('should set the resolve type to sum on all records', function () {
            controller.useSum();

            expect(controller.dedupeRecords[0].resolve.type).toBe('sum');
            expect(controller.dedupeRecords[1].resolve.type).toBe('sum');
        });

        it('should call the dedupeService to get the sum value', function () {
            controller.useSum();

            expect(dedupeServiceMock.getSum.calls.count()).toBe(2);
            expect(dedupeServiceMock.getSum).toHaveBeenCalledWith(controller.dedupeRecords[0].data);
            expect(dedupeServiceMock.getSum).toHaveBeenCalledWith(controller.dedupeRecords[1].data);
        });

        it('should set the sum returned value onto the dedupeRecords', function () {
            dedupeServiceMock.getSum.and.returnValue(120);

            controller.useSum();

            expect(controller.dedupeRecords[0].resolve.value).toBe(120);
            expect(controller.dedupeRecords[1].resolve.value).toBe(120);
        });

        it('should not attempt to map the records if there are none', function () {
            controller.dedupeRecords = undefined;

            controller.useSum();
        });

        it('should not throw an error when dedupeRecords is an empty array', function () {
            controller.dedupeRecords = [];

            controller.useSum();
        });
    });

    describe('resolveDeduplication', function () {
        beforeEach(function () {
            //Apply rootscope to resolve the mock promise
            $rootScope.$apply();
        });

        it('should be a function', function () {
            expect(controller.resolveDuplicates).toBeAFunction();
        });

        it('should call resolveDeduplication on the dedupeService', function () {
            controller.resolveDuplicates();

            expect(dedupeServiceMock.resolveDuplicates).toHaveBeenCalledWith(controller.dedupeRecords);
        });

        it('should set processing to true', function () {
            controller.resolveDuplicates();

            expect(controller.isProcessing).toBe(true);
        });

        it('should set processing to false after the resolve was completed', function () {
            controller.resolveDuplicates();
            $rootScope.$apply();

            expect(controller.isProcessing).toBe(false);
        });

        it('should remove the the duplicate from the list when it has been resolved', function () {
            $rootScope.$broadcast('DEDUPE_DIRECTIVE.resolve', '2364f5b15e57185fc6564ce64cc9c629', {successCount: 1, errorCount: 0, errors: []});

            expect(controller.dedupeRecords.length).toBe(1);
        });

        it('should log error when getting the records failed', inject(function ($q) {
            dedupeServiceMock.resolveDuplicates
                .and.returnValue($q.reject('Duplicate records passed to resolveDuplicates should be an array with at least one element.'));

            //Recreate controller to re-run the init method with error returning dedupeService
            controller = $controller('appController', {
                dedupeService: dedupeServiceMock,
                $scope: scope,
                notify: notifyMock
            });
            controller.resolveDuplicates();
            $rootScope.$apply();

            expect(notifyMock.error).toHaveBeenCalled();
        }));

        it('should report back the status when it is successful', function () {
            $rootScope.$broadcast('DEDUPE_DIRECTIVE.resolve', '2364f5b15e57185fc6564ce64cc9c629', {successCount: 1, errorCount: 0, errors: []});

            expect(notifyMock.success).toHaveBeenCalled();
        });

        it('should report back when the save failed', function () {
            $rootScope.$broadcast('DEDUPE_DIRECTIVE.resolve', '2364f5b15e57185fc6564ce64cc9c629', {successCount: 0, errorCount: 1, errors: ['Save failed']});

            expect(notifyMock.warning).toHaveBeenCalled();
            expect(notifyMock.error).toHaveBeenCalled();
        });
    });

    describe('includeResolved', function () {
        beforeEach(function () {
            //Apply rootscope to resolve the mock promise
            $rootScope.$apply();

            spyOn(controller, 'getDuplicateRecords');
        });

        it('should update the records when calling changedIncludeResolved', function () {
            controller.changedIncludeResolved();

            expect(dedupeServiceMock.getDuplicateRecords).toHaveBeenCalledWith(undefined, undefined, true, undefined, 1, 'PURE');
        });

        it('should return to only showing the resolved ones', function () {
            controller.changedIncludeResolved();

            expect(dedupeServiceMock.getDuplicateRecords).toHaveBeenCalledWith(undefined, undefined, true, undefined, 1, 'PURE');

            controller.changedIncludeResolved();

            expect(dedupeServiceMock.getDuplicateRecords).toHaveBeenCalledWith(undefined, undefined, false, undefined, 1, 'PURE');
        });
    });

    describe('getDuplicateRecords', function () {
        beforeEach(function () {
            controller.isProcessing = false;
            controller.dedupeRecords = [];
            controller.allDedupeRecords = [];
        });

        it('should set processing to true', function () {
            controller.getDuplicateRecords();

            expect(controller.isProcessing).toBe(true);
        });

        it('should set processing to false after duplicate records are loaded', function () {
            controller.getDuplicateRecords();

            $rootScope.$apply();

            expect(controller.isProcessing).toBe(false);
        });

        it('should set all the duplicate records onto the controller', function () {
            controller.getDuplicateRecords();

            $rootScope.$apply();

            expect(controller.allDedupeRecords.length).toBe(3);
        });

        it('should log error when getting the records failed', inject(function ($q) {
            dedupeServiceMock.getDuplicateRecords
                .and.returnValue($q.reject('System setting with id of view not found. Please check if your app is configured correctly.'));
            controller.getDuplicateRecords();

            $rootScope.$apply();

            expect(notifyMock.error).toHaveBeenCalled();
        }));

        it('should log a default error when there is no error message present', function () {
            dedupeServiceMock.getDuplicateRecords
                .and.returnValue($q.reject(undefined));
            controller.getDuplicateRecords();

            $rootScope.$apply();

            expect(notifyMock.error).toHaveBeenCalledWith('An error occurred when loading the dedupe records.');
        });

        it('should add the paging to the controller', function () {
            controller.getDuplicateRecords('myorgUnit', '2013April');

            $rootScope.$apply();

            expect(controller.pager).toEqual({total: 10, current: 1, pageSize: 50});
        });

        it('should set the period name and period display name onto the record objects', function () {
            controller.getDuplicateRecords();

            $rootScope.$apply();

            expect(controller.dedupeRecords[0].details.timePeriodName).toEqual('2013Oct');
            expect(controller.dedupeRecords[0].details.timePeriodDisplayName).toEqual('October 2013');
        });

        it('should ask for crosswalk dedupe if there are no records and getrecords was called with PURE', function () {
            dedupeServiceMock.getDuplicateRecords.and.returnValue($q.when([]));
            spyOn(controller, 'showCrossWalkMessage');
            $rootScope.$broadcast('DEDUPE_RECORDFILTER_SERVICE.updated', {ou: 'myOrgUnit', pe: 'Oct 2013', ty: 'PURE'});

            $rootScope.$apply();

            expect(dedupeServiceMock.getDuplicateRecords).toHaveBeenCalledWith('myOrgUnit', 'Oct 2013', false, undefined, 1, 'PURE');
            expect(controller.showCrossWalkMessage).toHaveBeenCalled();
        });
    });

    describe('update on filter changed', function () {
        it('should call getDuplicateRecords on the DEDUPE_RECORDFILTER_SERVICE.updated event', function () {
            spyOn(controller, 'getDuplicateRecords');

            $rootScope.$broadcast('DEDUPE_RECORDFILTER_SERVICE.updated', {ou: 'myOrgUnit'});

            expect(controller.getDuplicateRecords).toHaveBeenCalled();
        });

        it('should set the correct filters onto the controller', function () {
            $rootScope.$broadcast('DEDUPE_RECORDFILTER_SERVICE.updated', {ou: 'myOrgUnit', pe: '2013Oct', tr: 'Results', ty: 'PURE'});

            expect(dedupeServiceMock.getDuplicateRecords).toHaveBeenCalledWith('myOrgUnit', '2013Oct', false, 'Results', 1, 'PURE');
        });
    });

    describe('pageChanged', function () {
        it('should call the getDuplicateRecords', function () {
            controller.pager.current = 2;
            controller.pageChanged();

            expect(dedupeServiceMock.getDuplicateRecords).toHaveBeenCalledWith(undefined, undefined, false, undefined, 2, 'PURE');
        });

        it('should notify the user if no results have been found', function () {
            dedupeServiceMock.getDuplicateRecords.and.returnValue($q.when([]));

            $rootScope.$broadcast('DEDUPE_RECORDFILTER_SERVICE.updated', {ou: 'myOrgUnit', pe: '2013Oct', tr: 'Results'});

            $rootScope.$apply();

            expect(notifyMock.warning).toHaveBeenCalled();
        });

        it('should not notify the user if one of the required filters has not been set', function () {
            dedupeServiceMock.getDuplicateRecords.and.returnValue($q.when([]));
            $rootScope.$broadcast('DEDUPE_RECORDFILTER_SERVICE.updated', {ou: 'myOrgUnit', tr: 'Results'});

            $rootScope.$apply();

            expect(notifyMock.warning).not.toHaveBeenCalled();
        });
    });

    describe('isShowingCrosswalkDedupes', function () {
        it('should be a function', function () {
            expect(controller.isShowingCrosswalkDedupes).toEqual(jasmine.any(Function));
        });
    });

    describe('when getting duplicate records', function () {
        it('should call getCsvUrl on the dedupeService', function () {
            //Sets filters and calls duplicate records through event
            $rootScope.$broadcast('DEDUPE_RECORDFILTER_SERVICE.updated', {ou: 'myOrgUnit', pe: '2013Oct', tr: 'Results', ty: 'PURE'});

            $rootScope.$apply();

            expect(dedupeServiceMock.getCsvUrl).toHaveBeenCalledWith('myOrgUnit', '2013Oct', false, 'Results', 1, 'PURE');
        });

        it('should set the url on the controller on success', function () {
            $rootScope.$broadcast('DEDUPE_RECORDFILTER_SERVICE.updated', {ou: 'myOrgUnit', pe: '2013Oct', tr: 'Results', ty: 'PURE'});

            $rootScope.$apply();

            expect(controller.csvSettings.url).toEqual('/dhis/api/sqlViews/AuL6zTSLxNc/data.csv?var=ou:HfiOUYEPgLK&var=pe:2013Oct&var=ty:PURE');
        });

        it('should set the show flag on the controller on success', function () {
            $rootScope.$broadcast('DEDUPE_RECORDFILTER_SERVICE.updated', {ou: 'myOrgUnit', pe: '2013Oct', tr: 'Results', ty: 'PURE'});

            $rootScope.$apply();

            expect(controller.csvSettings.show).toEqual(true);
        });

        it('should set the show flag to false when the call fails', function () {
            dedupeServiceMock.getCsvUrl.and.returnValue($q.reject('failed'));

            controller.csvSettings.show = true;
            controller.getDuplicateRecords();

            $rootScope.$apply();

            expect(controller.csvSettings.show).toEqual(false);
        });
    });
});
