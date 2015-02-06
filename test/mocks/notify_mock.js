angular.module('dhis2.notify', []).factory('notify', function () {

    return {
        success: angular.noop,
        error: angular.noop,
        warning: angular.noop
    };
});
