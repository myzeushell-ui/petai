"use client";

import { motion } from "framer-motion";
import { FileText, MapPin, User, Calendar, Pill } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { vetReports } from "@/data/vetReport";
import { formatDate } from "@/lib/utils";

export default function VetReportPage() {
  const report = vetReports[0];

  if (!report) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400">No vet reports found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <FileText className="h-6 w-6 text-blue-500" />
          Vet Report
        </h1>
        <p className="text-sm text-gray-500">Most recent visit — {formatDate(report.visitDate)}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <CardTitle className="text-lg">{report.clinicName}</CardTitle>
                <div className="mt-1.5 flex flex-wrap gap-3 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <User className="h-3.5 w-3.5" />
                    {report.vetName}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(report.visitDate)}
                  </span>
                  {report.clinicAddress && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {report.clinicAddress}
                    </span>
                  )}
                </div>
              </div>
              {report.followUpDate && (
                <div className="rounded-xl bg-orange-50 border border-orange-100 px-3 py-2 text-center flex-shrink-0">
                  <p className="text-xs text-orange-600 font-medium">Follow-up Due</p>
                  <p className="text-sm font-bold text-orange-700">{formatDate(report.followUpDate)}</p>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">
                Chief Complaint
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">{report.chiefComplaint}</p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">
                Diagnoses
              </p>
              <ul className="space-y-1.5">
                {report.diagnosis.map((d, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <span className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-400 mt-2" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">
                Treatment
              </p>
              <ul className="space-y-1.5">
                {report.treatment.map((t, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <span className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-400 mt-2" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            {report.prescriptions.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2 flex items-center gap-1">
                  <Pill className="h-3.5 w-3.5" />
                  Prescriptions
                </p>
                <div className="space-y-2">
                  {report.prescriptions.map((rx, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-purple-100 bg-purple-50 p-3"
                    >
                      <p className="text-sm font-semibold text-purple-900">{rx.medication}</p>
                      <div className="mt-1 flex flex-wrap gap-2">
                        <Badge variant="purple">{rx.dosage}</Badge>
                        <Badge variant="purple">{rx.frequency}</Badge>
                        <Badge variant="purple">{rx.duration}</Badge>
                      </div>
                      {rx.notes && (
                        <p className="mt-1.5 text-xs text-purple-700">{rx.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">
                Vet Notes
              </p>
              <p className="text-sm leading-relaxed text-gray-700">{report.notes}</p>
            </div>

            {report.aiSummary && (
              <div className="rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
                <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-indigo-700">
                  <span>🤖</span> AI Summary
                </p>
                <p className="text-sm leading-relaxed text-gray-700">{report.aiSummary}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
