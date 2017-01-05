<template>
  <div>
    <h1>Hive</h1>
    <nav>
      <Route v-for="r in routes" :r="r" :isSelected="r === selected" v-on:routeclick="clicked($data, r)"></Route>
    </nav>
    <div class="view">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import Route from './components/Route';

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
</style>
