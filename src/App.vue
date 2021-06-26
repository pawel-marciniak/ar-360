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
                    <img v-if="bigPillowHotspots[index]"
                         :src="bigPillowHotspots[index]"
                         class="hotspot--layer"
                    />
                    <img v-if="smallPillowHotspots[index]"
                         :src="smallPillowHotspots[index]"
                         class="hotspot--layer"
                    />
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
          mainImagePath: '/images/Darby/Sofa/360/Solar99',
          mainFileName: 'Sofa_Solar99_360_{index}.jpg',
          mainPreviewImagePath: '/images/Darby/Sofa/Zoom/Solar99',
          mainPreviewFileName: 'Sofa_Solar99_Zoom_{index}.jpg',
          mainVariants: [
              {
                  imagePath: '/images/Darby/Sofa/360/Solar99',
                  fileName: 'Sofa_Solar99_360_{index}.jpg',
                  previewImagePath: '/images/Darby/Sofa/Zoom/Solar99',
                  previewFileName: 'Sofa_Solar99_Zoom_{index}.jpg',
                  color: 'rgb(21, 21, 21)',
                  // arUrl: 'https://api-ar.letsdrnk.com/api/see-in-ar?configurator=brw_36714&scene=brw3',
              },
              {
                  imagePath: '/images/Darby/Sofa/360/Solar70',
                  fileName: 'Sofa_Solar70_360_{index}.jpg',
                  previewImagePath: '/images/Darby/Sofa/Zoom/Solar70',
                  previewFileName: 'Sofa_Solar70_Zoom_{index}.jpg',
                  color: 'rgb(86, 117, 120)',
              },
              {
                  imagePath: '/images/Darby/Sofa/360/Solo263',
                  fileName: 'Sofa_Solo263_360_{index}.jpg',
                  previewImagePath: '/images/Darby/Sofa/Zoom/Solo263',
                  previewFileName: 'Sofa_Solo263_Zoom_{index}.jpg',
                  color: 'rgb(18, 27, 82)',
                  // arUrl: 'https://api-ar.letsdrnk.com/api/see-in-ar?configurator=brw_36714&scene=brw3',
              }
          ],
          bigPillows: [
              {
                  id: 1,
                  imagePath: '/images/Darby/BigPillow/360/Beige',
                  fileName: 'BP_Beige_360_{index}.png',
                  previewImagePath: '/images/Darby/BigPillow/Zoom/Beige',
                  previewFileName: 'BP_Beige_Zoom_{index}.png',
                  color: 'rgb(171, 158, 146)',
                  // arUrl: 'https://api-ar.letsdrnk.com/api/see-in-ar?configurator=brw_36714&scene=brw3',
              },
              {
                  id: 2,
                  imagePath: '/images/Darby/BigPillow/360/Black',
                  fileName: 'BP_Black_360_{index}.png',
                  previewImagePath: '/images/Darby/BigPillow/Zoom/Black',
                  previewFileName: 'BP_Black_Zoom_{index}.png',
                  color: 'rgb(33, 34, 34)',
                  // arUrl: 'https://api-ar.letsdrnk.com/api/see-in-ar?configurator=brw_36714&scene=brw3',
              },
              {
                  id: 3,
                  imagePath: '/images/Darby/BigPillow/360/Blue',
                  fileName: 'BP_Blue_360_{index}.png',
                  previewImagePath: '/images/Darby/BigPillow/Zoom/Blue',
                  previewFileName: 'BP_Blue_Zoom_{index}.png',
                  color: 'rgb(93, 109, 119)',
              },
          ],
          smallPillows: [
              {
                  id: 4,
                  imagePath: '/images/Darby/SmallPillow/360/Beige',
                  fileName: 'SP_Beige_360_{index}.png',
                  previewImagePath: '/images/Darby/SmallPillow/Zoom/Beige',
                  previewFileName: 'SP_Beige_Zoom_{index}.png',
                  color: 'rgb(171, 158, 146)',
              },
              {
                  id: 5,
                  imagePath: '/images/Darby/SmallPillow/360/Blue',
                  fileName: 'SP_Blue_360_{index}.png',
                  previewImagePath: '/images/Darby/SmallPillow/Zoom/Blue',
                  previewFileName: 'SP_Blue_Zoom_{index}.png',
                  color: 'rgb(93, 109, 119)',
                  // arUrl: 'https://api-ar.letsdrnk.com/api/see-in-ar?configurator=brw_36714&scene=brw3',
              },
              {
                  id: 6,
                  imagePath: '/images/Darby/SmallPillow/360/Orange',
                  fileName: 'SP_Orange_360_{index}.png',
                  previewImagePath: '/images/Darby/SmallPillow/Zoom/Orange',
                  previewFileName: 'SP_Orange_Zoom_{index}.png',
                  color: 'rgb(239, 135, 81)',
                  // arUrl: 'https://api-ar.letsdrnk.com/api/see-in-ar?configurator=brw_36714&scene=brw3',
              },
          ],
          arUrls: {
              0: {
                  url: 'https://api-ar.letsdrnk.com/api/see-in-ar?configurator=46fe4e55-3aa2-410a-89c0-5aba14fe9104&scene=ace4b5c6-ac87-451a-b90c-195055cd5d5f',
                  variants: {
                      1: {
                          url: 'https://api-ar.letsdrnk.com/api/see-in-ar?configurator=46fe4e55-3aa2-410a-89c0-5aba14fe9104&scene=936f5529-1b86-4f27-9d06-b9bf63c83367',
                          variants: {
                              4: { url: 'https://api-ar.letsdrnk.com/api/see-in-ar?configurator=46fe4e55-3aa2-410a-89c0-5aba14fe9104&scene=936f5529-1b86-4f27-9d06-b9bf63c83367' },
                              5: { url: 'https://api-ar.letsdrnk.com/api/see-in-ar?configurator=46fe4e55-3aa2-410a-89c0-5aba14fe9104&scene=c3922ed6-9693-40b7-bdc4-e97d22eddb5b' },
                              6: { url: 'https://api-ar.letsdrnk.com/api/see-in-ar?configurator=46fe4e55-3aa2-410a-89c0-5aba14fe9104&scene=e4580f99-3dce-4bbc-994f-97226b4a9020' },
                          }
                      },
                      2: {
                          url: null,
                          variants: {
                              4: { url: 'https://api-ar.letsdrnk.com/api/see-in-ar?configurator=46fe4e55-3aa2-410a-89c0-5aba14fe9104&scene=02bf5b8e-c43e-434a-b1cb-ec401da749f5' },
                              5: { url: 'https://api-ar.letsdrnk.com/api/see-in-ar?configurator=46fe4e55-3aa2-410a-89c0-5aba14fe9104&scene=e98485d4-8ba0-4a92-9f72-0d428d1722a9' },
                              6: { url: 'https://api-ar.letsdrnk.com/api/see-in-ar?configurator=46fe4e55-3aa2-410a-89c0-5aba14fe9104&scene=b8579861-dcc0-4e85-b405-6e766be8e0f7' },
                          }
                      },
                      3: {
                          url: 'https://api-ar.letsdrnk.com/api/see-in-ar?configurator=46fe4e55-3aa2-410a-89c0-5aba14fe9104&scene=a19bf350-413f-4d51-b3db-0f26d3bc9115',
                          variants: {
                              4: { url: 'https://api-ar.letsdrnk.com/api/see-in-ar?configurator=46fe4e55-3aa2-410a-89c0-5aba14fe9104&scene=a0106b90-14eb-4134-a9ca-18a90ef94326' },
                              5: { url: 'https://api-ar.letsdrnk.com/api/see-in-ar?configurator=46fe4e55-3aa2-410a-89c0-5aba14fe9104&scene=a19bf350-413f-4d51-b3db-0f26d3bc9115' },
                              6: { url: 'https://api-ar.letsdrnk.com/api/see-in-ar?configurator=46fe4e55-3aa2-410a-89c0-5aba14fe9104&scene=a3963a63-504d-4485-978f-6fc0e35b26fb' },
                          }
                      },
                  }
              },
              1: {
                  url: 'https://api-ar.letsdrnk.com/api/see-in-ar?configurator=46fe4e55-3aa2-410a-89c0-5aba14fe9104&scene=29128eaf-5d0c-4f0a-98e0-79db60a9b533',
                  variants: {
                      1: {
                          url: 'https://api-ar.letsdrnk.com/api/see-in-ar?configurator=46fe4e55-3aa2-410a-89c0-5aba14fe9104&scene=7322cf81-3b2d-4540-9206-41c1d97f2fa8',
                          variants: {
                              4: { url: 'https://api-ar.letsdrnk.com/api/see-in-ar?configurator=46fe4e55-3aa2-410a-89c0-5aba14fe9104&scene=7322cf81-3b2d-4540-9206-41c1d97f2fa8' },
                              5: { url: 'https://api-ar.letsdrnk.com/api/see-in-ar?configurator=46fe4e55-3aa2-410a-89c0-5aba14fe9104&scene=f1c8dce8-b7e9-4a8f-afbe-422bd94353a2' },
                              6: { url: 'https://api-ar.letsdrnk.com/api/see-in-ar?configurator=46fe4e55-3aa2-410a-89c0-5aba14fe9104&scene=43fbaee1-bc61-4187-a29c-52719bc09ae3' },
                          }
                      },
                      2: {
                          url: null,
                          variants: {
                              4: { url: 'https://api-ar.letsdrnk.com/api/see-in-ar?configurator=46fe4e55-3aa2-410a-89c0-5aba14fe9104&scene=2b7467e7-3cc4-46f5-af67-86ba2203a817' },
                              5: { url: 'https://api-ar.letsdrnk.com/api/see-in-ar?configurator=46fe4e55-3aa2-410a-89c0-5aba14fe9104&scene=2b2d4833-d743-4ec0-ac45-e0b29ee076b4' },
                              6: { url: 'https://api-ar.letsdrnk.com/api/see-in-ar?configurator=46fe4e55-3aa2-410a-89c0-5aba14fe9104&scene=476f959a-5e09-4bfb-8d9d-437878a4beff' },
                          }
                      },
                      3: {
                          url: 'https://api-ar.letsdrnk.com/api/see-in-ar?configurator=46fe4e55-3aa2-410a-89c0-5aba14fe9104&scene=db5b4b10-6c76-43f6-bf86-6480a12e46dd',
                          variants: {
                              4: { url: 'https://api-ar.letsdrnk.com/api/see-in-ar?configurator=46fe4e55-3aa2-410a-89c0-5aba14fe9104&scene=a69ce767-5572-4ed1-bf38-12ed11901896' },
                              5: { url: 'https://api-ar.letsdrnk.com/api/see-in-ar?configurator=46fe4e55-3aa2-410a-89c0-5aba14fe9104&scene=db5b4b10-6c76-43f6-bf86-6480a12e46dd' },
                              6: { url: 'https://api-ar.letsdrnk.com/api/see-in-ar?configurator=46fe4e55-3aa2-410a-89c0-5aba14fe9104&scene=d729b104-05c2-478d-a11c-394bd4b52059' },
                          }
                      },
                  }
              },
              2: {
                  url: 'https://api-ar.letsdrnk.com/api/see-in-ar?configurator=46fe4e55-3aa2-410a-89c0-5aba14fe9104&scene=fb11f999-a848-49fa-b784-6613cb3d7cd9',
                  variants: {
                      1: {
                          url: 'https://api-ar.letsdrnk.com/api/see-in-ar?configurator=46fe4e55-3aa2-410a-89c0-5aba14fe9104&scene=59e14656-6132-412e-8b32-fbbf3f9c62ed',
                          variants: {
                              4: { url: 'https://api-ar.letsdrnk.com/api/see-in-ar?configurator=46fe4e55-3aa2-410a-89c0-5aba14fe9104&scene=59e14656-6132-412e-8b32-fbbf3f9c62ed' },
                              5: { url: 'https://api-ar.letsdrnk.com/api/see-in-ar?configurator=46fe4e55-3aa2-410a-89c0-5aba14fe9104&scene=ef3578f0-ca4a-4276-a968-fab067885ddf' },
                              6: { url: 'https://api-ar.letsdrnk.com/api/see-in-ar?configurator=46fe4e55-3aa2-410a-89c0-5aba14fe9104&scene=f2a88347-82aa-41c3-a80d-03fe4a02dc47' },
                          }
                      },
                      2: {
                          url: null,
                          variants: {
                              4: { url: 'https://api-ar.letsdrnk.com/api/see-in-ar?configurator=46fe4e55-3aa2-410a-89c0-5aba14fe9104&scene=49f8dc66-c743-4883-9892-566c9020b9f6' },
                              5: { url: 'https://api-ar.letsdrnk.com/api/see-in-ar?configurator=46fe4e55-3aa2-410a-89c0-5aba14fe9104&scene=36823826-29a4-4387-9f58-91e17e8abe3e' },
                              6: { url: 'https://api-ar.letsdrnk.com/api/see-in-ar?configurator=46fe4e55-3aa2-410a-89c0-5aba14fe9104&scene=410e9a46-408d-44ba-92b6-a0a69122ffb7' },
                          }
                      },
                      3: {
                          url: 'https://api-ar.letsdrnk.com/api/see-in-ar?configurator=46fe4e55-3aa2-410a-89c0-5aba14fe9104&scene=76a031e3-e668-417c-8410-513af916b2f8',
                          variants: {
                              4: { url: 'https://api-ar.letsdrnk.com/api/see-in-ar?configurator=46fe4e55-3aa2-410a-89c0-5aba14fe9104&scene=2f66fcae-c5dd-4d2d-9c2c-999d5770aba2' },
                              5: { url: 'https://api-ar.letsdrnk.com/api/see-in-ar?configurator=46fe4e55-3aa2-410a-89c0-5aba14fe9104&scene=76a031e3-e668-417c-8410-513af916b2f8' },
                              6: { url: 'https://api-ar.letsdrnk.com/api/see-in-ar?configurator=46fe4e55-3aa2-410a-89c0-5aba14fe9104&scene=895fe4f9-a1ca-4829-89da-b16ab236b016' },
                          }
                      },
                  }
              },
          },
          selectedMainVariant: 0,
          selectedBigPillow: null,
          selectedSmallPillow: null,
          layers: [],
          // arUrl: 'https://api-ar.letsdrnk.com/api/see-in-ar?configurator=brw_36714&scene=brw3',
          hotspots: [6, 14, 20, 27, 32],
          selectedHotspot: null,
      }
    },

    computed: {
        arUrl() {
            if (this.selectedSmallPillow) {
                return this.arUrls[this.selectedMainVariant].variants[this.selectedBigPillow.id].variants[this.selectedSmallPillow.id].url;
            } else if (this.selectedBigPillow) {
                return this.arUrls[this.selectedMainVariant].variants[this.selectedBigPillow.id].url;
            }

            return this.arUrls[this.selectedMainVariant].url;
        },
        mainVariantHotspots() {
            const mainVariant = this.mainVariants[this.selectedMainVariant];

            return this.hotspots.map((hotspot) => {
                const imageIndex = this.lpad(hotspot, "0", 4);
                const imagePath = `${mainVariant.imagePath}/${mainVariant.fileName}`;

                return imagePath.replace('{index}', imageIndex);
            });
        },
        bigPillowHotspots() {
            if (this.selectedBigPillow) {
                return this.hotspots.map((hotspot) => {
                    const imageIndex = this.lpad(hotspot, "0", 4);
                    const imagePath = `${this.selectedBigPillow.imagePath}/${this.selectedBigPillow.fileName}`;

                    return imagePath.replace('{index}', imageIndex);
                });
            }

            return [];
        },
        smallPillowHotspots() {
            if (this.selectedSmallPillow) {
                return this.hotspots.map((hotspot) => {
                    const imageIndex = this.lpad(hotspot, "0", 4);
                    const imagePath = `${this.selectedSmallPillow.imagePath}/${this.selectedSmallPillow.fileName}`;

                    return imagePath.replace('{index}', imageIndex);
                });
            }

            return [];
        },
    },

    methods: {
        selectVariant(variant, index) {
            this.mainImagePath = variant.imagePath;
            this.mainFileName = variant.fileName;
            this.mainPreviewImagePath = variant.previewImagePath;
            this.mainPreviewFileName = variant.previewFileName;
            this.selectedMainVariant = index;
            // this.arUrl = variant.arUrl;
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
