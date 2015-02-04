angular.module('PEPFAR.dedupe', ['restangular']);

angular.module('PEPFAR.dedupe').run(function (Restangular) {
    //TODO: Set the right base url using the manifest
    //var baseUrl = [webappManifest.activities.dhis.href, 'api'].join('/');
    Restangular.setBaseUrl('/dhis/api');
});

//==================================================================================
// Bootstrap the app manually
//
function basePathResolver(url, injectables) {
    return [injectables.webappManifest.activities.dhis.href, url].join('/');
}

window.getBootstrapper('PEPFAR.dedupe', document)
    .setBasePathResolver(basePathResolver)
    .addInjectableFromRemoteLocation('webappManifest', 'manifest.webapp')
    .execute(function (injectables) {
        window.dhis2 = window.dhis2 || {};
        window.dhis2.settings = window.dhis2.settings || {};
        window.dhis2.settings.baseUrl = injectables.webappManifest.activities.dhis.href.replace(window.location.origin, '').replace(/^\//, '');
    })
    .loadStylesheet('/dhis-web-commons/css/menu.css')
    .loadScript('/dhis-web-commons/javascripts/dhis2/dhis2.translate.js')
    .loadModule('/dhis-web-commons/javascripts/dhis2/dhis2.menu.js', 'd2Menu')
    .loadModule('/dhis-web-commons/javascripts/dhis2/dhis2.menu.js', 'd2HeaderBar')
    .loadScript('/dhis-web-commons/javascripts/dhis2/dhis2.menu.ui.js')
    .bootstrap();
