"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, Terminal, CheckCircle2, ChevronRight, Trophy } from "lucide-react";
import { useProgress } from "@/hooks/useProgress";
import confetti from "canvas-confetti";

type Step = {
  id: string;
  command: string;
  output: string;
  isFix: boolean;
};

type Scenario = {
  id: string;
  title: string;
  description: string;
  successMessage: string;
  steps: Step[];
};

const SCENARIOS: Scenario[] = [
  {
    id: "s1",
    title: "AKS OOMKilled",
    description: "Alert: Checkout service is flapping and restarting continuously in production.",
    successMessage: "You identified the OOMKilled status and increased memory limits. +50 XP",
    steps: [
      {
        id: "check-nodes",
        command: "kubectl get nodes",
        output: "NAME                 STATUS   ROLES   AGE   VERSION\naks-nodepool1-1234   Ready    agent   12d   v1.28.3\naks-nodepool1-5678   Ready    agent   12d   v1.28.3",
        isFix: false
      },
      {
        id: "check-pods",
        command: "kubectl get pods -n production",
        output: "NAME                             READY   STATUS      RESTARTS      AGE\ncheckout-service-7f89b4c-xyz     0/1     OOMKilled   12 (2m ago)   1h\npayment-service-8b54f9d-abc      1/1     Running     0             1h",
        isFix: false
      },
      {
        id: "describe-pod",
        command: "kubectl describe pod checkout-service-7f89b4c-xyz -n production",
        output: "Name:             checkout-service-7f89b4c-xyz\nNamespace:        production\n...\nState:          Waiting\nReason:         CrashLoopBackOff\nLast State:     Terminated\nReason:         OOMKilled\nExit Code:      137\n...\nLimits:\n  cpu:     500m\n  memory:  256Mi\nRequests:\n  cpu:     250m\n  memory:  128Mi",
        isFix: false
      },
      {
        id: "fix-memory",
        command: "kubectl set resources deployment checkout-service -n production --limits=memory=512Mi",
        output: "deployment.apps/checkout-service resource requirements updated",
        isFix: true
      }
    ]
  },
  {
    id: "s2",
    title: "NSG Port Block",
    description: "Alert: Cannot reach the production VM on port 443 via public IP.",
    successMessage: "You identified the Deny rule and added an Allow rule for 443. +50 XP",
    steps: [
      { 
        id: "c1", 
        command: "nc -vz 203.0.113.5 443", 
        output: "nc: connect to 203.0.113.5 port 443 (tcp) failed: Connection timed out", 
        isFix: false 
      },
      { 
        id: "c2", 
        command: "az network nsg rule list -g prod-rg --nsg-name prod-nsg", 
        output: "[\n  {\n    \"name\": \"DenyAllInbound\",\n    \"access\": \"Deny\",\n    \"destinationPortRange\": \"*\"\n  }\n]", 
        isFix: false 
      },
      { 
        id: "c3", 
        command: "az network nsg rule create -g prod-rg --nsg-name prod-nsg -n Allow443 --priority 100 --destination-port-ranges 443 --access Allow", 
        output: "{\n  \"provisioningState\": \"Succeeded\"\n}", 
        isFix: true 
      }
    ]
  },
  {
    id: "s3",
    title: "ACR Image Pull Error",
    description: "Alert: New deployment of payment-service is stuck in ImagePullBackOff.",
    successMessage: "You identified the unauthorized error and attached the AcrPull role to the AKS managed identity. +50 XP",
    steps: [
      { 
        id: "c1", 
        command: "kubectl get pods -n production", 
        output: "NAME                             READY   STATUS             RESTARTS   AGE\npayment-service-1a2b3c4-def      0/1     ImagePullBackOff   0          5m", 
        isFix: false 
      },
      { 
        id: "c2", 
        command: "kubectl describe pod payment-service-1a2b3c4-def -n production", 
        output: "Failed to pull image \"prodacr.azurecr.io/payment:v2\": rpc error: code = Unknown desc = Error response from daemon: Get https://prodacr.azurecr.io/v2/: unauthorized: authentication required", 
        isFix: false 
      },
      { 
        id: "c3", 
        command: "az role assignment create --assignee <aks-identity> --role AcrPull --scope <acr-id>", 
        output: "Role assignment created successfully.", 
        isFix: true 
      }
    ]
  }
];

export function TroubleshootingSimulator() {
  const [activeScenarioId, setActiveScenarioId] = useState("s1");
  const [history, setHistory] = useState<Step[]>([]);
  const [solved, setSolved] = useState(false);
  const { addXP } = useProgress();

  const activeScenario = SCENARIOS.find(s => s.id === activeScenarioId)!;

  const switchScenario = (id: string) => {
    setActiveScenarioId(id);
    setHistory([]);
    setSolved(false);
  };

  const runCommand = (step: Step) => {
    if (history.find(h => h.id === step.id)) return;
    setHistory(prev => [...prev, step]);
    
    if (step.isFix) {
      setTimeout(() => {
        setSolved(true);
        addXP(50);
        confetti({
          particleCount: 100,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#ef4444', '#10b981'] // Red to green
        });
      }, 1500);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Scenario Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {SCENARIOS.map(s => (
          <Button 
            key={s.id}
            variant={activeScenarioId === s.id ? "default" : "outline"}
            onClick={() => switchScenario(s.id)}
            className={activeScenarioId === s.id ? "bg-red-600 hover:bg-red-700" : "bg-white/5 border-white/10"}
          >
            {s.title}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[60vh]">
        
        {/* Action Panel */}
        <Card className="bg-white/[0.02] border-white/5 flex flex-col overflow-hidden">
          <CardHeader className="bg-red-500/5 border-b border-red-500/10">
            <CardTitle className="text-lg flex items-center gap-2 text-white">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Active Incident: P1 Outage
            </CardTitle>
            <CardDescription>
              {activeScenario.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 p-6 flex flex-col">
            <h3 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider">Available Diagnostics</h3>
            <div className="space-y-3 flex-1">
              {activeScenario.steps.map((step) => {
                const hasRun = history.some(h => h.id === step.id);
                return (
                  <Button 
                    key={step.id}
                    variant="outline"
                    onClick={() => runCommand(step)}
                    disabled={hasRun || solved}
                    className={`w-full justify-start font-mono text-xs border-white/10 ${hasRun ? 'bg-white/5 opacity-50' : 'bg-black/40 hover:bg-white/10'} ${step.isFix && !hasRun ? 'border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-400' : ''}`}
                  >
                    <ChevronRight className="w-3 h-3 mr-2" />
                    {step.command}
                  </Button>
                );
              })}
            </div>

            {solved && (
              <div className="mt-8 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg animate-in fade-in zoom-in duration-500 text-center">
                <Trophy className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                <h4 className="font-bold text-emerald-400">Incident Resolved!</h4>
                <p className="text-sm text-emerald-200/70 mt-1">{activeScenario.successMessage}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Terminal View */}
        <Card className="bg-[#0d1117] border-white/10 flex flex-col overflow-hidden shadow-2xl">
          <div className="flex items-center px-4 py-2 bg-[#161b22] border-b border-white/10">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            <div className="mx-auto px-4 py-1 rounded bg-[#0d1117] text-xs text-gray-400 font-mono flex items-center gap-2">
              <Terminal className="w-3 h-3" />
              prod-aks-bastion
            </div>
          </div>
          <ScrollArea className="flex-1 p-4 font-mono text-sm text-gray-300">
            <div className="space-y-4">
              <p className="text-emerald-400">Welcome to Azure Cloud Shell (SRE Simulator)</p>
              <p className="text-gray-500 text-xs mt-1">Scenario Loaded: {activeScenario.title}</p>
              
              {history.map((step, idx) => (
                <div key={idx} className="space-y-2 animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex gap-2 text-blue-400">
                    <span className="text-pink-500">vikram@azure:~$</span>
                    {step.command}
                  </div>
                  <pre className="whitespace-pre-wrap text-gray-300 opacity-90 pl-2 border-l-2 border-white/10">
                    {step.output}
                  </pre>
                </div>
              ))}

              {solved && (
                <div className="flex gap-2 text-blue-400 mt-4 animate-in fade-in">
                  <span className="text-pink-500">vikram@azure:~$</span>
                  <span className="w-2 h-4 bg-white animate-pulse"></span>
                </div>
              )}
            </div>
          </ScrollArea>
        </Card>

      </div>
    </div>
  );
}
