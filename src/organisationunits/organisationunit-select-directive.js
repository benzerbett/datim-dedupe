angular.module('PEPFAR.dedupe').directive('organisationUnitSelect', organisationUnitSelectDirective);

function organisationUnitSelectDirective(organisationUnitService, currentUserService, dedupeRecordFilters, notify) {
    return {
        restrict: 'E',
        replace: true,
        scope: {},
        templateUrl: 'organisationunits/organisation-select.html',
        link: function (scope) {
            scope.organisationUnit = undefined;
            scope.selectbox = {
                items: [],
                placeholder: 'Select an organisation unit',
                onSelect: function ($item, $model) {
                    dedupeRecordFilters.changeOrganisationUnit($item, $model);
                }
            };

            organisationUnitService.getOrganisationUnitsForLevel(3)
                .then(function (organisationUnits) {
                    scope.selectbox.items = organisationUnits;

                    currentUserService.getCurrentUser()
                        .then(function (currentUser) {
                            if (isUserHasAnOrgUnit(currentUser)) {
                                scope.organisationUnit = findItemInListById(currentUser.organisationUnits[0].id, scope.selectbox.items);

                                dedupeRecordFilters.changeOrganisationUnit(scope.organisationUnit);
                            }
                        })
                        .catch(function () {
                            notify.error('Failed to load current user object');
                        });
                });

            function isUserHasAnOrgUnit(user) {
                return user.organisationUnits &&
                    user.organisationUnits[0] &&
                    user.organisationUnits[0].id;
            }

            function findItemInListById(idToFind, list) {
                return _.find(list, function (item) {
                    if (item.id === idToFind) {
                        return item;
                    }
                });
            }
        }
    };
}
