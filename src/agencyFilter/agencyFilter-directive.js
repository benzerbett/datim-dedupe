angular.module('PEPFAR.dedupe').directive('agencyFilterSelect', agencyFilterSelect);

function controller($scope, agencyFilterService, dedupeRecordFilters) {
    $scope.selectedAgency = null;
    $scope.selectAgency = function(agency){
        dedupeRecordFilters.changeAgencyFilter(agency);
    };
    $scope.agencies = agencyFilterService.getAgencyList();
}

function agencyFilterSelect() {
    return {
        templateUrl: 'agencyFilter/agencyFilter.html',
        controller: controller,
        controllerAs: 'ctrl'
    };
}
