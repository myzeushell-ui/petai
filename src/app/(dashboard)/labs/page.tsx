"use client";

import { motion } from "framer-motion";
import { FlaskConical, Upload } from "lucide-react";
import { LabResults } from "@/components/health/LabResults";
import { Button } from "@/components/ui/button";
import { labResults } from "@/data/labResults";
import { useLocale } from "@/contexts/LocaleContext";
import { t } from "@/lib/i18n";

const UI = {
  title:    { en: "Lab Results",                                  ru: "Анализы" },
  subtitle: { en: "AI-analyzed bloodwork and diagnostic results", ru: "AI-анализ крови и диагностических результатов" },
  upload:   { en: "Upload Report",                                ru: "Загрузить" },
};

export default function LabsPage() {
  const { locale } = useLocale();
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
            {t(UI.title, locale)}
          </h1>
          <p className="text-sm text-gray-500">{t(UI.subtitle, locale)}</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Upload className="h-4 w-4" />
          {t(UI.upload, locale)}
        </Button>
      </motion.div>

      <LabResults results={labResults} />
    </div>
  );
}
