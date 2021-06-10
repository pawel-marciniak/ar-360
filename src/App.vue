<template>
  <div id="app">
    <div class="wrapper">
      <vue-three-sixty
          :amount=12
          imagePath="/images"
          fileName="Darby_{index}.jpg?v3"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.wrapper {
  width: 853px;
  margin: 0 auto;
}
</style>
