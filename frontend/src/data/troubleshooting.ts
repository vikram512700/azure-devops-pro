// Topic-specific SRE troubleshooting scenarios, keyed by module subtitle (category).
// Each scenario is a guided incident: run diagnostics, then the fix step resolves it.

export type TStep = {
  id: string;
  command: string;
  output: string;
  isFix: boolean;
};

export type TScenario = {
  id: string;
  title: string;
  description: string;
  successMessage: string;
  steps: TStep[];
};

const AKS_SCENARIOS: TScenario[] = [
  {
    id: "oom",
    title: "AKS OOMKilled",
    description: "Alert: Checkout service is flapping and restarting continuously in production.",
    successMessage: "You identified the OOMKilled status and increased memory limits. +50 XP",
    steps: [
      { id: "pods", command: "kubectl get pods -n production", output: "NAME                          READY   STATUS      RESTARTS      AGE\ncheckout-7f89b4c-xyz          0/1     OOMKilled   12 (2m ago)   1h", isFix: false },
      { id: "describe", command: "kubectl describe pod checkout-7f89b4c-xyz -n production", output: "Last State:  Terminated\nReason:      OOMKilled\nExit Code:   137\nLimits:\n  memory:  256Mi", isFix: false },
      { id: "fix", command: "kubectl set resources deployment checkout -n production --limits=memory=512Mi", output: "deployment.apps/checkout resource requirements updated", isFix: true },
    ],
  },
  {
    id: "crashloop",
    title: "CrashLoopBackOff",
    description: "Alert: New pods never become Ready; readiness probe failing.",
    successMessage: "You found the bad readiness path and corrected the probe. +50 XP",
    steps: [
      { id: "pods", command: "kubectl get pods -n production", output: "NAME              READY   STATUS             RESTARTS   AGE\napi-6d9f-abc      0/1     CrashLoopBackOff   5          3m", isFix: false },
      { id: "logs", command: "kubectl logs api-6d9f-abc -n production --previous", output: "Liveness probe failed: HTTP GET http://:8080/health returned 404", isFix: false },
      { id: "fix", command: "kubectl patch deployment api -n production --type=json -p='[{\"op\":\"replace\",\"path\":\"/spec/template/spec/containers/0/readinessProbe/httpGet/path\",\"value\":\"/healthz\"}]'", output: "deployment.apps/api patched", isFix: true },
    ],
  },
];

const NETWORK_SCENARIOS: TScenario[] = [
  {
    id: "nsg",
    title: "NSG Port Block",
    description: "Alert: Cannot reach the production VM on port 443 via public IP.",
    successMessage: "You identified the Deny rule and added an Allow rule for 443. +50 XP",
    steps: [
      { id: "test", command: "nc -vz 203.0.113.5 443", output: "nc: connect to 203.0.113.5 port 443 (tcp) failed: Connection timed out", isFix: false },
      { id: "list", command: "az network nsg rule list -g prod-rg --nsg-name prod-nsg -o table", output: "Name             Priority  Access  Port\nDenyAllInbound   4096      Deny    *", isFix: false },
      { id: "fix", command: "az network nsg rule create -g prod-rg --nsg-name prod-nsg -n Allow443 --priority 100 --destination-port-ranges 443 --access Allow", output: "{ \"provisioningState\": \"Succeeded\" }", isFix: true },
    ],
  },
  {
    id: "udr",
    title: "Egress Blackhole (UDR)",
    description: "Alert: Spoke pods can't reach the internet despite NSG allowing outbound.",
    successMessage: "You found the 0.0.0.0/0 UDR sending traffic to a firewall with no allow rule, and added it. +50 XP",
    steps: [
      { id: "routes", command: "az network nic show-effective-route-table -g prod-rg -n spoke-nic -o table", output: "Source  Address Prefix  Next Hop Type      Next Hop IP\nUser    0.0.0.0/0       VirtualAppliance   10.0.1.4", isFix: false },
      { id: "fwlog", command: "az monitor log-analytics query -w [WID] --analytics-query \"AzureDiagnostics | where Category=='AzureFirewallApplicationRule' | take 1\"", output: "Action: Deny  msg: No rule matched. Proceeding with default action", isFix: false },
      { id: "fix", command: "az network firewall application-rule create -g prod-rg -f prod-fw --collection-name egress --name allow-azure --protocols Https=443 --target-fqdns '*.azure.com' --source-addresses '10.1.0.0/16' --priority 200 --action Allow", output: "Application rule created. Egress restored.", isFix: true },
    ],
  },
];

const CONTAINER_SCENARIOS: TScenario[] = [
  {
    id: "acr",
    title: "ACR ImagePullBackOff",
    description: "Alert: New deployment of payment-service is stuck in ImagePullBackOff.",
    successMessage: "You attached the AcrPull role to the AKS managed identity. +50 XP",
    steps: [
      { id: "pods", command: "kubectl get pods -n production", output: "NAME                     READY   STATUS             AGE\npayment-1a2b-def         0/1     ImagePullBackOff   5m", isFix: false },
      { id: "describe", command: "kubectl describe pod payment-1a2b-def -n production", output: "Failed to pull image \"prodacr.azurecr.io/payment:v2\": unauthorized: authentication required", isFix: false },
      { id: "fix", command: "az aks update -g prod-rg -n prod-aks --attach-acr prodacr", output: "AcrPull granted to kubelet identity. Image pull succeeds.", isFix: true },
    ],
  },
];

const CICD_SCENARIOS: TScenario[] = [
  {
    id: "gate",
    title: "Pipeline Blocked by Scan Gate",
    description: "Alert: Production deploy pipeline is failing at the security stage.",
    successMessage: "You found a fixable CRITICAL CVE, bumped the base image, and the gate passed. +50 XP",
    steps: [
      { id: "log", command: "az pipelines runs show --id 4821 --query 'result'", output: "\"failed\"  Stage: SecurityScan  Task: Trivy", isFix: false },
      { id: "scan", command: "trivy image --severity CRITICAL --ignore-unfixed prodacr.azurecr.io/api:abc123", output: "openssl  CVE-2024-XXXX  CRITICAL  fixed in 3.0.14 (base: node:20.1)", isFix: false },
      { id: "fix", command: "sed -i 's/node:20.1/node:20-alpine/' Dockerfile && git commit -am 'fix: bump base image' && git push", output: "Rebuilt image clean — Trivy gate passes, pipeline green.", isFix: true },
    ],
  },
];

const IAC_SCENARIOS: TScenario[] = [
  {
    id: "lock",
    title: "Terraform State Locked",
    description: "Alert: terraform apply fails — state is locked by a crashed pipeline run.",
    successMessage: "You confirmed no apply was running and force-unlocked the stale lock. +50 XP",
    steps: [
      { id: "apply", command: "terraform apply -var-file=prod.tfvars", output: "Error: Error acquiring the state lock\nLock Info: ID: 7f3c... created by pipeline@agent-12 (2h ago)", isFix: false },
      { id: "check", command: "az pipelines runs list --status inProgress -o table", output: "(no in-progress runs) — the holding run crashed 2h ago", isFix: false },
      { id: "fix", command: "terraform force-unlock 7f3c-stale-lock-id && terraform plan", output: "Lock released. Plan succeeds — state intact.", isFix: true },
    ],
  },
];

const SECURITY_SCENARIOS: TScenario[] = [
  {
    id: "kv",
    title: "Key Vault Access Denied",
    description: "Alert: Pod can't read its DB secret — 403 Forbidden from Key Vault.",
    successMessage: "You granted the workload identity the Key Vault Secrets User role. +50 XP",
    steps: [
      { id: "logs", command: "kubectl logs db-client-xyz -n production", output: "AccessDenied: Caller is not authorized to perform 'secrets/get' on key vault 'prodkv'", isFix: false },
      { id: "roles", command: "az role assignment list --scope [KV_ID] --assignee [MI_ID] -o table", output: "(empty) — the managed identity has no role on the vault", isFix: false },
      { id: "fix", command: "az role assignment create --assignee [MI_ID] --role 'Key Vault Secrets User' --scope [KV_ID]", output: "Role assigned. Secret read succeeds.", isFix: true },
    ],
  },
];

const SRE_SCENARIOS: TScenario[] = [
  {
    id: "alert",
    title: "Alert Never Fired",
    description: "Postmortem: checkout was down 20 min but no one was paged.",
    successMessage: "You found the alert had no Action Group attached and wired in on-call. +50 XP",
    steps: [
      { id: "show", command: "az monitor metrics alert show -g prod-rg -n checkout-5xx --query 'actions'", output: "[]  — the alert rule has NO action group attached", isFix: false },
      { id: "ag", command: "az monitor action-group list -g prod-rg -o table", output: "Name     ShortName\noncall   oncall   (exists, just not linked)", isFix: false },
      { id: "fix", command: "az monitor metrics alert update -g prod-rg -n checkout-5xx --add-action oncall", output: "Action group linked. Future breaches now page on-call.", isFix: true },
    ],
  },
];

const COMPUTE_SCENARIOS: TScenario[] = [
  {
    id: "iops",
    title: "VM Disk IOPS Throttling",
    description: "Alert: Database VM latency spiking; app timeouts during peak.",
    successMessage: "You spotted the disk pinned at 100% IOPS and upgraded the disk tier. +50 XP",
    steps: [
      { id: "metric", command: "az monitor metrics list --resource [VM_ID] --metric 'OS Disk IOPS Consumed Percentage' --query 'value[0].timeseries[0].data[-1]'", output: "{ \"average\": 99.8 }  — disk pinned at max IOPS", isFix: false },
      { id: "disk", command: "az disk show -g prod-rg -n db-osdisk --query '{sku:sku.name,size:diskSizeGb}'", output: "{ \"sku\": \"StandardSSD_LRS\", \"size\": 128 }", isFix: false },
      { id: "fix", command: "az vm deallocate -g prod-rg -n db-vm && az disk update -g prod-rg -n db-osdisk --sku Premium_LRS && az vm start -g prod-rg -n db-vm", output: "Disk upgraded to Premium SSD — IOPS headroom restored.", isFix: true },
    ],
  },
];

const FUNDAMENTALS_SCENARIOS: TScenario[] = [
  {
    id: "quota",
    title: "vCPU Quota Exceeded",
    description: "Alert: AKS scale-out failing — new nodes won't provision.",
    successMessage: "You identified the regional vCPU quota cap and requested an increase. +50 XP",
    steps: [
      { id: "events", command: "kubectl get events -A | grep -i quota", output: "Warning  FailedCreate  ...exceeding approved standardDSv3Family Cores quota (current limit 50)", isFix: false },
      { id: "usage", command: "az vm list-usage -l centralindia --query \"[?contains(name.value,'DSv3')].{Used:currentValue,Limit:limit}\" -o table", output: "Used  Limit\n50    50", isFix: false },
      { id: "fix", command: "az quota update --resource-name standardDSv3Family --scope [LOCATION_SCOPE] --limit-object value=100", output: "Quota increased to 100. Node pool scales out successfully.", isFix: true },
    ],
  },
];

const DEFAULT_SCENARIOS = [...AKS_SCENARIOS, NETWORK_SCENARIOS[0], CONTAINER_SCENARIOS[0]];

export function scenariosForSubtitle(subtitle?: string): TScenario[] {
  switch (subtitle) {
    case "Azure Fundamentals": return FUNDAMENTALS_SCENARIOS;
    case "Azure Networking": return NETWORK_SCENARIOS;
    case "Azure Compute": return COMPUTE_SCENARIOS;
    case "Containers": return CONTAINER_SCENARIOS;
    case "Kubernetes / AKS": return AKS_SCENARIOS;
    case "CI/CD & Automation": return CICD_SCENARIOS;
    case "Infrastructure as Code": return IAC_SCENARIOS;
    case "Security & Identity": return SECURITY_SCENARIOS;
    case "Observability & SRE": return SRE_SCENARIOS;
    default: return DEFAULT_SCENARIOS;
  }
}
