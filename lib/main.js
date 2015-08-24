
require.config({
    paths: {
        'jquery': 'jquery-1.11.3.min'
    }
});


require(['gmaps', 'basemap', 'uflood'], function(gmaps, basemap, uflood) {


    var local = [];
    var markers = [];
    var i = 0;
    var groutes = []

    var directionsService = new gmaps.DirectionsService();
    var directionsDisplay = new gmaps.DirectionsRenderer({map: basemap});

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
                    console.log(response)
                    groutes.push({response: response, status: status, d: response.routes[0].legs[0].distance.value});
                });
            }
        }

        console.log(groutes)

        //var groutes = [];
        //
        //$.each(greturn, function(i, gret){
        //
        //    $.each(gret, function(j, route){
        //        groutes.push({r: gret, d: route.legs.distance.value})
        //    });
        //});

        function compare(a,b) {
            if (a.d < b.d)
                return -1;
            if (a.d > b.d)
                return 1;
            return 0;
        }

        groutes.sort(compare);

        if(groutes[i].status == gmaps.DirectionsStatus.OK){
            directionsDisplay.setDirections(groutes[i].response);
            console.log("Distance: " + groutes[i].d + " meters.")
        }
        
        i++;


    });




    gmaps.event.addListener(basemap, "click",function(event) {

        //console.log(i)
        //console.log(local.length)
        //if(i >= local.length){
        //    i = 0;
        //}
        //
        //$.each(markers, function(i, marker){
        //    marker.setMap(null);
        //});
        //
        //markers = [];
        //
        //if(local.length > 0) {
        //
        //    $.each(local[i]['r'], function (i, data) {
        //
        //        var mark = new gmaps.Marker({
        //            position: data
        //        });
        //
        //        // mark.setMap(basemap);
        //        markers.push(mark);
        //
        //    })
        //
        //    $.each(markers, function (i, marker) {
        //        marker.setMap(basemap);
        //    });
        //}
        //
        //i++;

        if( i > groutes.length-1){
            i = 0;
        }

        console.log(groutes[i])



        if(groutes[i].status == gmaps.DirectionsStatus.OK){
            directionsDisplay.setDirections(groutes[i].response);
            console.log("Distance: " + groutes[i].d + " meters.")
        }

        i++;



    });

        console.log("done");
});
