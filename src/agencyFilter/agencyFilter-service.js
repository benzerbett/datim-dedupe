angular.module('PEPFAR.dedupe').factory('agencyFilterService', agencyFilterService);

function agencyFilterService(Restangular){
    return {getAgencyList: function(){
        return [{name: 'USAID', id: 'NLV6dy7BE2O'}, {name: 'HHS/CDC', id: 'FPUgmtt8HRi'}];
    }};
}