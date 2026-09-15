/* Mobile rail arrows for the About and Services pages.
   Mirrors js/site.js homeStatsCarousel()/teamCarousel(): a horizontal scroll
   track plus a pair of arrow buttons that move it one card at a time and
   disable themselves at each end. Markup contract:

     <section data-rail-block>
       <div data-rail> <article data-rail-item> ... </div>
       <div class="...-rail-nav">
         <button data-rail-prev> <button data-rail-next>
       </div>
     </section>

   The block carries .is-scrollable only while the track actually overflows,
   so the arrows stay hidden at widths where the row already fits (desktop).
   Swipe keeps working either way — this only adds the discoverable control.
   Lives outside js/site.js so the shared bundle is untouched. */
(function () {
  "use strict";

  function controller(block) {
    var track = block.querySelector("[data-rail]");
    var prev = block.querySelector("[data-rail-prev]");
    var next = block.querySelector("[data-rail-next]");
    if (!track || !prev || !next) return;

    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function step() {
      var card = track.querySelector("[data-rail-item]") || track.firstElementChild;
      var cs = getComputedStyle(track);
      var gap = parseFloat(cs.columnGap || cs.gap) || 16;
      if (!card) return Math.round(track.clientWidth * 0.8) || 280;
      return Math.round(card.getBoundingClientRect().width + gap);
    }

    function maxScroll() {
      return Math.max(0, track.scrollWidth - track.clientWidth);
    }

    function sync() {
      var max = maxScroll();
      var can = max > 4;
      block.classList.toggle("is-scrollable", can);
      prev.disabled = !can || track.scrollLeft <= 2;
      next.disabled = !can || track.scrollLeft >= max - 2;
      // Same contract as syncRailFade() in js/site.js: the edge fade is
      // painted only on a side that still hides cards, so the card parked
      // against a hard end is not greyed out as if it were clipped.
      track.classList.toggle("rail-can-left", can && track.scrollLeft > 2);
      track.classList.toggle("rail-can-right", can && track.scrollLeft < max - 2);
    }

    function go(dir) {
      if (maxScroll() <= 4) return;
      track.scrollBy({ left: dir * step(), behavior: reduce ? "auto" : "smooth" });
    }

    /* Bring the [aria-current="page"] card into view. The service switcher
       used to do this from an inline snippet per page, but that nudged the
       rail by just enough pixels to clear the edge and CSS scroll-snap then
       pulled it straight back, leaving the active tile half cut off on
       civil/epc. Centring lands exactly on a snap point, so it sticks. */
    function revealCurrent() {
      var active = track.querySelector('[aria-current="page"]');
      if (!active) return;
      var max = maxScroll();
      if (max <= 4) return;
      var item = active.closest("[data-rail-item]") || active;
      var ir = item.getBoundingClientRect();
      var tr = track.getBoundingClientRect();
      var target = track.scrollLeft + (ir.left - tr.left) - (tr.width - ir.width) / 2;
      track.scrollLeft = Math.max(0, Math.min(max, Math.round(target)));
      sync();
    }

    function onKey(e) {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        go(1);
      }
    }

    prev.addEventListener("click", function () {
      go(-1);
    });
    next.addEventListener("click", function () {
      go(1);
    });
    prev.addEventListener("keydown", onKey);
    next.addEventListener("keydown", onKey);
    track.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    if (window.ResizeObserver) new ResizeObserver(sync).observe(track);
    // A late web-font or image swap changes the card width; re-measure once.
    window.addEventListener("load", function () {
      sync();
      revealCurrent();
    });
    window.addEventListener("resize", revealCurrent);
    sync();
    revealCurrent();
  }

  function init() {
    var blocks = document.querySelectorAll("[data-rail-block]");
    for (var i = 0; i < blocks.length; i++) controller(blocks[i]);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
