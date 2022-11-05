var HeatCanvas51Layer =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["default"] = HeatCanvas51Layer;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__heatcanvas__ = __webpack_require__(1);
/**
 * Copyright 2013 Codefor <hk.yuhe@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */



function HeatCanvas51Layer(map,options){
    options = options || {};
    this._map = map;
    this.heatmap = null;
    this.setp = options.step || 1;
    this.degree = options.degree || __WEBPACK_IMPORTED_MODULE_0__heatcanvas__["a" /* default */].LINEAR;
    this.opacity = options.opacity || 0.6;
    this.colorscheme = options.colorscheme || null;
    this.data = [];
    var self = this;
    LTEvent.addListener(this._map,'mousedrag',function(){self.draw();});
    LTEvent.addListener(this._map,'click',function(){self.draw();});
}


HeatCanvas51Layer.prototype.initialize = function(map) {
    var container = document.createElement("div");
    a = this._map.getViewSize();
    var size = {width:a[0],height:a[1]}
    container.style.cssText = "position:absolute;top:0;left:0;border:0";
    container.style.width  = "100%";
    container.style.height = "100%";

    var canvas = document.createElement("canvas");
    canvas.style.width  = size.width + 'px';
    canvas.style.height = size.height + 'px';
    canvas.width = size.width;
    canvas.height= size.height;
    canvas.style.opacity = this.opacity;
    container.appendChild(canvas);

    this.heatmap = new __WEBPACK_IMPORTED_MODULE_0__heatcanvas__["a" /* default */](canvas);
    this._map.container.appendChild(container);
    this._div = container;
}

HeatCanvas51Layer.prototype.pushData = function (lat, lon,value) {
    this.data.push({"lon":lon, "lat": lat, "v": value});
}

HeatCanvas51Layer.prototype.getObject = function(){
    return this._div
}

HeatCanvas51Layer.prototype.reDraw = function(){
    return this.draw()
}

HeatCanvas51Layer.prototype.draw = function() {
    var div = this._div;
    var a = this._map.getViewSize();
    var size = {width:a[0],height:a[1]}

    var bounds = this._map.getBoundsLatLng();
    var sw = this._map.getOverLayPosition(new LTPoint(bounds.getXmin(),bounds.getYmin()));
    var ne = this._map.getOverLayPosition(new LTPoint(bounds.getXmax(),bounds.getYmax()));

    div.style.left = sw[0]+'px';
    div.style.top  = ne[1]+'px';
    div.style.width = size.width+'px';	 
    div.style.height = size.height +'px';

    this.heatmap.clear();
    if(this.data.length>0) {
        for(var i=0 , l=this.data.length;i<l;i++) {
            var latlon = new  LTPoint(this.data[i].lat, this.data[i].lon);
            var localXY = this._map.getOverLayPosition(latlon);
            this.heatmap.push(
                    Math.floor(localXY[0]-sw[0]),
                    Math.floor(localXY[1]-ne[1]),
                    this.data[i].v);
        }
    }
    this.heatmap.render(this.step, this.degree, this.colorscheme);
}


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = HeatCanvas;
/**
 * Heatmap api based on canvas
 *
 */
function HeatCanvas(canvas) {
    if (typeof(canvas) == "string") {
        this.canvas = document.getElementById(canvas);
    } else {
        this.canvas = canvas;
    }
    if (this.canvas == null) {
        return null;
    }

    this._createWorker();

    this.width = this.canvas.width;
    this.height = this.canvas.height;

    this.onRenderingStart = null;
    this.onRenderingEnd = null;

    this.data = {};
    this.value = null;
    this._valueWidth = null;
    this._valueHeight = null;
}

HeatCanvas.prototype.resize = function(w, h) {
    this.width = this.canvas.width = w;
    this.height = this.canvas.height = h;

    this.canvas.style.width = w + 'px';
    this.canvas.style.height = h + 'px';
};

HeatCanvas.prototype.push = function(x, y, data) {
    // ignore all data out of extent
    if (x < 0 || x >= this.width) {
        return ;
    }
    if (y < 0 || y >= this.height) {
        return;
    }

    var id = x+y*this.width;
    if (this.data[id]) {
        this.data[id] = this.data[id] + data;
    } else {
        this.data[id] = data;
    }
};

HeatCanvas.prototype.render = function(step, degree, f_value_color) {
    step = step || 1;
    degree = degree || HeatCanvas.LINEAR ;

    if (this.width <= 0 || this.height <= 0)
        return;

    if (this._runCounter > 0) {
        this.worker.terminate();
        this._createWorker();
    }
    this._runCounter++;

    var self = this;
    this.worker.onmessage = function(e) {
        self._runCounter--;
        self.value = e.data.value;
        self._valueWidth = e.data.width;
        self._valueHeight = e.data.height;
        self.data = {};                         // can spoil next rendering if onmessage happens between HeatCanvas.push and next render!
        self._render(f_value_color);
        if (self.onRenderingEnd) {
            self.onRenderingEnd();
        }
    }
    var msg = {
        'data': this.data,
        'width': this.width,
        'height': this.height,
        'step': step,
        'degree': degree,
        'value': this.value
    };
    this.worker.postMessage(msg);
    if (this.onRenderingStart) {
        this.onRenderingStart();
    }
};


HeatCanvas.prototype._paletteSize = 512;
HeatCanvas.prototype._defaultPalette = null;

HeatCanvas.prototype._createWorker = function() {
    this.worker = new Worker(HeatCanvas.getPath()+'heatcanvas-worker.js');
    this._runCounter = 0;
};

HeatCanvas.prototype._render = function(f_value_color) {
    var makeColor;
    if (!f_value_color) {
        this._ensureDefaultPalette();
        f_value_color = HeatCanvas.defaultValue2Color;
        var t = this;
        makeColor = function(value) { return t._defaultPalette[Math.round(value * t._paletteSize)]; };
    }
    else
        makeColor = function(value) { return HeatCanvas.hsla2rgba.apply(null, f_value_color(value)); };

    if (this.width <= 0 || this.height <= 0) {
        return;
    }

    var ctx = this.canvas.getContext("2d");
    ctx.clearRect(0, 0, this.width, this.height);

    var defaultColor = this.bgcolor || [0, 0, 0, 255];
    var canvasData = ctx.createImageData(this.width, this.height);
    for (var i=0; i<canvasData.data.length; i+=4) {
        canvasData.data[i] = defaultColor[0]; // r
        canvasData.data[i+1] = defaultColor[1];
        canvasData.data[i+2] = defaultColor[2];
        canvasData.data[i+3] = defaultColor[3];
    }

    if (!(this.value instanceof Float32Array) || this.width != this._valueWidth || this.height != this._valueHeight) {  // canvas was resized while worker was computing heatmap
        return;
    }

    var valLen = this.value.length;
    if (valLen != this._valueWidth * this._valueHeight) {
        console.error('HeatCanvas: inconsistent data w*h != len', this._valueWidth, this._valueHeight, '!=', valLen);
        return;
    }

    // maximum
    var maxValue = 0;
    for (var id = 0; id < valLen; id++) {
        if (this.value[id] > maxValue)
            maxValue = this.value[id];
    }

    // MDC ImageData:
    // data = [r1, g1, b1, a1, r2, g2, b2, a2 ...]
    for (var pos = 0, pixelColorIndex = 0; pos < valLen; pos++, pixelColorIndex += 4) {
        var color = makeColor(this.value[pos] / maxValue);

        canvasData.data[pixelColorIndex] = color[0]; //r
        canvasData.data[pixelColorIndex+1] = color[1]; //g
        canvasData.data[pixelColorIndex+2] = color[2]; //b
        canvasData.data[pixelColorIndex+3] = color[3]; //a
    }
    ctx.putImageData(canvasData, 0, 0);
};

HeatCanvas.prototype.clear = function() {
    this.data = {};
    this.value = null;

    this.canvas.getContext("2d").clearRect(0, 0, this.width, this.height);
};

HeatCanvas.prototype.exportImage = function() {
    return this.canvas.toDataURL();
};

HeatCanvas.prototype._ensureDefaultPalette = function() {
    if (this._defaultPalette && this._defaultPalette.length == this._paletteSize + 1)
        return this;

    var res = [];
    for (var j = 0; j <= this._paletteSize; j++) {
        var c = HeatCanvas.hsla2rgba.apply(null, HeatCanvas.defaultValue2Color(j / this._paletteSize));
        res[j] = new Uint8ClampedArray(4);
        res[j][0] = c[0];
        res[j][1] = c[1];
        res[j][2] = c[2];
        res[j][3] = c[3];
    }

    this._defaultPalette = res;
    return this;
}

const defaultValue2ColorResult = new Float64Array(4);
defaultValue2ColorResult[1] = 0.8;// s
defaultValue2ColorResult[3] = 1.0;// a
HeatCanvas.defaultValue2Color = function(value){
    defaultValue2ColorResult[0] = (1 - value);// h
    defaultValue2ColorResult[2] = value * 0.6;// l
    return defaultValue2ColorResult;
}

// function copied from:
// http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
const hsla2rgbaResult = new Uint8ClampedArray(4);
HeatCanvas.hsla2rgba = function(h, s, l, a){
    var r, g, b;

    if(s == 0){
        r = g = b = l;
    }else{
        function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    hsla2rgbaResult[0] = r * 255;
    hsla2rgbaResult[1] = g * 255;
    hsla2rgbaResult[2] = b * 255;
    hsla2rgbaResult[3] = a * 255;
    return hsla2rgbaResult;
}

HeatCanvas.LINEAR = 1;
HeatCanvas.QUAD = 2;
HeatCanvas.CUBIC = 3;

HeatCanvas.getPath = function() {
    var scriptTags = document.getElementsByTagName("script");
    for (var i=0; i<scriptTags.length; i++) {
        var src = scriptTags[i].src;
        var match = src.match(/heatcanvas(-[a-z0-9]{32})?\.js/);
        var pos = match ? match.index : 0;
        if (pos > 0) {
            return src.substring(0, pos);
        }
    }
    return "";
}


/***/ })
/******/ ])["default"];
//# sourceMappingURL=heatcanvas-51map.js.map