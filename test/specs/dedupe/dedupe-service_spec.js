describe('Dedupe service', function () {
    var dedupeService;

    beforeEach(module('PEPFAR.dedupe'));
    beforeEach(inject(function ($injector) {
        dedupeService = $injector.get('dedupeService');
    }));

    it('should be an object', function () {
        expect(dedupeService).toBeAnObject();
    });

    describe('getMax', function () {
        it('should be a function', function () {
            expect(dedupeService.getMax).toBeAFunction();
        });

        it('should throw if dedupeRecords is not an array', function () {
            function shouldThrow() {
                dedupeService.getMax();
            }

            expect(shouldThrow).toThrowError('Parameter dedupeRecords that was passed to getMax is not an array');
        });

        it('should return a number', function () {
            expect(dedupeService.getMax([])).toBeANumber();
        });

        it('should return the max of the numbers', function () {
            var dedupeValues = [
                {agency: 'USAID', partner: 'PartnerA', value: 60},
                {agency: 'USAID', partner: 'PartnerB', value: 40},
                {agency: 'USAID', partner: 'PartnerC', value: 20}
            ];

            expect(dedupeService.getMax(dedupeValues)).toBe(60);
        });
    });

    describe('getSum', function () {
        it('should be a function', function () {
            expect(dedupeService.getSum).toBeAFunction();
        });

        it('should throw if dedupeRecords is not an array', function () {
            function shouldThrow() {
                dedupeService.getSum();
            }

            expect(shouldThrow).toThrowError('Parameter dedupeRecords that was passed to getSum is not an array');
        });

        it('should return a number', function () {
            expect(dedupeService.getSum([])).toBeANumber();
        });

        it('should return the sum of the numbers', function () {
            var dedupeValues = [
                {agency: 'USAID', partner: 'PartnerA', value: 60},
                {agency: 'USAID', partner: 'PartnerB', value: 40},
                {agency: 'USAID', partner: 'PartnerC', value: 20}
            ];

            expect(dedupeService.getSum(dedupeValues)).toBe(120);
        });
    });

    describe('getDuplicateRecords', function () {
        it('should be a function', function () {
            expect(dedupeService.getDuplicateRecords).toBeAFunction();
        });

        it('should return an array', function () {
            expect(dedupeService.getDuplicateRecords()).toBeAnArray();
        });
    });
});
