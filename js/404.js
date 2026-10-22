/* ============================================================
   Flavours Pan Asian Food – 404.js
   Countdown and redirect for the 404 page (moved out of an inline
   <script> block in 404.html).
   ============================================================ */

/* Auto-redirect countdown (Unit 2, Merit M(ii))
   window.location.replace() replaces the current history entry so
   the browser Back button cannot return the user to the 404 page.
   This satisfies the requirement that "users directed to a non-existent
   page must be redirected back to the main page without using the
   browser navigation buttons." */
(function () {
  "use strict";
  var remaining = 5;
  var secEl = document.getElementById("sec");

  var timer = setInterval(function () {
    remaining -= 1;
    if (secEl) { secEl.textContent = remaining; }
    if (remaining <= 0) {
      clearInterval(timer);
      window.location.replace("/");
    }
  }, 1000);

  /* Manual button click also uses replace() to prevent back-navigation
     returning to the 404 page. */
  var homeBtn = document.getElementById("homeBtn");
  if (homeBtn) {
    homeBtn.addEventListener("click", function (event) {
      event.preventDefault();
      clearInterval(timer);
      window.location.replace("/");
    });
  }
}());
