console.log('creemson.js to the rescue');

/**
 *
 */
function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        
        reader.onload = function (e) {
            $('#preview_img').attr('src', e.target.result);
        }
        
        reader.readAsDataURL(input.files[0]);
    }
}

$(".fileUploader").change(function(){
    readURL(this);
});

/**
 * Confirm delete
 */
$('form .btn-danger').click(function(e){
    var r = confirm("Confirm delete");
    
    if (r == true)
    {    
        return true;
    }
    else
    {
        e.preventDefault();
    }
});


/**
 * Add Oeuvre to the trending list
 */
$('.trends').click(function(){
    var id = $(this).attr('dataInt');
    console.log(id);
    $.ajax({
        url: Routing.generate('oeuvre_index'),
        type:'POST',
        data:'trends=true'+'&oeuvre_id='+id,
        success: function(state){
            //console.log(state);
            //location.reload();
        }
    })
});

/**
 * Approve Oeuvre
 */
$('.approve').click(function(){
    var id = $(this).attr('dataInt');
    console.log(id);
    $.ajax({
        url: Routing.generate('oeuvre_index'),
        type:'POST',
        data:'approve=true'+'&oeuvre_id='+id,
        success: function(state){
            //console.log(state);
            //location.reload();
        }
    })
});

$( function() {
    // sort the links
    var sortList = $('#sortable');
    //var animation = $( '#loading-animation' );
    var pageTitle = $( 'h1' );
    sortList.sortable({
        update: function( event, ui ) {
        //animation.show();
        var data = sortList.sortable( 'toArray' );
        console.log(data);
        $.ajax({
            url: Routing.generate('menu_show')+'/'+1,
            //url: Routing.generate('menu_show'),
            type:'POST',
            data:'sortList='+data,
            success: function(response){
                console.log('success');
                //animation.hide();
                pageTitle.after('success');
            },
            error: function(error){
                console.log('error');
                //animation.hide();
                pageTitle.after('error');

            }
        })
        //Dropped();

      }
    });
    //$( "#sortable" ).disableSelection();
});

function Dropped(event, ui){
    /*$("#sortable tr").each(function(){
        //var p = $(this).position();
        console.log($(this).attr('data_link_id'));

    });*/
    $.ajax({
        url: Routing.generate('menu_show'),
        type:'POST',
        data:'sortList='+id,
        success: function(state){
            //console.log(state);
            location.reload();
        }
    })
  //refresh();
}