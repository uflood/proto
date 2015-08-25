define(['jquery', 'basemap'], function($, basemap){

    var loaded = false;

    return {
        load: function(){
            basemap.setZoom(12);
            basemap.data.loadGeoJson('geojson/EvacRoutes.geojson');
        },
        unload: function(){
            basemap.data.forEach(function(feature){
               basemap.data.remove(feature);
            });
        },
        toggle: function(){
            if(loaded){
                this.unload();
                loaded = false;
            } else {
                this.load();
                loaded = true;
            }
        }

    }




    console.log('routes loaded');


});