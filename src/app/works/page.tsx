import { DetailPageShell } from "@/components/DetailPageShell";
import { pageMessages } from "@/data/portfolio";
import { WorksPageClient } from "./WorksPageClient";

export default function WorksPage() {
  return (
    <DetailPageShell message={pageMessages.works} title="WORKS">
      <WorksPageClient />
    </DetailPageShell>
  );
}
