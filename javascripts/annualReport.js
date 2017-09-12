$(function() {

    //marking the current menu option
    $('.option').eq(2).css({color: '#12476f'});

    //marking table row when clicked
    $('tbody tr').on('click', function() {
        $(this).find('td').toggleClass('marking');
    });

});