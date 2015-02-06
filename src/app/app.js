angular.module('PEPFAR.dedupe', ['ngAnimate', 'restangular', 'dhis2.notify']);

angular.module('PEPFAR.dedupe').run(function (Restangular) {
    //TODO: Set the right base url using the manifest
    //var baseUrl = [webappManifest.activities.dhis.href, 'api'].join('/');
    Restangular.setBaseUrl('/dhis/api');
});

//Config values
angular.module('PEPFAR.dedupe').value('DEDUPE_CATEGORY_OPTION_COMBO_ID', 'LJ8K9VORX9s');
angular.module('PEPFAR.dedupe').value('DEDUPE_CATEGORY_COMBO_ID', 'wUpfppgjEza');
angular.module('PEPFAR.dedupe').value('DEDUPE_CATEGORY_OPTION_ID', 'xEzelmtHWPn');
angular.module('PEPFAR.dedupe').value('DEDUPE_MECHANISM_NAME', '(00000 De-duplication adjustment)');

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
    .loadModule('/dhis-web-commons/javascripts/dhis2/dhis2.menu.js', 'd2HeaderBar')
    .loadScript('/dhis-web-commons/javascripts/dhis2/dhis2.menu.ui.js')
    .bootstrap();
