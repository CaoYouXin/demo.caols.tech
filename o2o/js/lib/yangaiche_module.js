;(function () {

    'use strict';

    sys.site_config = 'site_config';
    sys.browser_type = 'browser_type';
    sys.load_module = 'load_module';
    sys.load_default_module = 'load_default_module';

	yangaiche(sys.site_config, function () {
        var site_config = null, root = yangaiche(sys.root), exist = yangaiche(sys.exist);
        return function () {
            if (!exist(site_config)) {
                site_config = $.ajax({
                    url: root + '/map/site.json',
                    cache: false,
                    async: false,
                    dataType: 'json'
                }).responseJSON;
            }
            console.log(site_config);
            return site_config;
        }();
    });

    yangaiche(sys.browser_type, function () {
        var type = null, module_root = null;
        return function () {
            if (!type) {
                var user_agent = window.navigator.userAgent.toLowerCase();
                console.log(JSON.stringify(user_agent));
                for (var i = 0; i < yangaiche(sys.site_config).browser.length; i++) {
                    var b = yangaiche(sys.site_config).browser[i];
                    if (user_agent.indexOf(b.userAgent) >= 0) {
                        type = b.type;
                        module_root = b.moduleRoot;
                        if ('normal' !== b.type) {
                            return {type: type, module_root: module_root};
                        }
                    }
                }
            }
            return {type: type, module_root: module_root};
        }();
    });

    yangaiche(sys.load_module, function () {
        var browser = yangaiche(sys.browser_type);
        return function (name) {
            var result = yangaiche(sys.load)(browser.module_root + '/' + name + '.js', true);
            if (yangaiche(sys.exist)(result) && !result) {
                yangaiche(sys.load_default_module)(name);
            }
        };
    });

    yangaiche(sys.load_default_module, function () {
        return function (name) {
            return yangaiche(sys.load)('default/' + name + '.js', true);
        };
    });

}());