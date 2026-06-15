import { ModuleClient } from "@/components/ModuleClient";

export async function generateStaticParams() {
  // Pre-generate routes for modules 1 through 30
  return Array.from({ length: 30 }, (_, i) => ({
    id: (i + 1).toString(),
  }));
}

export default function ModulePage({ params }: { params: { id: string } }) {
  return <ModuleClient moduleId={params.id} />;
}
