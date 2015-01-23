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

        element = angular.element('<dedupe></dedupe>');

        $scope = $rootScope.$new();

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
    });

    describe('dedupe data', function () {
        it('should be a row', function () {
            expect(element[0].querySelector('.row.dedupe-data')).toEqual(jasmine.any(HTMLElement));
        });

        it('should have a dedupe-data-table', function () {
            var dedupeDataTable = element[0].querySelector('.row.dedupe-data').querySelector('div');

            expect(dedupeDataTable).toEqual(jasmine.any(HTMLElement));
            expect(dedupeDataTable).toHaveClass('dedupe-data-table');
            expect(dedupeDataTable).toHaveClass('col-sm-12');
        });

        describe('dedupe-data-table', function () {
            var dedupeDataTable;

            beforeEach(function () {
                dedupeDataTable = element[0].querySelector('.row.dedupe-data').querySelector('div');
            });

            it('should have one header row', function () {
                expect(dedupeDataTable.querySelectorAll('.table-header').length).toBe(1);
            });

            describe('header row', function () {
                var headerRowNode;

                beforeEach(function () {
                    headerRowNode = dedupeDataTable.querySelector('.table-header');
                });

                it('should have the class "row"', function () {
                    expect(headerRowNode).toHaveClass('row');
                });

                it('should have four columns', function () {
                    expect(headerRowNode.querySelectorAll('div').length).toBe(4);
                });

                describe('first column', function () {
                    var firstHeaderColumn;

                    beforeEach(function () {
                        firstHeaderColumn = headerRowNode.querySelectorAll('div')[0];
                    });

                    it('should have the col-sm-2 class', function () {
                        expect(firstHeaderColumn).toHaveClass('col-sm-2');
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

                    it('should have the col-sm-2 class', function () {
                        expect(secondHeaderColumn).toHaveClass('col-sm-2');
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

                    it('should have the col-sm-2 class', function () {
                        expect(thirdHeaderColumn).toHaveClass('col-sm-2');
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

                describe('fourth column', function () {
                    var fourthHeaderColumn;

                    beforeEach(function () {
                        fourthHeaderColumn = headerRowNode.querySelectorAll('div')[3];
                    });

                    it('should have the col-sm-6 class', function () {
                        expect(fourthHeaderColumn).toHaveClass('col-sm-6');
                    });

                    it('should have the label "How to resolve?"', function () {
                        var textNode = fourthHeaderColumn.querySelector('span');

                        expect(textNode.textContent).toBe('How to resolve?');
                    });

                    it('should add the translate attribute to the label', function () {
                        var textNode = fourthHeaderColumn.querySelector('span');

                        expect(textNode).toHaveAttribute('translate');
                    });
                });
            });
        });
    });
});
