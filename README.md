# AI Product Builder — Natasha Agarwal's Product Portfolio

Portfolio site for Natasha Agarwal, Senior AI Product Manager: case studies, AI agents and prototypes, and the decision-making behind them.

**Live site:** https://natasha-codehub.github.io/AI_Product_Builder/

## What's here

Static HTML, CSS and a small vanilla JavaScript file. No framework, no build step, no dependencies.

```
index.html           homepage: hero, impact stats, how I work, case study showcase, agents, casebook
about.html           bio and background
books.html           books that shaped how I work
testimonials.html    reference quotes
contact.html         contact links
case-studies/        six case study pages
css/style.css        design tokens and all component styles
js/showcase.js       work-showcase filtering, related-work recommendations, testimonial rotator
images/              headshot, illustrations, case study diagrams, social preview image
favicon.svg          site icon
```

## Case studies

- [Invoice Automation](https://natasha-codehub.github.io/AI_Product_Builder/case-studies/invoice-automation.html)
- [Support Deflection Agent](https://natasha-codehub.github.io/AI_Product_Builder/case-studies/support-deflection-agent.html)
- [Telemetry Forecasting](https://natasha-codehub.github.io/AI_Product_Builder/case-studies/telemetry-forecasting.html)
- [AI Onboarding Agent](https://natasha-codehub.github.io/AI_Product_Builder/case-studies/ai-onboarding-agent.html)
- [AI Regression Intelligence](https://natasha-codehub.github.io/AI_Product_Builder/case-studies/ai-regression-intelligence.html)
- [Behavioral Health RAG](https://natasha-codehub.github.io/AI_Product_Builder/case-studies/behavioral-health-rag.html)

## Run locally

Open `index.html` in a browser, or serve the folder:

```
python -m http.server 8000
```

Then visit http://localhost:8000.

## Deployment

Hosted on GitHub Pages, served from the root of the `main` branch. Every push to `main` redeploys the site automatically, usually within a minute or two.

All links and asset paths are relative, so the site works under the `/AI_Product_Builder/` path without any configuration. The empty `.nojekyll` file tells GitHub Pages to serve the files as-is.

## Adding a case study

1. Add the new page to `case-studies/`.
2. Add a card for it in the `#work` section of `index.html`, with `data-type`, `data-industry` and `data-skills` attributes.
3. Add a matching entry to the `CASES` array at the top of `js/showcase.js` so filtering and related-work recommendations pick it up.
4. Commit and push to `main`.

## Contact

[LinkedIn](http://www.linkedin.com/in/natasha1agarwal)
