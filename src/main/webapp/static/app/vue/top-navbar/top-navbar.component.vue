<script>
import Vue from 'vue';
import avatarComponent from '../avatar/avatar.component';
import mobileNavButtonComponent from '../mobile-nav/mobile-nav-button.component'
import mobileNavSidebarComponent from '../mobile-nav/mobile-nav-sidebar.component'
import { store, mutations } from '../mobile-nav/store';
import explorerElements from './explorer-nav.constant';

export default Vue.component('top-navbar-component', {
    props: {
        authenticated: Boolean,
        // AngularJS Constant
        icons: Object,
        // AngularJS Services
        settings: Object,
        authservice: Object,
        user: Object,
        runtime: Object
    },
    data() {
        return {
            explorerElements: explorerElements.elements,
            explorerActiveClass: "",
            tasksSize: 0,
            isModerator: false,
            emailHash: "",
            fullname: "",
            aboutBaseUrl: OrtolangConfig.marketServerUrl,
            currentLocation: ""
        };
    },
    created() {
        let ctrl = this;
        this.authservice.sessionInitialized().then(function() {
            ctrl.tasksSize = ctrl.runtime.getTasks() == undefined ? 0 : ctrl.runtime.getTasks().length;
            ctrl.isModerator = ctrl.user.isModerator;
            ctrl.fullname = ctrl.user.fullName();
            ctrl.emailHash = ctrl.user.emailHash;
        });
        // When a browser action is a click on back or forward button
        window.addEventListener('popstate', () => {
            ctrl.currentLocation = document.location.pathname;
        });
        ctrl.currentLocation = document.location.pathname;
    },
    components: {
        'avatar-component': avatarComponent,
        'mobile-nav-button-component': mobileNavButtonComponent,
        'mobile-nav-sidebar-component': mobileNavSidebarComponent,
    },
    methods: {
        login: function() {
            this.authservice.login();
        },
        logout: function() {
            this.authservice.logout();
        },
        register: function () {
            this.authservice.register();
        },
        changeLanguage: function(lang) {
            // Set url parametter lang to ${lang}
            let urlParams = new URLSearchParams(location.search.substr(1));
            urlParams.set('lang', lang);
            history.replaceState(null, null, location.pathname + "?" + urlParams.toString());
            this.$emit('ask-language-change', lang);
            if (store.isNavOpen) {
                mutations.toggleNav();
            }
        },
        translate: function (key) {
            return this.$parent.$options.i18n.t(key);
        },
        isActiveLanguage(lang) {
            return this.settings.language == lang;
        },
        goTo() {
            if (store.isNavOpen) {
                mutations.toggleNav();
            }
        },
        select(element) {
            // Mobile explorer items
            if (this.explorerActiveClass !== element.class) {
                this.explorerActiveClass = element.class;
            }
            if (store.isNavOpen) {
                mutations.toggleNav();
            }
            // Standard explorer items
            this.currentLocation = element.path;
        },
        /**
         * Merges the path with the lang if it's specify.
         * @param element the element of the menu
         * @return the url path
         */
        path(element) {
            let urlParams = new URLSearchParams(location.search.substr(1));
            return element.path + (urlParams.get('lang') ? "?lang=" + urlParams.get('lang') : "");
        }
    }
})
</script>

<template>
    <nav class="navbar navbar-default navbar-static-top top-nav" role="navigation">
        <!-- Mobile navigation sidebar -->
        <mobile-nav-sidebar-component>
            <div class="aside aside-mobile-nav" tabindex="-1" role="dialog">
                <div class="aside-dialog">
                    <div class="aside-content">
                        <nav class="side-nav" role="navigation">
                            <ul class="side-nav-list">
                                <li v-if="authenticated" class="side-nav-list-item top-item">
                                    <a @click="goTo()" href="/profiles/me/edition">
                                        <span :class="icons.user" class="icon-container fa-2x"></span>
                                        <span class="item-description">{{ translate('NAV.PROFILE') }}</span>
                                    </a>
                                </li>
                                <li v-if="authenticated" class="side-nav-list-item top-item">
                                    <a @click="goTo()" href="/workspaces">
                                        <span class="icon-container fa fa-fw fa-cloud fa-2x"></span>
                                        <span class="item-description">{{ translate('NAV.WORKSPACES') }}</span>
                                    </a>
                                </li>
                                <li v-if="!authenticated" class="side-nav-list-item top-item">
                                    <a @click="login()">
                                        <span :class="icons.user" class="icon-container fa-2x"></span>
                                        <span class="item-description">{{ translate('NAV.LOG_IN') }}</span>
                                    </a>
                                </li>
                                <li class="side-nav-list-item language top-item">
                                    <a class="dropdown-toggle" data-toggle="dropdown">
                                        <span :class="icons.language" class="icon-container fa-2x"></span>
                                        <span class="item-description">{{ translate('NAV.LANGUAGE.LANGUAGE') }}</span>
                                    </a>
                                    <ul class="dropdown-menu">
                                        <li @click="changeLanguage('en')" class="language" :class="{active: isActiveLanguage('en')}"><div>{{ translate('NAV.LANGUAGE.ENGLISH') }}</div></li>
                                        <li @click="changeLanguage('fr')" class="language" :class="{active: isActiveLanguage('fr')}"><div>{{ translate('NAV.LANGUAGE.FRENCH') }}</div></li>
                                    </ul>
                                </li>
                                <li v-if="authenticated" class="side-nav-list-item top-item">
                                    <a @click="logout()">
                                        <span :class="icons.signOut" class="icon-container fa-2x"></span>
                                        <span class="item-description">{{ translate('NAV.LOG_OUT') }}</span>
                                    </a>
                                </li>
                                <li v-if="authenticated && isModerator" class="side-nav-list-item top-item tasks">
                                    <a @click="goTo()" href="/profiles/me/tasks">
                                        <span :class="icons.notifications" class="icon-container fa-2x"></span>
                                        <span class="item-description">
                                            <span>{{ translate('TASKS') }}</span>
                                            <span class="badge tasks">{{ tasksSize > 0 ? tasksSize : '' }}</span>
                                        </span>
                                    </a>
                                </li>
                                <li class="side-nav-list-item top-item-divider"><span></span></li>
                                <li v-for="element in explorerElements" v-bind:key="element.id" class="side-nav-list-item" :class="{divider: element.class === 'divider', active: element.class == explorerActiveClass}">
                                    <a v-if="element.class !== 'divider'"
                                        :href="element.path"
                                        @click="select(element.class)"
                                        :class="element.class">
                                        <span class="icon-container" :class="element.iconCss"></span>
                                        <span class="item-description">{{ translate(element.description) }}</span>
                                    </a>
                                    <span v-if="element.class === 'divider'"></span>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </mobile-nav-sidebar-component>
        <div class="container-fluid">
            <div class="navbar-header">
                <mobile-nav-button-component></mobile-nav-button-component>
                <a class="navbar-brand" :href="aboutBaseUrl">
                    <img class="ortolang-logo" height="28" width="53" alt="Logo ORTOLANG" src="../../assets/images/logo-ortolang-white.png"/>
                    <span>ORTOLANG</span>
                </a>
            </div>

            <ul class="nav navbar-nav navbar-left collapse navbar-collapse hidden-xs">
                <li class="dropdown">
                    <a class="dropdown-toggle" data-toggle="dropdown">
                        {{ translate('NAV.CATALOG') }} <span class="caret"></span>
                    </a>
                    <ul class="dropdown-menu">
                        <li v-for="element in explorerElements" v-bind:key="element.id" :class="{active: element.path == currentLocation}">
                            <a :href="path(element)" @click="select(element)">
                                <span :class="element.iconCss"></span> {{ translate(element.description) }}
                            </a>
                        </li>
                    </ul>
                </li>
                <li>
                    <a v-if="authenticated" href="/workspaces">{{ translate('NAV.WORKSPACES') }}</a>
                </li>
            </ul>
            <ul class="nav navbar-nav navbar-right collapse navbar-collapse hidden-xs">
                <li v-if="authenticated && isModerator">
                    <a href="/profiles/me/tasks">
                        <span :class="icons.notifications"></span><span class="badge tasks">{{ tasksSize > 0 ? tasksSize : ''}}</span>
                        <span class="hidden-description"> {{ translate('TASKS') }}</span>
                    </a>
                </li>
                <li>
                    <a :href="aboutBaseUrl + '/aide/'" target="_BLANK">
                        <span :class="['fa-fw', icons.question]"></span>
                        <span>{{ translate('NAV.HELP') }}</span>
                    </a>
                </li>
                 <li class="dropdown">
                    <a class="dropdown-toggle" data-toggle="dropdown">
                        <span :class="icons.language"></span>
                        <span>{{ translate('NAV.LANGUAGE.LANGUAGE') }}</span> <span class="caret"></span>
                    </a>
                    <ul class="dropdown-menu">
                        <li @click="changeLanguage('en')" class="language" :class="{active: isActiveLanguage('en')}"><div>{{ translate('NAV.LANGUAGE.ENGLISH') }}</div></li>
                        <li @click="changeLanguage('fr')" class="language" :class="{active: isActiveLanguage('fr')}"><div>{{ translate('NAV.LANGUAGE.FRENCH') }}</div></li>
                    </ul>
                </li>
                <li class="dropdown" v-if="authenticated">
                    <a class="dropdown-toggle" data-toggle="dropdown">
                        <avatar-component :email-hash="emailHash" :size="30" :img-classes="'img-circle top-profile-image profile-image'"></avatar-component>
                        <span>{{ fullname }}</span>  <span class="caret"></span>
                    </a>
                    <ul class="dropdown-menu">
                        <li><a href="/profiles/me/edition" ><span :class="[icons.user]"></span> {{ translate('NAV.PROFILE') }}</a></li>
                        <li @click="logout()"><div><span :class="[icons.signOut]"></span> {{ translate('NAV.LOG_OUT') }}</div></li>
                    </ul>
                </li>
                <li v-if="!authenticated"><a @click="login()"><span :class="[icons.user]"></span> {{ translate('NAV.LOG_IN') }}</a></li>
                <li v-if="!authenticated"><a @click="register()"> {{ translate('NAV.REGISTER') }}</a></li>
            </ul>
        </div>
    </nav>
</template>