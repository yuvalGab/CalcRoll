$(function() {

    //marking the current menu option
    $('header .option').eq(0).addClass('marked');

    //set date info
    var date, day, month, year, hour, minutes; 
    setInterval(function() { 
        date = new Date();
        day = checkValue(date.getDate());
        month = checkValue(date.getMonth() + 1);
        year = checkValue(date.getFullYear());
        hour = checkValue(date.getHours());
        minutes = checkValue(date.getMinutes());
        $('#date').text(day + "/" + month + '/' + year + " " + hour + ":" + minutes);
    }, 1000);

    //check in time parmeter less then 10
    function checkValue(val) {
        if (val < 10) {
            return "0" + val;
        } else {
            return val;
        }           
    }

    //set onload fields data;
    date = new Date();
    $('#year').val(date.getFullYear());
    $('#month').val(date.getMonth() + 1);
    $('#day').val(date.getDate());
    //local storage info
    var dataStorage = localStorage;
    var hourlyWage = JSON.parse(dataStorage.getItem('hourly-wage'));
    var isBreak = JSON.parse(dataStorage.getItem('is-break'));
    //check if hourly-wage or break time have benn changed 
    $('#hourly-wage').on('change', function() {
        dataStorage.setItem('hourly-wage', JSON.stringify($(this).val()));
    });
    $('#break').on('change', function() {
        dataStorage.setItem('is-break', JSON.stringify($(this).prop('checked')));
    });
    //print value of hourly-wage and break time onload
    $('#hourly-wage').val(hourlyWage);
    $('#break').prop('checked', isBreak);
    //set fix days per month
    $('#month').on('change', setMonthDays);
    setMonthDays();
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