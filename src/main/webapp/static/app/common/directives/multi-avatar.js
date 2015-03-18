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
            restrict: 'E',
            scope :{
                favoriteAvatar: '=',
                avatarIds: '=',
                imgId:'@',
                thumbnail: '@'
            },
            link:function(scope, element) {

                /**
                 * Services
                 * @type {{value: number, id: string, tpl: string}[]}
                 */
                var services = [
                    {id:1, name: 'facebook', tpl: '<img id="{imgId}" src="http://graph.facebook.com/{id}/picture?width={width}&height={height}" class="{classImg}"/>'} ,
                    //{id:2, name: 'twitter', tpl: '<img id="{imgId}" src="https://pbs.twimg.com/profile_images/{id}_bigger.jpeg" style="width:{width}px; height:{height}px" class="{classImg}"/>'} ,
                    {id:3, name: 'github', tpl: '<img id="{imgId}" src="https://identicons.github.com/{id}.png" style="width:{width}px; height:{height}px" class="{classImg}"/>'} ,
                    {id:4, name: 'gravatar', tpl: '<img id="{imgId}" src="https://secure.gravatar.com/avatar/{id}?s=200&d=mm" style="width:{width}px; height:{height}px" class="{classImg}"/>'}
                ];

                /**
                 * Retrieve an avatar and return the filled template
                 * @param service {{value: number, id: string, tpl: string}}
                 * @param id {string}
                 * @returns {string}
                 */
                function retrieveAvatar(service, id) {
                    console.info('trying to retrieve avatar '+ service.name, id);
                    var width, height,
                        classImg = 'img-responsive img-rounded';
                    var isGravatar = service.name === 'gravatar';
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
                        if (isGravatar && id.split('@').length>1) {
                            id = md5.createHash(id.toLowerCase());
                        }
                        return service.tpl.replace('{id}', id).replace('{classImg}', classImg).replace('{width}', width).replace('{height}', height).replace('{imgId}', scope.imgId);
                    }
                }

                /**
                 * Initialize avatar
                 */
                function getAvatars() {
                    var tag, service, attr;
                    if (scope.favoriteAvatar !== '0'){
                        service = $filter('filter')(services, {id: scope.favoriteAvatar});
                        attr = $filter('filter')(scope.avatarIds, {id: scope.favoriteAvatar});
                        tag = retrieveAvatar(service[0], attr[0].value);
                        element.append(tag);
                    }
                    else {
                        for (var i = 0, len = scope.avatarIds.length; i < len; i++) {
                            attr = scope.avatarIds[i].value;
                            if (attr !== '') {
                                service = $filter('filter')(services, {id: scope.avatarIds[i].id});
                                tag = retrieveAvatar(service[0], attr);
                                if (angular.element('#' + scope.imgId).length) {
                                    angular.element('#' + scope.imgId).remove();
                                }
                                element.append(tag);
                                scope.$emit('updateDefaultAvatar', service[0].id);
                                break;
                            }
                        }
                    }
                }

                /**
                * Watch the field data-favorite-avatar and replace the current avatar if needed
                */
                scope.$watch('favoriteAvatar', function( newValue, oldValue ) {
                    if(newValue !== oldValue && newValue !== undefined) {
                        var currentAvatarId = $filter('filter')(scope.avatarIds, {id: newValue});
                        var service, tag;
                        if( currentAvatarId !== undefined && currentAvatarId[0].value !== '') {
                            service = $filter('filter')(services, {id: newValue});
                            tag = retrieveAvatar(service[0], currentAvatarId[0].value);
                            angular.element('#' + scope.imgId).remove();
                            element.append(tag);
                        }
                    }
                }, true);

                /**
                * Watch the field data-avatar-ids and replace the current avatar if needed
                */
                scope.$watch('avatarIds', function( newValue, oldValue ) {
                    if(newValue !== oldValue && newValue !== undefined) {
                        var service = $filter('filter')(services, {id: scope.favoriteAvatar});
                        var currentAvatarId = $filter('filter')(newValue, {id: scope.favoriteAvatar});
                        console.debug('new id: ', currentAvatarId[0].value);
                        var tag = retrieveAvatar(service[0], currentAvatarId[0].value);
                        angular.element('#' + scope.imgId).remove() ;
                        element.append(tag);
                    }
                }, true);


                return getAvatars();
            }
        };
    }]);
