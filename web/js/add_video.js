console.log('creemson.js to the rescue');

/**
 * Add Oeuvre to the trending list
 */
$('#btnAddVideo').click(function(){
    var iframe = $('textarea#iframe').val();
    console.log(iframe);
    $.ajax({
        url: Routing.generate('add_video'),
        type:'POST',
        data:'iframe='+iframe,
        success: function(state){
            console.log(state);
            //location.reload();
        }
    })
});