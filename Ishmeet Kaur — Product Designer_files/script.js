/* =============================================
   CUSTOM CURSOR + NAV SCROLL
   ============================================= */
   (function () {
    const cursor = document.createElement("div");
    cursor.className = "cursor";
    document.body.appendChild(cursor);
  
    let mouseX = 0, mouseY = 0, curX = 0, curY = 0;
    const lerp = (a, b, t) => a + (b - a) * t;
  
    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.classList.remove("is-hidden");
    });
    document.addEventListener("mouseleave", () => cursor.classList.add("is-hidden"));
    document.addEventListener("mouseenter", () => cursor.classList.remove("is-hidden"));
  
    const hoverSel = "a, button, .playCard, .csHero, .csCard, .emojiBtn, .tSplit__grid, .iconBtn, .highlight3, select";
    document.addEventListener("mouseover", (e) => { if (e.target.closest(hoverSel)) cursor.classList.add("is-hover"); });
    document.addEventListener("mouseout",  (e) => { if (e.target.closest(hoverSel)) cursor.classList.remove("is-hover"); });
  
    (function animateCursor() {
      curX = lerp(curX, mouseX, 0.14);
      curY = lerp(curY, mouseY, 0.14);
      cursor.style.transform = `translate(${curX - cursor.offsetWidth / 2}px, ${curY - cursor.offsetHeight / 2}px)`;
      requestAnimationFrame(animateCursor);
    })();
  })();
  
  /* Ishmeet portfolio interactions (clean + robust) */
  
  document.addEventListener("DOMContentLoaded", () => {
    document.documentElement.classList.add("js");
  
    // ===== Footer year =====
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
  
    // ===== Reveal on scroll =====
    const revealEls = document.querySelectorAll(".reveal");
  
    if (!("IntersectionObserver" in window)) {
      revealEls.forEach((el) => el.classList.add("is-visible"));
    } else if (revealEls.length) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          });
        },
        { threshold: 0.15 }
      );
      revealEls.forEach((el) => io.observe(el));
    }
  
    // ===== 3D tilt for playground cards =====
    const isFinePointer = window.matchMedia("(hover:hover) and (pointer:fine)").matches;
    if (isFinePointer) {
      const cards = document.querySelectorAll(".playCard");
      const tilt = { maxTilt: 10, perspective: 900, scale: 1.02 };
  
      cards.forEach((card) => {
        card.addEventListener("mousemove", (e) => {
          const r = card.getBoundingClientRect();
          const x = e.clientX - r.left;
          const y = e.clientY - r.top;
          const rx = ((y / r.height) - 0.5) * -2 * tilt.maxTilt;
          const ry = ((x / r.width)  - 0.5) *  2 * tilt.maxTilt;
          card.style.transform = `perspective(${tilt.perspective}px) rotateX(${rx}deg) rotateY(${ry}deg) scale(${tilt.scale})`;
        });
        card.addEventListener("mouseleave", () => {
          card.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)";
        });
      });
    }
  
    // ===== Sidebar scrollspy =====
    const items = [...document.querySelectorAll(".sideNav__item[data-section]")];
    if (items.length) {
      const sections = items
        .map((a) => document.getElementById(a.dataset.section))
        .filter(Boolean);
  
      const setActive = (id) => {
        items.forEach((a) => a.classList.toggle("is-active", a.dataset.section === id));
      };
  
      if (!("IntersectionObserver" in window)) {
        if (sections[0]?.id) setActive(sections[0].id);
      } else if (sections.length) {
        const io = new IntersectionObserver(
          (entries) => {
            const visible = entries
              .filter((e) => e.isIntersecting)
              .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
            if (visible?.target?.id) setActive(visible.target.id);
          },
          { threshold: [0.35, 0.5, 0.65] }
        );
        sections.forEach((sec) => io.observe(sec));
      }
    }
  });
  
  // ===== Hero blob dark mode =====
  (() => {
    const hero = document.querySelector(".hero");
    const blob = document.querySelector(".heroBlob");
    if (!hero || !blob) return;
  
    const canHover = window.matchMedia("(hover:hover) and (pointer:fine)").matches;
    if (!canHover) return;
  
    blob.addEventListener("pointerenter", () => hero.classList.add("is-dark"));
    blob.addEventListener("pointerleave", () => hero.classList.remove("is-dark"));
    window.addEventListener("blur", () => hero.classList.remove("is-dark"));
  })();
  
  // ===== Orb Clock Widget =====
  (() => {
    const root = document.getElementById("orbClock");
    if (!root) return;
  
    const face    = root.querySelector(".orbFace");
    const dotsWrap= root.querySelector(".orbDots");
    const hEl     = document.getElementById("orbHour");
    const mEl     = document.getElementById("orbMinute");
    const sEl     = document.getElementById("orbSecond");
    const dateEl  = document.getElementById("orbDate");
  
    if (dotsWrap) {
      for (let i = 0; i < 12; i++) {
        const dot = document.createElement("div");
        dot.className = "orbDot";
        dot.dataset.i = String(i);
        dotsWrap.appendChild(dot);
      }
    }
  
    function formatDate(d) {
      return d.toLocaleDateString("en-US", {
        weekday: "short", month: "short", day: "numeric",
      }).toUpperCase();
    }
  
    function positionDots(activeHour) {
      const dots = root.querySelectorAll(".orbDot");
      dots.forEach((dot, i) => {
        const angle = i * 30 - 90;
        const rad   = (angle * Math.PI) / 180;
        dot.style.left = `${50 + 38 * Math.cos(rad)}%`;
        dot.style.top  = `${50 + 38 * Math.sin(rad)}%`;
        const isActive = i === activeHour;
        const strong   = i % 3 === 0;
        dot.style.backgroundColor = isActive
          ? "var(--orb-primary)"
          : strong ? "var(--orb-marker-strong)" : "var(--orb-marker-weak)";
        dot.style.boxShadow = isActive
          ? "0 0 10px color-mix(in srgb, var(--orb-primary) 70%, transparent)"
          : "none";
      });
    }
  
    let raf = null;
  
    function tick() {
      const t       = new Date();
      const seconds = t.getSeconds() + t.getMilliseconds() / 1000;
      const minutes = t.getMinutes() + seconds / 60;
      const hours   = (t.getHours() % 12) + minutes / 60;
  
      if (hEl) hEl.style.transform = `translateX(-50%) rotate(${hours   * 30}deg)`;
      if (mEl) mEl.style.transform = `translateX(-50%) rotate(${minutes * 6}deg)`;
      if (sEl) sEl.style.transform = `translateX(-50%) rotate(${seconds * 6}deg)`;
  
      positionDots(Math.floor(hours));
      if (dateEl) dateEl.textContent = formatDate(t);
      raf = requestAnimationFrame(tick);
    }
  
    root.addEventListener("mousemove", (e) => {
      if (!face) return;
      const rect = root.getBoundingClientRect();
      const x = (e.clientX - rect.left  - rect.width  / 2) / (rect.width  / 2);
      const y = (e.clientY - rect.top   - rect.height / 2) / (rect.height / 2);
      face.style.transform = `rotateX(${(-y * 8).toFixed(2)}deg) rotateY(${(x * 8).toFixed(2)}deg)`;
    });
    root.addEventListener("mouseenter", () => root.classList.add("is-hover"));
    root.addEventListener("mouseleave", () => {
      root.classList.remove("is-hover");
      if (face) face.style.transform = "rotateX(0deg) rotateY(0deg)";
    });
  
    tick();
    window.addEventListener("beforeunload", () => { if (raf) cancelAnimationFrame(raf); });
  })();
  
  // ===== Orbital Clock (BST / Europe-London) =====
  (function initOrbitalClock() {
    function partsInTZ(tz) {
      const dtf = new Intl.DateTimeFormat("en-GB", {
        timeZone: tz, hour: "2-digit", minute: "2-digit",
        second: "2-digit", hour12: false,
      });
      const parts = dtf.formatToParts(new Date());
      const get = (type) => Number(parts.find(p => p.type === type)?.value || 0);
      return { h: get("hour"), m: get("minute"), s: get("second") };
    }
  
    function tick() {
      document.querySelectorAll(".orbitalClock").forEach((el) => {
        const tz = el.getAttribute("data-tz") || "Europe/London";
        const { h, m, s } = partsInTZ(tz);
  
        const hour    = (h % 12) + m / 60;
        const hourDeg = hour * 30;
        const minDeg  = (m + s / 60) * 6;
        const secDeg  = s * 6;
  
        const hourHand = el.querySelector(".orbitalClock__hand--hour");
        const minHand  = el.querySelector(".orbitalClock__hand--min");
        const secHand  = el.querySelector(".orbitalClock__hand--sec");
  
        if (hourHand) hourHand.style.transform = `translateX(-50%) rotate(${hourDeg}deg)`;
        if (minHand)  minHand.style.transform  = `translateX(-50%) rotate(${minDeg}deg)`;
        if (secHand)  secHand.style.transform  = `translateX(-50%) rotate(${secDeg}deg)`;
      });
      requestAnimationFrame(tick);
    }
  
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => requestAnimationFrame(tick));
    } else {
      requestAnimationFrame(tick);
    }
  })();
  
  // ===== Emoji Rating =====
  (function () {
    const root = document.querySelector(".emojiRating");
    if (!root) return;
  
    const buttons    = Array.from(root.querySelectorAll(".emojiBtn"));
    const labelBase  = document.querySelector(".ratingLabel .labelBase");
    const labelTexts = Array.from(document.querySelectorAll(".ratingLabel .labelText"));
    const thanks     = document.querySelector(".ratingTiny");
  
    let lockedRating = 0;
  
    const setLabel = (value) => {
      if (!labelBase) return;
      labelTexts.forEach((el) => el.classList.remove("is-visible"));
      if (!value) {
        labelBase.classList.remove("is-hidden");
        labelBase.classList.add("is-visible");
        return;
      }
      labelBase.classList.add("is-hidden");
      const match = labelTexts.find((el) => Number(el.dataset.value) === Number(value));
      if (match) match.classList.add("is-visible");
    };
  
    const setActive = (value) => {
      buttons.forEach((btn) => {
        btn.classList.toggle("is-active", Number(btn.dataset.value) === Number(value));
      });
    };
  
    const preview     = (value) => { if (lockedRating) return; setActive(value); setLabel(value); };
    const clearPreview= ()      => { if (lockedRating) return; setActive(0); setLabel(0); };
  
    const lock = (value) => {
      lockedRating = Number(value);
      setActive(lockedRating);
      setLabel(lockedRating);
      if (thanks) { thanks.hidden = false; window.setTimeout(() => (thanks.hidden = true), 1600); }
    };
  
    buttons.forEach((btn) => {
      btn.addEventListener("mouseenter", () => preview(btn.dataset.value));
      btn.addEventListener("mouseleave", clearPreview);
      btn.addEventListener("click",      () => lock(btn.dataset.value));
      btn.addEventListener("keydown",    (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); lock(btn.dataset.value); }});
    });
  
    setLabel(0);
  })();
  
  // ===== Testimonials Carousel =====
  (() => {
    const root      = document.getElementById("tSplit");
    if (!root) return;
  
    const quoteEl   = document.getElementById("tQuote");
    const nameEl    = document.getElementById("tName");
    const roleEl    = document.getElementById("tRole");
    const companyEl = document.getElementById("tCompany");
    const imgEl     = document.getElementById("tImg");
    const dotsWrap  = document.getElementById("tDots");
  
    if (!quoteEl || !nameEl || !roleEl || !companyEl || !dotsWrap) return;
  
    const testimonials = [
      {
        quote:   "\u201cIshmeet understood and elicited requirements before delivering a design and prototype that met all of the user stories. She displayed strong professionalism and quickly built rapport with the team.\u201d",
        name:    "Peter McCleery",
        role:    "Director",
        company: "GetSociable",
        image:   "Images/testimonials/Peter.jpeg",
      },
      {
        quote:   "\u201cIshmeet is an excellent communicator with exceptional creativity and worked closely with design, development, and marketing teams to deliver real value.\u201d",
        name:    "Gagan Sahni",
        role:    "Design Lead",
        company: "Absolute Foods",
        image:   "Images/testimonials/Gagan.png",
      },
      {
        quote:   "\u201cIshmeet is an amazing personality and an excellent team member. It was a pleasure working with her, guiding her and learning from her as well. I truly recommend her design skills and her ability to speak for users and prioritise them while solving a problem.\u201d",
        name:    "Syed Nouman",
        role:    "Design Consultant",
        company: "NCLE",
        image:   "Images/testimonials/Syed.jpeg",
      },
    ];
  
    let active = 0, switching = false;
  
    dotsWrap.innerHTML = "";
    const dots = testimonials.map((_, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "tDot" + (i === 0 ? " is-active" : "");
      b.setAttribute("aria-label", `Go to testimonial ${i + 1}`);
      b.addEventListener("click", (e) => { e.stopPropagation(); goTo(i); });
      dotsWrap.appendChild(b);
      return b;
    });
  
    function paint(index) {
      const t = testimonials[index];
      quoteEl.textContent   = t.quote;
      nameEl.textContent    = t.name;
      roleEl.textContent    = t.role;
      companyEl.textContent = t.company;
      if (imgEl) { imgEl.src = t.image; imgEl.alt = t.name; }
      dots.forEach((d, i) => d.classList.toggle("is-active", i === index));
    }
  
    function goTo(nextIndex) {
      if (switching || nextIndex === active) return;
      switching = true;
      root.classList.add("is-switching");
      window.setTimeout(() => {
        active = nextIndex;
        paint(active);
        root.classList.remove("is-switching");
        window.setTimeout(() => (switching = false), 200);
      }, 220);
    }
  
    const clickTarget = root.querySelector(".tSplit__grid");
    if (clickTarget) clickTarget.addEventListener("click", () => goTo((active + 1) % testimonials.length));
  
    const nextHint = document.getElementById("tNextHint");
    if (nextHint) nextHint.addEventListener("click", (e) => { e.stopPropagation(); goTo((active + 1) % testimonials.length); });
  
    paint(0);
  })();
  
  // ===== Contact hover activation =====
  const contact = document.querySelector(".contact");
  if (contact) {
    const socialLinks = contact.querySelectorAll(".contact__actions a");
    const flower      = contact.querySelector(".highlight3");
    const ratingBtns  = contact.querySelectorAll(".emojiBtn");
  
    const on  = () => contact.classList.add("is-active");
    const off = () => contact.classList.remove("is-active");
  
    socialLinks.forEach(link => {
      link.addEventListener("mouseenter", on);
      link.addEventListener("mouseleave", off);
    });
    ratingBtns.forEach(btn => {
      btn.addEventListener("mouseenter", on);
      btn.addEventListener("mouseleave", off);
      btn.addEventListener("focus", on);
      btn.addEventListener("blur",  off);
    });
    if (flower) {
      flower.addEventListener("mouseenter", on);
      flower.addEventListener("mouseleave", off);
    }
  }
  
  // ===== Work Sort (buttons) =====
  (function () {
    const buttons = document.querySelectorAll(".workSort__btn");
    const stage   = document.querySelector(".workSticky__stage");
    const steps   = Array.from(document.querySelectorAll(".workStep"));
    if (!buttons.length || !stage || !steps.length) return;
  
    function sortBy(type) {
      const sorted = [...steps].sort((a, b) =>
        type === "date"   ? Number(b.dataset.date)   - Number(a.dataset.date)   :
        type === "impact" ? Number(b.dataset.impact) - Number(a.dataset.impact) : 0
      );
      sorted.forEach(step => stage.appendChild(step));
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    }
  
    buttons.forEach(btn => {
      btn.addEventListener("click", () => {
        buttons.forEach(b => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        sortBy(btn.dataset.sort);
      });
    });
  })();
  
  // ===== Work Sort (dropdown) =====
  (function () {
    const select = document.getElementById("workSortSelect");
    const stage  = document.querySelector(".workSticky__stage");
    const steps  = Array.from(document.querySelectorAll(".workStep"));
    if (!select || !stage || !steps.length) return;
  
    function sortBy(type) {
      const sorted = [...steps].sort((a, b) =>
        type === "date"   ? Number(b.dataset.date)   - Number(a.dataset.date)   :
        type === "impact" ? Number(b.dataset.impact) - Number(a.dataset.impact) : 0
      );
      sorted.forEach(step => stage.appendChild(step));
      if (window.ScrollTrigger && typeof window.ScrollTrigger.refresh === "function") ScrollTrigger.refresh();
    }
  
    select.addEventListener("change", () => sortBy(select.value));
    sortBy(select.value);
  })();
  
  // ===== Stat Counters =====
  const stats = document.querySelectorAll(".cs-stat");
  
  const animateStat = (el) => {
    const target   = Number(el.dataset.target);
    const suffix   = el.textContent.replace(/[0-9]/g, "");
    const duration = 1200;
    const startTime= performance.now();
  
    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      el.textContent = `${Math.floor(progress * target)}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = `${target}${suffix}`;
    };
    requestAnimationFrame(tick);
  };
  
  const statObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateStat(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  stats.forEach((stat) => statObserver.observe(stat));
  
  // ===== Case Study Interactions =====
  (function () {
    "use strict";
  
    const progressBar = document.getElementById("csProgressBar");
    if (progressBar) {
      const updateProgress = () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct       = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = pct.toFixed(2) + "%";
      };
      window.addEventListener("scroll", updateProgress, { passive: true });
      updateProgress();
    }
  
    const revealEls = document.querySelectorAll(".cs-reveal");
    if (revealEls.length) {
      const revealIO = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          revealIO.unobserve(entry.target);
        });
      }, { threshold: 0.12 });
      revealEls.forEach((el) => revealIO.observe(el));
    }
  
    const staggerEls = document.querySelectorAll(".cs-stagger");
    if (staggerEls.length) {
      const staggerIO = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          staggerIO.unobserve(entry.target);
        });
      }, { threshold: 0.1 });
      staggerEls.forEach((el) => staggerIO.observe(el));
    }
  
    const imgRevealEls = document.querySelectorAll(".cs-img-reveal");
    if (imgRevealEls.length) {
      const imgIO = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          imgIO.unobserve(entry.target);
        });
      }, { threshold: 0.08 });
      imgRevealEls.forEach((el) => imgIO.observe(el));
    }
  })();
  
  // ===== Next Project Preview =====
  (function () {
    const pairs = [
      { marquee: "csNextMarquee",  preview: "csNextPreview"  },
      { marquee: "csNextMarquee2", preview: "csNextPreview2" },
      { marquee: "csNextMarquee3", preview: "csNextPreview3" },
    ];
  
    if (!window.matchMedia("(hover:hover)").matches) return;
    const lerp = (a, b, t) => a + (b - a) * t;
  
    pairs.forEach(({ marquee, preview }) => {
      const mEl = document.getElementById(marquee);
      const pEl = document.getElementById(preview);
      if (!mEl || !pEl) return;
  
      let mouseX = 0, mouseY = 0, curX = 0, curY = 0, raf = null;
  
      const animate = () => {
        curX = lerp(curX, mouseX, 0.12);
        curY = lerp(curY, mouseY, 0.12);
        pEl.style.left = curX + "px";
        pEl.style.top  = curY + "px";
        raf = requestAnimationFrame(animate);
      };
  
      mEl.addEventListener("mouseenter", () => { pEl.classList.add("is-visible"); raf = requestAnimationFrame(animate); });
      mEl.addEventListener("mousemove",  (e) => { mouseX = e.clientX; mouseY = e.clientY; });
      mEl.addEventListener("mouseleave", () => { pEl.classList.remove("is-visible"); if (raf) { cancelAnimationFrame(raf); raf = null; } });
    });
  })();

  // ===== Work filter tags =====
(function () {
  const filters = document.querySelectorAll('.workFilter');
  const rows    = document.querySelectorAll('.workRow');
  if (!filters.length || !rows.length) return;

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      const filter = btn.dataset.filter;
      rows.forEach(row => {
        const tags = row.dataset.tags || '';
        if (filter === 'all' || tags.includes(filter)) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    });
  });
})();

// ===== Work row hover preview =====
(function () {
  if (!window.matchMedia('(hover:hover)').matches) return;

  const rows = document.querySelectorAll('.workRow');
  if (!rows.length) return;

  const lerp = (a, b, t) => a + (b - a) * t;

  rows.forEach(row => {
    const preview = row.querySelector('.workRow__preview');
    if (!preview) return;

    let mouseX = 0, mouseY = 0;
    let curX   = 0, curY   = 0;
    let raf    = null;

    const animate = () => {
      curX = lerp(curX, mouseX, 0.12);
      curY = lerp(curY, mouseY, 0.12);
      preview.style.left = curX + 'px';
      preview.style.top  = curY + 'px';
      raf = requestAnimationFrame(animate);
    };

    row.addEventListener('mouseenter', () => {
      preview.classList.add('is-visible');
      raf = requestAnimationFrame(animate);
    });

    row.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    row.addEventListener('mouseleave', () => {
      preview.classList.remove('is-visible');
      if (raf) { cancelAnimationFrame(raf); raf = null; }
    });
  });
})();

