---
name: Матчи тура
description: Compact football results list in React Native and Expo web.
colors:
  background: "#ffffff"
  surface: "#f3f4f1"
  ink: "#222622"
  muted: "#686e68"
  line: "#e3e6df"
  accent: "#bd342a"
  accentSoft: "#fff5f2"
  live: "#bd342a"
  liveSoft: "#fff5f2"
typography:
  headline:
    fontFamily: "RobotoCondensedBold"
    fontSize: "46px"
    lineHeight: "50px"
    letterSpacing: "-0.7px"
  headline-compact:
    fontFamily: "RobotoCondensedBold"
    fontSize: "34px"
    lineHeight: "40px"
    letterSpacing: "-0.7px"
  masthead:
    fontFamily: "RobotoCondensedBold"
    fontSize: "23px"
    letterSpacing: "-0.3px"
  score:
    fontFamily: "RobotoCondensedBold"
    fontSize: "28px"
  title:
    fontSize: "17px"
    fontWeight: 600
    lineHeight: "23px"
  title-compact:
    fontSize: "15px"
    fontWeight: 600
    lineHeight: "21px"
  label:
    fontSize: "13px"
    fontWeight: 600
  metadata:
    fontSize: "12px"
    lineHeight: "18px"
rounded:
  control: "4px"
  retry: "8px"
  alert: "12px"
spacing:
  compact: "8px"
  related: "12px"
  controls: "16px"
  page: "20px"
  masthead: "24px"
components:
  button-refresh:
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "0 12px"
  button-retry:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.accent}"
    rounded: "{rounded.retry}"
    padding: "0 14px"
  search:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
  tab-selected:
    textColor: "{colors.accent}"
  score:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    width: "78px"
  score-live:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.background}"
    rounded: "{rounded.control}"
    width: "78px"
  match-row:
    padding: "22px 20px"
  match-row-live:
    backgroundColor: "{colors.liveSoft}"
---

# Design System: Матчи тура

## Overview

The implemented screen uses a compact football results list: a condensed masthead, prominent scores, flat rows and restrained red states. It replaces the earlier rounded card grid following the user's request to make the interface feel less AI-generated.

**Key Characteristics:**

- One continuous match list with fine dividers.
- White background and muted olive-gray supporting tones.
- Condensed headings and scores; platform sans for clubs and controls.

Source: src/theme.ts, src/screens/MatchesScreen.tsx, src/components/MatchCard.tsx, Icon.tsx, FavoriteButton.tsx, UpdatedAgo.tsx and App.tsx. This records implementation; browser screenshots do not establish native-device verification.

## Colors

### Primary

Accent red marks the selected filter, selected favorite, live score and exceptional status text. accentSoft backs error feedback. live and liveSoft intentionally share the red palette; the latter tints the entire live row. Live status also has a dot and text.

### Neutral

background is the white page. surface fills search, ordinary score boxes, retry controls and pressed/hovered controls. ink supplies primary text and the masthead rule; muted supplies metadata and inactive icons. line separates controls and match rows.

## Typography

The local assets/fonts/RobotoCondensed-Bold.ttf is registered as RobotoCondensedBold through expo-font. It supplies the masthead, screen title and score. The file was instantiated at weight 700 with fontTools from the [Google Fonts Roboto Condensed variable font](https://github.com/google/fonts/tree/main/ofl/robotocondensed); its SIL Open Font License is retained in assets/fonts/OFL.txt.

Other text uses the platform default sans. Club names use the title roles and wrap; city text is smaller (12px, line height 17px). Filter counts and scores use tabular numerals. An unavailable score is a muted dash pair (22px), without a filled box.

## Layout

The list remains one column at every width. Its centered content has maximum outer width (1080px), horizontal padding (20px) and bottom padding (36px). The masthead has vertical padding (24px), a dark bottom rule (1px), and bottom margin (36px).

Below viewport width (760px), the title uses the compact role, search fills the available width, and match metadata moves above the teams. The favorite target moves to the row's upper right. Wide rows place metadata (160px), teams and favorite on one line. Teams flank a fixed score box, with the home club right-aligned. Flexible team containers retain minimum width zero.

Rows have minimum height (105px). Compact rows use horizontal padding (14px), top padding (18px), bottom padding (22px) and content gap (18px). The heading, controls, metadata and footer can wrap. The root reserves top space (48px) on native platforms and none on web.

## Elevation & Depth

There are no authored shadows or elevation effects. Fine rules, pale control fills and the live-row tint establish grouping. No custom animation durations are defined.

## Shapes

Match rows have square edges and a bottom divider (1px). Small control and score corners use the control radius; retry and error feedback retain their larger radii. SVG icons use a consistent outline (1.6px stroke), with a filled star for the selected favorite.

## Components

- **Refresh:** quiet icon/text action with minimum height (44px); pressed/hovered fill uses surface, disabled opacity is (0.6).
- **Filters:** transparent text tabs with counts, gap (16px), minimum height (54px), and selected red bottom rule (2px). Pressed/hovered tabs use surface. These filter matches rather than navigating screens.
- **Search:** pale inset field with search icon, minimum height (44px), horizontal padding (12px), and explicit accessible label. Wide width is bounded (160–230px).
- **Match row:** metadata, two club/city pairs, centered score and favorite. Ordinary scores use surface; live scores use red with white text. Status remains visible as text.
- **Favorite:** SVG star in a minimum target (44 × 44px) with hit slop (12px), muted outline at rest and red fill when selected. Pressed/hovered background uses surface; accessible state and labels accompany the icon.
- **Feedback:** pale error notice with retry; centered loading/empty explanations. A failed refresh can preserve the last successful data with an explicit notice. Footer labels show device-local time context and elapsed update time.

## Do's and Don'ts

- Do keep match rows in one continuous list across widths.
- Do reuse the existing color roles, local display font and SVG icon style.
- Do preserve wrapping, device-local time labels and accessible control states.
- Don't restore the previous two-column rounded-card layout.
- Don't encode status or favorite selection through color alone.
- Don't present untested native rendering or custom focus/animation effects as verified behavior.
