///<reference path="../../../../../node_modules/@types/angular/index.d.ts"/>
///<reference path="../../../../../node_modules/@types/node/index.d.ts"/>

// Typings reference file, you can add your own global typings here
// https://www.typescriptlang.org/docs/handbook/writing-declaration-files.html

import IServiceProvider = angular.IServiceProvider;
import IRoute = angular.route.IRoute;
import IRouteProvider = angular.route.IRouteProvider;

declare var OrtolangConfig: any;

interface OrtolangRootScopeService extends ng.IRootScopeService {
    piwikIframeSrc: string,
    icons: any
}

interface OrtolangRoute extends IRoute {
    description?: string;
    title?: string;
    requiresAuthentication?: boolean;
}

interface OrtolangRouteProvider extends IRouteProvider {
    when(path: string, route: OrtolangRoute): OrtolangRouteProvider;
}
