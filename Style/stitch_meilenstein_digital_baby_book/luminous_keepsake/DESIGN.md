---
name: Luminous Keepsake
colors:
  surface: '#fef8f1'
  surface-dim: '#dfd9d2'
  surface-bright: '#fef8f1'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f9f3ec'
  surface-container: '#f3ede6'
  surface-container-high: '#ede7e0'
  surface-container-highest: '#e7e2db'
  on-surface: '#1d1b17'
  on-surface-variant: '#4f453d'
  inverse-surface: '#32302c'
  inverse-on-surface: '#f6f0e9'
  outline: '#80756c'
  outline-variant: '#d2c4b9'
  surface-tint: '#74593f'
  primary: '#74593f'
  on-primary: '#ffffff'
  primary-container: '#ffdab9'
  on-primary-container: '#795e44'
  inverse-primary: '#e3c0a0'
  secondary: '#37656b'
  on-secondary: '#ffffff'
  secondary-container: '#b8e8ee'
  on-secondary-container: '#3b6a6f'
  tertiary: '#006e20'
  on-tertiary: '#ffffff'
  tertiary-container: '#91f892'
  on-tertiary-container: '#007422'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdcbe'
  primary-fixed-dim: '#e3c0a0'
  on-primary-fixed: '#2a1704'
  on-primary-fixed-variant: '#5a422a'
  secondary-fixed: '#bbebf1'
  secondary-fixed-dim: '#9fcfd5'
  on-secondary-fixed: '#001f23'
  on-secondary-fixed-variant: '#1d4d53'
  tertiary-fixed: '#93f993'
  tertiary-fixed-dim: '#77dc7a'
  on-tertiary-fixed: '#002105'
  on-tertiary-fixed-variant: '#005316'
  background: '#fef8f1'
  on-background: '#1d1b17'
  surface-variant: '#e7e2db'
typography:
  display-lg:
    fontFamily: Quicksand
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Quicksand
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Quicksand
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Quicksand
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 26px
  body-md:
    fontFamily: Quicksand
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
  label-sm:
    fontFamily: Quicksand
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  caption:
    fontFamily: Quicksand
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  container-margin: 20px
  gutter: 16px
---

## Brand & Style
The design system is centered on the concept of a "living scrap-book"—a digital vessel for precious memories that feels as tactile and warm as a physical baby album. The target audience consists of parents and caregivers who seek a calm, joyful space to document growth without the clinical pressure of traditional developmental trackers.

The aesthetic blends **Soft Minimalism** with **Tactile/Skeuomorphic** elements. Surfaces should feel soft to the touch, utilizing high border radii and subtle inner glows to mimic the appearance of plush paper or organic shapes. The emotional response is one of nostalgia, safety, and delight, achieved through generous whitespace and an unhurried visual rhythm.

## Colors
The palette is rooted in soft, sun-drenched pastels that evoke early morning nursery light. 

- **Primary (Peach):** Used for main actions, active states, and celebration highlights.
- **Secondary (Soft Blue):** Reserved for secondary navigation and calming information clusters.
- **Tertiary (Mint):** Used for growth indicators, "completed" milestones, and health-related nuances.
- **Neutral (Warm Cream):** This is the foundation of the UI, replacing stark whites to reduce eye strain and increase the feeling of "warmth."
- **Text:** Avoid pure black. Use a deep, warm espresso (#5D524F) to maintain legibility while staying within the soft aesthetic.

## Typography
This design system exclusively uses **Quicksand** for its rounded terminals and open counters, which convey friendliness and accessibility. 

- **Display & Headlines:** Use heavier weights (600-700) with slight negative letter spacing to create a cohesive, "bubbly" feel for milestones and names.
- **Body Text:** Use Medium (500) weight as the default for better legibility on mobile screens against pastel backgrounds.
- **Emphasis:** Avoid italics; use weight increases or color shifts to highlight important developmental notes.

## Layout & Spacing
As a mobile-first PWA, the layout prioritizes a single-column flow with "breathing room" at the edges. 

- **The Grid:** A flexible 4-column mobile grid with 20px side margins.
- **Visual Rhythm:** Use "loose" spacing (lg and xl units) between major sections to prevent the UI from feeling cluttered.
- **Containment:** Content should be grouped in floating cards rather than edge-to-edge list items, emphasizing the "scrapbook" feel where each memory is its own object.

## Elevation & Depth
Depth is created through **Tonal Layers** and **Organic Shadows**. 

1. **The Base:** The background is always the warm neutral cream (#FFF9F2).
2. **The Surface:** Cards and containers use pure white (#FFFFFF) with a very soft, diffused shadow (Blur: 20px, Y: 8px, Opacity: 6% of the primary or neutral-dark color). 
3. **The Interaction:** Active elements may feature a subtle "pressed" inner shadow to simulate a soft, squishy button or tactile material.
4. **Gradients:** Use very subtle linear gradients on primary buttons (e.g., Peach to a slightly more vibrant Coral-Peach) to give elements a 3D, "touchable" quality.

## Shapes
Shapes are unapologetically round. This design system avoids sharp corners entirely to maintain the "safety" and "softness" of a child-focused environment.

- **Standard Elements:** Buttons, input fields, and small cards use a 16px to 24px radius.
- **Container Level:** Large content cards and modals use a 32px radius.
- **Feature Icons:** Encapsulate icons in circles or "squircular" organic blobs to keep the visual language consistent.

## Components
- **Buttons:** Large, pill-shaped, and high-contrast. The primary "Add Milestone" button should use a subtle gradient and a soft shadow to appear floating.
- **Milestone Cards:** Feature a large image area with a 24px top-radius. Text below should be centered with a prominent date label in the secondary blue.
- **Chips:** Used for category tags (e.g., "First Steps," "Language"). These should have 100px (pill) radius and use low-saturation versions of the primary/secondary/tertiary colors.
- **Input Fields:** Thick borders (2px) in a soft neutral-dark color, or entirely borderless with a soft-tinted background. Focus states use a peach glow.
- **Progress Trackers:** Use rounded "bead" indicators rather than a flat bar. As a child nears a milestone, the beads fill with the tertiary mint green.
- **Empty States:** Use hand-drawn style illustrations with the system's palette to maintain the personal, non-clinical tone.