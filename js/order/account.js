/**
 * Created by cls on 2016/12/11.
 */
;(function () {

    (function register() {
        var pwd = document.getElementById('r-pwd');
        var pwdConfirm = document.getElementById('r-pwd-confirm');

        var checkPasswordValidity = function() {
            if (pwd.value != pwdConfirm.value) {
                pwdConfirm.setCustomValidity('两次输入的密码不一致');
            } else {
                pwdConfirm.setCustomValidity('');
            }
        };

        // pwd.addEventListener('change', checkPasswordValidity, false);
        // pwdConfirm.addEventListener('change', checkPasswordValidity, false);

        var form = document.querySelector('.form.register > form');
        form.addEventListener('submit', function() {
            checkPasswordValidity();
            if (!this.checkValidity()) {
                event.preventDefault();
                //Implement you own means of displaying error messages to the user here.
                // pwdConfirm.focus();
            }

            sessionStorage.setItem('logged', 'virgin');
        }, false);

        document.querySelector('.form.login > form').addEventListener('submit', function (e) {
            sessionStorage.setItem('logged', 'virgin');
        }, false);
    })();

    (function init() {
        var toShow = location.hash.substr(1);
        document.querySelector('.btn.' + toShow).classList.add('show');
        document.querySelector('.form.' + toShow).classList.add('show');

        document.querySelector('.outer > .inner').onclick = function (e) {
            var classList = e.target.classList;
            if (classList.contains('btn') && !classList.contains('show')) {
                var it = this.firstElementChild;
                while (it) {
                    it.classList.toggle('show');
                    it = it.nextElementSibling;
                }
            }
        };

        if (sessionStorage.getItem('logged')) {
            location.href = 'customer_center.html';
        }
    })();

})();
