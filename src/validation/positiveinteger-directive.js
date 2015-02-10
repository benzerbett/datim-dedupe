var INTEGER_REGEXP = /^\d*$/;
angular.module('PEPFAR.dedupe').directive('positiveInteger', positiveIntegerValidation);

function positiveIntegerValidation() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: linkFunction
    };

    function linkFunction(scope, elm, attrs, ctrl) {
        ctrl.$parsers.unshift(function (viewValue) {
            if (INTEGER_REGEXP.test(viewValue)) {
                ctrl.$setValidity('positiveInteger', true);
                return viewValue;
            } else {
                ctrl.$setValidity('positiveInteger', false);
                return undefined;
            }
        });
    }
}
