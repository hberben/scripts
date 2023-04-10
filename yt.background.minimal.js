// ==UserScript==

// @name YouTube Background Playback

// @namespace http://tampermonkey.net/

// @version 1.0

// @description Keep YouTube videos playing in the background

// @author You

// @match *://www.youtube.com/*

// @grant none

// ==/UserScript==


(function() {

    'use strict';


    Object.defineProperty(document, "hidden", {

        value: false,

        writable: false

    });


    Object.defineProperty(document, "visibilityState", {

        value: "visible",

        writable: false

    });


    document.addEventListener("visibilitychange", function(event) {

        event.stopImmediatePropagation();

    }, true);

})();


