;(function () {
    'use strict';

    var t = yangaiche(sys.$);

    t('#payment .selectable[data-pay-way="alipay"]').removeClass('invisible');
    t('#payment .selectable[data-pay-way="fuwu"]').removeClass('invisible');

}());