/**
 * Created by cls on 2016/12/12.
 */
;(function () {

    (function products() {
        var nodeList = document.querySelectorAll('.category > .cate');
        var pkgList = document.querySelectorAll('.packages > .pkgs');

        document.addEventListener('click', function (e) {
            if (e.target.classList.contains('cate') && !e.target.classList.contains('active')) {
                var i;

                for (i = 0; i < nodeList.length; i++) {
                    nodeList.item(i).classList.remove('active');
                }

                for (i = 0; i < pkgList.length; i++) {
                    pkgList.item(i).classList.remove('active');
                }

                e.target.classList.add('active');
                document.querySelector('.packages > .pkgs[data-rel="'+e.target.getAttribute('data-rel')+'"]')
                    .classList.add('active');
            }
        }, false);

        document.addEventListener('click', function (e) {
            if (e.target.tagName === 'INPUT') {
                var items = sessionStorage.getItem('cart');

                if (!items) {
                    items = [];
                } else {
                    items = JSON.parse(items);
                }
                console.log(typeof items, items);

                items.push({
                    content: e.target.parentNode.parentNode.firstElementChild.textContent,
                    price: parseFloat(e.target.parentNode.firstElementChild.firstElementChild.textContent)
                });

                sessionStorage.setItem('cart', JSON.stringify(items));

                location.href = 'cart.html';
            }
        }, false);
    })();

})();
