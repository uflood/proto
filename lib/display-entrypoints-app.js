require.config({
    paths: {
        'jquery': 'jquery-1.11.3.min'
    }
});

require(['gmaps', 'basemap', 'display-entrypoints'], function(gmaps, basemap, waypoints) {
    console.log("done")
});