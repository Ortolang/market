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
            INNOVATIVE_SHS: 'Retrouver ORTOLANG à la Seconde édition du salon Innovatives SHS de l\'INSHS',
            NEWSLETTERS: 'Lettres d\'information',
            FIRST_NEWSLETTER: 'Première lettre d\'information d\'ORTOLANG',
            TITLE_PRESENTATION: 'Présentation',
            PRESENTATION: '<p>ORTOLANG est un équipement d’excellence validé dans le cadre des <a href="http://investissement-avenir.gouvernement.fr" target="_BLANK">investissements d’avenir</a>. ' +
            'Son but est de proposer une infrastructure en réseau offrant un réservoir de données (corpus, lexiques, dictionnaires, etc.) et d’outils sur la langue et son traitement clairement ' +
            'disponibles et documentés qui :</p>' +
            '<ul>' +
            '   <li>permette, au travers d’une véritable mutualisation, à la recherche sur l’analyse, la modélisation et le traitement automatique de ' +
            'notre langue de se hisser au meilleur niveau international;</li>' +
            '   <li>facilite l’usage et le transfert des ressources et outils mis en place au sein des laboratoires publics vers les partenaires industriels, en particulier ' +
            'vers les PME qui souvent ne peuvent pas se permettre de développer de telles ressources et outils de traitement de la langue compte tenu de leurs coûts de réalisation;</li>' +
            '   <li>valorise le français et les langues de France à travers un partage des connaissances sur notre langue accumulées par les laboratoires publics.</li>' +
            '</ul>' +
            '<p>ORTOLANG est un service spécialisé pour la langue, complémentaire de l\'offre générale proposée par <a href="http://www.huma-num.fr/" target="_Blank">Huma-Num</a> ' +
            '(très grande infrastructure de recherche).</p>',
            OBJECTIFS: '<h3 id="Objectifs">Objectifs</h3>' +
            '<hr>' +
            '<p>ORTOLANG a pour objectif de généraliser et d’assurer la pérennisation des efforts entrepris à travers les Centres de Ressources Numériques sur la langue :</p>' +
            '<ul>' +
            '   <li><a target="_blank" href="http://www.cnrtl.fr">CNRTL</a> (Centre National de Ressources Textuelles et Lexicales)</li>' +
            '   <li><a target="_blank" href="http://sldr.org">SLDR</a> (Speech and Language Data Repository)</li>' +
            '</ul>' +
            '<p>ORTOLANG a aussi pour ambition de servir :</p>' +
            '<ul>' +
            '   <li>de plateforme technique sur la langue, écrite et orale, support des actions de coordination menées par la <a target="_blank" href="http://www.huma-num.fr">' +
            'TGIR Huma-Num,</a></li>' +
            '   <li>d’équipement scientifique en cohérence avec les efforts menés par la DGLFLF et la BNF sur les aspects patrimonialisation des parlers de France,</li>' +
            '   <li>de nœud français de l’infrastructure <a target="_blank" href="http://www.clarin.eu">CLARIN</a> (Common Language Resources and Technology Infrastructure).</li>' +
            '</ul>',
            FONCTIONS: '<h3 id="Fonctions">Fonctions</h3>' +
            '<hr>' +
            '<h4>Identification/préparation des données :</h4>' +
            '<ul>' +
            '   <li>catalogage des ressources et outils existants à travers un ensemble de métadonnées normalisées;</li>' +
            '   <li>contrôle et validation des ressources et des outils : accompagnement des auteurs sur les standards, les normes et les recommandations internationales actuelles : ' +
            'XML, TEI, LMF, MAF et SYNAF;</li>' +
            '   <li>enrichissement de ressources et des outils.</li>' +
            '</ul>' +
            '<h4>Archivage :</h4>' +
            '<ul>' +
            '   <li>stockage, maintenance et curation des ressources et des outils;</li>' +
            '   <li>archivage pérenne, à travers la solution mise en place par la <a target="_blank" href="http://www.huma-num.fr">TGIR Huma-Num</a> en lien avec le ' +
            '<a target="_blank" href="http://www.cines.fr">CINES</a>.</li>' +
            '</ul>' +
            '<h4>Diffusion :</h4>' +
            '<ul>' +
            '   <li>aide et accompagnement des utilisateurs et mise en place des procédures permettant à des utilisateurs de la plateforme d’exploiter les ressources et ' +
            'outils mutualisés sans avoir à se soucier de leur localisation et implantation géographiques.</li>' +
            '</ul>' +
            '<p>Le modèle d’ORTOLANG reprend les entités de base du modèle OAIS en précisant le cycle de correction/enrichissement des données, rendu possible par l’archivage intermédiaire. </p>',
            COMPETENCIES: '<h3 id="Comptences_runies">Compétences réunies</h3>' +
            '<hr>' +
            '<p>Pour ce faire, nous avons choisi de faire appel à des compétences complémentaires au sein de notre consortium :</p>' +
            '<ul>' +
            '   <li>les sciences du langage à travers l’<a target="_blank" href="http://www.atilf.fr">ATILF</a>, le <a target="_blank" href="http://www.lpl-aix.fr">LPL</a>, ' +
            '<a target="_blank" href="http://www.modyco.fr">MoDyCo</a> et le <a target="_blank" href="http://www.lll.cnrs.fr">LLL</a>,</li>' +
            '   <li>l’informatique avec le <a target="_blank" href="http://www.loria.fr">LORIA</a> et l’<a target="_blank" href="http://www.inist.fr">INIST</a> mais aussi en partie ' +
            'l’<a target="_blank" href="http://www.atilf.fr">ATILF</a> et le <a target="_blank" href="http://www.lpl-aix.fr">LPL,</a></li>' +
            '   <li>les bases de données et l’accès à de l’information scientifique, à travers l’<a target="_blank" href="http://www.inist.fr">INIST</a>, et à des ressources linguistiques, ' +
            'à travers les deux centres de ressources que sont le <a target="_blank" href="http://www.cnrtl.fr">CNRTL</a> et le <a target="_blank" href="http://sldr.org">SLDR</a>.</li>' +
            '</ul>' +
            '<p>Au-delà de la réunion de ces partenaires réunissant des compétences disciplinaires différentes l’objectif d’ORTOLANG est aussi de fédérer pour cet équipement de ' +
            'mutualisation de ressources et d’outils sur la langue écrite et orale des partenaires représentant la diversité des approches d’étude de la langue :</p>' +
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
            TITLE_CONTACT: 'Contactez-nous'
        }
    });
