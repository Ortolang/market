'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.PROFILE_EN
 * @description
 * # PROFILE_EN
 * Constant in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .constant('PROFILE_EN', {
        PROFILE: {
            EMPTY: 'empty',
            ADD_FRIEND: 'Add a co-worker',
            ADD_TO_FRIENDS: 'Add to my co-workers',
            ADDED_TO_FRIENDS: 'Added to my co-workers',
            REMOVE_FRIEND: 'Remove from co-workers',
            SEE_PUBLIC_PROFILE: 'See my public profile',
            NAV: {
                PERSONAL_INFOS: 'Personal informations',
                SETTINGS: 'Settings',
                ABOUT_ME: 'About me',
                IDENTIFIERS: 'External identifiers',
                EVENTS: 'Recent activity',
                PUBLICATIONS: 'Publications',
                CONTRIBUTIONS: 'Contributions',
                FRIENDS: 'Co-workers'
            },
            VISIBILITY: {
                LABEL: 'Field visibility: ',
                EVERYBODY: 'Public',
                FRIENDS: 'Co-workers only',
                NOBODY: 'Me only'
            },
            CIVILITY: {
                MISTER: 'M.',
                MISSUS: 'Mrs.'
            },
            FIELDS: {
                CIVILITY: 'Gender',
                TITLE: 'Professional title',
                GIVEN_NAME: 'First name',
                FAMILY_NAME: 'Family name',
                ORGANISATION: 'Institution',
                JOB: 'Profession or occupation',
                FIELD_OF_RESEARCH: 'Field of research',
                ADDRESS: 'Address',
                ADDRESS_ERROR: 'Please select an address from the list',
                WEBSITE: 'Personal website',
                EMAIL: 'Professional e-mail',
                RESCUE_EMAIL: 'Rescue e-mail',
                PROFESSIONAL_TEL: 'Professional phone',
                TEL: 'Personal phone',
                FAX: 'Fax',
                PRESENTATION: 'Describe yourself in a few words',
                IDHAL: 'HAL ID',
                ORCID: 'ORCID',
                VIAF: 'VIAF ID',
                MYIDREF: 'IdRef',
                LINKEDIN: 'Linkedin ID',
                VIADEO: 'Viadeo ID',
                LANGUAGE: 'Preferred interface language'
            },
            HELPER: {
                TITLE: 'Professional title: Dr., Prof., etc. ',
                IDHAL: 'HAL persistent identifiers: <a href="https://hal.archives-ouvertes.fr/page/mon-idhal" target="_blank">https://hal.archives-ouvertes.fr/</a>',
                ORCID: 'Persistent digital identifiers: <a href="http://orcid.org/" target="_blank">http://orcid.org/</a>.',
                VIAF: 'Persistent digital identifiers:  <a href="http://viaf.org/viaf/" target="_blank">http://viaf.org/viaf/</a>.',
                MYIDREF: 'Persistent digital identifiers:  <a href="http://www.idref.fr/" target="_blank">http://www.idref.fr/</a>.',
                LINKEDIN: 'Persistent digital identifiers:  <a href="http://www.linkedin.com/" target="_blank">http://www.linkedin.com/</a>.',
                VIADEO: 'Persistent digital identifiers:  <a href="http://www.viadeo.com/profile/" target="_blank">http://www.viadeo.com/profile/</a>.'
            },
            HAL: {
                RESULT_NUMBER: '<strong>{{number}} result{{number > 1 ? "s" : ""}}</strong> found out of',
                MORE_RESULT: 'See the {{number}} results',
                NO_ID: 'To display your publication list, please add your IdHal in "External identifiers".'
            },
            EDIT_AVATAR_MODAL: {
                TITLE: 'How to change your avatar?',
                BODY_START: 'ORTOLANG uses your Gravatar as your profile picture:',
                BODY_END: '<i>Your email address on ORTOLANG is <code>{{email}}</code></i>',
                NO_GRAVATAR: '<b>You don\'t have a Gravatar yet:</b> a unique random image is used. To use your own avatar or photo, simply <a href="https://fr.gravatar.com/" target="_blank">create a Gravatar account</a> and add an avatar for your email address',
                GRAVATAR: '<b>You already have a Gravatar account:</b> just <a href="https://fr.gravatar.com/emails" target="_blank">add/change the avatar linked to your email address</a>'
            },
            ADD_MEMBER_MODAL: {
                TITLE: 'Add a co-worker',
                SEARCH: 'Search a member',
                ADD: 'Add'
            }
        },
        TASKS: {
            TASK: 'Task',
            TASKS: 'Tasks',
            NO_TASK: 'No task',
            ASSIGNEE: 'Assignee',
            CLAIM: 'Claim',
            UNCLAIM: 'Un-claim',
            COMPLETE_TASK: 'Complete task',
            TASK_CREATED: 'a new task has been added',
            PUBLICATION: 'Publication of workspace "{{wsalias}}"',
            MODERATE: 'Moderate',
            REVIEW: 'Evaluate',
            REVIEWS: 'Evaluations',
            PUBLISH: 'Publication',
            REMAINING_DAYS: 'days remaining',
            SEE_WORKSPACE: 'See workspace',
            WS_TAG: 'Tag:',
            SNAPSHOT: 'Snapshot:',
            INITIER: 'Initiator:'
        }
    });
