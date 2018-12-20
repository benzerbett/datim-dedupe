angular.module('PEPFAR.dedupe').directive('organisationUnitSelect', organisationUnitSelectDirective);

function organisationUnitSelectDirective(organisationUnitService, currentUserService, dedupeRecordFilters, notify) {
    return {
        restrict: 'E',
        replace: true,
        scope: {},
        templateUrl: 'organisationunits/organisation-select.html',
        link: function (scope) {
            scope.organisationUnit = undefined;
            scope.isGlobalOrgUnit = isGlobalOrgUnit;
            scope.isUserHasAnOrgUnit = isUserHasAnOrgUnit;
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
                                var isGlobal = isGlobalOrgUnit(currentUser);
                                if (isGlobal) {
                                    scope.organisationUnit = findItemInListById(currentUser.organisationUnits[0].id, scope.selectbox.items);
                                } else {
                                    scope.organisationUnit = {id: currentUser.organisationUnits[0].id};
                                }
                                dedupeRecordFilters.changeOrganisationUnit(scope.organisationUnit);
                                scope.$emit('SELECT_ORGANISATION_UNIT_DIRECTIVE.currentUser', isGlobal);
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

            function isGlobalOrgUnit(user) {
                var isGlobalOrgUnit = false;
                var globalOrgUnitId = 'ybg3MO3hcf4';

                if (user.dataViewOrganisationUnits && user.dataViewOrganisationUnits.length )
                {
                    isGlobalOrgUnit = !!user.dataViewOrganisationUnits.filter(function(element){return element.id === globalOrgUnitId }).length;

                    if (user.organisationUnits.length > 1 || user.dataViewOrganisationUnits.length > 1) {
                        window.console.warn('Detected several organisation units for current user.');
                    }
                }
                return isGlobalOrgUnit;
            }

        }
    };
}
