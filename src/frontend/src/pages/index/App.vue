<template>
  <div id="app">
    <Header/>
    <h1>Hi, thanks for visiting. Still under construction, come back later.</h1>
  </div>
</template>

<script>
import Header from "@/components/Header";

export default {
  name: 'app',
  components: {
    Header,
  },
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
body {
  margin: 0px;
}
</style>
