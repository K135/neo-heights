/* Project detail: the gallery and "Explore Other Projects" rails are native
   overflow-x scrollers (swipe / trackpad). This adds mouse drag on the gallery
   and the arrow affordance the touch layout shows on the related rail. */
(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function dragScroll(el) {
    var down = false, moved = false, startX = 0, startLeft = 0;
    el.addEventListener("pointerdown", function (e) {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      down = true; moved = false; startX = e.clientX; startLeft = el.scrollLeft;
    });
    window.addEventListener("pointermove", function (e) {
      if (!down) return;
      var dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > 4) { moved = true; el.classList.add("is-dragging"); }
      if (moved) el.scrollLeft = startLeft - dx;
    });
    window.addEventListener("pointerup", function () {
      if (!down) return;
      down = false;
      el.classList.remove("is-dragging");
    });
    el.addEventListener("click", function (e) {
      if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; }
    }, true);
  }

  var gallery = document.querySelector(".pd-gallery");
  if (gallery) dragScroll(gallery);

  var track = document.querySelector(".pd-related-track");
  var nav = document.querySelector(".pd-rel-nav");
  if (!track || !nav) return;
  var prev = nav.querySelector('[data-rel-dir="-1"]');
  var next = nav.querySelector('[data-rel-dir="1"]');
  if (!prev || !next) return;
  function step() {
    var card = track.firstElementChild;
    var cs = getComputedStyle(track);
    var gap = parseFloat(cs.columnGap || cs.gap) || 16;
    return card ? Math.round(card.getBoundingClientRect().width + gap) : 320;
  }
  function maxScroll() {
    return Math.max(0, track.scrollWidth - track.clientWidth);
  }
  function sync() {
    var can = maxScroll() > 4;
    nav.classList.toggle("is-scrollable", can);
    prev.disabled = !can || track.scrollLeft <= 2;
    next.disabled = !can || track.scrollLeft >= maxScroll() - 2;
  }
  function go(dir) {
    if (maxScroll() <= 4) return;
    track.scrollBy({ left: dir * step(), behavior: reduce ? "auto" : "smooth" });
  }
  prev.addEventListener("click", function () { go(-1); });
  next.addEventListener("click", function () { go(1); });
  track.addEventListener("scroll", sync, { passive: true });
  window.addEventListener("resize", sync);
  if (typeof ResizeObserver !== "undefined") new ResizeObserver(sync).observe(track);
  sync();
})();
