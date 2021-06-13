<template>
  <div id="app">
    <div class="wrapper">
      <View360
          :amount=36
          :padding-index="true"
          :padding-size="4"
          :index-from="0"
          image-path="/images/Solar99"
          file-name="Solar99_360__{index}.jpg"
          :big-previews="true"
          big-image-path="/images/Solar99/Zoom"
          big-file-name="Solar99_Zoom_{index}.jpg"
      />
    </div>
  </div>
</template>

<script>
import View360 from "@/components/View360";

export default {
  name: 'App',

  components: {
    View360,
  }
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
