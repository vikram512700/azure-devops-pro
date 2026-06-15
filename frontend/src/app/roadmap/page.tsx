"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, PlayCircle } from "lucide-react";
import Link from "next/link";
import { useProgress } from "@/hooks/useProgress";

const TRACKS = [
  { id: 1, title: "Azure Regions & Resource Groups", modules: 1, status: "locked", desc: "Geography, latency, HA design, and tagging strategy." },
  { id: 2, title: "Subscriptions, CLI & Portal", modules: 1, status: "locked", desc: "Management Groups, billing scope, and az commands." },
  { id: 3, title: "VNETs, Subnets & Peering", modules: 1, status: "locked", desc: "Address space, logical partitions, and VNet Peering." },
  { id: 4, title: "NSGs, Route Tables & Firewalls", modules: 1, status: "locked", desc: "Traffic filtering, UDRs, and Azure Firewall DNAT." },
  { id: 5, title: "Virtual Machines & VMSS", modules: 1, status: "locked", desc: "SKU selection, disks, and autoscaling rules." },
  { id: 6, title: "App Service & Azure Functions", modules: 1, status: "locked", desc: "PaaS web hosting and serverless event triggers." },
  { id: 7, title: "Docker Fundamentals & Images", modules: 1, status: "locked", desc: "Dockerfile, layers, cache, and container runtimes." },
  { id: 8, title: "Multi-Stage Builds & Security", modules: 1, status: "locked", desc: "Build vs runtime separation and Trivy scanning." },
  { id: 9, title: "ACR (Azure Container Registry)", modules: 1, status: "locked", desc: "Private Docker registry, push/pull, geo-replication." },
  { id: 10, title: "AKS Architecture & Control Plane", modules: 1, status: "locked", desc: "Managed Kubernetes, Node pools, and Azure CNI." },
  { id: 11, title: "Pods, Deployments & Services", modules: 1, status: "locked", desc: "Replicas, rolling updates, ClusterIP, and LoadBalancers." },
  { id: 12, title: "Ingress Controllers & Routing", modules: 1, status: "locked", desc: "NGINX ingress, TLS termination, and path routing." },
  { id: 13, title: "HPA & Network Policies", modules: 1, status: "locked", desc: "CPU/memory autoscaling and pod-to-pod traffic control." },
  { id: 14, title: "Git Fundamentals & Gitflow", modules: 1, status: "locked", desc: "Branching, merging, rebasing, and PR policies." },
  { id: 15, title: "GitHub Actions", modules: 1, status: "locked", desc: "Workflows, secrets, and matrix builds." },
  { id: 16, title: "Azure Repos & Azure Pipelines", modules: 1, status: "locked", desc: "YAML pipelines, stages, and Service Connections." },
  { id: 17, title: "Release Management & Gates", modules: 1, status: "locked", desc: "Environments, approval gates, and rollback strategies." },
  { id: 18, title: "Terraform Basics & State", modules: 1, status: "locked", desc: "Providers, resources, variables, and remote state in Blob." },
  { id: 19, title: "Terraform Modules & Workspaces", modules: 1, status: "locked", desc: "Reusable components, versioning, and environment separation." },
  { id: 20, title: "Bicep & ARM Templates", modules: 1, status: "locked", desc: "Declarative Infrastructure Automation using Microsoft's DSL." },
  { id: 21, title: "Entra ID & RBAC", modules: 1, status: "locked", desc: "Managed identities, custom roles, and PIM." },
  { id: 22, title: "Key Vault & CSI Driver", modules: 1, status: "locked", desc: "Secrets injection without env vars." },
  { id: 23, title: "Azure Storage (Blobs, Files, Tiers)", modules: 1, status: "locked", desc: "Object storage, hot/cool/archive tiers, and SAS tokens." },
  { id: 24, title: "Azure Monitor & Alerts", modules: 1, status: "locked", desc: "Metrics, dynamic thresholds, and action groups." },
  { id: 25, title: "Log Analytics & KQL", modules: 1, status: "locked", desc: "Centralized logging and Kusto Query Language." },
  { id: 26, title: "Helm & Package Management", modules: 1, status: "locked", desc: "Templating Kubernetes manifests and OCI artifacts." },
  { id: 27, title: "ArgoCD & GitOps", modules: 1, status: "locked", desc: "Git as a single source of truth for infra and app state." },
  { id: 28, title: "Cost Management (FinOps) & Policy", modules: 1, status: "locked", desc: "Reserved instances, Azure Advisor, and DeployIfNotExists." },
  { id: 29, title: "Chaos Engineering (Azure Chaos Studio)", modules: 1, status: "locked", desc: "Controlled fault injection and blast radius management." },
  { id: 30, title: "Production Architecture Game Day", modules: 1, status: "locked", desc: "Simulating complete zonal outages and HA failovers." },
];

export default function Roadmap() {
  const { progress, isLoaded } = useProgress();

  return (
    <div className="min-h-screen p-8 pt-24 bg-background relative">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        
        <div className="mb-12">
          <Badge variant="outline" className="mb-4 bg-blue-500/10 text-blue-400 border-blue-500/20 px-3 py-1 text-sm">
            Curriculum
          </Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">The Journey to Senior</h1>
          <p className="text-xl text-muted-foreground">
            A 30-track enterprise roadmap designed to transition AWS engineers to Azure DevOps experts.
          </p>
        </div>

        <div className="relative border-l-2 border-white/10 ml-4 md:ml-0 md:pl-0 space-y-12">
          {TRACKS.map((track, index) => {
            const isCompleted = isLoaded && progress.completedModules.includes(track.id.toString());
            const isLocked = isLoaded && index > 0 && !progress.completedModules.includes(TRACKS[index - 1].id.toString());
            const status = isLocked ? 'locked' : (isCompleted ? 'completed' : 'in-progress');

            return (
              <div key={track.id} className="relative pl-8 md:pl-0">
              
              {/* Timeline dot */}
              <div className="absolute left-[-9px] md:left-[-1px] top-6 w-4 h-4 rounded-full bg-background border-2 border-blue-500 z-10 hidden md:block" />

              <Card className={`bg-white/[0.02] border-white/[0.05] md:ml-8 transition-all hover:bg-white/[0.04] ${status === 'locked' ? 'opacity-60 grayscale-[0.5]' : 'shadow-[0_0_20px_rgba(37,99,235,0.05)]'}`}>
                <CardHeader className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="secondary" className="bg-white/10 text-white border-none">Track {track.id}</Badge>
                      {status === 'completed' && <Badge className="bg-emerald-500/20 text-emerald-400 border-none hover:bg-emerald-500/30">Completed</Badge>}
                      {status === 'in-progress' && <Badge className="bg-blue-500/20 text-blue-400 border-none hover:bg-blue-500/30 animate-pulse">In Progress</Badge>}
                    </div>
                    <CardTitle className="text-2xl text-white">{track.title}</CardTitle>
                    <CardDescription className="text-base mt-2">{track.desc}</CardDescription>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {status === 'locked' ? (
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/5 text-muted-foreground border border-white/10 text-sm">
                        <Lock className="w-4 h-4" /> Locked
                      </div>
                    ) : (
                      <Link href={`/module/${track.id}`}>
                        <button className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] hover:-translate-y-0.5">
                          <PlayCircle className="w-5 h-5" /> 
                          {status === 'completed' ? 'Review Track' : 'Continue'}
                        </button>
                      </Link>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-6 pt-4 border-t border-white/5">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Modules:</span> <span className="text-white font-medium">{track.modules}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Sections per Module:</span> <span className="text-white font-medium">6</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        })}
        </div>

      </div>
    </div>
  );
}
