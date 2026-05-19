import { VetReport } from "../types";

export const vetReports: VetReport[] = [
  {
    id: "vr1",
    petId: "luna",
    visitDate: "2026-05-10",
    vetName: "Dr. Sarah Chen, DVM",
    clinicName: "Bay Area Vet Clinic",
    clinicAddress: "1234 Market St, San Francisco, CA 94102",
    chiefComplaint: "Annual wellness exam and bloodwork",
    diagnosis: ["Mildly elevated ALT (128 U/L) — likely hepatic stress, possibly from recent fatty treats", "Mild plaque buildup on molars"],
    treatment: ["Continue current diet but reduce high-fat treats", "Recheck ALT in 4-6 weeks", "Schedule dental cleaning within 2 months"],
    prescriptions: [
      { medication: "SAMe (S-Adenosyl-L-methionine)", dosage: "225 mg", frequency: "Once daily", duration: "30 days", notes: "Liver support supplement" },
    ],
    followUpDate: "2026-06-20",
    notes: "Luna is in great overall health. Weight is stable. The elevated ALT is mild and likely temporary — we discussed reducing rich treats and recheck in 4-6 weeks. Dental cleaning recommended within 2 months due to mild tartar buildup typical for breed at her age.",
    aiSummary: "Luna's annual exam went well. Main concerns: slightly elevated liver enzyme (ALT) that should normalize with diet adjustment, and recommended dental cleaning. Both are minor and easily addressed.",
  },
  {
    id: "vr2",
    petId: "mochi",
    visitDate: "2026-04-22",
    vetName: "Dr. Sarah Chen, DVM",
    clinicName: "Bay Area Vet Clinic",
    clinicAddress: "1234 Market St, San Francisco, CA 94102",
    chiefComplaint: "Annual wellness and vaccinations",
    diagnosis: ["Healthy young adult cat", "No abnormalities found"],
    treatment: ["Continue current diet and routine"],
    prescriptions: [],
    notes: "Mochi is in excellent health. All vaccines updated. Continue with quality indoor cat food and play enrichment.",
    aiSummary: "Mochi is thriving — perfect health, all vaccines up to date, no medical concerns.",
  },
];
