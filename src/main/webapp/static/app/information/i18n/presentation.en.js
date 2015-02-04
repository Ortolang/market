'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.PRES_EN
 * @description
 * # PRES_EN
 * Constant in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .constant('PRES_EN', {
        PRES: {
            ORTOLANG: 'Open Resources and TOols for LANGuage',
            INNOVATIVE_SHS: 'Meet ORTOLANG at the 2nd conference  of the exposition "Innovatives SHS de l\'INSHS"',
            NEWSLETTER: 'Newsletter',
            FIRST_NEWSLETTER: 'ORTOLANG first newsletter',
            TITLE_PRESENTATION: 'Presentation',
            PRESENTATION: '<p>ORTOLANG is an EQUIPEX project accepted in February 2012 in the framework of  <a href="http://investissement-avenir.gouvernement.fr/" target="_BLANK">' +
            'investissements d’avenir</a>. Its aim is to construct a network infrastructure including a repository of language data (corpora, lexicons, dictionaries etc.) and ' +
            'readily available, well-documented tools for its processing. Expected outcomes comprize: </p>' +
            '<ul>' +
            '   <li>promoting research on analysis, modelling and automatic processing of our language to their highest international levels ' +
            'thanks to effective resource pooling;</li>' +
            '   <li>facilitating the use and transfer of resources and tools set up within public laboratories to industrial ' +
            'partners, notably SMEs which often cannot develop such resources and tools for language processing given the cost of investment;</li>' +
            '   <li>promoting French language and the regional languages of France by sharing expertise acquired by public laboratories.</li>' +
            '</ul>' +
            '<p>ORTOLANG is a service for the language, which is complementary to the service offered by <a href="http://www.huma-num.fr/" target="_Blank">Huma-Num</a> ' +
            '(très grande infrastructure de recherche).</p>',
            OBJECTIFS: '<h2 id="Objectifs">Objectives</h2>' +
            '<hr>' +
            '<p>ORTOLANG’s objective is to extend and preserve the endeavours of digital resource centres dealing with language:</p>' +
            '<ul>' +
            '   <li><a target="_blank" href="http://www.cnrtl.fr/">CNRTL</a> (Centre National de Ressources Textuelles et Lexicales)</li>' +
            '   <li><a target="_blank" href="http://sldr.org/">SLDR</a> (Speech and Language Data Repository)</li>' +
            '</ul>' +
            '<p>ORTOLANG is also aiming at offering: </p>' +
            '<ul>' +
            '   <li>a technical platform on written and oral language, in support of coordination actions by <a target="_blank" href="http://www.huma-num.fr/">' +
            'TGIR Huma-Num</a>;</li>' +
            '   <li>scientific equipment compliant with initiatives by DGLFLF and BNF on culture-heritage aspects of languages spoken in France;</li>' +
            '   <li>a French node of <a target="_blank" href="http://www.clarin.eu/">CLARIN</a> (Common Language Resources and Technology Infrastructure).</li>' +
            '</ul>',
            FONCTIONS: '<h2 id="Fonctions">Functions</h2>' +
            '<hr>' +
            '<h4>Identification/preparation of data:</h4>' +
            '<ul>' +
            '   <li>cataloging existing resources and tools using sets of standardised metadata;</li>' +
            '   <li>controlling and validating resources and tools: assisting authors on standards, norms and current international recommendations: ' +
            'XML, TEI, LMF, MAF and SYNAF;</li>' +
            '   <li>upgrading of resources and tools.</li>' +
            '</ul>' +
            '<h4>Archiving:</h4>' +
            '<ul>' +
            '   <li>storage, maintenance and curation of resources and tools;</li>' +
            '   <li>long-term preservation using the framework of <a target="_blank"  href="http://www.huma-num.fr/">TGIR Huma-Num</a> in connection with ' +
            '<a target="_blank"  href="http://www.cines.fr/">CINES</a>.</li>' +
            '</ul>' +
            '<h4>Dissemination:</h4>' +
            '<ul>' +
            '   <li>assistance et support to users and installing procedures that will make it possible for them to take advantage of shared resources and tools ' +
            'regardless of their localisation and spatial location.</li>' +
            '</ul>' +
            '<p>The ORTOLANG model incorporates the basic entities of OAIS model by specifying the correction / data enrichment cycle, made possible through archiving.</p>',
            COMPETENCIES: '<h2 id="Comptences_runies">Complementary competencies</h2>' +
            '<hr>' +
            '<p>In order to achieve this, we have chosen to call for complementary competencies in our consortium with respect to: </p>' +
            '<ul>' +
            '   <li>language sciences with <a target="_blank"  href="http://www.atilf.fr/">ATILF</a>, ' +
            '<a target="_blank"  href="http://www.lpl-aix.fr/">LPL</a>, <a target="_blank"  href="http://www.modyco.fr/">MoDyCo</a> and ' +
            '<a target="_blank"  href="http://www.lll.cnrs.fr/">LLL</a>;</li>' +
            '   <li>computer science with <a target="_blank"  href="http://www.loria.fr/">LORIA</a> and ' +
            '<a target="_blank"  href="http://www.inist.fr/">INIST</a> but also partly <a target="_blank"  href="http://www.atilf.fr/">ATILF</a> and ' +
            '<a target="_blank"  href="http://www.lpl-aix.fr/">LPL</a>;</li>' +
            '   <li>database and access to scientific information through <a target="_blank"  href="http://www.inist.fr/">INIST</a>, and linguistic resources with ' +
            'the two resource centres : <a target="_blank"  href="http://www.cnrtl.fr/">CNRTL</a> and <a target="_blank"  href="http://sldr.org/">SLDR</a>.</li>' +
            '</ul>' +
            '<p>Beyond bringing together these different disciplinary competencies, ORTOLANG’s objective is to federate partners covering the ' +
            'diversity of approaches to the study of language for its equipment of shared resources and tools:</p>' +
            '<ul>' +
            '   <li>linguistic modelling (<a target="_blank"  href="http://www.modyco.fr/">MoDyCo</a>, <a target="_blank"  href="http://www.lpl-aix.fr/">LPL</a> ' +
            'and <a target="_blank"  href="http://www.atilf.fr/">ATILF</a>),</li>' +
            '   <li>experimental linguistics (<a target="_blank"  href="http://www.lpl-aix.fr/">LPL</a>, <a target="_blank"  href="http://www.atilf.fr/">ATILF</a>),' +
            '</li>' +
            '   <li>language production and perception (<a target="_blank"  href="http://www.lpl-aix.fr/">LPL</a>, ' +
            '<a target="_blank"  href="http://www.modyco.fr/">MoDyCo</a>),</li>' +
            '   <li>diachronic studies (<a target="_blank"  href="http://www.atilf.fr/">ATILF</a>, <a target="_blank"  href="http://www.lll.cnrs.fr/">LLL</a>),</li>' +
            '   <li>sociolinguistics (<a target="_blank"  href="http://www.lll.cnrs.fr/">LLL</a>, <a target="_blank"  href="http://www.modyco.fr/">MoDyCo</a>),</li>' +
            '   <li>automatic processing of language (<a target="_blank"  href="http://www.loria.fr/">LORIA</a>, <a  href="http://www.lpl-aix.fr/">LPL</a>, ' +
            '<a target="_blank"  href="http://www.atilf.fr/">ATILF</a>).</li>' +
            '</ul>',
            LINK_DOCUMENTATION: '<p>A <a href="/#/documentation" title="user\'s documentation">user\'s documentation</a> is available for facilitating ' +
            'your queries.</p>',
            LINK_COMMUNITY: '<p>You may also access the <a href="http://dev.ortolang.fr/" target="_blank" >community development site</a> of ORTOLANG project.</p>',
            LINK_PARTNERS: 'ORTOLANG brings together diverse fields of expertise from its <a href="/#/partners" title="partners">partners</a>.',
            LINK_ROADMAP: 'A planning of major ORTOLANG version building stages is displayed in the <a href="/#/roadmap" title="roadmap">general roadmap</a>.',
            TITLE_PARTNERS: 'Partners',
            INSTITUTIONS: 'Institutions',
            PARTNERS: 'Partners',
            TITLE_ROADMAP: 'Roadmap',
            TITLE_DOCUMENTATION: 'Documentation',
            TITLE_LEGAL_INFORMATION: 'Legal notices',
            TITLE_COMMUNITY: 'Community development site',
            TITLE_CONTACT: 'Contact us'
        }
    });
