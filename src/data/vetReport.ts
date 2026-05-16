import type { VetReport } from "@/types";

export const vetReports: VetReport[] = [
  {
    id: "vr-001",
    petId: "pet-001",
    visitDate: "2025-11-20",
    vetName: "Dr. Sarah Mitchell, DVM",
    clinicName: "Greenfield Animal Hospital",
    clinicAddress: "1247 Oak Street, Portland, OR 97201",
    chiefComplaint: "Annual wellness examination and vaccine boosters",
    diagnosis: [
      "Healthy adult dog — no acute conditions",
      "Mild hepatic enzyme elevation (ALT 89 U/L) — monitor",
      "Early stage dental tartar (Grade 1) — professional cleaning recommended",
    ],
    treatment: [
      "DHPP booster vaccine administered (Lot #GH-2025-0119)",
      "Physical examination completed — all systems within normal limits",
      "Weight recorded: 28.5 kg (stable from last visit)",
      "Parasite prevention counseling provided",
    ],
    prescriptions: [
      {
        medication: "Heartgard Plus (Ivermectin/Pyrantel)",
        dosage: "51-100 lbs chewable tablet",
        frequency: "Once monthly",
        duration: "Ongoing year-round",
        notes: "Give with food. Mark calendar for 1st of each month.",
      },
    ],
    followUpDate: "2026-02-20",
    notes:
      "Luna is a well-socialized, healthy Golden Retriever in overall good condition. Owner reports occasional limping after long walks — resolved with rest in September. Joint supplement (Omega-3) already started, which is appropriate. Recommend adding glucosamine/chondroitin for long-term joint support. Mildly elevated ALT is likely related to Omega-3 supplementation or dietary factors. Recheck bloodwork in 3 months. Dental cleaning should be scheduled within 6 months to prevent periodontal progression. Owner is engaged and proactive — excellent care.",
    aiSummary:
      "Luna had a strong annual checkup overall. The main watchpoints are her mild ALT elevation (follow-up bloodwork in February is booked) and the early dental tartar. Both are manageable with timely action. Her vaccines are current, weight is stable, and her owner is doing a great job with preventive care. The next 6 months should focus on dental health and monitoring liver enzymes.",
  },
];
