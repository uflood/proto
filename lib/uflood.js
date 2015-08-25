define(['leaflet', 'knn', 'entrypoints', 'gmaps', 'jquery', 'display-routes', 'basemap'], function(L, knn, ep, gmaps, $, dr, basemap){

    return {
        local: function(event, n){

            function arrayContains(arr, val, equals) {
                var i = arr.length;
                while (i--) {
                    if ( equals(arr[i], val) ) {
                        return true;
                    }
                }
                return false;
            }

            function removeDuplicates(arr, equals) {
                var originalArr = arr.slice(0);
                var i, len, j, val;
                arr.length = 0;

                for (i = 0, len = originalArr.length; i < len; ++i) {
                    val = originalArr[i];
                    if (!arrayContains(arr, val, equals)) {
                        arr.push(val);
                    }
                }
            }

            function thingsEqual(thing1, thing2) {
                return JSON.stringify(thing1) == JSON.stringify(thing2);
            }

            var gj = L.geoJson(ep);
            var lat = event.latLng['A'];
            var lon = event.latLng['F'];
            var nn = knn(gj).nearest(L.latLng(lat, lon), n);

            function getnext(id, seen) {

                var sofar = seen.slice(0);

                // Dedham
                if (id == 901) {
                    return {here: new gmaps.LatLng(42.2447835, -71.1812346), next: []}
                }

                // Newton
                if (id == 902) {
                    return {here: new gmaps.LatLng(42.3253729, -71.2136779), next: []}
                }

                // Watertown
                if (id == 903) {
                    return {here: new gmaps.LatLng(42.3721351, -71.1786435), next: []}
                }

                // Milton
                if (id == 904) {
                    return {here: new gmaps.LatLng(42.2465443, -71.0713179), next: []}
                }

                var data = null

                $.each(ep, function (i, d) {
                    if (d['properties']['id'] == id) {

                        data = d;
                        return false;
                    }
                });


                var here = new gmaps.LatLng(data['geometry']['coordinates'][1],
                    data['geometry']['coordinates'][0]);

                var nextset = [];

                var prop = data['properties']


                if (prop['N'] != null) {
                    if(sofar.indexOf(prop['N']) == -1) {
                        var sofar2 = sofar.slice(0)
                        sofar2.push(prop['N']);

                        nextset.push(getnext(prop['N'], sofar2))
                    }
                }

                if (prop['S'] != null) {
                    if(sofar.indexOf(prop['S']) == -1) {
                        var sofar2 = sofar.slice(0)
                        sofar2.push(prop['S']);

                        nextset.push(getnext(prop['S'], sofar2))
                    }
                }

                if (prop['E'] != null) {
                    if(sofar.indexOf(prop['E']) == -1) {
                        var sofar2 = sofar.slice(0)
                        sofar2.push(prop['E']);
                        nextset.push(getnext(prop['E'], sofar2))
                    }
                }

                if (prop['W'] != null) {
                    if(sofar.indexOf(prop['W']) == -1) {
                        var sofar2 = sofar.slice(0)
                        sofar2.push(prop['W']);

                        nextset.push(getnext(prop['W'], sofar2))
                    }
                }

                if (prop['D'] != null) {
                    if( prop['D'] > 900){
                        console.log(prop['D'])
                        var sofar2 = sofar.slice(0)
                        sofar2.push(prop['D']);
                        nextset.push(getnext(prop['D'], sofar2))
                    }
                }


                return {
                    here: here,
                    next: nextset
                }
            }


            var a = [];
            var b = [];

            console.log('search start');


            $.each(nn, function(i , data){
                a.push(getnext(data['layer']['feature']['properties']['id'], b));
            });
            console.log('search stop');

            var routenest = {
                here: event.latLng,
                next: a
            }

            console.log(routenest)

            var completeRoutes = [];



            function traverse(nest, route) {
                var sofar = route.slice(0);
                sofar.push(nest['here']);
                if (nest.next.length == 0){
                    completeRoutes.push({r: sofar});
                } else {
                    $.each(nest.next, function(i, data){
                        traverse(data, sofar);
                    });
                }
            }


            traverse(routenest, []);

            console.log('Found ' + completeRoutes.length + " routes.");



            var shortenough = [];

            $.each(completeRoutes, function(i, route){
                var r = route['r'];
                var l = r.length;

                var newroute = [];

                if(l <= 10){
                    shortenough.push({r: r});
                } else if (l <= 16){
                    for(i = 0; i < l; i ++){
                        if(i == l-1){
                            newroute.push(r[i]);
                        } else if((i % 2) == 0){
                            newroute.push(r[i]);
                        }
                    }

                    shortenough.push({r: newroute});
                } else if (l <= 24) {
                    for (i = 0; i < l; i++) {
                        if (i == l-1) {
                            newroute.push(r[i])
                        } else if ((i % 3) == 0) {
                            newroute.push(r[i]);
                        }
                    }
                    shortenough.push({r: newroute});
                }

            });

            var routesLessThan10 = [];

            $.each(shortenough, function(i, route) {
                if(route['r'].length <= 10){
                    routesLessThan10.push(route);
                }
            });

            console.log('Found ' + routesLessThan10.length + " routes less than 10 hops.");

            removeDuplicates(routesLessThan10, thingsEqual);

            console.log('Found ' + routesLessThan10.length + " non-duplicate routes less than 10 hops.");


            var withlengths = [];

            function compare(a,b) {
                if (a.d < b.d)
                    return -1;
                if (a.d > b.d)
                    return 1;
                return 0;
            }


            $.each(routesLessThan10, function(i, route){
               var r = route['r'],
                   d = gmaps.geometry.spherical.computeLength(r);

                withlengths.push({r: r, d: d});

            });

            withlengths.sort(compare)

            console.log(withlengths);


            return withlengths;



            //var routes = [];
            //
            //$.each(nn, function(i, data){
            //
            //    var prop = data['layer']['feature']['properties'];
            //
            //    var here = new gmaps.LatLng(data.lat, data.lon)
            //
            //    if(prop['N'] != null){
            //        routes.push({
            //            loc: here,
            //            next: prop['N']
            //        })
            //    }
            //
            //    if(prop['S'] != null){
            //        routes.push({
            //            loc: here,
            //            next: prop['S']
            //        })
            //    }
            //
            //    if(prop['E'] != null){
            //        routes.push({
            //            loc: here,
            //            next: prop['E']
            //        })
            //    }
            //
            //    if(prop['W'] != null){
            //        routes.push({
            //            loc: here,
            //            next: prop['W']
            //        })
            //    }
            //
            //});
            //
            //
            //
            //
            //
            //
            //
            //return {
            //    start: {lat: lat, lon: lon},
            //    routes: routes
            //};

        }

    }

});