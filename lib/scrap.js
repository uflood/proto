
var markers = [];

var directionsService = new gmaps.DirectionsService();
var directionsDisplay = new gmaps.DirectionsRenderer({map: basemap});


decoder = function(str, precision) {
    var index = 0,
        lat = 0,
        lng = 0,
        coordinates = [],
        shift = 0,
        result = 0,
        byte = null,
        latitude_change,
        longitude_change,
        factor = Math.pow(10, precision || 5);

    str = String(str);

    // Coordinates have variable length when encoded, so just keep
    // track of whether we've hit the end of the string. In each
    // loop iteration, a single coordinate is decoded.
    while (index < str.length) {

        // Reset shift, result, and byte
        byte = null;
        shift = 0;
        result = 0;

        do {
            byte = str.charCodeAt(index++) - 63;
            result |= (byte & 0x1f) << shift;
            shift += 5;
        } while (byte >= 0x20);

        latitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

        shift = result = 0;

        do {
            byte = str.charCodeAt(index++) - 63;
            result |= (byte & 0x1f) << shift;
            shift += 5;
        } while (byte >= 0x20);

        longitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

        lat += latitude_change;
        lng += longitude_change;

        coordinates.push([lat / factor, lng / factor]);
    }

    return coordinates;
};


gmaps.event.addListener(basemap, "rightclick",function(event) {


    var pinColor = "FE7569";
    var pinImage = new gmaps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
        new gmaps.Size(21, 34),
        new gmaps.Point(0,0),
        new gmaps.Point(10, 34));
    var pinShadow = new gmaps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_shadow",
        new gmaps.Size(40, 37),
        new gmaps.Point(0, 0),
        new gmaps.Point(12, 35));

    $.each(markers, function(i, marker){
        marker.setMap(null)
    });

    markers = [];
    var routes = [];

    marker = new gmaps.Marker({
        position: event.latLng,
        map: basemap,
        draggable: true
    });

    markers.push(marker);

    var nearest = knn(gj).nearest(L.latLng(event.latLng['A'],event.latLng['F']), 1);

    $.each(nearest, function(i, data){

        var here = new gmaps.LatLng(data.lat, data.lon)

        var marker = new gmaps.Marker({
            position: here,
            icon: pinImage
        });

        marker.setMap(basemap);
        markers.push(marker);

        var

        if(prop['N'] != null){
            routes.push({
                loc: here,
                next: prop['N']
            })
        }

        if(prop['S'] != null){
            routes.push({
                loc: here,
                next: prop['S']
            })
        }

        if(prop['E'] != null){
            routes.push({
                loc: here,
                next: prop['E']
            })
        }

        if(prop['W'] != null){
            routes.push({
                loc: here,
                next: prop['W']
            })
        }


    });

    //@TODO Handle edge cases.

    console.log(routes);

    $.each(routes, function(i, route){



    });





    var request = {
        origin: event.latLng,
        destination: routes[0].loc,
        travelMode: gmaps.TravelMode.DRIVING,
        unitSystem: gmaps.UnitSystem.IMPERIAL,
        optimizeWaypoints: true,
        provideRouteAlternatives: false,
        avoidHighways: false,
        avoidTolls: false
    }

    directionsService.route(request, function(response, status) {
        if (status == gmaps.DirectionsStatus.OK) {
            // directionsDisplay.setDirections(response);
        }

        // console.log(decoder(response['routes'][0]['overview_polyline']));
        console.log(response)

    });



});
