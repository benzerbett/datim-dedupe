angular.module('PEPFAR.dedupe').factory('technicalAreaFilterService', technicalAreaFilterService);

function technicalAreaFilterService($http, webappManifest){
    return {getTechnicalAreas: function(){
        var prefix = webappManifest.activities.dhis.href;
        var query = '/api/dataElementGroups.json?filter=groupSets.id:eq:LxhLO68FcXm&fields=id,shortName,displayName&paging=false';
        var url = prefix?(prefix+query):query;
        return $http.get(url, {withCredentials: true}).then(function(res){
            return res.data.dataElementGroups.map(function(i){return {name: i.displayName, id: i.shortName}});
        });
    }};
}