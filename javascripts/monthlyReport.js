$(function() {

    //marking the current menu option
    $('.option').eq(1).css({color: '#12476f'});
    
    //edit/delete options
    $('tbody tr').on('click', function() {
        $('.edit-wrapper').fadeIn(1000);
        $('.dayID').val($(this).find('td').eq(0).text());
        $('#hourly-wage').val($(this).find('td').eq(1).text());
        $('#is-break').val($(this).find('td').eq(2).text());
        $('#day').val($(this).find('td').eq(3).text());
        $('#logon').val($(this).find('td').eq(4).text());
        $('#exiting').val($(this).find('td').eq(5).text());
        $('.year').val($('#year').val());
        $('.month').val($('#month').val());
        setMonthDays();
    });
    $('.edit img').on('click', function() {
        $('.edit-wrapper').fadeOut(700);
    });


    //set max day per month
    function setMonthDays () {
        var currentMounth = $('#month').val();
        var currentYear = $('#year').val();
        var days;
        switch(currentMounth) {
        case '1':
            days = 31;
            break;
        case '2':
            if ((((currentYear % 4) == 0) && ((currentYear % 100) != 0 )) || (((currentYear % 100) == 0) && ((currentYear % 400) == 0 ))) {
                days = 29;
            } else {
                days = 28;
            }
            break;
        case '3':
            days = 31;
            break;
        case '4':
            days = 30;
            break;
        case '5':
        days = 31;
            break;
        case '6':
            days = 30;
            break;
        case '7':
            days = 31;
            break;
        case '8':
            days = 31;
            break;
        case '9':
            days = 30;
            break;
        case '10':
            days = 31;
            break;
        case '11':
            days = 30;
            break;
        case '12':
            days = 31;
            break;
        }
        $('#day').attr('max', days);   
    }
    
});