$(function() {

    GetWishes();

    $('#btnUpdate').click(function() {
        $.ajax({
            url: '/updateWish',
            data: {
                title: $('#editTitle').val(),
                description: $('#editDescription').val(),
                id: localStorage.getItem('editId')
            },
            type: 'POST',
            success: function(res) {
                $('#editModal').modal('hide');
                // Re populate the grid
                GetWishes();
            },
            error: function(error) {
                console.log(error);
            }
        })
    });
});
function GetWishes() {
    $.ajax({
        url: '/getWish',
        type: 'GET',
        success: function(res) {
            var wishObj = JSON.parse(res);
            $('#ulist').empty();
            $('#listTemplate').tmpl(wishObj).appendTo('#ulist');
        },
        error: function(error) {
            console.log(error);
        }
    });
}

function Edit(elm) {
    localStorage.setItem('editId',$(elm).attr('data-id'));
    $.ajax({
        url: '/getWishById',
        data: {
            id: $(elm).attr('data-id')
        },
        type: 'POST',
        success: function(res) {
            // Parse the received JSON string
            var data = JSON.parse(res);

            //Populate the Pop up
            $('#editTitle').val(data[0]['Title']);
            $('#editDescription').val(data[0]['Description']);

            // Trigger the Pop Up
            $('#editModal').modal();
        },
        error: function(error) {
            console.log(error);
        }
    });
}

function ConfirmDelete(elem) {
    localStorage.setItem('deleteId', $(elem).attr('data-id'));
    $('#deleteModal').modal();
}

function Delete() {
    $.ajax({
        url: '/deleteWish',
        data: {
            id: localStorage.getItem('deleteId')
        },
        type: 'POST',
        success: function(res) {
            var result = JSON.parse(res);
            if (result.status == 'OK') {
                $('#deleteModal').modal('hide');
                GetWishes();
            } else {
                alert(result.status);
            }
        },
        error: function(error) {
            console.log(error);
        }
    });
}