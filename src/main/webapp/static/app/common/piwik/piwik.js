'use strict';

if (OrtolangConfig.piwikHost && OrtolangConfig.piwikHost !== '' && OrtolangConfig.piwikSiteId) {
    //noinspection JSUnusedAssignment
    var _paq = _paq || [];
    _paq.push([function() {
        var self = this;
        function getOriginalVisitorCookieTimeout() {
            var now = new Date(),
                nowTs = Math.round(now.getTime() / 1000),
                visitorInfo = self.getVisitorInfo();
            var createTs = parseInt(visitorInfo[2]);
            var cookieTimeout = 33696000; // 13 months in seconds
            return createTs + cookieTimeout - nowTs;
        }
        this.setVisitorCookieTimeout(getOriginalVisitorCookieTimeout());
    }]);
    _paq.push(['enableLinkTracking']);
    (function() {
        var u= '//' + OrtolangConfig.piwikHost;
        _paq.push(['setTrackerUrl', u+'piwik.php']);
        _paq.push(['setSiteId', OrtolangConfig.piwikSiteId]);
        var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
        g.type='text/javascript'; g.async=true; g.defer=true; g.src=u+'piwik.js'; s.parentNode.insertBefore(g,s);
    })();
}
