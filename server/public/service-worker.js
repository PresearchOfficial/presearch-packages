"use strict";
self.addEventListener("install", function(e) {
        return self.skipWaiting();
}),
self.addEventListener("activate", function(e) {
        return self.clients.claim();
});