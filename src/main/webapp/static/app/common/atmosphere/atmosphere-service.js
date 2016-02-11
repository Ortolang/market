'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.AtmosphereService
 * @description
 * # AtmosphereService
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .factory('AtmosphereService', ['$rootScope', '$timeout', 'AtmosphereListener', 'url', 'ProfileResource', 'SubscriptionResource', 'User', function ($rootScope, $timeout, AtmosphereListener, url, ProfileResource, SubscriptionResource, User) {

        var responseParameterDelegateFunctions = ['onOpen', 'onClientTimeout', 'onReopen', 'onMessage', 'onClose', 'onError'],
            delegateFunctions = responseParameterDelegateFunctions,
            socket,
            connected = false,
            config = {
                contentType: 'application/json',
                logLevel: 'info',
                transport: 'websocket',
                fallbackTransport: 'long-polling',
                trackMessageLength: true,
                reconnectInterval: 5000,
                enableXDR: true,
                timeout: 300000
            };

        delegateFunctions.push('onTransportFailure');
        delegateFunctions.push('onReconnect');

        function disconnect() {
            connected = false;
        }

        config.onOpen = function (response) {
            console.log('Atmosphere connected using ' + response.transport);
            connected = true;
            SubscriptionResource.addDefaultFilters();
        };

        config.onClientTimeout = function (response) {
            console.log('Client closed the connection after a timeout. Reconnecting in ' + config.reconnectInterval, response);
            disconnect();
            $timeout(function () {
                subscribe();
            }, config.reconnectInterval);
        };

        config.onReopen = function (response) {
            console.log('Atmosphere re-connected using ' + response.transport);
            connected = true;
        };

        config.onTransportFailure = function (errorMsg, request) {
            atmosphere.util.info(errorMsg, request);
        };

        config.onClose = function (response) {
            disconnect();
            console.log('Server closed the connection after a timeout', response);
        };

        config.onError = function (response) {
            console.error(response);
        };

        config.onReconnect = function (request, response) {
            console.log('Connection lost. Trying to reconnect ' + request.reconnectInterval, response);
        };

        function subscribe() {
            ProfileResource.ticket({key: User.key}, function (data) {
                if (data.t) {
                    var result = {},
                        request = config;
                    request.url = url.sub + '/' + User.key;
                    request.headers = {t: data.t};
                    angular.extend(request, AtmosphereListener);
                    angular.forEach(request, function (value, property) {
                        if (typeof value === 'function' && delegateFunctions.indexOf(property) >= 0) {
                            if (responseParameterDelegateFunctions.indexOf(property) >= 0) {
                                result[property] = function (response) {
                                    $rootScope.$apply(function () {
                                        request[property](response);
                                    });
                                };
                            } else if (property === 'onTransportFailure') {
                                result.onTransportFailure = function (errorMsg, request) {
                                    $rootScope.$apply(function () {
                                        request.onTransportFailure(errorMsg, request);
                                    });
                                };
                            } else if (property === 'onReconnect') {
                                result.onReconnect = function (request, response) {
                                    $rootScope.$apply(function () {
                                        request.onReconnect(request, response);
                                    });
                                };
                            }
                        } else {
                            result[property] = request[property];
                        }
                    });
                    socket = atmosphere.subscribe(result);
                }
            });
        }

        function isConnected() {
            return connected;
        }

        return {
            subscribe: subscribe,
            isConnected: isConnected
        };
    }]);
