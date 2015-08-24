define(['jquery', 'basemap'], function($, basemap){

    var map = basemap;

    map.setZoom(12);
    map.data.loadGeoJson('geojson/EntryPoints.geojson');

    console.log('entrypoints loaded');

});