'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.OrtolangIitemJsonMigration
 * @description
 * # OrtolangIitemJsonMigration
 * Service in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp').service('OrtolangIitemJsonMigration', function () {

	this.migrate = function (src) {
		if (src.schema === 'http://www.ortolang.fr/schema/013#') {
			src.schema = 'http://www.ortolang.fr/schema/014#';
		}
	};
    return this;
});