<template>
  <div id="app">
    <div class="wrapper">
        <div class="component">
            <View360
                :amount=36
                :padding-index="true"
                :padding-size="4"
                :index-from="0"
                image-path="/images/Solar99"
                file-name="Solar99_360__{index}.jpg"
                :layer-image-path="layerImagePath"
                :layer-file-name="layerFileName"
                :big-previews="true"
                :spin-reverse="true"
                :disable-zoom="true"
                big-image-path="/images/Solar99/Zoom"
                big-file-name="Solar99_Zoom_{index}.jpg"
            />
        </div>

        <div class="configurator">
            <h3>Select pillows:</h3>

            <div class="pillows">
                <div class="pillow pillow--big"
                     :class="{ 'pillow--selected': selectedPillows === 'big' }"
                     @click="selectPillows('big')"
                ></div>
                <div class="pillow pillow--small"
                     :class="{ 'pillow--selected': selectedPillows === 'small' }"
                     @click="selectPillows('small')"
                ></div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import View360 from "@/components/View360";

export default {
    name: 'App',

    components: {
        View360,
    },

    data() {
      return {
          layerImagePath: null,
          layerFileName: null,
          selectedPillows: null,
      }
    },

    methods: {
        selectPillows(type) {
            this.selectedPillows = type;

            if (type === 'big') {
                this.layerImagePath = '/images/BigPillows';
                this.layerFileName = 'BP_Rain12_360_{index}.png';
            } else if (type === 'small') {
                this.layerImagePath = '/images/SmallPillows';
                this.layerFileName = 'SP_Rain24_360__{index}.png';
            }
        }
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
    display: flex;
    flex-direction: row;
    width: 60%;
    margin: 0 auto;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
}

@media screen and (max-width: 1290px) {
    .wrapper {
        width: 100%;
    }
}

.wrapper .component {
    flex-shrink: 1;
    border-right: 1px solid lightgrey;
}

@media screen and (max-width: 768px) {
    .wrapper {
        flex-direction: column;
    }

    .wrapper .component {
        border-right: none;
        border-bottom: 1px solid lightgrey;
    }
}

.wrapper .configurator {
    flex-grow: 1;
    padding: 0 36px 36px 36px;
}

.pillows {
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 16px
}

.pillow {
    width: 50px;
    height: 50px;
    cursor: pointer;
}

.pillow.pillow--big {
    background-color: darkgoldenrod;
}

.pillow.pillow--small {
    background-color: #888888;
}

.pillow.pillow--selected {
    border: 1px solid deepskyblue;
}
</style>
