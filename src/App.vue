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
                :main-ar-url="arUrl"
                :selected-hotspot="selectedHotspot"
                @move-stop="selectedHotspot = null"
            />

            <div class="hotspots">
                <div v-for="(mainVariantHotspot, index) in mainVariantHotspots"
                     :key="mainVariantHotspot"
                     class="hotspot"
                     :class="{ 'hotspot--active': selectedHotspot === hotspots[index] }"
                     @click="selectedHotspot = hotspots[index]"
                >
                    <img :src="mainVariantHotspot" />
<!--                    <img v-if="bigPillowHotspots[index]"-->
<!--                         :src="bigPillowHotspots[index]"-->
<!--                         class="hotspot&#45;&#45;layer"-->
<!--                    />-->
<!--                    <img v-if="smallPillowHotspots[index]"-->
<!--                         :src="smallPillowHotspots[index]"-->
<!--                         class="hotspot&#45;&#45;layer"-->
<!--                    />-->
                </div>
            </div>
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
                         :class="[(selectedBigPillow === bigPillow.key ? 'pillow--selected' : null), (bigPillow.class || null)]"
                         @click="selectBigPillow(bigPillow.key)"
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
                         :class="[(selectedSmallPillow === smallPillow.key ? 'pillow--selected' : null), (smallPillow.class || null)]"
                         @click="selectSmallPillow(smallPillow.key)"
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
          mainImagePath: '/images/Combined/360/Solar99/base',
          mainFileName: 'Sofa_Solar99_360_{index}.jpg',
          mainPreviewImagePath: '/images/Combined/Zoom/Solar99/base',
          mainPreviewFileName: 'Sofa_Solar99_Zoom_{index}.jpg',
          mainVariants: [
              {
                  imagePath: '/images/Combined/360/Solar99/base',
                  fileName: 'Sofa_Solar99_360_{index}.jpg',
                  previewImagePath: '/images/Combined/Zoom/Solar99/base',
                  previewFileName: 'Sofa_Solar99_Zoom_{index}.jpg',
                  color: 'rgb(21, 21, 21)',
                  arUrl: 'https://api-ar.letsdrnk.com/api/see-in-ar?configurator=brw_36714&scene=brw3',
                  variants: {
                      'big-pillow-beige': {
                          id: 7,
                          key: 'big-pillow-beige',
                          imagePath: '/images/Combined/360/Solar99/Solar99-beige-beige',
                          fileName: '99_beige_beige_360_{index}.jpg',
                          previewImagePath: '/images/Combined/Zoom/Solar99/Solar99-beige-beige',
                          previewFileName: '99_beige_beige_Zoom_{index}.jpg',
                          color: 'rgb(171, 158, 146)',
                          arUrl: 'https://api-ar.letsdrnk.com/api/see-in-ar?configurator=brw_36714&scene=brw3',
                          variants: {
                              'small-pillow-beige': {
                                  id: 8,
                                  key: 'small-pillow-beige',
                                  imagePath: '/images/Combined/360/Solar99/Solar99-beige-beige',
                                  fileName: '99_beige_beige_360_{index}.jpg',
                                  previewImagePath: '/images/Combined/Zoom/Solar99/Solar99-beige-beige',
                                  previewFileName: '99_beige_beige_Zoom_{index}.jpg',
                                  color: 'rgb(171, 158, 146)',
                              },
                              'small-pillow-blue': {
                                  id: 9,
                                  key: 'small-pillow-blue',
                                  imagePath: '/images/Combined/360/Solar99/Solar99-beige-blue',
                                  fileName: '99_beige_blue_360_{index}.jpg',
                                  previewImagePath: '/images/Combined/Zoom/Solar99/Solar99-beige-blue',
                                  previewFileName: '99_beige_blue_Zoom_{index}.jpg',
                                  color: 'rgb(93, 109, 119)',
                                  arUrl: 'https://api-ar.letsdrnk.com/api/see-in-ar?configurator=brw_36714&scene=brw3',
                              },
                              'small-pillow-orange': {
                                  id: 10,
                                  key: 'small-pillow-orange',
                                  imagePath: '/images/Combined/360/Solar99/Solar99-beige-orange',
                                  fileName: '99_beige_orange_360_{index}.jpg',
                                  previewImagePath: '/images/Combined/Zoom/Solar99/Solar99-beige-orange',
                                  previewFileName: '99_beige_orange_Zoom_{index}.jpg',
                                  color: 'rgb(239, 135, 81)',
                                  arUrl: 'https://api-ar.letsdrnk.com/api/see-in-ar?configurator=brw_36714&scene=brw3',
                              },
                          }
                      },
                      'big-pillow-black': {
                          id: 11,
                          key: 'big-pillow-black',
                          imagePath: '/images/Combined/360/Solar99/Solar99-black-beige',
                          fileName: '99_black_beige_360_{index}.jpg',
                          previewImagePath: '/images/Combined/Zoom/Solar99/Solar99-black-beige',
                          previewFileName: '99_black_beige_Zoom_{index}.jpg',
                          color: 'rgb(33, 34, 34)',
                          arUrl: 'https://api-ar.letsdrnk.com/api/see-in-ar?configurator=brw_36714&scene=brw3',
                          variants: {
                              'small-pillow-beige': {
                                  id: 12,
                                  key: 'small-pillow-beige',
                                  imagePath: '/images/Combined/360/Solar99/Solar99-black-beige',
                                  fileName: '99_black_beige_360_{index}.jpg',
                                  previewImagePath: '/images/Combined/Zoom/Solar99/Solar99-black-beige',
                                  previewFileName: '99_black_beige_Zoom_{index}.jpg',
                                  color: 'rgb(171, 158, 146)',
                              },
                              'small-pillow-blue': {
                                  id: 13,
                                  key: 'small-pillow-blue',
                                  imagePath: '/images/Combined/360/Solar99/Solar99-black-blue',
                                  fileName: '99_black_blue_360_{index}.jpg',
                                  previewImagePath: '/images/Combined/Zoom/Solar99/Solar99-black-blue',
                                  previewFileName: '99_black_blue_Zoom_{index}.jpg',
                                  color: 'rgb(93, 109, 119)',
                                  arUrl: 'https://api-ar.letsdrnk.com/api/see-in-ar?configurator=brw_36714&scene=brw3',
                              },
                              'small-pillow-orange': {
                                  id: 14,
                                  key: 'small-pillow-orange',
                                  imagePath: '/images/Combined/360/Solar99/Solar99-black-orange',
                                  fileName: '99_black_orange_360_{index}.jpg',
                                  previewImagePath: '/images/Combined/Zoom/Solar99/Solar99-black-orange',
                                  previewFileName: '99_black_orange_Zoom_{index}.jpg',
                                  color: 'rgb(239, 135, 81)',
                                  arUrl: 'https://api-ar.letsdrnk.com/api/see-in-ar?configurator=brw_36714&scene=brw3',
                              },
                          }
                      },
                      'big-pillow-blue': {
                          id: 15,
                          key: 'big-pillow-blue',
                          imagePath: '/images/Combined/360/Solar99/Solar99-blue-beige',
                          fileName: '99_blue_beige_360_{index}.jpg',
                          previewImagePath: '/images/Combined/Zoom/Solar99/Solar99-blue-beige',
                          previewFileName: '99_blue_beige_Zoom_{index}.jpg',
                          color: 'rgb(93, 109, 119)',
                          arUrl: 'https://api-ar.letsdrnk.com/api/see-in-ar?configurator=brw_36714&scene=brw3',
                          variants: {
                              'small-pillow-beige': {
                                  id: 16,
                                  key: 'small-pillow-beige',
                                  imagePath: '/images/Combined/360/Solar99/Solar99-blue-beige',
                                  fileName: '99_blue_beige_360_{index}.jpg',
                                  previewImagePath: '/images/Combined/Zoom/Solar99/Solar99-blue-beige',
                                  previewFileName: '99_blue_beige_Zoom_{index}.jpg',
                                  color: 'rgb(171, 158, 146)',
                              },
                              'small-pillow-blue': {
                                  id: 17,
                                  key: 'small-pillow-blue',
                                  imagePath: '/images/Combined/360/Solar99/Solar99-blue-blue',
                                  fileName: '99_blue_blue_360_{index}.jpg',
                                  previewImagePath: '/images/Combined/Zoom/Solar99/Solar99-blue-blue',
                                  previewFileName: '99_blue_blue_Zoom_{index}.jpg',
                                  color: 'rgb(93, 109, 119)',
                                  arUrl: 'https://api-ar.letsdrnk.com/api/see-in-ar?configurator=brw_36714&scene=brw3',
                              },
                              'small-pillow-orange': {
                                  id: 18,
                                  key: 'small-pillow-orange',
                                  imagePath: '/images/Combined/360/Solar99/Solar99-blue-orange',
                                  fileName: '99_blue_orange_360_{index}.jpg',
                                  previewImagePath: '/images/Combined/Zoom/Solar99/Solar99-blue-orange',
                                  previewFileName: '99_blue_orange_Zoom_{index}.jpg',
                                  color: 'rgb(239, 135, 81)',
                                  arUrl: 'https://api-ar.letsdrnk.com/api/see-in-ar?configurator=brw_36714&scene=brw3',
                              },
                          }
                      }
                  },
              },
              {
                  imagePath: '/images/Combined/360/Solar70/base',
                  fileName: 'Sofa_Solar70_360_{index}.jpg',
                  previewImagePath: '/images/Combined/Zoom/Solar70/base',
                  previewFileName: 'Sofa_Solar70_Zoom_{index}.jpg',
                  color: 'rgb(86, 117, 120)',
                  variants: {
                      'big-pillow-black': {
                          id: 2,
                          key: 'big-pillow-black',
                          imagePath: '/images/Combined/360/Solar70/black-beige',
                          fileName: '70_black_beige_360_{index}.jpg',
                          previewImagePath: '/images/Combined/Zoom/Solar70/black-beige',
                          previewFileName: '70_black_beige_Zoom_{index}.jpg',
                          color: 'rgb(33, 34, 34)',
                          arUrl: 'https://api-ar.letsdrnk.com/api/see-in-ar?configurator=brw_36714&scene=brw3',
                          variants: {
                              'small-pillow-beige': {
                                  id: 4,
                                  key: 'small-pillow-beige',
                                  imagePath: '/images/Combined/360/Solar70/black-beige',
                                  fileName: '70_black_beige_360_{index}.jpg',
                                  previewImagePath: '/images/Combined/Zoom/Solar70/black-beige',
                                  previewFileName: '70_black_beige_Zoom_{index}.jpg',
                                  color: 'rgb(171, 158, 146)',
                              },
                              'small-pillow-blue': {
                                  id: 5,
                                  key: 'small-pillow-blue',
                                  imagePath: '/images/Combined/360/Solar70/black-blue',
                                  fileName: '70_black_blue_360_{index}.jpg',
                                  previewImagePath: '/images/Combined/Zoom/Solar70/black-blue',
                                  previewFileName: '70_black_blue_Zoom_{index}.jpg',
                                  color: 'rgb(93, 109, 119)',
                                  arUrl: 'https://api-ar.letsdrnk.com/api/see-in-ar?configurator=brw_36714&scene=brw3',
                              },
                              'small-pillow-orange': {
                                  id: 6,
                                  key: 'small-pillow-orange',
                                  imagePath: '/images/Combined/360/Solar70/black-orange',
                                  fileName: '70_black_orange_360_{index}.jpg',
                                  previewImagePath: '/images/Combined/Zoom/Solar70/black-orange',
                                  previewFileName: '70_black_orange_Zoom_{index}.jpg',
                                  color: 'rgb(239, 135, 81)',
                                  arUrl: 'https://api-ar.letsdrnk.com/api/see-in-ar?configurator=brw_36714&scene=brw3',
                              },
                          }
                      }
                  },
              },
              // {
              //     imagePath: '/images/Darby/Sofa/360/Solo263',
              //     fileName: 'Sofa_Solo263_360_{index}.jpg',
              //     previewImagePath: '/images/Darby/Sofa/Zoom/Solo263',
              //     previewFileName: 'Sofa_Solo263_Zoom_{index}.jpg',
              //     color: 'rgb(18, 27, 82)',
              //     arUrl: 'https://api-ar.letsdrnk.com/api/see-in-ar?configurator=brw_36714&scene=brw3',
              // }
          ],
          // bigPillows: [
              // {
              //     id: 1,
              //     imagePath: '/images/Darby/BigPillow/360/Beige',
              //     fileName: 'BP_Beige_360_{index}.png',
              //     previewImagePath: '/images/Darby/BigPillow/Zoom/Beige',
              //     previewFileName: 'BP_Beige_Zoom_{index}.png',
              //     color: 'rgb(171, 158, 146)',
              //     arUrl: 'https://api-ar.letsdrnk.com/api/see-in-ar?configurator=brw_36714&scene=brw3',
              // },
              // {
              //     id: 2,
              //     imagePath: '/images/Combined/360/Solar70/black-beige',
              //     fileName: '70_black_beige_360_{index}.jpg',
              //     previewImagePath: '/images/Combined/Zoom/Solar70/black-beige',
              //     previewFileName: '70_black_beige_Zoom_{index}.jpg',
              //     color: 'rgb(33, 34, 34)',
              //     arUrl: 'https://api-ar.letsdrnk.com/api/see-in-ar?configurator=brw_36714&scene=brw3',
              // },
              // {
              //     id: 3,
              //     imagePath: '/images/Darby/BigPillow/360/Blue',
              //     fileName: 'BP_Blue_360_{index}.png',
              //     previewImagePath: '/images/Darby/BigPillow/Zoom/Blue',
              //     previewFileName: 'BP_Blue_Zoom_{index}.png',
              //     color: 'rgb(93, 109, 119)',
              // },
          // ],
          // smallPillows: [
          //     {
          //         id: 4,
          //         imagePath: '/images/Combined/360/Solar70/black-beige',
          //         fileName: '70_black_beige_360_{index}.jpg',
          //         previewImagePath: '/images/Combined/Zoom/Solar70/black-beige',
          //         previewFileName: '70_black_beige_Zoom_{index}.jpg',
          //         color: 'rgb(171, 158, 146)',
          //     },
          //     {
          //         id: 5,
          //         imagePath: '/images/Combined/360/Solar70/black-blue',
          //         fileName: '70_black_blue_360_{index}.jpg',
          //         previewImagePath: '/images/Combined/Zoom/Solar70/black-blue',
          //         previewFileName: '70_black_blue_Zoom_{index}.jpg',
          //         color: 'rgb(93, 109, 119)',
          //         arUrl: 'https://api-ar.letsdrnk.com/api/see-in-ar?configurator=brw_36714&scene=brw3',
          //     },
          //     {
          //         id: 6,
          //         imagePath: '/images/Combined/360/Solar70/black-orange',
          //         fileName: '70_black_orange_360_{index}.jpg',
          //         previewImagePath: '/images/Combined/Zoom/Solar70/black-orange',
          //         previewFileName: '70_black_orange_Zoom_{index}.jpg',
          //         color: 'rgb(239, 135, 81)',
          //         arUrl: 'https://api-ar.letsdrnk.com/api/see-in-ar?configurator=brw_36714&scene=brw3',
          //     },
          // ],
          selectedMainVariant: 0,
          selectedBigPillow: null,
          selectedSmallPillow: null,
          layers: [],
          arUrl: 'https://api-ar.letsdrnk.com/api/see-in-ar?configurator=brw_36714&scene=brw3',
          hotspots: [6, 14, 20, 27, 32],
          selectedHotspot: null,
      }
    },

    computed: {
        bigPillows() {
            return this.mainVariants[this.selectedMainVariant].variants;
        },
        smallPillows() {
            return this.mainVariants[this.selectedMainVariant]?.variants[this.selectedBigPillow]?.variants || [];
        },
        mainVariantHotspots() {
            // const mainVariant = this.mainVariants[this.selectedMainVariant];

            return this.hotspots.map((hotspot) => {
                const imageIndex = this.lpad(hotspot, "0", 4);
                const imagePath = `${this.mainImagePath}/${this.mainFileName}`;

                return imagePath.replace('{index}', imageIndex);
            });
        },
        // bigPillowHotspots() {
        //     if (this.selectedBigPillow) {
        //         return this.hotspots.map((hotspot) => {
        //             const imageIndex = this.lpad(hotspot, "0", 4);
        //             const imagePath = `${this.selectedBigPillow.imagePath}/${this.selectedBigPillow.fileName}`;
        //
        //             return imagePath.replace('{index}', imageIndex);
        //         });
        //     }
        //
        //     return [];
        // },
        // smallPillowHotspots() {
        //     if (this.selectedSmallPillow) {
        //         return this.hotspots.map((hotspot) => {
        //             const imageIndex = this.lpad(hotspot, "0", 4);
        //             const imagePath = `${this.selectedSmallPillow.imagePath}/${this.selectedSmallPillow.fileName}`;
        //
        //             return imagePath.replace('{index}', imageIndex);
        //         });
        //     }
        //
        //     return [];
        // },
    },

    methods: {
        selectVariant(variant, index) {
            if (!this.selectedBigPillow || !variant.variants[this.selectedBigPillow]) {
                this.mainImagePath = variant.imagePath;
                this.mainFileName = variant.fileName;
                this.mainPreviewImagePath = variant.previewImagePath;
                this.mainPreviewFileName = variant.previewFileName;
                this.selectedMainVariant = index;
                this.arUrl = variant.arUrl;
            } else {
                this.selectedMainVariant = index;
                this.selectBigPillow(this.selectedBigPillow);
            }
        },
        selectBigPillow(bigPillow) {
            if (!this.selectedSmallPillow) {
                const selectedVariant = this.mainVariants[this.selectedMainVariant].variants[bigPillow];
                this.selectedBigPillow = bigPillow;

                this.mainImagePath = selectedVariant.imagePath;
                this.mainFileName = selectedVariant.fileName;
                this.mainPreviewImagePath = selectedVariant.previewImagePath;
                this.mainPreviewFileName = selectedVariant.previewFileName;
                this.arUrl = selectedVariant.arUrl;
            } else {
                this.selectedBigPillow = bigPillow;
                this.selectSmallPillow(this.selectedSmallPillow);
            }
        },
        selectSmallPillow(smallPillow) {
            this.selectedSmallPillow = smallPillow;
            // this.$set(this.layers, 1, smallPillow);

            const selectedVariant = this.mainVariants[this.selectedMainVariant]?.variants[this.selectedBigPillow]?.variants[smallPillow];

            if (selectedVariant) {
                this.mainImagePath = selectedVariant.imagePath;
                this.mainFileName = selectedVariant.fileName;
                this.mainPreviewImagePath = selectedVariant.previewImagePath;
                this.mainPreviewFileName = selectedVariant.previewFileName;
                this.arUrl = selectedVariant.arUrl;
            }
        },
        clearBigPillow() {
            this.selectedBigPillow = null;
            this.selectVariant(this.mainVariants[this.selectedMainVariant], this.selectedMainVariant);
            // this.$set(this.layers, 0, null);

            // this.clearSmallPillow();
        },
        clearSmallPillow() {
            this.selectedSmallPillow = null;

            this.selectBigPillow(this.selectedBigPillow);
            // this.$set(this.layers, 1, null);
        },
        lpad(str, padString, length) {
            str = str.toString()

            while (str.length < length) str = padString + str
            return str
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
    display: flex;
    flex-direction: column;
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

.hotspots {
    display: flex;
}

.hotspots .hotspot {
    width: 100%;
    position: relative;
    cursor: pointer;
    opacity: 0.5;
}

.hotspots .hotspot.hotspot--active {
    opacity: 1;
    border: 2px solid deepskyblue;
}

.hotspots .hotspot img {
    width: 100%;
}

.hotspots .hotspot img.hotspot--layer {
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
}
</style>
