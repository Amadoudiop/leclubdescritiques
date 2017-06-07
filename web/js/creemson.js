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
