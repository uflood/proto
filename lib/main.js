
require.config({
    paths: {
        'jquery': 'jquery-1.11.3.min'
    }
});


require(['gmaps', 'basemap', 'uflood'], function(gmaps, basemap, uflood) {


    var local = [];
    var markers = [];
    var ind = 0;
    var groutes = []

    var directionsService = new gmaps.DirectionsService();
    var directionsDisplay = new gmaps.DirectionsRenderer({map: basemap});

    alert("Instructions: \n   1. Right-click to place starting point. \n   2. Press 'a' to see an alternate route.");

    gmaps.event.addListener(basemap, "rightclick",function(event) {

        $.each(markers, function(i, marker){
            marker.setMap(null);
        });

        local = uflood.local(event, 5);

        //markers = [];
        //
        //if(local.length > 0){
        //    $.each(local[i]['r'], function(i, data){
        //
        //        var mark = new gmaps.Marker({
        //            position: data
        //        });
        //
        //       // mark.setMap(basemap);
        //        markers.push(mark);
        //
        //    })
        //
        //    $.each(markers, function(i, marker){
        //       marker.setMap(basemap);
        //    });
        //}
        //
        //i = 1;

        groutes = [];

        function compare(a,b) {
            if (a.d < b.d)
                return -1;
            if (a.d > b.d)
                return 1;
            return 0;
        }


        for(i = 0; i < local.length; i++){
            if (i < 5){
                var waypoints = []

                for(j = 1; j < local[i].r.length - 1; j++){
                    waypoints.push({location: local[i].r[j], stopover: false})
                }


                var request = {
                    origin: local[i].r[0],
                    destination: local[i].r[local[i].r.length - 1],
                    travelMode: gmaps.TravelMode.DRIVING,
                    unitSystem: gmaps.UnitSystem.IMPERIAL,
                    waypoints: waypoints,
                    optimizeWaypoints: true,
                    provideRouteAlternatives: true,
                    avoidHighways: false,
                    avoidTolls: false
                };

                directionsService.route(request, function(response, status){
                    groutes.push({response: response, status: status, d: response.routes[0].legs[0].distance.value});
                    if((groutes.length == local.length) || (groutes.length > 4)){
                        groutes.sort(compare);

                        if(groutes[0].status == gmaps.DirectionsStatus.OK){
                            directionsDisplay.setDirections(groutes[0].response);
                            console.log("Distance: " + groutes[0].d + " meters.")
                            ind++;
                        }
                    }
                });
            }
        }


    });


    window.addEventListener( "keypress", function(e){
        console.log(e)
        if(e.keyCode == 97){

            if(groutes.length == 0){
                alert("Right-click to select a start location.")
            } else {

                if( ind > groutes.length-1){
                    ind = 0;
                }

                if(groutes[ind].status == gmaps.DirectionsStatus.OK){
                    directionsDisplay.setDirections(groutes[ind].response);
                    console.log("Distance: " + groutes[ind].d + " meters.")
                }

                ind++;
            }



        }

    }, false );



    //gmaps.event.addListener(basemap, "click",function(event) {
    //
    //    //console.log(i)
    //    //console.log(local.length)
    //    //if(i >= local.length){
    //    //    i = 0;
    //    //}
    //    //
    //    //$.each(markers, function(i, marker){
    //    //    marker.setMap(null);
    //    //});
    //    //
    //    //markers = [];
    //    //
    //    //if(local.length > 0) {
    //    //
    //    //    $.each(local[i]['r'], function (i, data) {
    //    //
    //    //        var mark = new gmaps.Marker({
    //    //            position: data
    //    //        });
    //    //
    //    //        // mark.setMap(basemap);
    //    //        markers.push(mark);
    //    //
    //    //    })
    //    //
    //    //    $.each(markers, function (i, marker) {
    //    //        marker.setMap(basemap);
    //    //    });
    //    //}
    //    //
    //    //i++;
    //
    //
    //
    //
    //});

        console.log("done");
});
