/* ============================================================
   Flavours Pan Asian Food – fonts.js

   Loaded with "async" from the <head> of index.html.
   The Google Fonts stylesheet is linked with media="print" so it does
   not block the first paint on slow mobile connections. This switches
   it to all screens once it has downloaded (or straight away if it
   already has). Text shows in the fallback font until then
   (font-display: swap).
   ============================================================ */

/* jshint strict: global */
"use strict";

(function () {
    var link = document.getElementById("googleFonts");
    if (!link) { return; }
    function useOnAllScreens() { link.media = "all"; }
    if (link.sheet) {
        useOnAllScreens();
    } else {
        link.addEventListener("load", useOnAllScreens);
    }
}());
