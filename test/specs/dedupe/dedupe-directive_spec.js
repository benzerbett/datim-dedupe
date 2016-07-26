describe('Dedupe directive', function () {
    //var fixtures = window.fixtures;
    var $scope;
    var element;
    var $rootScope;

    beforeEach(module('dedupe/dedupe.html'));
    beforeEach(module('PEPFAR.dedupe', function ($provide) {
        $provide.factory('dedupeService', function ($q) {
            return {
                resolveDuplicates: jasmine.createSpy()
                    .and.returnValue($q.when({
                        successCount: 1,
                        errorCount: 0,
                        errors: []
                    })),
                getMax: jasmine.createSpy()
                    .and.returnValue(60),
                getSum: jasmine.createSpy()
                    .and.returnValue(130)
            };
        });
    }));

    beforeEach(inject(function ($injector) {
        var $compile = $injector.get('$compile');
        $rootScope = $injector.get('$rootScope');
        element = angular.element('<dedupe dedupe-record="firstDedupeRecord"></dedupe>');

        $scope = $rootScope.$new();
        $scope.firstDedupeRecord = {
            id: '2364f5b15e57185fc6564ce64cc9c629',
            details: {
                orgUnitName: 'Glady\'s clinic',
                timePeriodName: 'FY2014',
                timePeriodDisplayName: 'FY 2014',
                dataElementId: 'K6f6jR0NOcZ',
                dataElementName: 'HTC_TST (N, DSD): HTC received results',
                disaggregation: '(default)',
                dedupeType: 'PURE'
            },
            data: [
                {agency: 'USAID', partner: 'PartnerA', value: 60, display: true, mechanismNumber: '10000'},
                {agency: 'USAID', partner: 'PartnerB', value: 40, display: true, mechanismNumber: '20000'},
                {agency: 'USAID', partner: 'PartnerC', value: 20, display: true, mechanismNumber: '30000'},
                {agency: 'USAID', partner: 'PartnerD', value: 10, display: false, mechanismNumber: '0000'}
            ],
            resolve: {
                type: undefined,
                value: undefined
            },
            getDedupeType: jasmine.createSpy('getDedupeType').and.returnValue('PURE')
        };

        element = $compile(element)($scope);
        $scope.$digest();
    }));

    it('should compile', function () {
        expect(element).toHaveClass('dedupe-wrap');
    });

    it('should have the well class', function () {
        expect(element).toHaveClass('well');
    });

    it('should set the name of the form', function () {
        expect(element[0]).toHaveAttribute('name');
        expect(element.attr('name')).toBe('dedupeRecordForm');
    });

    describe('dedupe details', function () {
        var dedupeDetailsElementFirstRow;
        var dedupeDetailsElementSecondRow;

        beforeEach(function () {
            dedupeDetailsElementFirstRow = element[0].querySelectorAll('.dedupe-details .row')[0];
            dedupeDetailsElementSecondRow = element[0].querySelectorAll('.dedupe-details .row')[1];
        });

        it('should have two rows', function () {
            expect(dedupeDetailsElementFirstRow).toEqual(jasmine.any(HTMLElement));
            expect(dedupeDetailsElementSecondRow).toEqual(jasmine.any(HTMLElement));
        });

        it('should have a column for the data element name', function () {
            expect(dedupeDetailsElementFirstRow.querySelector('.dataelement-name')).toEqual(jasmine.any(HTMLElement));
        });

        it('should have a span for the value of data element', function () {
            expect(dedupeDetailsElementFirstRow.querySelector('.dataelement-name').querySelector('span')).toEqual(jasmine.any(HTMLElement));
        });

        it('should have a span for the value of disaggregation', function () {
            expect(dedupeDetailsElementFirstRow.querySelector('.disaggregation-name').querySelector('span')).toEqual(jasmine.any(HTMLElement));
        });

        it('should have a column for the org unit name', function () {
            expect(dedupeDetailsElementSecondRow.querySelector('.organisation-unit-name')).toEqual(jasmine.any(HTMLElement));
        });

        it('should set the appropriate column width for the org unit fields', function () {
            expect(dedupeDetailsElementSecondRow.querySelector('.organisation-unit-name')).toHaveClass('col-sm-6');
        });

        it('should have a column for the period label', function () {
            expect(dedupeDetailsElementSecondRow.querySelector('.period-label')).toEqual(jasmine.any(HTMLElement));
        });

        it('should have a column for the period name', function () {
            expect(dedupeDetailsElementSecondRow.querySelector('.period-name')).toEqual(jasmine.any(HTMLElement));
        });

        it('should set the appropriate column width for the period fields', function () {
            expect(dedupeDetailsElementSecondRow.querySelector('.period-label')).toHaveClass('col-sm-2');
            expect(dedupeDetailsElementSecondRow.querySelector('.period-name')).toHaveClass('col-sm-4');
        });

        it('should place the text "Time period:" into the period label', function () {
            var textElement = dedupeDetailsElementSecondRow.querySelector('.period-label').querySelector('span');

            expect(textElement.textContent).toEqual('Time period:');
        });

        it('should add the translate directive onto the period label', function () {
            var textElement = dedupeDetailsElementSecondRow.querySelector('.period-label').querySelector('span');

            expect(textElement).toHaveAttribute('translate');
        });

        it('should set the data element name to ', function () {
            var textElement = dedupeDetailsElementFirstRow.querySelector('.dataelement-name').querySelector('span');

            expect(textElement.textContent).toEqual('HTC_TST (N, DSD): HTC received results');
        });

        it('should add the disaggregation value', function () {
            var textElement = dedupeDetailsElementFirstRow.querySelector('.disaggregation-name').querySelector('span');

            expect(textElement.textContent).toEqual('(default)');
        });

        it('should set the org unit name to Glady\'s clinic', function () {
            var textElement = dedupeDetailsElementSecondRow.querySelector('.organisation-unit-name span');

            expect(textElement.textContent).toEqual('Glady\'s clinic');
        });

        it('should set the time period to FY 2014', function () {
            var textElement = dedupeDetailsElementSecondRow.querySelector('.period-name span');

            expect(textElement.textContent).toEqual('FY 2014');
        });

        it('should not add the dedupe-is-resolved class to the dedupe-details', function () {
            var dedupeDetailsElement = element[0].querySelectorAll('.dedupe-details');

            expect(dedupeDetailsElement[0].classList.contains('dedupe-is-resolved')).toEqual(false);
        });

        it('should add the dedupe-is-resolved class to the dedupe-details', function () {
            var dedupeDetailsElement;

            $scope.firstDedupeRecord.resolve.isResolved = true;
            $scope.$apply();

            dedupeDetailsElement = element[0].querySelectorAll('.dedupe-details');

            expect(dedupeDetailsElement[0].classList.contains('dedupe-is-resolved')).toEqual(true);
        });
    });

    describe('dedupe data', function () {
        var dedupeDataElement;

        beforeEach(function () {
            dedupeDataElement = element[0].querySelector('.dedupe-data.row');
        });

        it('should be a row', function () {
            expect(element[0].querySelector('.row.dedupe-data')).toEqual(jasmine.any(HTMLElement));
        });

        it('should have a dedupe-data-table', function () {
            var dedupeDataTable = element[0].querySelector('.row.dedupe-data').querySelector('div');

            expect(dedupeDataTable).toEqual(jasmine.any(HTMLElement));
            expect(dedupeDataTable).toHaveClass('dedupe-data-table');
            expect(dedupeDataTable).toHaveClass('col-sm-7');
        });

        describe('dedupe-data-table', function () {
            var dedupeDataTable;

            beforeEach(function () {
                dedupeDataTable = element[0].querySelector('.row.dedupe-data').querySelector('div');
            });

            describe('header row', function () {
                var headerRowNode;

                beforeEach(function () {
                    headerRowNode = dedupeDataTable.querySelector('.table-header');
                });

                it('should exist', function () {
                    expect(dedupeDataTable.querySelectorAll('.table-header').length).toBe(1);
                });

                it('should have the class "row"', function () {
                    expect(headerRowNode).toHaveClass('row');
                });

                it('should have three columns', function () {
                    expect(headerRowNode.querySelectorAll('div').length).toBe(4);
                });

                describe('first column', function () {
                    var firstHeaderColumn;

                    beforeEach(function () {
                        firstHeaderColumn = headerRowNode.querySelectorAll('div')[0];
                    });

                    it('should have the col-sm-3 class', function () {
                        expect(firstHeaderColumn).toHaveClass('col-sm-3');
                    });

                    it('should have the label "Agency"', function () {
                        var textNode = firstHeaderColumn.querySelector('span');

                        expect(textNode.textContent).toBe('Agency');
                    });

                    it('should add the translate attribute to the label', function () {
                        var textNode = firstHeaderColumn.querySelector('span');

                        expect(textNode).toHaveAttribute('translate');
                    });
                });

                describe('second column', function () {
                    var secondHeaderColumn;

                    beforeEach(function () {
                        secondHeaderColumn = headerRowNode.querySelectorAll('div')[1];
                    });

                    it('should have the col-sm-4 class', function () {
                        expect(secondHeaderColumn).toHaveClass('col-sm-4');
                    });

                    it('should have the label "Partner"', function () {
                        var textNode = secondHeaderColumn.querySelector('span');

                        expect(textNode.textContent).toBe('Partner');
                    });

                    it('should add the translate attribute to the label', function () {
                        var textNode = secondHeaderColumn.querySelector('span');

                        expect(textNode).toHaveAttribute('translate');
                    });
                });

                describe('third column', function () {
                    var thirdHeaderColumn;

                    beforeEach(function () {
                        thirdHeaderColumn = headerRowNode.querySelectorAll('div')[2];
                    });

                    it('should have the col-sm-3 class', function () {
                        expect(thirdHeaderColumn).toHaveClass('col-sm-3');
                    });

                    it('should have the label "Mechanism"', function () {
                        var textNode = thirdHeaderColumn.querySelector('span');

                        expect(textNode.textContent).toBe('Mechanism');
                    });

                    it('should add the translate attibute to the label', function () {
                        var textNode = thirdHeaderColumn.querySelector('span');

                        expect(textNode).toHaveAttribute('translate');
                    });
                });

                describe('fourth column', function () {
                    var fourthHeaderColumn;

                    beforeEach(function () {
                        fourthHeaderColumn = headerRowNode.querySelectorAll('div')[3];
                    });

                    it('should have the col-sm-4 class', function () {
                        expect(fourthHeaderColumn).toHaveClass('col-sm-2');
                    });

                    it('should have the label "Value"', function () {
                        var textNode = fourthHeaderColumn.querySelector('span');

                        expect(textNode.textContent).toBe('Value');
                    });

                    it('should add the translate attibute to the label', function () {
                        var textNode = fourthHeaderColumn.querySelector('span');

                        expect(textNode).toHaveAttribute('translate');
                    });
                });
            });

            describe('data', function () {
                var dataRows;

                beforeEach(function () {
                    dataRows = dedupeDataTable.querySelectorAll('.table-data.row');
                });

                it('should have three rows', function () {
                    expect(dataRows.length).toBe(3);
                });

                it('should have an agency-name column with the right class', function () {
                    var agencyNameElement = dedupeDataTable.querySelector('.table-data.row .agency-name');

                    expect(agencyNameElement).toEqual(jasmine.any(HTMLElement));
                    expect(agencyNameElement).toHaveClass('col-sm-3');
                });

                it('should have an partner-name column with the right class', function () {
                    var partnerNameElement = dedupeDataTable.querySelector('.table-data.row .partner-name');

                    expect(partnerNameElement).toEqual(jasmine.any(HTMLElement));
                    expect(partnerNameElement).toHaveClass('col-sm-4');
                });

                it('should have an value column with the right class', function () {
                    var valueElement = dedupeDataTable.querySelector('.table-data.row .value');

                    expect(valueElement).toEqual(jasmine.any(HTMLElement));
                    expect(valueElement).toHaveClass('col-sm-2');
                });

                it('should display the agency names', function () {
                    var agencyNameElements = dedupeDataTable.querySelectorAll('.table-data.row .agency-name span');

                    expect(agencyNameElements[0].textContent).toBe('USAID');
                    expect(agencyNameElements[1].textContent).toBe('USAID');
                    expect(agencyNameElements[2].textContent).toBe('USAID');
                });

                it('should display the partner names', function () {
                    var partnerNameElements = dedupeDataTable.querySelectorAll('.table-data.row .partner-name span');

                    expect(partnerNameElements[0].textContent).toBe('PartnerA');
                    expect(partnerNameElements[1].textContent).toBe('PartnerB');
                    expect(partnerNameElements[2].textContent).toBe('PartnerC');
                });

                it('should display the mechanism names', function () {
                    var mechanismNumberElements = dedupeDataTable.querySelectorAll('.table-data.row .mechanism-number span');

                    expect(mechanismNumberElements[0].textContent).toBe('10000');
                    expect(mechanismNumberElements[1].textContent).toBe('20000');
                    expect(mechanismNumberElements[2].textContent).toBe('30000');
                });

                it('should display the values', function () {
                    var valueElements = dedupeDataTable.querySelectorAll('.table-data.row .value span');

                    expect(valueElements[0].textContent).toBe('60');
                    expect(valueElements[1].textContent).toBe('40');
                    expect(valueElements[2].textContent).toBe('20');
                });

                it('should add the odd class to the first row', function () {
                    var dataRows = dedupeDataTable.querySelectorAll('.table-data.row');

                    expect(dataRows[0]).toHaveClass('odd');
                });

                it('should add the even class to the second row', function () {
                    var dataRows = dedupeDataTable.querySelectorAll('.table-data.row');

                    expect(dataRows[1]).toHaveClass('even');
                });
            });
        });

        describe('resolve', function () {
            var resolveActionsNode;

            beforeEach(function () {
                resolveActionsNode = dedupeDataElement.querySelector('.dedupe-resolve-actions');
            });

            it('should have the class col-sm-5', function () {
                expect(resolveActionsNode).toHaveClass('col-sm-5');
            });

            describe('header', function () {
                var resolveHeaderElement;

                beforeEach(function () {
                    resolveHeaderElement = resolveActionsNode.querySelector('.resolve-header.row');
                });

                it('should have a column for the resolve actions', function () {
                    expect(resolveHeaderElement).toEqual(jasmine.any(HTMLElement));
                });

                it('should have the label "How to resolve?"', function () {
                    var textNode = resolveHeaderElement.querySelector('span');

                    expect(textNode.textContent).toBe('How to resolve?');
                });

                it('should add the translate attribute to the label', function () {
                    var textNode = resolveHeaderElement.querySelector('span');

                    expect(textNode).toHaveAttribute('translate');
                });
            });

            describe('actions', function () {
                var actionsRows;

                beforeEach(function () {
                    actionsRows = resolveActionsNode.querySelectorAll('.resolve-actions.row');
                });

                it('should be an element', function () {
                    expect(actionsRows[0]).toEqual(jasmine.any(HTMLElement));
                });

                describe('max', function () {
                    var actionsMax;

                    beforeEach(function () {
                        actionsMax = actionsRows[0].querySelector('.resolve-action-max');
                    });

                    it('should have a action-max column', function () {
                        expect(actionsMax).toEqual(jasmine.any(HTMLElement));
                    });

                    it('should have the class col-sm-12', function () {
                        expect(actionsMax).toHaveClass('col-sm-12');
                    });

                    describe('radio button', function () {
                        it('should exist', function () {
                            var actionMaxCheckbox = actionsMax.querySelector('input[type=radio]');

                            expect(actionMaxCheckbox).toEqual(jasmine.any(HTMLElement));
                        });
                    });

                    describe('label', function () {
                        var maxLabel;

                        beforeEach(function () {
                            maxLabel = actionsMax.querySelector('label span');
                        });

                        it('should be an element', function () {
                            expect(maxLabel).toEqual(jasmine.any(HTMLElement));
                        });

                        it('should have the translate attribute', function () {
                            expect(maxLabel).toHaveAttribute('translate');
                        });

                        it('should have the text "Use max"', function () {
                            expect(maxLabel.textContent).toBe('Use max');
                        });
                    });

                    describe('value to use', function () {
                        var maxValueElement;

                        beforeEach(function () {
                            maxValueElement = actionsMax.querySelector('span.value');
                        });

                        it('should display the value', function () {
                            expect(maxValueElement.textContent).toBe('(60)');
                        });
                    });
                });

                describe('sum', function () {
                    var actionsSum;

                    beforeEach(function () {
                        actionsSum = actionsRows[1].querySelector('.resolve-action-sum');
                    });

                    it('should have a action-sum column', function () {
                        expect(actionsSum).toEqual(jasmine.any(HTMLElement));
                    });

                    it('should have the class col-sm-12', function () {
                        expect(actionsSum).toHaveClass('col-sm-12');
                    });

                    describe('radio button', function () {
                        it('should exist', function () {
                            var actionSumCheckbox = actionsSum.querySelector('input[type=radio]');

                            expect(actionSumCheckbox).toEqual(jasmine.any(HTMLElement));
                        });
                    });

                    describe('label', function () {
                        var sumLabel;

                        beforeEach(function () {
                            sumLabel = actionsSum.querySelector('label span');
                        });

                        it('should be an element', function () {
                            expect(sumLabel).toEqual(jasmine.any(HTMLElement));
                        });

                        it('should have the translate attribute', function () {
                            expect(sumLabel).toHaveAttribute('translate');
                        });

                        it('should have the text "Use sum"', function () {
                            expect(sumLabel.textContent).toBe('Use sum');
                        });
                    });

                    describe('value to use', function () {
                        var sumValueElement;

                        beforeEach(function () {
                            sumValueElement = actionsSum.querySelector('span.value');
                        });

                        it('should display the value', function () {
                            expect(sumValueElement.textContent).toBe('(130)');
                        });
                    });
                });

                describe('custom', function () {
                    var actionsCustom;

                    beforeEach(function () {
                        actionsCustom = actionsRows[2].querySelector('.resolve-action-custom');
                    });

                    it('should have a action-custom column', function () {
                        expect(actionsCustom).toEqual(jasmine.any(HTMLElement));
                    });

                    it('should have the class col-sm-12', function () {
                        expect(actionsCustom).toHaveClass('col-sm-12');
                    });

                    describe('radio button', function () {
                        it('should exist', function () {
                            var actionCustomCheckbox = actionsCustom.querySelector('input[type=radio]');

                            expect(actionCustomCheckbox).toEqual(jasmine.any(HTMLElement));
                        });
                    });

                    describe('label', function () {
                        var customLabel;

                        beforeEach(function () {
                            customLabel = actionsCustom.querySelector('label span');
                        });

                        it('should be an element', function () {
                            expect(customLabel).toEqual(jasmine.any(HTMLElement));
                        });

                        it('should have the translate attribute', function () {
                            expect(customLabel).toHaveAttribute('translate');
                        });

                        it('should have the text "Use a custom value"', function () {
                            expect(customLabel.textContent).toBe('Use a custom value');
                        });
                    });

                    describe('value to use', function () {
                        var customValueElement;

                        beforeEach(function () {
                            customValueElement = actionsCustom.querySelector('span.value');
                        });

                        it('should have an input box', function () {
                            var inputBox = customValueElement.querySelector('input');

                            expect(inputBox).toEqual(jasmine.any(HTMLElement));
                            expect(inputBox.nodeName).toBe('INPUT');
                        });
                    });

                    describe('min and max values of custom', function () {
                        var customValueElement;

                        beforeEach(function () {
                            customValueElement = actionsCustom.querySelector('span.value');
                        });

                        it('should have a min limitation of 0 to cancel out all values', function () {
                            var inputBox = customValueElement.querySelector('input');

                            expect(inputBox.getAttribute('min')).toEqual('0');
                        });

                        it('should have a max limitation of the sum of all values', function () {
                            var inputBox = customValueElement.querySelector('input');

                            expect(inputBox.getAttribute('max')).toEqual('130');
                        });
                    });
                });

                describe('resolve button row', function () {
                    var resolveButtonColumn;

                    beforeEach(function () {
                        resolveButtonColumn = actionsRows[3].querySelector('.resolve-action-button');
                    });

                    it('should have a column', function () {
                        expect(resolveButtonColumn).toEqual(jasmine.any(HTMLElement));
                    });

                    it('should have the col-sm-12 class', function () {
                        expect(resolveButtonColumn).toHaveClass('col-sm-12');
                    });

                    describe('button', function () {
                        var resolveButton;

                        beforeEach(function () {
                            resolveButton = resolveButtonColumn.querySelector('button');
                        });

                        it('should exist', function () {
                            expect(resolveButton).toEqual(jasmine.any(HTMLElement));
                        });

                        it('should have a translate attribute', function () {
                            expect(resolveButton).toHaveAttribute('translate');
                        });

                        it('should have the content Resolve', function () {
                            expect(resolveButton.textContent).toBe('Resolve');
                        });

                        it('should have the classes button and btn-primary', function () {
                            expect(resolveButton).toHaveClass('btn');
                            expect(resolveButton).toHaveClass('btn-primary');
                        });

                        it('should have ng-click', function () {
                            expect(resolveButton).toHaveAttribute('ng-click');
                        });

                        it('resolve button should be disabled', function () {
                            expect(resolveButton).toHaveAttribute('disabled');
                        });
                    });
                });
            });
        });

        describe('resolve interaction', function () {
            var isolatedScope;

            beforeEach(function () {
                isolatedScope = element.scope();
            });

            it('should set the resolve to max when the max action is clicked', function () {
                var maxRadioButton = element[0].querySelector('.resolve-action-max input[type=radio]');

                maxRadioButton.click();
                $scope.$apply();

                expect($scope.firstDedupeRecord.resolve.type).toBe('max');
                expect($scope.firstDedupeRecord.resolve.value).toBe(60);
            });

            it('should set the resolve to sum when the sum action is clicked', function () {
                var sumRadioButton = element[0].querySelector('.resolve-action-sum input[type=radio]');

                sumRadioButton.click();
                $scope.$apply();

                expect($scope.firstDedupeRecord.resolve.type).toBe('sum');
                expect($scope.firstDedupeRecord.resolve.value).toBe(130);
            });

            it('should set the resolve to custom when the custom action is clicked', function () {
                var sumRadioButton = element[0].querySelector('.resolve-action-custom input[type=radio]');

                sumRadioButton.click();
                $scope.$apply();

                expect($scope.firstDedupeRecord.resolve.type).toBe('custom');
                expect($scope.firstDedupeRecord.resolve.value).toBe(undefined);
            });

            it('should set the resolve to custom when the custom action is clicked', function () {
                var maxRadioButton = element[0].querySelector('.resolve-action-max input[type=radio]');
                var customRadioButton = element[0].querySelector('.resolve-action-custom input[type=radio]');

                maxRadioButton.click();
                $scope.$apply();
                customRadioButton.click();
                $scope.$apply();

                expect($scope.firstDedupeRecord.resolve.type).toBe('custom');
                expect($scope.firstDedupeRecord.resolve.value).toBe(60);
            });

            it('should not accept a custom value that is lower than 0', function () {
                var customRadioButton = element[0].querySelector('.resolve-action-custom input[type=radio]');
                var customTextField = element[0].querySelector('.resolve-action-custom input[type=number]');
                customRadioButton.click();

                angular.element(customTextField).val('-1');
                angular.element(customTextField).change();
                $scope.$apply();

                expect($scope.firstDedupeRecord.resolve.type).toBe('custom');
                expect($scope.firstDedupeRecord.resolve.value).toBe(undefined);
            });

            it('should not be able to resolve using a value larger than sum', function () {
                var customRadioButton = element[0].querySelector('.resolve-action-custom input[type=radio]');
                var customTextField = element[0].querySelector('.resolve-action-custom input[type=number]');
                customRadioButton.click();

                angular.element(customTextField).val('1209');
                angular.element(customTextField).change();
                $scope.$apply();

                expect($scope.firstDedupeRecord.resolve.type).toBe('custom');
                expect($scope.firstDedupeRecord.resolve.value).toBe(undefined);
            });

            it('should set the form to be invalid when it is not touched', function () {
                var dedupeForm = element[0];

                expect(dedupeForm).toHaveClass('ng-invalid');
            });

            it('should set the form to valid when a resolve has been chosen', function () {
                var dedupeForm = element[0];
                var sumRadioButton = element[0].querySelector('.resolve-action-sum input[type=radio]');

                sumRadioButton.click();
                $scope.$apply();

                expect(dedupeForm).toHaveClass('ng-valid');
            });

            it('should keep the form invalid if the value is not a number', function () {
                var dedupeForm = element[0];
                var sumRadioButton = element[0].querySelector('.resolve-action-custom input[type=radio]');

                sumRadioButton.click();
                $scope.$apply();

                expect($scope.firstDedupeRecord.resolve.value).toBe(undefined);
                expect(dedupeForm).toHaveClass('ng-invalid');
            });

            it('should call resolve on the dedupeService', inject(function (dedupeService) {
                var resolveMaxRadio = element[0].querySelector('.resolve-action-sum input');
                var resolveButton = element[0].querySelector('.resolve-action-button button');

                //Make sure the form is valid
                resolveMaxRadio.click();
                $scope.$apply();

                resolveButton.click();
                $scope.$apply();

                expect(dedupeService.resolveDuplicates).toHaveBeenCalledWith([$scope.firstDedupeRecord]);
            }));

            it('should emit an event when the record has been resolved', function () {
                var resolveMaxRadio = element[0].querySelector('.resolve-action-sum input');
                var resolveButton = element[0].querySelector('.resolve-action-button button');
                var eventFunction = jasmine.createSpy('eventFunction');

                $rootScope.$on('DEDUPE_DIRECTIVE.resolve', eventFunction);

                //Make sure the form is valid
                resolveMaxRadio.click();
                $scope.$apply();

                resolveButton.click();
                $scope.$apply();

                expect(eventFunction.calls.argsFor(0)[1]).toBe('2364f5b15e57185fc6564ce64cc9c629');
                expect(eventFunction.calls.argsFor(0)[2]).toEqual({successCount: 1, errorCount: 0, errors: []});
            });

            it('should emit an event when the record has been rejected', inject(function (dedupeService, $q) {
                var resolveMaxRadio = element[0].querySelector('.resolve-action-sum input');
                var resolveButton = element[0].querySelector('.resolve-action-button button');
                var eventFunction = jasmine.createSpy('eventFunction');

                dedupeService.resolveDuplicates.and.returnValue({
                    then: function () {
                        return $q.reject('Duplicate records passed to resolveDuplicates should be an array with at least one element');
                    }
                });

                $rootScope.$on('DEDUPE_DIRECTIVE.resolve', eventFunction);

                //Make sure the form is valid
                resolveMaxRadio.click();
                $scope.$apply();

                resolveButton.click();
                $scope.$apply();

                expect(eventFunction.calls.argsFor(0)[1]).toBe(undefined);
                expect(eventFunction.calls.argsFor(0)[2]).toEqual(
                    {successCount: 0, errorCount: 0, errors: ['Duplicate records passed to resolveDuplicates should be an array with at least one element']}
                );
            }));

            it('should set resolve button to the processing state', inject(function (dedupeService, $q) {
                var resolveMaxRadio = element[0].querySelector('.resolve-action-sum input');
                var resolveButton = element[0].querySelector('.resolve-action-button button');

                dedupeService.resolveDuplicates.and.returnValue({
                    then: function () {
                        return $q.defer().promise;
                    }
                });

                //Make sure the form is valid
                resolveMaxRadio.click();
                $scope.$apply();

                resolveButton.click();
                $scope.$apply();

                expect(resolveButton).toHaveAttribute('disabled');
            }));

            it('should reset the processing state when the save is completed', function () {
                var resolveMaxRadio = element[0].querySelector('.resolve-action-sum input');
                var resolveButton = element[0].querySelector('.resolve-action-button button');

                //Make sure the form is valid
                resolveMaxRadio.click();
                $scope.$apply();

                resolveButton.click();
                $scope.$apply();

                expect(resolveButton).not.toHaveAttribute('disabled');
            });
        });
    });

    describe('crosswalk dedupe', function () {
        beforeEach(function () {
            $scope.firstDedupeRecord.getDedupeType = jasmine.createSpy('getDedupeType').and.returnValue('CROSSWALK');
            $scope.firstDedupeRecord.details.dedupeType = 'CROSSWALK';
            $scope.$apply();
        });

        it('should not show the sum action', function () {
            var sumResolveAction = angular.element(element[0].querySelector('.dedupe-resolve-actions .resolve-action-sum').parentNode);

            expect(sumResolveAction.hasClass('ng-hide')).toBe(true);
        });

        it('should not show the max action', function () {
            var maxResolveAction = angular.element(element[0].querySelector('.dedupe-resolve-actions .resolve-action-max').parentNode);

            expect(maxResolveAction.hasClass('ng-hide')).toBe(true);
        });

        it('should show the custom action', function () {
            var maxResolveAction = angular.element(element[0].querySelector('.dedupe-resolve-actions .resolve-action-custom').parentNode);

            expect(maxResolveAction.hasClass('ng-hide')).toBe(false);
        });

        it('should show the dedupe info', function () {
            var resolveInfo = angular.element(element[0].querySelector('.dedupe-resolve-crosswalk-info'));

            expect(resolveInfo.hasClass('ng-hide')).toBe(false);
        });
    });

    describe('getMax for CROSSWALK', function () {
        var dedupeCtrl;
        var dedupeService;

        beforeEach(inject(function ($injector) {
            dedupeService = $injector.get('dedupeService');

            $scope.firstDedupeRecord.getDedupeType = jasmine.createSpy('getDedupeType').and.returnValue('CROSSWALK');
            $scope.firstDedupeRecord.details.dedupeType = 'CROSSWALK';
            $scope.firstDedupeRecord.data = [
                {agency: 'USAID', partner: 'PartnerA', value: 10, display: true, calculate: true, mechanismNumber: '10000'},
                {agency: 'USAID', partner: 'PartnerB', value: 10, display: true, calculate: true, mechanismNumber: '20000'},
                {agency: 'USAID', partner: 'PartnerC', value: 10, display: true, calculate: true, mechanismNumber: '30000'},
                {agency: 'DSD Value', partner: 'DSD Value', value: 50, display: false, calculate: false, mechanismNumber: '0000'}
            ];

            $scope.$apply();

            dedupeCtrl = angular.element(element[0].querySelector('.dataelement-name')).scope().dedupeCtrl;
        }));

        it('should return the correct value when TA is lower than DSD', function () {
            dedupeService.getSum = dedupeService.getSum.and.returnValue(30);

            expect(dedupeCtrl.getMax()).toEqual(0);
        });

        it('should return the correct value when the TA is higher than DSD', function () {
            dedupeService.getSum = dedupeService.getSum.and.returnValue(90);

            $scope.firstDedupeRecord.data = [
                {agency: 'USAID', partner: 'PartnerA', value: 40, display: true, calculate: true, mechanismNumber: '10000'},
                {agency: 'USAID', partner: 'PartnerB', value: 20, display: true, calculate: true, mechanismNumber: '20000'},
                {agency: 'USAID', partner: 'PartnerC', value: 30, display: true, calculate: true, mechanismNumber: '30000'},
                {agency: 'DSD Value', partner: 'DSD Value', value: 50, display: false, calculate: false, mechanismNumber: '0000'}
            ];
            $scope.$apply();

            expect(dedupeCtrl.getMax()).toEqual(40);
        });
    });
});
