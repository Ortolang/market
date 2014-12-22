$(function () {

//    $('#side-menu').metisMenu();

});

//Loads the correct sidebar on window load,
//collapses the sidebar on window resize.
// Sets the min-height of #page-wrapper to window size
$(function () {
    $(window).bind('load resize', function () {
        var topOffset = 50,
<<<<<<< HEAD:app/vendor/sb-admin-2.js
            width = (this.window.innerWidth > 0) ? this.window.innerWidth : this.screen.width,
            height = (this.window.innerHeight > 0) ? this.window.innerHeight : this.screen.height;

        if (width < 768) {
            $('div.navbar-collapse').addClass('collapse');
            topOffset = 100; // 2-row-menu
        } else {
            $('div.navbar-collapse').removeClass('collapse');
        }
=======
            //width = (this.window.innerWidth > 0) ? this.window.innerWidth : this.screen.width,
            height = (this.window.innerHeight > 0) ? this.window.innerHeight : this.screen.height;

        //if (width < 768) {
        //    $('div.navbar-collapse').addClass('collapse');
        //    topOffset = 100; // 2-row-menu
        //} else {
        //    $('div.navbar-collapse').removeClass('collapse');
        //}
>>>>>>> keycloak:src/main/webapp/static/app/scripts/sb-admin-2.js

        height = height - topOffset;
        if (height < 1) {
            height = 1;
        }
        if (height > topOffset) {
            $('#page-wrapper').css('min-height', height + 'px');
        }
    });
});
