describe('Dedupefilter service', function () {
    var service;
    var $scope;
    var eventCallbackSpy;

    beforeEach(module('PEPFAR.dedupe'));
    beforeEach(inject(function ($injector) {
        var $rootScope = $injector.get('$rootScope');

        service = $injector.get('dedupeRecordFilters');
        $scope = $rootScope.$new();

        eventCallbackSpy = jasmine.createSpy('DEDUPE_RECORDFILTER_SERVICE.updated');
        $scope.$on('DEDUPE_RECORDFILTER_SERVICE.updated', eventCallbackSpy);
    }));

    it('should be an object', function () {
        expect(service).toBeAnObject();
    });

    describe('changeFilterResultsTargets', function () {
        it('should be a method', function () {
            expect(service.changeFilterResultsTargets).toEqual(jasmine.any(Function));
        });

        it('should set a result/targets filter onto the service', function () {
            service.changeFilterResultsTargets({name: 'Results'});

            expect(service.getResultsTargetsFilter()).toEqual('Results');
        });
    });

    describe('updatePeriodFilter', function () {
        it('should be a method', function () {
            expect(service.changePeriodFilter).toEqual(jasmine.any(Function));
        });

        it('should set the iso property as the filter', function () {
            service.changePeriodFilter({iso: '2013Oct'});

            expect(service.getFilters().pe).toEqual('2013Oct');
        });

        it('should fire the update event when the value was changed', function () {
            service.changePeriodFilter({iso: '2013Oct'});

            expect(eventCallbackSpy).toHaveBeenCalled();
        });

        it('should fire the update event with the correct parameters', function () {
            service.changePeriodFilter({iso: '2013Oct'});

            expect(eventCallbackSpy.calls.argsFor(0)[1]).toEqual({ty: 'PURE', pe: '2013Oct'});
        });

        it('should not throw when period is undefined', function () {
            function shouldNotThrow() {
                service.changePeriodFilter();
            }

            expect(shouldNotThrow).not.toThrow();
        });

        it('should set the period name onto the filter service', function () {
            service.changePeriodFilter({iso: '2013Oct', name: 'October 2013'});

            expect(service.getPeriodDisplayName()).toEqual('October 2013');
        });

        it('should return the period iso name', function () {
            service.changePeriodFilter({iso: '2013Oct', name: 'October 2013'});

            expect(service.getPeriodName()).toEqual('2013Oct');
        });
    });

    describe('getResultsTargetsFilter', function () {
        it('should be a method', function () {
            expect(service.getResultsTargetsFilter).toEqual(jasmine.any(Function));
        });

        it('should return true when a filter for results/targets has been set', function () {
            service.changeFilterResultsTargets({name: 'Results'});

            expect(service.getResultsTargetsFilter()).toEqual('Results');
        });
    });

    describe('changeOrganisationUnit', function () {
        it('should be a method', function () {
            expect(service.changeOrganisationUnit).toEqual(jasmine.any(Function));
        });

        it('should set the ou filter to the id of the passed organisation unit', function () {
            service.changeOrganisationUnit({id: 'orgunitid'});

            expect(service.getFilters().ou).toEqual('orgunitid');
        });

        it('should not throw when orgunit is undefined', function () {
            function shouldNotThrow() {
                service.changeOrganisationUnit(undefined);
            }

            expect(shouldNotThrow).not.toThrow();
        });

        it('should fire the update event when the value was changed', function () {
            service.changeOrganisationUnit({id: 'orgunitid'});

            expect(eventCallbackSpy).toHaveBeenCalled();
        });

        it('should fire the update event with the correct parameters', function () {
            service.changeOrganisationUnit({id: 'orgunitid'});

            expect(eventCallbackSpy.calls.argsFor(0)[1]).toEqual({ty: 'PURE', ou: 'orgunitid'});
        });
    });

    describe('changeIsCrosswalk', function () {
        it('should be a method', function () {
            expect(service.changeIsCrosswalk).toEqual(jasmine.any(Function));
        });

        it('should set the isCrosswalk flag to true when true is passed', function () {
            service.changeIsCrosswalk(true);

            expect(service.getDedupeType()).toEqual('CROSSWALK');
        });

        it('should fire the update event when the value was changed', function () {
            service.changeIsCrosswalk(true);

            expect(eventCallbackSpy).toHaveBeenCalled();
        });

        it('should fire the update event with the correct parameters', function () {
            service.changeIsCrosswalk(true);

            expect(eventCallbackSpy.calls.argsFor(0)[1]).toEqual({ty: 'CROSSWALK'});
        });
    });
});
