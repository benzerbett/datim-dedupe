describe('Dedupe directive', function () {
    //var fixtures = window.fixtures;
    var $scope;
    var element;
    var $rootScope;

    beforeEach(module('dedupe/dedupe.html'));
    beforeEach(module('PEPFAR.dedupe'));

    beforeEach(inject(function ($injector) {
        var $compile = $injector.get('$compile');
        $rootScope = $injector.get('$rootScope');
        element = angular.element('<dedupe dedupe-record="firstDedupeRecord"></dedupe>');

        $scope = $rootScope.$new();
        $scope.firstDedupeRecord = {
            details: {
                orgUnitName: 'Glady\'s clinic',
                timePeriodName: 'FY 2014'
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
        };

        $compile(element)($scope);
        $scope.$digest();
    }));

    it('should compile', function () {
        expect(element).toHaveClass('dedupe-wrap');
    });

    describe('dedupe details', function () {
        var dedupeDetailsElement;

        beforeEach(function () {
            dedupeDetailsElement = element[0].querySelector('.row.dedupe-details');
        });

        it('should be a row', function () {
            expect(dedupeDetailsElement).toEqual(jasmine.any(HTMLElement));
        });

        it('should have a column for the org unit label', function () {
            expect(dedupeDetailsElement.querySelector('.organisation-unit-label')).toEqual(jasmine.any(HTMLElement));
        });

        it('should have a column for the org unit name', function () {
            expect(dedupeDetailsElement.querySelector('.organisation-unit-name')).toEqual(jasmine.any(HTMLElement));
        });

        it('should set the appropriate column width for the org unit fields', function () {
            expect(dedupeDetailsElement.querySelector('.organisation-unit-label')).toHaveClass('col-sm-2');
            expect(dedupeDetailsElement.querySelector('.organisation-unit-name')).toHaveClass('col-sm-4');
        });

        it('should have a column for the period label', function () {
            expect(dedupeDetailsElement.querySelector('.period-label')).toEqual(jasmine.any(HTMLElement));
        });

        it('should have a column for the period name', function () {
            expect(dedupeDetailsElement.querySelector('.period-name')).toEqual(jasmine.any(HTMLElement));
        });

        it('should set the appropriate column width for the period fields', function () {
            expect(dedupeDetailsElement.querySelector('.period-label')).toHaveClass('col-sm-2');
            expect(dedupeDetailsElement.querySelector('.period-name')).toHaveClass('col-sm-4');
        });

        it('should place the text "Org unit:" in the org unit label', function () {
            var textElement = dedupeDetailsElement.querySelector('.organisation-unit-label').querySelector('span');

            expect(textElement.textContent).toEqual('Org unit:');
        });

        it('should add the translate directive onto the org unit label', function () {
            var textElement = dedupeDetailsElement.querySelector('.organisation-unit-label').querySelector('span');

            expect(textElement).toHaveAttribute('translate');
        });

        it('should place the text "Time period:" into the period label', function () {
            var textElement = dedupeDetailsElement.querySelector('.period-label').querySelector('span');

            expect(textElement.textContent).toEqual('Time period:');
        });

        it('should add the translate directive onto the period label', function () {
            var textElement = dedupeDetailsElement.querySelector('.period-label').querySelector('span');

            expect(textElement).toHaveAttribute('translate');
        });

        it('should set the org unit name to Glady\'s clinic', function () {
            var textElement = dedupeDetailsElement.querySelector('.organisation-unit-name span');

            expect(textElement.textContent).toEqual('Glady\'s clinic');
        });

        it('should set the time period to FY 2014', function () {
            var textElement = dedupeDetailsElement.querySelector('.period-name span');

            expect(textElement.textContent).toEqual('FY 2014');
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
            expect(dedupeDataTable).toHaveClass('col-sm-6');
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
                    expect(headerRowNode.querySelectorAll('div').length).toBe(3);
                });

                describe('first column', function () {
                    var firstHeaderColumn;

                    beforeEach(function () {
                        firstHeaderColumn = headerRowNode.querySelectorAll('div')[0];
                    });

                    it('should have the col-sm-4 class', function () {
                        expect(firstHeaderColumn).toHaveClass('col-sm-4');
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

                    it('should have the col-sm-4 class', function () {
                        expect(thirdHeaderColumn).toHaveClass('col-sm-4');
                    });

                    it('should have the label "Value"', function () {
                        var textNode = thirdHeaderColumn.querySelector('span');

                        expect(textNode.textContent).toBe('Value');
                    });

                    it('should add the translate attibute to the label', function () {
                        var textNode = thirdHeaderColumn.querySelector('span');

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
                    expect(agencyNameElement).toHaveClass('col-sm-4');
                });

                it('should have an partner-name column with the right class', function () {
                    var partnerNameElement = dedupeDataTable.querySelector('.table-data.row .partner-name');

                    expect(partnerNameElement).toEqual(jasmine.any(HTMLElement));
                    expect(partnerNameElement).toHaveClass('col-sm-4');
                });

                it('should have an value column with the right class', function () {
                    var valueElement = dedupeDataTable.querySelector('.table-data.row .value');

                    expect(valueElement).toEqual(jasmine.any(HTMLElement));
                    expect(valueElement).toHaveClass('col-sm-4');
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

                it('should display the values', function () {
                    var valueElements = dedupeDataTable.querySelectorAll('.table-data.row .value span');

                    expect(valueElements[0].textContent).toBe('60');
                    expect(valueElements[1].textContent).toBe('40');
                    expect(valueElements[2].textContent).toBe('20');
                });
            });
        });

        describe('resolve', function () {
            var resolveActionsNode;

            beforeEach(function () {
                resolveActionsNode = dedupeDataElement.querySelector('.dedupe-resolve-actions');
            });

            it('should have the class col-sm-6', function () {
                expect(resolveActionsNode).toHaveClass('col-sm-6');
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
                            expect(sumValueElement.textContent).toBe('(120)');
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
                var maxRadioButton = element[0].querySelector('.resolve-action-sum input[type=radio]');

                maxRadioButton.click();
                $scope.$apply();

                expect($scope.firstDedupeRecord.resolve.type).toBe('sum');
                expect($scope.firstDedupeRecord.resolve.value).toBe(120);
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
        });
    });
});
