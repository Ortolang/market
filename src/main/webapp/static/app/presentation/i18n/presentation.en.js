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
            INFO: '<p>ORTOLANG is an <b>EQUIPEX project</b> accepted in February 2012 in the framework of <a href="http://investissement-avenir.gouvernement.fr/" target="_BLANK">investissements d’avenir</a>' +
            'Its aim is to construct a network infrastructure including a repository of language data (corpora, lexicons, dictionaries etc.) and readily available, well-documented tools for its processing. ' +
            'Expected outcomes comprize:</p>' +
            '<ul>' +
            '   <li>promoting research on analysis, <strong>modelling</strong> and <strong>automatic processing</strong> of our language to their <strong>highest international levels</strong> ' +
            'thanks to <strong>effective resource pooling</strong>;</li>' +
            '   <li><strong>facilitating the use</strong> and transfer of resources and <strong>tools</strong> set up within <strong>public laboratories</strong> to <strong>industrial partners</strong>, ' +
            'notably SMEs which often cannot develop such resources and tools for language processing given the cost of investment ;</li>' +
            '   <li><strong>promoting French language and the regional languages of France</strong> by sharing expertise acquired by public laboratories.</li>' +
            '</ul>',
            PROJET: '<p>ORTOLANG is a service <strong>for the language</strong>, which is complementary to the service offered by <a href="http://www.huma-num.fr/" target="_Blank">Huma-Num</a> ' +
            '(très grande infrastructure de recherche).</p>' +
            '<p>More <a href="/#/presentation" title="Présentation de Ortolang">about this project…</a></p>',
            INNOVATIVE_SHS: 'Meet ORTOLANG at the 2nd conference  of the exposition "Innovatives SHS de l\'INSHS"',
            NEWSLETTERS: 'Newsletters',
            FIRST_NEWSLETTER: 'ORTOLANG first newsletter',
            TITLE_PRESENTATION: 'Presentation',
            PRESENTATION: '<p>ORTOLANG is an <strong>EQUIPEX project</strong> accepted in February 2012 in the framework of  <a href="http://investissement-avenir.gouvernement.fr/" target="_BLANK">' +
            'investissements d’avenir</a>. Its aim is to construct a network infrastructure including a repository of <strong>language data</strong> (corpora, lexicons, dictionaries etc.) and ' +
            '<strong>readily available</strong>, well-documented <strong>tools</strong> for its processing. Expected outcomes comprize: </p>' +
            '<ul>' +
            '   <li>promoting research on analysis, <strong>modelling</strong> and <strong>automatic processing</strong> of our language to their <strong>highest international levels</strong> ' +
            'thanks to <strong>effective resource pooling</strong>;</li>' +
            '   <li><strong>facilitating the use</strong> and transfer of resources and <strong>tools</strong> set up within <strong>public laboratories</strong> to <strong>industrial ' +
            'partners</strong>, notably SMEs which often cannot develop such resources and tools for language processing given the cost of investment ;</li>' +
            '   <li><strong>promoting French language and the regional languages of France</strong> by sharing expertise acquired by public laboratories.</li>' +
            '</ul>' +
            '<p>ORTOLANG is a service <strong>for the language</strong>, which is complementary to the service offered by <a href="http://www.huma-num.fr/" target="_Blank">Huma-Num</a> ' +
            '(très grande infrastructure de recherche).</p>',
            OBJECTIFS: '<h2 id="Objectifs">Objectives</h2>' +
            '<hr>' +
            '<p>ORTOLANG’s objective is to <strong>extend</strong> and <strong>preserve</strong> the endeavours of digital resource centres dealing with language :</p>' +
            '<ul>' +
            '   <li><a target="_blank" href="http://www.cnrtl.fr/">CNRTL</a> (Centre National de Ressources Textuelles et Lexicales)</li>' +
            '   <li><a target="_blank" href="http://sldr.org/">SLDR</a> (Speech and Language Data Repository)</li>' +
            '</ul>' +
            '<p>ORTOLANG is also aiming at offering</p>' +
            '<ul>' +
            '   <li>a <strong>technical platform</strong> on written and oral language, in support of coordination actions by <a target="_blank" href="http://www.huma-num.fr/">' +
            'TGIR Huma-Num</a>;</li>' +
            '   <li><strong>scientific equipment</strong> compliant with initiatives by DGLFLF and BNF on <strong>culture-heritage aspects</strong> of languages spoken in France;</li>' +
            '   <li>a French node of <a target="_blank" href="http://www.clarin.eu/">CLARIN</a> (Common Language Resources and Technology Infrastructure)</li>' +
            '</ul>',
            FONCTIONS: '<h2 id="Fonctions">Functions</h2>' +
            '<hr>' +
            '<h4>Identification/preparation of data :</h4>' +
            '<ul>' +
            '   <li><strong>cataloging</strong> existing resources and tools using sets of <strong>standardised metadata</strong> ;</li>' +
            '   <li><strong>controlling</strong> and <strong>validating</strong> resources and tools: assisting authors on <strong>standards</strong>, norms and current international recommendations: ' +
            'XML, TEI, LMF, MAF and SYNAF ;</li>' +
            '   <li><b>upgrading</b> of resources and tools.</li>' +
            '</ul>' +
            '<h4>Archiving:</h4>' +
            '<ul>' +
            '   <li><strong>storage</strong>, maintenance and curation of resources and tools ;</li>' +
            '   <li><strong>long-term preservation</strong> using the framework of <a target="_blank"  href="http://www.huma-num.fr/">TGIR Huma-Num</a> in connection with ' +
            '<a target="_blank"  href="http://www.cines.fr/">CINES</a>.</li>' +
            '</ul>' +
            '<h4>Dissemination :</h4>' +
            '<ul>' +
            '   <li><b>assistance</b> et <b>support</b> to users and installing procedures that will make it possible for them to <strong>take advantage</strong> of shared resources and tools ' +
            'regardless of their localisation and spatial location.</li>' +
            '</ul>',
            COMPETENCIES: '<h2 id="Comptences_runies">Complementary competencies</h2>' +
            '<hr>' +
            '<p>In order to achieve this, we have chosen to call for complementary competencies in our consortium with respect to: </p>' +
            '<ul>' +
            '   <li><strong>language sciences</strong> with <a target="_blank"  href="http://www.atilf.fr/">ATILF</a>, ' +
            '<a target="_blank"  href="http://www.lpl-aix.fr/">LPL</a>, <a target="_blank"  href="http://www.modyco.fr/">MoDyCo</a> and ' +
            '<a target="_blank"  href="http://www.lll.cnrs.fr/">LLL</a> ;</li>' +
            '   <li><strong>computer science</strong> with <a target="_blank"  href="http://www.loria.fr/">LORIA</a> and ' +
            '<a target="_blank"  href="http://www.inist.fr/">INIST</a> but also partly <a target="_blank"  href="http://www.atilf.fr/">ATILF</a> and ' +
            '<a target="_blank"  href="http://www.lpl-aix.fr/">LPL</a> ;</li>' +
            '   <li><strong>database</strong> and access to scientific information through <a target="_blank"  href="http://www.inist.fr/">INIST</a>, and linguistic resources with ' +
            'the two resource centres : <a target="_blank"  href="http://www.cnrtl.fr/">CNRTL</a> and <a target="_blank"  href="http://sldr.org/">SLDR</a>.</li>' +
            '</ul>' +
            '<p>Beyond bringing <strong>together</strong> these different disciplinary competencies, ORTOLANG’s objective is to <strong>federate</strong> partners covering the ' +
            '<strong>diversity</strong> of approaches to the study of language for its equipment of shared resources and tools :</p>' +
            '<ul>' +
            '   <li>linguistic modelling (<a target="_blank"  href="http://www.modyco.fr/">MoDyCo</a>, <a target="_blank"  href="http://www.lpl-aix.fr/">LPL</a> ' +
            'and <a target="_blank"  href="http://www.atilf.fr/">ATILF</a>),</li>' +
            '   <li>experimental linguistics (<a target="_blank"  href="http://www.lpl-aix.fr/">LPL</a>, <a target="_blank"  href="http://www.atilf.fr/">ATILF</a>),' +
            '</li>' +
            '   <li>language production and perceptio (<a target="_blank"  href="http://www.lpl-aix.fr/">LPL</a>, ' +
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
            TITLE_LEGAL_INFORMATIONS: 'Legal notices',
            TITLE_COMMUNITY: 'Community development site',
            TITLE_CONTACT: 'Contact'
        }
    });
