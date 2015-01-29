angular.module('PEPFAR.dedupe', ['restangular']);

angular.module('PEPFAR.dedupe').run(function (Restangular) {
    //TODO: Set the right base url using the manifest
    //var baseUrl = [webappManifest.activities.dhis.href, 'api'].join('/');
    Restangular.setBaseUrl('/dhis/api');
});
