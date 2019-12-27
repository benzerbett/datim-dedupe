angular.module('PEPFAR.dedupe').directive('technicalAreaFilterSelect', technicalAreaFilterSelect);

function technicalAreaFilterController($scope, technicalAreaFilterService, dedupeRecordFilters) {
    $scope.selectedTechnicalArea = null;
    $scope.selectTechnicalArea = function(technicalArea){
        dedupeRecordFilters.changeTechnicalAreaFilter(technicalArea);
    };
    technicalAreaFilterService.getTechnicalAreas().then(function(technicalAreas){
        var all = [{name: 'Any Technical Area', id: 'NONE'}];
        $scope.technicalAreas = all.concat(technicalAreas);
    });
}

function technicalAreaFilterSelect() {
    return {
        templateUrl: 'technicalAreaFilter/technicalAreaFilter.html',
        controller: technicalAreaFilterController,
        controllerAs: 'ctrl'
    };
}
