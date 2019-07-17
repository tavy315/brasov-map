var streets = [
    {
        'id'  : '2',
        'data': '2 camere, confort 1, vagon'
    }, {
        'id'  : '4',
        'data': '2 camere, confort 1, vagon'
    }, {
        'id'  : '6',
        'data': '2 camere, confort 1, semidecomandate'
    }, {
        'id'  : '8',
        'data': '2 camere, confort 1, vagon'
    }, {
        'id'  : '10',
        'data': '2 camere, confort 1, vagon'
    }, {
        'id'  : '12',
        'data': '2 camere, confort 1, semidecomandate'
    }, {
        'id'  : '14',
        'data': '2 camere, confort 1, vagon'
    }, {
        'id'  : '16',
        'data': '2 camere, confort 1, vagon'
    }, {
        'id'  : '18',
        'data': '2 camere, confort 1, semidecomandate'
    }, {
        'id'  : '20',
        'data': '2 camere, confort 1, vagon'
    }, {
        'id'  : '22',
        'data': '2 camere, confort 1, vagon'
    }, {
        'id'  : '26',
        'data': '2 camere, confort 1, vagon'
    }, {
        'id'  : '28',
        'data': '2 camere, confort 1, vagon'
    }, {
        'id'  : '30',
        'data': '2 camere, confort 1, vagon'
    }, {
        'id'  : '36',
        'data': '2 camere, confort 2, semidecomandate'
    }, {
        'id'  : '38',
        'data': '2 camere, confort 2, semidecomandate'
    }];
$(document).ready(function () {
    $('#streetInfo').select2({
        escapeMarkup     : function (markup) {
            return markup;
        },
        matcher          : mapMatcher,
        templateSelection: formatStreetItem
    }).on('change', function (e) {
        doMap($('#brasov').val() + ' ' + $(this).find(':selected').text());
        var streetId = $(this).val();
        var result = $.grep(streets, function (event) {
            return event['id'] == streetId;
        });
        if (result.length === 0) {
            $('#infoDiv').html('');
        } else {
            $('#infoDiv').html(result[0]['data']);
        }
    });
    $('#brasov').select2({
        escapeMarkup     : function (markup) {
            return markup;
        },
        matcher          : mapMatcher,
        templateSelection: formatMapItem
    }).on('change', function (e) {
        if ($(this).val() == 'Bulevardul Saturn') {
            $('#streetSelect').show();
        } else {
            $('#streetSelect').hide();
        }
        doMap($(this).val());
    });
    $('#mapDiv').append('<iframe id="map" width="100%" height="450" frameborder="0" src=""></iframe>');

    $('#select2-streetInfo-container').parents('.select2').attr('id', 'streetSelect').hide();
    doMap('');
});

function doMap(street) {
    var apiKey = 'AIzaSyD2mckDIllK6wAg4dFEYSbAYTewdqfwaE0';
    var q = 'Brașov, România';
    if (street != '') {
        q = street + ', ' + q;
    }
    console.log('searching for ' + q);
    $('#map').attr('src', 'https://www.google.com/maps/embed/v1/search?key=' + apiKey + '&q=' + encodeURI(q));
//		$('#map').attr('src', 'https://www.google.com/maps/d/embed/v1/search?mid=zAFX5DUC8UCc.ko6SW56ei4AI&key=' + apiKey + '&q=' + encodeURI(q));
}

function formatMapItem(item) {
    var opt = $('#brasov').find(':selected');
    if (opt.text() == '') {
        return item.text;
    }
    var og = opt.closest('optgroup').attr('label');

    return '<strong style="color: #333">' + og + '</strong> ' + item.text;
}

function formatStreetItem(item) {
    var opt = $('#streetInfo').find(':selected');
    if (opt.text() == '') {
        return item.text;
    }
    var og = opt.closest('optgroup').attr('label');

    return '<strong style="color: #333">' + og + '</strong> ' + item.text;
}

function mapMatcher(params, data) {
    // Always return the object if there is nothing to compare
    if ($.trim(params.term) === '') {
        return data;
    }

    var original = data.text.toUpperCase();
    var term = params.term.toUpperCase();

    // Check if the text contains the term
    if (original.indexOf(term) > -1) {
        return data;
    }

    // Do a recursive check for options with children
    if (data.children && data.children.length > 0) {
        // Clone the data object if there are children
        // This is required as we modify the object to remove any non-matches
        var match = $.extend(true, {}, data);

        // Check each child of the option
        for (var c = data.children.length - 1; c >= 0; c--) {
            var child = data.children[c];

            var matches = mapMatcher(params, child);

            // If there wasn't a match, remove the object in the array
            if (matches == null) {
                match.children.splice(c, 1);
            }
        }

        // If any children matched, return the new object
        if (match.children.length > 0) {
            return match;
        }

        // If there were no matching children, check just the plain object
        return mapMatcher(params, match);
    }

    // If it doesn't contain the term, don't return anything
    return null;
}
