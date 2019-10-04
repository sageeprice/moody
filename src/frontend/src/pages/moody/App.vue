<template>
  <div id="app">
    <Header/>
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
    <h2>big moods</h2>
    <div>
      <MoodDisplay />
    </div>
  </div>
</template>

<script>
import MoodDisplay from '@/components/MoodDisplay.vue'
import Header from "@/components/Header";

export default {
  name: 'app',
  components: {
    MoodDisplay,
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
