define(['jquery', 'basemap'], function($, basemap){

    var map = basemap;

    map.setZoom(12);
    map.data.loadGeoJson('geojson/Zone_N_GeoJSON.json');
    map.data.loadGeoJson('geojson/Zone_A_GeoJSON.json');
    map.data.loadGeoJson('geojson/Zone_B_GeoJSON.json');
    map.data.loadGeoJson('geojson/Zone_C_GeoJSON.json');

    map.data.setStyle(function(feature){
        var color = feature.getProperty('color');

        return ({
            fillColor: color
        });
    });

    //map.data.setStyle({"fillColor": "green"});
    map.data.loadGeoJson('geojson/evac.json');


    console.log('done');

});