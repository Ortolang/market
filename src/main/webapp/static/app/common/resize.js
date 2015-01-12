'use strict';

// Sets the min-height of #page-wrapper to window size
$(function () {
    $(window).bind('load resize', function () {
        var topOffset = 50,
            height = (this.window.innerHeight > 0) ? this.window.innerHeight : this.screen.height;

        height = height - topOffset;
        if (height < 1) {
            height = 1;
        }
        if (height > topOffset) {
            $('#page-wrapper').css('min-height', height + 'px');
        }
    });
});
