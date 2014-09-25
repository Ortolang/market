'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.Session
 * @description
 * # Session
 * Service in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .service('Session', function Session() {
        /**
         * Create a new session
         * @param sessionId
         * @param profil
         */
        this.create = function (sessionId, profil) {
            this.id = sessionId;
            this.userId = profil.key;
            this.name = profil.fullname;
            this.email = profil.email;
            this.status = profil.status;
            this.userMember = profil.groups;
            //console.log(this);
            return this;
        };
        /**
         * Recreate session (from cookie)
         * @param user
         */
        this.load = function (user) {
            this.id = user.id;
            this.userId = user.userId;
            this.name = user.name;
            this.email = user.email;
            this.status = user.status;
            this.userMember = user.userMember;
            return this;
        };
        /**
         * Destroy current session
         */
        this.destroy = function () {
            this.id = null;
            this.userId = null;
            this.name = null;
            this.email = null;
            this.status = null;
            this.userMember = null;
        };
        return this;
    });