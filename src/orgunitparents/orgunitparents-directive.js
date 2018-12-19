angular.module('PEPFAR.dedupe').directive('orgunitParentsHover', orgunitParentsHover);

function orgunitParentsHover($parse, $compile, Restangular) {
    return {
        restrict: 'A',
        scope: true,
        link: function (scope, element, attr) {
            var orgUnitId = $parse(attr.orgUnitId)(scope);
            var listTemplate = angular.element('<ul><li ng-repeat="ou in orgUnits" ng-bind="ou.name"></li></ul>');

            element.addClass('orgunit-parents-wrap');
            element.append('<div class="orgunit-hover"><i class="fa fa-spinner fa-pulse"></i></div>');

            element.on('mouseenter', function () {
                if (orgUnitId && !scope.orgUnitsLoaded) {
                    this.data = Restangular
                        .all('organisationUnits')
                        .withHttpConfig({cache: true})
                        .get(orgUnitId, {
                            fields: 'level,name',
                            includeAncestors: true
                        })
                        .then(function (data) { return data.organisationUnits || [ data ]; })
                        .then(function (organisationUnits) {
                            return organisationUnits.filter(function (orgUnit) {
                                return orgUnit.level >= 3;
                            });
                        })
                        .then(function (organisationUnits) {
                            scope.orgUnitsLoaded = true;
                            scope.orgUnits = organisationUnits.reverse() || [];
                            return scope.orgUnits;
                        })
                        .then(function () {
                            element.find('.orgunit-hover').html(listTemplate);
                            $compile(listTemplate)(scope);
                        })
                        .catch(function () {
                            window.console.log('Unable to load the orgunit tree');
                        });
                }
            });
        }
    };
}
