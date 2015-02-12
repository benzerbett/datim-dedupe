angular.module('PEPFAR.dedupe').directive('organisationUnitSelect', organisationUnitSelectDirective);

function organisationUnitSelectDirective(organisationUnitService) {
    return {
        restrict: 'E',
        replace: true,
        scope: true,
        templateUrl: 'organisationunits/organisation-select.html',
        link: function (scope) {
            scope.selectbox = {
                items: [],
                placeholder: 'Select an organisation unit'
            };

            organisationUnitService.getOrganisationUnitsForLevel(3)
                .then(function (organisationUnits) {
                    scope.selectbox.items = organisationUnits;
                });
        }
    };
}
