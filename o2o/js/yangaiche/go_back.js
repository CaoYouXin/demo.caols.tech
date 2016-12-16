;(function () {

    'use strict';

	yangaiche(sys.load_default_module)('back');
    yangaiche(sys.load_module)('ios/bridge');

    yangaiche(app.bridge.connect)(function (bridge) {
        var data = {'Javascript Responds': 'Wee!'};
        bridge.init(function (message, responseCallback) {
            console.log('JS got a message: ' + message);

            if (/.*go_back.*/.test(message)) {
                console.log('go_back');
                var parent_of_this = yangaiche(ls.back.get_parent_of_this)();
                console.log(parent_of_this);
                if (yangaiche(sys.exist)(parent_of_this) && !/.*(undefined|null)/.test(parent_of_this)) {
                    yangaiche(ls.back.set_back_to_his)(parent_of_this);
                    return true;
                } else {
                    yangaiche(sys.load_module)('close_app');
                    return true;
                }
            }

            console.log('JS responding with: ' + JSON.stringify(data));
            responseCallback(data);
        });
    });
}());