import Vue from "vue";

export default function tt(el) {
  let dataVs = Array.from(el.attributes, (attr) => attr.name).filter((attr) => !attr.indexOf('data-v'));

  function t(it) {
    if (it.firstElementChild) {
      t(it.firstElementChild);
    }

    dataVs.forEach(v => it.setAttribute(v, ''));

    while (it.nextElementSibling) {
      t(it.nextElementSibling);
      it = it.nextElementSibling;
    }
  }

  t(el);
}

Vue.directive('d3chart', {
  bind: function (el, binding, vnode) {
    el.innerHTML = '';
    vnode.context.createChart(el);
  },
  inserted: function (el, binding, vnode) {

    const interval = setInterval((e) => {
      if (e.innerHTML) {
        tt(e);

        vnode.context.startTransition(e);

        clearInterval(interval);

        console.log('chart init end');
      }
    }, 1000, el);

  },
});
