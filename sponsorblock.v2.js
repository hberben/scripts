// ==UserScript==
// @name        Simple Sponsor Skipper
// @namespace   Violentmonkey Scripts
// @match       *://*.youtube.com/*
// @grant       none
// @version     1.3
// @description A simple script to skip various segments using the SponsorBlock API
// ==/UserScript==

const skipSponsor = true;
const skipSelfPromotion = true;
const skipInteractionReminder = false;
const skipMusic = false;
const skipEndcards = false;
const skipIntro = false;
const skipOutro = false;
const skipPreview = false;

function fetchSponsorData(videoId) {
  const apiUrl = `https://sponsor.ajay.app/api/skipSegments?videoID=${videoId}&categories=[%22sponsor%22,%22selfpromo%22,%22interaction%22,%22music%22,%22endcards%22,%22intro%22,%22outro%22,%22preview%22]`;
  return fetch(apiUrl)
    .then((response) => response.json())
    .catch(() => {
      console.warn('Failed to fetch SponsorBlock data');
      return [];
    });
}

function skipSponsorSegments(sponsorData) {
  const video = document.querySelector('video');

  if (video) {
    const checkVideoTime = () => {
      const currentTime = video.currentTime;

      sponsorData.forEach((segment) => {
        const { segment: [startTime, endTime], category } = segment;
        if (currentTime >= startTime && currentTime < endTime) {
          const shouldSkip = {
            'sponsor': skipSponsor,
            'selfpromo': skipSelfPromotion,
            'interaction': skipInteractionReminder,
            'music': skipMusic,
            'endcards': skipEndcards,
            'intro': skipIntro,
            'outro': skipOutro,
            'preview': skipPreview,
          }[category];
          
          if (shouldSkip) {
            video.currentTime = endTime;
            video.play();
          }
        }
      });
    };

    video.ontimeupdate = checkVideoTime;
  }
}

function init() {
  const videoId = new URLSearchParams(window.location.search).get('v');

  if (videoId) {
    fetchSponsorData(videoId).then((sponsorData) => {
      if (sponsorData.length > 0) {
        skipSponsorSegments(sponsorData);
      }
    });
  }
}

init();

const observer = new MutationObserver(init);
observer.observe(document, { childList: true, subtree: true });
