$(function() {

    //label fade-in color animation
    $('#label').delay(500).animate({opacity: '0.7'}, 6000);

    //mobile-menu button
    $('header img').on('click', function() {
        $('.menu').slideToggle(700);
    });

});