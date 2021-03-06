angular.module('PEPFAR.dedupe', ['ngAnimate', 'ngMessages', 'restangular', 'dhis2.notify', 'ui.select', 'ui.bootstrap.collapse', 'ui.bootstrap.pagination', 'ui.bootstrap.tpls', 'ui.bootstrap.modal']);

angular.module('PEPFAR.dedupe').run(function (Restangular, webappManifest) {
    Restangular.setBaseUrl([webappManifest.activities.dhis.href, 'api'].join('/'));
});

angular.module('PEPFAR.dedupe').config(angularUiSelectConfig);
function angularUiSelectConfig(uiSelectConfig) {
    uiSelectConfig.theme = 'bootstrap';
}

//Normal and crosswalk
angular.module('PEPFAR.dedupe').value('DEDUPE_CATEGORY_COMBO_ID', 'wUpfppgjEza');

//Normal dedupe
angular.module('PEPFAR.dedupe').value('DEDUPE_CATEGORY_OPTION_COMBO_ID', 'X8hrDf6bLDC');
angular.module('PEPFAR.dedupe').value('DEDUPE_CATEGORY_OPTION_ID', 'xEzelmtHWPn');
angular.module('PEPFAR.dedupe').value('DEDUPE_MECHANISM_NAME', '00000');

//Crosswalk
angular.module('PEPFAR.dedupe').value('DEDUPE_CROSSWALK_CATEGORY_OPTION_COMBO_ID', 'YGT1o7UxfFu');
angular.module('PEPFAR.dedupe').value('DEDUPE_CROSSWALK_CATEGORY_OPTION_ID', 'OM58NubPbx1');
angular.module('PEPFAR.dedupe').value('DEDUPE_MECHANISM_CROSSWALK_NAME', '00001');

//Default values
angular.module('PEPFAR.dedupe').value('DEDUPE_PAGE_SIZE', 50);

//==================================================================================
// Bootstrap the app manually
//
function basePathResolver(url, injectables) {
    return [injectables.webappManifest.activities.dhis.href, url].join('/');
}

/* istanbul ignore next */
window.getBootstrapper('PEPFAR.dedupe', document)
    .setBasePathResolver(basePathResolver)
    .addInjectableFromRemoteLocation('webappManifest', 'manifest.webapp')
    .execute(function (injectables) {
        window.dhis2 = window.dhis2 || {};
        window.dhis2.settings = window.dhis2.settings || {};
        window.dhis2.settings.baseUrl = injectables.webappManifest.activities.dhis.href.replace(window.location.origin, '').replace(/^\//, '');
        if (window.dhis2.settings.baseUrl === '') { window.dhis2.settings.baseUrl = '.'; }
    })
    .loadStylesheet('dhis-web-commons/css/menu.css')
    .loadScript('dhis-web-commons/javascripts/dhis2/dhis2.util.js')
    .loadScript('dhis-web-commons/javascripts/dhis2/dhis2.translate.js')
    .loadModule('dhis-web-commons/javascripts/dhis2/dhis2.menu.js', 'd2HeaderBar')
    .loadScript('dhis-web-commons/javascripts/dhis2/dhis2.menu.ui.js')
    .bootstrap();
