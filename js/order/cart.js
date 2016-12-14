/**
 * Created by cls on 2016/12/14.
 */
;(function () {

    var cart = document.querySelector('.cart.hidden');
    var cartFooter = document.querySelector('.cart-footer');

    (function fillCart() {

        var items = sessionStorage.getItem('cart');
        if (!items) {
            items = [];
        } else {
            items = JSON.parse(items);
        }

        items.forEach(function (item) {
            var node = cart.cloneNode(true);
            node.classList.remove('hidden');
            node.firstElementChild.nextElementSibling.firstElementChild.textContent = item.price;
            node.lastElementChild.textContent = item.content;

            document.body.insertBefore(node, cartFooter);
        });

        if (!items.length) {
            var node = cart.cloneNode(true);
            node.classList.remove('hidden');
            node.removeChild(node.firstElementChild);
            node.removeChild(node.firstElementChild);
            node.lastElementChild.style.textAlign = 'center';
            node.lastElementChild.style.width = '100%';
            node.lastElementChild.textContent = '购物车没有商品';

            document.body.insertBefore(node, cartFooter);
        }
    })();

    (function deleteCart() {
        var cartCheckers, cartHeadChecker = document.querySelector('.cart-head > input');

        document.addEventListener('click', function (e) {
            if (e.target.tagName === 'INPUT') {

                if (e.target.parentNode.classList.contains('cart') && !e.target.checked) {
                    cartHeadChecker.checked = false;
                }

                cartCheckers = document.querySelectorAll('.cart:not(.hidden) > input');
                if (e.target.parentNode.classList.contains('cart-head')) {
                    for (var i = 0; i < cartCheckers.length; i++) {
                        cartCheckers.item(i).checked = e.target.checked;
                    }
                }

            }
        }, false);

        document.querySelector('.cart-head > a').addEventListener('click', function (e) {
            e.preventDefault();

            var items = sessionStorage.getItem('cart');
            if (!items) {
                items = [];
            } else {
                items = JSON.parse(items);
            }

            cartCheckers = document.querySelectorAll('.cart:not(.hidden) > input');
            for (var i = 0; i < cartCheckers.length; i++) {
                if (cartCheckers.item(i).checked) {
                    document.body.removeChild(cartCheckers.item(i).parentNode);

                    items.splice(i, 1);
                }
            }

            sessionStorage.setItem('cart', JSON.stringify(items));

            cartCheckers = document.querySelectorAll('.cart:not(.hidden) > input');
            if (!cartCheckers.length) {
                var node = cart.cloneNode(true);
                node.classList.remove('hidden');
                node.removeChild(node.firstElementChild);
                node.removeChild(node.firstElementChild);
                node.lastElementChild.style.textAlign = 'center';
                node.lastElementChild.style.width = '100%';
                node.lastElementChild.textContent = '购物车没有商品';

                document.body.insertBefore(node, cartFooter);
            }
        }, false);
    })();

})();
