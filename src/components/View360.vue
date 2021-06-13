<template>
    <div>
        <!-- 360 Viewer Container -->
        <div class="v360-viewer-container" ref="viewerContainer" :id="identifier">

            <!-- 360 Viewer Header -->
            <slot name="header"></slot>
            <!--/ 360 Viewer Header -->

            <!-- Percentage Loader -->
            <div class="v360-viewport" v-if="!imagesLoaded">
                <div class="v360-spinner-grow"></div>
                <p ref="viewPercentage" class="v360-percentage-text"></p>
            </div>
            <!--/ Percentage Loader -->

            <!-- 360 viewport -->
            <div class="v360-viewport" ref="viewport">
                <canvas
                    class="v360-image-container"
                    ref="imageContainer"
                    v-hammer:tap="onTap"
                    v-hammer:pinch="onPinch"
                    v-hammer:pinchend="onPinch"
                    v-hammer:pinchout="onPinchOut"
                    v-hammer:pinchin="onPinchIn"
                ></canvas>
                <div class="v360-product-box-shadow"
                    v-if="boxShadow"
                    v-hammer:pinch="onPinch"
                    v-hammer:pinchend="onPinch"
                    v-hammer:pinchout="onPinchOut"
                    v-hammer:pinchin="onPinchIn"
                ></div>
            </div>
            <!--/ 360 viewport -->

            <!-- Fullscreen Button -->
            <abbr title="Fullscreen Toggle">
                <div class="v360-fullscreen-toggle text-center" @click="toggleFullScreen">
                    <div class="v360-fullscreen-toggle-btn" :class="(buttonClass == 'dark') ? 'text-light' : 'text-dark'">
                        <i :class="(!isFullScreen) ? 'fas fa-expand text-lg' : 'fas fa-compress text-lg'"></i>
                    </div>
                </div>
            </abbr>
            <!--/ Fullscreen Button -->

            <!-- Buttons Container -->
            <div id="v360-menu-btns" :class="buttonClass">
                <div class="v360-navigate-btns">
                    <div class="v360-menu-btns" @click="togglePlay" :class="(playing) ? 'v360-btn-active' : ''">
                        <i class="fa fa-play" v-if="!playing"></i>
                        <i class="fa fa-pause" v-else></i>
                    </div>
                    <div class="v360-menu-btns" @click="zoomIn" v-if="!disableZoom">
                        <i class="fa fa-search-plus"></i>
                    </div>
                    <div class="v360-menu-btns" @click="zoomOut" v-if="!disableZoom">
                        <i class="fa fa-search-minus"></i>
                    </div>
                    <div class="v360-menu-btns" @click="togglePanMode" :class="(panmode) ? 'v360-btn-active' : ''">
                        <i class="fa fa-hand-paper" v-if="!panmode"></i>
                        <span v-else>360&deg;</span>
                    </div>
                    <div class="v360-menu-btns" @click="prev">
                        <i class="fa fa-chevron-left"></i>
                    </div>
                    <div class="v360-menu-btns" @click="next">
                        <i class="fa fa-chevron-right"></i>
                    </div>
                    <div class="v360-menu-btns" @click="resetPosition">
                        <i class="fa fa-sync"></i>
                    </div>
                </div>
            </div>
            <!--/ Buttons Container -->

            <!-- Preview Modal -->
            <div id="previewModal"
                 class="modal"
                 v-show="showImagePreview"
                 @click.stop="showImagePreview = false"
            >

                <!-- Modal content -->
                <div class="modal-content" @click.stop.prevent>
                    <span class="close" @click="showImagePreview = false">&times;</span>

                    <div class="preview-image-wrapper">
                        <img :src="currentImagePreview" />
                        <img v-if="currentLayerImage"
                             :src="currentLayerImage.src"
                             class="preview-layer-image"
                        />
                    </div>
                </div>

            </div>
            <!--/ Preview Modal -->
        </div>
        <!--/ 360 Viewer Container -->
    </div>
</template>

<script>
const uuidv1 = require('uuid/v1');

export default {
    name: 'View360',
    props: {
        imagePath: {
            type: String,
            require: true,
            default: ''
        },
        fileName: {
            type: String,
            require: true,
            default: ''
        },
        bigPreviews: {
            type: Boolean,
            require: false,
            default: false
        },
        bigImagePath: {
            type: String,
            require: false,
            default: ''
        },
        bigFileName: {
            type: String,
            require: false,
            default: ''
        },
        layerImagePath: {
            type: String,
            require: false,
            default: ''
        },
        layerFileName: {
            type: String,
            require: false,
            default: ''
        },
        indexFrom: {
            type: Number,
            require: false,
            default: 1
        },
        spinReverse: {
            type: Boolean,
            require: true,
            default: false,
        },
        amount: {
            type: Number,
            require: true,
            default: 24,
        },
        autoplay: {
            type: Boolean,
            require: false,
            default: false
        },
        loop: {
            type: Number,
            require: false,
            default: 1
        },
        boxShadow: {
            type: Boolean,
            require: false,
            default: false
        },
        buttonClass: {
            type: String,
            require: false,
            default: 'light'
        },
        hotspots: {
            type: Array,
            require: true,
            default: () => []
        },
        identifier: {
            type: String,
            require: true,
            default: () => uuidv1()
        },
        paddingIndex: {
            type: Boolean,
            require: false,
            default: false
        },
        paddingSize: {
            type: Number,
            require: false,
            default: 2
        },
        disableZoom: {
            type: Boolean,
            require: false,
            default: false
        },
        scrollImage: {
            type: Boolean,
            require: false,
            default: false
        }
    },
    data(){
        return {
            minScale: 0.5,
            maxScale: 4,
            scale: 0.2,
            customOffset: 10,
            currentScale: 1.0,
            currentTopPosition: 0,
            currentLeftPosition: 0,
            selectMenuOption: 1,
            currentImage: null,
            dragging: false,
            canvas: null,
            ctx: null,
            dragStart: null,
            lastX: 0,
            lastY: 0,
            currentCanvasImage: null,
            currentLayerImage: null,
            isFullScreen: false,
            viewPortElementWidth: null,
            movementStart: 0,
            movement: false,
            dragSpeed: 150,
            speedFactor: 13,
            activeImage: 1,
            stopAtEdges: false,
            imagesLoaded: false,
            loadedImages: 0,
            centerX: 0,
            centerY: 0,
            panmode: false,
            isMobile: false,
            currentLoop: 0,
            loopTimeoutId: 0,
            images: [],
            layerImages: [],
            imageData: [],
            layerImageData: [],
            playing: false,
            currentImagePreview: null,
            showImagePreview: false
        }
    },
    watch: {
        currentLeftPosition(){
            this.redraw()
        },
        currentTopPosition(){
            this.redraw()
        },
        viewPortElementWidth(){
            this.update()
        },
        panmode(){
            this.attachEvents()
        },
        isFullScreen(value){
            if(!value){
                //exit full screen
                this.$refs.viewerContainer.classList.remove('v360-main')
                this.$refs.viewerContainer.classList.remove('v360-fullscreen')
                /* this.$refs.enterFullScreenIcon.style.display = 'block'
                this.$refs.leaveFullScreenIcon.style.display = 'none' */
            }else{
                //enter full screen
                this.$refs.viewerContainer.classList.add('v360-main')
                this.$refs.viewerContainer.classList.add('v360-fullscreen')
                /* this.$refs.enterFullScreenIcon.style.display = 'none'
                this.$refs.leaveFullScreenIcon.style.display = 'block' */

            }
            this.setImage()
        },
        playing(value){
            if(value){
                this.play()
            }else{
                this.stop()
            }
        },
        layerImagePath() {
            this.fetchLayerData();
            this.update();
        },
        layerFileName() {
            this.fetchLayerData();
            this.update();
        }
    },

    mounted(){
        //this.toggleFullScreen()
        this.fetchData();
        this.fetchLayerData();
        document.addEventListener('fullscreenchange', this.exitHandler);
        document.addEventListener('webkitfullscreenchange', this.exitHandler);
        document.addEventListener('mozfullscreenchange', this.exitHandler);
        document.addEventListener('MSFullscreenChange', this.exitHandler);
    },

    methods: {
      onTap() {
          if (this.bigPreviews) {
              const imageIndex = (this.paddingIndex) ? this.lpad((this.activeImage - 1), "0", this.paddingSize) : (this.activeImage - 1);
              const fileName = this.bigFileName.replace('{index}', imageIndex);

              this.currentImagePreview = `${this.bigImagePath}/${fileName}`;
              this.showImagePreview = true;
          }
      },
        initData(){
            this.checkMobile()
            this.loadInitialImage()

            this.canvas = this.$refs.imageContainer
            this.ctx = this.canvas.getContext('2d')
            this.attachEvents();
            window.addEventListener('resize', this.resizeWindow);
            this.resizeWindow()

            this.playing = this.autoplay
        },

        fetchData() {
            for (let i = this.indexFrom; i <= (this.amount + (this.indexFrom - 1)); i++) {
                const imageIndex = (this.paddingIndex) ? this.lpad(i, "0", this.paddingSize) : i
                const fileName = this.fileName.replace('{index}', imageIndex);
                const filePath = `${this.imagePath}/${fileName}`;
                this.imageData.push(filePath);
            }

            this.preloadImages()
        },

        fetchLayerData() {
            this.layerImageData = [];

            if (this.layerImagePath && this.layerFileName) {
                for (let i = this.indexFrom; i <= (this.amount + (this.indexFrom - 1)); i++) {
                    const imageIndex = (this.paddingIndex) ? this.lpad(i, "0", this.paddingSize) : i
                    const fileName = this.layerFileName.replace('{index}', imageIndex);
                    const filePath = `${this.layerImagePath}/${fileName}`;
                    this.layerImageData.push(filePath);
                }

                this.preloadLayerImages();
            }
        },

        lpad(str, padString, length) {
            str = str.toString()

            while (str.length < length) str = padString + str
            return str
        },

        preloadImages() {
            if (this.imageData.length) {
                try {
                    // this.amount = this.imageData.length;
                    this.imageData.forEach(src => {
                        this.addImage(src);
                    });
                } catch (error) {
                    console.error(`Something went wrong while loading images: ${error.message}`);
                }
            } else {
                console.log('No Images Found')
            }
        },

        preloadLayerImages() {
            if (this.layerImageData.length) {
                try {
                    this.layerImages = [];
                    // this.amount = this.layerImageData.length;
                    this.layerImageData.forEach(src => {
                        this.addLayerImage(src);
                    });
                } catch (error) {
                    console.error(`Something went wrong while loading images: ${error.message}`);
                }
            } else {
                console.log('No Images Found')
            }
        },

        addImage(resultSrc){
            const image = new Image();

            image.src = resultSrc;
            //image.crossOrigin='anonymous'
            image.onload = this.onImageLoad.bind(this);
            image.onerror = this.onImageLoad.bind(this);

            this.images.push(image);
        },

        addLayerImage(resultSrc){
            const image = new Image();

            image.src = resultSrc;

            this.layerImages.push(image);
        },

        onImageLoad(event) {
            const percentage = Math.round(this.loadedImages / this.amount * 100);

            this.loadedImages += 1;
            this.updatePercentageInLoader(percentage);

            if (this.loadedImages === this.amount) {
                this.onAllImagesLoaded(event);
            } else if (this.loadedImages === 1) {
                //this.onFirstImageLoaded(event);
                console.log('load first image')
            }
        },

        updatePercentageInLoader(percentage) {
            /* if (this.loader) {
                this.loader.style.width = percentage + '%';
            }

            if (this.view360Icon) {
                this.view360Icon.innerText = percentage + '%';
            } */

            this.$refs.viewPercentage.innerHTML = percentage + '%';
            //console.log(percentage + '%')
        },

        onAllImagesLoaded(){
            this.imagesLoaded = true
            this.initData()
        },

        togglePlay(){
            this.playing = !this.playing
        },

        play(){
            this.loopTimeoutId = window.setInterval(() => this.loopImages(), 100);
        },

        onSpin() {
            if (this.playing || this.loopTimeoutId) {
                this.stop();
            }
        },

        stop() {
            if(this.activeImage === 1){
                this.currentLoop = 0
            }
            this.playing = false;
            window.clearTimeout(this.loopTimeoutId);
        },

        loopImages() {
            if(this.activeImage === 1){
                if(this.currentLoop === this.loop){
                    this.stop()
                }
                else{
                    this.currentLoop++

                    this.next()
                }
            }
            else{
                this.next()
            }
        },

        next() {
            (this.spinReverse) ? this.turnLeft() : this.turnRight()
        },

        prev() {
            (this.spinReverse) ? this.turnRight() : this.turnLeft()
        },

        turnLeft(){
            this.moveActiveIndexDown(1);
        },

        turnRight(){
            this.moveActiveIndexUp(1);
        },

        loadImages(){
            console.log('load image')
        },

        checkMobile(){
            this.isMobile = !!('ontouchstart' in window || navigator.msMaxTouchPoints);
        },

        loadInitialImage(){
            this.currentImage = this.imageData[0]
            this.setImage()
        },

        resizeWindow(){
            this.setImage()
        },

        onPinch(){
            console.log('on tap')
        },

        onPinchEnd(){
            this.tempScale = 0
        },

        onPinchIn(){
            //alert('pinchin:' + evt.scale)
            this.zoomOut()
        },

        onPinchOut(){
            this.zoomIn()
        },

        attachEvents(){
            if(this.panmode){
                this.bindPanModeEvents()
            }else{
                this.bind360ModeEvents()
            }
        },

        bindPanModeEvents(){
            this.$refs.viewport.removeEventListener('touchend', this.touchEnd);
            this.$refs.viewport.removeEventListener('touchstart', this.touchStart);
            this.$refs.viewport.removeEventListener('touchmove', this.touchMove);

            this.$refs.viewport.addEventListener('touchend', this.stopDragging);
            this.$refs.viewport.addEventListener('touchstart', this.startDragging);
            this.$refs.viewport.addEventListener('touchmove', this.doDragging);

            this.$refs.viewport.removeEventListener('mouseup', this.stopMoving);
            this.$refs.viewport.removeEventListener('mousedown', this.startMoving);
            this.$refs.viewport.removeEventListener('mousemove', this.doMoving);

            this.$refs.viewport.addEventListener('mouseup', this.stopDragging);
            this.$refs.viewport.addEventListener('mousedown', this.startDragging);
            this.$refs.viewport.addEventListener('mousemove', this.doDragging);

            this.$refs.viewport.addEventListener('wheel', this.onScroll);
        },

        bind360ModeEvents(){
            this.$refs.viewport.removeEventListener('touchend', this.stopDragging);
            this.$refs.viewport.removeEventListener('touchstart', this.startDragging);
            this.$refs.viewport.removeEventListener('touchmove', this.doDragging);

            this.$refs.viewport.addEventListener('touchend', this.touchEnd);
            this.$refs.viewport.addEventListener('touchstart', this.touchStart);
            this.$refs.viewport.addEventListener('touchmove', this.touchMove);

            this.$refs.viewport.removeEventListener('mouseup', this.stopDragging);
            this.$refs.viewport.removeEventListener('mousedown', this.startDragging);
            this.$refs.viewport.removeEventListener('mousemove', this.doDragging);

            this.$refs.viewport.addEventListener('mouseup', this.stopMoving);
            this.$refs.viewport.addEventListener('mousedown', this.startMoving);
            this.$refs.viewport.addEventListener('mousemove', this.doMoving);

            this.$refs.viewport.addEventListener('wheel', this.onScroll);
        },

        togglePanMode(){
            this.panmode = !this.panmode
        },

        zoomIn() {
            if(this.disableZoom) return;

            this.lastX = this.centerX;
            this.lastY = this.centerY
            this.zoom(2)
        },

        zoomOut() {
            if(this.disableZoom) return;

            this.lastX = this.centerX;
            this.lastY = this.centerY
            this.zoom(-2)
        },

        moveLeft() {
            this.currentLeftPosition += this.customOffset;
        },

        moveRight() {
            this.currentLeftPosition -= this.customOffset;
        },

        moveUp() {
            this.currentTopPosition += this.customOffset;
        },

        moveDown() {
            this.currentTopPosition -= this.customOffset;
        },

        resetPosition(){
            this.currentScale = 1
            this.activeImage = 1
            this.setImage(true)
        },

        setImage(cached = false) {
            this.currentLeftPosition = this.currentTopPosition = 0

            if (!cached) {
                this.currentCanvasImage = new Image()
                this.currentCanvasImage.crossOrigin='anonymous'
                this.currentCanvasImage.src = this.currentImage

                this.currentCanvasImage.onload = () => {
                    let viewportElement = this.$refs.viewport.getBoundingClientRect()
                    this.canvas.width  = (this.isFullScreen) ? viewportElement.width : this.currentCanvasImage.width
                    this.canvas.height = (this.isFullScreen) ? viewportElement.height : this.currentCanvasImage.height
                    this.trackTransforms(this.ctx)

                    this.redraw()
                }

                this.currentCanvasImage.onerror = () => {
                    console.log('cannot load this image')
                }
            } else {
                this.currentCanvasImage = this.images[0]
                let viewportElement = this.$refs.viewport.getBoundingClientRect()
                this.canvas.width  = (this.isFullScreen) ? viewportElement.width : this.currentCanvasImage.width
                this.canvas.height = (this.isFullScreen) ? viewportElement.height : this.currentCanvasImage.height
                this.trackTransforms(this.ctx)

                this.redraw();
            }

        },

        redraw() {
            try {
                let p1 = this.ctx.transformedPoint(0,0);
                let p2 = this.ctx.transformedPoint(this.canvas.width,this.canvas.height)

                let hRatio = this.canvas.width / this.currentCanvasImage.width
                let vRatio =  this.canvas.height / this.currentCanvasImage.height
                let ratio  = Math.min(hRatio, vRatio);
                let centerShift_x = (this.canvas.width - this.currentCanvasImage.width*ratio )/2
                let centerShift_y = (this.canvas.height - this.currentCanvasImage.height*ratio )/2
                this.ctx.clearRect(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y);

                this.centerX = this.currentCanvasImage.width*ratio/2
                this.centerY = this.currentCanvasImage.height*ratio/2

                //center image
                this.ctx.drawImage(
                    this.currentCanvasImage,
                    this.currentLeftPosition,
                    this.currentTopPosition,
                    this.currentCanvasImage.width,
                    this.currentCanvasImage.height,
                    centerShift_x,
                    centerShift_y,
                    this.currentCanvasImage.width * ratio,
                    this.currentCanvasImage.height * ratio
                );

                this.addHotspots();
                this.addLayer();
            } catch(e){
                this.trackTransforms(this.ctx)
            }

        },

        addHotspots(){
            this.clearHotspots()

            let currentImageHotspots = this.hotspots.filter(h => h.frame == this.activeImage)

            for(let c in currentImageHotspots){
                let hotspotElement = currentImageHotspots[c]

                let hotspotPositionX, hotspotPositionY

                if(this.canvas.width > this.$refs.viewport.clientWidth){
                    /* hotspotPositionX = hotspotElement.x * this.$refs.viewport.clientWidth * this.currentScale
                    hotspotPositionY = hotspotElement.y * this.$refs.viewport.clientHeight * this.currentScale */
                    hotspotPositionX = hotspotElement.x * this.$refs.viewport.clientWidth
                    hotspotPositionY = hotspotElement.y * this.$refs.viewport.clientHeight
                }else{
                    hotspotPositionX = hotspotElement.x * this.canvas.width
                    hotspotPositionY = hotspotElement.y * this.canvas.height
                }

                let divElement = document.createElement('div')
                let spanElement = document.createElement('span')
                let imgElement = document.createElement('img')

                imgElement.className = 'hotspot-icon'
                imgElement.src = hotspotElement.icon
                spanElement.className = 'tooltiptext'
                spanElement.innerHTML = hotspotElement.text
                divElement.className = 'tooltip'
                divElement.style.left = hotspotPositionX + 'px'
                divElement.style.top = hotspotPositionY + 'px'
                divElement.appendChild(imgElement)
                divElement.appendChild(spanElement)

                imgElement.addEventListener('click', (e) => {
                    e.preventDefault()
                    console.log('show edit hotspot form')
                    this.selectedHotspot = hotspotElement
                    this.openHotspotForm(true)
                })

                if(hotspotElement.action){
                    console.log('add this function: ' + hotspotElement.action)
                }

                this.$refs.viewport.appendChild(divElement)
                //console.log('draw')
                //this.ctx.drawImage(this.currentCanvasImage, hotspotElement.x*this.canvas.width, hotspotElement.y*this.canvas.height, 10, 10)
            }
        },

        addLayer() {
          if (this.currentLayerImage) {
              let hRatio = this.canvas.width / this.currentLayerImage.width;
              let vRatio =  this.canvas.height / this.currentLayerImage.height;
              let ratio  = Math.min(hRatio, vRatio);
              let centerShift_x = (this.canvas.width - this.currentLayerImage.width * ratio ) / 2;
              let centerShift_y = (this.canvas.height - this.currentLayerImage.height * ratio ) / 2;

              //center image
              this.ctx.drawImage(
                  this.currentLayerImage,
                  this.currentLeftPosition,
                  this.currentTopPosition,
                  this.currentLayerImage.width,
                  this.currentLayerImage.height,
                  centerShift_x,
                  centerShift_y,
                  this.currentLayerImage.width * ratio,
                  this.currentLayerImage.height * ratio
              );
          }
        },

        clearHotspots(){
            let hotspotButtons = document.getElementById(this.identifier).querySelectorAll('.tooltip')

            if(hotspotButtons.length)
                hotspotButtons.forEach(element => element.remove())
        },

        onMove(pageX){
            if (pageX - this.movementStart >= this.speedFactor) {
                let itemsSkippedRight = Math.floor((pageX - this.movementStart) / this.speedFactor) || 1;

                this.movementStart = pageX;

                if (this.spinReverse) {
                    this.moveActiveIndexDown(itemsSkippedRight);
                } else {
                    this.moveActiveIndexUp(itemsSkippedRight);
                }

                this.redraw();

            } else if (this.movementStart - pageX >= this.speedFactor) {

                let itemsSkippedLeft = Math.floor((this.movementStart - pageX) / this.speedFactor) || 1;

                this.movementStart = pageX;

                if (this.spinReverse) {
                    this.moveActiveIndexUp(itemsSkippedLeft);
                } else {
                    this.moveActiveIndexDown(itemsSkippedLeft);
                }

                this.redraw();
            }
        },

        startMoving(evt){
            this.movement = true
            this.movementStart = evt.pageX;
            this.$refs.viewport.style.cursor = 'grabbing';
        },

        doMoving(evt){
            if(this.movement){
                this.onMove(evt.clientX)
            }
        },

        onScroll(evt){
            evt.preventDefault();

            if(this.disableZoom || this.scrollImage){
                if(evt.deltaY < 0){
                    this.moveActiveIndexDown(1);
                }else{
                    this.moveActiveIndexUp(1);
                }
                this.onMove(evt.scrollTop);
            }else{
                this.zoomImage(evt);
            }
        },

        moveActiveIndexUp(itemsSkipped) {

            if (this.stopAtEdges) {
                if (this.activeImage + itemsSkipped >= this.amount) {
                    this.activeImage = this.amount;
                } else {
                    this.activeImage += itemsSkipped;
                }
            } else {
                this.activeImage = (this.activeImage + itemsSkipped) % this.amount || this.amount;
            }

            this.update()
        },

        moveActiveIndexDown(itemsSkipped) {

            if (this.stopAtEdges) {
                if (this.activeImage - itemsSkipped <= 1) {
                    this.activeImage = 1;
                } else {
                    this.activeImage -= itemsSkipped;
                }
            } else {
                if (this.activeImage - itemsSkipped < 1) {
                    this.activeImage = this.amount + (this.activeImage - itemsSkipped);
                } else {
                    this.activeImage -= itemsSkipped;
                }
            }

            this.update()
        },

        update() {
            const image = this.images[this.activeImage - 1];
            const layerImage = this.layerImages.length > 0 ? this.layerImages[this.activeImage - 1] : null;

            this.currentCanvasImage = image
            this.currentLayerImage = layerImage

            if (this.currentLayerImage) {
                this.currentLayerImage.onload = () => {
                    this.redraw();
                }
            }

            this.redraw();
        },

        stopMoving(){
            this.movement = false
            this.movementStart = 0
            this.$refs.viewport.style.cursor = 'grab'
        },

        touchStart(evt){
            this.movementStart = evt.touches[0].clientX
        },

        touchMove(evt){
            this.onMove(evt.touches[0].clientX)
        },

        touchEnd(){
            this.movementStart = 0
        },

        startDragging(evt){
            this.dragging = true
            document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';
            if  (this.isMobile) {
              this.lastX = evt.touches[0].offsetX || (evt.touches[0].pageX - this.canvas.offsetLeft);
              this.lastY = evt.touches[0].offsetY || (evt.touches[0].pageY - this.canvas.offsetTop);
            } else  {
              this.lastX = evt.offsetX || (evt.pageX - this.canvas.offsetLeft);
              this.lastY = evt.offsetY || (evt.pageY - this.canvas.offsetTop);
            }
          this.dragStart = this.ctx.transformedPoint(this.lastX,this.lastY);
        },

        doDragging(evt){
            if (this.isMobile) {
                this.lastX = evt.touches[0].offsetX || (evt.touches[0].pageX - this.canvas.offsetLeft);
                this.lastY = evt.touches[0].offsetY || (evt.touches[0].pageY - this.canvas.offsetTop);
            } else {
                this.lastX = evt.offsetX || (evt.pageX - this.canvas.offsetLeft);
                this.lastY = evt.offsetY || (evt.pageY - this.canvas.offsetTop);
            }

            if (this.dragStart) {
				let pt = this.ctx.transformedPoint(this.lastX,this.lastY);
				this.ctx.translate(pt.x-this.dragStart.x,pt.y-this.dragStart.y);
                //redraw();
                this.redraw();
            }
        },

        stopDragging(){
            this.dragging = false
            this.dragStart = null
        },

        restrictScale(){
            let scale = this.currentScale;

            if (scale < this.minScale) {
                scale = this.minScale;
            } else if (scale > this.maxScale) {
                scale = this.maxScale;
            }

            return scale;
        },

        zoom(clicks){
            //console.log(this.lastX + ' - ' + this.lastY)
            let factor = Math.pow(1.01,clicks);
            //console.log(factor)

            if(factor > 1){
                this.currentScale += factor
            }else{
                if(this.currentScale-factor > 1)
                    this.currentScale -= factor
                else
                    this.currentScale = 1
            }

            if(this.currentScale > 1){
                let pt = this.ctx.transformedPoint(this.lastX,this.lastY);
                this.ctx.translate(pt.x,pt.y);

                //console.log(this.currentScale)
                this.ctx.scale(factor,factor);
                this.ctx.translate(-pt.x,-pt.y);
                this.redraw();
            }
        },

        zoomImage(evt){
            if(this.disableZoom) return;

            this.lastX = evt.offsetX || (evt.pageX - this.canvas.offsetLeft);
            this.lastY = evt.offsetY || (evt.pageY - this.canvas.offsetTop);

            var delta = evt.wheelDelta ? evt.wheelDelta/40 : evt.deltaY ? -evt.deltaY : 0;

			if (delta) this.zoom(delta);
            return evt.preventDefault() && false;

        },

        trackTransforms(ctx){

            return new Promise(resolve => {
                var svg = document.createElementNS("http://www.w3.org/2000/svg",'svg');
                var xform = svg.createSVGMatrix();
                this.ctx.getTransform = function(){ return xform; };

                var savedTransforms = [];
                var save = ctx.save;
                this.ctx.save = () => {
                    savedTransforms.push(xform.translate(0,0));
                    return save.call(this.ctx);
                };
                var restore = ctx.restore;
                this.ctx.restore = () => {
                    xform = savedTransforms.pop();
                    return restore.call(this.ctx);
                };

                var scale = this.ctx.scale;
                this.ctx.scale = (sx,sy) => {
                    xform = xform.scaleNonUniform(sx,sy);
                    return scale.call(this.ctx,sx,sy);
                };
                var rotate = this.ctx.rotate;
                this.ctx.rotate = (radians) => {
                    xform = xform.rotate(radians*180/Math.PI);
                    return rotate.call(this.ctx,radians);
                };
                var translate = this.ctx.translate;
                this.ctx.translate = (dx,dy) => {
                    xform = xform.translate(dx,dy);
                    return translate.call(this.ctx,dx,dy);
                };
                var transform = this.ctx.transform;
                this.ctx.transform = (a,b,c,d,e,f) => {
                    var m2 = svg.createSVGMatrix();
                    m2.a=a; m2.b=b; m2.c=c; m2.d=d; m2.e=e; m2.f=f;
                    xform = xform.multiply(m2);
                    return transform.call(this.ctx,a,b,c,d,e,f);
                };
                var setTransform = this.ctx.setTransform;
                this.ctx.setTransform = (a,b,c,d,e,f) => {
                    xform.a = a;
                    xform.b = b;
                    xform.c = c;
                    xform.d = d;
                    xform.e = e;
                    xform.f = f;
                    return setTransform.call(this.ctx,a,b,c,d,e,f);
                };
                var pt  = svg.createSVGPoint();
                this.ctx.transformedPoint = (x,y) => {
                    pt.x=x; pt.y=y;
                    return pt.matrixTransform(xform.inverse());
                }

                resolve(this.ctx)
            })

        },

        toggleFullScreen(){
            this.isFullScreen = !this.isFullScreen
        },
    }
}
</script>

<style>
.v360-viewer-container {
    position: relative;
}

.v360-main {
  width: 100%;
  height: 100%;
  max-width: 1024px;
  margin: 20px auto;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  align-content: stretch;
}

/* HEADER */

.v360-header {
  /* width: calc(100% - 20px); */
  background-color: #000;
  padding: 10px;
  color: #FFFFFF;
  font-size: 1.5em;
  text-align: center;
  font-weight: bold;
  /* text-shadow: 1px 1px #000000; */
  flex: 0 1 auto;
}

/* VIEWER */

#productInsert {
  background-color: #FFF;
  width: 100%;
  height: calc(100vh - 184px);
  max-height: 768px;
  position: relative;
  overflow: hidden;
}

.v360-fullscreen #productInsert {
  height: 100vh;
  max-height: none;
}

#viewport-wrapper {
  width: 100%;
  height: calc(100% - 10px);
  margin: 5px auto;
  position: absolute;
  left: 0;
  transition: width 0.3s ease;
}
.v360-viewport {
  background-color: #FFF;
  width: 100%;
  height: 100%;
  overflow: hidden;
  /* position: absolute; */
  left: 0;
  /* transition: width 0.3s ease; */
  display: flex;
  justify-content: center;
  align-items: center;
}

#viewport-wrapper.wide {
  width: 100%;
}

.v360-viewport iframe {
  width: 100%;
  height: 100%;
  position: relative;
  /* left: 50%;
  -webkit-transform: translateX(-50%) translateY(0);
  -ms-transform: translateX(-50%) translateY(0);
  transform: translateX(-50%) translateY(0);
  transform-origin: center center; */
}

.v360-viewport img {
  position: relative;
}


/* FULLSCREEN & MENU TOGGLE BUTTONS */

.v360-fullscreen-toggle{
  width: 30px;
  height: 30px;
  margin: 15px;
  position: absolute;
  /* color: #999;
  fill: #999; */
  float: right;
  cursor: pointer;
  top: 0;
  right: 0;
  z-index: 150;
}

.v360-fullscreen-toggle:hover {
  fill: #000;
}
/*
.v360-fullscreen-toggle div:last-child {
    display: none;
} */

.v360-fullscreen {
  z-index: 9999;
  width: 100%;
  max-width: none;
  height: 100%;
  margin: 0;
  padding: 0;
  position: fixed;
  top: 0;
  left: 0;
}

.v360-fullscreen .v360-header,
.v360-fullscreen #v360-menu-btns {
  border-radius: 0;
}

.v360-fullscreen productInsert {
  height: calc(100vh - 95px);
  max-height: none;
}

.ui-accordion-header {
  background-color: #B0BEC5;
  outline: none;
  line-height: 1.5em;
  transition: all 0.3s ease;
}

.ui-accordion-header:hover,
.ui-accordion-header.ui-state-active {
  background-color: #607D8B;
  color: #FFF;
}

/* MENU BUTTONS */

#v360-menu-btns {
  width: 100%;
  padding: 5px 0;
  text-align: center;
  /* position: absolute; */
  bottom: 0;
  display: flex;
  justify-content: center;
  z-index: 150;
}

.light{
  background-color: #fff !important;
}

.dark{
  background-color: #000 !important;
}

.v360-menu-btns {
  /* background-color: #999; */
  width: auto;
  min-height: 20px;
  margin: 5px 5px;
  padding: 5px 10px;
  border-radius: 5px;
  outline: none;
  font-size: 1.3em;
  text-align: center;
  line-height: 1em;
  cursor: pointer;
  user-select: none;
  position: relative;
  display: inline-block;
  opacity: 1;
}
/*
.v360-btn-active{
    background-color: #000;
} */

.light .v360-menu-btns {
  color: #000;
}

.dark .v360-menu-btns {
  color: #fff;
}

/* .light .v360-btn-active{
    color: #fff;
} */

.light .v360-menu-btns:hover {
  color: #fff;
  background-color: #000;
}

.dark .v360-menu-btns:hover {
  color: #000;
  background-color: #fff;
}

.v360-main {
  filter: alpha(opacity=50);
  /* opacity: 0.5; */
  cursor: default;
  /* pointer-events: none; */
}

#v360-image-container {
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  position: relative;
}

.v360-image-container {
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  position: relative;
}

.v360-product-box-shadow{
  position: absolute;
  /* z-index: 99; */
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  box-shadow: rgb(34, 34, 34) 0px 0px 100px inset;
}

.v360-fullscreen-toggle-btn i{
  /* background-color: #fff; */
  font-size: 20px;
}
.v360-spinner-grow{
  display: inline-block;
  width: 2rem;
  height: 2rem;
  vertical-align: text-bottom;
  background-color: rgb(33, 37, 41);
  border-radius: 50%;
  opacity: 0;
  -webkit-animation: spinner-grow .75s linear infinite;
  animation: spinner-grow .75s linear infinite;
}
.v360-percentage-description{
  margin-left: 2rem;
}


/* Tooltip */

.tooltip {
  position: relative;
  display: inline-block;
}

.tooltip .tooltiptext {
  visibility: hidden;
  width: 120px;
  background-color: #555;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 0;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  margin-left: -60px;
  opacity: 0;
  transition: opacity 0.3s;
}

.tooltip .tooltiptext::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #555 transparent transparent transparent;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
  opacity: 1;
}

.tooltip{
  opacity: 1 !important;
}

/* .hotspot-button{
    position: absolute;
} */

.modal {
    position: fixed; /* Stay in place */
    z-index: 200; /* Sit on top */
    left: 0;
    top: 0;
    width: 100%; /* Full width */
    height: 100%; /* Full height */
    overflow: auto; /* Enable scroll if needed */
    background-color: rgb(0,0,0); /* Fallback color */
    background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
}

/* Modal Content/Box */
.modal-content {
    background-color: #fefefe;
    margin: 15% auto; /* 15% from the top and centered */
    padding: 20px;
    border: 1px solid #888;
    width: 80%; /* Could be more or less, depending on screen size */
}

/* The Close Button */
.close {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
}

.close:hover,
.close:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
}

#previewModal img {
    width: 100%;
}

#previewModal .preview-image-wrapper {
    position: relative;
    clear: both;
}

#previewModal .preview-image-wrapper .preview-layer-image {
    position: absolute;
    left: 0;
    top: 0;
}
</style>
