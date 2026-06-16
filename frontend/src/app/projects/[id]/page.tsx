import { projectsData } from "@/data/projects";
import ProjectClient from "./ProjectClient";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return Object.keys(projectsData).map((id) => ({
    id,
  }));
}

export default function ProjectPage({ params }: { params: { id: string } }) {
  const project = projectsData[params.id];
  
  if (!project) {
    notFound();
  }

  return <ProjectClient project={project} />;
}
