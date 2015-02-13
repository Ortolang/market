'use strict';

/**
 * @ngdoc directive
 * @name ortolangMarketApp.directive:multiAvatar
 * @description
 * # multiAvatar
 * Directive of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .directive('multiAvatar', ['md5', function (md5) {
        return {
            restrict: 'E',
            link:function(scope, element, attrs) {
                var services = [
                    {id: 'facebook', tpl: '<img src="http://graph.facebook.com/{id}/picture?width={width}&height={height}" class="{classImg}"/>'} ,
                    {id: 'twitter', tpl: '<img src="https://pbs.twimg.com/profile_images/{id}_bigger.jpeg" style="width:{width}px; height:{height}px" class="{classImg}"/>'} ,
                    {id: 'github', tpl: '<img src="https://identicons.github.com/{id}.png" style="width:{width}px; height:{height}px" class="{classImg}"/>'} ,
                    {id: 'gravatar', tpl: '<img src="https://secure.gravatar.com/avatar/{id}?s=200&d=mm" style="width:{width}px; height:{height}px" class="{classImg}"/>'}
                ];

                for (var s=0; s<services.length; s++) {
                    var service = services[s],
                        attr = service.id + 'Id',
                        id = attrs[attr],
                        thumbnail = attrs.thumbnail,
                        width, height,
                        classImg = 'img-responsive img-rounded';
                    var isGravatar = attr === 'gravatarId';
                    if ((thumbnail !== null) && (thumbnail === 'true')) {
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
                        var tag = service.tpl.replace('{id}', id).replace('{classImg}', classImg).replace('{width}', width).replace('{height}', height);
                        element.append(tag);
                        return;
                    }
                }
            }
        };
    }]);
