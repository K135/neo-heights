/* Lenis smooth scroll — site-wide.
   Wheel only: touch is left native so the horizontal rails (stats, services,
   team, project filters) keep their own swipe gestures on mobile. */
(function () {
  if (typeof window.Lenis !== "function") return;

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (reduce.matches) return;

  function headerOffset() {
    var raw = getComputedStyle(document.documentElement).getPropertyValue("--header-height");
    var px = parseFloat(raw);
    return isNaN(px) ? 96 : px;
  }

  var lenis = new window.Lenis({
    duration: 1.05,
    easing: function (t) {
      return Math.min(1, 1.001 - Math.pow(2, -10 * t));
    },
    smoothWheel: true,
    syncTouch: false,
    autoRaf: true,
    anchors: { offset: -headerOffset() }
  });

  window.lenis = lenis;

  // The mobile drawer covers the page; freeze the body scroll behind it.
  if (typeof MutationObserver !== "undefined") {
    new MutationObserver(function () {
      if (document.body.classList.contains("nav-open")) lenis.stop();
      else lenis.start();
    }).observe(document.body, { attributes: true, attributeFilter: ["class"] });
  }

  // Lenis measures on load; late images and fonts change the page height.
  window.addEventListener("load", function () {
    lenis.resize();
  });
})();
