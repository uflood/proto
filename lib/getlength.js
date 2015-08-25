define(['decode', 'gmaps'], function(decode, gmaps){
    return {
        getlength: function(str){
            var coords = decode(str);

            gmaps.getLength()
        }
    }
});