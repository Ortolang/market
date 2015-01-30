'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.PRES_FR
 * @description
 * # PRES_FR
 * Constant in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .constant('PRES_FR', {
        PRES: {
            ORTOLANG: 'Outils et Ressources pour un Traitement Optimisé de la LANGue',
            INFO:'<p>ORTOLANG est un <b>équipement d’excellence</b> validé dans le cadre des <a href="http://investissement-avenir.gouvernement.fr/" target="_BLANK">investissements d’avenir</a>. ' +
            'Son but est de proposer une infrastructure en réseau offrant un <b>réservoir de données</b> (corpus, lexiques, dictionnaires, etc.) et d’outils sur <b>la langue et son traitement</b> ' +
            'clairement disponibles et documentés qui :</p>' +
            '<ul>' +
            '   <li>permette, au travers d’une véritable <b>mutualisation</b>, à la recherche sur l’analyse, la <b>modélisation</b> et le <b>traitement automatique</b> de notre langue de se hisser au ' +
            '<b>meilleur niveau international</b> ;</li>' +
            '   <li><b>facilite l’usage</b> et le transfert des ressources et <b>outils</b> mis en place au sein des <b>laboratoires publics</b> vers les <b>partenaires industriels</b> ' +
            'en particulier vers les PME qui souvent ne peuvent pas se permettre de développer de telles ressources et outils de traitement de la langue compte tenu de leurs coûts de réalisation ;</li>' +
            '   <li><b>valorise</b> le français et les langues de France à travers un <b>partage des connaissances</b> sur notre langue accumulées par les laboratoires publics.</li>' +
            '</ul>',
            PROJET: '<p>ORTOLANG est un service <strong>spécialisé pour la langue</strong>, complémentaire de l\'offre générale proposée par <a href="http://www.huma-num.fr/" target="_Blank">Huma-Num</a> ' +
            '(très grande infrastructure de recherche).</p>' +
            '<p>En savoir <a href="/#/presentation" title="Présentation de Ortolang">plus sur le projet…</a></p>',
            INNOVATIVE_SHS: 'Retrouver ORTOLANG à la Seconde édition du salon Innovatives SHS de l\'INSHS',
            NEWSLETTERS: 'Lettres d\'information',
            FIRST_NEWSLETTER: 'Première lettre d\'information d\'ORTOLANG',
            TITLE_PRESENTATION: 'Présentation',
            PRESENTATION: '<p>ORTOLANG est un <b>équipement d’excellence</b> validé dans le cadre des <a href="http://investissement-avenir.gouvernement.fr" target="_BLANK">investissements d’avenir</a>. ' +
            'Son but est de proposer une infrastructure en réseau offrant un <b>réservoir de données</b> (corpus, lexiques, dictionnaires, etc.) et d’outils sur <b>la langue et son traitement</b> clairement ' +
            'disponibles et documentés qui :</p>' +
            '<ul>' +
            '   <li>permette, au travers d’une véritable <b>mutualisation</b>, à la recherche sur l’analyse, la <b>modélisation</b> et le <b>traitement automatique</b> de ' +
            'notre langue de se hisser au <b>meilleur niveau international</b> ;</li>' +
            '   <li><b>facilite l’usage</b> et le transfert des ressources et <b>outils</b> mis en place au sein des <b>laboratoires publics</b> vers les <b>partenaires industriels</b>, en particulier ' +
            'vers les PME qui souvent ne peuvent pas se permettre de développer de telles ressources et outils de traitement de la langue compte tenu de leurs coûts de réalisation ;</li>' +
            '   <li><b>valorise</b> le français et les langues de France à travers un <b>partage des connaissances</b> sur notre langue accumulées par les laboratoires publics.</li>' +
            '</ul>' +
            '<p>ORTOLANG est un service <strong>spécialisé pour la langue</strong>, complémentaire de l\'offre générale proposée par <a href="http://www.huma-num.fr/" target="_Blank">Huma-Num</a> ' +
            '(très grande infrastructure de recherche).</p>',
            OBJECTIFS: '<h2 id="Objectifs">Objectifs</h2>' +
            '<hr>' +
            '<p>ORTOLANG a pour objectif de <b>généraliser</b> et d’<b>assurer la pérennisation</b> des efforts entrepris à travers les Centres de Ressources Numériques sur la langue :</p>' +
            '<ul>' +
            '   <li><a target="_blank" href="http://www.cnrtl.fr">CNRTL</a> (Centre National de Ressources Textuelles et Lexicales)</li>' +
            '   <li><a target="_blank" href="http://sldr.org">SLDR</a> (Speech and Language Data Repository)</li>' +
            '</ul>' +
            '<p>ORTOLANG a aussi pour ambition de servir</p>' +
            '<ul>' +
            '   <li>de <b>plateforme technique</b> sur la langue, écrite et orale, support des actions de coordination menées par la <a target="_blank" href="http://www.huma-num.fr">' +
            'TGIR Huma-Num</a></li>' +
            '   <li><b>d’équipement scientifique</b> en cohérence avec les efforts menés par la DGLFLF et la BNF sur les aspects <b>patrimonialisation des parlers de France</b>.</li>' +
            '   <li>de <b>nœud français</b> de l’infrastructure <a target="_blank" href="http://www.clarin.eu">CLARIN</a> (Common Language Resources and Technology Infrastructure)</li>' +
            '</ul>',
            FONCTIONS: '<h2 id="Fonctions">Fonctions</h2>' +
            '<hr>' +
            '<h4>Identification/préparation des données :</h4>' +
            '<ul>' +
            '   <li><b>catalogage</b> des ressources et outils existants à travers un ensemble de <b>métadonnées normalisées</b> ;</li>' +
            '   <li><b>contrôle</b> et <b>validation</b> des ressources et des outils : accompagnement des auteurs sur les <b>standards</b>, les normes et les recommandations internationales actuelles : ' +
            'XML, TEI, LMF, MAF et SYNAF ;</li>' +
            '   <li><b>enrichissement</b> de ressources et des outils.</li>' +
            '</ul>' +
            '<h4>Archivage:</h4>' +
            '<ul>' +
            '   <li><b>stockage</b>, maintenance et curation des ressources et des outils ;</li>' +
            '   <li><b>archivage pérenne</b>, à travers la solution mise en place par la <a target="_blank" href="http://www.huma-num.fr">TGIR Huma-Num</a> en lien avec le ' +
            '<a target="_blank" href="http://www.cines.fr">CINES</a>.</li>' +
            '</ul>' +
            '<h4>Diffusion :</h4>' +
            '<ul>' +
            '   <li><b>aide</b> et <b>accompagnement</b> des utilisateurs et mise en place des procédures permettant à des utilisateurs de la plateforme d’<b>exploiter les ressources</b> et ' +
            'outils mutualisés sans avoir à se soucier de leur localisation et implantation géographiques.</li>' +
            '</ul>' +
            '<p>Le modèle d’ORTOLANG reprend les entités de base du <b>modèle OAIS</b> en précisant le cycle de correction/enrichissement des données, rendu possible par l’<b>archivage intermédiaire</b>. </p>',
            COMPETENCIES: '<h2 id="Comptences_runies">Compétences réunies</h2>' +
            '<hr>' +
            '<ul>' +
            '   <li><b>sciences du langage</b> à travers l’<a target="_blank" href="http://www.atilf.fr">ATILF</a>, le <a target="_blank" href="http://www.lpl-aix.fr">LPL</a>, ' +
            '<a target="_blank" href="http://www.modyco.fr">MoDyCo</a> et le <a target="_blank" href="http://www.lll.cnrs.fr">LLL</a>,</li>' +
            '   <li><b>informatique</b> avec le <a target="_blank" href="http://www.loria.fr">LORIA</a> et l’<a target="_blank" href="http://www.inist.fr">INIST</a> mais aussi en partie ' +
            'l’<a target="_blank" href="http://www.atilf.fr">ATILF</a> et le <a target="_blank" href="http://www.lpl-aix.fr">LPL</a></li>' +
            '   <li><b>base de données</b> et accès à de l’information scientifique, à travers l’<a target="_blank" href="http://www.inist.fr">INIST</a>, et à des ressources linguistiques, ' +
            'à travers les deux centres de ressources que sont le <a target="_blank" href="http://www.cnrtl.fr">CNRTL</a> et le <a target="_blank" href="http://sldr.org">SLDR</a>.</li>' +
            '</ul>' +
            '<p>Au-delà de la <b>réunion</b> de ces partenaires réunissant des compétences disciplinaires différentes l’objectif d’ORTOLANG est aussi de <b>fédérer</b> pour cet équipement de ' +
            'mutualisation de ressources et d’outils sur la langue écrite et orale des partenaires représentant la <b>diversité</b> des approches d’étude de la langue :</p>' +
            '<ul>' +
            '   <li>modélisation linguistique (<a target="_blank" href="http://www.modyco.fr">MoDyCo</a>, <a target="_blank" href="http://www.lpl-aix.fr">LPL</a> et ' +
            '<a target="_blank" href="http://www.atilf.fr">ATILF</a>),</li>' +
            '   <li>linguistique expérimentale (<a target="_blank" href="http://www.lpl-aix.fr">LPL</a>, <a target="_blank" href="http://www.atilf.fr">ATILF</a>),</li>' +
            '   <li>production et de perception du langage (<a target="_blank" href="http://www.lpl-aix.fr">LPL</a>, <a target="_blank" href="http://www.modyco.fr">MoDyCo</a>),</li>' +
            '   <li>études diachroniques (<a target="_blank" href="http://www.atilf.fr">ATILF</a>, <a target="_blank" href="http://www.lll.cnrs.fr">LLL</a>),</li>' +
            '   <li>sociolinguistique (<a target="_blank" href="http://www.lll.cnrs.fr">LLL</a>, <a target="_blank" href="http://www.modyco.fr">MoDyCo</a>),</li>' +
            '   <li>traitement Automatique des Langues (<a target="_blank" href="http://www.loria.fr">LORIA</a>, <a target="_blank" href="http://www.lpl-aix.fr">LPL</a>, ' +
            '<a target="_blank" href="http://www.atilf.fr">ATILF</a>).</li>' +
            '</ul>',
            LINK_DOCUMENTATION: '<p>Une <a href="/#/documentation" title="Documentation Utilisateur">documentation utilisateur</a> est disponible pour vous aider ' +
            'à effectuer des recherches.</p>',
            LINK_COMMUNITY: '<p>Vous pouvez également accèder au <a href="http://dev.ortolang.fr/" target="_blank" >site communautaire</a> de l\'équipe de développement du projet ORTOLANG.</p>',
            LINK_PARTNERS: 'ORTOLANG réunit des compétences variées grâce à un ensemble de <a href="/#/partners" title="Partenaires">partenaires</a>.',
            LINK_ROADMAP: 'Le planning de réalisation globale des versions majeures d\'ORTOLANG est visible dans la <a href="/#/roadmap" title="roadmap">roadmap générale</a>.',
            TITLE_PARTNERS: 'Partenaires',
            INSTITUTIONS: 'Institutions',
            PARTNERS: 'Unités support du projet',
            TITLE_ROADMAP: 'Roadmap',
            TITLE_DOCUMENTATION: 'Documentation',
            TITLE_LEGAL_INFORMATIONS: 'Mentions légales',
            TITLE_COMMUNITY: 'Site communautaire',
            TITLE_CONTACT: 'Contact'
        }
    });
