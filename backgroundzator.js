/**
 * backgroundzator Script
 * Windows 10-like background image slideshow. Transition css-controlled
 * By Arthur Annibal - WebAniversario
 * Version 0.1.0
 */

class Backgroundzator {
    /** Configuration for the slideshow */

    constructor(htmlObject, _config) {

        if (_config == null) _config = {};

        /** HTML Object to put the backgrounds */
        if (typeof htmlObject == "object") {
            this.backgroundContainer = htmlObject;
        } else if (htmlObject.indexOf('#') === 0) {
            this.backgroundContainer = document.getElementById(htmlObject.replace("#",""));
        } else if (htmlObject.indexOf('.') === 0) {
            this.backgroundContainer = document.getElementsByClassName(htmlObject.replace(".",""))[0];
        } else {
            this.backgroundContainer = document.getElementsByTagName(htmlObject)[0];
        }

        /** Time in millisseconds to display each slide */
        this.slideTime = _config.slideTime == null ? 4800 : _config.slideTime;

        /** Time to fade this to the next slide. Both appear during this time */
        this.slideTransitionTime = _config.slideTransitionTime == null ? 2200 : _config.slideTransitionTime;

        /** String containing slide transition - should be "ease" 90% of the cases */
        this.slideTransitionFunction = _config.slideTransitionFunction == null ? "ease" : _config.slideTransitionFunction;

        /** Array of strings containing only the filenames and extension. jpg recommended. */
        this.slides = _config.slides == null
                ? [ "1562/italian-landscape-mountains-nature.jpg",
                    "21787/pexels-photo.jpg",
                    "1852/dawn-landscape-mountains-nature.jpg",
                    "4019/landscape-mountains-nature-rocks.jpeg",
                    "105221/pexels-photo-105221.jpeg",
                    "230/landscape-nature-forest-trees.jpg",
                    "597/landscape-nature-sunset-clouds.jpg",
                    "7342/pexels-photo.jpeg",
                    "121192/pexels-photo-121192.jpeg",
                    "129099/pexels-photo-129099.jpeg",
                    "3256/road-landscape-mountains-nature.jpeg",
                    "129450/pexels-photo-129450.jpeg"]
                : _config.slides;

        /** FilePath to the images. "path + slide[i]" so include backslashes. */
        this.path = _config.path == null ? "https://static.pexels.com/photos/" : _config.path;

        /** True for random - shuffle the slides array every cycle, false for continuous. Will cicle throught slides array anyway. */
        this.random = _config.random == null ? true : _config.random;

        /** Screen width to stop loading backgrounds */
        this.mobileWidth = _config.mobileWidth == null ? 768 : _config.mobileWidth;

        if (_config.forceBackgroundContain == true) {
            this.forceBackgroundContain = true;
        } else {
            this.forceBackgroundContain = false;
        }

        this.precache =  _config.precache == null ? true : _config.precache;
        if (this.precache) {
            this.precacheHTMLObject = document.createElement("div");
            this.precacheHTMLObject.setAttribute("id","backgroundzator-precache-"+new Date().getTime());
            this.precacheHTMLObject.style.position = "absolute";
            this.precacheHTMLObject.style.display  = "block";
            this.precacheHTMLObject.style.top      = "0px";
            this.precacheHTMLObject.style.left     = "0px";
            this.precacheHTMLObject.style.width    = "0px";
            this.precacheHTMLObject.style.height   = "0px";
            this.precacheHTMLObject.style.opacity  = 0;
            document.body.appendChild(this.precacheHTMLObject);
        }

        if (_config.precacheAll == true) {
            if (document.body.clientWidth > this.mobileWidth) {
                var imagePrecacheAllObject = document.createElement("div")
                imagePrecacheAllObject.setAttribute("id", "backgroundzator-precache-all-container");
                for (var slideIndex = 0; slideIndex < this.slides.length; slideIndex++) {
                    var precacheImage = document.createElement("img");
                    precacheImage.setAttribute("src",this.path+this.slides[slideIndex]);
                    precacheImage.style.opacity=0;
                    precacheImage.style.width=0;
                    precacheImage.style.height=0;
                    imagePrecacheAllObject.appendChild(precacheImage);
                }
                imagePrecacheAllObject.style.opacity=0;
                imagePrecacheAllObject.style.width=0;
                imagePrecacheAllObject.style.height=0;
                if (this.precache) {
                    this.precacheHTMLObject.appendChild(imagePrecacheAllObject);
                } else {
                    document.body.appendChild(imagePrecacheAllObject);
                }
            }
        }


        /** shuffled [optional] version of this.slides */
        this.slideSequence = [];
        /** integer representing an item of slideSequence */
        this.currentSlideIndex = 0;
        /** place to keep the "setInterval" function return value. */
        this.changeBackgroundsID = 0;


        this.init();
    }

    shuffleArray(arr) {
        var aux = [];
        var len = 0;
        for (var arrIndex1 in arr) {
            aux.push(arr[arrIndex1]);
            len++;
        }
        var aux2 = [];
        for (var arrIndex2=0; arrIndex2<len; arrIndex2++) {
            aux2.push( aux.splice( Math.floor(Math.random() * (aux.length)) , 1)[0] );
        }
        return aux2;
    }

    /** Selects a new background, takes care of the sequence and changes the background */
    changeBackgrounds() {
        this.currentSlideIndex++;
        if (this.currentSlideIndex >= this.slideSequence.length) {
            this.currentSlideIndex = 0;
            if (this.random) {
                this.slideSequence = this.shuffleArray(this.slides);
                // twice because i dont trust
                this.slideSequence = this.shuffleArray(this.slideSequence);
            }
        }

        var newBackgroundImageCss = "url('"+this.path + this.slideSequence[this.currentSlideIndex]+"')";

        if (this.precache) {
            this.backgroundContainer.style.backgroundImage = this.precacheHTMLObject.style.backgroundImage;
            this.precacheHTMLObject.style.backgroundImage = newBackgroundImageCss;
        } else {
            this.backgroundContainer.style.backgroundImage = newBackgroundImageCss;
        }
    }


    init() {
        if (this.random) {
            this.slideSequence = this.shuffleArray(this.slides);
            // twice because i dont trust
            this.slideSequence = this.shuffleArray(this.slideSequence);
        } else {
            this.slideSequence = this.slides;
        }

        if (this.forceBackgroundContain) {
            this.backgroundContainer.style.backgroundSize = "cover";
            this.backgroundContainer.style.backgroundRepeat = "no-repeat";
            this.backgroundContainer.style.backgroundPosition = "50% 50%";
        }

        if (document.body.clientWidth > this.mobileWidth) {
            this.changeBackgroundsID = setInterval(this.changeBackgrounds.bind(this), this.slideTime + this.slideTransitionTime);
        }

        if (this.precache) {
           this.changeBackgrounds();
        }

        var transitionConfigCss = "background "+this.slideTransitionTime+"ms "+this.slideTransitionFunction;
        this.backgroundContainer.style.transition = transitionConfigCss;
        this.changeBackgrounds();
    }
}