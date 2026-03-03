# HACKAURA 2025 Website - Implementation Summary

## Project Overview
A premium hackathon event website featuring neon futuristic design with glassmorphism aesthetics for HACKAURA 2025, a 24-hour national-level hackathon organized by Vikram Sarabhai Tech Club at VSMIT, Nipani.

## Technology Stack
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design tokens
- **UI Components**: shadcn/ui
- **Build Tool**: Vite
- **Animations**: Custom CSS animations + Canvas API

## Design System

### Color Palette
- **Primary (Cyan)**: `hsl(186 100% 50%)` - #00f5ff
- **Secondary (Purple)**: `hsl(271 76% 53%)` - #8b5cf6
- **Accent (Pink)**: `hsl(328 86% 70%)` - #ec4899
- **Neon Magenta**: `hsl(300 100% 50%)` - #ff00ff
- **Neon Yellow**: `hsl(45 93% 47%)` - #fbbf24
- **Background**: Dark gradient from slate-950 → purple-950 → slate-950

### Custom Utility Classes
- `.gradient-text` - Gradient text effect (cyan → purple → pink)
- `.gradient-bg` - Background gradient
- `.glass-effect` - Glassmorphism with backdrop blur
- `.neon-glow-*` - Neon glow effects in various colors
- `.animate-float` - Floating animation
- `.animate-pulse-glow` - Pulsing glow animation

## Custom Components

### 1. ParticleBackground
- Canvas-based particle animation system
- 100 particles with cyan, magenta, purple colors
- Particle connection lines within 150px radius
- 60fps animation performance
- Full-screen fixed positioning

### 2. CountdownTimer
- Real-time countdown to November 26, 2025, 7:00 PM
- Four display blocks: Days, Hours, Minutes, Seconds
- Responsive 2×2 grid on mobile, 1×4 on desktop
- Glassmorphism styling with neon glow effects
- Updates every second

### 3. NeonButton
- Three variants: primary, secondary, outline
- Supports both link and button functionality
- Optional icon support
- Hover scale and glow animations
- Neon glow effects matching variant colors

### 4. GlassCard
- Glassmorphism design with backdrop blur
- Four glow color options: cyan, purple, pink, magenta
- Optional 3D hover effect
- Scroll-triggered fade-in animation
- Intersection Observer for performance

## Page Sections

### Navigation Bar
- Fixed position with backdrop blur
- Logo with animated Sparkles icon
- Desktop menu: About, Domains, Prizes, Venue Flow, Judging, Contact
- Mobile hamburger menu
- Smooth scroll navigation
- Register CTA button

### Hero Section
- Event date badge
- Large gradient title "HACKAURA 2025"
- Tagline: "Ignite. Innovate. Impact."
- Event description
- Two CTA buttons: Register Now, Learn More
- Live countdown timer

### About Section
- Event overview
- Four feature cards:
  - Flash Mob Kickoff
  - Grand Inauguration
  - 24-Hour Marathon
  - Mentor Support

### Competition Domains Section
- Two main tracks:
  - Generative AI
  - Cybersecurity
- Special note about problem statement reveal

### Prize Distribution Section
- Total prize pool: ₹45,000
- Main awards (1st & 2nd place) with cash prizes
- Design Excellence Awards (1st, 2nd, 3rd place)
- Participation certificates

### On-Venue Flow Section
- Complete Day 1 timeline (November 28, 2025):
  - 11:30 AM - Entry Cut-Off & Verification
  - 12:00 PM - Flash Mob Performance
  - 12:15 PM - Grand Inauguration
  - 1:00 PM - Problem Statement Reveal
  - 1:30 PM - Desk Setup & Preparation
  - 2:00 PM - Hackathon Begins!
- Staying & Exit Rules

### Judging Criteria Section
- 8 evaluation parameters
- Competition rules
- FAQ section with 6 common questions

### Contact Section
- 4 event coordinators with phone numbers
- Venue information
- Clickable phone links

### Registration CTA Section
- Prominent call-to-action
- Registration deadline reminder
- Link to Google Forms

### Footer
- HACKAURA 2025 branding
- Organizer information
- Institution details
- Copyright notice

## Responsive Design
- **Mobile**: Single column, stacked layout, hamburger menu
- **Desktop (≥1280px)**: Multi-column grids, full navigation, enhanced spacing

## Animations & Interactions
- Particle system: Continuous 60fps canvas animation
- Countdown timer: Updates every 1 second
- Button interactions: Scale 1.05 on hover, 0.95 on tap
- Card animations: Scroll-triggered fade-in with Intersection Observer
- Hover effects: Scale, translate, increased glow intensity
- Smooth scroll navigation

## Performance Optimizations
- Intersection Observer for scroll animations
- Canvas-based particle system for efficient rendering
- Optimized re-renders with proper React hooks
- Responsive images and lazy loading

## Browser Compatibility
- Modern browsers with ES6+ support
- Backdrop filter support for glassmorphism
- Canvas API for particle animations
- CSS Grid and Flexbox for layouts

## Deployment Notes
- Static website - no backend required
- External registration form (Google Forms)
- All assets are self-contained
- No environment variables needed
- Ready for deployment to any static hosting service

## Future Enhancements (Optional)
- Add registration form integration
- Implement sponsor section
- Add gallery from previous events
- Include testimonials section
- Add social media links
- Implement dark/light mode toggle (currently dark only)

## Contact Information
Event Coordinators:
- Sandesh Birannavar: 77951246
- Pankaj Babaleshwar: 8217221908
- Mudassir Alladatkhan: 8088989442
- Rakshita Halluri: 7204033630

Venue: VSMIT Campus, Nipani

---

**Designed & Developed by Vikram Sarabhai Tech Club © 2025**
