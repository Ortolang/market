'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.STATIC_WEBSITE_FR
 * @description
 * # STATIC_WEBSITE_FR
 * Constant in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .constant('STATIC_WEBSITE_FR', {
        STATIC_WEBSITE: {
            PATH: {
                LEGAL_NOTICES: 'common/static-website/fr/legal-notices.html'
            },
            ALL_THE_NEWS: 'Toutes les actualités...',
            USERS: '{{::stat}} utilisateurs',
            WORKSPACES: '{{::stat}} ressources',
            DATA: '{{::stat | bytes}} de données',
            FILES: '{{::stat | numbers:"fr"}} fichiers',
            LEGAL_NOTICES: {
                TITLE: 'Mentions Légales',
                INFO_PUBLICATION: 'Informations de publication',
                PUBLICATION_DIRECTOR: 'Directeur de la publication',
                SECONDARY_DIRECTOR: 'Directeurs adjoints',
                IT_MANAGER: 'Responsable informatique',
                IT_DEVELOPMENT: 'Développement informatique',
                PERSONNAL_DATA: 'Données personnelles',
                PERSONNAL_DATA_CONTENT_1 : 'Conformément à la Loi Informatique et Libertés, nous vous informons que la collecte de données personnelles associée à ce site est en cours de déclaration auprès de la CNIL. A aucun moment ces informations ne sont transmises à un tiers.',
                PERSONNAL_DATA_CONTENT_2 : 'Vous bénéficiez d\'un droit d\'accès et de rectification aux informations qui vous concernent. Si vous souhaitez exercer ce droit et obtenir communication des informations vous concernant, veuillez adresser un courrier à ATILF, 44, avenue de la libération, 54063 Nancy Cedex - France, en joignant une photocopie de votre carte d\'identité. Afin de répondre à votre demande, merci de nous fournir quelques indications (identifiant ORTOLANG) et d\'indiquer un numéro de téléphone pour vous joindre.',
                TERMS_OF_USE: 'Conditions générales d’utilisation',
                USAGE_RULES: 'Règles de bonne conduite',
                LIABILITY_DISCLAIMER: 'Clause de non-responsabilité',
                LIABILITY_DISCLAIMER_CONTENT: 'La responsabilité du CNRS et des partenaires ORTOLANG ne peut, en aucune manière, être engagée quant au contenu des informations figurant sur ce site ou aux conséquences pouvant résulter de leur utilisation ou interprétation.',
                INTELLECTUAL_PROPERTY: 'Propriété intellectuelle',
                INTELLECTUAL_PROPERTY_CONTENT: 'Le site de ORTOLANG est une oeuvre de création, propriété exclusive du CNRS, protégé par la législation française et internationale sur le droit de la propriété intellectuelle. Aucune reproduction ou représentation ne peut être réalisée en contravention avec les droits du CNRS issus de la législation susvisée.',
                HYPERLINKS: 'Liens hypertextes',
                HYPERLINKS_CONTENT: 'La mise en place de liens hypertextes par des tiers vers des pages ou des documents diffusés sur le site de ORTOLANG, est autorisée sous réserve que les liens ne contreviennent pas aux intérêts des partenaires du projet ORTOLANG, et, qu’ils garantissent la possibilité pour l’utilisateur d’identifier l’origine et l’auteur du document.',
                CONFIDENTIALITY: 'Politique de confidentialité',
                COOKIES_USE: 'Utilisation des cookies',
                COOKIES_USE_CONTENT: 'Le site de ORTOLANG utilise des cookies afin de réaliser des statistiques d\'audiences anonymes uniquement destinées à un usage interne. Ces statistiques sont réalisées grâce au logiciel libre et open source de mesure de statistiques web <a href="https://fr.piwik.org/" target="_blank">Piwik</a> hébergé sur nos propres serveur.',
                DO_NOT_TRACK: 'Ne pas autoriser à suivre mes visites',
                DO_NOT_TRACK_CONTENT: '<ul><li>Si la fonction "Ne pas me pister" ("Do No Track" en anglais) de votre navigateur est activée, notre outil d\'analyse web n\'enregistrera pas votre activité sur notre site.</li><li>Vous avez également la possibilité de demander à ne pas être suivi ci-dessous :</li></ul>',
                DO_NOT_TRACK_ACTUAL_CONFIG: 'Configuration actuelle :'
            }
        }
    });
