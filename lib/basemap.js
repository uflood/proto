define(['gmaps'], function(gmaps){

    //function getMap(position){
    //
    //}

    pos = new gmaps.LatLng(42.342204, -71.076277);

    var map = new gmaps.Map(document.getElementById('map-canvas'), {
        zoom: 15,
        center: pos,
        styles: [{
            "featureType":"landscape",
            "elementType":"labels",
            "stylers":[{
                "visibility":"off"}]},
            {"featureType":"transit",
                "elementType":"labels",
                "stylers":[{
                    "visibility":"off"}]},
            {"featureType":"poi",
                "elementType":"labels",
                "stylers":[{"visibility":"off"}]},
            {"featureType":"water",
                "elementType":"labels",
                "stylers":[{"visibility":"off"}]},
            {"featureType":"road",
                "elementType":"labels.icon",
                "stylers":[{"visibility":"off"}]},
            {"stylers":[{"hue":"#00aaff"},
                {"saturation":-100},{
                "gamma":2.15},
                {"lightness":12}]},
            {"featureType":"road",
                "elementType":"labels.text.fill",
                "stylers":[{"visibility":"on"},
                {"lightness":24}]},
            {"featureType":"road",
                "elementType":"geometry",
                "stylers":[{"lightness":57}]}]
    });

    return map;

});