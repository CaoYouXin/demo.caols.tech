// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import VueRouter from "vue-router";
import App from "./App";
import Route from "./components/Route.vue";
import Dashboard from "./components/Dashboard.vue";
import UserChart from "./components/UserChart.vue";
import UserChartReverse from "./components/UserChartReverse.vue";
import OrderChart from "./components/OrderChart.vue";

Vue.use(VueRouter);

let DashboardComp = resolve => resolve(Dashboard);
let UserChartComp = resolve => resolve(UserChart);
let UserChartReverseComp = resolve => resolve(UserChartReverse);
let OrderChartComp = resolve => resolve(OrderChart);

const routes = [
  {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
  {path: '/dashboard', component: DashboardComp, data: {name: 'Dashboard'}},
  {path: '/users', component: UserChartComp, data: {name: '用户量'}},
  {path: '/users-reverse', component: UserChartReverseComp, data: {name: '用户量（反）'}},
  {path: '/order', component: OrderChartComp, data: {name: '订单量'}},
];

const router = new VueRouter({
  // mode: 'history',
  routes,
});

/* eslint-disable no-new */
new Vue({
  router,
  data: {
    routes: routes.slice(1),
  },
  template: '<App :routes="routes"/>',
  components: {
    App, Route, Dashboard,// UserChart,
  },
}).$mount('#app');
