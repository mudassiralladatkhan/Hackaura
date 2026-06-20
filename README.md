<div align="center">

# ⚡ HACKAURA 2026

### Official Platform for India's National 24-Hour Hackathon

[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Live](https://img.shields.io/badge/🌐_Live-hackaura.vsmsrkitevents.in-ff6e40?style=for-the-badge)](https://hackaura.vsmsrkitevents.in)

<br/>

**The full-stack event platform that powered a 24-hour national hackathon — 83+ teams, 300+ participants, 24 institutions, zero downtime.**

[Live Site](https://hackaura.vsmsrkitevents.in) · [Features](#-features) · [Tech Stack](#-tech-stack)

---

</div>

## 📋 Overview

Hackaura is a production event management platform built in **2 weeks** for HACKAURA 2026, a national-level 24-hour hackathon organized by Vikram Sarabhai Tech Club at VSMSRKIT. It handled the complete event lifecycle — from team registration and payment verification to live scheduling and real-time participant management.

### 📈 Key Metrics

| Metric | Value |
|--------|-------|
| 👥 Concurrent Users | **300+** during live event |
| 🏆 Teams Registered | **83+** from 24 institutions |
| ⏱️ Downtime | **Zero** during 24-hour window |
| 🚀 Build Timeline | **2 weeks** concept to production |

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🏠 **Animated Landing** | Responsive event showcase with countdown timer, sponsors, schedule & Framer Motion animations |
| 📝 **Team Registration** | Multi-member team registration with college verification, domain selection, and real-time validation |
| 💳 **Payment Verification** | QR-based payment with receipt upload and admin-side verification workflow |
| 🎫 **Ticket System** | QR-code ticket generation + on-site scanner for check-in using `html5-qrcode` |
| 👥 **Admin Dashboard** | Real-time registration monitoring, CSV exports, payment status tracking, analytics |
| 🤖 **AI Chatbot** | Event FAQ assistant powered by AI for instant participant queries |
| 📊 **Live Analytics** | Real-time event statistics, registration trends, and domain distribution via Recharts |
| 🔐 **Auth System** | Email OTP authentication with role-based access control (admin/participant) |
| 📱 **Mobile-First** | Fully responsive design optimized for mobile registration flow |
| 🎲 **Gamification** | Interactive elements (dice roll, confetti) for engagement |
| 📷 **QR Scanner** | Tesseract.js + html5-qrcode for on-site ticket verification |

---

## 🛠 Tech Stack

```
Frontend:       React 18 + TypeScript 5.9 + Vite 5
Styling:        Tailwind CSS + Framer Motion + Radix UI (full component library)
Backend:        Supabase (Auth, PostgreSQL, Storage, Realtime, Edge Functions)
State:          React Context + React Router 7
Forms:          React Hook Form + Zod validation
Charts:         Recharts for analytics dashboards
QR:             html5-qrcode (scanner) + qrcode (generator)
OCR:            Tesseract.js for receipt scanning
Deployment:     Netlify (CDN + Edge Functions)
Package Mgr:    pnpm
```

---

## 🏗️ Architecture

```
src/
├── pages/
│   ├── Home.tsx                 # Animated landing page
│   ├── Register.tsx             # Multi-step team registration
│   ├── RegistrationSuccess.tsx  # Confirmation + ticket
│   ├── TicketVerification.tsx   # QR scanner for check-in
│   ├── College.tsx              # College-specific view
│   ├── ProjectSubmission.tsx    # Hackathon project uploads
│   ├── AdminLogin.tsx           # Admin authentication
│   ├── admin/                   # Admin dashboard views
│   └── domains/                 # Hackathon domain pages
├── components/
│   ├── ui/              # Radix-based design system (30+ components)
│   ├── common/          # Shared layout components
│   ├── Chatbot.tsx      # AI FAQ assistant
│   ├── DiceRoll.tsx     # Gamification element
│   ├── ProblemDisplay.tsx # Challenge presentation
│   └── ProtectedRoute.tsx # Auth guard
├── contexts/            # Auth & app state providers
├── hooks/               # Custom React hooks
├── services/            # Supabase client & API calls
├── data/                # Static content & event configuration
├── types/               # TypeScript interfaces
└── lib/                 # Utility functions
```

---

## 🚀 Quick Start

```bash
# Clone
git clone https://github.com/mudassiralladatkhan/Hackaura.git
cd Hackaura

# Install dependencies
pnpm install

# Set up environment
cp .env.example .env
# Add your Supabase URL, Anon Key, and other secrets

# Run development server
pnpm dev
```

### Environment Variables

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

---

## 📦 Key Dependencies

| Package | Purpose |
|---------|---------|
| `@supabase/supabase-js` | Backend-as-a-Service |
| `framer-motion` | Page transitions & animations |
| `react-router-dom` v7 | Client-side routing |
| `react-hook-form` + `zod` | Form validation |
| `recharts` | Analytics charts |
| `html5-qrcode` | QR code scanning |
| `tesseract.js` | OCR for payment receipts |
| `canvas-confetti` | Celebration effects |
| `lucide-react` | Icon system |

---

## 🎯 Event Impact

> *"HACKAURA 2026 brought together 300+ innovators from 24 institutions across India for a 24-hour coding marathon. The platform handled peak traffic flawlessly and streamlined the entire event experience."*

- Featured in IEEE Bangalore Section coverage
- Zero technical issues during the live 24-hour event
- 100% registration accuracy with automated CSV processing
- Post-event documentation delivered within 48 hours

---

## 📸 Pages

| Page | Description |
|------|-------------|
| Landing | Animated hero, countdown, schedule, sponsors, FAQ |
| Registration | Multi-step form with team members, college, domain |
| Admin | Real-time stats, payment verification, CSV export |
| Ticket | QR code generation + on-site scanner |
| Domains | Hackathon track descriptions and problem statements |

---

<div align="center">

**Built with ⚡ by [Mudassir Alladatkhan](https://github.com/mudassiralladatkhan)**

*Organized by Vikram Sarabhai Tech Club, VSMSRKIT · Nipani, Karnataka*

</div>
