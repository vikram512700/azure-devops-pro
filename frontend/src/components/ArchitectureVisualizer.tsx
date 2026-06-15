"use client";

import { useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  Edge
} from 'reactflow';
import 'reactflow/dist/style.css';

// Topic-specific production flows, keyed by the module's subtitle (category).
const CATEGORY_FLOWS: Record<string, string[]> = {
  "Azure Fundamentals": ["🏢 Management Group", "📦 Subscription (billing/quota)", "🗂️ Resource Group", "🔧 Tagged Resources"],
  "Azure Networking": ["🌐 Internet", "🛡️ App Gateway (WAF)", "🔥 Azure Firewall — Hub VNet", "🔗 VNet Peering", "☸️ Spoke VNet / Workloads"],
  "Azure Compute": ["🌐 Load Balancer", "⚖️ VMSS (autoscale)", "💻 VM Instances", "💾 Premium SSD Disks"],
  "Containers": ["👩‍💻 Dockerfile (multi-stage)", "🔨 docker build", "🔍 Trivy scan (gate)", "📦 ACR — private registry"],
  "Kubernetes / AKS": ["🌐 Ingress (NGINX/AGIC)", "🔀 Service (ClusterIP)", "📦 Deployment / ReplicaSet", "☸️ Pods across AZs", "🧠 Managed Control Plane"],
  "CI/CD & Automation": ["📥 Git Push / PR", "🔨 Build + Test", "🔍 Security Scan", "🚦 Staging (auto)", "✅ Manual Approval", "🚀 Production"],
  "Infrastructure as Code": ["📝 HCL / Bicep Code", "🔍 plan / what-if", "🔒 Remote State (locked)", "☁️ Azure Resources"],
  "Security & Identity": ["👤 User / Workload", "🔐 Entra ID (authn)", "🎫 RBAC Role + Scope", "🔑 Key Vault (secrets)", "🔧 Target Resource"],
  "Observability & SRE": ["📊 Metrics + 📜 Logs", "🔭 Azure Monitor", "📈 Log Analytics (KQL)", "🚨 Alert Rule", "📟 Action Group → On-call"],
};

const FALLBACK = CATEGORY_FLOWS["Azure Networking"];

const PALETTE = ["#0369a1", "#0284c7", "#0ea5e9", "#6366f1", "#8b5cf6", "#a855f7"];

export function ArchitectureVisualizer({ subtitle }: { subtitle?: string }) {
  const { nodes, edges } = useMemo(() => {
    const flow = (subtitle && CATEGORY_FLOWS[subtitle]) || FALLBACK;
    const nodes: Node[] = flow.map((label, i) => ({
      id: `n${i}`,
      type: i === 0 ? 'input' : i === flow.length - 1 ? 'output' : 'default',
      data: { label },
      position: { x: 220, y: i * 110 },
      style: {
        background: i === 0 ? '#1e293b' : PALETTE[Math.min(i - 1, PALETTE.length - 1)],
        color: '#f0f9ff',
        border: '1px solid #334155',
        borderRadius: '10px',
        padding: '12px 16px',
        width: 260,
        fontSize: '13px',
        fontWeight: 500,
      },
    }));
    const edges: Edge[] = flow.slice(1).map((_, i) => ({
      id: `e${i}`,
      source: `n${i}`,
      target: `n${i + 1}`,
      animated: true,
      style: { stroke: '#64748b', strokeWidth: 2 },
    }));
    return { nodes, edges };
  }, [subtitle]);

  return (
    <div className="w-full h-[600px] border border-white/10 rounded-xl overflow-hidden bg-black/40">
      <ReactFlow nodes={nodes} edges={edges} fitView className="dark">
        <Background color="#334155" gap={16} />
        <Controls className="bg-white/5 border-white/10 fill-white" />
        <MiniMap maskColor="rgba(0,0,0,0.7)" className="bg-black/50 border-white/10" />
      </ReactFlow>
    </div>
  );
}
