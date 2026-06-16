import { projectsData } from "@/data/projects";
import ProjectClient from "./ProjectClient";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return Object.keys(projectsData).map((id) => ({
    id,
  }));
}

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = projectsData[id];
  
  if (!project) {
    notFound();
  }

  return <ProjectClient project={project} />;
}
