# Profile Images Setup

This document explains how to add real photos to the profile views.

## Image Locations

Profile images should be placed in: `/public/images/profiles/`

## Required Images

### Vince Gilligan
- **Filename:** `vince-gilligan-hero.jpg`
- **Dimensions:** 1200x400px (3:1 ratio)
- **Suggested Source:** [Getty Images - Vince Gilligan](https://www.gettyimages.com/photos/vince-gilligan)
- **Recommended Photos:**
  - Pluribus world premiere at DGA Theater Complex (Nov 4, 2025)
  - Writers Guild Awards 2025 ceremony photos
  - Telerama magazine photoshoot (Nov 13, 2025, London)

### Rhea Seehorn
- **Filename:** `rhea-seehorn-hero.jpg`
- **Dimensions:** 1200x400px (3:1 ratio)
- **Suggested Source:** [Getty Images - Rhea Seehorn](https://www.gettyimages.com/photos/rhea-seehorn)
- **Recommended Photos:**
  - Golden Globes 2026 red carpet (wearing gold Louis Vuitton gown)
  - Golden Globes press room with award
  - Reference: [Town & Country Coverage](https://www.townandcountrymag.com/leisure/arts-and-culture/a69889028/rhea-seehorn-red-carpet-photos-golden-globes-2026/)

### Character Images (Optional)
For Rhea Seehorn's character gallery:
- `carol-sturka.jpg` (400x500px, 4:5 ratio)
- `kim-wexler.jpg` (400x500px, 4:5 ratio)

## How to Add Images

1. **Purchase/Download** images from Getty Images or other stock photo services
2. **Resize** to the dimensions listed above
3. **Save** to `/public/images/profiles/` with the exact filenames
4. **Update** `profile-view.js` to use local images instead of placeholders:

```javascript
heroImage: 'public/images/profiles/vince-gilligan-hero.jpg',
// Remove or comment out: heroImagePlaceholder
```

## Image Guidelines

- **Format:** JPG or PNG
- **Quality:** High resolution (at least 72 DPI for web)
- **Aspect Ratios:**
  - Hero images: 3:1 (landscape banner)
  - Character cards: 4:5 (portrait)
- **File Size:** Optimize for web (compress to <500KB per image)

## Placeholder Images

The current implementation uses placeholder images that will be replaced when you add real photos. The placeholders show:
- Color-coded backgrounds matching entity types
- Text labels for identification
- Correct aspect ratios

## License Considerations

When sourcing images:
- ✅ Use stock photos from Getty Images, Shutterstock, etc. (with proper license)
- ✅ Use press photos provided by Apple TV+ or AMC (with attribution)
- ✅ Use Creative Commons images (check attribution requirements)
- ❌ Do not use copyrighted images without permission
- ❌ Do not use paparazzi photos

## Testing

After adding images, test by:
1. Refreshing the browser at `http://localhost:8001`
2. Clicking on Vince Gilligan or Rhea Seehorn in the graph
3. Verifying images load correctly in the profile view
4. Checking responsive behavior at different screen sizes
