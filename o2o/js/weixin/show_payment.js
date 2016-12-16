;(function () {
    'use strict';

    var t = yangaiche(sys.$);

    t('#payment .selectable[data-pay-way="wx"]').removeClass('invisible');
    t('#payment .selectable[data-pay-way="fuwu"]').removeClass('invisible');

}());