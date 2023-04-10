// ==UserScript==
// @name         YourScriptName
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  YourScriptDescription
// @author       You
// @match        *://*.youtube.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const IS_YOUTUBE = window.location.hostname.search(/(?:^|.+\.)youtube\.com/) > -1 ||
                       window.location.hostname.search(/(?:^|.+\.)youtube-nocookie\.com/) > -1;
    const IS_MOBILE_YOUTUBE = window.location.hostname == 'm.youtube.com';
    const IS_DESKTOP_YOUTUBE = IS_YOUTUBE && !IS_MOBILE_YOUTUBE;

    const IS_ANDROID = window.navigator.userAgent.indexOf('Android') > -1;

    // Page Visibility API
    if (IS_ANDROID || !IS_DESKTOP_YOUTUBE) {
        Object.defineProperty(document, 'visibilityState', {
            get: () => 'visible',
            configurable: true,
        });
        Object.defineProperty(document, 'hidden', {
            get: () => false,
            configurable: true,
        });
    }

    window.addEventListener(
        'visibilitychange', evt => evt.stopImmediatePropagation(), true);

    // User activity tracking
    if (IS_YOUTUBE) {
        loop(pressKey, 60 * 1000, 10 * 1000); // every minute +/- 5 seconds
    }

    function pressKey() {
        const keyCodes = [18];
        let key = keyCodes[getRandomInt(0, keyCodes.length)];
        sendKeyEvent("keydown", key);
        sendKeyEvent("keyup", key);
    }

    function sendKeyEvent(aEvent, aKey) {
        document.dispatchEvent(new KeyboardEvent(aEvent, {
            bubbles: true,
            cancelable: true,
            keyCode: aKey,
            which: aKey,
        }));
    }

    function loop(aCallback, aDelay, aJitter) {
        let jitter = getRandomInt(-aJitter/2, aJitter/2);
        let delay = Math.max(aDelay + jitter, 0);

        window.setTimeout(() => {
            aCallback();
            loop(aCallback, aDelay, aJitter);
        }, delay);
    }

    function getRandomInt(aMin, aMax) {
        let min = Math.ceil(aMin);
        let max = Math.floor(aMax);
        return Math.floor(Math.random() * (max - min)) + min;
    }
})();
