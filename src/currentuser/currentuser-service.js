angular.module('PEPFAR.dedupe').factory('currentUserService', currentUserService);

function currentUserService($q, Restangular, notify) {
    var currentUserPromise;

    initialise();
    return {
        getCurrentUser: getCurrentUser
    };

    function initialise() {
        currentUserPromise = $q.all([requestCurrentUser(), requestUserAuthorities()])
            .then(function (responses) {
                var currentUser = responses[0];
                var userAuthorities = responses[1];

                currentUser.authorities = userAuthorities;

                return currentUser;
            })
            .catch(function (response) {
                notify.error(['(', response.status, ') ', response.data].join(''))
            });
    }

    function requestCurrentUser() {
        return Restangular.one('me').withHttpConfig({cache: true}).get({
            fields: ':all,userCredentials[:owner,!userGroupAccesses],!userGroupAccesses'
        });
    }

    function requestUserAuthorities() {
        return Restangular.all('me').withHttpConfig({cache: true}).get('authorization');
    }

    function getCurrentUser() {
        return currentUserPromise;
    }
}
