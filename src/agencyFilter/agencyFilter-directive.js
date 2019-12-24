angular.module('PEPFAR.dedupe').directive('agencyFilterSelect', agencyFilterSelect);

function controller($scope, agencyFilterService, dedupeRecordFilters) {
    $scope.selectedAgency = null;
    $scope.selectAgency = function(agency){
        dedupeRecordFilters.changeAgencyFilter(agency);
    };
    agencyFilterService.getAgencyList().then(function(agencies){
        $scope.agencies = agencies;
    });
}

function agencyFilterSelect() {
    return {
        templateUrl: 'agencyFilter/agencyFilter.html',
        controller: controller,
        controllerAs: 'ctrl'
    };
}
