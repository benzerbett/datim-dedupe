(function () {
    'use strict';

    angular.module('PEPFAR.dedupe').directive('dataelementInfo', dataElementInfoDirective);

    function dataElementInfoDirective($parse, Restangular) {
        return {
            scope: true,
            link: function (scope, element, attr) {
                var dataElementId = $parse(attr.dataelementId)(scope);
                element.append('<div class="data-element-hover"><i class="fa fa-spinner fa-pulse"></i></div>');

                element.addClass('data-element-info-wrap');
                var eventHandler = element.on('mouseover', function () {
                    return Restangular
                        .all('dataElements').withHttpConfig({cache: true})
                        .get([dataElementId, 'fields=description,displayDescription'].join('?'))
                        .then(function (data) {
                            scope.dataElementDescription = data.displayDescription || data.description || 'No description found.';

                            element
                                .find('.data-element-hover')
                                .html(['<p>', scope.dataElementDescription, '</p>'].join(''));

                            element.off('mouseover', eventHandler);
                        })
                        .catch(function (e) {
                            window.console.error(e);
                        });
                });
            }
        };
    }
})();
