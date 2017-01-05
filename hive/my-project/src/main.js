import Vue from "vue";
import VueRouter from "vue-router";
import App from "./App.vue";
import Route from "./components/Route.vue";
import Dashboard from "./components/Dashboard.vue";
import UserChart from "./components/UserChart.vue";

Vue.use(VueRouter);

const routes = [
    {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
    {path: '/dashboard', component: Dashboard, data: {name: 'Dashboard'}},
    {path: '/users', component: UserChart, data: {name: '用户量'}},
    // {path: 'money', component: MoneyChartComponent, data: {name: '收支流水'}},
    // {path: 'order', component: OrderChartComponent, data: {name: '订单量'}},
];

const router = new VueRouter({
    mode: 'history',
    routes,
});

new Vue({
    router,
    data: {
        routes: routes.slice(1),
    },
    template: '<App :routes="routes"/>',
    components: {
        App, Route, Dashboard,// UserChart,
    },
    // el: '#app',
    // render: h => h(App),
}).$mount('#app');
