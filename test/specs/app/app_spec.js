describe('App', function () {
    beforeEach(module('PEPFAR.dedupe'));

    it('module should exist', function () {
        function getModule() {
            angular.module('PEPFAR.dedupe');
        }

        expect(getModule).not.toThrow();
    });

    it('should have a correct basePathResolver', function () {
        var injectables = {
            webappManifest: {
                activities: {
                    dhis: {
                        href: 'http://prefix'
                    }
                }
            }
        };
        var url = 'urlname';

        expect(window.basePathResolver(url, injectables)).toBe('http://prefix/urlname');
    });
});
