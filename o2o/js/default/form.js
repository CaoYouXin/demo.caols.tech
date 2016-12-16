;(function () {

    'use strict';

	yangaiche(sys.load_default_module)('repository');

    app.form = {
        to_obj: 'form_to_obj',
        from_obj: 'obj_to_form'
    };

    yangaiche(app.form.to_obj, function () {
        return function (selector) {
            var obj = {}, arr = yangaiche(sys.$)(selector).serializeArray();
            for (var i = 0; i < arr.length; i++) {
                obj[arr[i].name] = arr[i].value;
            }
            return obj;
        };
    });

    yangaiche(app.form.from_obj, function () {
        var t = yangaiche(sys.$), exist = yangaiche(sys.exist);
        return function (obj) {
            for (var key in Object.keys(obj)) {
                if (typeof(obj[key]) === 'function') {
                    continue;
                }
                var tag = t('#' + key);
                if (exist(tag)) {
                    tag.val(obj[key] || tag.val());
                }
            }
        };
    });

}());