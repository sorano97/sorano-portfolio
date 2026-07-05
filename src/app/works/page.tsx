"use client";

import { DetailPageShell } from "@/components/DetailPageShell";
import { useLocale } from "@/components/LocaleProvider";
import { pageMessages } from "@/data/portfolio";
import { WorksPageClient } from "./WorksPageClient";

export default function WorksPage() {
  const { locale } = useLocale();
  const isJa = locale === "ja";

  return (
    <DetailPageShell isJa={isJa} message={isJa ? "作品を一覧で見られます。" : pageMessages.works} title={isJa ? "作品一覧" : "WORKS"}>
      <WorksPageClient />
    </DetailPageShell>
  );
}
