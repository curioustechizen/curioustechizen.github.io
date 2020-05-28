'use strict';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "favicon.png": "8b1611099b8cb7e7c19a1794b6dc9888",
"assets/FontManifest.json": "580ff1a5d08679ded8fcf5c6848cece7",
"assets/LICENSE": "3d7f7f945c3c3801c91b2153153719cd",
"assets/AssetManifest.json": "fb2d7b70c5f896079ec5a358e6cbafd8",
"assets/fonts/MaterialIcons-Regular.ttf": "56d3ffdef7a25659eab6a68a3fbfaf16",
"assets/images/appicon_round.png": "ddc10882aef2dd9fc7998438e3e60926",
"assets/images/covid19india_flutter.png": "76f1b24f37e49c8b2e84dfcc63a0b085",
"main.dart.js": "0a9c9003426db5d7bfd78aa3ced790a8",
"index.html": "4dc85c47c4f0b940bc0e13aba698ca30",
"/": "4dc85c47c4f0b940bc0e13aba698ca30",
"icons/Icon-512.png": "ed748a655bdb6e3cd0adb13adbcf4fa4",
"icons/Icon-192.png": "6a6a9c85123b04257fbe2b43156d527d",
"manifest.json": "60dc356302aada4f4edee494cea8cbcb"
};

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheName) {
      return caches.delete(cacheName);
    }).then(function (_) {
      return caches.open(CACHE_NAME);
    }).then(function (cache) {
      return cache.addAll(Object.keys(RESOURCES));
    })
  );
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request)
      .then(function (response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
