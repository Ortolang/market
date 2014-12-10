var module = angular.module('ortolangMarketApp');

module.factory('authInterceptor', function($q, Auth) {
    return {
        request: function (config) {
            var deferred = $q.defer();
            if (Auth.isAuthenticated()) {
                if (Auth.getKeycloak().token) {
                    Auth.getKeycloak().updateToken(5).success(function() {
                        config.headers = config.headers || {};
                        config.headers.Authorization = 'Bearer ' + Auth.getKeycloak().token;

                        deferred.resolve(config);
                    }).error(function() {
                        deferred.reject('Failed to refresh token');
                    });
                }
                return deferred.promise;
            } else {
                return config;
            }
        }
    };
});

angular.element(document).ready(function () {
    var keycloakAuth = new Keycloak('../../keycloak.json');
    keycloakAuth.init({ onLoad: 'check-sso' }).success(function () {
        module.factory('Auth', function() {
            var logoutUrl = keycloakAuth.authServerUrl + "/realms/ortolang/tokens/logout?redirect_uri=https://localhost:9000/";
            function isAuthenticated() {
                return keycloakAuth.authenticated;
            }
            return {
                getKeycloak: function () { return keycloakAuth; },
                isAuthenticated: isAuthenticated,
                getLogoutUrl: function () { return logoutUrl; }
            };
        });
        angular.bootstrap(document, ["ortolangMarketApp"]);
    }).error(function () {
        window.location.reload();
    });
});

module.factory('errorInterceptor', function($q, $window, Auth) {
    return function(promise) {
        return promise.then(function(response) {
            return response;
        }, function(response) {
            if (response.status == 401) {
                console.log('session timeout?');
                if (!Auth.isAuthenticated()) {
                    $window.location = Auth.getKeycloak().createLoginUrl();
                }
            } else if (response.status == 403) {
                alert("Forbidden");
            } else if (response.status == 404) {
                alert("Not found");
            } else if (response.status) {
                if (response.data && response.data.errorMessage) {
                    alert(response.data.errorMessage);
                } else {
                    alert("An unexpected server error has occurred");
                }
            }
            return $q.reject(response);
        });
    };
});

module.config(function($httpProvider) {
    $httpProvider.responseInterceptors.push('errorInterceptor');
    $httpProvider.interceptors.push('authInterceptor');
});
