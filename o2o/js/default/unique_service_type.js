;(function () {
    'use strict';

    //yangaiche(sys.load_module)('');
    //yangaiche(sys.load_default_module)('');
    //yangaiche(sys.load_lib_module)('');

    app.unique_service_type =  {
        get: 'unique_service_type_get'
    };

    yangaiche(app.unique_service_type.get, function () {
        var storage = yangaiche(sys.local_storage);
        return function (sth) {
            if (undefined !== sth) {
                storage.set(key.service.sth, sth);
                return key.service.type + sth;
            }
            return key.service.type + storage.get(key.service.sth);
        }
    });
}());