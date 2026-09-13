Design a premium, high-end architecture & interior design studio website + admin 
dashboard for "Red Door Studio (RDS)" — a full-service Architecture Design firm that 
designs complete villas: floor plans, reception, kitchen, bedrooms, bathrooms, and 
roof spaces.

STUDIO INFO (to include in footer/contact):
- Studio name: Red Door Studio (RDS)
- Email: reddoorstudio25@gmail.com
- Phone: +20 11 18324473
- Address: Villa No. 28, Banafsag 10, New Cairo - Settlement 1, Cairo, Egypt
- Social: Instagram, Facebook links (icon set, editable by admin)

===========================================
PART 1 — PUBLIC WEBSITE (Visitor Role)
===========================================

BRAND & MOOD:
- Aesthetic: warm, moody, architectural "quiet luxury" — matches real project 
  photography: olive-green cabinetry, walnut wood, black marble with white veining, 
  brushed brass accents, warm layered lighting, and clean architectural floor plans
- Color palette: deep charcoal/near-black background, warm off-white text, olive 
  green secondary accent, brushed gold/brass highlight accent
- Typography: elegant architectural serif or high-contrast display font for headlines, 
  clean minimal sans-serif for body/UI text

★ SIGNATURE HERO ANIMATION (key creative ask):
- On page load: a minimal line-art architectural sketch of a villa (roofline, walls, 
  windows) draws itself stroke-by-stroke (like an SVG line-drawing animation)
- As the user scrolls, this line-art villa "builds up" into the full photographic 
  render of a real completed project — walls fade from wireframe to textured material, 
  roof solidifies, warm lighting switches on room by room — so scrolling literally 
  feels like watching a house get built/rendered
- The headline text ("We Design Homes From The Ground Up") shrinks and fades into the 
  header as the user scrolls past the hero, while the villa image scales up to full-bleed
- This scroll-driven build sequence is the site's core "wow" moment — treat it like a 
  pinned/sticky scroll section (similar to scroll-jacking storytelling sites)

PAGES / SECTIONS:
1. Hero — the villa-building scroll animation described above
2. Projects grid — filterable by dynamic categories (Villas, Kitchens, Bedrooms, 
   Reception, Bathrooms, Swimming Pools, + any category admin adds later)
   - Filter tabs with smooth underline-slide animation
   - Grid thumbnails fade+scale on scroll, hover = slow zoom + gold caption underline
3. Villa Project detail page:
   - Opens with the villa's floor plan (ground floor, first floor, roof floor as 
     tabbed/swipeable architectural drawings, clean technical-drawing style with 
     labels that fade in)
   - Below the floor plans: a room-by-room gallery (Reception → Kitchen → Master 
     Bedroom → Bathroom → Bedroom → Bathroom, etc., matching however many rooms 
     that project has), each transitioning in with soft parallax/fade
   - Material callouts beside key shots (e.g. "Black Marquina marble", "Custom 
     walnut millwork")
4. Materials & Craft strip — horizontal scroll of signature finishes (marble, wood, 
   brass) with hover-zoom
5. About the Studio — firm story, architectural philosophy, animated fade-up text
6. Services — expandable list: Full Villa Design | Architectural Floor Plans | 
   Interior Design | Kitchen Design | Bedroom Design | Landscape/Pool Design | 
   Custom Furniture & Lighting
7. Contact — map/address block, "Book a Consultation" button with magnetic hover, 
   phone/email, social icons (all pulled dynamically from admin-managed data)

MICRO-INTERACTIONS:
- Scroll-triggered fade/slide-up reveals throughout
- "Reveal mask" animation on portfolio images (image slides up like unveiling a room)
- Custom cursor on desktop: circular cursor that expands to "View Project" on hover
- Grid-to-detail transition: thumbnail image morphs/expands into detail page hero
- Filter tab switching: staggered fade out/in of grid items, not a hard cut
- Loading screen: RDS monogram line-draws itself in gold before revealing homepage

===========================================
PART 2 — ADMIN DASHBOARD (Admin Role)
===========================================

Design a separate, clean, functional admin panel (different visual language from the 
public site — more utilitarian, still on-brand with the dark/gold palette but 
prioritizing clarity and speed over cinematic animation):

1. Login screen — simple, secure-feeling, RDS branding, "Admin Login" vs implied 
   public site (no public signup — admin accounts are created manually/invited)

2. Dashboard home — overview cards: total projects, total categories, recent activity, 
   quick-add buttons ("+ New Project", "+ New Category")

3. Projects manager:
   - Table/grid list of all villa projects with thumbnail, name, category tags, 
     status (Published/Draft), last edited
   - "+ Add New Project" flow: 
     a) Project name, category assignment (existing or create new on the fly)
     b) Upload floor plans (ground/first/roof — dynamic, add as many floors as needed)
     c) Upload room galleries — dynamically add room sections (e.g. "Kitchen", 
        "Master Bedroom") each with its own image set and optional material captions
     d) Preview before publish
   - Edit/delete existing projects

4. Categories manager:
   - List of current categories (Villas, Kitchens, Bedrooms, Reception, Bathrooms, 
     Swimming Pools...)
   - "+ Add New Category" — simple form: category name, icon/cover image, so if the 
     studio starts offering a new service (e.g. "Swimming Pools" or "Landscape Design"), 
     it instantly becomes a new filterable section on the public site
   - Reorder categories via drag-and-drop

5. Pages & Content manager:
   - Edit "About Us" text/images
   - Edit "Services" list (add/remove/reorder service items)
   - Edit contact info (email, phone, address) — pre-filled with:
     reddoorstudio25@gmail.com | +20 11 18324473 | Villa No. 28, Banafsag 10, 
     New Cairo - Settlement 1, Cairo, Egypt

6. Social Channels manager:
   - Add/edit/remove social media links (Instagram, Facebook, Behance, TikTok, etc.) 
     — each with platform icon picker + URL field, admin can add new platforms not 
     in the default list

7. Media library — central place to browse/manage all uploaded images across projects

LAYOUT (Admin):
- Left sidebar navigation (Dashboard, Projects, Categories, Pages, Social, Media, 
  Settings, Logout)
- Clean card/table-based main content area, dark theme matching brand but higher 
  contrast for readability
- Forms use clear labels, drag-and-drop image upload zones, and inline validation

DELIVERABLE:
- High-fidelity Figma prototype covering both the public site (with Smart Animate 
  transitions simulating the scroll-driven villa-build hero, grid reveals, and 
  grid-to-detail transitions) AND the full admin dashboard flow (login → dashboard 
  → add project → add category → manage pages/social), with component variants for 
  all interactive states, ready to hand off for development (public site: Framer 
  Motion/GSAP ScrollTrigger for animation; admin: connected to a CMS/database backend 
  for dynamic content).