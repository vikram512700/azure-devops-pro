import { ModuleClient } from "@/components/ModuleClient";

export async function generateStaticParams() {
  // Pre-generate routes for modules 1 through 30
  return Array.from({ length: 30 }, (_, i) => ({
    id: (i + 1).toString(),
  }));
}

import { use } from "react";

export default function ModulePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <ModuleClient moduleId={id} />;
}
