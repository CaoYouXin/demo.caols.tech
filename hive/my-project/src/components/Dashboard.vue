<template>
    <div class="welcome">Welcome</div>
</template>

<script>
    export default {
        name: 'dashboard',
        template: `<div class="welcome">Welcome</div>`,
        data: () => ({}),
        render: h => h(this),
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .welcome {
        text-align: center;
        line-height: 5em;
        font-size: 3rem;

        color: blueviolet;
        text-shadow: 5px 5px 5px #344020;
    }
</style>
