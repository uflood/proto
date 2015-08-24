define(['jquery'], function($){


        var json = null;
        $.ajax({
            'async': false,
            'global': false,
            'url': "geojson/EntryPoints.geojson",
            'dataType': "json",
            'success': function (data) {
                json = data;
            }
        });
        return json['features'];

});