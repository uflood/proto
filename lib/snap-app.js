
require.config({
    paths: {
        'jquery': 'jquery-1.11.3.min'
    }
});


require(['gmaps', 'basemap', 'routes', 'entrypoints', 'leaflet', 'knn', 'display-routes'], function(gmaps, basemap, r, ep, L, knn, routes) {


    var gj = L.geoJson(ep);

    var markers = [];


    gmaps.event.addListener(basemap, "rightclick",function(event) {

        $.each(markers, function(i, marker){
            marker.setMap(null)
        });

        markers = []

        marker = new google.maps.Marker({
            position: event.latLng,
            map: basemap,
            draggable: true
        });

        markers.push(marker);

       var nearest = knn(gj).nearest(L.latLng(event.latLng['A'],event.latLng['F']), 5);

        $.each(nearest, function(i, data){
            var marker = new gmaps.Marker({
                position: new gmaps.LatLng(data.lat, data.lon)
            });



            marker.setMap(basemap);

            markers.push(marker)

            console.log(data['layer']['feature']['properties']['id']);
        });

    });


    //$.each(nearest, function(i, data){
    //    var test = new gmaps.Marker({
    //        position: new gmaps.LatLng(data.lat, data.lon)
    //    });
    //
    //    test.setMap(basemap);
    //
    //    console.log(data['layer']['feature']['properties']['id']);
    //});



    console.log("done");
});