define(['jquery', 'basemap'], function($, basemap){

    var map = basemap;

    map.setZoom(12);
    map.data.loadGeoJson('geojson/EvacRoutes.geojson');

    console.log('routes loaded');


});