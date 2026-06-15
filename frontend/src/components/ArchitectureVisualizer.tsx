"use client";

import ReactFlow, {
  Background, 
  Controls, 
  MiniMap,
  Node,
  Edge
} from 'reactflow';
import 'reactflow/dist/style.css';

const initialNodes: Node[] = [
  {
    id: 'internet',
    type: 'input',
    data: { label: '🌐 Internet' },
    position: { x: 250, y: 0 },
    style: { background: '#1e293b', color: '#f8fafc', border: '1px solid #334155', borderRadius: '8px', padding: '10px' }
  },
  {
    id: 'app-gw',
    data: { label: '🛡️ Application Gateway (WAF)' },
    position: { x: 250, y: 100 },
    style: { background: '#0369a1', color: '#f0f9ff', border: 'none', borderRadius: '8px', padding: '10px' }
  },
  {
    id: 'hub-vnet',
    data: { label: 'Hub VNET (10.0.0.0/16)' },
    position: { x: 250, y: 200 },
    style: { background: '#0f172a', color: '#cbd5e1', border: '2px dashed #334155', width: 200, height: 100 }
  },
  {
    id: 'firewall',
    data: { label: '🔥 Azure Firewall' },
    position: { x: 280, y: 240 },
    style: { background: '#b91c1c', color: '#fef2f2', border: 'none', borderRadius: '4px' },
    parentNode: 'hub-vnet',
    extent: 'parent',
  },
  {
    id: 'spoke-vnet',
    data: { label: 'Spoke VNET (10.1.0.0/16)' },
    position: { x: 250, y: 380 },
    style: { background: '#0f172a', color: '#cbd5e1', border: '2px dashed #0284c7', width: 300, height: 150 }
  },
  {
    id: 'aks',
    data: { label: '☸️ AKS Cluster (Private)' },
    position: { x: 300, y: 430 },
    style: { background: '#0284c7', color: '#f0f9ff', border: 'none', borderRadius: '4px', width: 180 },
    parentNode: 'spoke-vnet',
    extent: 'parent',
  },
  {
    id: 'peering',
    data: { label: 'VNET Peering' },
    position: { x: 480, y: 310 },
    style: { background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '10px' }
  }
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: 'internet', target: 'app-gw', animated: true, style: { stroke: '#94a3b8' } },
  { id: 'e2-3', source: 'app-gw', target: 'firewall', animated: true, style: { stroke: '#94a3b8' } },
  { id: 'e3-4', source: 'firewall', target: 'aks', animated: true, style: { stroke: '#0284c7', strokeWidth: 2 } },
];

export function ArchitectureVisualizer() {
  return (
    <div className="w-full h-[600px] border border-white/10 rounded-xl overflow-hidden bg-black/40">
      <ReactFlow 
        nodes={initialNodes} 
        edges={initialEdges}
        fitView
        className="dark"
      >
        <Background color="#334155" gap={16} />
        <Controls className="bg-white/5 border-white/10 fill-white" />
        <MiniMap 
          nodeColor={(n) => {
            if (n.id === 'firewall') return '#b91c1c';
            if (n.id === 'aks') return '#0284c7';
            return '#1e293b';
          }}
          maskColor="rgba(0,0,0, 0.7)"
          className="bg-black/50 border-white/10"
        />
      </ReactFlow>
    </div>
  );
}
