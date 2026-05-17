"use client";

import { motion } from "framer-motion";
import { FlaskConical, Upload } from "lucide-react";
import { LabResults } from "@/components/health/LabResults";
import { Button } from "@/components/ui/button";
import { labResults } from "@/data/labResults";

export default function LabsPage() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FlaskConical className="h-6 w-6 text-cyan-500" />
            Lab Results
          </h1>
          <p className="text-sm text-gray-500">AI-analyzed bloodwork and diagnostic results</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Upload className="h-4 w-4" />
          Upload Report
        </Button>
      </motion.div>

      <LabResults results={labResults} />
    </div>
  );
}
