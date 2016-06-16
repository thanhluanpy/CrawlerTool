$(document).ready(function () {


    var link = 'https://map.coccoc.com/map';
    var no = 0;
    $.ajax({
        type: 'GET',
        headers: {
            CacheControl: 'max-age=0',
            UpgradeInsecureRequests: 1,
            Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp',
            AcceptEncoding: 'gzip, deflate, sdch, br',
            AcceptLanguage: 'en-US,en;q=0.8',
            credentials: false
        },
        url: link,
        contentType: "application/json",
        dataType: 'text/html',
        crossDomain: true,
        success: function (data) {

        },
        error: function (err) {
            $('#select-city').empty().append($($.parseHTML($($.parseHTML(err.responseText)).filter("#searchbox-template").html())).find('select'));
            $('#select-city select').addClass('btn btn-default');
            $('#select-city select').off('change').on('change', function () {
                var selected = $(this).find('option:selected');
                loadGasStationDetail(selected);
            });
        }
    });

    loadGasStationDetail($('#select-city select').find('option:selected'));
});

function loadGasStationDetail() {

    if ($('#category option:selected').val() == -1) {
        alert("Category is required");
        return false;
    }
    var category = $('#category option:selected').val();
    var boder = $('#select-city select').find('option:selected').data('borders');
    var url = 'https://map.coccoc.com/map/search.json?query=' + category + '&borders=' + boder;

    $.ajax({
        type: 'GET',
        headers: {
            CacheControl: 'max-age=0',
            UpgradeInsecureRequests: 1,
            Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp',
            AcceptEncoding: 'gzip, deflate, sdch, br',
            AcceptLanguage: 'en-US,en;q=0.8'
        },
        url: url,
        contentType: "application/json",
        dataType: 'json',
        crossDomain: true,
        success: function (data) {
            if (data != undefined) {

                var selected = $('#select-city select').find('option:selected').data('borders').split(',');


                var boundMap = createBound(selected[0], selected[1], selected[2], selected[3]);
                // reset bound 
                console.log(boundMap);
                var dataFilter = isPointsInBounds(boundMap, data);
                console.log(dataFilter.length);




                var detailNo = 0;
                $(dataFilter).each(function () {
                    $('#list-gas-station').empty();
                    var idData = $(this).attr('hash');
                    var detailInfoUrl = 'https://map.coccoc.com/map/poidata.json?id=' + idData + '&full=true';
                    $.ajax({
                        type: 'GET',
                        headers: {
                            CacheControl: 'max-age=0',
                            UpgradeInsecureRequests: 1,
                            Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp',
                            AcceptEncoding: 'gzip, deflate, sdch, br',
                            AcceptLanguage: 'en-US,en;q=0.8'
                        },
                        url: detailInfoUrl,
                        contentType: "application/json",
                        dataType: 'json',
                        crossDomain: true,
                        success: function (detailInfo) {
                            detailNo = detailNo + 1;

                            //console.log(detailInfo);
                            $('#list-gas-station').append('<tr><td>' + detailNo + '</td><td>' + detailInfo.title + '</td><td>' + detailInfo.address + '</td><td>' + detailInfo.category + '</td></tr>');

                        },
                        error: function (err) {

                            console.log('-----ERROR-----');
                        }
                    });

                });

            }



        },
        error: function (err) {

            console.log('-----ERROR Get detail info gas station-----');
        }
    });

}

// e is lat long bound
// t is list latlong need check 
function isPointsInBounds(boundOfCity, listLatLongCheck) {
    var lstResult = [];
    $.each(listLatLongCheck, function (t, i) {
        var result = boundOfCity.contains(convertArrayToLatLng(i));
        if (result) {
            lstResult.push(i);
        }
    });
    return lstResult;
};
// boder 10.67357111111100,106.49169416667000, 10.89762100000000,106.83174100000000  >> e
function createBound(e, t, n, i) {
    return new google.maps.LatLngBounds(new google.maps.LatLng(e, t), new google.maps.LatLng(n, i));
};
function convertArrayToLatLng(e) {
    return new google.maps.LatLng(e.gps.latitude, e.gps.longitude);
};