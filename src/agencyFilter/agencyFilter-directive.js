angular.module('PEPFAR.dedupe').directive('agencyFilterSelect', agencyFilterSelect);

function agencyFilterController($scope, agencyFilterService, dedupeRecordFilters) {
    $scope.selectedAgency = null;
    $scope.selectAgency = function(agency){
        dedupeRecordFilters.changeAgencyFilter(agency);
    };
    agencyFilterService.getAgencyList().then(function(agencies){
        var all = [{name: 'All Agencies', id: 'NONE'}];
        $scope.agencies = all.concat(agencies);
    });
}

function agencyFilterSelect() {
    return {
        templateUrl: 'agencyFilter/agencyFilter.html',
        controller: agencyFilterController,
        controllerAs: 'ctrl'
    };
}
