
require.config({
    paths: {
        'jquery': 'jquery-1.11.3.min'
    }
});


require(['gmaps', 'basemap', 'uflood', 'display-routes', 'display-entrypoints', 'jquery'], function(gmaps, basemap, uflood, dr, ep, $) {





    var local = [];
    var markers = [];
    var ind = 0;
    var groutes = [];

    var directionsService = new gmaps.DirectionsService();
    var directionsDisplay = new gmaps.DirectionsRenderer({map: basemap});

    gmaps.event.addListener(basemap, "click",function(event) {

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
                            console.log(groutes[0]);
                            console.log("Distance: " + groutes[0].d + " meters.");
                            ind++;

                            $('#directions').html('');

                            var html = '<h4> Directions </h4><ul>';
                            $.each(groutes[0].response.routes[0].legs[0].steps, function(i, step){
                                html += '<li>' + step.instructions + '</li>';
                            });
                            html += '</ul>';
                            $('#directions').html(html);


                        }
                    }
                });
            }
        }


    });



    $(function(){


        $.fn.visible = function() {
            return this.css('visibility', 'visible');
        };

        $('#buttons').visible();

        $('#alt').click(function(){

            if( ind > groutes.length-1){
                ind = 0;
            }

            if(groutes[ind].status == gmaps.DirectionsStatus.OK){
                directionsDisplay.setDirections(groutes[ind].response);
                console.log("Distance: " + groutes[ind].d + " meters.")


                $('#directions').html('');

                var html = '<h4> Directions </h4><ul>';
                $.each(groutes[ind].response.routes[0].legs[0].steps, function(i, step){
                    html += '<li>' + step.instructions + '</li>';
                });
                html += '</ul>';
                $('#directions').html(html);

            }


            ind++;
        });

        $('#toggle-routes').click(function(){
            dr.toggle();
        });

        $("#toggle-entrypoints").click(function(){
            ep.toggle();
        });



    });





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
