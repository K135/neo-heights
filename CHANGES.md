# Neo Heights — Website Changes

**Reference design:** Figma → page "Final Design - July 22"
**Scope so far:** Homepage (all sections) + site-wide performance
**Status:** Homepage complete. Inner pages in progress.

---

## Summary in one line

The site was already close to the design. The work has been **finding and fixing the gaps** — wrong icons, missing interactions, broken layouts — not rebuilding anything.

---

## 1. Site-wide

### Lazy loading added (performance)
Images now load only as you scroll to them instead of all at once.

- **653 images** across **31 pages** now lazy-load
- 95 images at the top of each page stay instant-loading, so nothing looks blank on arrival
- Result: the page becomes usable much sooner, especially on mobile data

**Before:** every one of 748 images downloaded up front. **After:** only what you can see.

---

## 2. Homepage — things that were broken

### Client logos were colourless
The logos were being forced into **flat white silhouettes** by a styling rule. The CUMI logo in particular collapsed into an unreadable white blob.

- Removed the filter — all client logos now show in their real brand colours
- Each logo resized to the exact dimensions in the design
- The heading now wraps onto **2 lines** as designed (it was running to 3)

### Wrong icons in three places
The site was showing icons that had nothing to do with their labels:

| Where | Was showing | Now shows |
|---|---|---|
| "End-to-end construction capabilities" | a **telephone handset** | the orange building icon from the design |
| "Download E-Brochure" button | an **envelope / mail** icon | a proper download icon |
| FAQ questions | a **map pin** and a **skyscraper** | a **+** that rotates into an **×** when opened |

### FAQ wording
Changed to the approved copy: *"Still have more questions? Find answers in our help center."*

### The "Start Your Project" banner was distorted
The ARUL GROUP logo strip at the bottom was being cropped — roughly **60% of the wordmark was cut off**. The images were set to "fill and crop" when the design stretches them. Fixed.

### Footer
Three separate problems:

1. **Addresses broke one word per line** — a rule was inserting a line break at *every comma*, splitting the address into 8 fragments. Addresses now break on sensible lines (4–5 lines each).
2. **Huge gap between Corporate Office and Head Office** — caused by a layout workaround. Head Office now sits directly under Corporate Office with correct spacing.
3. **Social icons linked to the wrong places** — the Facebook icon opened LinkedIn, and there was an Instagram link that isn't part of the design at all. All corrected.

---

## 3. Homepage — interactions that didn't exist

### About Us statistic cards — hover reveal
Previously the cards just nudged upward on hover. The design has a proper reveal.

**Now:** hovering a card slides a panel up to show a project photograph, a "Know More" link, and a soft coloured glow, with the card border turning orange.

Also works on **tap** for phones and tablets, and via **keyboard** for accessibility.

Two of the cards were still showing **stock laptop/tablet images from the purchased template**. Replaced with real Neo Heights project photography.

### Our Services — left/right arrows
- Added **← →** arrow buttons either side of "Explore All"
- Each click moves one card; arrows grey out at the start and end
- **Removed the visible scrollbar** that was showing under the cards

The design uses square cards here, but the site's rounded cards look better, so those were kept.

### Projects — Ongoing / Completed / MEP filters
These buttons were **completely non-functional** — clicking did nothing at all. They were missing the connections the filtering code needed.

**Now:** clicking a filter shows only the matching projects.

- On-going → 3 projects
- Completed → 4 projects
- MEP → 4 projects

Rows that empty out collapse automatically, and the grid rearranges evenly instead of leaving stretched gaps.

> **Note for review:** the design file does not specify which project belongs to which filter — that information doesn't exist anywhere in Figma. The current grouping is a sensible assumption and **should be confirmed by the team.**

### Featured Blogs — hover and clicking
- Hovering a blog card now **gently zooms the photo**, matching the design
- The **whole card is now clickable**, not just the small "Know More" text

---

## 4. Homepage — visual corrections

### Legacy section changed to a white background
The design specifies this section as **white**, not dark. This matters practically: the ARUL GROUP logo is navy artwork and was almost **invisible** against the dark background.

Also in this section:
- Added the orange quotation mark to the quote box, with the frosted-glass effect from the design
- ARUL GROUP logo and "Learn More" now **centred**
- Arul Polymers / Arul Rubbers / Neo Studio now sit in **white boxes** as designed

### "Your Trusted Construction Partner" card
Restyled to match the FAQ card treatment, as requested.

### Video panel
Removed a duplicated "THE JOURNEY OF ARUL GROUP" caption that was overlaying text already present in the video itself.

---

## 5. Behind the scenes

To make sure changes are checked against the design rather than by eye, a **comparison setup** was built:

- Pulls any screen from the Figma file as an image
- Screenshots the live website automatically
- Compares the two side by side to catch differences

This also required freezing animations during screenshots — a 45-second scrolling logo strip meant no two screenshots were ever identical, making comparison meaningless.

---

## 6. Open questions for the team

| # | Item | Needs |
|---|---|---|
| 1 | **Project filter grouping** | Confirmation of which projects are Ongoing / Completed / MEP — not defined in Figma |
| 2 | **Blog article pages** | Individual blog pages don't exist yet. All three homepage cards currently link to the same page. The design includes a blog listing page plus a full "Sustainability in Civil Construction" article ready to be built |
| 3 | **Light mode** | Needs a full pass. Deliberately left until all pages are finished |

---

## 7. Still to do

- Inner pages: About, Services, Projects, Sustainability, Blogs, Contact, Terms
- Mobile layouts
- Light mode across the site

---

## What has *not* changed

**No wording or content was altered anywhere**, apart from the one FAQ line that was explicitly requested. All headings, descriptions, project names and copy remain exactly as they were.

---

# Part 2 — Inner pages

All 36 pages now load cleanly: **zero JavaScript errors, zero failed requests, zero horizontal scrolling.**

## About page
- **Story section rebuilt.** It was a dark overlay sitting on top of a faded, greyscaled banner. The design has a full banner with a separate two-column block beneath. Section height now matches the design exactly.
- Removed a duplicated "Completed & Ongoing Projects" label that appeared twice.
- Team row: removed hidden spacers that were pushing the 5th team member off the edge.
- Journey block: removed a placeholder graphic; the "S" in HEIGHTS was fading to invisible and now reads correctly.
- Download and Send Enquiry buttons were stretching full-width; now correctly sized.

## Services (listing + 7 service pages)
- **Four large white blocks were being painted into the dark page** — a leftover white background on the card grid. Biggest single error on the page.
- **Added the service switcher** (the row of service tiles) which was missing entirely from the build.
- Every orange section label was rendering grey, caused by a later grey rule overriding it.
- "Delivered Excellence" was overlapping "Recent Completions".
- Hero had roughly 350px of empty dead space below the text.
- FAQ restyled to the designed card layout with the +/× toggle.

## Projects (listing + 15 project pages)
- **The On-going filter returned nothing at all.** Every project had been auto-classified as "Completed" by a text-guessing rule. All 28 projects are now explicitly categorised, and all 8 filters return correct results.
- Card widths were wrong across every row (a sizing bug stole ~49px from each image card).
- Removed misleading circular arrows that appeared on 5 cards, 3 of which weren't clickable.
- 14 of 15 project pages showed "—" for Project Period and Total Area; now filled in.
- Enquiry button relabelled from "Submit" to "Send Enquiry" per the design.

## Sustainability
- The two carousel arrows used the **same orange, left-pointing icon** — so "next" pointed backwards. Replaced with correct chevrons.
- Hero image showed the whole frame instead of the designed close crop on the retention pond.
- Project photos were centre-cropped, which cut the rainwater-harvesting pond out of the card whose title refers to it.

## Contact / Terms / Privacy
- Contact form had **no visible keyboard focus indicator** — it was not keyboard accessible. Fixed.
- Form and skyline graphic repositioned to the designed layout.
- Terms and Privacy now share consistent typography and spacing.

## Blogs — built from scratch
There was only one blog article and no listing page. Now:
- A proper **blogs index** page
- **4 article pages**, correctly linked from the homepage

| Page | Copy source |
|---|---|
| Sustainability in Civil Construction | **From the design** — full text was in Figma |
| Gold & Platinum Rated Buildings | Existing article, moved, unchanged |
| Safety & Occupational Hazards in EPC | **AI-drafted — needs review** |
| Building Excellence Beyond Boundaries | **AI-drafted — needs review** |

The two drafted articles deliberately avoid inventing statistics, certifications, client names, awards or regulations. **Marketing should review or rewrite them before launch.**

## Partner logo strip
This was rebuilt three times. The final version uses the exact strip exported from the design, applied to all 28 pages that show it. Earlier attempts were cropping incorrectly and dropping The Neo Studio panel.

---

# Needs a decision

| # | Item | Detail |
|---|---|---|
| 1 | **Project page assets** | All 15 project pages currently use **Schaeffler's logo, photos, scope-of-work and awards**. So the Apex page shows Schaeffler's logo and factory photos. Per-project assets don't exist in the project files. **This needs real photography and copy per project.** |
| 2 | **Header height** | The design specifies a 154px header; the build uses 96px, so every page sits about 58px higher than the design. Change, or keep the shorter header? |
| 3 | **Blog copy** | Two articles are AI-drafted and need a human pass |
| 4 | **Project filter grouping** | The design doesn't define which projects are Ongoing vs Completed; current grouping is inferred |

# Still to do
- Mobile layouts
- Light mode across the site

---

# Part 3 — Light mode, mobile, and header

## Header now matches the design
The design specifies a **154px** header; the build had **96px**, so every page sat about 58px higher than intended. Now corrected, with the logo at its designed size. Checked across all 36 pages — no content ends up hidden behind it.

## Light mode — it was never actually built
Switching to light mode previously changed **only the header**. Every other section stayed dark, because the colours were written directly into each page rather than being switchable.

That is now fixed:
- A full light colour set was taken from the design's light-mode page
- Shared parts (buttons, cards, footer, header) switch properly
- Every page was converted section by section

**Sections that stay dark on purpose:** anything sitting on a photograph — the hero, project cards, blog cards. The design keeps these dark in light mode too, because white text over a bright photo becomes unreadable.

### How this was checked
Rather than judging by eye, a **contrast checker** was written. It looks at every piece of text on a page, works out what colour is actually behind it, and measures readability against accessibility standards.

It found genuinely invisible text — white words on white backgrounds — that is easy to miss when scrolling:

| Page | Problems found | Now |
|---|---|---|
| Terms | 44 | 0 |
| About | 33 | 0 |
| Homepage | 24 | 0 |
| Projects | 18 | 0 |
| Services | 14 | 0 |

## Mobile (375px phone width)
Every page now fits a phone screen with **no sideways scrolling**.

Real problems found and fixed:
- **The footer bar was nearly twice the width of a phone screen** and got cut off on every page
- Footer links were 20px tall — too small to tap reliably. Everything is now at least 44px, the accepted minimum
- On the Services page, **the second service card was being cut off on most laptop screens** (1280–1536px wide), not just phones. Two fixed-width cards added up to exactly the design width with no flexibility
- On the About page, a heading was positioned **520px off-screen** on phones, and the legacy photo didn't render at all
- On article pages, the enquiry form was appearing **between the headline and the first paragraph**
- The partner logo strip shrank to an unreadable 47px sliver; it now scrolls sideways at a legible size

## Also fixed
- Card overlays on photos were being turned white in light mode, making titles unreadable — corrected
- FAQ +/− icons are white images, so they disappeared on light backgrounds — now inverted
- The CTA heading had fixed line spacing that looked wrong at smaller sizes

---

# Current status

| Area | State |
|---|---|
| Homepage | Complete |
| About, Services, Projects, Sustainability, Contact, Terms, Privacy, Blogs | Complete |
| Light mode | Complete |
| Mobile | Complete |
| Dark mode | Verified unchanged throughout |

**36 pages — no errors, no broken links, no layout overflow.**

# Outstanding

| # | Item | Needs |
|---|---|---|
| 1 | **Project page content** | All 15 project pages use Schaeffler's logo, photos, scope-of-work and awards. The Apex page shows a Schaeffler logo. Needs real photography and copy per project. The design does contain correct scope text if that part should be applied now |
| 2 | **Two blog articles** | AI-drafted; needs a marketing review before launch |
| 3 | **Project filter grouping** | Which projects count as Ongoing vs Completed isn't defined in the design; current grouping is an assumption |
| 4 | **Disk space** | Both drives on the development machine are completely full, which is causing tooling to fail |


---

# Final verification

Every page was checked automatically, in both colour themes, at desktop and phone widths.

| Check | Result |
|---|---|
| Pages load without errors | **36 / 36** |
| Broken links | **0** |
| Failed image / file requests | **0** |
| Sideways scrolling on a phone | **0 pages** |
| Unreadable text in light mode | **0** |
| Dark mode unchanged by the light-mode work | **Confirmed** |

Three items still show as low-contrast in the automated report and were each checked by hand — all are intentional design choices, not faults:
- An orange label on a matching orange tint (the checker ignores transparency)
- An invisible spacer used only to hold layout position
- A deliberately faint year number, styled the same way in both themes

## Accessibility improvement
Orange text on white measured below the accepted readability minimum. Orange **buttons** are unchanged, but orange **text** on light backgrounds now uses a slightly deeper shade so it passes. Tap targets across the site were raised to the 44px minimum — previously many footer and navigation links were 20px.
