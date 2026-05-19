import { HealthEvent } from "../types";

export const healthEvents: HealthEvent[] = [
  {
    id: "h1", petId: "luna", type: "lab",
    title: "Blood Panel + Chemistry",
    description: "Annual wellness bloodwork — ALT slightly elevated",
    date: "2026-05-10", vetName: "Dr. Sarah Chen", clinicName: "Bay Area Vet Clinic",
    severity: "medium",
  },
  {
    id: "h2", petId: "luna", type: "vaccination",
    title: "DHPP Booster",
    description: "Annual core vaccine — Distemper, Hepatitis, Parvo, Parainfluenza",
    date: "2026-03-15", vetName: "Dr. Sarah Chen", clinicName: "Bay Area Vet Clinic",
  },
  {
    id: "h3", petId: "luna", type: "checkup",
    title: "Annual Wellness Exam",
    description: "Full physical exam, weight stable at 28.5 kg, teeth healthy",
    date: "2026-03-15", vetName: "Dr. Sarah Chen", clinicName: "Bay Area Vet Clinic",
  },
  {
    id: "h4", petId: "luna", type: "medication",
    title: "Started Heartgard Plus",
    description: "Monthly heartworm prevention",
    date: "2026-01-05",
  },
  {
    id: "h5", petId: "luna", type: "symptom",
    title: "Mild Limp (Resolved)",
    description: "Right hind leg limp after long hike. Resolved within 3 days with rest.",
    date: "2025-11-22", severity: "low", resolved: true,
  },
  {
    id: "h6", petId: "luna", type: "surgery",
    title: "Spay Surgery",
    description: "Ovariohysterectomy. Uncomplicated, healed well.",
    date: "2022-08-15", vetName: "Dr. Michael Roberts", clinicName: "Pacific Surgical Clinic",
  },
  {
    id: "h7", petId: "mochi", type: "vaccination",
    title: "FVRCP + Rabies",
    description: "Core feline vaccines",
    date: "2026-04-22", vetName: "Dr. Sarah Chen", clinicName: "Bay Area Vet Clinic",
  },
  {
    id: "h8", petId: "mochi", type: "lab",
    title: "Feline Wellness Panel",
    description: "All values normal",
    date: "2026-04-22", vetName: "Dr. Sarah Chen", clinicName: "Bay Area Vet Clinic",
  },
  {
    id: "h9", petId: "mochi", type: "checkup",
    title: "Kitten Wellness Visit",
    description: "First exam — weight 2.1 kg, healthy",
    date: "2024-02-10", vetName: "Dr. Sarah Chen", clinicName: "Bay Area Vet Clinic",
  },
];
