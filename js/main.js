function showInfo(){}
// Turn showInfo() into global function //

$(document).ready(function(e){
    $('#js-select').on('change', function(e){
    e.preventDefault();
    $('.content').show();
    $('#js-tbody').html();
    jsContent = $('#js-content').offset().top;
    
    //Ajax get JSON data
    $.ajax({
        type: 'GET',
        url: 'https://tcgbusfs.blob.core.windows.net/blobfs/GetDisasterSummary.json',
        success: function(data){
            thisData = data.DataSet['diffgr:diffgram'].NewDataSet.CASE_SUMMARY;
            infowindow = new google.maps.Infowindow();
            var map;
            var marker = []; 
            //Check select value , then CREATE initMap//
            for (i=0; i < thisData.length; i++) {
                if($('#js-select').val() === thisData[i].CaseLocationDistrict){
                            area = thisData[i].CaseLocationDistrict;
                            address = thisData[i].CaseLocationDescription;
                            description = thisData[i].CaseDescription;
                            name = thisData[i].PName;
                            caseTime = thisData[i].CaseTime;
                            caseSN = thisData[i].CaseSN;
                            // map, and maker is a aray
                            onclickJs = "showInfo(map, maker[" + i +"])";
                            // **** result setting ****
                            //    When Users click map-markerIcon,
                            //   then touch onclickJs showInfo function.
                            result = '<tr><td>' + caseTime + '</td><td><span class="btn btn-xs bg-primary">' + area + '</span></td>\
                            <td><a href="#'+caseSN+'"onClick="' + onclickJs + '" style="cursor="pointer;"><span class="glyphicon-map-marker"></span></a></td>\
        <td>' + description + '</td></tr>';
                    //Search Area Infomation
                    if($('#js-select').val() === area) {
                        $('#js-tbody').append(result);
                        $('label').text('');
                            // Add data[i] into New Markers
                            marker[i] = new google.maps.Marker({
                                position: 
                                new google.maps.LatLng(thisData[i].Wgs84Y,thisData[i].Wgs84X),
                                map: map,
                                title: name, address, caseSN
                            });
                        //Open infoWindow EVENT
                        google.maps.event.addListener(marker[i], 'click', function(){
                            showInfo(map, this);
                            // this is mean Marker title
                        }); // End of area addListerer
                    } // End of Area Search
                    // Search All info
                    else if ($('#js-select').val() === '全區') {
                        var allArea = '全區最新動態';
                        $('#js-tbody').append(result);
                        $('label').text(allArea);
                        marker[i] = new google.maps.Marker({
                            position = new google.maps.LatLng(thisData[i].Wgs84Y, thisData[i].Wgs84X),
                            map: map,
                            title: name, address, caseSN
                        }); // End of data into marker[i]
                        google.maps.event.addListener(marker[i], 'click' function(){
                            showInfo(map, this);
                        }); // End of area AddListener
                    }; // End of else if
                    
                        // Setting showInfo function
                        showInfo = function(mapObj, makerObj) {
                            infowindow.setContent(infoContent(markerObj));
                            infowindow.open(mapObj, makerObj);
                            $('html, body').animate({
                                scrollTop: jsContent
                            }, 350);
                        } // End of showInfo function
                        // Setting infoContent function
                        var infoContent = function(markerObj) {
                            html = '<ul id="' + markerObj.caseSN + '" style="list-style:none"><li>名稱：' + markerObj.title + '</li>';
                            html += '<li>詳細位置：' + markerObj.address + '</li></ul>';
                            return html;
                        } // End of infoContent
                } // End of for loop
            } // End of success
        }
    }); // End of $.ajax
    // Window scroll event
    $(window).scroll(function(){
        var top = $(window).scrollTop();
        if (top> (jsContent-20)){
            $('.gotop').stop().fadeIn(200);
            $('.select').css({
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100%',
                height: '70px',
                background: '#222'
            });
        } else {
            $('.gotop').stop().fadeOut(100);
            $('.select').css({
                position: 'static',
                background: 'transpartent'
            });
        }
    }); // End of window scroll
    }); // End of onChange Event
}); // End of document.ready
