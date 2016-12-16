;(function () {

    'use strict';

	yangaiche(sys.load_default_module)('repository');

    app.url_parameter = 'url_parameter';
    app.hash_parameter = 'hash_parameter';

    function parameter(start, and, equal) {
        var url = location.href;
        var theRequest = {};
        theRequest.counts = 0;
        if (url.indexOf(start) !== -1) {
            var str = url.substr(url.indexOf(start) + 1);
            var strs = str.split(and);
            for (var i = 0; i < strs.length; i++) {
                var ss = strs[i].split(equal);
                theRequest[ss[0]] = ss[1];
                theRequest.counts++;
            }
        }
        return theRequest;
    }

    yangaiche(app.url_parameter, function () {
        return parameter('?', '&', '=');
    });

    yangaiche(app.hash_parameter, function () {
        return parameter('#', '&', '=');
    });

}());