;(function () {

    'use strict';

	yangaiche(sys.load_default_module)('user');
    yangaiche(sys.load_default_module)('http');
    yangaiche(sys.load_default_module)('show_msg');

    yangaiche(sys.init)(function (t) {
        var user = yangaiche(ls.user.touch)(),
            show_msg = yangaiche(app.show_msg.show);

        var man_or_woman = t('.login-item-content button');
        man_or_woman.bind('click', function () {
            man_or_woman.addClass('gray_button');
            t(this).removeClass('gray_button');
        });

        t('#name').val(user.name);
        t('#select-' + user.gender).click();
        t('#phone').text(user.phone_number);

        t('#submit-button').click(function () {
            var name = t('#name').val(),
                gender = t('.login-item-content button:not(.gray_button)').attr('id').match(/select-(.*)/)[1];
            console.log(name);
            console.log(gender);

            yangaiche(app.http.post_request)('/v1/api/meta_user', {
                id: user.user_id,
                gender: gender,
                user_name: name,
                phone_number: user.phone_number
            }, function () {
                yangaiche(ls.user.update)(function (user) {
                    user.name = name;
                    user.gender = gender;
                });
                show_msg('修改成功! ');
            }, function (error) {
                show_msg(error.message);
            });
        });
    });
}());