# PetAI — Project Context

## What is PetAI?

**PetAI is an AI Health Operating System for Pets.**

Pet owners are overwhelmed: scattered vet records, confusing lab results, forgotten vaccines, no way to track medications or understand what their vet said. PetAI solves this by bringing everything into one intelligent platform — like a health app for humans, but built for pets.

---

## The Problem

- Pet health records are scattered across clinics, apps, and paper forms
- Lab results are written in medical jargon most owners can't understand
- 67% of pet owners miss at least one vaccination or medication dose per year
- Vets spend 20% of visits re-explaining history the owner forgot
- There is no single platform that acts as a pet's health brain

---

## The Solution

PetAI is a unified health platform that:

1. **Centralizes** all health records in one timeline
2. **Translates** lab results into plain English via AI
3. **Predicts** issues before they become serious using health scoring
4. **Reminds** owners of medications, vaccines, and checkups automatically
5. **Generates** shareable vet-ready reports

---

## MVP Features (This Prototype)

### 🏠 Dashboard
- Pet profile card with health score
- Upcoming reminders (high priority)
- AI insights preview

### 🤖 AI Health Assistant
- Conversational interface
- Responds based on pet's actual health data
- Covers: lab results, vaccines, medications, breed-specific risks

### 🔬 Lab Results
- Upload bloodwork (UI only in demo)
- Panel-by-panel breakdown with status indicators
- AI-generated plain-English analysis

### 📅 Health Timeline
- Full medical history: vaccines, checkups, surgeries, symptoms
- Filterable by type and severity
- Vet name and clinic attribution

### 🔔 Reminders
- Medications, vaccines, checkups, grooming
- Priority levels (high/medium/low)
- Recurring reminders support

### 📋 Vet Report
- Complete visit summary
- Diagnosis, treatment, prescriptions
- AI-generated summary

---

## Demo Pet Profile

**Luna** — 4-year-old Golden Retriever (female, spayed)
- Weight: 28.5 kg
- Health Score: 87/100 (Excellent)
- Key watchpoint: Mild ALT elevation (follow-up Feb 2026)
- Dental cleaning recommended within 6 months
- All vaccines current

---

## Target User

**Primary:** Pet owners aged 25-45 with dogs or cats, who already track their own health on apps like Apple Health, MyFitnessPal, or Whoop — and want the same experience for their pets.

**Secondary:** Veterinary clinics wanting to offer digital health records and reminders as a value-add service.

---

## Business Model (Future)

- **Freemium:** 1 pet free, additional pets = paid
- **Pro Plan:** $9.99/month — unlimited pets, AI assistant, lab uploads
- **Vet Clinic B2B:** White-label dashboard for clinics

---

## Tech Philosophy

- **Demo-first:** Build to impress investors before building the real backend
- **Data-driven UI:** Every component renders from typed data → easy to swap for real API
- **AI-ready:** Mock AI today, real AI (GPT-4/Claude) tomorrow — same interface
- **Supabase-ready:** Types match future DB schema

---

## Investor Pitch Angle

> "Whoop for pets. Every pet owner wants to know their dog is healthy — but they have no idea. PetAI gives them the data, the AI, and the peace of mind — starting with a $9.99/month subscription."

Target: a16z Speedrun · Seed stage · $500K raise
