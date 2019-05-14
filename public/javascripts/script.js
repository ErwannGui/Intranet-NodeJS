/* ----- EVENTS MATERIALIZE ----- */

$(document).ready(function(){

    $('.sidenav').sidenav();
    $('.tabs').tabs();
    $('.collapsible').collapsible();

    $('.collapsible-header').click(function(){
        var collapsible = $(this).parent();
        if(!$('iframe', collapsible).length) {
            $('.collapsible-body', collapsible).html('<iframe id="sample-dashboard"\n' +
                '                      title="Graphs samples"\n' +
                '                      scrolling="no"\n' +
                '                      height="850"\n' +
                '                      src="/assets/charts/custom/realtime/index.html">\n' +
                '              </iframe>');
        }
    });

});