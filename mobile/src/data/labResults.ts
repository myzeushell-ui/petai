import { LabResult } from "../types";

export const labResults: LabResult[] = [
  {
    id: "lab1",
    petId: "luna",
    testName: "Complete Blood Count + Chemistry Panel",
    testDate: "2026-05-10",
    labName: "Antech Diagnostics",
    status: "borderline",
    uploadedAt: "2026-05-11",
    aiAnalysis: "Luna's bloodwork is mostly normal. ALT is slightly elevated at 128 U/L (reference: 10-100). This can indicate mild liver stress. Recommend rechecking in 4-6 weeks. All other values are within normal range.",
    panels: [
      { name: "ALT (Liver)", value: 128, unit: "U/L", referenceMin: 10, referenceMax: 100, status: "high" },
      { name: "AST", value: 38, unit: "U/L", referenceMin: 10, referenceMax: 50, status: "normal" },
      { name: "Creatinine", value: 1.1, unit: "mg/dL", referenceMin: 0.5, referenceMax: 1.5, status: "normal" },
      { name: "BUN", value: 18, unit: "mg/dL", referenceMin: 7, referenceMax: 27, status: "normal" },
      { name: "Glucose", value: 92, unit: "mg/dL", referenceMin: 60, referenceMax: 120, status: "normal" },
      { name: "WBC", value: 7.8, unit: "K/µL", referenceMin: 4.0, referenceMax: 15.5, status: "normal" },
      { name: "RBC", value: 6.5, unit: "M/µL", referenceMin: 5.5, referenceMax: 8.5, status: "normal" },
      { name: "Hematocrit", value: 48, unit: "%", referenceMin: 37, referenceMax: 55, status: "normal" },
      { name: "Platelets", value: 285, unit: "K/µL", referenceMin: 200, referenceMax: 500, status: "normal" },
    ],
  },
  {
    id: "lab2",
    petId: "mochi",
    testName: "Feline Wellness Panel",
    testDate: "2026-04-22",
    labName: "IDEXX Laboratories",
    status: "normal",
    uploadedAt: "2026-04-23",
    aiAnalysis: "Mochi's bloodwork is excellent. All values within normal feline reference ranges. Kidney values look great for a 2-year-old cat. No concerns.",
    panels: [
      { name: "Creatinine", value: 1.3, unit: "mg/dL", referenceMin: 0.8, referenceMax: 2.4, status: "normal" },
      { name: "BUN", value: 22, unit: "mg/dL", referenceMin: 14, referenceMax: 36, status: "normal" },
      { name: "ALT", value: 45, unit: "U/L", referenceMin: 12, referenceMax: 130, status: "normal" },
      { name: "Glucose", value: 95, unit: "mg/dL", referenceMin: 70, referenceMax: 150, status: "normal" },
      { name: "Total Thyroxine", value: 2.4, unit: "µg/dL", referenceMin: 0.8, referenceMax: 4.0, status: "normal" },
    ],
  },
];
