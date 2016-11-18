'use strict';

/**
 * @ngdoc directive
 * @name ortolangMarketApp.directive:ceteiCean
 * @description
 * # ceteiCean
 * Directive of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .directive('ceteiCean', ['$timeout', function ($timeout) {
        return {
            scope: {
                base: '=',
                content: '=',
                behaviors: '=?'
            },
            restrict: 'A',
            link: function (scope, element) {
                function processTEI() {
                    var base = scope.base !== '/' ? scope.base + '/' : scope.base;
                    var CETEIcean = new CETEI(base);
                    if (scope.behaviors) {
                        CETEIcean.addBehaviors(scope.behaviors);
                    } else {
                        CETEIcean.addBehaviors({
                            'handlers': {
                                'ptr': function () {
                                    return function () {
                                        var that = this;
                                        $timeout(function () {
                                            var link = document.createElement('a');
                                            link.setAttribute('href', CETEIcean.rw(that.getAttribute('target')));
                                            link.setAttribute('target', '_blank');
                                            link.innerHTML = that.getAttribute('target');
                                            var shadow = that.createShadowRoot();
                                            shadow.appendChild(link);
                                        });
                                    };
                                },
                                'ref': function () {
                                    return function () {
                                        var that = this;
                                        $timeout(function () {
                                            var link = document.createElement('a');
                                            link.setAttribute('href', CETEIcean.rw(that.getAttribute('target')));
                                            link.setAttribute('target', '_blank');
                                            link.innerHTML = that.innerHTML;
                                            var shadow = that.createShadowRoot();
                                            shadow.appendChild(link);
                                        });
                                    };
                                },
                                'gap': ['[', ']'],
                                'graphic': function() {
                                    return function() {
                                        var that = this;
                                        $timeout(function () {
                                            var content = new Image();
                                            content.src = CETEIcean.rw(that.getAttribute('url'));
                                            if (that.hasAttribute('width')) {
                                                content.width = that.getAttribute('width').replace(/[^.0-9]/g, '');
                                            }
                                            if (that.hasAttribute('height')) {
                                                content.height = that.getAttribute('height').replace(/[^.0-9]/g, '');
                                            }
                                            var link = document.createElement('a');
                                            link.setAttribute('href', CETEIcean.rw(that.getAttribute('url')));
                                            link.setAttribute('target', '_blank');
                                            link.appendChild(content);
                                            var shadow = that.createShadowRoot();
                                            shadow.appendChild(link);
                                        });
                                    };
                                },
                                // this function doesn't use createdCallback or other Web Objects
                                // functionality, and so will be used by all browsers.
                                'note': function() {
                                    return function(elt) {
                                        if (!elt) {
                                            elt = this;
                                        }
                                        var span = document.createElement('span');
                                        span.innerHTML = elt.getAttribute('place') === 'margin' ? '[<em>in marg.</em> ' : '[';
                                        elt.insertBefore(span, elt.firstChild);
                                        span = document.createElement('span');
                                        span.innerHTML = ']';
                                        elt.appendChild(span);
                                    };
                                },
                                'pb': function () {
                                    return function() {
                                        var that = this;
                                        $timeout(function () {
                                            var link = document.createElement('a');
                                            link.setAttribute('style', 'text-align:right;text-decoration:none;color:gray;');
                                            if (that.hasAttribute('facs')) {
                                                var facs = that.getAttribute('facs');
                                                var img;
                                                if (facs.match(/^(?!https?:\/\/).*$/)) {
                                                    link.setAttribute('href', CETEIcean.rw(facs));
                                                } else {
                                                    link.setAttribute('href', facs);
                                                }
                                                link.setAttribute('target', '_blank');
                                                if (that.hasAttribute('n')) {
                                                    link.innerHTML = 'p. ' + that.getAttribute('n');
                                                }
                                                if (facs.match(/^https?:\/\/.*(?:jpg|jpeg|gif|png)$/)) {
                                                    img = document.createElement('img');
                                                    img.setAttribute('src', facs);
                                                    img.setAttribute('height', '50px');
                                                    link.appendChild(img);
                                                } else if (facs.match(/.*(?:jpg|jpeg|gif|png)$/)) {
                                                    img = document.createElement('img');
                                                    img.setAttribute('src', CETEIcean.rw(facs));
                                                    img.setAttribute('height', '50px');
                                                    link.appendChild(img);
                                                }
                                            }
                                            var shadow = that.createShadowRoot();
                                            shadow.appendChild(link);
                                        });
                                    };
                                }
                            },
                            'fallbacks': {
                                'graphic': function(elmt) {
                                    $timeout(function () {
                                        var content = new Image();
                                        content.src = CETEIcean.rw(elmt.getAttribute('url'));
                                        if (elmt.hasAttribute('width')) {
                                            content.width = elmt.getAttribute('width').replace(/[^.0-9]/g, '');
                                        }
                                        if (elmt.hasAttribute('height')) {
                                            content.height = elmt.getAttribute('height').replace(/[^.0-9]/g, '');
                                        }
                                        var link = document.createElement('a');
                                        link.setAttribute('href', CETEIcean.rw(elmt.getAttribute('url')));
                                        link.setAttribute('target', '_blank');
                                        link.appendChild(content);
                                        elmt.appendChild(link);
                                    });
                                },
                                'pb': function () {
                                    var elts = this.dom.getElementsByTagName('tei-pb'), i, pgbr, link;
                                    for (i = 0; i < elts.length; i++) {
                                        pgbr = document.createElement('span');
                                        link = document.createElement('a');
                                        link.setAttribute('style', 'text-align:right;text-decoration:none;color:gray;');
                                        if (elts[i].hasAttribute('facs')) {
                                            var facs = elts[i].getAttribute('facs');
                                            var img;
                                            if (facs.match(/^(?!https?:\/\/).*$/)) {
                                                link.setAttribute('href', CETEIcean.rw(facs));
                                            } else {
                                                link.setAttribute('href', facs);
                                            }
                                            link.setAttribute('target', '_blank');
                                            if (elts[i].hasAttribute('n')) {
                                                link.innerHTML = 'p. ' + elts[i].getAttribute('n');
                                            }
                                            if (facs.match(/^https?:\/\/.*(?:jpg|jpeg|gif|png)$/)) {
                                                img = document.createElement('img');
                                                img.setAttribute('src', facs);
                                                img.setAttribute('height', '50px');
                                                link.appendChild(img);
                                            } else if (facs.match(/.*(?:jpg|jpeg|gif|png)$/)) {
                                                img = document.createElement('img');
                                                img.setAttribute('src', CETEIcean.rw(facs));
                                                img.setAttribute('height', '50px');
                                                link.appendChild(img);
                                            }
                                        }
                                        pgbr.appendChild(link);
                                        elts[i].insertBefore(pgbr, elts[i].firstChild);
                                    }
                                }
                            }
                        });
                    }

                    CETEIcean.makeHTML5(scope.content, function (data) {
                        element.append(data);
                        CETEIcean.addStyle(element, data);
                        if (!!window.chrome) {
                            var gs = element[0].getElementsByTagName('tei-g');
                            for (var i = 0; i < gs.length; i++) {
                                if (gs[i].getAttribute('ref') === 'char:cmbAbbrStroke') {
                                    gs[i].setAttribute('class', 'cmbAbbr');
                                }
                            }
                        }
                    });
                }

                scope.$watch('content', function (newValue) {
                    if (angular.isDefined(newValue)) {
                        processTEI();
                    }
                });
            }
        };
    }]);
