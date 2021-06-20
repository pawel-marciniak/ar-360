<template>
  <div id="app">
    <div class="wrapper">
        <div class="component">
            <View360
                :image-path="mainImagePath"
                :file-name="mainFileName"
                :image-width="1280"
                :image-height="720"
                :show-previews="true"
                :preview-image-path="mainPreviewImagePath"
                :preview-file-name="mainPreviewFileName"
                :amount=36
                :padding-index="true"
                :padding-index-size="4"
                :index-from="0"
                :layers="layers"
                :spin-reverse="true"
            />
        </div>

        <div class="configurator">
            <div class="text-center">
                <h3>Sofa colors:</h3>

                <div class="pillows">
                    <div v-for="(mainVariant, index) in mainVariants"
                         :key="mainVariant.fileName"
                         class="pillow"
                         :style="{ backgroundColor: mainVariant.color }"
                         :class="{ 'pillow--selected': selectedMainVariant === index }"
                         @click="selectVariant(mainVariant, index)"
                    ></div>
                </div>
            </div>

            <div class="text-center">
                <h3>Big pillows:</h3>

                <div class="pillows">
                    <div class="pillow pillow--clear" @click="clearBigPillow">
                        <i class="fas fa-ban"></i>
                    </div>

                    <div v-for="(bigPillow) in bigPillows"
                         :key="bigPillow.fileName"
                         :style="{ backgroundColor: bigPillow.color }"
                         class="pillow"
                         :class="[(selectedBigPillow === bigPillow ? 'pillow--selected' : null), (bigPillow.class || null)]"
                         @click="selectBigPillow(bigPillow)"
                    ></div>
                </div>
            </div>

            <div class="text-center" v-show="selectedBigPillow">
                <h3>Small pillows:</h3>

                <div class="pillows">
                    <div class="pillow pillow--clear" @click="clearSmallPillow">
                        <i class="fas fa-ban"></i>
                    </div>

                    <div v-for="(smallPillow) in smallPillows"
                         :key="smallPillow.fileName"
                         class="pillow"
                         :style="{ backgroundColor: smallPillow.color }"
                         :class="[(selectedSmallPillow === smallPillow ? 'pillow--selected' : null), (smallPillow.class || null)]"
                         @click="selectSmallPillow(smallPillow)"
                    ></div>
                </div>
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
          mainImagePath: '/images/Darby/360/1_Sofa/Solar99',
          mainFileName: 'Darby_Solar99_360_{index}.jpg',
          mainPreviewImagePath: '/images/Darby/Zoom/1_Sofa/Solar99',
          mainPreviewFileName: 'Darby_Solar99_Zoom_{index}.jpg',
          mainVariants: [
              {
                  imagePath: '/images/Darby/360/1_Sofa/Solar99',
                  fileName: 'Darby_Solar99_360_{index}.jpg',
                  previewImagePath: '/images/Darby/Zoom/1_Sofa/Solar99',
                  previewFileName: 'Darby_Solar99_Zoom_{index}.jpg',
                  color: 'rgb(21, 21, 21)',
              },
              {
                  imagePath: '/images/Darby/360/1_Sofa/Solar70',
                  fileName: 'Darby_Solar70_360_{index}.jpg',
                  previewImagePath: '/images/Darby/Zoom/1_Sofa/Solar70',
                  previewFileName: 'Darby_Solar70_Zoom_{index}.jpg',
                  color: 'rgb(86, 117, 120)',
              },
              {
                  imagePath: '/images/Darby/360/1_Sofa/Solar16',
                  fileName: 'Darby_Solar16_360_{index}.jpg',
                  previewImagePath: '/images/Darby/Zoom/1_Sofa/Solar16',
                  previewFileName: 'Darby_Solar16_Zoom_{index}.jpg',
                  color: 'rgb(129, 114, 107)',
              }
          ],
          bigPillows: [
              {
                  id: 1,
                  imagePath: '/images/Darby/360/2_BigPillows/ecru',
                  fileName: 'Big_ecru-black_360_{index}.png',
                  previewImagePath: '/images/Darby/Zoom/2_BigPillows/ecru',
                  previewFileName: 'Big_ecru-black_Zoom_{index}.png',
                  color: 'rgb(21, 21, 21)',
                  class: 'pillow-ecru',
              },
              {
                  id: 2,
                  imagePath: '/images/Darby/360/2_BigPillows/Rain12',
                  fileName: 'BP_Rain12_360_{index}.png',
                  previewImagePath: '/images/Darby/Zoom/2_BigPillows/Rain12',
                  previewFileName: 'BP_Rain12_Zoom_{index}.png',
                  color: 'rgb(255, 214, 37)',
              },
              {
                  id: 3,
                  imagePath: '/images/Darby/360/2_BigPillows/Rain24',
                  fileName: 'Big_Rain24_360_{index}.png',
                  previewImagePath: '/images/Darby/Zoom/2_BigPillows/Rain24',
                  previewFileName: 'Big_Rain24_Zoom_{index}.png',
                  color: 'rgb(159, 159, 159)',
              },
          ],
          smallPillows: [
              {
                  id: 4,
                  imagePath: '/images/Darby/360/3_SmallPillows/Ecru-black',
                  fileName: 'SP_ecru-black_360_{index}.png',
                  previewImagePath: '/images/Darby/Zoom/3_SmallPillows/Ecru-black',
                  previewFileName: 'SP_ecru-black_Zoom_{index}.png',
                  color: 'rgb(21, 21, 21)',
                  class: 'pillow-ecru',
              },
              {
                  id: 5,
                  imagePath: '/images/Darby/360/3_SmallPillows/FancyYellow',
                  fileName: 'SP_fancyyellow_360_{index}.png',
                  previewImagePath: '/images/Darby/Zoom/3_SmallPillows/FancyYellow',
                  previewFileName: 'SP_fancyyellow_Zoom_{index}.png',
                  color: 'rgb(255, 214, 37)',
              },
              {
                  id: 6,
                  imagePath: '/images/Darby/360/3_SmallPillows/Rain24',
                  fileName: 'SP_Rain24_360_{index}.png',
                  previewImagePath: '/images/Darby/Zoom/3_SmallPillows/Rain24',
                  previewFileName: 'SP_Rain24_Zoom_{index}.png',
                  color: 'rgb(159, 159, 159)',
              },
          ],
          selectedMainVariant: 0,
          selectedBigPillow: null,
          selectedSmallPillow: null,
          layers: [],
      }
    },

    methods: {
        selectVariant(variant, index) {
            this.mainImagePath = variant.imagePath;
            this.mainFileName = variant.fileName;
            this.mainPreviewImagePath = variant.previewImagePath;
            this.mainPreviewFileName = variant.previewFileName;
            this.selectedMainVariant = index;
        },
        selectBigPillow(bigPillow) {
            this.selectedBigPillow = bigPillow;
            this.$set(this.layers, 0, bigPillow);
        },
        selectSmallPillow(smallPillow) {
            this.selectedSmallPillow = smallPillow;
            this.$set(this.layers, 1, smallPillow);
        },
        clearBigPillow() {
            this.selectedBigPillow = null;
            this.$set(this.layers, 0, null);

            this.clearSmallPillow();
        },
        clearSmallPillow() {
            this.selectedSmallPillow = null;
            this.$set(this.layers, 1, null);
        },
    }
}
</script>

<style>
#app {
    font-family: 'Poppins', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}

.wrapper {
    display: flex;
    flex-direction: row;
    width: 80%;
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
        height: 350px;
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
    justify-content: left;
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
    outline: 2px solid deepskyblue;
}

.pillow.pillow--clear {
    position: relative;
    font-size: 50px;
    line-height: 50px;
    color: red;
}

.pillow-ecru {
    background-color: #e5e5f7;
    opacity: 0.8;
    background-image:  linear-gradient(135deg, #000000 25%, transparent 25%), linear-gradient(225deg, #000000 25%, transparent 25%), linear-gradient(45deg, #000000 25%, transparent 25%), linear-gradient(315deg, #000000 25%, #ffffff 25%);
    background-position:  10px 0, 10px 0, 0 0, 0 0;
    background-size: 10px 10px;
    background-repeat: repeat;
}

.text-center {
    text-align: left;
}
</style>
