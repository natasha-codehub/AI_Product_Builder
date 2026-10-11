/* ============================================================
   Natasha Agarwal · Product Portfolio
   Light, dependency-free vanilla JS. No framework, no build step.
   Powers: homepage work-showcase filtering, the "quick look"
   before/after card expansion (native <details>, JS only handles
   filtering visibility), tag-overlap related-work recommendations
   on case study pages, and the testimonial rotator.

   To add a new case study later: add one entry to CASES below
   (id must match the <body data-case-id="..."> on its page, file
   must match the filename in /case-studies/), and give its
   homepage .card-wrap the matching data-type / data-industry /
   data-skills attributes. See the product-portfolio-updater skill.
   ============================================================ */

(function () {
  'use strict';

  var CASES = [
    {
      id: 'invoice-automation',
      title: 'Invoice Automation',
      file: 'invoice-automation.html',
      type: 'shipped',
      industry: 'industrial-b2b',
      skills: ['confidence-scoring', 'ai-extraction'],
      blurb: '38% → 91% STP by defining a clean invoice before touching the technology.'
    },
    {
      id: 'support-deflection-agent',
      title: 'Support Deflection Agent',
      file: 'support-deflection-agent.html',
      type: 'prototype',
      industry: 'industrial-b2b',
      skills: ['rag', 'agents', 'confidence-scoring'],
      blurb: 'RAG plus three confidence tiers instead of a binary answer/escalate switch. ~75% L1 deflection.'
    },
    {
      id: 'telemetry-forecasting',
      title: 'Telemetry Forecasting',
      file: 'telemetry-forecasting.html',
      type: 'shipped',
      industry: 'industrial-b2b',
      skills: ['forecasting'],
      blurb: 'A forecasting model over a static threshold alert. Zero unplanned runouts.'
    },
    {
      id: 'ai-onboarding-agent',
      title: 'AI Onboarding Agent',
      file: 'ai-onboarding-agent.html',
      type: 'prototype',
      industry: 'industrial-b2b',
      skills: ['agents', 'confidence-scoring'],
      blurb: 'AI where ambiguity lives, determinism where money and compliance move.'
    },
    {
      id: 'ai-regression-intelligence',
      title: 'AI Regression Intelligence',
      file: 'ai-regression-intelligence.html',
      type: 'prototype',
      industry: 'dev-tooling',
      skills: ['agents', 'evals'],
      blurb: 'A 6-agent pipeline with a self-evaluated test confidence score.'
    },
    {
      id: 'behavioral-health-rag',
      title: 'Behavioral Health RAG',
      file: 'behavioral-health-rag.html',
      type: 'prototype',
      industry: 'behavioral-health',
      skills: ['rag'],
      blurb: 'Retrieval-grounded generation over curated clinical sources. 61% → 79% classification consistency.'
    }
  ];

  var TESTIMONIALS = [
    {
      quote: 'Natasha has a sharp ability to break down complex problems, prioritize effectively, and keep cross-functional teams aligned toward clear outcomes. Her structured approach to business analysis consistently helped us move initiatives forward, even in fast-changing environments.',
      who: 'Pramit Bajpai',
      role: 'ex-colleague'
    },
    {
      quote: 'An absolute rockstar Product Owner. Super dedicated, always available, and incredibly reliable. She does a great job of turning client requirements into clear direction for the tech team, and her communication keeps everything running smoothly.',
      who: 'Vishal Chugh',
      role: 'ex-colleague'
    },
    {
      quote: 'As a product manager, Natasha consistently demonstrated exceptional leadership and strategic vision. I highly recommend her for any product management role.',
      who: 'Scott States',
      role: 'ex-Boss'
    }
  ];

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  function closestChip(el) {
    while (el && el !== document.body) {
      if (el.classList && el.classList.contains('chip')) return el;
      el = el.parentNode;
    }
    return null;
  }

  function closestDot(el) {
    while (el && el !== document.body) {
      if (el.classList && el.classList.contains('tr-dot')) return el;
      el = el.parentNode;
    }
    return null;
  }

  /* ---------- Homepage: work-showcase filtering ---------- */

  function initFilters() {
    var bar = document.querySelector('.filter-bar');
    if (!bar) return;

    var wraps = Array.prototype.slice.call(document.querySelectorAll('.card-wrap'));
    var empty = document.querySelector('.filter-empty');
    var state = { type: 'all', industry: 'all', skill: 'all' };

    function setVisible(wrap, visible) {
      if (visible) {
        wrap.style.display = '';
        // next frame, so the display change and the fade-in don't collapse into one paint
        window.requestAnimationFrame(function () {
          wrap.classList.remove('is-hidden');
        });
      } else {
        wrap.classList.add('is-hidden');
        window.setTimeout(function () {
          if (wrap.classList.contains('is-hidden')) wrap.style.display = 'none';
        }, 200);
      }
    }

    function apply() {
      var visibleCount = 0;
      wraps.forEach(function (wrap) {
        var matches =
          (state.type === 'all' || wrap.getAttribute('data-type') === state.type) &&
          (state.industry === 'all' || wrap.getAttribute('data-industry') === state.industry) &&
          (state.skill === 'all' || (' ' + (wrap.getAttribute('data-skills') || '') + ' ').indexOf(' ' + state.skill + ' ') !== -1);
        if (matches) visibleCount++;
        setVisible(wrap, matches);
      });
      if (empty) empty.classList.toggle('is-visible', visibleCount === 0);
    }

    bar.addEventListener('click', function (e) {
      var chip = closestChip(e.target);
      if (!chip) return;
      var group = chip.getAttribute('data-group');
      var value = chip.getAttribute('data-value');
      if (!group || !value) return;
      state[group] = value;
      Array.prototype.forEach.call(bar.querySelectorAll('.chip[data-group="' + group + '"]'), function (c) {
        c.classList.toggle('active', c === chip);
      });
      apply();
    });
  }

  /* ---------- Case study pages: related-work recommendations ---------- */

  function initRelated() {
    var mount = document.querySelector('[data-related-work]');
    if (!mount) return;

    var currentId = document.body.getAttribute('data-case-id');
    var current = null;
    for (var i = 0; i < CASES.length; i++) {
      if (CASES[i].id === currentId) { current = CASES[i]; break; }
    }
    if (!current) return;

    var scored = CASES.filter(function (c) { return c.id !== currentId; }).map(function (c) {
      var score = 0;
      if (c.industry === current.industry) score += 2;
      c.skills.forEach(function (s) { if (current.skills.indexOf(s) !== -1) score += 1; });
      if (c.type === current.type) score += 1;
      return { c: c, score: score };
    }).sort(function (a, b) { return b.score - a.score; });

    var top = scored.slice(0, 2);
    var html = top.map(function (entry) {
      var c = entry.c;
      return (
        '<a class="related-card" href="' + c.file + '">' +
          '<div class="related-label">Related work</div>' +
          '<h4>' + c.title + '</h4>' +
          '<p>' + c.blurb + '</p>' +
          '<div class="read-more">Read the full case study →</div>' +
        '</a>'
      );
    }).join('');
    mount.innerHTML = html;
  }

  /* ---------- Testimonial rotator ---------- */

  function initTestimonials() {
    var root = document.querySelector('.testimonial-rotator');
    if (!root) return;
    var track = root.querySelector('.tr-track');
    var dotsWrap = root.querySelector('.tr-dots');
    if (!track) return;

    track.innerHTML = TESTIMONIALS.map(function (t, i) {
      return (
        '<div class="tr-slide' + (i === 0 ? ' active' : '') + '">' +
          '<p>“' + t.quote + '”</p>' +
          '<div class="who">' + t.who + ', <b>' + t.role + '</b></div>' +
        '</div>'
      );
    }).join('');

    if (dotsWrap) {
      dotsWrap.innerHTML = TESTIMONIALS.map(function (_, i) {
        return '<button type="button" class="tr-dot' + (i === 0 ? ' active' : '') + '" data-i="' + i + '" aria-label="Testimonial ' + (i + 1) + '"></button>';
      }).join('') + '<a class="tr-more" href="testimonials.html">Read all testimonials →</a>';
    }

    var slides = Array.prototype.slice.call(track.querySelectorAll('.tr-slide'));
    var dots = dotsWrap ? Array.prototype.slice.call(dotsWrap.querySelectorAll('.tr-dot')) : [];
    var idx = 0;
    var timer = null;

    function show(i) {
      idx = (i + slides.length) % slides.length;
      slides.forEach(function (s, si) { s.classList.toggle('active', si === idx); });
      dots.forEach(function (d, di) { d.classList.toggle('active', di === idx); });
    }
    function next() { show(idx + 1); }
    function start() {
      stop();
      timer = window.setInterval(next, 6000);
    }
    function stop() {
      if (timer) window.clearInterval(timer);
    }

    if (dotsWrap) {
      dotsWrap.addEventListener('click', function (e) {
        var dot = closestDot(e.target);
        if (!dot) return;
        show(parseInt(dot.getAttribute('data-i'), 10) || 0);
        start();
      });
    }
    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);
    start();
  }

  ready(function () {
    initFilters();
    initRelated();
    initTestimonials();
  });
})();
