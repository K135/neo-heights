(function () {
  function enhanceForms() {
    document.querySelectorAll("form").forEach((form) => {
      if (form.dataset.nhForm === "1") return;
      form.dataset.nhForm = "1";

      const mailTo = (form.getAttribute("data-mail-to") || "").trim();
      if (mailTo) {
        form.addEventListener("submit", (e) => {
          e.preventDefault();
          if (!form.checkValidity()) {
            form.reportValidity();
            return;
          }
          const fd = new FormData(form);
          const lines = [];
          fd.forEach((value, key) => {
            if (key === "bot-field" || key === "form-name") return;
            lines.push(`${key}: ${value}`);
          });
          const subject = encodeURIComponent(fd.get("role") ? `Career application — ${fd.get("role")}` : "Website enquiry");
          const body = encodeURIComponent(lines.join("\n"));
          window.location.href = `mailto:${mailTo}?subject=${subject}&body=${body}`;
          let msg = form.querySelector(".nh-form-success");
          if (!msg) {
            msg = document.createElement("p");
            msg.className = "nh-form-success";
            msg.setAttribute("role", "status");
            form.appendChild(msg);
          }
          msg.textContent = "Opening your email app to send this to " + mailTo + ". If nothing opens, write to that address directly.";
        });
        return;
      }

      // Accessible required fields
      form.querySelectorAll('input[type="text"], input[name="name"]').forEach((el) => {
        el.required = true;
        if (!el.getAttribute("aria-label") && el.placeholder) el.setAttribute("aria-label", el.placeholder);
      });
      form.querySelectorAll('input[type="email"]').forEach((el) => {
        el.required = true;
        if (!el.getAttribute("aria-label") && el.placeholder) el.setAttribute("aria-label", el.placeholder);
      });
      form.querySelectorAll('input[type="tel"]').forEach((el) => {
        if (!el.getAttribute("aria-label") && el.placeholder) el.setAttribute("aria-label", el.placeholder);
      });
      form.querySelectorAll("textarea").forEach((el) => {
        el.required = true;
        if (!el.getAttribute("aria-label") && el.placeholder) el.setAttribute("aria-label", el.placeholder);
      });

      // Netlify Forms attributes when hosted on Netlify
      if (!form.getAttribute("name")) form.setAttribute("name", "contact");
      form.setAttribute("method", "POST");
      form.setAttribute("data-netlify", "true");
      form.setAttribute("netlify-honeypot", "bot-field");
      if (!form.querySelector('input[name="form-name"]')) {
        const hidden = document.createElement("input");
        hidden.type = "hidden";
        hidden.name = "form-name";
        hidden.value = form.getAttribute("name") || "contact";
        form.prepend(hidden);
      }
      if (!form.querySelector('input[name="bot-field"]')) {
        const hp = document.createElement("p");
        hp.className = "nh-hp";
        hp.setAttribute("hidden", "");
        hp.innerHTML = '<label>Don’t fill this out: <input name="bot-field" /></label>';
        form.prepend(hp);
      }

      // Local success fallback when action is # or empty
      const action = (form.getAttribute("action") || "").trim();
      if (!action || action === "#") {
        form.addEventListener("submit", (e) => {
          // Allow real Netlify POST on production hosts
          const host = location.hostname;
          const isLocal = host === "localhost" || host === "127.0.0.1" || host.endsWith(".local") || location.protocol === "file:";
          if (isLocal) {
            e.preventDefault();
            if (!form.checkValidity()) {
              form.reportValidity();
              return;
            }
            let msg = form.querySelector(".nh-form-success");
            if (!msg) {
              msg = document.createElement("p");
              msg.className = "nh-form-success";
              msg.setAttribute("role", "status");
              form.appendChild(msg);
            }
            msg.textContent = "Thanks — your enquiry has been captured locally. Connect Netlify Forms (or your endpoint) for live delivery.";
            form.reset();
          }
        });
      }
    });
  }

  function projectFilters() {
    const wrap = document.querySelector("[data-project-filters]");
    if (!wrap) return;
    const buttons = [...wrap.querySelectorAll("[data-filter]")];
    const cards = [...document.querySelectorAll(".proj-tile, .project-grid .card")];
    cards.forEach((card) => {
      if (!card.dataset.category) {
        const t = (card.textContent || "").toLowerCase();
        const cats = ["completed"];
        if (/peb|volvo|advik|lm wind/.test(t)) cats.push("peb", "civil-peb");
        if (/mep|schaeffler|toyota/.test(t)) cats.push("mep", "civil-peb");
        if (/epc|tata|ge healthcare|foxconn/.test(t)) cats.push("epc");
        if (/civil|vajra|magnum|wendt|rwh/.test(t)) cats.push("civil", "civil-peb");
        if (/ongoing|on-going/.test(t)) cats.push("ongoing");
        card.dataset.category = cats.join(" ");
      }
    });
    const grid = document.querySelector("[data-project-list], .project-grid");
    const rows = grid
      ? [...grid.children].filter((el) => !el.classList.contains("card") && !el.classList.contains("proj-tile") && !el.classList.contains("home-projects-empty") && !el.classList.contains("proj-empty"))
      : [];

    const apply = (f) => {
      let shown = 0;
      cards.forEach((card) => {
        const show = f === "all" || (card.dataset.category || "").split(/\s+/).includes(f);
        card.style.display = show ? "" : "none";
        if (show) shown += 1;
      });
      // the home grid is a bespoke masonry: hide rows that emptied out,
      // and flatten to an even 3-up while a filter is active
      rows.forEach((row) => {
        const any = [...row.querySelectorAll(".card, .proj-tile")].some((c) => c.style.display !== "none");
        row.style.display = any ? "" : "none";
      });
      if (grid && grid.querySelector(".card")) grid.classList.toggle("is-filtered", f !== "all");

      let empty = grid && grid.querySelector(".home-projects-empty");
      if (grid && !shown) {
        if (!empty) {
          empty = document.createElement("p");
          empty.className = "home-projects-empty";
          empty.textContent = "No projects in this category yet.";
          grid.appendChild(empty);
        }
        empty.hidden = false;
      } else if (empty) {
        empty.hidden = true;
      }
    };

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        buttons.forEach((b) => {
          b.classList.remove("active");
          if (b.hasAttribute("aria-pressed")) b.setAttribute("aria-pressed", "false");
        });
        btn.classList.add("active");
        if (btn.hasAttribute("aria-pressed")) btn.setAttribute("aria-pressed", "true");
        apply(btn.dataset.filter);
      });
    });

    const fromUrl = (new URLSearchParams(location.search).get("status") || "").toLowerCase();
    const urlBtn = buttons.find((b) => b.dataset.filter === fromUrl);
    const initial = urlBtn || buttons.find((b) => b.classList.contains("active"));
    if (initial && initial.dataset.filter !== "all") {
      buttons.forEach((b) => {
        const on = b === initial;
        b.classList.toggle("active", on);
        if (b.hasAttribute("aria-pressed")) b.setAttribute("aria-pressed", on ? "true" : "false");
      });
      apply(initial.dataset.filter);
    }
  }

  function projectCarousels() {
    document.querySelectorAll("[data-proj-carousel]").forEach((root) => {
      const slides = [...root.querySelectorAll(".proj-tile-slide")];
      const prev = root.querySelector("[data-proj-prev]");
      const next = root.querySelector("[data-proj-next]");
      const dotsWrap = root.querySelector("[data-proj-dots]");
      if (slides.length < 2) {
        if (prev) prev.hidden = true;
        if (next) next.hidden = true;
        if (dotsWrap) dotsWrap.hidden = true;
        return;
      }

      let index = 0;
      const dots = slides.map((_, i) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "proj-tile-dot";
        b.setAttribute("aria-label", "Photo " + (i + 1));
        b.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          go(i);
        });
        if (dotsWrap) dotsWrap.appendChild(b);
        return b;
      });

      const go = (i) => {
        index = ((i % slides.length) + slides.length) % slides.length;
        slides.forEach((s, k) => s.classList.toggle("is-active", k === index));
        dots.forEach((d, k) => d.classList.toggle("is-active", k === index));
      };

      if (prev) {
        prev.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          go(index - 1);
        });
      }
      if (next) {
        next.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          go(index + 1);
        });
      }

      let startX = 0;
      root.addEventListener(
        "touchstart",
        (e) => {
          startX = e.changedTouches[0].clientX;
        },
        { passive: true }
      );
      root.addEventListener(
        "touchend",
        (e) => {
          const dx = e.changedTouches[0].clientX - startX;
          if (Math.abs(dx) < 40) return;
          go(index + (dx < 0 ? 1 : -1));
        },
        { passive: true }
      );

      go(0);
    });
  }

  function verticalsClose() {
    document.querySelectorAll(".home-verticals-close").forEach((btn) => {
      btn.addEventListener("click", () => {
        const card = btn.closest(".home-verticals");
        if (card) card.hidden = true;
      });
    });
  }

  function prioritizeHeroImages() {
    const heroImg = document.querySelector(
      ".home-hero img, .pd-hero > img.cover, .sd-hero-media > img.cover, .ab-hero img, .svc-hero img, .hero img"
    );
    if (heroImg && !heroImg.hasAttribute("fetchpriority")) {
      heroImg.setAttribute("fetchpriority", "high");
    }
    const video = document.getElementById("home-hero-video");
    if (video && !video.hasAttribute("fetchpriority")) {
      video.setAttribute("fetchpriority", "high");
    }
  }

  function processJourney() {
    const stage = document.querySelector("[data-process]");
    if (!stage) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      stage.classList.add("is-on");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            stage.classList.add("is-on");
            io.disconnect();
          }
        });
      },
      { threshold: 0.25, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(stage);
  }

  function passthroughVerticalScroll(selector) {
    const mq = window.matchMedia("(max-width: 768px)");
    document.querySelectorAll(selector).forEach((el) => {
      const onWheel = (e) => {
        if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
        if (el.scrollWidth <= el.clientWidth + 1) return;
        e.preventDefault();
        window.scrollBy(0, e.deltaY);
      };
      const sync = () => {
        el.removeEventListener("wheel", onWheel);
        if (!mq.matches) return;
        el.addEventListener("wheel", onWheel, { passive: false });
      };
      sync();
      if (typeof mq.addEventListener === "function") mq.addEventListener("change", sync);
      else mq.addListener(sync);
    });
  }

  // Paints the edge fade only on the side that still has hidden cards, so a
  // rail that fits its content shows no fade at all.
  function syncRailFade(rail) {
    const max = Math.max(0, rail.scrollWidth - rail.clientWidth);
    rail.classList.add("rail-fade");
    rail.classList.toggle("can-scroll-left", max > 4 && rail.scrollLeft > 2);
    rail.classList.toggle("can-scroll-right", max > 4 && rail.scrollLeft < max - 2);
  }

  function homeStatsCarousel() {
    const block = document.querySelector(".home-stats-block");
    const track = block && block.querySelector(".home-stats");
    const prev = block && block.querySelector('[data-stats-dir="-1"]');
    const next = block && block.querySelector('[data-stats-dir="1"]');
    if (!block || !track || !prev || !next) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function step() {
      const card = track.querySelector(".home-stat-card");
      if (!card) return 320;
      const styles = getComputedStyle(track);
      const gap = parseFloat(styles.columnGap || styles.gap) || 16;
      return Math.round(card.getBoundingClientRect().width + gap);
    }

    function maxScroll() {
      return Math.max(0, track.scrollWidth - track.clientWidth);
    }

    function overflowing() {
      return maxScroll() > 4;
    }

    function sync() {
      const can = overflowing();
      block.classList.toggle("is-scrollable", can);
      const left = track.scrollLeft;
      prev.disabled = !can || left <= 2;
      next.disabled = !can || left >= maxScroll() - 2;
      syncRailFade(track);
    }

    function go(dir) {
      if (!overflowing()) return;
      track.scrollBy({
        left: dir * step(),
        behavior: reduce ? "auto" : "smooth"
      });
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

    prev.addEventListener("click", () => go(-1));
    next.addEventListener("click", () => go(1));
    prev.addEventListener("keydown", onKey);
    next.addEventListener("keydown", onKey);
    track.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    if (typeof ResizeObserver !== "undefined") {
      new ResizeObserver(sync).observe(track);
    }
    sync();
  }

  function isPhotoBlock(el) {
    if (
      el.matches(
        ".home-svc-card, .home-member, .ab-member, .ab-iso, .card, .svc-card, .pd-hero, .sd-hero-media"
      )
    ) {
      return true;
    }
    return !!el.querySelector(
      "img.cover, .home-member-photo img, .ab-member-photo img, .home-svc-card img, .svc-card img"
    );
  }

  function scrollReveals() {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nodes = [...document.querySelectorAll("[data-reveal], .reveal")];
    // Auto-mark copy blocks only — photo cards stay visible (no opacity-0 snap)
    const auto = document.querySelectorAll(
      ".home-about-intro, .home-stats .home-stat-card, .home-services-head, .home-projects-head, .home-team-head, .home-contact-left, .home-brand-copy, .home-faq-item, .ab-hero-left, .ab-hero-right, .ab-story-copy, .ab-stat, .ab-method-card, .ab-hsc-point, .ab-legacy-content"
    );
    auto.forEach((el) => {
      if (isPhotoBlock(el)) return;
      if (!el.hasAttribute("data-reveal")) el.setAttribute("data-reveal", "");
    });
    const all = [...new Set([...nodes, ...auto])].filter((el) => !isPhotoBlock(el));
    nodes.filter(isPhotoBlock).forEach((el) => {
      el.classList.add("is-in");
      el.removeAttribute("data-reveal");
      el.classList.remove("reveal");
    });
    if (!all.length) return;
    if (reduce) {
      all.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    all.forEach((el, i) => {
      el.style.setProperty("--reveal-delay", `${Math.min(i % 6, 5) * 60}ms`);
      io.observe(el);
    });
  }


  function servicesCarousel() {
    const rail = document.querySelector("[data-svc-rail]");
    const prev = document.querySelector("[data-svc-prev]");
    const next = document.querySelector("[data-svc-next]");
    if (!rail || !prev || !next) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const step = () => {
      const card = rail.querySelector(".home-svc-card");
      const cs = getComputedStyle(rail);
      const gap = parseFloat(cs.columnGap || cs.gap) || 16;
      return card ? Math.round(card.getBoundingClientRect().width + gap) : 336;
    };

    const maxScroll = () => Math.max(0, rail.scrollWidth - rail.clientWidth);

    const sync = () => {
      const left = rail.scrollLeft;
      const max = maxScroll();
      prev.disabled = left <= 2;
      next.disabled = left >= max - 2;
      const nav = prev.parentElement;
      if (nav) nav.classList.toggle("is-scrollable", max > 2);
      syncRailFade(rail);
    };

    const go = (dir) => {
      rail.scrollBy({ left: dir * step(), behavior: reduce ? "auto" : "smooth" });
    };

    prev.addEventListener("click", () => go(-1));
    next.addEventListener("click", () => go(1));
    rail.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    if (window.ResizeObserver) new ResizeObserver(sync).observe(rail);
    sync();
  }


  function teamCarousel() {
    const rail = document.querySelector("[data-team-rail]");
    const nav = document.querySelector(".home-team-nav");
    const prev = document.querySelector("[data-team-prev]");
    const next = document.querySelector("[data-team-next]");
    if (!rail || !nav || !prev || !next) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const step = () => {
      const card = rail.querySelector(".home-member");
      const cs = getComputedStyle(rail);
      const gap = parseFloat(cs.columnGap || cs.gap) || 16;
      return card ? Math.round(card.getBoundingClientRect().width + gap) : 314;
    };

    const maxScroll = () => Math.max(0, rail.scrollWidth - rail.clientWidth);

    const sync = () => {
      const max = maxScroll();
      const can = max > 4;
      nav.classList.toggle("is-scrollable", can);
      prev.disabled = !can || rail.scrollLeft <= 2;
      next.disabled = !can || rail.scrollLeft >= max - 2;
      syncRailFade(rail);
    };

    const go = (dir) => {
      if (maxScroll() <= 4) return;
      rail.scrollBy({ left: dir * step(), behavior: reduce ? "auto" : "smooth" });
    };

    prev.addEventListener("click", () => go(-1));
    next.addEventListener("click", () => go(1));
    rail.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    if (window.ResizeObserver) new ResizeObserver(sync).observe(rail);
    sync();
  }


  function statCardTouch() {
    const cards = [...document.querySelectorAll(".home-stat-card")];
    if (!cards.length) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");

    const setLinkFocusable = (card, open) => {
      const link = card.querySelector(".home-stat-link");
      if (link) link.setAttribute("tabindex", open ? "0" : "-1");
    };

    cards.forEach((card) => {
      // keyboard: opening on focus mirrors the hover reveal
      card.addEventListener("focus", () => setLinkFocusable(card, true));
      card.addEventListener("blur", () => {
        if (!card.classList.contains("is-open")) setLinkFocusable(card, false);
      });

      card.addEventListener("click", (e) => {
        if (fine.matches) return;                       // pointer devices use :hover
        if (e.target.closest("a")) return;              // let a real link through
        const open = card.classList.toggle("is-open");
        cards.forEach((c) => {
          if (c !== card) { c.classList.remove("is-open"); setLinkFocusable(c, false); }
        });
        setLinkFocusable(card, open);
      });
    });
  }

  function homeHeroAudio() {
    const video = document.getElementById("home-hero-video");
    const btn = document.getElementById("home-hero-volume");
    if (!video || !btn) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      video.pause();
      btn.hidden = true;
      return;
    }

    const syncUi = () => {
      const muted = !!video.muted;
      btn.classList.toggle("is-muted", muted);
      btn.setAttribute("aria-pressed", muted ? "true" : "false");
      btn.setAttribute("aria-label", muted ? "Unmute video sound" : "Mute video sound");
    };

    const tryPlay = async (withSound) => {
      video.muted = !withSound;
      try {
        await video.play();
        return true;
      } catch (_) {
        return false;
      }
    };

    // Prefer sound; fall back to muted autoplay if the browser blocks it.
    (async () => {
      const withSound = await tryPlay(true);
      if (!withSound) await tryPlay(false);
      syncUi();
    })();

    btn.addEventListener("click", async () => {
      if (video.muted) {
        video.muted = false;
        try {
          await video.play();
        } catch (_) {
          /* ignore */
        }
      } else {
        video.muted = true;
      }
      syncUi();
    });

    video.addEventListener("volumechange", syncUi);
    syncUi();
  }


  function sustainabilityCarousel() {
    const root = document.querySelector("[data-sus-carousel]");
    if (!root) return;

    const stage = root.querySelector(".sus-slide");
    const progress = root.querySelector(".sus-progress");
    const list = root.querySelector(".sus-initiatives-list");
    const slides = [...root.querySelectorAll("[data-sus-slide]")];
    const tabs = [...root.querySelectorAll("[data-sus-tab]")];
    const bars = [...root.querySelectorAll("[data-sus-bar]")];
    const pauseBtn = root.querySelector("[data-sus-pause]");
    const prev = root.querySelector("[data-sus-prev]");
    const next = root.querySelector("[data-sus-next]");
    const live = root.querySelector(".sus-slide-live");
    if (!stage || !progress || slides.length < 2) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const DURATION = 6000;
    stage.style.setProperty("--sus-duration", DURATION + "ms");

    // Slides ship marked up as hidden so the stack does not pile up without JS.
    slides.forEach((s) => (s.hidden = false));

    let index = 0;
    let paused = reduce;
    let onScreen = true;
    let tabVisible = !document.hidden;

    const syncPlayState = () => {
      stage.classList.toggle("is-paused", paused || !onScreen || !tabVisible);
    };

    const go = (i, focusTab) => {
      const n = slides.length;
      index = ((i % n) + n) % n;

      slides.forEach((s, k) => {
        const on = k === index;
        s.classList.toggle("is-active", on);
        s.setAttribute("aria-hidden", on ? "false" : "true");
      });

      tabs.forEach((t, k) => {
        const on = k === index;
        t.classList.toggle("is-active", on);
        t.setAttribute("aria-selected", on ? "true" : "false");
        t.tabIndex = on ? 0 : -1;
      });

      bars.forEach((b, k) => {
        b.classList.remove("is-done", "is-running");
        if (k < index) b.classList.add("is-done");
      });

      const bar = bars[index];
      if (bar) {
        if (reduce) {
          bar.classList.add("is-done");
        } else {
          void bar.offsetWidth; // restart the fill animation
          bar.classList.add("is-running");
        }
      }

      if (live) {
        const title = slides[index].querySelector(".sus-slide-title");
        live.textContent =
          "Slide " + (index + 1) + " of " + n + (title ? ": " + title.textContent : "");
      }

      if (focusTab && tabs[index]) tabs[index].focus();
    };

    progress.addEventListener("animationend", (e) => {
      if (e.animationName !== "sus-fill") return;
      if (paused || !onScreen || !tabVisible) return;
      go(index + 1);
    });

    if (prev) prev.addEventListener("click", () => go(index - 1));
    if (next) next.addEventListener("click", () => go(index + 1));

    tabs.forEach((tab, k) => {
      tab.addEventListener("click", () => go(k));
    });

    if (list) {
      list.addEventListener("keydown", (e) => {
        const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
        if (step) {
          e.preventDefault();
          go(index + step, true);
        } else if (e.key === "Home") {
          e.preventDefault();
          go(0, true);
        } else if (e.key === "End") {
          e.preventDefault();
          go(slides.length - 1, true);
        }
      });
    }

    if (pauseBtn) {
      const syncPauseBtn = () => {
        pauseBtn.setAttribute("aria-pressed", paused ? "true" : "false");
        pauseBtn.setAttribute("aria-label", paused ? "Play slideshow" : "Pause slideshow");
      };
      pauseBtn.addEventListener("click", () => {
        paused = !paused;
        syncPauseBtn();
        syncPlayState();
      });
      syncPauseBtn();
    }

    // Do not burn the timer while the section is off screen or the tab is hidden.
    if (window.IntersectionObserver) {
      new IntersectionObserver(
        (entries) => {
          onScreen = entries[0].isIntersecting;
          syncPlayState();
        },
        { threshold: 0.2 }
      ).observe(stage);
    }

    document.addEventListener("visibilitychange", () => {
      tabVisible = !document.hidden;
      syncPlayState();
    });

    syncPlayState();
    go(0);
  }

  function inPageAnchors() {
    document.querySelectorAll("[data-scroll-to]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = document.getElementById(btn.getAttribute("data-scroll-to"));
        if (!target) return;
        const header = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-height")) || 96;
        const offset = -(header + 12);
        if (window.lenis && typeof window.lenis.scrollTo === "function") {
          requestAnimationFrame(() => window.lenis.scrollTo(target, { offset }));
        } else {
          const top = target.getBoundingClientRect().top + window.scrollY + offset;
          window.scrollTo({ top, behavior: "smooth" });
        }
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    enhanceForms();
    projectFilters();
    projectCarousels();
    verticalsClose();
    prioritizeHeroImages();
    processJourney();
    scrollReveals();
    passthroughVerticalScroll(".home-stats");
    homeStatsCarousel();
    servicesCarousel();
    teamCarousel();
    statCardTouch();
    homeHeroAudio();
    sustainabilityCarousel();
    inPageAnchors();
  });
})();
