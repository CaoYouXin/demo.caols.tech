<template>
    <div>
        <h1>Hive</h1>
        <nav>
            <Route v-for="r in routes" :r="r" :isSelected="r === selected" v-on:routeclick="clicked($data, r)"></Route>
            <!--<router-link v-for="r in routes" :to="r.path" class="nav">-->
                <!--{{r.data.name}}<br>-->
                <!--&lt;!&ndash;<div class="container" :class="{ show: isShow }" @click="awesome($event)">&ndash;&gt;-->
                    <!--&lt;!&ndash;<div class="radius" :class="{ animated: isAnimated }"&ndash;&gt;-->
                         <!--&lt;!&ndash;:style="{ width: width + 'px', height: height + 'px', left: left + 'px', top: top + 'px' }"></div>&ndash;&gt;-->
                <!--&lt;!&ndash;</div>&ndash;&gt;-->
            <!--</router-link>-->
        </nav>
        <div class="view">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
    import Route from './components/Route.vue';

    export default {
        name: 'App',
        props: ['routes'],
        data: () => ({
            selected: null,
        }),
        methods: {
            clicked: (d, r) => {
                d.selected = r;
            },
        },
        components: {
            Route,
        },
    };
</script>

<style scoped>
    h1 {
        color: #369;
        font-family: Arial, Helvetica, sans-serif;
        font-size: 250%;
        padding: 0 1em;
        margin: 0;

        line-height: 1.5em;
        background-color: #F5F6EB;
    }

    h1:after {
        content: '';
        display: block;
        width: 100%;
        height: calc(100% - 1.5em);

        position: fixed;
        left: 0;

        background: transparent;

        pointer-events: none;
        box-shadow: 0 0 4px 5px #34352C;
    }

    nav {
        display: block;

        width: 20%;
        float: left;
    }

    .view {
        width: 80%;
        float: right;
    }

    /**/

    a.nav {
        display: block;
        width: 100%;
        height: 2em;
        line-height: 2em;

        font-size: 1.5rem;

        text-align: center;

        background-color: #EFF0DC;

        padding: 0;

        overflow: hidden;

        color: #34352C;
        text-decoration: none;
    }

    a.nav > .container {
        display: inline-block;

        width: 100%;
        height: 100%;

        position: relative;
        bottom: 100%;

        overflow: hidden;
    }

    a.nav > .container:not(.show) > .radius {
        display: none;
    }

    a.nav > .container > .radius {
        display: inline-block;

        border-radius: 50%;

        background-color: rgba(0, 0, 100, 0.3);

        position: relative;

        transform: scale(0);
        transform-origin: 50% 50% 0;
        transition: transform .3s ease-in-out;
    }

    a.nav > .container > .radius.animated {
        transform: scale(1);
    }

    a.nav:hover {
        box-shadow: inset 0 0 5px #EFF0DC;
    }
</style>
