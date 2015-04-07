'use strict';

/**
 * @ngdoc directive
 * @name ortolangMarketApp.directive:multiAvatar
 * @description
 * # multiAvatar
 * Directive of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .directive('multiAvatar', ['md5', '$filter', function (md5, $filter) {
        return {
            restrict: 'AE',
            scope : {
                favoriteAvatar: '=',
                avatarIds: '=',
                imgId: '@',
                thumbnail: '@'
            },
            link: function (scope, element) {

                /**
                 * Services
                 */
                var services = {
                    'FACEBOOK': {
                        id: 'FACEBOOK',
                        name: 'facebook',
                        tpl: '<img id="{imgId}" src="http://graph.facebook.com/{id}/picture?width={width}&height={height}" class="{classImg}"/>'
                    },
                    //'TWITTER': {id: 'TWITTER', name: 'twitter', tpl: '<img id="{imgId}" src="https://pbs.twimg.com/profile_images/{id}_bigger.jpeg" class="{classImg}"/>'},
                    'GITHUB': {
                        id: 'GITHUB',
                        name: 'github',
                        tpl: '<img id="{imgId}" src="https://identicons.github.com/{id}.png" class="{classImg}"/>'
                    },
                    'GRAVATAR': {
                        id: 'GRAVATAR',
                        name: 'gravatar',
                        tpl: '<img id="{imgId}" src="https://secure.gravatar.com/avatar/{id}?s=200&d=mm" class="{classImg}"/>'
                    }
                };

                /**
                 * Retrieve an avatar and return the filled template
                 * @param service {{value: number, id: string, tpl: string}}
                 * @param id {string}
                 * @returns {string}
                 */
                function retrieveAvatar(service, id) {
                    var width, height,
                        classImg = 'img-responsive img-rounded',
                        isGravatar = service.name === 'gravatar';
                    if ((scope.thumbnail !== null) && (scope.thumbnail === 'true')) {
                        width = 30;
                        height = 30;
                        classImg = 'img-circle profile-image';
                    } else {
                        width = 200;
                        height = 200;
                    }
                    if (isGravatar || (id && id.length > 0)) {
                        if (!id) {
                            id = '';
                        }
                        if (isGravatar && id.split('@').length > 1) {
                            id = md5.createHash(id.toLowerCase());
                        }
                        return service.tpl.replace('{id}', id).replace('{classImg}', classImg).replace('{width}', width).replace('{height}', height).replace('{imgId}', scope.imgId);
                    }
                }

                /**
                 * Initialize avatar
                 */
                function getAvatars() {
                    var tag, service, attr, i;
                    if (scope.favoriteAvatar !== '0') {
                        service = services[scope.favoriteAvatar];
                        attr = scope.avatarIds[scope.favoriteAvatar];
                        tag = retrieveAvatar(service, attr.value);
                        element.append(tag);
                    } else {
                        for (i = 0; i < scope.avatarIds.length; i++) {
                            attr = scope.avatarIds[i].value;
                            if (attr !== '') {
                                service = services[scope.avatarIds[i].id];
                                tag = retrieveAvatar(service, attr);
                                if (angular.element('#' + scope.imgId).length) {
                                    angular.element('#' + scope.imgId).remove();
                                }
                                element.append(tag);
                                scope.$emit('updateDefaultAvatar', service.id);
                                break;
                            }
                        }
                    }
                }

                /**
                 * Watch the field data-favorite-avatar and replace the current avatar if needed
                 */
                scope.$watch('favoriteAvatar', function (newValue, oldValue) {
                    if (newValue !== oldValue && newValue !== undefined) {
                        var currentAvatarId = scope.avatarIds[newValue],
                            service,
                            tag;
                        if (currentAvatarId !== undefined && currentAvatarId.value !== '') {
                            service = services[newValue];
                            tag = retrieveAvatar(service, currentAvatarId.value);
                            angular.element('#' + scope.imgId).remove();
                            element.append(tag);
                        }
                    }
                }, true);

                /**
                 * Watch the field data-avatar-ids and replace the current avatar if needed
                 */
                scope.$watch('avatarIds', function (newValue, oldValue) {
                    if (newValue !== oldValue && newValue !== undefined) {
                        var service = services[scope.favoriteAvatar],
                            currentAvatarId = newValue[scope.favoriteAvatar],
                            tag = retrieveAvatar(service, currentAvatarId.value);
                        angular.element('#' + scope.imgId).remove();
                        element.append(tag);
                    }
                }, true);


                return getAvatars();
            }
        };
    }]);
