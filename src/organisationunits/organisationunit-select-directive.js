angular.module('PEPFAR.dedupe').directive('organisationUnitSelect', organisationUnitSelectDirective);

function organisationUnitSelectDirective(organisationUnitService) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            onOrgunitSelected: '='
        },
        templateUrl: 'organisationunits/organisation-select.html',
        link: function (scope) {
            scope.organisationUnit = undefined;
            scope.selectbox = {
                items: [],
                placeholder: 'Select an organisation unit',
                onSelect: function ($item, $model) {
                    scope.onOrgunitSelected($item, $model);
                }
            };

            organisationUnitService.getOrganisationUnitsForLevel(3)
                .then(function (organisationUnits) {
                    scope.selectbox.items = organisationUnits;
                });
        }
    };
}
