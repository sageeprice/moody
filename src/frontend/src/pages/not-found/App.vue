<template>
  <div id="app">
    <Header/>
    <h2>404</h2>
    <p>Sorry, couldn't find what you're looking for. My b.</p>
    <h3>¯\_(ツ)_/¯</h3>
  </div>
</template>

<script>
import Header from '@/components/Header'

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
h2 {
  font-size: 5rem;
}
p {
  font-size: 2rem;
}
h3 {
  font-size: 3rem;
}
</style>
