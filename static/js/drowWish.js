$(function() {
    $.ajax({
        url: '/getWish',
        type: 'GET',
        success: function(res) {

            // Parse the JSON response
            var wishObj = JSON.parse(res);

            // Append to the template
            $('#listTemplate').tmpl(wishObj).appendTo('#ulist');
        },
        error: function(error) {
            console.log(error);
        }
    });
    
    function Edit(elm) {
        $.ajax({
            url: '/getWishById',
            data: {
                id: $(elm).attr('data-id')
            },
            type: 'POST',
            success: function(res) {
                console.log(res);
            },
            error: function(error) {
                console.log(error);
            }
        });
}
});