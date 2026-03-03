# HACKAURA 2025 Website Requirements Document

## 1. Website Overview

### 1.1 Website Name
HACKAURA 2025

### 1.2 Website Description
A premium hackathon event website for a 24-hour national-level hackathon organized by Vikram Sarabhai Tech Club at VSMIT, Nipani. The website serves as the primary platform for event information, registration, and participant engagement.

### 1.3 Event Details
- **Event Date**: November 28-29, 2025
- **Registration Deadline**: November 26, 2025, 7:00 PM
- **Duration**: 24-hour coding marathon
- **Organizer**: Vikram Sarabhai Tech Club, VSMIT, Nipani
- **Competition Domains**: Generative AI and Cybersecurity
- **Prize Pool**: ₹45,000\n
## 2. Website Structure & Features

### 2.1 Navigation Bar
- Fixed position navigation with backdrop blur effect
- Logo with Sparkles icon and gradient text
- Desktop menu items: About, Domains, Prizes, Venue Flow, Judging, Contact
- Register button with primary styling
- Mobile responsive hamburger menu
- Smooth scroll navigation to sections

### 2.2 Hero Section
- Event date badge with Calendar icon
- Large gradient title'HACKAURA' with year '2025'
- Tagline: 'Ignite. Innovate. Impact.'
- Event description highlighting organizer and location
- Two call-to-action buttons: Register Now and Learn More
- Live countdown timer to registration deadline

### 2.3 About Section
- Event introduction and overview
- Description of 24-hour hackathon format
- Four feature highlights:\n  - Flash Mob Kickoff
  - Grand Inauguration
  - 24-Hour Marathon
  - Mentor Support
\n### 2.4 Competition Domains Section
- Two main competition tracks:
  1. **Generative AI**: Focus on AI-powered innovative solutions using generative models and machine learning
  2. **Cybersecurity**: Building robust security solutions against cyber threats\n- Special note: Problem statements revealed exclusively at venue after inauguration
\n### 2.5 Prize Distribution Section
- Total prize pool display: ₹45,000
- Main awards for both domains:\n  - 1st Place: Cash Prize + Certificate
  - 2nd Place: Cash Prize + Certificate
- Design Excellence Awards for both domains:\n  - 1st, 2nd, 3rd Place Certificates
- Participation certificates for all participants

### 2.6 On-Venue Flow Section (Day 1 - November 28, 2025)
Timeline of events:
1. **11:30 AM** - Entry Cut-Off & Verification
   - ID verification mandatory
   - Payment collection at venue
   - Team Identity Card distribution
   - Team leader presence required

2. **12:00 PM** - Flash Mob Performance
   - High-energy student performance
   - Entertainment and excitement
\n3. **12:15 PM** - Grand Inauguration\n   - Welcome speech
   - Guest introduction
   - Event briefing
   - Rule announcement

4. **1:00 PM** - Problem Statement Reveal
   - Domains: Gen AI & Cybersecurity
   - Problem statements revealed on venue
   - Domain confirmation by teams
   - No changes allowed after confirmation

5. **1:30 PM** - Desk Setup & Preparation
   - Desk allocation
   - Wi-Fi access setup
   - Power extension setup
   - Snacks & lunch schedule\n
6. **2:00 PM** - Hackathon Begins!
   - 24-hour coding marathon starts
\n**Staying & Exit Rules**:\n- 24-hour hackathon with overnight stay allowed on campus
- Participants cannot leave campus without permission\n- Only team leader can step out briefly with approval
- No laptops allowed outside after problem reveal

### 2.7 Judging Criteria Section
**Evaluation Parameters**:
1. Innovation & Creativity
2. Problem-Solving Approach
3. Technical Complexity
4. Implementation Quality
5. Functionality & Demo
6. UI/UX Quality
7. Presentation & Clarity
8. Overall Impact

**Competition Rules**:
- Team size: 1–4 members
- Plagiarism strictly prohibited
- Decisions of judges are final
- No domain change after confirmation
- Adhere to all deadlines\n- Respect venue rules and coordinators
- Bring your own laptops, chargers, and tools
- Maintain professional conduct\n
**Frequently Asked Questions**:
1. Who can participate? - Any student passionate about Gen AI or Cybersecurity\n2. Is overnight stay allowed? - Yes, 24 hours with overnight stay on campus
3. When will we get problem statements? - Revealed at venue after inauguration
4. Can we change teams? - No, team changes not allowed after registration
5. Is food provided? - Yes, meals and snacks provided during event
6. Is prior experience needed? - Basic programming knowledge helpful, enthusiasm matters most\n
### 2.8 Contact Section\n**Event Coordinators**:
1. Sandesh Birannavar - 77951246
2. Pankaj Babaleshwar - 8217221908\n3. Mudassir Alladatkhan - 8088989442
4. Rakshita Halluri - 7204033630

**Venue**: VSMIT Campus, Nipani (detailed venue information to be announced)

### 2.9 Registration CTA Section
- Prominent call-to-action card
- Title: 'Ready to Innovate?'
- Description: 'Join us for 24 hours of innovation, collaboration, and impact!'
- Register button linking to registration form

### 2.10 Footer
- HACKAURA 2025 logo\n- Organizer information: Vikram Sarabhai Tech Club\n- Institution: VSM's Somashekhar R Kothiwale Institute of Technology, Nipani
- Copyright notice: Designed & Developed by Vikram Sarabhai Tech Club © 2025
\n## 3. Technical Components

### 3.1 ParticleBackground Component
- Canvas-based particle animation system
- 100particles with cyan, magenta, purple colors
- Particle size: 0.5-2.5px, Opacity: 0.2-0.7
- Movement speed: ±0.25px per frame
- Particle connection lines within 150px radius
- Full screen fixed positioning

### 3.2 CountdownTimer Component
- Target: November 26, 2025, 7:00 PM
- Four display blocks: Days, Hours, Minutes, Seconds
- Responsive layout:2×2 grid on mobile, 1×4 on desktop
- Real-time updates every second
- Two-digit format display
- Hover effects with glow animation

### 3.3 NeonButton Component
- Three variants: Primary, Secondary, Outline
- Supports both link and button functionality
- Optional icon support
- Hover and tap animations
\n### 3.4 GlassCard Component
- Glassmorphism design with backdrop blur
- Four glow color options: cyan, purple, pink, magenta
- Optional3D hover effect
- Scroll-triggered fade-in animation
\n## 4. Design Style

### 4.1 Design Theme
Neon futuristic combined with 3D glassmorphism hybrid aesthetic

### 4.2 Color Palette
- **Background**: Dark gradient from slate-950 → purple-950 → slate-950
- **Primary Colors**:
  - Cyan: #00f5ff
  - Purple: #8b5cf6
  - Pink: #ec4899
  - Magenta: #ff00ff
- **Text**: White with gradient accents (cyan → purple → pink)
- **Accents**: Yellow (#fbbf24) for special highlights

### 4.3 Visual Effects
- Backdrop blur effects on cards and navigation
- Gradient borders with hover glow transitions
- Box shadows with colored glow (30px-60px)
- Particle animation background with connecting lines
- Smooth scroll animations and transitions

### 4.4 Typography
- Large bold headings with gradient text effects
- Monospace font for countdown numbers
- Uppercase text with wide letter spacing for labels
- Responsive font sizes across breakpoints

### 4.5 Layout & Spacing
- Card-based layout with glassmorphism styling
- Responsive grid system: 1/2/4 columns based on screen size
- Generous padding and spacing for premium feel
- Rounded corners (3xl/24px) for modern aesthetic

### 4.6 Interactive Elements
- Scale transformations on hover (1.05x)
- Glow intensity increases on interaction
- Smooth300-600ms transitions
- Pulse and bounce animations for key icons
- Scroll-triggered fade-in animations for content sections

### 4.7 Responsive Design
- **Mobile**: Single column layout, smaller text, stacked buttons, hamburger menu
- **Tablet (≥768px)**: Two-column grids, medium text sizes, desktop navigation
- **Desktop (≥1024px)**: Four-column grids, large text, full spacing

## 5. Animation Specifications

- **Particle System**: Continuous 60fps animation with ±0.25px/frame movement speed
- **Countdown Timer**: Updates every 1 second
- **Button Interactions**: Scale 1.05 on hover, 0.95 on tap
- **Card Animations**: Scroll-triggered opacity 0→1, vertical translation 20px→0,0.6s duration
- **Timeline Items**: Alternating horizontal translation (-50px/+50px → 0)
- **Icon Animations**: Pulse effect for Clock and Sparkles icons, bounce for Trophy icon
- **Hover Effects**: Scale 1.05, translateY -8px, increased glow intensity

## 6. External Links

- **Registration Form**: forms.gle (Google Forms link to be provided)
- All phone numbers are clickable tel: links for direct calling