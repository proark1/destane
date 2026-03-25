# Design System Specification: The Cinematic Curator

## 1. Overview & Creative North Star
The "Creative North Star" of this design system is **The Cinematic Curator**. We are moving away from the cluttered, high-velocity "crypto" aesthetic and toward a high-end, editorial experience that mirrors the exclusivity of a private equity firm mixed with the visual gravity of a modern film studio.

The system breaks the "standard template" look through **Intentional Asymmetry** and **Tonal Depth**. Instead of rigid, boxed-in grids, we use expansive breathing room (`spacing-16` to `spacing-24`) and overlapping elements to create a sense of three-dimensional space. We prioritize a "High-Contrast Editorial" scale where massive `display-lg` headlines command attention against ultra-minimalist functional elements.

---

## 2. Colors: Tonal Luxury
Our palette is rooted in the "Dark Luxury" of Dubai nights—deep charcoals and blacks punctuated by the warmth of liquid gold and bronze.

### The Palette (Core Tokens)
- **Background & Surfaces:** `surface` (#131313), `surface_container_lowest` (#0e0e0e).
- **Primary Accents:** `primary` (#f2ca50 - Vivid Gold), `primary_container` (#d4af37 - Deep Gold).
- **Tertiary Warmth:** `tertiary` (#fac493 - Warm Amber).

### The "No-Line" Rule
Standard 1px borders are strictly prohibited for sectioning. Definition must be achieved through:
1.  **Background Shifts:** Transitioning from `surface` to `surface_container_low` to denote a new functional area.
2.  **Tonal Transitions:** Using the `outline_variant` (#4d4635) at 10-15% opacity only when absolutely necessary for accessibility.

### The "Glass & Gradient" Rule
To ensure a futuristic feel, floating elements (modals, navigation bars) must utilize **Glassmorphism**. Apply `surface_container` with a `backdrop-filter: blur(20px)` and a 10% opacity `outline` to simulate premium frosted glass. Use "Signature Gradients" for CTAs, transitioning from `primary` (#f2ca50) to `primary_container` (#d4af37) at a 135-degree angle to provide a metallic, light-catching sheen.

---

## 3. Typography: Editorial Authority
We utilize two typefaces to balance modern technology with timeless luxury.

*   **Display & Headlines:** `plusJakartaSans`. This is our "Voice." It should be used with generous letter-spacing (-0.02em) for a sophisticated, cinematic feel.
*   **Body & UI:** `inter`. This is our "Engine." It provides maximum readability for complex tokenomics and data.

### Hierarchy Highlights
- **Display-LG (3.5rem):** Reserved for hero titles and key investment figures. Use `on_surface`.
- **Headline-SM (1.5rem):** Used for project titles in card layouts.
- **Label-MD (0.75rem):** All-caps with +0.05em tracking for metadata, status badges, and secondary navigation.

---

## 4. Elevation & Depth: Tonal Layering
We reject drop shadows that look like "fuzz." We build hierarchy through physical stacking.

### The Layering Principle
1.  **Base:** `surface_dim` (#131313) - The global canvas.
2.  **Sectioning:** `surface_container_low` (#1c1b1b) - For large content blocks.
3.  **Components:** `surface_container` (#201f1f) - For cards and interactive modules.
4.  **Prominence:** `surface_container_highest` (#353534) - For hover states and active selections.

### Ambient Shadows
When an object must "float" (e.g., a primary modal), use a shadow color tinted with `surface_tint` (#e9c349) at 5% opacity. Blur radius should be no less than 40px to simulate soft, architectural lighting.

### The "Ghost Border" Fallback
If an element lacks contrast against its parent, use a "Ghost Border": `outline_variant` at 20% opacity. Never use pure white or high-contrast grey borders.

---

## 5. Components: The Premium Primitive

### Buttons
- **Primary:** Gradient fill (`primary` to `primary_container`). `on_primary` text. No border. `rounded-md` (0.375rem).
- **Secondary:** `surface_container_highest` fill with a `primary` "Ghost Border" at 30% opacity.
- **Tertiary:** Ghost button (text-only) using `primary` color with `label-md` styling.

### Cards & Media
- **The Frame:** Use `surface_container_low`. Forbid divider lines.
- **Hover State:** Subtle lift using `surface_container_high` and a soft gold glow (`surface_tint` at 10% opacity) on the bottom edge.
- **Imagery:** All imagery must have a subtle `linear-gradient` overlay from `transparent` to `surface_container_lowest` at the bottom to allow text to sit over the image.

### Progress Bars (Funding)
- **Track:** `surface_container_highest`.
- **Indicator:** A soft-glowing gradient from `primary` to `tertiary`.
- **Animation:** Indicators should ease-in with a cinematic, slow-motion feel (800ms).

### Input Fields
- **Default:** `surface_container_lowest` background. 
- **Active State:** A 1px "Ghost Border" using `primary_fixed` at 40% opacity. 
- **Typography:** Placeholder text must use `on_surface_variant` at 50% opacity.

---

## 6. Do’s and Don’ts

### Do
- **Do** use asymmetrical margins to create "Editorial White Space."
- **Do** use `plusJakartaSans` for large, bold numerical data to emphasize value.
- **Do** lean into `surface_container` tiers for depth instead of relying on lines.
- **Do** ensure all "Gold" elements maintain a 4.5:1 contrast ratio against the dark backgrounds.

### Don’t
- **Don’t** use "Neon" or high-vibrancy blues/purples. Stay within the Gold/Amber/Bronze spectrum.
- **Don’t** use `rounded-full` (pill shapes) for buttons; it feels too "consumer-tech." Use `rounded-md` or `rounded-lg` for a more architectural feel.
- **Don’t** use standard 1px dividers between list items. Use `spacing-4` gaps or subtle background shifts.
- **Don’t** clutter the screen. If a piece of data isn't vital to the investor's "Cinematic" experience, move it to a secondary layer.