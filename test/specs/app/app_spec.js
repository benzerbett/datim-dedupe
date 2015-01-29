describe('App', function () {
    beforeEach(module('PEPFAR.dedupe'));

    it('module should exist', function () {
        function getModule() {
            angular.module('PEPFAR.dedupe');
        }

        expect(getModule).not.toThrow();
    });
});
