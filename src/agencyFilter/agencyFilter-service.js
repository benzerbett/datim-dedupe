angular.module('PEPFAR.dedupe').factory('agencyFilterService', agencyFilterService);

function agencyFilterService($http, webappManifest){
    return {getAgencyList: function(){
        var prefix = webappManifest.activities.dhis.href;
        var query = '/api/categoryOptionGroups.json?filter=groupSets.id:eq:bw8KHXzxd9i';
        var url = prefix?(prefix+query):query;
        return $http.get(url, {withCredentials: true}).then(function(res){
            return res.data.categoryOptionGroups.map(function(i){return {name: i.displayName, id: i.id}});
        });
    }};
}