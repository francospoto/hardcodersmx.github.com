jQuery("document").ready(function($){

    var nav = $('ul.main-navigation');

    $(window).scroll(function () {
      console.log('kaka');
        if ($(this).scrollTop() > 388) {
            nav.addClass("f-nav");
        } else {
            nav.removeClass("f-nav");
        }
    });

});