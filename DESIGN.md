---
name: Матчи тура
description: Existing Expo match list visual conventions, extracted from implementation.
colors:
  background: "#f4f6f8"
  surface: "#ffffff"
  ink: "#17212b"
  muted: "#596674"
  line: "#dce2e8"
  accent: "#c42b22"
  accentSoft: "#fff0ee"
  live: "#176947"
  liveSoft: "#eaf6ef"
  tabs: "#e9edf1"
typography:
  headline:
    fontSize: "32px"
    fontWeight: 800
    letterSpacing: "-0.8px"
  title:
    fontSize: "17px"
    fontWeight: 700
    lineHeight: "23px"
  body:
    fontSize: "14px"
  label:
    fontSize: "13px"
    fontWeight: 600
rounded:
  badge: "6px"
  tab: "7px"
  control: "8px"
  tabs: "10px"
  alert: "12px"
  card: "14px"
spacing:
  compact: "8px"
  related: "12px"
  column: "16px"
  page: "20px"
  section: "24px"
components:
  button-refresh:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.surface}"
    rounded: "{rounded.control}"
  button-retry:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.accent}"
    rounded: "{rounded.control}"
  search:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
  tab-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.surface}"
    rounded: "{rounded.tab}"
  status-live:
    backgroundColor: "{colors.liveSoft}"
    textColor: "{colors.live}"
    rounded: "{rounded.badge}"
  match-card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.card}"
    padding: "18px"
---

# Design System: Матчи тура

## Overview

This records the implemented single-screen Expo / React Native system. It extends the original white surface, dark sans text and red favorite accent. The README calls for a neat, readable test assignment; there is no separately approved brand metaphor or new visual identity.

**Key Characteristics:**

- Clear score and club hierarchy.
- Flat white cards on a pale neutral page.
- Red actions and favorites; green live status.

Source of truth: `src/theme.ts`, `src/screens/MatchesScreen.tsx`, `src/components/MatchCard.tsx`, `src/components/FavoriteButton.tsx` and `App.tsx`. Frontmatter records existing values, not new runtime tokens.

## Colors

### Primary

`accent` is the red brand, refresh, retry, selected-favorite and postponed-status color. `accentSoft` backs postponed badges and error notices.

### Neutral

`background` separates the page from `surface` cards and inputs. `ink` supplies headings, club names, scores and the selected filter; `muted` supplies supporting text. `line` supplies thin card/input borders and dividers. `tabs` is the filter tray fill.

Green `live` and `liveSoft` convey live play, alongside a text label and dot. This is a semantic status treatment, not a second brand palette.

## Typography

Use the platform's default sans family; no custom font is configured. The headline is the screen title; title is the club-name role; body is supporting copy; label is the filter role. Scores use bold tabular numerals (30px, weight 700). Metadata uses smaller type (11–13px); the small uppercase score caption is supplementary. Club names wrap rather than truncate.

## Layout

The centered list has a maximum outer width (1120px), horizontal page padding (20px) and bottom padding (28px). A single column switches to two at viewport width (1000px), with a column gap (16px). Thus 320, 390 and 678px use one column; 1280px uses two. This describes code behavior, not an independent screenshot verification.

Headings, filters, metadata and card footers wrap. Search grows within bounds (160–360px), with a minimum height (48px). Cards use an equal-width club column on each side of a centered score block (96px); away text aligns right. Keep minimum widths at zero on flexible club/card containers. The app root currently reserves top space (48px).

## Elevation & Depth

No custom shadows or elevation tokens exist. White surfaces, pale fills and thin borders (1px) establish grouping. No authored motion durations or hover/focus styling exist; retain platform behavior unless deliberately implementing and verifying a change.

## Shapes

Rounded rectangular controls and cards use the observed radii above. Status badges are compact rounded rectangles; the live indicator is a small circle (6px). Avoid substituting new corner scales when extending these components.

## Components

- **Refresh/retry:** solid red refresh or bordered white retry; minimum height (44px). Press opacity is (0.75); disabled refresh opacity is (0.6).
- **Favorite:** outlined/filled star with a minimum target (44 × 44px), additional hit slop (12px), muted/rest and red/selected color. Press opacity is (0.65). Accessible labels and selected state accompany the symbol.
- **Filters:** wrapped tab row in a pale tray with padding/gaps (4px); selected tab uses dark fill and white text. Targets have minimum height (44px). These filter the list; there is no separate navigation system.
- **Search:** white bordered field using control radius and horizontal padding (14px). Preserve its explicit accessible label.
- **Match card:** white bordered container; padding is in frontmatter. Status/favorite row precedes clubs and score, followed by a divided date row. Live scores turn green. Status remains readable as text.
- **Feedback:** pale red error notice with title and retry. Loading and empty states use centered explanatory text. Failed refresh can retain the last successful data with an explicit notice.

## Do's and Don'ts

- Do reuse the theme color roles and existing component shapes.
- Do preserve wrapping, device-local time labels and accessible control states.
- Do keep scores prominent and supporting copy subdued.
- Don't encode status or favorite selection through color alone.
- Don't document custom fonts, animations, shadows or hover treatments as implemented when they are absent.
