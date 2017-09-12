$(function() {
    
    //add a new account slide down
    $('.login p').on('click', function() {
        $('.new-account').slideToggle(700);
    });

    //check if create-account should be display
    var status = $('#message').text();
    if(status == "email already exist" || status == "please insert valid email and password") {
        $('.new-account').show();
    }

});