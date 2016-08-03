'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.OrtolangIitemJsonMigration
 * @description
 * # OrtolangIitemJsonMigration
 * Service in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp').service('OrtolangIitemJsonMigration', function () {
	var regExp = new RegExp('^\\$\\{[a-zA-Z0-9_\\-]+:[a-zA-Z0-9_\\-]+\\}$', 'g');

	function changeStringLanguage (languages) {
		var i = 0;
        for (i; i < languages.length; i++) {
        	var language = languages[i];
            if (language.match(regExp) === null) {
				languages[i] = {labels:[{lang: 'fr', value: language}]};

			}
        }
	}

	function migrateSchema13to14 (src) {
		// With all the termino fields
		src.schema = 'http://www.ortolang.fr/schema/014#';
	}

	function migrateSchema14to15 (src) {
		// With object for any language not reference by a referential
		src.schema = 'http://www.ortolang.fr/schema/015#';
		if (src.corporaLanguages) {
			changeStringLanguage(src.corporaLanguages);
		}
		if (src.corporaStudyLanguages) {
			changeStringLanguage(src.corporaStudyLanguages);
		}
		if (src.navigationLanguages) {
			changeStringLanguage(src.navigationLanguages);
		}
		if (src.toolLanguages) {
			changeStringLanguage(src.toolLanguages);
		}
		if (src.lexiconInputLanguages) {
			changeStringLanguage(src.lexiconInputLanguages);
		}
		if (src.lexiconDescriptionLanguages) {
			changeStringLanguage(src.lexiconDescriptionLanguages);
		}
		if (src.terminoInputLanguages) {
			changeStringLanguage(src.terminoInputLanguages);
		}
	}

	this.migrate = function (src) {
		if (src.schema === 'http://www.ortolang.fr/schema/013#') {
			migrateSchema13to14(src);
			migrateSchema14to15(src);
		} else if (src.schema === 'http://www.ortolang.fr/schema/014#') {
			migrateSchema14to15(src);
		}
	};
    return this;
});