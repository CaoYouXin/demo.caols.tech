<template>
  <router-link :to="r.path" class="nav">
    {{r.data.name}}<br>
    <div class="container" :class="{ show: isShow }" @click="awesome($event)">
      <div class="radius" :class="{ animated: isAnimated }"
           :style="{ width: width + 'px', height: height + 'px', left: left + 'px', top: top + 'px' }"></div>
    </div>
  </router-link>
</template>

<script>
  import Vue from 'vue';

  export default {
    name: 'Route',
    props: ['r', 'isSelected'],
    data: () => ({
      isShow: false,
      isAnimated: false,
      width: false,
      height: false,
      left: false,
      top: false,
    }),
    watch: {
      isSelected: function (val, oldVal) {
        if (!val) {
          this.isShow = this.isAnimated = val;
        }
      }
    },
    methods: {
      awesome(e) {
        this.$emit('routeclick');

        const v1 = e.offsetX * e.offsetX;
        const v2 = (e.target.offsetHeight - e.offsetY) * (e.target.offsetHeight - e.offsetY);
        const v3 = (e.target.offsetWidth - e.offsetX) * (e.target.offsetWidth - e.offsetX);
        const v4 = e.offsetY * e.offsetY;
        const radius = Math.sqrt(Math.max(v1 + v4, v1 + v2, v3 + v4, v3 + v2));

        this.isShow = true;
        this.width = this.height = 2 * radius;
        this.left = e.offsetX - radius;
        this.top = e.offsetY - radius;

        const self = this;
        const nextTick = Vue.nextTick((t) => {
          self.isAnimated = true;
        });
      },
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
