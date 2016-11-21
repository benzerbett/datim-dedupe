angular.module('PEPFAR.dedupe').factory('dataStore', dataStore);

function dataStore(Restangular) {
    var periodSettings;

    function getPeriodSettings() {
        if (periodSettings) {
            return periodSettings;
        }

        periodSettings = Restangular
            .all('dataStore')
            .all('dedupe')
            .get('periodSettings')
            .then(function (response) {
                return response.plain();
            });

        return periodSettings;
    }

    return {
        getPeriodSettings: getPeriodSettings
    };
}
