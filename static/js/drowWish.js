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
function GetWishes(_page) {

    var _offset = (_page - 1) * 2;

    $.ajax({
        url: '/getWish',
        type: 'POST',
        data: {
            offset: _offset
        },
        success: function(res) {
            var itemsPerPage = 2
            var wishObj = JSON.parse(res);

            $('#ulist').empty();
            $('#listTemplate').tmpl(wishObj[0]).appendTo('#ulist');

            var total = wishObj[1]['total'];
            var pageCount = total/itemsPerPage;

            var pageRem = total % itemsPerPage;
            if(pageRem !=0 ){
                pageCount = Math.floor(pageCount)+1;
            }

            $('.pagination').empty();

 			var pageStart = $('#hdnStart').val();
			var pageEnd = $('#hdnEnd').val();

            if (pageStart > 5) {
                var aPrev = $('<a/>').attr({
                        'href': '#'
                    }, {
                        'aria-label': 'Previous'
                    })
                    .append($('<span/>').attr('aria-hidden', 'true').html('&laquo;'));

                $(aPrev).click(function() {
                    $('#hdnStart').val(Number(pageStart) - 5);
                    $('#hdnEnd').val(Number(pageStart) - 5 + 4);
                    GetWishes(Number(pageStart) - 5);
                });

                var prevLink = $('<li/>').append(aPrev);
                $('.pagination').append(prevLink);
            }

            for (var i = Number(pageStart); i <= Number(pageEnd); i++) {
                if (i > pageCount) {
                    break;
                }

                var aPage = $('<a/>').attr('href', '#').text(i);

                // Attach the page click event
                $(aPage).click(function(i) {
                    return function() {
                        GetWishes(i);
                    }
                }(i));

                var page = $('<li/>').append(aPage);

                // Attach the active page class
                if ((_page) == i) {
                    $(page).attr('class', 'active');
                }

                $('.pagination').append(page);
            }

            if ((Number(pageStart) + 5) <= pageCount) {
                var nextLink = $('<li/>').append($('<a/>').attr({
                        'href': '#'
                    }, {
                        'aria-label': 'Next'
                    })
                    .append($('<span/>').attr('aria-hidden', 'true').html('&raquo;').click(function() {
                        $('#hdnStart').val(Number(pageStart) + 5);
                        $('#hdnEnd').val(Number(pageStart) + 5 + 4);
                        GetWishes(Number(pageStart) + 5);

                    })));
                $('.pagination').append(nextLink);
            }
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