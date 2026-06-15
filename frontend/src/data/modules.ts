export interface ModuleContent {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  theory: {
    title: string;
    description: string;
    whatIsIt: string;
    keyConcepts: { label: string; desc: string }[];
  };
  realWorld: {
    title: string;
    description: string;
    intro: string;
    points: string[];
    shortcut: string;
  };
  interview: {
    q: string;
    a: string;
  }[];
}

export const modulesData: Record<string, ModuleContent> = {
  "1": {
    id: "1",
    title: "Azure Regions & Resource Groups",
    subtitle: "Azure Fundamentals",
    description: "Geography, latency, HA design, and tagging strategy.",
    theory: {
      title: "Azure Regions & Resource Groups Theory",
      description: "How Azure organizes physical datacenters into regions, availability zones, and logical containers called resource groups.",
      whatIsIt: "An Azure Region is a set of datacenters with low-latency networking, deployed within a defined geography (e.g., Central India - Pune). A Resource Group (RG) is a logical container that holds related resources for an Azure solution, sharing the same lifecycle, permissions, and policies.",
      keyConcepts: [
        { label: "Region & Availability Zones", desc: "A region (e.g., Central India) contains 3 physically separate Availability Zones (AZs), each with independent power/cooling/networking. Deploying across AZs gives 99.99% SLA for VMs." },
        { label: "Resource Groups", desc: "RGs are deployment + lifecycle boundaries, not network boundaries. Resources in different RGs can still talk to each other over VNet peering. Delete an RG and everything inside is deleted." },
        { label: "Tagging Strategy", desc: "Tags (key:value pairs like CostCenter:JIO-DIGITAL, Environment:Prod, Owner:vikram) are critical for cost allocation, automation (Azure Policy enforces mandatory tags), and filtering in Cost Management views." }
      ]
    },
    realWorld: {
      title: "Jio Platforms - Region & RG Strategy",
      description: "How a Reliance/Jio GCC organizes Azure landing zones across regions and resource groups",
      intro: "Jio Platforms runs workloads primarily out of Central India (Pune) and South India (Chennai) for data residency compliance (RBI/MeitY guidelines require certain financial data to stay in India), with East US used for global engineering tooling. Resource Groups are structured per application-per-environment, e.g., rg-jiopay-prod-centralindia, rg-jiopay-staging-centralindia, following a strict naming convention enforced by Azure Policy.",
      points: [
        "Data Residency: Jio Financial Services workloads pinned to Central India region to comply with RBI data localization mandates.",
        "Naming Convention: rg-<app>-<env>-<region> enforced via Azure Policy 'deny' effect on non-compliant resource names.",
        "Tagging for FinOps: Every RG tagged with CostCenter, BusinessUnit (JioMart/JioFiber/JioFinance), and Owner — feeds into a monthly chargeback report to 12+ business units.",
        "Zone-Redundant Design: Production AKS node pools and PostgreSQL Flexible Servers spread across all 3 AZs in Central India for the 99.99% SLA."
      ],
      shortcut: "AWS Region == Azure Region | AWS 'no direct equivalent, closest is tagging+folders' == Azure Resource Group | AWS Availability Zone == Azure Availability Zone"
    },
    interview: [
      {
        q: "What is the difference between an Azure Region and an Availability Zone?",
        a: "A Region is a geographic area containing one or more datacenters (e.g., Central India). An Availability Zone is a physically separate datacenter within that region with independent power, cooling, and networking — typically 3 AZs per supported region. Deploying VMs/AKS node pools across AZs gives you a 99.99% SLA versus 99.9% for single-instance VMs."
      },
      {
        q: "Can two resources in different Resource Groups communicate with each other?",
        a: "Yes. Resource Groups are purely management/lifecycle boundaries for billing, RBAC, and deletion — they have no effect on networking. Two VMs in different RGs (even different subscriptions) can communicate freely as long as the underlying VNets are peered or connected, and NSG rules allow it."
      },
      {
        q: "Why would you choose Central India over East US for a financial services workload at Jio?",
        a: "Data residency/regulatory compliance. RBI guidelines require certain payment and financial transaction data for Indian customers to be stored and processed within India. Central India (Pune) and South India (Chennai) are the closest Azure regions, also reducing latency for end users versus a US region."
      },
      {
        q: "How would you enforce a mandatory tagging policy across hundreds of resource groups?",
        a: "Use Azure Policy with a 'Require a tag on resources' definition (built-in or custom) assigned at the Management Group level, with a Deny or Append effect. Append automatically adds a default tag value if missing; Deny blocks resource creation entirely until the tag is supplied — common for CostCenter and Environment tags used in FinOps chargeback."
      },
      {
        q: "What happens if you delete a Resource Group? Can it be undone?",
        a: "All resources inside the RG are permanently deleted — there is no native 'undo'. For production RGs, Azure supports Resource Locks (CanNotDelete or ReadOnly) to prevent accidental deletion. Recovery depends entirely on whether you have backups (Azure Backup vaults, Terraform state + re-apply, or geo-redundant storage snapshots) — the RG deletion itself is irreversible."
      },
      {
        q: "Design a multi-region resource group naming convention for a company with 5 business units and 3 environments.",
        a: "A pattern like rg-<businessunit>-<app>-<env>-<region-shortcode> e.g., rg-jiomart-checkout-prod-cin (Central India). This is enforced via an Azure Policy naming convention check (regex match on resource name), combined with mandatory tags (BusinessUnit, Environment, CostCenter) so that Cost Management can slice spend by any dimension without relying on naming alone."
      }
    ]
  },
  "2": {
    id: "2",
    title: "Subscriptions, CLI & Portal",
    subtitle: "Azure Fundamentals",
    description: "Management Groups, billing scope, and az commands.",
    theory: {
      title: "Subscriptions, CLI & Portal Theory",
      description: "The billing and access-control hierarchy of Azure, and the three primary tools used to interact with it: Portal, CLI, and PowerShell.",
      whatIsIt: "An Azure Subscription is a billing boundary and a hard isolation boundary for quotas (e.g., max vCPUs, max VNets). Management Groups sit above subscriptions to apply governance (Policy, RBAC) across many subscriptions at once. The Azure CLI (az) is the cross-platform command-line tool for scripting and automation.",
      keyConcepts: [
        { label: "Management Group Hierarchy", desc: "Tenant Root Group -> Management Groups (e.g., 'Production', 'Non-Production') -> Subscriptions -> Resource Groups -> Resources. Policies and RBAC assigned at a higher level inherit down to everything below." },
        { label: "az CLI Fundamentals", desc: "az login authenticates; az account set --subscription <id> switches context; az configure --defaults group=<rg> sets persistent defaults so you don't repeat --resource-group on every command." },
        { label: "Service Principals & Scopes", desc: "Automation (pipelines, Terraform) authenticates via Service Principals (az ad sp create-for-rbac) scoped to a specific subscription or resource group, never given Owner at tenant root." }
      ]
    },
    realWorld: {
      title: "Jio Platforms - Subscription Governance",
      description: "How Jio structures subscriptions and CLI access for hundreds of engineers",
      intro: "Jio Platforms operates separate subscriptions per environment tier under an Enterprise Agreement: 'Jio-Production', 'Jio-Staging', 'Jio-Sandbox-DevTest'. Management Groups apply a baseline security policy (e.g., 'deny public IP creation on storage accounts') across all subscriptions, while individual subscriptions have quota limits tuned to their workload (Production gets higher vCPU quota for AKS burst scaling).",
      points: [
        "Subscription per Environment: Separates blast radius — a quota exhaustion or runaway cost in Sandbox cannot impact Production capacity.",
        "Management Group Policy Inheritance: A single 'Require HTTPS for storage accounts' policy applied at the Management Group level governs 40+ subscriptions instantly.",
        "CLI in CI/CD: Azure Pipelines agents authenticate via az login --service-principal using credentials stored in Azure Key Vault, never hardcoded.",
        "Cost Controls: Each subscription has a budget alert at 80%/100%/120% of forecast, routed to a Teams channel monitored by the Cloud Engineering team."
      ],
      shortcut: "AWS Account == Azure Subscription | AWS Organizations OU == Azure Management Group | AWS CLI (aws) == Azure CLI (az)"
    },
    interview: [
      {
        q: "What is the difference between a Management Group and a Subscription?",
        a: "A Subscription is a billing and quota boundary — it's where resources actually live and get billed. A Management Group is a governance container ABOVE subscriptions used purely to apply Azure Policy and RBAC at scale across multiple subscriptions; it has no resources or billing of its own."
      },
      {
        q: "How do you switch between multiple Azure subscriptions in the CLI?",
        a: "Use `az account list` to see all subscriptions you have access to, then `az account set --subscription <subscription-id-or-name>` to switch the active context. You can verify with `az account show`."
      },
      {
        q: "Why does Jio use separate subscriptions for Production and Sandbox instead of separate Resource Groups?",
        a: "Subscriptions are hard isolation boundaries for quotas (vCPU cores, VNets, public IPs) and billing. If a developer in Sandbox runs a runaway load test that exhausts the regional vCPU quota, it cannot affect Production's ability to scale — whereas Resource Groups share the same subscription-level quota pool."
      },
      {
        q: "How would a CI/CD pipeline authenticate to Azure without a human logging in interactively?",
        a: "Create a Service Principal (`az ad sp create-for-rbac --role Contributor --scopes /subscriptions/<id>/resourceGroups/<rg>`), store its client ID/secret (or use Workload Identity Federation/OIDC for no-secret auth) in Azure Key Vault or the pipeline's secret store, then the pipeline runs `az login --service-principal -u <appId> -p <secret> --tenant <tenantId>`."
      },
      {
        q: "What's the risk of granting Owner role at the Tenant Root Management Group?",
        a: "Owner at the root grants control over EVERY subscription, every resource, and the ability to modify RBAC/Policy for the entire tenant — including the ability to escalate further. It violates least-privilege; instead, scope roles to specific Management Groups (e.g., Contributor on 'Non-Production' MG) or individual subscriptions based on actual job function."
      },
      {
        q: "You need to set a default resource group and location for all your az CLI commands in a session. How?",
        a: "`az configure --defaults group=rg-jiopay-prod-cin location=centralindia`. This persists in ~/.azure/config so subsequent commands like `az vm list` or `az network vnet create` don't need --resource-group/--location flags repeated — useful for reducing errors during long CLI sessions."
      }
    ]
  },
  "3": {
    id: "3",
    title: "VNETs, Subnets & Peering",
    subtitle: "Azure Networking",
    description: "Address space, logical partitions, and VNet Peering.",
    theory: {
      title: "VNETs, Subnets & Peering Theory",
      description: "The foundational networking primitive in Azure: how to carve up IP address space and connect isolated networks.",
      whatIsIt: "A Virtual Network (VNet) is an isolated, private network in Azure with a defined CIDR address space (e.g., 10.0.0.0/16). Subnets partition that space into smaller segments for different resource types (AKS nodes, databases, app gateways). VNet Peering connects two VNets so traffic flows via Microsoft's backbone, not the public internet.",
      keyConcepts: [
        { label: "CIDR Planning", desc: "A /16 VNet (10.0.0.0/16) gives 65,536 IPs, typically subdivided into /24 subnets (256 IPs each) for AKS nodes, /27 for Application Gateway, /26 for private endpoints. Azure reserves 5 IPs per subnet (first 4 + last)." },
        { label: "VNet Peering", desc: "Non-transitive by default — if VNet A peers with B, and B peers with C, A cannot reach C unless A also peers with C directly (or via a hub). Peering is low-latency and doesn't traverse the public internet." },
        { label: "Hub-Spoke Topology", desc: "A central 'Hub' VNet contains shared services (Firewall, VPN Gateway, DNS), peered to multiple 'Spoke' VNets (one per application/environment). Spokes route traffic through the hub via User Defined Routes (UDRs) for centralized inspection." }
      ]
    },
    realWorld: {
      title: "Jio Platforms - Hub-Spoke Network Design",
      description: "How Jio's landing zone implements VNets and peering across business units",
      intro: "Jio's Azure landing zone uses a Hub-Spoke model: a central 'hub-network-cin' VNet (10.0.0.0/16) hosts Azure Firewall, VPN Gateway to on-prem Jio datacenters, and shared DNS. Each business unit (JioMart, JioCinema, JioFinance) gets its own spoke VNet (10.1.0.0/16, 10.2.0.0/16, etc.) peered to the hub, with all internet-bound and on-prem traffic forced through the hub firewall via UDRs.",
      points: [
        "Non-Overlapping CIDRs: Central IP Address Management (IPAM) spreadsheet/tool ensures no two spokes use overlapping ranges, since future cross-spoke peering may be needed.",
        "Forced Tunneling: Spoke route tables have a 0.0.0.0/0 UDR pointing to the Azure Firewall's private IP in the hub, ensuring all egress traffic is inspected and logged.",
        "On-Prem Connectivity: ExpressRoute/VPN Gateway lives in the hub, giving every spoke connectivity back to Jio's Mumbai/Navi Mumbai datacenters without each spoke needing its own gateway.",
        "Subnet Delegation: AKS subnets use Azure CNI with a /22 to support pod-per-IP networking at scale (thousands of pods), while smaller /27 subnets serve Application Gateways."
      ],
      shortcut: "AWS VPC == Azure VNet | AWS Subnet == Azure Subnet | AWS VPC Peering == Azure VNet Peering | AWS Transit Gateway == Azure Hub VNet + Firewall (or Virtual WAN)"
    },
    interview: [
      {
        q: "Is VNet Peering transitive? Explain with an example.",
        a: "No. If Spoke-A peers with Hub, and Spoke-B peers with Hub, Spoke-A CANNOT reach Spoke-B through the Hub automatically — peering relationships are point-to-point only. To allow A-to-B traffic via the hub, you need the Hub to run a Network Virtual Appliance (Azure Firewall) and configure User Defined Routes in both spokes pointing cross-spoke traffic at the firewall's IP, which then forwards it."
      },
      {
        q: "How many usable IP addresses are in a /24 subnet in Azure, and why?",
        a: "251, not 254. A /24 has 256 total addresses, but Azure reserves 5: the network address (.0), default gateway (.1), two for Azure DNS mapping (.2, .3), and the broadcast address (.255). This matters when sizing AKS subnets for node + pod IP allocation with Azure CNI."
      },
      {
        q: "Design the CIDR layout for a hub-spoke topology supporting 4 spokes, each needing room for an AKS cluster.",
        a: "Hub: 10.0.0.0/16 (shared services — firewall, gateway, DNS). Spokes: 10.1.0.0/16 through 10.4.0.0/16, each subdivided into an AKS subnet (10.x.0.0/22 for pod-scale CNI), a data subnet for private endpoints (10.x.4.0/24), and an App Gateway subnet (10.x.5.0/27). Keep all ranges non-overlapping so any future spoke-to-spoke peering is possible without re-IP'ing."
      },
      {
        q: "What is a User Defined Route (UDR) and how does it enable hub-spoke forced tunneling?",
        a: "A UDR is a custom routing rule in a Route Table attached to a subnet that overrides Azure's default system routes. For forced tunneling, you create a UDR with address prefix 0.0.0.0/0 and next hop type 'Virtual Appliance' pointing to the Azure Firewall's private IP in the hub — this forces ALL outbound traffic from the spoke subnet through the firewall for inspection, instead of going directly to the internet."
      },
      {
        q: "Your AKS cluster's spoke VNet needs to reach an on-prem SQL Server in Jio's Mumbai datacenter. How does traffic flow in a hub-spoke model?",
        a: "AKS pod -> spoke subnet -> UDR routes traffic to Azure Firewall in hub (or directly via peering if no inspection needed) -> hub VNet -> ExpressRoute/VPN Gateway in hub -> Jio's on-prem network via the ExpressRoute circuit -> on-prem SQL Server. The spoke doesn't need its own gateway; it relies on the hub's connectivity via peering."
      },
      {
        q: "What happens if you try to peer two VNets with overlapping address spaces?",
        a: "Azure rejects the peering creation with an error — overlapping CIDR ranges make routing ambiguous (Azure wouldn't know which VNet's 10.0.0.5 a packet is destined for). This is why centralized IPAM planning before VNet creation is critical, especially in large organizations adding new spokes frequently."
      }
    ]
  },
  "4": {
    id: "4",
    title: "NSGs, Route Tables & Firewalls",
    subtitle: "Azure Networking",
    description: "Traffic filtering, UDRs, and Azure Firewall DNAT.",
    theory: {
      title: "NSGs, Route Tables & Firewalls Theory",
      description: "Layered traffic control in Azure: stateful packet filtering at the subnet/NIC level, custom routing, and centralized stateful firewalling.",
      whatIsIt: "A Network Security Group (NSG) is a stateful, layer 3/4 allow/deny rule set attached to a subnet or NIC. Route Tables (with UDRs) control where traffic goes next. Azure Firewall is a fully managed, stateful firewall-as-a-service supporting FQDN filtering, threat intelligence, and DNAT for inbound traffic.",
      keyConcepts: [
        { label: "NSG Rule Evaluation", desc: "Rules are evaluated by priority (lower number = higher priority, 100-4096). Default rules (priority 65000+) allow VNet-to-VNet and Load Balancer traffic and deny all else from internet. First matching rule wins — order matters." },
        { label: "Azure Firewall DNAT", desc: "DNAT (Destination NAT) rules on Azure Firewall translate a public IP:port to a private IP:port, allowing controlled inbound access (e.g., SSH/RDP to a jump box) without exposing the VM's public IP directly." },
        { label: "Route Table Precedence", desc: "Azure's effective routes = System Routes (automatic, lowest precedence) + UDRs (User Defined, higher precedence) + BGP routes from VPN/ExpressRoute (highest precedence). `az network nic show-effective-route-table` shows the final computed routes." }
      ]
    },
    realWorld: {
      title: "Jio Platforms - Defense in Depth Network Security",
      description: "Layered NSG, UDR, and Firewall controls protecting JioMart's production tier",
      intro: "JioMart's production AKS subnet has an NSG denying all inbound except from the Application Gateway subnet on 443. A UDR forces all outbound traffic to Azure Firewall, which has FQDN rules allowing only specific outbound destinations (Azure AD, ACR, approved third-party payment gateway APIs) and blocks everything else — preventing data exfiltration even if a pod is compromised.",
      points: [
        "Subnet NSG: 'AllowAppGwInbound' rule (priority 100) permits 443 from the App Gateway subnet only; 'DenyAllInbound' (priority 4096) blocks everything else.",
        "FQDN Filtering: Azure Firewall Application Rules allow outbound only to *.azurecr.io, login.microsoftonline.com, and the payment gateway's domain — all other egress denied, mitigating data exfil from a compromised pod.",
        "DNAT for Bastion Access: A single Azure Firewall public IP DNATs port 2222 -> jumpbox private IP:22, so engineers SSH through the firewall instead of exposing the jumpbox's own public IP.",
        "Threat Intelligence Mode: Azure Firewall's threat intel feed set to 'Alert and Deny' — automatically blocks traffic to/from IPs on Microsoft's threat feed, logged to Log Analytics for SOC review."
      ],
      shortcut: "AWS Security Group == Azure NSG | AWS Route Table == Azure Route Table (UDR) | AWS Network Firewall == Azure Firewall"
    },
    interview: [
      {
        q: "How does NSG rule priority work, and what happens with conflicting rules?",
        a: "NSG rules have a priority number from 100-4096; Azure evaluates rules in ascending order and stops at the FIRST match — that rule's action (Allow/Deny) applies, and no further rules are checked. So a 'DenyAll' at priority 100 would block a 'AllowHTTPS' at priority 200, even if the latter is more specific. Always order from most-specific/highest-priority (lowest number) to least-specific."
      },
      {
        q: "What is the difference between an NSG and Azure Firewall?",
        a: "NSG is a free, stateful L3/L4 (IP, port, protocol) filter applied at subnet/NIC level — fast but limited to IP/port rules. Azure Firewall is a managed, centralized service supporting L3-L7 features: FQDN-based filtering (e.g., allow only *.azurecr.io), threat intelligence, DNAT, and centralized logging across an entire hub-spoke network. NSGs are typically used for micro-segmentation within a VNet; Firewall for centralized egress/ingress control."
      },
      {
        q: "Explain how Azure Firewall DNAT enables secure SSH access to a VM with no public IP.",
        a: "Create a DNAT rule on Azure Firewall: translate {FirewallPublicIP}:2222 -> {VM private IP}:22. The VM itself has only a private IP, never exposed directly. Combined with an Application Rule or Network Rule restricting the source IP range (e.g., only office VPN CIDR) for that DNAT, this gives controlled, auditable SSH access without a public IP attack surface on the VM."
      },
      {
        q: "A pod in AKS can't reach the internet despite the NSG allowing outbound. What's the likely cause?",
        a: "Check the subnet's Route Table — a UDR with 0.0.0.0/0 pointing to Azure Firewall (forced tunneling) may be redirecting traffic there, and the Firewall's Application/Network rules may not have an allow rule for that destination FQDN/IP. Use `az network firewall log` or Log Analytics 'AzureDiagnostics' table filtered on AzureFirewallApplicationRule to see if traffic is being denied at the firewall, not the NSG."
      },
      {
        q: "What are Azure's default NSG rules and why do they matter?",
        a: "Every NSG has default rules at priority 65000-65500: AllowVNetInBound/OutBound (all resources in the VNet can talk to each other), AllowAzureLoadBalancerInBound (health probes work), and DenyAllInBound/OutBound (catch-all). These can't be deleted but CAN be overridden by higher-priority custom rules. They matter because a 'deny all' you write at priority 200 still lets VNet-internal traffic through unless you add an explicit deny below 65000 for VNet traffic too."
      },
      {
        q: "How would you implement FQDN-based egress filtering to allow pods to pull images only from your ACR and Microsoft endpoints?",
        a: "Use Azure Firewall (Premium SKU for TLS inspection if needed) Application Rules with FQDN tags/wildcards: allow *.azurecr.io, *.blob.core.windows.net (for layer storage), login.microsoftonline.com, mcr.microsoft.com. Set the spoke subnet's route table to forward 0.0.0.0/0 to the firewall. Combine with Azure Policy to prevent AKS from using public IPs directly, ensuring all egress is firewall-inspected."
      }
    ]
  },
  "5": {
    id: "5",
    title: "Virtual Machines & VMSS",
    subtitle: "Azure Compute",
    description: "SKU selection, disks, and autoscaling rules.",
    theory: {
      title: "Virtual Machines & VMSS Theory",
      description: "IaaS compute building blocks: single VMs for stateful/legacy workloads, and Virtual Machine Scale Sets (VMSS) for elastic, identical fleets.",
      whatIsIt: "A Virtual Machine is an on-demand compute instance with a chosen SKU (size), OS disk, and optional data disks. A Virtual Machine Scale Set (VMSS) manages a group of identical, auto-scaling VMs behind a load balancer — the underlying engine for AKS node pools.",
      keyConcepts: [
        { label: "VM SKU Families", desc: "B-series (burstable, cheap, dev/test), D-series (general purpose, e.g., Standard_D2s_v3 — common AKS node SKU), E-series (memory-optimized, for databases/caches), F-series (compute-optimized). SKU choice affects vCPU:RAM ratio, premium disk support, and accelerated networking." },
        { label: "Managed Disks & Tiers", desc: "Standard HDD (cheap, dev/test), Standard SSD (balanced), Premium SSD (production, low latency, required for most database workloads), Ultra Disk (highest IOPS, databases needing sub-ms latency)." },
        { label: "VMSS Autoscaling Rules", desc: "Scale-out/in rules based on metrics (CPU > 70% for 5 min -> add 1 instance) with cooldown periods to prevent flapping. VMSS supports both Uniform (identical instances) and Flexible orchestration modes — Flexible is required for mixing VM SKUs and is what AKS node pools use under the hood." }
      ]
    },
    realWorld: {
      title: "Jio Platforms - Compute Sizing for Mixed Workloads",
      description: "How Jio chooses VM SKUs and scaling rules for different tiers",
      intro: "Jio's AKS node pools run on Standard_D4s_v5 (4 vCPU/16GB) for general application workloads and Standard_E8s_v5 (8 vCPU/64GB) for the Redis-backed session cache tier during JioMart's Big Billion Days sale events. Legacy batch-processing VMs for nightly settlement reports use Standard_F-series (compute-optimized) VMSS that scales from 0 to 20 instances overnight and back to 0 by morning, controlled by a custom autoscale metric tied to queue depth.",
      points: [
        "AKS Node Pool SKU: Standard_D4s_v5 chosen for balanced vCPU:memory ratio (1:4) suiting typical Node.js/Java microservices; Premium SSD OS disks for fast pod scheduling.",
        "Burst Scaling for Sale Events: VMSS autoscale rule — if average CPU > 75% for 5 minutes, add 20% more instances (max 50), with a 10-minute cooldown to avoid flapping during traffic spikes.",
        "Spot VMs for Batch Jobs: Non-critical nightly ETL/reporting jobs run on Spot VMSS instances (up to 90% cost savings), with eviction handled gracefully by re-queuing the job.",
        "Scale-to-Zero Overnight: The settlement-batch VMSS scales to 0 instances by 6 AM via a scheduled autoscale profile, saving cost since the workload only runs 11 PM - 5 AM."
      ],
      shortcut: "AWS EC2 Instance == Azure Virtual Machine | AWS Auto Scaling Group == Azure VMSS | AWS EBS == Azure Managed Disk | AWS Spot Instance == Azure Spot VM"
    },
    interview: [
      {
        q: "What's the difference between Standard SSD and Premium SSD managed disks, and when would you use each?",
        a: "Standard SSD offers consistent but lower IOPS/throughput (good for web servers, dev/test, low-IOPS apps) at lower cost. Premium SSD provides much higher IOPS and lower latency (sub-ms), required for production databases and any VM SKU ending in 's' (e.g., D4s_v5) supports it. Choose Premium SSD for any disk hosting a database or latency-sensitive workload; Standard SSD for general app tiers where cost matters more than peak IOPS."
      },
      {
        q: "Explain the difference between VMSS Uniform and Flexible orchestration modes.",
        a: "Uniform mode requires all instances to be identical (same SKU, same image) and is older/simpler. Flexible mode allows mixing VM sizes and Spot + on-demand instances within the same scale set, supports availability zones per-instance, and is the orchestration mode AKS uses for its node pools — giving AKS the flexibility to add different node sizes to the same nodepool if needed (though typically a nodepool is one SKU)."
      },
      {
        q: "How would you configure autoscaling to handle a predictable traffic spike (e.g., midnight flash sale) without flapping?",
        a: "Use a scheduled autoscale profile that proactively scales out BEFORE the spike (e.g., scale to 30 instances at 11:45 PM ahead of a midnight sale) rather than relying purely on reactive CPU-based rules which lag behind sudden spikes. Combine with a reactive rule (CPU > 70% for 5 min, scale +20%) as a safety net, and set a cooldown period of 10+ minutes between scale actions to prevent rapid scale-out/scale-in oscillation ('flapping')."
      },
      {
        q: "What is a Spot VM and what's the trade-off?",
        a: "A Spot VM uses Azure's spare/unused capacity at up to 90% discount versus pay-as-you-go, but Azure can evict it with as little as 30 seconds notice when capacity is needed for on-demand customers. Best for fault-tolerant, interruptible workloads — batch processing, CI/CD build agents, dev/test — never for stateful production services without robust checkpoint/resume logic."
      },
      {
        q: "Why might an AKS node pool use Standard_D-series rather than B-series (burstable) VMs?",
        a: "B-series VMs accrue 'CPU credits' and throttle performance once credits are exhausted under sustained load — unpredictable for production container workloads that need consistent CPU. D-series provides consistent, non-throttled performance, which is essential for AKS nodes running multiple pods with steady resource demands. B-series is fine for dev/test clusters with light, intermittent usage."
      },
      {
        q: "A VM is stuck and you suspect a disk IOPS bottleneck. How would you diagnose and fix it?",
        a: "Check Azure Monitor metrics 'OS Disk IOPS Consumed Percentage' and 'OS Disk Queue Depth' — if consistently near 100%, the disk's provisioned IOPS (determined by disk size/tier) is the bottleneck. Fixes: resize to a larger Premium SSD (more size = more baseline IOPS), switch to Premium SSD v2 or Ultra Disk (IOPS provisioned independently of size), or move high-IOPS workloads (databases) to a dedicated data disk separate from the OS disk."
      }
    ]
  },
  "6": {
    id: "6",
    title: "App Service & Azure Functions",
    subtitle: "Azure Compute",
    description: "PaaS web hosting and serverless event triggers.",
    theory: {
      title: "App Service & Azure Functions Theory",
      description: "Platform-as-a-Service hosting models that abstract away VM/OS management for web apps and event-driven code.",
      whatIsIt: "Azure App Service is a managed platform for hosting web apps, REST APIs, and mobile backends without managing VMs/OS — you deploy code or containers to an App Service Plan. Azure Functions is a serverless compute service that runs small pieces of code ('functions') in response to triggers (HTTP, Timer, Queue, Blob) and scales automatically, often billed per-execution (Consumption plan).",
      keyConcepts: [
        { label: "App Service Plans & Scaling", desc: "An App Service Plan defines the underlying compute (SKU: B1/S1/P1v3) shared by one or more apps. Scale Up = bigger SKU (more CPU/RAM); Scale Out = more instances (requires Standard tier or above for autoscale)." },
        { label: "Azure Functions Triggers & Bindings", desc: "Triggers determine what invokes a function (HTTP request, Timer/CRON, new message on Service Bus/Storage Queue, new Blob). Bindings declaratively connect input/output to other services (e.g., write output directly to Cosmos DB) without writing SDK boilerplate." },
        { label: "Consumption vs Premium vs Dedicated Plans", desc: "Consumption: pay-per-execution, scales to zero, but has 'cold start' latency. Premium: pre-warmed instances (no cold start), VNet integration. Dedicated (App Service Plan): runs functions alongside web apps on always-on VMs, predictable cost for high-volume workloads." }
      ]
    },
    realWorld: {
      title: "Jio Platforms - Event-Driven Order Processing",
      description: "How JioMart uses App Service and Functions for the order pipeline",
      intro: "JioMart's customer-facing order API runs on App Service (Premium v3 plan, VNet-integrated, autoscaling 3-20 instances based on request queue length). When an order is placed, it's written to a Storage Queue, which triggers an Azure Function (Premium plan, no cold start) that updates inventory, sends a confirmation via Notification Hub, and writes an audit record to Cosmos DB — all via output bindings with minimal custom code.",
      points: [
        "App Service Premium v3: Chosen over Consumption because the order API needs VNet integration to reach the private PostgreSQL Flexible Server and Redis cache via private endpoints.",
        "Deployment Slots: 'staging' slot used for blue-green deployments — new app version deployed to staging slot, smoke-tested, then swapped with production with zero downtime.",
        "Queue-Triggered Functions: Order-confirmation Function scales out automatically as queue depth grows during sale events (Consumption-based scaling controller adds instances per queue message backlog).",
        "Timer-Triggered Functions: A nightly Function (CRON '0 0 2 * * *') reconciles JioMart inventory counts against the warehouse management system and flags discrepancies > 1%."
      ],
      shortcut: "AWS Elastic Beanstalk / App Runner == Azure App Service | AWS Lambda == Azure Functions | AWS Lambda Triggers/Event Sources == Azure Functions Triggers & Bindings"
    },
    interview: [
      {
        q: "What's the difference between scaling up and scaling out an App Service, and when is each used?",
        a: "Scale UP changes the App Service Plan's SKU (e.g., S1 -> P1v3) — more CPU/RAM/features per instance, useful when a single request needs more resources (memory-heavy processing). Scale OUT adds more instances of the same SKU behind the load balancer — useful for handling more concurrent requests. Scale out requires Standard tier or higher and is the preferred approach for handling traffic growth since it also improves availability."
      },
      {
        q: "Why might a Consumption-plan Azure Function be unsuitable for a latency-sensitive API, and what's the alternative?",
        a: "Consumption plan scales to zero when idle, causing 'cold start' — the first request after idle time can take several seconds while Azure provisions a host instance and loads the function runtime/dependencies. For latency-sensitive workloads, use the Premium plan, which keeps a configurable number of 'pre-warmed' instances always ready, eliminating cold starts, while still scaling out elastically and supporting VNet integration."
      },
      {
        q: "Explain how a deployment slot enables zero-downtime releases on App Service.",
        a: "Deploy the new version to a non-production slot (e.g., 'staging'), which has its own URL for testing. Once validated, perform a 'slot swap' — Azure swaps the slots' virtual IPs/routing so 'staging' becomes 'production' instantly, with the old production code now sitting in the staging slot (useful for instant rollback by swapping again). Configuration can be marked 'slot-specific' (e.g., connection strings) so each slot retains its own settings during swaps."
      },
      {
        q: "How would you design a Function to process messages from a Storage Queue with automatic retry on failure?",
        a: "Use a Queue Trigger binding — Azure Functions automatically dequeues messages, and if the function throws an unhandled exception, the message is NOT deleted from the queue and becomes visible again after the visibility timeout, triggering a retry. After a configurable max dequeue count (default 5), the message moves to a poison queue (<queuename>-poison) for manual inspection — preventing infinite retry loops on a malformed message."
      },
      {
        q: "What VNet integration option would you use to let an App Service reach a private PostgreSQL Flexible Server, and what's required?",
        a: "Regional VNet Integration: enable it on the App Service (Premium v2/v3 or Standard tier+), pointing to a delegated subnet in your VNet. This lets outbound traffic from the App Service route through the VNet, reaching the PostgreSQL Flexible Server's private endpoint. Note: VNet Integration affects only OUTBOUND traffic — inbound traffic to the App Service still comes via its public/private endpoint configuration separately."
      },
      {
        q: "Compare Azure Functions and a Kubernetes-based microservice for an event-driven workload. When would you choose Functions?",
        a: "Choose Functions when: workload is sporadic/bursty (pay only for execution time, scale-to-zero saves cost), the logic is small and stateless, and you want minimal operational overhead (no cluster to manage). Choose Kubernetes/AKS when: you need fine-grained control over runtime/networking, the workload runs continuously (Functions' cost benefit disappears at high sustained throughput), you need complex inter-service communication (service mesh), or you're already standardized on K8s tooling for CI/CD and observability."
      }
    ]
  },
  "7": {
    id: "7",
    title: "Docker Fundamentals & Images",
    subtitle: "Containers",
    description: "Dockerfile, layers, cache, and container runtimes.",
    theory: {
      title: "Docker Fundamentals & Images Theory",
      description: "How container images are built, layered, and cached, and how they run as isolated processes.",
      whatIsIt: "Docker packages an application and its dependencies into a portable 'image' built from a Dockerfile — a series of instructions (FROM, COPY, RUN, CMD). Each instruction creates a 'layer'; layers are cached and shared across images, making builds and pulls efficient.",
      keyConcepts: [
        { label: "Image Layers & Caching", desc: "Each Dockerfile instruction (RUN, COPY, ADD) creates an immutable layer, stacked via a union filesystem. Docker caches layers — if a layer's instruction and inputs haven't changed, it's reused, dramatically speeding rebuilds. Ordering matters: put rarely-changing instructions (apt-get install) BEFORE frequently-changing ones (COPY src/)." },
        { label: "Container Runtime & Isolation", desc: "A container is a running instance of an image, isolated via Linux namespaces (PID, network, mount) and cgroups (resource limits). It shares the host kernel — unlike a VM, there's no separate guest OS, making containers lightweight and fast to start." },
        { label: "Image Registries & Tags", desc: "Images are pushed to registries (ACR, Docker Hub) with tags (myapp:1.2.3, myapp:latest). 'latest' is a moving tag and should never be used in production deployments — always pin to immutable tags (often a git SHA) for reproducibility." }
      ]
    },
    realWorld: {
      title: "Jio Platforms - Standardized Container Images",
      description: "How Jio enforces consistent, secure base images across 200+ microservices",
      intro: "Jio Platforms maintains a set of 'golden' base images (jio-base-node18, jio-base-java17) in their internal ACR, pre-hardened and Trivy-scanned, that all 200+ microservice teams must FROM in their Dockerfiles. This ensures consistent OS patch levels, removes the need for each team to independently manage CVEs in base layers, and dramatically improves build cache hit rates since the base layers are identical across services.",
      points: [
        "Golden Base Images: jio-base-node18:2024.06 includes only essential packages, runs as non-root user 'appuser' by default, and is rebuilt weekly with latest security patches.",
        "Layer Ordering for Cache Efficiency: Dockerfiles copy package.json and run npm ci BEFORE copying source code — so code changes don't invalidate the (slow) dependency-install layer.",
        "Immutable Tagging: CI pipeline tags every image with the git commit SHA (myapp:a1b2c3d) — 'latest' is never deployed, ensuring exact reproducibility and easy rollback by redeploying a prior SHA.",
        "Registry Cleanup Policy: ACR retention policy purges untagged manifests older than 30 days to control storage costs across thousands of weekly image pushes."
      ],
      shortcut: "AWS == no direct Docker-hosting equivalent (uses ECR for registry, same Docker concepts) | Docker Layer Caching concept is identical across all clouds — it's a Docker/OCI standard, not cloud-specific"
    },
    interview: [
      {
        q: "Why does the order of instructions in a Dockerfile matter for build performance?",
        a: "Docker caches each layer; a layer is invalidated (rebuilt) if its instruction OR any layer before it changes. Placing slow, rarely-changing steps (installing OS packages, npm ci for dependencies) before fast, frequently-changing steps (COPY ./src) means code changes only invalidate the last few layers, not the entire dependency-install step — turning a 3-minute rebuild into a 10-second one."
      },
      {
        q: "What's the difference between COPY and ADD in a Dockerfile?",
        a: "COPY simply copies files/directories from the build context into the image — straightforward and predictable. ADD has extra 'magic': it can auto-extract tar archives and fetch from URLs. Best practice is to always use COPY unless you specifically need ADD's archive-extraction behavior, since ADD's implicit behavior can cause unexpected results and is harder to reason about/cache."
      },
      {
        q: "Why should production images avoid using the 'latest' tag?",
        a: "'latest' is a mutable, floating tag — it can point to a different image tomorrow than it does today, breaking reproducibility (you can't know exactly what's running) and rollback (you can't redeploy 'the previous latest'). Production deployments should use immutable tags, typically the git commit SHA or a semantic version, so any environment can be recreated exactly and rollback is just redeploying a known-good tag."
      },
      {
        q: "Explain why containers start much faster than VMs.",
        a: "A VM requires booting a full guest OS kernel — minutes of overhead. A container is just an isolated process on the HOST's existing kernel, using Linux namespaces (for isolation of PID/network/filesystem views) and cgroups (for resource limits). Starting a container is essentially `fork()`+`exec()` with some namespace setup — milliseconds to seconds, not minutes."
      },
      {
        q: "How would you reduce the size of a Node.js Docker image from 1.2GB to under 200MB?",
        a: "Switch the base image from `node:18` (full Debian, ~1GB) to `node:18-alpine` (~180MB) or use a multi-stage build (covered in Module 8) where a 'builder' stage with full toolchain compiles/installs deps, and only the final runtime stage (alpine-based) copies the compiled output + production node_modules. Also run `npm ci --omit=dev` to skip devDependencies, and add a `.dockerignore` to exclude node_modules, .git, and test files from the build context."
      },
      {
        q: "Your team runs `docker build` and notices the COPY . . layer always rebuilds even with no code changes. What could cause this and how do you fix it?",
        a: "Likely cause: the build context includes files that change on every checkout (e.g., .git directory, build artifacts, log files, OS metadata files like .DS_Store) which alter the context's checksum even if source code is identical. Fix: add a comprehensive `.dockerignore` (.git, node_modules, dist, *.log, .DS_Store) so the build context — and thus the COPY layer's cache key — only reflects files that actually matter."
      }
    ]
  },
  "8": {
    id: "8",
    title: "Multi-Stage Builds & Security",
    subtitle: "Containers",
    description: "Build vs runtime separation and Trivy scanning.",
    theory: {
      title: "Multi-Stage Builds & Security Theory",
      description: "Separating build-time tooling from runtime images to minimize size and attack surface, plus automated vulnerability scanning.",
      whatIsIt: "A multi-stage Dockerfile uses multiple FROM statements — one stage compiles/builds the app with full toolchain (compilers, SDKs), and a final stage copies only the compiled artifacts into a minimal runtime base image. Trivy is an open-source scanner that detects known CVEs in OS packages and application dependencies within an image.",
      keyConcepts: [
        { label: "Multi-Stage Build Pattern", desc: "Stage 1 ('builder', e.g., FROM node:18 AS builder) installs all deps and runs the build. Stage 2 (FROM node:18-alpine) uses COPY --from=builder to pull only the dist/ folder and production node_modules — the final image never contains compilers, source maps, or dev dependencies." },
        { label: "Non-Root User & Read-Only Filesystem", desc: "Production containers should run as a non-root USER (set in Dockerfile) and ideally with a read-only root filesystem (readOnlyRootFilesystem: true in K8s securityContext) — limiting the blast radius if the container is compromised." },
        { label: "Trivy / Vulnerability Scanning Gates", desc: "Trivy scans an image against CVE databases and reports vulnerabilities by severity (CRITICAL/HIGH/MEDIUM/LOW). CI pipelines run `trivy image --severity CRITICAL,HIGH --exit-code 1 myimage:tag` to FAIL the build if critical CVEs are found, before the image is ever pushed to ACR." }
      ]
    },
    realWorld: {
      title: "Jio Platforms - Shift-Left Security in CI",
      description: "How Jio's pipelines block vulnerable images from reaching production",
      intro: "Every microservice's Azure Pipeline includes a mandatory 'Security Scan' stage that runs immediately after `docker build`: Trivy scans the freshly-built image, and if any CRITICAL severity CVE is found with a known fix available, the pipeline fails and blocks the push to ACR. The team that introduced multi-stage builds across all 200 services reduced average image size from 950MB to 140MB and cut CRITICAL CVE counts by 80% (fewer OS packages = smaller attack surface).",
      points: [
        "Multi-Stage Adoption: Java services went from `FROM maven:3.8-openjdk-17` (full JDK + Maven, ~700MB) single-stage to a builder stage + `FROM eclipse-temurin:17-jre-alpine` runtime stage (~180MB) — JDK build tools never ship to production.",
        "Trivy Gate in Pipeline: `trivy image --exit-code 1 --severity CRITICAL --ignore-unfixed $(ACR_NAME)/myapp:$(Build.SourceVersion)` — '--ignore-unfixed' avoids blocking on CVEs with no available patch yet, preventing perpetual pipeline blockage.",
        "Non-Root Enforcement: Azure Policy for AKS ('Kubernetes cluster containers should run with a read only root filesystem' and 'should not run as privileged') blocks pod deployment if the image runs as root and the manifest doesn't set runAsNonRoot: true.",
        "Distroless for High-Security Services: JioFinance's payment microservice uses Google's 'distroless' base images — no shell, no package manager at all — making it nearly impossible for an attacker to execute arbitrary commands even with RCE."
      ],
      shortcut: "AWS == Amazon Inspector for ECR image scanning; Trivy is cloud-agnostic and works identically with ACR, ECR, or Docker Hub"
    },
    interview: [
      {
        q: "Walk through a multi-stage Dockerfile for a Go application and explain why the final image can be extremely small.",
        a: "Stage 1: `FROM golang:1.21 AS builder` — copies source, runs `go build -o app`. Stage 2: `FROM scratch` (or alpine) — `COPY --from=builder /app/app /app` and sets ENTRYPOINT. Because Go compiles to a single static binary with no runtime dependencies, the final image can be `scratch` (literally empty, ~5MB total) containing just the binary — no OS, no shell, no package manager, eliminating almost the entire traditional attack surface."
      },
      {
        q: "What does `trivy image --severity CRITICAL --exit-code 1` do, and why is `--exit-code` important in CI?",
        a: "It scans the image and reports only CRITICAL severity findings; `--exit-code 1` makes Trivy return a non-zero exit code if any matching vulnerabilities are found (default is always 0/success regardless of findings). In a CI pipeline, a non-zero exit code fails the build step, which is what actually GATES the pipeline — without `--exit-code 1`, Trivy would just print a report and the pipeline would proceed to push the vulnerable image anyway."
      },
      {
        q: "Why run containers as a non-root user, and how do you enforce it in both the Dockerfile and Kubernetes?",
        a: "If an attacker exploits a vulnerability in the app, running as root inside the container gives them root-equivalent capabilities within that container's namespace — increasing the chance of container breakout or lateral movement. In the Dockerfile: create a user (`RUN adduser -D appuser`) and add `USER appuser` before CMD. In Kubernetes: set `securityContext: { runAsNonRoot: true, runAsUser: 1000 }` at the pod or container level — K8s will refuse to start the pod if the image tries to run as UID 0, providing defense-in-depth even if the Dockerfile is misconfigured."
      },
      {
        q: "What's the difference between '--ignore-unfixed' and not using it in a Trivy scan, and why would Jio use it?",
        a: "Without `--ignore-unfixed`, Trivy reports ALL matching CVEs including ones where no patched package version exists yet — these can never be resolved by the dev team and would permanently block the pipeline (a false sense of being 'stuck'). With `--ignore-unfixed`, only CVEs that HAVE an available fix are reported/gated — actionable findings only. Jio uses this so the security gate reflects 'things you can actually fix right now' rather than blocking on unfixable upstream issues."
      },
      {
        q: "What is a 'distroless' image and what's the trade-off of using one?",
        a: "A distroless image contains only the application and its runtime dependencies — no shell, no package manager, no OS utilities. Benefit: drastically reduced attack surface (no `sh`, `bash`, `curl` for an attacker to abuse post-compromise) and smaller size. Trade-off: much harder to debug — you can't `kubectl exec` into the container and run commands; debugging requires ephemeral debug containers (`kubectl debug`) or shipping a separate debug-variant image."
      },
      {
        q: "How would you set up a CI pipeline so a HIGH severity CVE doesn't block urgent hotfix deployments, but is still tracked?",
        a: "Use a two-tier gate: CRITICAL severity CVEs with `--exit-code 1` hard-block the pipeline (non-negotiable). HIGH severity CVEs run with `--exit-code 0` (informational) but the scan results are still uploaded as a pipeline artifact/report and pushed to a security dashboard (e.g., Microsoft Defender for Cloud or a vulnerability tracker) with a tracked SLA (e.g., must be fixed within 14 days) — balancing urgent delivery needs against not silently ignoring real risk."
      }
    ]
  },
  "9": {
    id: "9",
    title: "ACR (Azure Container Registry)",
    subtitle: "Containers",
    description: "Private Docker registry, push/pull, geo-replication.",
    theory: {
      title: "ACR (Azure Container Registry) Theory",
      description: "Azure's managed, private OCI image registry with integrated authentication, geo-replication, and build automation.",
      whatIsIt: "Azure Container Registry (ACR) is a private Docker/OCI registry for storing and managing container images and Helm charts. It integrates with Entra ID for RBAC, AKS for pull authentication via Managed Identity, and supports geo-replication for multi-region deployments.",
      keyConcepts: [
        { label: "AcrPull / AcrPush RBAC", desc: "Instead of embedding registry credentials in K8s secrets, AKS clusters are granted the 'AcrPull' role on the ACR via their kubelet Managed Identity (`az aks update --attach-acr <acr-name>`) — enabling password-less, auditable image pulls." },
        { label: "Geo-Replication", desc: "ACR Premium tier supports geo-replication — the same registry (single login server) is replicated across multiple Azure regions, so an AKS cluster in South India pulls from a local replica instead of Central India, reducing latency and egress cost." },
        { label: "ACR Tasks & Retention Policies", desc: "ACR Tasks can automatically rebuild images when a base image updates (e.g., security patch in jio-base-node18 triggers rebuilds of all dependent service images). Retention policies auto-purge untagged manifests after N days to control storage cost." }
      ]
    },
    realWorld: {
      title: "Jio Platforms - Multi-Region ACR Strategy",
      description: "How Jio's central ACR serves AKS clusters across multiple Azure regions",
      intro: "Jio Platforms runs a single Premium-tier ACR ('jioacr.azurecr.io') geo-replicated to Central India and South India, serving AKS clusters in both regions. Every AKS cluster is attached via `az aks update --attach-acr`, eliminating image pull secrets entirely. An ACR Task automatically rebuilds and re-scans all dependent service images whenever the weekly 'jio-base-node18' golden image is updated with security patches.",
      points: [
        "AKS-to-ACR via Managed Identity: `az aks update -n jio-aks-prod -g rg-jio-prod --attach-acr jioacr` grants AcrPull to the kubelet identity — no imagePullSecrets in any manifest, fully auditable via Entra ID sign-in logs.",
        "Geo-Replication for Latency: A pod in the South India AKS cluster pulls from the South India ACR replica (same login server URL, Azure routes to nearest replica) — cutting image pull time during pod autoscale events.",
        "Automated Base-Image Rebuilds: ACR Task watches jio-base-node18:latest; on update, it triggers rebuilds of all 60+ Node.js service images that FROM it, each automatically re-scanned by Trivy before tagging.",
        "Retention Policy: Untagged manifests (left behind by CI overwriting tags during retries) are purged after 7 days via `az acr config retention update --status enabled --days 7`, keeping registry storage costs predictable."
      ],
      shortcut: "AWS ECR == Azure Container Registry | AWS ECR cross-region replication == ACR Geo-Replication | AWS ECR lifecycle policy == ACR retention policy"
    },
    interview: [
      {
        q: "How does AKS authenticate to ACR without storing credentials in Kubernetes secrets?",
        a: "`az aks update --attach-acr <acr-name>` grants the AKS cluster's kubelet Managed Identity the 'AcrPull' RBAC role on the ACR. When the kubelet pulls an image, it authenticates to ACR using its Managed Identity token via Entra ID — no docker-registry secret, no static credentials, and every pull is auditable in Entra ID sign-in logs."
      },
      {
        q: "What is ACR geo-replication and what problem does it solve?",
        a: "Geo-replication (Premium tier) creates copies of your registry's image layers in multiple Azure regions, all accessible via the SAME login server URL (e.g., jioacr.azurecr.io). Azure automatically routes pull requests to the nearest replica. This solves two problems: (1) latency — AKS nodes in a far region don't pull across long distances, speeding pod startup during scale-out, and (2) resilience — if one region's ACR endpoint has issues, other replicas remain available."
      },
      {
        q: "Describe how an ACR Task can automate the 'base image update -> rebuild dependents -> rescan' workflow.",
        a: "Define an ACR Task with a base-image trigger watching e.g. jio-base-node18. When that image is pushed/updated, ACR Tasks automatically triggers a rebuild of any image that declared it in a FROM instruction (ACR tracks this dependency graph). The rebuild runs the full `docker build`, and the task definition can chain a Trivy scan step post-build — so security patches in a shared base image automatically propagate and get re-validated across dozens of dependent service images without manual intervention."
      },
      {
        q: "What's the risk of using imagePullSecrets with a long-lived ACR admin account password versus Managed Identity?",
        a: "The ACR admin account is a single shared credential (username/password) with full push/pull rights — if leaked (e.g., committed to git, exposed in a misconfigured secret), it grants broad access and is hard to rotate without redeploying every cluster/secret referencing it. Managed Identity-based AcrPull is scoped per-identity (per-cluster), requires no secret storage/rotation at all, and is individually revocable (detach the role from one cluster without affecting others) — and every pull is tied to a specific identity in audit logs."
      },
      {
        q: "Your CI pipeline pushes an image tag, but `kubectl rollout` still pulls the old image. What ACR/K8s interaction issue could cause this?",
        a: "If the deployment uses a mutable tag (e.g., `:latest` or `:dev`) with `imagePullPolicy: IfNotPresent` (or default for non-'latest' tags), the kubelet may use a CACHED local copy of that tag on the node rather than re-pulling, since the tag name hasn't changed from the node's perspective. Fix: use immutable tags (git SHA) so each deploy references a genuinely new tag, forcing a pull, OR explicitly set `imagePullPolicy: Always`."
      },
      {
        q: "How would you control storage costs on an ACR that accumulates thousands of images from frequent CI builds?",
        a: "1) Enable a retention policy to auto-purge untagged manifests after N days (`az acr config retention update --days 7 --status enabled`) — these accumulate from tag overwrites/retries. 2) Adopt immutable, meaningful tags (git SHA) so old images can be identified and purged by age/policy rather than guessing. 3) Use ACR Tasks or a scheduled `az acr run` with `acr purge` command to delete images older than a retention window that aren't referenced by any active deployment tag (e.g., keep last 10 tags per repository)."
      }
    ]
  },
  "10": {
    id: "10",
    title: "AKS Architecture & Control Plane",
    subtitle: "Kubernetes / AKS",
    description: "Managed Kubernetes, Node pools, and Azure CNI.",
    theory: {
      title: "AKS Architecture & Control Plane Theory",
      description: "The architecture of Azure's managed Kubernetes service: what Azure manages vs what you manage, and how networking is configured.",
      whatIsIt: "Azure Kubernetes Service (AKS) is a managed Kubernetes offering where Azure operates and patches the control plane (API server, etcd, scheduler) for free, while you manage the 'node pools' (worker VMs/VMSS) that run your workloads. Azure CNI vs kubenet determines how pod networking integrates with your VNet.",
      keyConcepts: [
        { label: "Control Plane vs Node Pools", desc: "The control plane (API server, etcd, controller-manager, scheduler) is fully managed by Azure — you don't SSH into it or patch it, and (in most SKUs) don't pay for it directly. Node pools are YOUR VMSS instances; you choose SKU, count, and are responsible for OS patching (or use auto-upgrade)." },
        { label: "Azure CNI vs Kubenet", desc: "Azure CNI assigns each pod a real IP from the VNet's subnet (pods are directly routable/visible in the VNet — needed for features like private endpoints, Application Gateway Ingress Controller) but consumes more IPs (plan subnet size carefully). Kubenet uses a separate pod CIDR with NAT — simpler IP planning but more limitations (no direct VNet routing to pods, some Azure features unsupported)." },
        { label: "System vs User Node Pools", desc: "Every AKS cluster requires at least one 'system' node pool running critical components (CoreDNS, metrics-server, tunnelfront). 'User' node pools run your application workloads and can be added/removed/scaled independently, including using taints to dedicate pools (e.g., GPU node pool tainted for ML workloads only)." }
      ]
    },
    realWorld: {
      title: "Jio Platforms - Production AKS Cluster Design",
      description: "How JioMart's production AKS cluster is architected for isolation and scale",
      intro: "JioMart's production AKS cluster runs Azure CNI (required for Application Gateway Ingress Controller and private endpoint connectivity to PostgreSQL), with a dedicated 'system' node pool (3 nodes, Standard_D2s_v3) running only K8s system components, and multiple 'user' node pools: 'general' (Standard_D4s_v5, autoscaling 5-30 nodes) for typical microservices, and 'memory-cache' (Standard_E8s_v5, tainted) dedicated to Redis-backed session services.",
      points: [
        "Azure CNI for Private Endpoint Access: Pods need real VNet IPs to establish private connectivity to PostgreSQL Flexible Server and Key Vault via Private Link — kubenet's NAT'd pod IPs wouldn't work with private endpoints.",
        "System/User Pool Separation: The system pool is tainted CriticalAddonsOnly=true:NoSchedule, ensuring application pods never get scheduled there and starve system components of resources during traffic spikes.",
        "Subnet Sizing for CNI: The AKS subnet is sized /22 (1024 IPs) to accommodate max-scale node count x max-pods-per-node (30) — undersizing this is a common production outage cause when CNI exhausts available pod IPs.",
        "Cluster Autoscaler: The 'general' user pool autoscales 5-30 nodes based on pending pod resource requests, with the cluster autoscaler configured with a 10-minute scale-down delay to avoid thrashing during fluctuating load."
      ],
      shortcut: "AWS EKS == Azure AKS | AWS EKS Managed Node Groups == AKS Node Pools | AWS VPC CNI == Azure CNI (similar 'pod gets real VPC/VNet IP' model)"
    },
    interview: [
      {
        q: "What's the difference between what Azure manages and what you manage in AKS?",
        a: "Azure manages the CONTROL PLANE: API server, etcd, scheduler, controller-manager — including their patching, scaling, and HA, typically at no direct compute cost (Free tier) or a small fee for the Standard tier SLA. YOU manage the NODE POOLS — the VMSS-backed worker nodes where your pods run. You choose VM SKU, node count/autoscaling, OS image, and are responsible for node OS upgrades (though AKS automates much of this via node image upgrades and auto-upgrade channels)."
      },
      {
        q: "Explain the key difference between Azure CNI and kubenet, and when you'd choose each.",
        a: "Azure CNI assigns each pod an IP address directly from the VNet subnet — pods are first-class VNet citizens, directly reachable, required for AKS features like Application Gateway Ingress Controller, Windows node pools, and Private Link connectivity. Kubenet assigns pods IPs from a separate, non-VNet-routable CIDR and uses NAT for outbound — simpler IP address planning (doesn't consume VNet IPs per pod) but more limited. Choose Azure CNI for production clusters needing VNet integration; kubenet might suffice for simple/small clusters where IP conservation is the priority — though Azure CNI Overlay mode now offers a middle ground."
      },
      {
        q: "Why does AKS require at least one 'system' node pool, and what's the benefit of separating it from user node pools?",
        a: "AKS runs critical components (CoreDNS for cluster DNS, metrics-server, konnectivity/tunnelfront for control-plane-to-node communication) as pods that must always be scheduled and healthy for the cluster to function. A dedicated system node pool, tainted with CriticalAddonsOnly=true:NoSchedule, guarantees these pods always have resources and are never evicted by application pod scheduling pressure — preventing a scenario where a noisy application workload starves CoreDNS and breaks cluster-wide DNS resolution."
      },
      {
        q: "An AKS cluster with Azure CNI starts failing to schedule new pods with 'no available IP addresses' errors during a scale-out event. What's the root cause and fix?",
        a: "Root cause: the AKS subnet's IP address space is exhausted — with Azure CNI, every pod (not just every node) consumes a VNet IP, so (max nodes) x (max pods per node, default 30 or 110) must fit within the subnet. Fix (short-term): reduce max-pods-per-node on new nodes, or manually free IPs by scaling down. Fix (long-term): this often requires migrating to a larger subnet (which may need recreating the node pool with a new subnet) or switching to Azure CNI Overlay mode, which decouples pod IPs from the VNet address space entirely."
      },
      {
        q: "What is a node pool taint and how is it used to isolate workloads, e.g., a GPU node pool?",
        a: "A taint (`key=value:effect`, e.g., `sku=gpu:NoSchedule`) marks a node so the scheduler will NOT place pods there UNLESS the pod has a matching 'toleration'. For a GPU node pool, you'd taint the nodes with `nvidia.com/gpu=true:NoSchedule` and only ML workload pods would include the corresponding toleration plus a `resources.limits['nvidia.com/gpu']` request — ensuring expensive GPU nodes aren't wasted running generic web pods, while generic pods are never accidentally scheduled onto (and blocking) GPU capacity."
      },
      {
        q: "How does the Cluster Autoscaler decide to add a node, and why might a pod remain Pending even with autoscaling enabled?",
        a: "Cluster Autoscaler watches for Pending pods that can't be scheduled due to insufficient resources, and if adding a node from an autoscale-enabled node pool WOULD allow scheduling, it scales out (respecting max node count). A pod can remain Pending despite autoscaling if: it requests resources exceeding any available VM SKU in the node pool (no node size would ever fit it), the node pool is already at max count, there's a taint the pod doesn't tolerate, or a PodDisruptionBudget/affinity rule makes scheduling impossible regardless of node count — autoscaler only adds capacity, it doesn't fix scheduling constraint mismatches."
      }
    ]
  },
  "11": {
    id: "11",
    title: "Pods, Deployments & Services",
    subtitle: "Kubernetes / AKS",
    description: "Replicas, rolling updates, ClusterIP, and LoadBalancers.",
    theory: {
      title: "Pods, Deployments & Services Theory",
      description: "The core Kubernetes workload and networking objects: the smallest deployable unit, how to manage replicas declaratively, and how to expose them.",
      whatIsIt: "A Pod is the smallest deployable unit in Kubernetes — one or more containers sharing a network namespace and storage. A Deployment manages a ReplicaSet to keep a desired number of identical Pods running and performs rolling updates. A Service provides a stable virtual IP/DNS name to load-balance traffic across a set of Pods whose individual IPs are ephemeral.",
      keyConcepts: [
        { label: "Pods & Deployments", desc: "You rarely create Pods directly — a Deployment declares 'I want 5 replicas of this image' and its controller continuously reconciles reality to match. Rolling updates replace Pods gradually (maxSurge/maxUnavailable) so there's no downtime; rollback is a single `kubectl rollout undo`." },
        { label: "Service Types", desc: "ClusterIP (default) — internal-only virtual IP for pod-to-pod traffic. NodePort — opens a port on every node. LoadBalancer — provisions an Azure Standard Load Balancer with a public/private IP. Services match Pods via label selectors, not IPs." },
        { label: "Liveness & Readiness Probes", desc: "Readiness probe gates whether a Pod receives Service traffic (failing = removed from the load-balancer pool but not killed). Liveness probe restarts a hung container. Misconfiguring these is a top cause of rolling-update outages." }
      ]
    },
    realWorld: {
      title: "Jio Platforms - Zero-Downtime Microservice Deploys",
      description: "How JioMart rolls out 200+ microservices without dropping customer traffic",
      intro: "JioMart's checkout microservice runs as a Deployment with 12 replicas across 3 availability zones. Each deploy is a rolling update (maxUnavailable: 0, maxSurge: 25%) gated by a readiness probe hitting /healthz — new pods only receive traffic once they report ready, so a bad build never takes down checkout. A ClusterIP Service fronts the pods internally, while an internal LoadBalancer Service exposes the API gateway tier to the Application Gateway.",
      points: [
        "Rolling Update Safety: maxUnavailable: 0 guarantees full capacity is maintained during deploys; maxSurge: 25% spins up extra pods first, then drains old ones only after new ones pass readiness.",
        "Readiness Probe Gating: /healthz checks DB and Redis connectivity — a pod that can't reach PostgreSQL is kept out of the Service pool, preventing 500s during a dependency blip.",
        "Internal LoadBalancer: The API gateway Service uses annotation 'service.beta.kubernetes.io/azure-load-balancer-internal: true' so it gets a private VNet IP fronted by Application Gateway, never a public IP.",
        "Instant Rollback: A bad release is reverted with `kubectl rollout undo deployment/checkout` — the previous ReplicaSet is scaled back up while the broken one scales to zero."
      ],
      shortcut: "AWS ECS Task == K8s Pod (loosely) | AWS ECS Service == K8s Deployment + Service | AWS ALB/NLB Target Group == K8s Service (LoadBalancer type backed by Azure LB)"
    },
    interview: [
      { q: "What is the difference between a Deployment and a ReplicaSet?", a: "A ReplicaSet's only job is to keep N identical Pods running. A Deployment is a higher-level object that OWNS and manages ReplicaSets to provide rolling updates and rollback — when you change the image, the Deployment creates a NEW ReplicaSet and gradually shifts replicas from old to new. You almost always manage Deployments, not ReplicaSets directly." },
      { q: "Explain the three main Service types and when to use each.", a: "ClusterIP (default): internal-only stable IP for pod-to-pod communication — use for backend services. NodePort: exposes the service on a static port on every node — rarely used directly in production. LoadBalancer: provisions an Azure Load Balancer with an external (or internal) IP — use to expose a service outside the cluster, though Ingress is usually preferred for HTTP." },
      { q: "What's the difference between a liveness probe and a readiness probe?", a: "Readiness probe controls whether a Pod is added to the Service's load-balancing pool — if it fails, the Pod stops receiving traffic but is NOT restarted (useful while warming up or when a dependency is temporarily down). Liveness probe controls whether the container is restarted — if it fails repeatedly, the kubelet kills and restarts the container (for deadlocks/hangs). Confusing the two (e.g., a liveness probe that checks a flaky dependency) causes unnecessary restart loops." },
      { q: "How does a rolling update achieve zero downtime, and what role do maxSurge/maxUnavailable play?", a: "maxUnavailable defines how many pods can be down during the update; maxSurge defines how many extra pods can be created above the desired count. Setting maxUnavailable: 0 + maxSurge: 25% means Kubernetes brings up new pods FIRST, waits for them to pass readiness, then terminates old ones — capacity never drops below 100%, so users see no downtime." },
      { q: "A Service exists and pods are Running, but traffic isn't reaching them. How do you debug?", a: "1) Check the Service's label selector matches the pods' labels (`kubectl get endpoints <svc>` — empty endpoints means selector mismatch). 2) Verify pods pass readiness probes (a failing readiness probe removes them from endpoints). 3) Check NetworkPolicies aren't blocking the traffic. 4) Confirm the container is listening on the targetPort the Service forwards to. The `kubectl get endpoints` command is the fastest first check — it shows exactly which pod IPs the Service is routing to." },
      { q: "Why are Pod IPs considered ephemeral, and how do Services solve this?", a: "Pods are cattle, not pets — they're created and destroyed constantly (scaling, rescheduling, node failures), each time getting a new IP. Hardcoding a Pod IP would break the moment that pod is replaced. A Service provides a stable ClusterIP and DNS name (e.g., checkout.production.svc.cluster.local) that never changes; kube-proxy continuously updates the backend pod IPs behind it via the label selector, so callers always use the stable Service name." }
    ]
  },
  "12": {
    id: "12",
    title: "Ingress Controllers & Routing",
    subtitle: "Kubernetes / AKS",
    description: "NGINX ingress, TLS termination, and path routing.",
    theory: {
      title: "Ingress Controllers & Routing Theory",
      description: "How HTTP/HTTPS traffic is routed into a cluster using a single entry point with host/path-based rules and TLS termination.",
      whatIsIt: "An Ingress is a Kubernetes object defining HTTP routing rules (host + path -> Service). An Ingress Controller (NGINX, or Azure's Application Gateway Ingress Controller / AGIC) is the actual pod/appliance that reads Ingress objects and implements the routing, TLS termination, and load balancing — without it, Ingress objects do nothing.",
      keyConcepts: [
        { label: "Ingress vs LoadBalancer Service", desc: "A LoadBalancer Service gives each service its own public IP (expensive, no L7 features). An Ingress lets MANY services share ONE IP, routing by hostname (api.jio.com) or path (/cart, /checkout) — with TLS termination, rewrite rules, and rate limiting at L7." },
        { label: "TLS Termination", desc: "The Ingress Controller holds the TLS certificate (stored in a Kubernetes Secret, often synced from Key Vault) and decrypts HTTPS at the edge — backend pods receive plain HTTP inside the cluster, simplifying certificate management to one place." },
        { label: "NGINX Ingress vs AGIC", desc: "NGINX Ingress runs as pods inside the cluster (in-cluster L7 proxy). Azure Application Gateway Ingress Controller (AGIC) programs an external Azure Application Gateway instead — offloading L7 to a managed Azure resource with WAF (Web Application Firewall) capabilities." }
      ]
    },
    realWorld: {
      title: "Jio Platforms - Single Ingress for the JioMart Domain",
      description: "How dozens of microservices sit behind one hostname with WAF protection",
      intro: "JioMart routes all customer traffic for www.jiomart.com through Azure Application Gateway (with WAF_v2 SKU) driven by AGIC. Path-based rules send /api/cart to the cart-service, /api/checkout to checkout-service, and / to the frontend — all sharing one public IP and one wildcard TLS cert (*.jiomart.com) auto-synced from Key Vault. WAF blocks OWASP Top 10 attacks before traffic ever reaches a pod.",
      points: [
        "Path-Based Routing: One Ingress manifest maps /api/cart, /api/checkout, /api/search to their respective backend Services — no per-service public IP.",
        "WAF at the Edge: Application Gateway WAF_v2 with OWASP 3.2 ruleset blocks SQL injection / XSS attempts; logs flow to Log Analytics for the SOC team.",
        "TLS from Key Vault: The *.jiomart.com cert lives in Azure Key Vault; AGIC references it so cert rotation happens in one place without redeploying pods.",
        "Sticky Sessions for Legacy: A specific legacy service uses cookie-based affinity annotations to keep a user pinned to one pod during migration to stateless architecture."
      ],
      shortcut: "AWS ALB Ingress Controller == Azure AGIC | AWS ALB path/host routing == K8s Ingress rules | AWS WAF == Azure Application Gateway WAF"
    },
    interview: [
      { q: "Why use an Ingress instead of a LoadBalancer Service for each microservice?", a: "A LoadBalancer Service provisions a separate Azure Load Balancer public IP per service — costly and with only L4 features. An Ingress lets many services share ONE public IP and adds L7 capabilities: host/path routing, TLS termination, URL rewrites, rate limiting, and WAF. For an HTTP API platform with dozens of services, Ingress is dramatically cheaper and more capable." },
      { q: "What happens if you create an Ingress object but no Ingress Controller is installed?", a: "Nothing — the Ingress object is just a set of routing rules with no implementation. An Ingress Controller (NGINX pods, or AGIC programming an Application Gateway) is the component that actually watches Ingress objects and configures real routing. Without a controller, the Ingress shows no ADDRESS and no traffic is routed." },
      { q: "Compare NGINX Ingress Controller with Azure Application Gateway Ingress Controller (AGIC).", a: "NGINX Ingress runs as pods INSIDE the cluster — flexible, cloud-agnostic, but you manage its scaling and the traffic makes an extra in-cluster hop. AGIC programs an EXTERNAL Azure Application Gateway — L7 is offloaded to a managed Azure resource with native WAF, autoscaling, and zone redundancy, and traffic goes straight to pod IPs (with Azure CNI) bypassing an in-cluster proxy. Choose AGIC for tight Azure integration + WAF; NGINX for portability and fine-grained config." },
      { q: "How is TLS termination handled at the Ingress, and where does the certificate live?", a: "The Ingress references a Kubernetes Secret (type kubernetes.io/tls) containing the cert + private key, declared under the Ingress's tls: section for specific hosts. The Ingress Controller decrypts HTTPS at the edge and forwards plain HTTP to backend pods. In Azure, the cert is often stored in Key Vault and synced into the Secret (via CSI driver or AGIC's native Key Vault integration) so rotation is centralized." },
      { q: "A new path rule /api/v2 returns 404 from the Ingress while /api/v1 works. What do you check?", a: "1) Confirm the Ingress rule's path and pathType (Prefix vs Exact) actually match /api/v2. 2) Check the backend Service named in the rule exists and has healthy endpoints (`kubectl get endpoints`). 3) Verify any rewrite-target annotation isn't stripping the path incorrectly. 4) Check the Ingress Controller logs for the request — NGINX logs will show whether it matched a rule and what upstream it tried. Often it's a pathType/rewrite mismatch or an empty Service endpoint list." },
      { q: "How would you implement canary routing (5% of traffic to a new version) with NGINX Ingress?", a: "Use NGINX Ingress canary annotations: create a second Ingress for the same host/path pointing to the canary Service with annotations 'nginx.ingress.kubernetes.io/canary: true' and 'canary-weight: 5'. NGINX then routes ~5% of requests to the canary backend and 95% to the stable one. You can also canary by header or cookie for internal testing before shifting weight — increasing the weight gradually as the canary proves healthy." }
    ]
  },
  "13": {
    id: "13",
    title: "HPA & Network Policies",
    subtitle: "Kubernetes / AKS",
    description: "CPU/memory autoscaling and pod-to-pod traffic control.",
    theory: {
      title: "HPA & Network Policies Theory",
      description: "Automatically scaling workloads based on demand, and micro-segmenting pod-to-pod traffic for zero-trust security inside the cluster.",
      whatIsIt: "The Horizontal Pod Autoscaler (HPA) automatically adjusts the replica count of a Deployment based on observed metrics (CPU, memory, or custom metrics like queue depth). A NetworkPolicy is a Kubernetes object that defines which pods can communicate with which — by default all pods can talk to all pods, and NetworkPolicies lock that down.",
      keyConcepts: [
        { label: "HPA Mechanics", desc: "HPA queries the metrics-server (or KEDA/Prometheus for custom metrics) and scales replicas to keep a target utilization (e.g., 70% CPU). It needs resource REQUESTS defined on pods to compute utilization. Pair with Cluster Autoscaler: HPA adds pods, Cluster Autoscaler adds nodes when pods can't fit." },
        { label: "KEDA for Event-Driven Scaling", desc: "Standard HPA scales on CPU/memory. KEDA (Kubernetes Event-Driven Autoscaling, an AKS add-on) scales on external signals — Service Bus queue length, Kafka lag, even scale-to-zero — ideal for bursty, event-driven workloads." },
        { label: "NetworkPolicy / Zero Trust", desc: "By default Kubernetes networking is flat (any pod -> any pod). A NetworkPolicy (enforced by Azure NPM or Calico/Cilium) restricts ingress/egress by pod label, namespace, or IP block — e.g., 'only the api namespace can talk to the database pods on 5432'." }
      ]
    },
    realWorld: {
      title: "Jio Platforms - Elastic Scale + Zero Trust for Sale Events",
      description: "How JioMart absorbs Big Billion Days traffic while isolating tiers",
      intro: "During JioMart's sale events, the search-service HPA scales from 8 to 80 replicas when CPU exceeds 65%, while the order-processor uses KEDA to scale on Azure Service Bus queue depth (1 replica per 500 queued orders, scaling to zero overnight). NetworkPolicies enforce zero trust: only pods labeled tier=api can reach tier=db pods on port 5432, and the payment namespace is fully isolated except for explicit allows.",
      points: [
        "CPU-Based HPA: search-service targets 65% CPU, min 8 / max 80 replicas — proactively scaled ahead of sale start via a temporary higher min-replica floor.",
        "KEDA Queue Scaling: order-processor scales on Service Bus 'orders' queue length, scaling to zero when the queue drains post-sale, eliminating idle cost.",
        "Database Isolation: A NetworkPolicy denies all ingress to tier=db pods except from tier=api pods on TCP 5432 — a compromised frontend pod can't directly hit the database.",
        "Payment Namespace Lockdown: default-deny NetworkPolicy in the payment namespace; only explicit egress to the payment gateway FQDN and ingress from the checkout service is allowed."
      ],
      shortcut: "AWS Application Auto Scaling for ECS == K8s HPA | AWS Security Groups (pod-level via VPC CNI) == K8s NetworkPolicy | KEDA has no native AWS equivalent (works on EKS too, it's CNCF)"
    },
    interview: [
      { q: "What does the HPA need in order to scale on CPU, and what's a common reason it shows 'unknown' utilization?", a: "HPA requires (1) the metrics-server running in the cluster and (2) CPU resource REQUESTS defined on the pods — utilization is computed as actual-usage / requested. A common 'unknown'/<unknown> target means the pods have no CPU request set (so there's no denominator), or metrics-server isn't installed/healthy. Always set resource requests for any workload you intend to autoscale." },
      { q: "How do HPA and Cluster Autoscaler work together?", a: "They operate at different layers. HPA scales the number of POD replicas based on load. When HPA adds pods but there isn't enough node capacity to schedule them (pods go Pending), the Cluster Autoscaler notices the unschedulable pods and adds NODES to the node pool. On scale-down, HPA removes pods, then Cluster Autoscaler removes now-empty nodes. Both are needed for true end-to-end elasticity." },
      { q: "When would you use KEDA instead of the standard HPA?", a: "Standard HPA only scales on CPU/memory (and basic custom metrics). KEDA scales on EXTERNAL event sources — Azure Service Bus/Storage queue length, Kafka consumer lag, Prometheus queries, cron schedules — and uniquely supports scale-to-ZERO. Use KEDA for event-driven/bursty workloads (queue processors, batch jobs) where CPU isn't the right signal and idle cost matters; KEDA actually creates and manages an HPA under the hood for the scaling math." },
      { q: "What is the default pod-to-pod networking behavior in Kubernetes, and how do NetworkPolicies change it?", a: "By default Kubernetes networking is completely flat and permissive — ANY pod can reach ANY other pod on any port, across all namespaces. A NetworkPolicy changes this to a default-deny model FOR THE PODS IT SELECTS: once a NetworkPolicy selects a pod, only the explicitly allowed ingress/egress is permitted. This requires a network plugin that enforces policy (Azure Network Policy Manager, Calico, or Cilium) — without one, NetworkPolicy objects are silently ignored." },
      { q: "Write the intent of a NetworkPolicy that isolates a database tier. What does it allow/deny?", a: "A policy selecting podSelector: {tier: db} with policyTypes: [Ingress], allowing ingress only from pods matching {tier: api} on port 5432. Effect: the moment this policy exists, db pods reject ALL ingress except from api-labeled pods on 5432 — a compromised frontend, monitoring pod, or attacker pod in the cluster cannot open a connection to the database, implementing zero-trust micro-segmentation." },
      { q: "HPA is rapidly scaling up and down ('flapping'). How do you stabilize it?", a: "Tune the HPA's stabilization window and behavior policies: increase scaleDown stabilizationWindowSeconds (e.g., 300s) so it waits before scaling in, and cap scaleUp/scaleDown rates via the behavior.scaleDown/scaleUp policies (e.g., remove at most 10% of pods per minute). Also ensure the metric isn't noisy — averaging over a longer window and setting an appropriate target utilization (not too close to baseline) prevents the controller from overreacting to brief spikes." }
    ]
  },
  "14": {
    id: "14",
    title: "Git Fundamentals & Gitflow",
    subtitle: "CI/CD & Automation",
    description: "Branching, merging, rebasing, and PR policies.",
    theory: {
      title: "Git Fundamentals & Gitflow Theory",
      description: "Distributed version control concepts and the branching strategies teams use to ship safely at scale.",
      whatIsIt: "Git is a distributed version control system tracking changes as a graph of commits. A branching strategy (Gitflow, trunk-based, GitHub Flow) defines how teams isolate work, integrate changes, and release. Pull Requests with branch policies enforce review, CI, and quality gates before code merges.",
      keyConcepts: [
        { label: "Merge vs Rebase", desc: "Merge preserves history and creates a merge commit (non-linear graph). Rebase replays your commits on top of the target branch for a clean linear history but rewrites commit hashes — never rebase shared/public branches. Most teams: rebase local feature work, merge (with PR) into main." },
        { label: "Branching Strategies", desc: "Gitflow: long-lived main/develop + feature/release/hotfix branches (heavier, good for scheduled releases). Trunk-Based: short-lived branches merged to main daily behind feature flags (favored for CI/CD). GitHub Flow: branch off main, PR, merge, deploy — simple and continuous." },
        { label: "Branch Policies & PR Gates", desc: "Protected branches (main) require: a minimum number of reviewers, passing CI checks (build + tests + security scan), linked work item, and no direct pushes. This is the enforcement point that prevents unreviewed or broken code from reaching production." }
      ]
    },
    realWorld: {
      title: "Jio Platforms - Trunk-Based Flow with Mandatory Gates",
      description: "How 200+ engineers integrate continuously without breaking main",
      intro: "Jio's microservice teams use trunk-based development: short-lived feature branches (lifespan < 2 days) merged into main via Pull Requests in Azure Repos. Branch policies on main require 2 approvers, a passing build + unit test + Trivy scan, a linked Azure Boards work item, and resolution of all comments. Risky changes ship behind feature flags so main is always releasable.",
      points: [
        "Short-Lived Branches: Feature branches live < 48 hours to minimize merge conflicts and integration drift across 200 services.",
        "Mandatory PR Gates: main is protected — 2 reviewers, green CI (build/test/scan), linked work item, and comment resolution required before merge.",
        "Feature Flags over Long Branches: Incomplete features merge to main disabled behind a flag (LaunchDarkly/config), keeping main always deployable.",
        "Rebase Locally, Merge via PR: Engineers rebase their feature branch on latest main before opening a PR (clean history), then the PR does a squash-merge into main."
      ],
      shortcut: "AWS CodeCommit == Azure Repos (both are hosted Git) | Git itself is identical everywhere — branching strategy is a team practice, not a cloud feature"
    },
    interview: [
      { q: "What's the difference between git merge and git rebase, and when do you use each?", a: "Merge combines branches by creating a merge commit, preserving the exact history (non-linear graph). Rebase replays your commits on top of another branch, producing a clean LINEAR history but rewriting commit hashes. Rule of thumb: rebase your LOCAL feature branch onto main to stay current and keep history clean; NEVER rebase a branch others have pulled (rewriting shared history breaks their clones). Final integration into main is usually a PR merge (often squash)." },
      { q: "Explain Gitflow vs trunk-based development and which suits CI/CD better.", a: "Gitflow uses long-lived develop + main branches plus feature/release/hotfix branches — structured for scheduled, versioned releases but heavier and prone to long-lived divergence. Trunk-based uses very short-lived branches merged to main multiple times a day, with incomplete work hidden behind feature flags. Trunk-based suits CI/CD better because continuous integration into one trunk minimizes merge hell and enables continuous delivery; Gitflow's release branches add friction to a fast deploy cadence." },
      { q: "Why is rebasing a shared/public branch dangerous?", a: "Rebase rewrites commit history — it creates NEW commits with new hashes replacing the old ones. If others have already pulled the original commits, their history now diverges from yours; their next pull creates duplicate commits or conflicts, and a force-push can erase commits teammates were relying on. Only rebase commits that exist solely in your local branch and haven't been shared." },
      { q: "What branch policies would you enforce on main in a production repo?", a: "Require pull request (no direct pushes), minimum reviewers (e.g., 2), all CI checks passing (build + unit tests + security/Trivy scan + lint), a linked work item for traceability, resolution of all PR comments, and optionally a 'reset votes on new changes' rule so a re-pushed PR must be re-approved. These gates ensure nothing unreviewed, broken, or untraceable reaches the release branch." },
      { q: "A teammate force-pushed and 'lost' commits. How do you recover them?", a: "Use `git reflog` — it records every position HEAD has pointed to locally, including commits orphaned by a force-push/reset. Find the lost commit's hash in the reflog and `git checkout <hash>` or `git branch recovery <hash>` to restore it. On the server side, Azure Repos/GitHub also keep the old ref for a window and may allow restoring via the API. The reflog is the first-line recovery tool for 'disappeared' local commits." },
      { q: "What is a squash merge and why might a team prefer it for PRs?", a: "A squash merge condenses ALL commits in a feature branch into a SINGLE commit on the target branch. Teams prefer it because main's history becomes one clean, meaningful commit per feature/PR (instead of 'wip', 'fix typo', 'address review' noise), making the history readable and `git revert` of an entire feature trivial. The trade-off is losing the granular per-commit history of the feature branch on main." }
    ]
  },
  "15": {
    id: "15",
    title: "GitHub Actions",
    subtitle: "CI/CD & Automation",
    description: "Workflows, secrets, and matrix builds.",
    theory: {
      title: "GitHub Actions Theory",
      description: "GitHub's native CI/CD engine — event-driven workflows defined as YAML that build, test, and deploy directly from your repository.",
      whatIsIt: "GitHub Actions runs automated workflows triggered by repository events (push, pull_request, schedule, manual dispatch). A workflow contains jobs (run on runners), jobs contain steps, and steps run shell commands or reusable 'actions'. It integrates secrets management, environments with approvals, and OIDC federation to Azure for password-less deploys.",
      keyConcepts: [
        { label: "Workflow Structure", desc: "Triggers (on:) -> Jobs (run in parallel by default on runners) -> Steps (sequential within a job). Jobs can declare needs: to enforce ordering, and use matrix: to fan out the same job across multiple versions/OSes." },
        { label: "Secrets & OIDC to Azure", desc: "Secrets are stored encrypted at repo/org/environment scope. Best practice for Azure deploys is OIDC (azure/login with a federated credential) — GitHub issues a short-lived token, so NO long-lived client secret is stored, eliminating credential leakage risk." },
        { label: "Reusable Workflows & Caching", desc: "Reusable workflows (workflow_call) let you DRY up pipeline logic across many repos. actions/cache speeds builds by caching dependencies (npm, Maven) keyed on lockfile hashes — critical for fast feedback at scale." }
      ]
    },
    realWorld: {
      title: "Jio Platforms - OSS & Tooling CI on GitHub Actions",
      description: "How Jio's open-source tooling and crawlers build/deploy via Actions",
      intro: "Jio's internal tooling and the JD-crawler service live on GitHub and use GitHub Actions: a matrix build tests against Node 18/20, a security job runs Trivy + npm audit, and deploys to Azure use OIDC federation (azure/login with a federated credential) so NO secret is ever stored. A scheduled workflow runs the job crawler daily at 06:00 IST, and a reusable workflow centralizes the build/scan/push steps shared across repos.",
      points: [
        "Matrix Builds: The crawler tests on Node 18 and 20 in parallel via a matrix, catching version-specific issues before merge.",
        "OIDC to Azure (no secrets): azure/login uses a federated credential on an Entra app registration — GitHub gets a short-lived token; no AZURE_CLIENT_SECRET stored anywhere.",
        "Scheduled Crawl: A cron workflow (schedule: '30 0 * * *' UTC = 06:00 IST) runs the LinkedIn/Naukri crawlers daily and pushes results.",
        "Reusable Workflow: A central .github/workflows/build-scan-push.yml is called via workflow_call from each service repo, so the build/Trivy/ACR-push logic is defined once."
      ],
      shortcut: "AWS CodeBuild/CodePipeline == GitHub Actions (CI/CD engine) | AWS IAM OIDC for GitHub == Azure Entra Workload Identity Federation for GitHub | GitHub Secrets == AWS Secrets/SSM (per-repo encrypted secrets)"
    },
    interview: [
      { q: "What's the structure of a GitHub Actions workflow (triggers, jobs, steps)?", a: "A workflow YAML has: triggers (on: push/pull_request/schedule/workflow_dispatch) defining WHEN it runs; jobs that run on runners (parallel by default, ordered with needs:); and steps within each job that run sequentially — each step is either a shell command (run:) or a reusable action (uses:). Jobs run in isolated runner environments and share data via artifacts or outputs." },
      { q: "Why is OIDC federation preferred over storing an Azure client secret in GitHub Actions?", a: "With OIDC (Workload Identity Federation), GitHub Actions requests a short-lived token from Entra ID using a trust relationship (federated credential) tied to the specific repo/branch/environment — NO long-lived secret is stored in GitHub at all. This eliminates the risk of a leaked/expired AZURE_CLIENT_SECRET, removes secret-rotation burden, and scopes access precisely to which workflow can assume the identity. Static secrets can leak in logs/forks; OIDC tokens expire in minutes." },
      { q: "What is a matrix build and what problem does it solve?", a: "A matrix strategy fans out a single job into multiple parallel runs across combinations of variables (e.g., node-version: [18, 20] x os: [ubuntu, windows]). It solves the problem of validating your code across many environments/versions efficiently and in parallel, instead of writing duplicated jobs — catching version- or OS-specific failures before merge." },
      { q: "How does dependency caching work in Actions and why does it matter at scale?", a: "actions/cache stores a directory (e.g., ~/.npm, ~/.m2) keyed on a hash of the lockfile (package-lock.json). On the next run, if the key matches, it restores the cache instead of re-downloading all dependencies. At scale (hundreds of builds/day) this cuts build time dramatically and reduces network/registry load — a cache hit can turn a 3-minute install into seconds." },
      { q: "How do you require a manual approval before a GitHub Actions job deploys to production?", a: "Use GitHub Environments: define a 'production' environment with required reviewers (and optional wait timer / branch restrictions). A job that references environment: production will PAUSE before running until a designated reviewer approves it in the UI. Environment-scoped secrets also become available only to jobs targeting that environment — combining approval gating with secret isolation." },
      { q: "A workflow secret is accidentally printed in logs. What are the risks and how does Actions mitigate it?", a: "Risk: anyone with read access to the run logs (including forks if misconfigured) could exfiltrate the secret. GitHub Actions auto-MASKS registered secrets in logs (replaces with ***), but transformations (base64, substrings) can defeat masking. Mitigations: rotate the exposed secret immediately, prefer OIDC over static secrets, restrict secret availability to specific environments, and never echo secrets or pass them through commands that transform them." }
    ]
  },
  "16": {
    id: "16",
    title: "Azure Repos & Azure Pipelines",
    subtitle: "CI/CD & Automation",
    description: "YAML pipelines, stages, and Service Connections.",
    theory: {
      title: "Azure Repos & Azure Pipelines Theory",
      description: "Azure DevOps' Git hosting and its powerful multi-stage YAML pipeline engine for enterprise CI/CD.",
      whatIsIt: "Azure Repos provides Git repositories within Azure DevOps. Azure Pipelines is a YAML-defined CI/CD engine organized into stages -> jobs -> steps, running on Microsoft-hosted or self-hosted agents. Service Connections securely store credentials (to Azure, ACR, Kubernetes) so pipelines authenticate without embedding secrets.",
      keyConcepts: [
        { label: "Multi-Stage YAML Pipelines", desc: "A pipeline is defined in azure-pipelines.yml with stages (Build -> Test -> DeployStaging -> DeployProd). Stages run sequentially; each contains jobs (parallelizable) and steps. The whole pipeline is version-controlled alongside the code." },
        { label: "Service Connections", desc: "A Service Connection is a stored, RBAC-scoped credential (Azure Resource Manager via Service Principal/Workload Identity, Docker Registry for ACR, Kubernetes). Pipelines reference it by name — secrets never appear in YAML, and access is auditable/revocable centrally." },
        { label: "Templates & Variable Groups", desc: "YAML templates (extends/template) let you standardize pipeline stages across many repos. Variable Groups (linked to Key Vault) supply environment-specific config/secrets to pipelines without hardcoding." }
      ]
    },
    realWorld: {
      title: "Jio Platforms - 4-Stage Production Pipeline",
      description: "The build -> test -> staging -> prod pipeline gating every Jio service",
      intro: "Every Jio microservice ships via a 4-stage Azure Pipeline: Build (docker build + push to ACR), Test (unit + integration + Trivy scan), Deploy-Staging (auto-deploy to the staging AKS cluster + smoke tests), and Deploy-Prod (gated by a manual approval Environment check). Service Connections authenticate to Azure and AKS via Workload Identity; secrets come from a Variable Group linked to Key Vault.",
      points: [
        "Stage Gating: Deploy-Prod runs only after staging smoke tests pass AND a release manager approves the 'Production' Environment check in Azure DevOps.",
        "Workload Identity Service Connection: The ARM Service Connection uses Workload Identity Federation (no client secret) scoped to the specific subscription/RG.",
        "Key Vault-Linked Variable Group: DB connection strings and API keys come from a Variable Group backed by Key Vault — rotated centrally, never in YAML.",
        "Pipeline Templates: A shared template repo defines the canonical build/scan/deploy stages; each service's azure-pipelines.yml just 'extends' it with parameters, ensuring consistency across 200 services."
      ],
      shortcut: "AWS CodePipeline == Azure Pipelines | AWS CodeCommit == Azure Repos | AWS CodePipeline IAM role / source action creds == Azure DevOps Service Connection"
    },
    interview: [
      { q: "Describe the structure of a multi-stage YAML pipeline in Azure Pipelines.", a: "It's defined in azure-pipelines.yml with a stages: list. Each stage (e.g., Build, Test, DeployStaging, DeployProd) runs sequentially and contains jobs: (which can run in parallel on agents), and each job contains steps: (sequential tasks/scripts). Stages can declare dependsOn and conditions, and deployment stages use 'environments' for approval gates. The entire pipeline is version-controlled with the code, enabling pipeline-as-code review." },
      { q: "What is a Service Connection and why is it more secure than putting credentials in YAML?", a: "A Service Connection is a centrally-managed, RBAC-scoped credential stored in Azure DevOps (e.g., an ARM connection via Service Principal/Workload Identity, an ACR Docker connection, a Kubernetes connection). Pipelines reference it BY NAME — the actual secret never appears in YAML, logs, or the repo. It can be scoped to specific resources, shared across pipelines with permission checks, audited, and revoked in one place — versus hardcoded secrets that leak in source control and are painful to rotate." },
      { q: "How do you implement a manual approval gate before deploying to production in Azure Pipelines?", a: "Use an Environment (e.g., 'Production') with an Approvals & Checks configuration requiring designated approvers. A deployment job targeting that environment (environment: Production) pauses and waits for approval before executing. You can add additional checks: business hours windows, required Azure Monitor health, or a mandatory wait timer — combining human approval with automated gates." },
      { q: "What's the benefit of pipeline templates and how do they work?", a: "Templates let you define common pipeline logic ONCE (build, scan, deploy stages) in a shared YAML file/repo and reuse it across many service pipelines via extends: or template: references with parameters. Benefit: consistency and governance — security scans and deployment patterns are enforced uniformly across 200 services, and a fix to the template propagates everywhere, instead of 200 teams maintaining divergent copy-pasted pipelines." },
      { q: "How would you supply secrets (DB passwords, API keys) to a pipeline without hardcoding them?", a: "Use a Variable Group linked to Azure Key Vault: the Variable Group fetches secrets at runtime from Key Vault (the pipeline's Service Connection identity has Key Vault 'get' permission), exposing them as pipeline variables that are masked in logs. Secrets are managed/rotated in Key Vault centrally; the pipeline YAML only references variable names. For deploy-time secret injection into AKS, the Key Vault CSI driver is preferred over passing through the pipeline at all." },
      { q: "Self-hosted vs Microsoft-hosted agents — when would Jio use self-hosted?", a: "Microsoft-hosted agents are clean, ephemeral VMs Microsoft manages — zero maintenance but limited customization, capped concurrency, and no private-network access. Self-hosted agents (running on Jio's own VMs/AKS, often as scale-set agents) are needed when: builds must reach private resources (private ACR/DB behind a firewall, on-prem systems), require specialized/cached tooling or large dependency caches, demand higher concurrency than hosted limits, or must meet data-residency/compliance requirements keeping build infra inside Jio's network." }
    ]
  },
  "17": {
    id: "17",
    title: "Release Management & Gates",
    subtitle: "CI/CD & Automation",
    description: "Environments, approval gates, and rollback strategies.",
    theory: {
      title: "Release Management & Gates Theory",
      description: "Controlling how, when, and to whom software is released — with progressive delivery, automated quality gates, and safe rollback.",
      whatIsIt: "Release management governs the promotion of a build through environments (dev -> staging -> prod) with approval and automated gates between them. Progressive delivery strategies (blue-green, canary, rolling) reduce blast radius, and rollback strategies ensure a bad release can be reverted quickly and safely.",
      keyConcepts: [
        { label: "Deployment Strategies", desc: "Blue-Green: two identical environments; switch traffic instantly, instant rollback by switching back. Canary: route a small % of traffic to the new version, increase gradually while monitoring. Rolling: replace instances incrementally (default for K8s Deployments)." },
        { label: "Approval & Automated Gates", desc: "Approval gates = human sign-off (release manager). Automated gates = machine checks before/after deploy: query Azure Monitor for error-rate thresholds, check no active incidents, validate a change ticket — the pipeline proceeds only if gates pass." },
        { label: "Rollback Strategies", desc: "Fast rollback options: blue-green traffic switch (instant), `kubectl rollout undo` (revert to previous ReplicaSet), redeploy a previous immutable image tag (git SHA), or feature-flag kill-switch (disable a feature without redeploying)." }
      ]
    },
    realWorld: {
      title: "Jio Platforms - Progressive Delivery for Payments",
      description: "How JioFinance ships payment changes with canary + automated rollback",
      intro: "JioFinance releases the payment-service via canary: a new version receives 5% of traffic while Azure Monitor gates watch error rate and p99 latency for 15 minutes. If error rate stays < 0.1%, the canary auto-promotes in steps (5% -> 25% -> 50% -> 100%); if a gate trips, the pipeline auto-rolls back by shifting traffic to the stable version and pages the on-call SRE. Production deploys also require a release-manager approval and a 'no active P1 incident' automated gate.",
      points: [
        "Canary with Monitor Gates: 5% traffic first; an automated gate queries Log Analytics for error-rate/latency thresholds before each promotion step.",
        "Auto-Rollback: A failed gate triggers an automatic traffic shift back to the last-known-good version and an alert to the on-call rotation — no human needed to stop the bleed.",
        "'No Active Incident' Gate: The prod stage queries the incident system; if a P1 is open, the deploy is blocked to avoid changing prod during an active outage.",
        "Immutable Tag Rollback: Every release is an immutable git-SHA image, so rollback is just redeploying the prior SHA — deterministic and instant."
      ],
      shortcut: "AWS CodeDeploy blue/green & canary == Azure Pipelines deployment strategies / AKS canary | AWS CloudWatch alarms as deploy gates == Azure Monitor query gates"
    },
    interview: [
      { q: "Compare blue-green, canary, and rolling deployments.", a: "Blue-Green: maintain two full environments; deploy to the idle one, then switch ALL traffic at once — instant cutover and instant rollback (switch back), but needs double the resources. Canary: route a SMALL % of traffic to the new version and increase gradually while monitoring — limits blast radius, great for risky changes, but more complex routing. Rolling: incrementally replace old instances with new (K8s default) — no extra resources, but during the roll both versions serve traffic and rollback is slower. Choose canary for high-risk/high-traffic services, blue-green when instant rollback is paramount, rolling for routine low-risk updates." },
      { q: "What is an automated gate and give an example of one that protects production.", a: "An automated gate is a machine-evaluated condition the pipeline checks before/after a deployment proceeds — no human involved. Example: after deploying a canary, query Azure Monitor/Log Analytics for the new version's error rate over 10 minutes; if it exceeds 0.1%, the gate FAILS and blocks promotion (and can trigger rollback). Other examples: 'no open P1 incident', 'within change window', 'security scan passed' — they turn release safety into enforced, repeatable checks rather than relying on someone remembering to look." },
      { q: "Describe a fast rollback strategy for a Kubernetes-based service.", a: "Several layered options: (1) `kubectl rollout undo deployment/<name>` reverts to the previous ReplicaSet immediately. (2) Redeploy the previous immutable image tag (git SHA) — deterministic. (3) For blue-green, switch the Service/Ingress back to the stable version's pods instantly. (4) Feature-flag kill-switch to disable the bad code path without any redeploy. The key enabler is immutable image tags and keeping the previous version readily available — never depending on rebuilding to roll back." },
      { q: "Why is deploying during an active P1 incident risky, and how do you prevent it programmatically?", a: "Deploying during an active incident introduces a new variable that complicates root-cause analysis (was it the incident or the deploy?), can worsen the outage, and competes for the on-call team's attention. Prevent it with an automated gate that queries the incident management system's API before the prod stage — if any P1/P2 is open, the gate fails and the deploy is blocked until incidents clear (with a documented break-glass override for emergency hotfixes that ARE the fix)." },
      { q: "How does a feature flag complement deployment strategies for safe releases?", a: "Feature flags DECOUPLE deployment from release: code ships to production disabled behind a flag, so deploying carries no behavioral risk. You then 'release' by toggling the flag on — optionally for a small % of users (a canary at the application layer), and instantly 'roll back' the FEATURE by flipping the flag off without any redeploy. This lets teams merge/deploy continuously (trunk-based) while controlling exposure of incomplete or risky functionality independently." },
      { q: "Design the gate sequence for promoting a build from staging to production.", a: "1) Automated gate: staging smoke/integration tests all green. 2) Automated gate: security scan (Trivy) passed on the exact image being promoted. 3) Automated gate: 'no active P1 incident' + 'within approved change window'. 4) Human approval gate: release manager sign-off with linked change ticket. 5) Deploy as canary to prod (5%) with a post-deploy Azure Monitor gate on error rate/latency before full promotion. This chains automated safety checks with a human accountability checkpoint and progressive exposure." }
    ]
  },
  "18": {
    id: "18",
    title: "Terraform Basics & State",
    subtitle: "Infrastructure as Code",
    description: "Providers, resources, variables, and remote state in Blob.",
    theory: {
      title: "Terraform Basics & State Theory",
      description: "Declarative infrastructure provisioning with HashiCorp Terraform, and the critical role of state in tracking real-world resources.",
      whatIsIt: "Terraform is a cloud-agnostic IaC tool where you declare desired infrastructure in HCL (.tf files); Terraform computes the difference from current state and applies changes. The STATE file maps your config to real Azure resources — storing it remotely (Azure Blob) with locking is essential for team collaboration.",
      keyConcepts: [
        { label: "Providers, Resources, Variables", desc: "A provider (azurerm) is the plugin that talks to Azure's API. A resource block declares an object (azurerm_resource_group). Variables parameterize configs; outputs expose values. `terraform plan` previews changes; `terraform apply` executes them." },
        { label: "State File & Remote Backend", desc: "terraform.tfstate records the real IDs/attributes of managed resources. NEVER keep it local for teams — store it in an Azure Storage Blob backend with state LOCKING (via blob lease) so two engineers can't apply simultaneously and corrupt it. State can contain secrets, so the storage account must be access-controlled and encrypted." },
        { label: "Plan/Apply Lifecycle & Drift", desc: "Terraform compares desired config vs state vs real infrastructure. 'Drift' is when someone changes a resource manually in the portal — `terraform plan` detects it and proposes reverting to code. This is why all changes should go through Terraform, not the portal." }
      ]
    },
    realWorld: {
      title: "Jio Platforms - Terraform-Managed Landing Zones",
      description: "How Jio provisions all Azure infra as code with locked remote state",
      intro: "Jio's entire Azure landing zone (VNets, AKS, ACR, Key Vault, PostgreSQL) is defined in Terraform. State for each environment lives in a dedicated Azure Storage Blob container with state locking via blob lease, so concurrent pipeline runs can't corrupt it. A pipeline runs `terraform plan` on every PR (posting the plan as a comment for review) and `terraform apply` only after merge to main, with tfsec scanning the code for misconfigurations first.",
      points: [
        "Remote State in Blob: backend 'azurerm' points at a locked-down storage account (private endpoint, RBAC, encryption) — separate container per environment (prod/staging/dev).",
        "State Locking: Azure Blob lease prevents two simultaneous applies; a stale lock from a crashed run is cleared with `terraform force-unlock` only after verifying no apply is in flight.",
        "Plan-on-PR Gate: CI posts the `terraform plan` output to the PR so reviewers see exactly what infra changes before approving — apply happens post-merge.",
        "Drift Detection: A scheduled `terraform plan` flags any manual portal changes (drift) and alerts the platform team to bring resources back under code control."
      ],
      shortcut: "AWS CloudFormation == Azure native is ARM/Bicep, but Terraform is cloud-agnostic and works on both | AWS S3 + DynamoDB state backend == Azure Blob backend with lease-based locking"
    },
    interview: [
      { q: "What is the Terraform state file and why must it be stored remotely for teams?", a: "The state file (terraform.tfstate) is Terraform's record mapping your HCL config to the actual resource IDs/attributes in Azure — it's how Terraform knows what it manages and computes diffs. For teams it MUST be remote (Azure Blob backend) because: (1) everyone needs the same source of truth, (2) state LOCKING prevents two people applying at once and corrupting it, and (3) it often contains sensitive values, so it belongs in an access-controlled, encrypted backend — not a laptop or git." },
      { q: "What is state locking and what problem does it prevent?", a: "State locking ensures only one `terraform apply` can modify the state at a time. With the Azure Blob backend, Terraform acquires a blob LEASE before writing state. Without locking, two concurrent applies (e.g., two pipeline runs) could read the same state, make conflicting changes, and write back — corrupting state so Terraform loses track of resources (orphaning or duplicating them). Locking serializes mutations to keep state consistent." },
      { q: "What is configuration drift and how does Terraform handle it?", a: "Drift is when real infrastructure diverges from the Terraform code — typically because someone changed a resource manually in the Azure Portal/CLI. On the next `terraform plan`, Terraform refreshes state, detects the difference between code (desired) and reality, and proposes changes to bring reality BACK to match the code. The discipline is to make ALL changes through Terraform; drift detection (scheduled plans) surfaces out-of-band changes for the team to reconcile." },
      { q: "Explain the difference between terraform plan and terraform apply, and why plan matters in CI.", a: "`terraform plan` computes and DISPLAYS the changes Terraform would make (create/update/destroy) without changing anything — a dry run. `terraform apply` actually executes those changes. In CI, running plan on a PR and surfacing its output lets reviewers SEE the exact infrastructure impact (especially destructive changes like a resource replacement) before approving — preventing surprise deletions. Apply runs only after merge, ideally against the saved plan file for determinism." },
      { q: "A terraform apply was interrupted and now state is locked. How do you safely resolve it?", a: "First, confirm NO apply is actually still running (check the pipeline/other engineers) — force-unlocking during a live apply causes corruption. Once certain it's a stale lock from a crashed run, run `terraform force-unlock <LOCK_ID>` (the ID is shown in the error). Then run `terraform plan` to verify state integrity before re-applying. The caution is critical: force-unlock is safe only when you're sure the lock is orphaned." },
      { q: "How do you prevent secrets in Terraform state from being exposed?", a: "State can contain secrets (DB passwords, generated keys) in plaintext. Mitigations: (1) store state in an Azure Storage account with encryption-at-rest, private endpoint, and tight RBAC so only the pipeline identity and platform admins can read it; (2) avoid putting secrets in Terraform at all — reference Key Vault secrets at runtime via data sources or have apps fetch them via the CSI driver; (3) mark variables 'sensitive' to keep them out of plan/apply logs; (4) never commit state or .tfvars with secrets to git." }
    ]
  },
  "19": {
    id: "19",
    title: "Terraform Modules & Workspaces",
    subtitle: "Infrastructure as Code",
    description: "Reusable components, versioning, and environment separation.",
    theory: {
      title: "Terraform Modules & Workspaces Theory",
      description: "Scaling Terraform across teams and environments with reusable modules and isolated state per environment.",
      whatIsIt: "A Terraform module is a reusable, versioned package of .tf files (e.g., a 'standard AKS cluster' module) consumed by many configs via a module block. Workspaces (or, more commonly at scale, separate state files per environment) isolate state so dev/staging/prod don't collide. Together they enable DRY, governed, multi-environment IaC.",
      keyConcepts: [
        { label: "Modules & Versioning", desc: "A module encapsulates a set of resources with input variables and outputs. Published to a private registry or git tag and pinned by version (source + version) so consumers get reproducible, reviewed infra. Root module calls child modules — DON'T copy-paste resource blocks across environments." },
        { label: "Workspaces vs Directory-per-Env", desc: "Workspaces give multiple state files from ONE config (terraform workspace select prod) — simple but easy to mis-target. Many teams instead use a directory + tfvars per environment (environments/prod.tfvars) with separate backends — more explicit isolation, harder to accidentally apply prod from a dev context." },
        { label: "DRY with tfvars", desc: "The same module/config is instantiated per environment with different variable values (environments/dev.tfvars vs prod.tfvars) — node counts, SKUs, regions differ, but the logic is identical and reviewed once." }
      ]
    },
    realWorld: {
      title: "Jio Platforms - Reusable AKS & Network Modules",
      description: "How Jio standardizes infra via versioned internal modules",
      intro: "Jio's platform team publishes versioned internal Terraform modules (terraform-azurerm-aks, terraform-azurerm-hubspoke) to a private registry. Application teams consume them by pinning a version, so every AKS cluster is provisioned with the same hardened defaults (private API server, Azure CNI, Defender enabled). Each environment has its own state and tfvars (dev.tfvars: 2 nodes; prod.tfvars: 30 nodes), and module upgrades are rolled out via PRs that bump the pinned version.",
      points: [
        "Versioned Internal Modules: terraform-azurerm-aks v2.3.0 encodes Jio's security baseline; teams pin the version, getting consistent, reviewed clusters.",
        "Environment Separation: Separate backends + dev.tfvars/staging.tfvars/prod.tfvars — same module code, different node counts/SKUs/regions, preventing cross-env state collisions.",
        "Governed Upgrades: A new module version (e.g., enabling a new security feature) is adopted by each team via a PR bumping 'version =', reviewed and rolled out progressively.",
        "Outputs for Composition: The network module outputs subnet IDs that the AKS module consumes — composing infrastructure cleanly instead of hardcoding IDs."
      ],
      shortcut: "AWS CloudFormation nested stacks / Service Catalog == Terraform modules | Terraform workspaces have no exact AWS-native analog — it's a Terraform construct usable on any cloud"
    },
    interview: [
      { q: "What is a Terraform module and why use one instead of copy-pasting resource blocks?", a: "A module is a reusable, parameterized package of Terraform resources (e.g., a 'standard AKS cluster'). Using modules instead of copy-paste gives: consistency (every team gets the same hardened config), DRY (fix/improve once, all consumers benefit on version bump), governance (the module encodes reviewed security defaults), and composability (outputs feed other modules). Copy-pasted blocks drift apart over time and each copy must be patched individually — a maintenance and security nightmare at scale." },
      { q: "Why pin module versions, and what happens if you don't?", a: "Pinning (version = \"2.3.0\" or a git tag) makes infra reproducible — every apply uses the exact same module code, so plans are deterministic and reviewed. Without pinning, a consumer could silently pull a newer module version that changes/replaces resources unexpectedly, causing surprise diffs or even destructive changes on the next apply. Pinning + deliberate version bumps via PR keeps upgrades intentional and reviewable." },
      { q: "Compare Terraform workspaces with a directory-per-environment approach.", a: "Workspaces use ONE config with multiple named state files (terraform workspace select prod) — DRY but risky: it's easy to forget which workspace is active and apply prod changes thinking you're in dev, and all environments share the same backend config. Directory-per-environment (environments/prod with its own backend + prod.tfvars) makes the target explicit, isolates state/backends fully, and allows per-env differences in backend config — most enterprises prefer it for production isolation despite slightly more structure." },
      { q: "How do you provide different values (node count, SKU) per environment while reusing the same module?", a: "Parameterize the module with input variables and supply environment-specific values via tfvars files: dev.tfvars (node_count = 2, sku = Standard_D2s_v3) vs prod.tfvars (node_count = 30, sku = Standard_D4s_v5). Run `terraform apply -var-file=environments/prod.tfvars`. The MODULE/logic is identical and reviewed once; only the values differ — achieving DRY across environments while honoring their different sizing/cost needs." },
      { q: "How do modules compose — e.g., an AKS module needing a subnet from a network module?", a: "The network module declares an OUTPUT (output \"aks_subnet_id\"). The root config passes that output as an INPUT to the AKS module: module.aks's subnet_id = module.network.aks_subnet_id. Terraform's dependency graph ensures the network module applies first, then feeds its real subnet ID into the AKS module — composing infrastructure declaratively without hardcoding IDs or running separate applies in a fragile order." },
      { q: "Your team wants to roll out a new module version that adds a security feature, across 50 services, safely. How?", a: "Release the new module version (e.g., 2.4.0) and validate it in a non-prod consumer first. Then roll out progressively: open PRs bumping 'version =' for batches of services, each running `terraform plan` so reviewers see exactly what the new version changes (ideally non-destructive/additive). Stagger prod applies, monitor, and keep the ability to revert the version pin if an issue appears. This treats infra upgrades like code releases — versioned, reviewed, progressive — rather than a risky big-bang change." }
    ]
  },
  "20": {
    id: "20",
    title: "Bicep & ARM Templates",
    subtitle: "Infrastructure as Code",
    description: "Declarative Infrastructure Automation using Microsoft's DSL.",
    theory: {
      title: "Bicep & ARM Templates Theory",
      description: "Azure's native IaC: ARM JSON templates and the cleaner Bicep DSL that compiles to ARM, with deployment scopes and modules.",
      whatIsIt: "ARM templates are Azure's native JSON-based IaC. Bicep is a cleaner domain-specific language that transpiles to ARM JSON — more readable, with modules, type safety, and no state file to manage (Azure Resource Manager tracks deployment state server-side). Bicep is Azure-only, versus Terraform's multi-cloud reach.",
      keyConcepts: [
        { label: "Bicep vs ARM JSON", desc: "Bicep is concise (no verbose JSON, automatic dependency inference) and compiles 1:1 to ARM. `bicep build` produces ARM JSON; `az deployment group create` deploys it. Bicep has IntelliSense, modules, and loops — ARM JSON is what Azure actually executes underneath." },
        { label: "No State File / Idempotency", desc: "Unlike Terraform, Bicep/ARM has NO local state — Azure Resource Manager itself is the source of truth. Deployments are idempotent: re-deploying the same template converges resources to the declared state. Drift handling differs from Terraform (no `plan` against a state file; use what-if)." },
        { label: "Deployment Scopes & What-If", desc: "Deployments target a scope: resourceGroup, subscription, managementGroup, or tenant. `az deployment group what-if` previews changes (Bicep's equivalent of terraform plan). Modules (Bicep) enable reuse across templates." }
      ]
    },
    realWorld: {
      title: "Jio Platforms - Bicep for Azure-Native Resources",
      description: "Where Jio chooses Bicep over Terraform and why",
      intro: "While Jio uses Terraform for cross-cutting landing zones, some Azure-native teams use Bicep for resources that benefit from immediate same-day support of new Azure features (Bicep gets new resource types on launch day, sometimes ahead of the azurerm provider). Bicep deployments run via `az deployment group what-if` in PR pipelines (preview), then deploy on merge — with no state file to secure, simplifying the security model for those teams.",
      points: [
        "Day-One Feature Support: Bicep supports new Azure resource properties immediately at GA, useful for teams adopting brand-new Azure services before the Terraform provider catches up.",
        "What-If in CI: `az deployment group what-if` posts the predicted changes to the PR — the Bicep analog of terraform plan — for reviewer sign-off.",
        "No State to Secure: ARM tracks deployment state server-side, so there's no tfstate file/backend to lock down — one less sensitive artifact to protect for these teams.",
        "Modules for Reuse: Shared Bicep modules (e.g., a storage-account module with Jio's encryption/private-endpoint defaults) are referenced across templates, mirroring the Terraform module approach."
      ],
      shortcut: "AWS CloudFormation (JSON/YAML) == Azure ARM templates (JSON) | AWS CDK / SAM (higher-level DSL) == Azure Bicep | CloudFormation change sets == Bicep/ARM what-if"
    },
    interview: [
      { q: "What is Bicep and how does it relate to ARM templates?", a: "Bicep is a declarative domain-specific language for Azure IaC that's far more readable than ARM JSON (no verbose syntax, automatic dependency inference, modules, type checking). It TRANSPILES to ARM JSON — `bicep build` produces the ARM template Azure Resource Manager actually executes. So Bicep is a friendlier authoring layer; ARM JSON is the underlying execution format. Anything ARM can do, Bicep can express more concisely." },
      { q: "Bicep/ARM has no state file — how is that different from Terraform, and what are the implications?", a: "Terraform keeps a state file mapping config to resources (which you must store and lock remotely). Bicep/ARM relies on Azure Resource Manager itself as the source of truth — no state file to manage, secure, or lock. Implications: one less sensitive artifact and no state-corruption/locking concerns, but you lose Terraform's explicit state-based `plan` (you use `what-if` instead), and drift management/imports work differently. Also Bicep is Azure-ONLY, while Terraform is multi-cloud." },
      { q: "What is the 'what-if' operation and why is it important?", a: "`az deployment group what-if` previews the changes a Bicep/ARM deployment WOULD make (create/modify/delete/no-change) without applying them — the Bicep equivalent of `terraform plan`. It's important for the same reason: reviewers and pipelines can see the exact impact (especially destructive changes) before deploying to production, catching surprises like a property change that forces resource recreation." },
      { q: "When would you choose Bicep over Terraform (and vice versa)?", a: "Choose Bicep when: you're Azure-only, want day-one support for brand-new Azure features (Bicep often supports them before the azurerm provider), prefer no state file to manage, and want the deepest native ARM integration. Choose Terraform when: you're multi-cloud or hybrid (AWS + Azure + SaaS providers), want a mature module ecosystem and consistent tooling across clouds, or your org has standardized on Terraform's workflow/state model. Many enterprises use both — Terraform for cross-cloud landing zones, Bicep for some Azure-native teams." },
      { q: "What are deployment scopes in ARM/Bicep and give an example of each.", a: "Scope determines WHERE resources are deployed: resourceGroup scope (most common — VMs, storage in an RG), subscription scope (create resource groups, assign policies/RBAC at subscription level), managementGroup scope (policies/RBAC across many subscriptions), and tenant scope (tenant-wide management groups). You set targetScope in Bicep and use the matching `az deployment <scope> create` command — e.g., a subscription-scoped Bicep file that creates RGs and assigns a security policy across them." },
      { q: "How does Bicep handle dependencies between resources, and how does that differ from ARM JSON?", a: "Bicep INFERS dependencies automatically: when one resource references another's property (e.g., a VM referencing a NIC's id via nic.id), Bicep adds the implicit dependency so ARM provisions them in the right order — no manual declaration needed. In raw ARM JSON, you often had to add explicit dependsOn arrays listing resource names, which was verbose and error-prone. Bicep's symbolic references make dependency management cleaner and less bug-prone, only needing explicit dependsOn for rare cases with no property reference." }
    ]
  },
  "21": {
    id: "21",
    title: "Entra ID & RBAC",
    subtitle: "Security & Identity",
    description: "Managed identities, custom roles, and PIM.",
    theory: {
      title: "Entra ID & RBAC Theory",
      description: "Azure's identity backbone and its role-based access control model for least-privilege, auditable access to resources.",
      whatIsIt: "Microsoft Entra ID (formerly Azure AD) is Azure's cloud identity provider — it authenticates users, groups, and workload identities. Azure RBAC authorizes WHAT an identity can do, by assigning roles (collections of permissions) at a scope (management group / subscription / RG / resource). Managed Identities give Azure resources their own identity with no secrets.",
      keyConcepts: [
        { label: "RBAC: Role + Scope + Assignment", desc: "An assignment = WHO (user/group/service principal/managed identity) + WHAT (role like Reader/Contributor/Owner or a custom role) + WHERE (scope). Roles inherit DOWN the hierarchy — Contributor at a subscription applies to all RGs/resources under it. Prefer assigning to GROUPS, not individuals." },
        { label: "Managed Identities", desc: "System-assigned (tied to one resource's lifecycle) or User-assigned (standalone, shareable across resources). A VM/AKS/Function uses its managed identity to authenticate to Key Vault, ACR, Storage — NO secrets stored. This is the password-less foundation for the whole platform." },
        { label: "PIM (Privileged Identity Management)", desc: "PIM makes high-privilege roles (Owner, User Access Administrator) JUST-IN-TIME and time-bound: an admin 'activates' the role for a few hours with MFA + justification + optional approval, instead of holding standing access. Drastically reduces the attack surface of privileged accounts." }
      ]
    },
    realWorld: {
      title: "Jio Platforms - Least-Privilege & JIT Access",
      description: "How Jio governs access for hundreds of engineers and workloads",
      intro: "At Jio, engineers get access via Entra ID GROUPS mapped to RBAC roles scoped to specific resource groups (e.g., 'jiomart-prod-operators' group = Reader on rg-jiomart-prod, Contributor on a dedicated ops RG). Standing Owner/admin access is eliminated — privileged roles are activated just-in-time via PIM with MFA and manager approval for max 4 hours. All workloads (AKS, Functions) authenticate via managed identities; the platform mandate is zero stored secrets.",
      points: [
        "Group-Based RBAC: Access is assigned to Entra groups, not individuals — onboarding/offboarding is a group membership change, fully auditable, no orphaned permissions.",
        "Custom Roles for Least Privilege: A custom 'AKS Operator' role grants only the specific Microsoft.ContainerService actions needed — not broad Contributor — limiting blast radius.",
        "PIM for Privileged Roles: Owner and User Access Administrator are PIM-eligible only — activated JIT with MFA + approval + 4-hour expiry, so no one holds permanent god-mode.",
        "Managed Identities Everywhere: AKS kubelet identity for ACR pulls, Function system-assigned identity for Key Vault — the platform policy forbids client secrets in code/config."
      ],
      shortcut: "AWS IAM Users/Roles == Entra ID identities + Azure RBAC roles | AWS IAM Instance Profile == Azure Managed Identity | AWS IAM permission boundaries / SCPs == Azure custom roles + Policy | no direct AWS PIM equivalent (closest: IAM temporary credentials/role assumption)"
    },
    interview: [
      { q: "Explain the three components of an Azure RBAC assignment.", a: "Every RBAC assignment has: (1) WHO — the security principal (user, group, service principal, or managed identity); (2) WHAT — the role definition, a set of allowed actions (built-in like Reader/Contributor/Owner, or a custom role); and (3) WHERE — the scope (management group, subscription, resource group, or individual resource). Permissions INHERIT downward, so Contributor at a subscription applies to everything beneath it. Best practice: assign roles to GROUPS at the narrowest scope that meets the need." },
      { q: "What's the difference between a system-assigned and a user-assigned managed identity?", a: "A system-assigned managed identity is created with and tied to the lifecycle of ONE resource (e.g., a VM) — deleted automatically when that resource is deleted, and not shareable. A user-assigned managed identity is a standalone Azure resource you create independently and can attach to MULTIPLE resources, surviving any single resource's deletion. Use user-assigned when several resources need the SAME identity/permissions (e.g., a fleet of Functions sharing Key Vault access) or when you want the identity to outlive a resource; system-assigned for simple 1:1 cases." },
      { q: "Why are managed identities preferred over service principals with secrets?", a: "Managed identities have NO credentials you manage — Azure handles token issuance and rotation automatically, so there's no client secret to store, leak, or rotate. A service principal with a client secret requires you to securely store that secret (Key Vault), rotate it before expiry, and risk exposure if it leaks. Managed identities eliminate the entire secret-management lifecycle for Azure-resource-to-Azure-resource auth, which is why they're the platform standard for AKS->ACR, Function->Key Vault, etc." },
      { q: "What problem does PIM (Privileged Identity Management) solve?", a: "PIM eliminates STANDING privileged access. Instead of admins permanently holding Owner/User Access Administrator (a huge attack surface — one compromised account = total control), PIM makes those roles 'eligible': the admin must ACTIVATE the role just-in-time, with MFA, a justification, optional approval, and a time limit (e.g., 4 hours, then auto-revoked). This means privileged permissions exist only briefly when actually needed and every activation is logged — drastically shrinking the window an attacker could exploit a privileged identity." },
      { q: "When would you create a custom RBAC role instead of using a built-in one?", a: "When built-in roles don't fit least-privilege — typically the gap is between Reader (too little) and Contributor (too much). For example, an 'AKS Operator' who should manage clusters but NOT create networking or delete resource groups: a custom role grants exactly the needed Microsoft.ContainerService/* actions and nothing else. Custom roles let you encode precise job functions, reducing blast radius versus handing out broad Contributor/Owner that includes permissions the person never needs." },
      { q: "An AKS pod needs to read a secret from Key Vault. Walk through the password-less identity flow.", a: "Use Workload Identity (or the CSI driver with a managed identity): the AKS cluster has OIDC issuer enabled; a Kubernetes ServiceAccount is federated to a user-assigned managed identity. That managed identity is granted a Key Vault access policy / 'Key Vault Secrets User' RBAC role on the vault. The pod, running under that ServiceAccount, receives a federated token, exchanges it with Entra ID for a managed-identity token, and calls Key Vault — all with NO secret stored in the pod, cluster, or code. Access is scoped to just that vault and auditable per identity." }
    ]
  },
  "22": {
    id: "22",
    title: "Key Vault & CSI Driver",
    subtitle: "Security & Identity",
    description: "Secrets injection without env vars.",
    theory: {
      title: "Key Vault & CSI Driver Theory",
      description: "Centralized secret/key/certificate management and how to surface secrets into Kubernetes pods without baking them into images or env vars.",
      whatIsIt: "Azure Key Vault is a managed service for storing secrets, encryption keys, and TLS certificates with access control, versioning, and audit logging. The Secrets Store CSI Driver mounts Key Vault secrets directly into pods as files (a volume), so applications read secrets from disk without them ever being stored in Kubernetes Secrets or environment variables.",
      keyConcepts: [
        { label: "Secrets, Keys & Certificates", desc: "Key Vault stores three object types: secrets (arbitrary strings — passwords, connection strings), keys (cryptographic keys for encryption/signing, optionally HSM-backed), and certificates (TLS certs with auto-renewal). Each is versioned and access is logged for audit/compliance." },
        { label: "CSI Driver Secret Mounting", desc: "The Secrets Store CSI Driver + Azure provider authenticates to Key Vault using the pod's workload/managed identity and mounts requested secrets as files into the pod's volume. Optionally syncs them to a native K8s Secret for env-var use — but file-mount avoids secrets sitting in etcd." },
        { label: "Access Policies vs RBAC + Rotation", desc: "Key Vault access is controlled via Access Policies (legacy) or Azure RBAC (recommended — 'Key Vault Secrets User' role). Secrets should be rotated; the CSI driver can auto-rotate mounted secrets on a poll interval so pods pick up new versions without redeploy." }
      ]
    },
    realWorld: {
      title: "Jio Platforms - Zero-Secret Pods via CSI Driver",
      description: "How JioMart pods get DB credentials without any stored secrets",
      intro: "JioMart's pods never contain secrets. The Secrets Store CSI Driver, authenticated via Workload Identity, mounts the PostgreSQL connection string and Redis password from Key Vault as files into each pod at /mnt/secrets. TLS certs for ingress are stored in Key Vault and auto-renewed. Access to the vault is RBAC-scoped ('Key Vault Secrets User' on specific identities), and every secret read is logged to Log Analytics for the security team's audit trail.",
      points: [
        "File-Mounted Secrets: CSI driver mounts secrets as files under /mnt/secrets — they never live in a Kubernetes Secret object in etcd, shrinking exposure.",
        "Workload Identity Auth: The pod's federated identity authenticates to Key Vault — no Key Vault credential or connection string stored anywhere in the cluster.",
        "Auto-Rotation: The CSI driver polls Key Vault and updates mounted secrets when a new version is published, so credential rotation needs no pod redeploy.",
        "Audited Access: Key Vault diagnostic logs every secret 'get' to Log Analytics — the security team can see exactly which identity read which secret and when."
      ],
      shortcut: "AWS Secrets Manager / Parameter Store == Azure Key Vault (secrets) | AWS KMS == Azure Key Vault (keys) | AWS Secrets Manager CSI / Secrets Store CSI == Azure Secrets Store CSI Driver | AWS ACM == Key Vault certificates"
    },
    interview: [
      { q: "What are the three object types Key Vault stores and a use case for each?", a: "Secrets — arbitrary sensitive strings like DB passwords, API keys, connection strings (apps fetch them at runtime). Keys — cryptographic keys for encryption/signing operations, optionally HSM-backed (e.g., customer-managed keys for storage/disk encryption, or signing JWTs). Certificates — TLS/SSL certs with lifecycle management and auto-renewal (e.g., the *.jiomart.com cert used by ingress). All three are versioned, access-controlled, and audit-logged." },
      { q: "How does the Secrets Store CSI Driver get a secret into a pod without storing it in a Kubernetes Secret?", a: "The CSI driver runs as a DaemonSet; when a pod mounts a SecretProviderClass volume, the driver authenticates to Key Vault using the pod's workload/managed identity, fetches the requested secrets, and mounts them as FILES into the pod's volume (e.g., /mnt/secrets/db-password). The app reads them from disk. Because they're mounted ephemerally per-pod, the secrets never need to exist as a Kubernetes Secret object in etcd (unless you explicitly enable secret sync for env-var use) — reducing the attack surface." },
      { q: "Why is mounting secrets as files via CSI often preferred over Kubernetes Secrets as env vars?", a: "(1) Native K8s Secrets are only base64-ENCODED (not encrypted) in etcd by default — anyone with etcd/API access can read them; CSI file mounts keep secrets out of etcd. (2) Env vars can leak via crash dumps, `kubectl describe`, child-process inheritance, and logging — files are less exposed. (3) CSI supports AUTO-ROTATION (re-mounting updated secret versions) so apps pick up rotated credentials without redeploy, whereas changing an env-var Secret requires a pod restart. The CSI/Key Vault approach centralizes management and audit too." },
      { q: "How should Key Vault access be controlled, and what's the modern recommendation?", a: "Two models: legacy Access Policies (per-vault list of identities + permitted operations) and Azure RBAC (recommended) — assign roles like 'Key Vault Secrets User' (read secrets) or 'Key Vault Administrator' at the vault scope. RBAC is preferred because it's consistent with the rest of Azure's access model, supports PIM/conditional access, scales better, and integrates with management-group-level governance. Grant the narrowest role to specific managed identities, not broad access." },
      { q: "How do you rotate a database password stored in Key Vault with minimal disruption?", a: "Add a NEW version of the secret in Key Vault (Key Vault versions secrets). With the CSI driver's auto-rotation enabled (a poll interval), pods pick up the new value on the next sync without redeploy; the app should re-read the secret file (or reconnect) on rotation. Ideally use dual-credential rotation: provision the new DB credential, publish it to Key Vault, let apps roll onto it, then retire the old credential — so there's no window where the live password is invalid. The whole rotation is centralized and audited in Key Vault, never touching code." },
      { q: "Why should you enable soft-delete and purge protection on a production Key Vault?", a: "Soft-delete retains deleted vaults/secrets for a recovery period instead of immediate permanent deletion — protecting against accidental or malicious deletion of critical secrets/keys (which could otherwise make encrypted data permanently unrecoverable). Purge protection goes further: it BLOCKS permanent purge even by admins until the retention period elapses, defeating an attacker (or mistake) that tries to delete-then-purge to destroy keys. For production vaults holding encryption keys, both are essential to avoid catastrophic, irreversible data loss." }
    ]
  },
  "23": {
    id: "23",
    title: "Azure Storage (Blobs, Files, Tiers)",
    subtitle: "Security & Identity",
    description: "Object storage, hot/cool/archive tiers, and SAS tokens.",
    theory: {
      title: "Azure Storage Theory",
      description: "Azure's foundational storage services — object (Blob), file shares, and the access tiers and secure access mechanisms that control cost and exposure.",
      whatIsIt: "An Azure Storage Account is a namespace containing Blob (object storage for unstructured data), Files (managed SMB/NFS shares), Queues, and Tables. Blob access tiers (Hot/Cool/Cold/Archive) trade storage cost against access cost/latency. SAS tokens and managed identities control secure, time-limited access.",
      keyConcepts: [
        { label: "Blob Access Tiers", desc: "Hot (frequent access, highest storage cost, lowest access cost), Cool (infrequent, ~30 days), Cold (~90 days), Archive (rare, cheapest storage but hours to rehydrate). Lifecycle management policies auto-transition blobs between tiers by age to optimize cost." },
        { label: "Redundancy Options", desc: "LRS (3 copies in one datacenter), ZRS (across 3 AZs in a region), GRS (replicated to a paired region), GZRS (zone + geo). Choose based on durability/availability needs vs cost — e.g., GZRS for critical data needing both zonal and regional protection." },
        { label: "SAS Tokens vs Managed Identity", desc: "A Shared Access Signature (SAS) is a time-limited, permission-scoped URL token granting access to specific blobs/containers without sharing account keys. For Azure-resource-to-Storage access, managed identity + RBAC ('Storage Blob Data Reader') is preferred over SAS/keys for the same password-less, auditable benefits." }
      ]
    },
    realWorld: {
      title: "Jio Platforms - Tiered Storage for Media & Logs",
      description: "How JioCinema and JioMart optimize petabyte-scale storage cost",
      intro: "JioCinema stores video assets in Blob storage with lifecycle policies: new releases stay Hot, content untouched for 30 days moves to Cool, and catalog rarely streamed for 180+ days moves to Archive — cutting storage cost dramatically at petabyte scale. Application logs land in Cool tier and auto-delete after 90 days. Customer downloads use short-lived SAS tokens (15-minute expiry, read-only, single blob) so URLs can't be shared or reused, while backend services access storage via managed identity + RBAC.",
      points: [
        "Lifecycle Tiering: Policy auto-moves blobs Hot -> Cool (30d) -> Archive (180d) by last-access, saving the majority of storage cost on cold catalog content.",
        "Scoped SAS for Downloads: Customer media URLs are SAS tokens — read-only, single-blob, 15-min expiry — so a leaked URL is useless after expiry and grants nothing else.",
        "Managed Identity for Services: Backend services use 'Storage Blob Data Contributor' via managed identity — no account keys in config, fully auditable.",
        "GZRS for Critical Data: Financial/transaction archives use GZRS (zone + geo redundant) to survive both an AZ failure and a regional disaster."
      ],
      shortcut: "AWS S3 == Azure Blob Storage | S3 Storage Classes (Standard/IA/Glacier) == Azure Blob tiers (Hot/Cool/Archive) | AWS EFS/FSx == Azure Files | S3 presigned URL == Azure SAS token"
    },
    interview: [
      { q: "Explain the Blob access tiers and how lifecycle policies use them to save cost.", a: "Hot: frequent access — highest storage cost, lowest access/transaction cost. Cool: infrequently accessed (~30+ days) — lower storage cost, higher access cost. Cold: ~90+ days. Archive: rarely accessed — cheapest storage but offline (hours to 'rehydrate' before reading). A lifecycle management policy automatically transitions blobs between tiers based on age or last-access (e.g., move to Cool after 30 days, Archive after 180, delete after 365) — so you don't pay Hot prices for data nobody touches, optimizing cost at scale without manual intervention." },
      { q: "Compare LRS, ZRS, GRS, and GZRS redundancy.", a: "LRS (Locally Redundant): 3 copies within a single datacenter — cheapest, survives disk/rack failure but not a datacenter/zone loss. ZRS (Zone Redundant): 3 copies across 3 Availability Zones in a region — survives a full zone outage. GRS (Geo Redundant): LRS + async replication to a paired region — survives a regional disaster (with failover). GZRS: ZRS + geo replication — survives both a zone failure AND a regional disaster. Choose based on the data's criticality vs cost: LRS for reproducible/dev data, ZRS/GZRS for production needing zonal/regional resilience." },
      { q: "What is a SAS token and why use it instead of the storage account key?", a: "A Shared Access Signature is a signed URL granting LIMITED, time-bound access to specific storage resources (a blob, container, or service) with specific permissions (read-only, write, list) and an expiry. Use it instead of the account key because the account KEY grants full control over the ENTIRE account and can't be scoped or easily revoked without rotating (which breaks everything using it). A SAS can be narrow (one blob, read-only, 15 min) so a leaked SAS causes minimal, time-limited damage — and you can revoke a whole class via a stored access policy." },
      { q: "For an Azure service accessing Storage, why prefer managed identity + RBAC over a SAS or account key?", a: "Managed identity + a data-plane RBAC role (e.g., 'Storage Blob Data Reader') means NO credential is stored anywhere — Azure issues/rotates tokens automatically, access is scoped per-identity to specific containers, every access is auditable in Entra/Storage logs, and you revoke by removing the role assignment. SAS tokens still must be generated/distributed and can leak; account keys are all-powerful and painful to rotate. For resource-to-resource access, managed identity is the secure, low-maintenance standard." },
      { q: "A blob in Archive tier needs to be read urgently. What happens and how long does it take?", a: "Archive is OFFLINE storage — you can't read a blob directly from it. You must first 'rehydrate' it by changing its tier to Hot or Cool, which can take HOURS (standard priority up to ~15 hours; high priority faster for smaller blobs but costs more). This latency is the trade-off for Archive's cheap storage. The lesson: only Archive data you're confident won't be needed quickly, and for time-sensitive retrieval keep it in Cool/Cold instead — or set high-priority rehydration if the cost is justified." },
      { q: "How would you design storage for an application with hot recent data and large cold historical data, minimizing cost?", a: "Use a single Blob container with a lifecycle management policy: keep recent data in Hot for fast access; auto-transition to Cool after ~30 days of no access (cheaper storage, still online), to Cold/Archive after ~90-180 days for rarely-touched historical data, and auto-delete past the retention requirement. Pair with appropriate redundancy (ZRS/GZRS for critical, LRS for reproducible). Access recent data via the app's managed identity, and if historical data must be served externally, generate scoped short-lived SAS URLs. This matches storage cost to actual access patterns automatically." }
    ]
  },
  "24": {
    id: "24",
    title: "Azure Monitor & Alerts",
    subtitle: "Observability & SRE",
    description: "Metrics, dynamic thresholds, and action groups.",
    theory: {
      title: "Azure Monitor & Alerts Theory",
      description: "Azure's unified observability platform for collecting metrics/logs and turning them into actionable alerts and automated responses.",
      whatIsIt: "Azure Monitor collects telemetry from across Azure — platform Metrics (numeric time-series like CPU, request count), Logs (into Log Analytics), and Application Insights (APM for apps). Alert rules evaluate metrics/log queries against thresholds and trigger Action Groups (notify/automate). It's the foundation of SRE practice on Azure.",
      keyConcepts: [
        { label: "Metrics vs Logs", desc: "Metrics are lightweight, pre-aggregated numeric time-series (1-minute granularity, cheap, fast) — ideal for dashboards/alerting on CPU, latency, request rate. Logs (Log Analytics) are rich, queryable event records (KQL) — for deep diagnostics, correlation, and complex conditions. Use metrics for fast alerting, logs for investigation." },
        { label: "Static vs Dynamic Thresholds", desc: "Static threshold: fixed value (CPU > 80%). Dynamic threshold: ML-based — Azure learns the metric's normal pattern (including daily/weekly seasonality) and alerts on anomalous deviation, avoiding the need to manually tune thresholds per service and reducing false positives for spiky workloads." },
        { label: "Action Groups & Automation", desc: "An Action Group is a reusable set of notifications/actions an alert triggers: email/SMS/push, Teams/Slack webhook, PagerDuty, an Azure Function or Logic App or Automation Runbook for auto-remediation (e.g., restart a service, scale out). Alerts -> Action Groups decouple 'what's wrong' from 'who/what responds'." }
      ]
    },
    realWorld: {
      title: "Jio Platforms - SLO-Based Alerting for JioMart",
      description: "How Jio alerts on symptoms (SLOs), not just raw infrastructure metrics",
      intro: "JioMart's SRE team alerts on user-facing SLOs, not noisy infra signals: an alert fires when the checkout API's error rate exceeds the error budget burn rate, or p99 latency breaches 800ms over 5 minutes. Dynamic thresholds handle the daily traffic seasonality (midnight sale spikes are 'normal'). Alerts route through Action Groups to PagerDuty for P1s and a Teams channel for warnings, with some triggering an Automation Runbook to auto-scale before paging a human.",
      points: [
        "Symptom-Based (SLO) Alerts: Alert on error rate / p99 latency (what users feel), not just CPU — reducing alert fatigue from infra noise that doesn't impact customers.",
        "Dynamic Thresholds for Seasonality: ML thresholds learn JioMart's daily/weekly pattern so predictable sale-time spikes don't false-alarm, while true anomalies still fire.",
        "Tiered Action Groups: P1 SLO breaches page on-call via PagerDuty; warnings post to Teams; both reference the same reusable Action Groups.",
        "Auto-Remediation First: Certain alerts trigger an Automation Runbook (scale out, restart) and only page a human if the condition persists — toil reduction."
      ],
      shortcut: "AWS CloudWatch Metrics == Azure Monitor Metrics | CloudWatch Logs == Log Analytics | CloudWatch Alarms == Azure Monitor Alert rules | SNS/EventBridge targets == Action Groups | CloudWatch Anomaly Detection == Dynamic Thresholds"
    },
    interview: [
      { q: "When should you alert on a metric versus a log query in Azure Monitor?", a: "Use METRIC alerts for fast, high-frequency signals that are pre-aggregated numeric time-series — CPU, memory, request count, latency — they evaluate in near-real-time (1-min granularity), are cheap, and are ideal for the bulk of your alerting. Use LOG (Log Analytics/KQL) alerts when the condition requires correlation, parsing, or logic that metrics can't express — e.g., 'more than 50 distinct users hit a 500 error from the same API version in 5 minutes'. Logs are richer but cost more and evaluate less frequently, so reserve them for conditions metrics can't capture." },
      { q: "What is a dynamic threshold and when is it better than a static one?", a: "A dynamic threshold uses machine learning to model a metric's normal behavior — including daily/weekly seasonality — and alerts when values deviate anomalously from that learned pattern. It's better than a static threshold for metrics with variable or seasonal baselines (e.g., traffic that's naturally 10x higher during a sale): a static '> 80% CPU' rule would either false-alarm during normal peaks or miss anomalies during troughs. Dynamic thresholds adapt automatically, reducing both false positives and manual per-service tuning. Static thresholds remain best for hard, absolute limits (e.g., disk > 95%)." },
      { q: "What is an Action Group and why decouple it from alert rules?", a: "An Action Group is a reusable collection of notification channels and automated actions (email/SMS/push, webhook to Teams/PagerDuty, trigger a Function/Logic App/Runbook). Alert rules reference Action Groups rather than embedding the response. Decoupling means you define 'notify the payments on-call + post to #payments-alerts + run the scale-out runbook' ONCE and reuse it across many alerts; changing the on-call routing is a single edit, not editing every alert rule. It cleanly separates 'what condition is wrong' (alert) from 'who/what responds' (action group)." },
      { q: "What does it mean to alert on symptoms/SLOs rather than infrastructure metrics, and why is it better?", a: "Symptom/SLO-based alerting fires on what USERS actually experience — error rate, latency, availability against an SLO/error budget — rather than on internal causes like high CPU or memory. It's better because: (1) it cuts alert fatigue (a CPU spike that doesn't hurt users shouldn't page anyone), (2) it catches problems regardless of cause (any root cause that breaks the SLO fires the alert), and (3) it aligns alerting with business impact. Infra metrics are still collected for DIAGNOSIS, but the paging alerts are tied to user-facing symptoms." },
      { q: "How can Azure Monitor reduce on-call toil through auto-remediation?", a: "Configure an alert's Action Group to trigger an automated action — an Azure Automation Runbook, Logic App, or Function — that performs the known fix before (or instead of) paging a human: e.g., scale out a VMSS/AKS node pool when latency rises, restart a wedged service, or clear a full disk. The human is paged only if auto-remediation doesn't resolve the condition within a window. This handles well-understood, repetitive incidents automatically, reserving human attention for novel problems and reducing 3 AM pages for things a script can fix." },
      { q: "Design an alerting strategy for a checkout API to balance coverage and alert fatigue.", a: "Tier it: (1) PAGING alerts on user-facing SLO breaches only — error rate above error-budget burn rate, p99 latency > target, availability drop — using dynamic thresholds to handle seasonality. (2) TICKET/WARNING alerts (Teams, non-paging) on leading indicators — rising 4xx, dependency latency creeping up — for proactive investigation. (3) Auto-remediation runbooks for known conditions (scale out) that only escalate to a page if unresolved. (4) Suppress/group correlated alerts so one outage doesn't fire 50 pages. The principle: page humans only for things that are urgent, actionable, and user-impacting; everything else is a ticket or automated." }
    ]
  },
  "25": {
    id: "25",
    title: "Log Analytics & KQL",
    subtitle: "Observability & SRE",
    description: "Centralized logging and Kusto Query Language.",
    theory: {
      title: "Log Analytics & KQL Theory",
      description: "Centralized log aggregation in a Log Analytics workspace and querying it with the powerful Kusto Query Language for diagnostics and dashboards.",
      whatIsIt: "A Log Analytics workspace is the central store where Azure Monitor logs land — from AKS (Container Insights), VMs, App Insights, Activity Logs, and diagnostic settings across resources. Kusto Query Language (KQL) is the read-only query language used to filter, aggregate, join, and visualize that data for troubleshooting, dashboards, and log-based alerts.",
      keyConcepts: [
        { label: "Workspace & Data Ingestion", desc: "Resources send logs to a workspace via Diagnostic Settings (Azure resources), the Azure Monitor Agent (VMs), or Container Insights (AKS). Data lands in TABLES (AzureDiagnostics, ContainerLog, AppRequests, Heartbeat). Ingestion + retention drive cost — control with table-level retention and Basic vs Analytics tiers." },
        { label: "KQL Fundamentals", desc: "A KQL query starts with a table and pipes (|) through operators: where (filter), summarize (aggregate, e.g., count() by bin(TimeGenerated, 5m)), project (select columns), join, render (visualize). Read top-to-bottom, left-to-right — like a data pipeline." },
        { label: "Log-Based Alerts & Workbooks", desc: "A KQL query returning rows above a threshold can back a scheduled log alert. Azure Workbooks combine KQL queries into rich interactive dashboards. The same KQL skills power Sentinel (SIEM) hunting queries for security." }
      ]
    },
    realWorld: {
      title: "Jio Platforms - Centralized KQL-Driven Diagnostics",
      description: "How Jio's SRE team triages incidents across 200 services with KQL",
      intro: "All Jio AKS clusters ship container logs and metrics to a central Log Analytics workspace via Container Insights. During an incident, SREs run KQL across the ContainerLog and AppRequests tables to find the failing service, correlate error spikes with deployments (joining to the Activity Log), and pinpoint the bad pod. Workbooks provide per-service golden-signal dashboards, and several log-based alerts (e.g., '5xx rate by service over 5 min') page on-call.",
      points: [
        "Container Insights -> Central Workspace: every AKS cluster's stdout/stderr and metrics flow into one Log Analytics workspace for cross-service correlation.",
        "Incident Triage with KQL: SREs summarize errors by service/pod with `ContainerLog | where LogEntry contains 'ERROR' | summarize count() by ContainerName, bin(TimeGenerated, 1m)`.",
        "Deploy Correlation: Joining AppRequests error spikes against AzureActivity deployment events instantly shows whether a release caused the regression.",
        "Cost Control: High-volume verbose logs use the Basic logs tier with shorter retention; critical audit logs use Analytics tier with longer retention — tuning ingestion cost per table."
      ],
      shortcut: "AWS CloudWatch Logs Insights == Log Analytics + KQL | CloudWatch Logs log groups == Log Analytics tables | Athena/OpenSearch queries == KQL queries | AWS QuickSight/CloudWatch dashboards == Azure Workbooks"
    },
    interview: [
      { q: "What is a Log Analytics workspace and how does data get into it?", a: "It's the central repository where Azure Monitor stores log/telemetry data, organized into tables. Data arrives via: Diagnostic Settings on Azure resources (routing platform/resource logs), the Azure Monitor Agent on VMs, Container Insights on AKS (pod stdout/stderr + metrics into ContainerLog/Perf tables), and Application Insights for app telemetry (AppRequests, AppDependencies). Centralizing into one workspace enables cross-resource correlation with KQL during incidents and unified retention/cost management." },
      { q: "Walk through the structure of a basic KQL query.", a: "KQL reads like a pipeline: start with a TABLE, then pipe (|) through operators that each transform the result. Example: `ContainerLog | where TimeGenerated > ago(1h) | where LogEntry contains 'ERROR' | summarize ErrorCount = count() by ContainerName, bin(TimeGenerated, 5m) | render timechart`. That filters to the last hour, keeps error lines, aggregates a count per container in 5-minute buckets, and renders a timechart. Common operators: where (filter), summarize (aggregate), project (select/compute columns), extend (add columns), join, top, order by, render." },
      { q: "What's the difference between metrics and logs, and when do you query Log Analytics specifically?", a: "Metrics are lightweight pre-aggregated numeric time-series, great for fast alerting/dashboards but limited dimensionality. Logs are rich, high-cardinality event records you query with KQL for DEEP diagnostics — finding a specific error message, correlating across services, joining request failures to a deployment event, or any condition needing parsing/aggregation/joins. You go to Log Analytics when you need to investigate WHY something happened or express conditions metrics can't, accepting higher cost and lower query frequency than metrics." },
      { q: "How would you use KQL to find whether a recent deployment caused an error spike?", a: "Query the app/request table for the error rate over time and visually/temporally correlate with deployment events from AzureActivity. E.g., summarize 5xx counts by bin(TimeGenerated, 5m) and render a timechart, then query AzureActivity for OperationName related to the deployment in the same window — or JOIN them on time. If the 5xx spike begins right at the deployment timestamp, that's strong evidence the release caused the regression, justifying a rollback. This deploy-vs-error correlation is a core SRE triage pattern." },
      { q: "How do you control Log Analytics costs at scale?", a: "Cost is driven mostly by data INGESTION (GB/day) and retention. Controls: (1) use the Basic Logs tier for high-volume, low-value verbose logs (cheaper ingestion, limited query) and Analytics tier only where you need full query/alerting; (2) set per-TABLE retention — keep critical audit logs long, drop noisy debug logs after days; (3) filter/transform at ingestion (Data Collection Rules) to drop unneeded fields/rows before they're billed; (4) sample very high-volume telemetry in Application Insights; (5) archive cold data to cheaper storage. Tuning ingestion per table is the biggest lever." },
      { q: "What is a log-based (scheduled query) alert and a trade-off versus a metric alert?", a: "A log-based alert runs a KQL query on a schedule (e.g., every 5 min) and fires if the result crosses a threshold (e.g., row count > N) — enabling alerting on complex, correlated, or parsed conditions metrics can't express. Trade-off: it evaluates on an interval (not real-time like metrics), so there's inherent detection latency equal to the query frequency + ingestion delay, and it costs more (query execution + log ingestion). Use metric alerts for fast, simple numeric conditions; log alerts when the condition genuinely requires KQL's expressiveness." }
    ]
  },
  "26": {
    id: "26",
    title: "Helm & Package Management",
    subtitle: "Observability & SRE",
    description: "Templating Kubernetes manifests and OCI artifacts.",
    theory: {
      title: "Helm & Package Management Theory",
      description: "Packaging, templating, versioning, and releasing Kubernetes applications with Helm, the de-facto K8s package manager.",
      whatIsIt: "Helm is the package manager for Kubernetes. A Helm 'chart' bundles templated YAML manifests + default values into a versioned, reusable package. `helm install/upgrade` renders the templates with supplied values and applies them as a tracked 'release', enabling parameterized, repeatable deployments and easy rollback.",
      keyConcepts: [
        { label: "Charts, Templates & Values", desc: "A chart has templates/ (manifests with {{ .Values.x }} placeholders), values.yaml (defaults), and Chart.yaml (metadata/version). Override values per environment with -f prod-values.yaml or --set. One chart deploys to dev/staging/prod with different replica counts, images, and resources." },
        { label: "Releases, Upgrades & Rollback", desc: "`helm install myapp ./chart` creates a versioned RELEASE; `helm upgrade` deploys a new revision; `helm rollback myapp 3` reverts to a prior revision. Helm tracks release history in-cluster, making rollback a single command — far cleaner than manually re-applying old YAML." },
        { label: "Repositories & OCI", desc: "Charts are shared via Helm repositories or, increasingly, stored as OCI artifacts in a registry like ACR (`helm push`/`helm pull oci://...`). This unifies image and chart distribution in one registry with the same RBAC and geo-replication." }
      ]
    },
    realWorld: {
      title: "Jio Platforms - One Chart, Many Environments",
      description: "How Jio templates 200 microservices with a shared base chart",
      intro: "Jio's platform team maintains a standardized 'jio-microservice' Helm chart that encodes best-practice defaults (resource limits, probes, HPA, NetworkPolicy, Key Vault CSI volume). Each of the 200 services deploys this chart with its own values file (image tag, replica count, env config), so a service ships to dev/staging/prod from ONE chart with three values files. Charts are versioned and stored as OCI artifacts in the central ACR alongside container images.",
      points: [
        "Shared Base Chart: 'jio-microservice' chart bakes in probes, HPA, resource limits, NetworkPolicy and CSI secret mounts — teams just supply values, getting hardened defaults free.",
        "Environment via Values Files: helm upgrade with dev-values.yaml (2 replicas) vs prod-values.yaml (30 replicas, stricter limits) — same chart, different config.",
        "OCI Charts in ACR: `helm push` stores charts as OCI artifacts in jioacr alongside images — unified RBAC, geo-replication, and retention for both.",
        "One-Command Rollback: A bad release is reverted with `helm rollback <svc> <previous-revision>` — Helm restores the exact prior manifest set instantly."
      ],
      shortcut: "AWS has no first-party Helm equivalent — Helm is CNCF and runs identically on EKS/AKS/GKE | OCI charts in ACR == OCI charts in ECR (same Helm 3 OCI standard)"
    },
    interview: [
      { q: "What problem does Helm solve over raw kubectl apply of YAML files?", a: "Raw YAML is static and duplicated — to deploy the same app to dev/staging/prod you copy-paste manifests and hand-edit replica counts, image tags, and resources, which drifts and is error-prone. Helm TEMPLATES the manifests with values, so one parameterized chart deploys to all environments by swapping a values file. It also tracks RELEASES with revision history (one-command rollback), manages install/upgrade/uninstall as atomic units, and packages/ versions the whole app for sharing — turning ad-hoc YAML into a versioned, repeatable deployment artifact." },
      { q: "Explain the relationship between a chart, templates, and values.", a: "A CHART is the package. Inside, templates/ holds Kubernetes manifests with placeholders like {{ .Values.replicaCount }} and {{ .Values.image.tag }}. values.yaml provides the DEFAULT values for those placeholders. Chart.yaml has metadata and the chart version. At install/upgrade, Helm RENDERS the templates by substituting values (defaults overridden by -f myenv-values.yaml or --set) into final manifests and applies them. So templates = the parameterized shape, values = the per-environment data filling that shape." },
      { q: "How does Helm enable rollback, and why is it cleaner than manual YAML rollback?", a: "Helm records each install/upgrade as a numbered REVISION, storing the complete rendered manifest set for that revision in-cluster (as a Secret). `helm rollback <release> <revision>` re-applies that exact prior revision's manifests atomically. It's cleaner than manual rollback because you don't need to find, version, and re-apply the old YAML yourself (which is error-prone and may miss resources) — Helm knows precisely what every prior release contained and restores it as a tracked unit, including removing resources that were added since." },
      { q: "How do you deploy the same chart to multiple environments with different configuration?", a: "Keep one chart with sensible defaults in values.yaml, then maintain per-environment override files: `helm upgrade --install myapp ./chart -f values-prod.yaml` for prod (30 replicas, prod image, strict limits) vs `-f values-dev.yaml` for dev (2 replicas, latest image). Only the differing values live in the env files; the chart logic stays single-sourced and reviewed once. You can also use --set for one-off overrides (like the CI-provided image tag: --set image.tag=$GIT_SHA), which is common in pipelines." },
      { q: "What does it mean to store Helm charts as OCI artifacts in ACR, and what's the benefit?", a: "Helm 3 supports the OCI standard, so charts can be pushed/pulled like container images: `helm push myapp-1.2.0.tgz oci://jioacr.azurecr.io/helm`. The benefit is UNIFICATION — charts live in the same registry (ACR) as your container images, inheriting the same RBAC/managed-identity auth, geo-replication, retention policies, and audit. No separate chart-repo infrastructure (like ChartMuseum) to run/secure; one registry governs both images and the charts that deploy them." },
      { q: "A `helm upgrade` left the release in a failed/pending state. How do you recover?", a: "First inspect: `helm status <release>` and `helm history <release>` to see revisions and the failure. If the upgrade is stuck pending (e.g., interrupted), you may need `helm rollback <release> <last-good-revision>` to return to a known-good state, or for a stuck pending-install, uninstall/reinstall. Check the underlying K8s objects (`kubectl get events`, pod statuses) for the real cause — often a bad image, failing probe, or invalid manifest from a templating error. Fix the root cause (values/template), then upgrade again. Helm's history makes returning to the last working revision straightforward while you debug." }
    ]
  },
  "27": {
    id: "27",
    title: "ArgoCD & GitOps",
    subtitle: "Observability & SRE",
    description: "Git as a single source of truth for infra and app state.",
    theory: {
      title: "ArgoCD & GitOps Theory",
      description: "Declarative, Git-driven continuous delivery for Kubernetes where Git is the single source of truth and a controller continuously reconciles the cluster to match.",
      whatIsIt: "GitOps is an operating model where the desired state of your cluster (manifests/Helm/Kustomize) lives in Git, and an in-cluster agent (ArgoCD) continuously compares the live cluster to Git and reconciles any difference. Deployments become 'git push'; drift is auto-detected and (optionally) auto-corrected. ArgoCD is the leading GitOps controller.",
      keyConcepts: [
        { label: "Pull-Based Reconciliation", desc: "Unlike push-based CI/CD (pipeline runs kubectl apply), GitOps is PULL-based: ArgoCD runs INSIDE the cluster, watches the Git repo, and pulls/applies changes. The cluster's credentials never leave it (the pipeline doesn't need cluster admin), and ArgoCD continuously enforces the desired state." },
        { label: "Sync, Drift & Self-Heal", desc: "ArgoCD shows each Application's sync status (Synced/OutOfSync) and health. If someone manually changes a resource (drift), ArgoCD flags OutOfSync and, with self-heal enabled, automatically reverts it to match Git — Git is the ONLY way to change state." },
        { label: "App-of-Apps & Promotion", desc: "An 'app-of-apps' pattern manages many Applications declaratively. Environment promotion = a Git change (PR updating the image tag in the prod overlay), giving a fully auditable, revertible deploy history — rollback is `git revert`." }
      ]
    },
    realWorld: {
      title: "Jio Platforms - GitOps for Fleet-Wide Consistency",
      description: "How Jio manages dozens of clusters declaratively from Git",
      intro: "Jio runs ArgoCD to manage application delivery across its AKS fleet. Each environment's desired state lives in a Git repo (Kustomize overlays per env); ArgoCD continuously reconciles each cluster to its branch/path. Promotion from staging to prod is a Pull Request bumping the image tag in the prod overlay — reviewed, merged, and auto-synced by ArgoCD. Self-heal is on for prod, so any manual portal/kubectl change is reverted to match Git, guaranteeing the repo is the single source of truth.",
      points: [
        "Pull-Based Security: ArgoCD runs in-cluster and pulls from Git — CI pipelines never hold cluster-admin credentials, shrinking the blast radius of a compromised pipeline.",
        "Promotion via PR: Moving a release to prod is a Git PR editing the prod overlay's image tag — fully reviewed and auditable; rollback is `git revert`.",
        "Self-Heal Enforces Git: With self-heal enabled, a manual `kubectl edit` in prod is automatically reverted by ArgoCD — eliminating undocumented drift.",
        "App-of-Apps: A root ArgoCD Application declaratively manages all per-service Applications, so onboarding a new service is a Git change, not manual cluster setup."
      ],
      shortcut: "AWS has no first-party GitOps controller — ArgoCD/Flux are CNCF and run on EKS/AKS/GKE identically | This is a Kubernetes operating model, not a cloud feature"
    },
    interview: [
      { q: "What is GitOps and how does it differ from traditional push-based CI/CD?", a: "GitOps is an operating model where the DESIRED state of infrastructure/apps is declared in Git, and an in-cluster controller continuously reconciles the live system to match. The difference from traditional CI/CD: push-based pipelines run `kubectl apply` FROM the pipeline (which therefore needs cluster credentials and only acts at deploy time). GitOps is PULL-based — the controller (ArgoCD) lives in the cluster, watches Git, and pulls changes, AND it continuously enforces state (auto-correcting drift), not just at deploy time. Git becomes the single source of truth and the audit log; deploying = merging a PR." },
      { q: "What security advantage does pull-based GitOps have over a pipeline running kubectl?", a: "In push-based CD, the CI/CD pipeline must hold powerful cluster credentials (often cluster-admin) and is reachable from outside the cluster — a compromised pipeline or leaked kubeconfig grants an attacker direct cluster control. In pull-based GitOps, ArgoCD runs INSIDE the cluster and pulls from Git; the cluster credentials never leave the cluster, and external CI only needs permission to commit to Git (not to touch the cluster). This shrinks the attack surface — the cluster isn't exposed to the CI system, and the worst a compromised CI can do is propose a Git change that's still gated by PR review." },
      { q: "What is configuration drift in GitOps and how does ArgoCD's self-heal handle it?", a: "Drift is when the live cluster state diverges from what's declared in Git — typically from a manual `kubectl edit`, a portal change, or another controller. ArgoCD continuously compares live vs Git and marks the Application OutOfSync when it detects drift. With SELF-HEAL enabled, ArgoCD automatically re-applies the Git-declared state, reverting the manual change — enforcing that Git is the ONLY legitimate way to change the cluster. Without self-heal, it just flags OutOfSync and waits for a manual sync, surfacing drift for human decision." },
      { q: "How does environment promotion and rollback work in a GitOps model?", a: "Promotion is a GIT operation: to promote a build from staging to prod, you open a PR that updates the prod environment's manifest/overlay (e.g., bump the image tag in the prod Kustomize overlay). After review and merge, ArgoCD detects the change and syncs prod to the new state. Rollback is equally Git-native: `git revert` the offending commit (or point the overlay back to the prior tag), and ArgoCD reconciles the cluster back. Every deploy and rollback is thus a reviewed, audited, revertible Git change — no out-of-band kubectl." },
      { q: "What is the 'app-of-apps' pattern in ArgoCD?", a: "App-of-apps is a pattern where a single root ArgoCD Application points to a Git directory containing the definitions of MANY other ArgoCD Applications. ArgoCD syncs the root, which creates/manages all the child Applications declaratively. This bootstraps and manages an entire fleet/environment from one entry point — onboarding a new microservice or whole environment becomes adding a child Application manifest to Git, rather than manually creating Applications in the ArgoCD UI. It makes the GitOps setup itself declarative and version-controlled." },
      { q: "When might you NOT enable auto-sync/self-heal, and what's the trade-off?", a: "You might disable auto-sync/self-heal for sensitive production environments where you want a HUMAN to explicitly trigger the sync after reviewing the diff (manual sync), or during incident response/debugging when an engineer needs to make a temporary live change without ArgoCD immediately reverting it. Trade-off: manual sync means drift can persist and deploys aren't automatic (slower, relies on someone clicking sync), but you gain a deliberate control point and the ability to make emergency live changes. Many teams auto-sync non-prod and require manual sync (or PR + auto-sync) for prod to balance speed with control." }
    ]
  },
  "28": {
    id: "28",
    title: "Cost Management (FinOps) & Policy",
    subtitle: "Observability & SRE",
    description: "Reserved instances, Azure Advisor, and DeployIfNotExists.",
    theory: {
      title: "Cost Management (FinOps) & Policy Theory",
      description: "Bringing financial accountability to cloud spend (FinOps) and enforcing governance/compliance at scale with Azure Policy.",
      whatIsIt: "FinOps is the practice of giving engineering teams visibility into and accountability for cloud cost, optimizing spend via right-sizing, commitment discounts (Reserved Instances/Savings Plans), and chargeback. Azure Policy enforces organizational rules (allowed regions/SKUs, mandatory tags, security baselines) with effects ranging from Audit to Deny to auto-remediation (DeployIfNotExists).",
      keyConcepts: [
        { label: "Cost Visibility & Chargeback", desc: "Cost Management + tags enable slicing spend by team/business unit/environment for chargeback/showback. Budgets with alerts (80/100/120%) catch overruns early. Azure Advisor surfaces right-sizing and idle-resource recommendations." },
        { label: "Commitment Discounts", desc: "Reserved Instances (1/3-year commitment to specific VM families) and Savings Plans (commit to hourly spend, more flexible) cut compute cost up to ~70% versus pay-as-you-go for steady-state workloads. Spot VMs cut cost for interruptible work." },
        { label: "Azure Policy Effects", desc: "Audit (flag non-compliance), Deny (block non-compliant creation), Append/Modify (add tags), and DeployIfNotExists (auto-remediate — e.g., auto-deploy a diagnostic setting if missing). Assigned at management group/subscription scope, policies govern thousands of resources consistently." }
      ]
    },
    realWorld: {
      title: "Jio Platforms - FinOps Chargeback & Policy Guardrails",
      description: "How Jio controls multi-million-dollar Azure spend and enforces standards",
      intro: "Jio's FinOps practice charges Azure spend back to 12+ business units using mandatory tags (CostCenter, BusinessUnit) enforced by an Azure Policy Deny effect — resources can't be created without them. Steady-state AKS and database compute is covered by 3-year Reserved Instances/Savings Plans (~60% savings), while batch jobs use Spot. Azure Policy guardrails enforce allowed regions (data residency), block public IPs on storage, and use DeployIfNotExists to auto-attach diagnostic settings to every new resource.",
      points: [
        "Tag-Enforced Chargeback: A Policy Deny blocks resource creation without CostCenter/BusinessUnit tags, so Cost Management can attribute 100% of spend for monthly chargeback.",
        "Commitment Discounts: 3-year Reserved Instances/Savings Plans cover predictable AKS node and PostgreSQL compute (~60% off PAYG); Spot for interruptible batch.",
        "Guardrail Policies: Deny effect blocks resource creation outside approved India regions (data residency) and blocks public network access on storage/PostgreSQL.",
        "Auto-Remediation: DeployIfNotExists policies automatically attach Log Analytics diagnostic settings to any new resource, guaranteeing observability coverage without manual steps."
      ],
      shortcut: "AWS Cost Explorer / Budgets == Azure Cost Management + Budgets | AWS Reserved Instances/Savings Plans == Azure Reserved Instances/Savings Plans | AWS Config Rules / SCPs == Azure Policy | AWS Trusted Advisor == Azure Advisor"
    },
    interview: [
      { q: "What is FinOps and what are its core levers for reducing cloud cost?", a: "FinOps is the cultural practice of bringing financial accountability to cloud spend — giving engineering teams visibility into what they spend and ownership of optimizing it. Core levers: (1) VISIBILITY — tag-based cost allocation, budgets/alerts, dashboards per team. (2) RIGHT-SIZING — eliminate idle/oversized resources (Advisor recommendations, scale-to-zero). (3) COMMITMENT DISCOUNTS — Reserved Instances/Savings Plans for steady-state workloads (~up to 70% off). (4) Choosing the right PRICING MODEL — Spot for interruptible work, serverless for bursty. (5) ARCHITECTURE — storage tiering, autoscaling. The cultural piece (engineers see and own their cost) is what makes the technical levers actually get applied." },
      { q: "Compare Reserved Instances and Savings Plans — when use each?", a: "Reserved Instances commit to a SPECIFIC VM family in a region for 1 or 3 years for the deepest discount, but are less flexible (changing family forgoes some benefit). Savings Plans commit to a fixed hourly SPEND ($/hr) across compute for 1/3 years — slightly less discount than RIs but far more flexible (the commitment applies to whatever eligible compute you run, across families/regions). Use RIs for very stable, known workloads (a fixed database VM you'll run for 3 years); use Savings Plans when your compute mix evolves but baseline spend is predictable — you want the discount without locking to exact SKUs." },
      { q: "Explain the main Azure Policy effects and give a use case for each.", a: "Audit — reports non-compliant resources without blocking (use to assess an estate before enforcing). Deny — blocks creation/update of non-compliant resources (e.g., deny resources without a CostCenter tag, or deny VMs outside approved regions). Append/Modify — automatically adds/changes properties like a default tag. DeployIfNotExists (DINE) — auto-REMEDIATES by deploying a related resource if missing (e.g., automatically attach a Log Analytics diagnostic setting to every new storage account). AuditIfNotExists similarly audits for a missing related config. Together they let you assess, enforce, and auto-fix governance at scale." },
      { q: "How would you use tags + Azure Policy to enable accurate cost chargeback?", a: "Define mandatory tags (CostCenter, BusinessUnit, Environment) and enforce them with an Azure Policy DENY effect at the management-group scope so NO resource can be created without them (or Append to apply a default). Because every resource is now tagged, Azure Cost Management can group/filter spend by those tags, producing per-business-unit chargeback reports. Without enforced tagging, a chunk of spend is 'untagged'/unattributable, breaking chargeback — the Deny policy guarantees 100% tag coverage, which is the foundation of accurate cost allocation." },
      { q: "What is DeployIfNotExists and why is it powerful for governance?", a: "DeployIfNotExists (DINE) is an Azure Policy effect that, when it finds a resource missing a required related configuration, AUTOMATICALLY deploys that configuration via an ARM template remediation. Example: a policy that ensures every resource has diagnostic settings sending logs to a central Log Analytics workspace — if a new resource lacks it, DINE auto-creates the diagnostic setting. It's powerful because governance becomes SELF-ENFORCING and self-healing at scale: you don't rely on every team remembering to configure logging/security baselines — the policy guarantees and remediates compliance automatically across thousands of resources, including ones created in the future." },
      { q: "Your monthly Azure bill spiked unexpectedly. Walk through how you'd investigate.", a: "1) Open Cost Management cost analysis and group by RESOURCE GROUP / SERVICE / TAG to find WHERE the spike is concentrated. 2) Add a time filter to pinpoint WHEN it started, then correlate with deployments/changes (a new region, a scaled-up cluster, a runaway autoscale, an accidentally-Hot storage tier, egress charges). 3) Check for anomalies — orphaned resources (unattached disks, idle public IPs), a misconfigured autoscaler, or a dev resource left running. 4) Use Azure Advisor cost recommendations for right-sizing/RI opportunities. 5) Set/adjust a BUDGET alert so the next spike is caught early. 6) Remediate (scale down, delete orphans, fix tier/policy) and, if it's a recurring pattern, add a guardrail Policy or autoscale cap to prevent recurrence." }
    ]
  },
  "29": {
    id: "29",
    title: "Chaos Engineering (Azure Chaos Studio)",
    subtitle: "Observability & SRE",
    description: "Controlled fault injection and blast radius management.",
    theory: {
      title: "Chaos Engineering Theory",
      description: "Deliberately injecting controlled failures to validate that systems are as resilient as you believe, before real outages prove otherwise.",
      whatIsIt: "Chaos Engineering is the discipline of running controlled experiments that inject faults (kill pods, fail a zone, add latency, exhaust CPU) into a system to verify it withstands them gracefully. Azure Chaos Studio is the managed service for orchestrating these experiments safely with defined blast radius and rollback.",
      keyConcepts: [
        { label: "Hypothesis & Steady State", desc: "An experiment starts with a HYPOTHESIS framed around a measurable steady state (e.g., 'p99 latency stays < 500ms and error rate < 0.1% even if one AZ fails'). You inject the fault and verify the steady state holds — or discover a weakness before customers do." },
        { label: "Blast Radius Control", desc: "Experiments are SCOPED (specific resources, a percentage of pods, a time-boxed duration) and run in staging first, then carefully in prod. Chaos Studio supports a 'stop/rollback' to immediately halt the experiment if real impact exceeds tolerance — controlling blast radius is the core safety principle." },
        { label: "Fault Types & Game Days", desc: "Faults: pod kill, node shutdown, AZ failure, network latency/loss, CPU/memory pressure, dependency outage. A 'Game Day' is a scheduled, team-wide chaos exercise simulating a major outage to test both the system AND the human incident response (runbooks, on-call, communication)." }
      ]
    },
    realWorld: {
      title: "Jio Platforms - Validating Resilience Before Sale Events",
      description: "How Jio proves JioMart survives failures before peak traffic",
      intro: "Before major sale events, Jio's SRE team runs Chaos Studio experiments against the staging JioMart environment: killing 30% of checkout pods, injecting 300ms latency on the PostgreSQL connection, and simulating a full Availability Zone outage. Each experiment has a hypothesis ('checkout SLO holds') and an automatic rollback if error rate exceeds tolerance. Findings (e.g., a missing PodDisruptionBudget that caused a brief outage during node drain) are fixed before the real traffic peak, and quarterly Game Days exercise the on-call team's response.",
      points: [
        "Pre-Peak Resilience Tests: Pod kills, dependency latency, and zone-failure experiments validate that JioMart's checkout SLO holds under failure BEFORE Big Billion Days.",
        "Hypothesis-Driven: Each experiment states a measurable steady state (error rate < 0.1%, p99 < 800ms) and passes only if it holds during fault injection.",
        "Controlled Blast Radius: Experiments start in staging, are time-boxed, scoped to a fraction of resources, and auto-rollback if real impact exceeds the defined tolerance.",
        "Game Days: Quarterly full-outage simulations test not just the system but the humans — runbooks, alerting, on-call escalation, and incident communication."
      ],
      shortcut: "AWS Fault Injection Simulator (FIS) == Azure Chaos Studio | Chaos Mesh/LitmusChaos (CNCF) run on AKS too | the discipline (Netflix Chaos Monkey origins) is cloud-agnostic"
    },
    interview: [
      { q: "What is Chaos Engineering and why deliberately break things in production-like systems?", a: "Chaos Engineering is running CONTROLLED experiments that inject failures to verify a system is as resilient as designed. You deliberately break things because resilience assumptions ('we're HA, a zone failure is fine') are often untested and wrong — and you'd rather discover the weakness during a planned, scoped experiment with engineers watching than during a real 3 AM outage hitting customers. It turns 'we think we're resilient' into 'we've proven we survive these specific failures', surfacing missing PodDisruptionBudgets, single points of failure, bad timeouts, and broken failover BEFORE they cause real incidents." },
      { q: "How do you structure a chaos experiment (hypothesis and steady state)?", a: "Start by defining the STEADY STATE — a measurable indicator of normal, healthy operation (e.g., error rate < 0.1%, p99 latency < 500ms, orders/sec within range). Form a HYPOTHESIS: 'the steady state will HOLD even when [fault] occurs' (e.g., 'even if one AZ fails'). Then inject that specific fault in a controlled, scoped way and OBSERVE whether the steady state holds. If it holds, you've validated resilience; if it breaks, you've found a real weakness to fix. The experiment is falsifiable and tied to user-meaningful metrics, not vague 'let's see what happens'." },
      { q: "What is 'blast radius' and how do you control it during chaos experiments?", a: "Blast radius is the scope of potential impact a chaos experiment could cause. You control it by: starting in NON-PROD (staging) before prod; SCOPING the fault tightly (a small % of pods/one zone/specific resources, not everything); TIME-BOXING the experiment (short duration); running during low-traffic windows initially; having clear ABORT criteria and an automatic STOP/ROLLBACK that halts the experiment the moment real impact (error rate, latency) exceeds a defined tolerance; and monitoring closely with the team present. The principle: start small and safe, expand confidence gradually — never inject a large uncontrolled fault into prod on day one." },
      { q: "Give examples of fault types you'd inject and what each validates.", a: "Pod/instance kill — validates that replicas + rescheduling + PodDisruptionBudgets keep the service up. Availability Zone failure — validates zone-redundant deployment and failover. Network latency/packet loss — validates timeouts, retries, and circuit breakers handle a slow/degraded dependency gracefully (not cascade). CPU/memory pressure — validates resource limits, HPA scaling, and graceful degradation. Dependency outage (e.g., a downstream API/DB down) — validates fallbacks, caching, and that one failing dependency doesn't take down the whole system. Each targets a specific resilience assumption you want to prove or disprove." },
      { q: "What is a Game Day and what does it test beyond the system itself?", a: "A Game Day is a scheduled, team-wide exercise simulating a major incident (often via chaos fault injection) to rehearse the FULL response. Beyond the technical system's resilience, it tests the HUMANS and PROCESS: Do the alerts actually fire and page the right people? Are the runbooks accurate and findable? Does on-call know the escalation path? Is incident communication (status updates, comms channels) effective? Do people know how to roll back? Game Days frequently reveal that the system survived but the response was chaotic — stale runbooks, alert gaps, unclear ownership — which is exactly the kind of thing you want to fix in a drill, not a real outage." },
      { q: "How do you safely introduce chaos engineering into an organization that's never done it?", a: "Start small and build trust: (1) Begin in NON-PRODUCTION with low-risk faults (kill a single pod) and a tight, observed blast radius. (2) Always run hypothesis-driven experiments with clear steady-state metrics and automatic abort/rollback. (3) Fix the weaknesses you find and SHOW the value (an outage prevented) to build organizational buy-in. (4) Gradually expand fault scope and complexity, and only move to production once you've proven the safety mechanisms and the system survives in staging. (5) Establish Game Days as a regular practice. The key is incremental confidence and never injecting faults you don't have monitoring and a kill-switch for — chaos engineering done recklessly causes the outages it's meant to prevent." }
    ]
  },
  "30": {
    id: "30",
    title: "Production Architecture Game Day",
    subtitle: "Observability & SRE",
    description: "Simulating complete zonal outages and HA failovers.",
    theory: {
      title: "Production Architecture Game Day Theory",
      description: "A capstone exercise tying together everything — networking, compute, K8s, IaC, security, observability, and chaos — to validate end-to-end resilience of a complete production architecture.",
      whatIsIt: "A Production Architecture Game Day is a comprehensive, planned simulation of a major failure (a full Availability Zone outage, a regional failover, a critical dependency loss) against a production-grade architecture, validating that the system AND the team's response together meet availability and recovery objectives (SLOs, RTO, RPO).",
      keyConcepts: [
        { label: "RTO & RPO", desc: "Recovery Time Objective (RTO) = how fast you must restore service after a disaster. Recovery Point Objective (RPO) = how much data loss is acceptable (e.g., 5 minutes). These targets drive the architecture: RPO near zero needs synchronous geo-replication; aggressive RTO needs automated failover, not manual." },
        { label: "Zonal vs Regional Resilience", desc: "Zone-redundant design (AKS across 3 AZs, ZRS storage, zone-redundant PostgreSQL) survives a single-AZ outage automatically. Regional disaster recovery (paired-region replicas, GZRS, Traffic Manager/Front Door failover) survives losing an entire region — more complex and costly, reserved for critical workloads." },
        { label: "Failover Orchestration & Validation", desc: "A Game Day validates the FULL chain: does Front Door/Traffic Manager reroute on health-probe failure, does the database promote a replica, do stateless pods reschedule, is data consistent post-failover, and crucially — can the team execute the runbook under pressure within RTO?" }
      ]
    },
    realWorld: {
      title: "Jio Platforms - Annual Zonal Outage Simulation",
      description: "Jio's capstone DR exercise validating JioMart survives a zone loss",
      intro: "Once a year, Jio runs a full Game Day simulating the loss of an entire Availability Zone in Central India for JioMart. The exercise validates that zone-redundant AKS reschedules pods to surviving zones, the zone-redundant PostgreSQL Flexible Server fails over automatically, ZRS storage stays available, and Azure Front Door keeps routing healthy traffic — all while the checkout SLO holds. The on-call team executes the DR runbook, and gaps (a service without multi-zone replicas, a too-slow database failover) are tracked to remediation with owners and deadlines.",
      points: [
        "Full Zone-Loss Simulation: An entire AZ is failed; the test confirms AKS pod rescheduling, PostgreSQL zone failover, and ZRS storage all keep JioMart's checkout SLO intact.",
        "RTO/RPO Validation: The exercise measures actual recovery time and data loss against the documented RTO (minutes) and near-zero RPO targets — proving the SLA is real, not theoretical.",
        "Runbook Under Pressure: The on-call team runs the DR runbook live; unclear steps and missing automation are surfaced and fixed while it's a drill, not a real outage.",
        "Tracked Remediation: Every gap (a single-zone dependency, a manual step that should be automated) gets an owner and deadline, measurably improving resilience year over year."
      ],
      shortcut: "AWS Multi-AZ + Route 53 failover + RDS Multi-AZ == Azure zone-redundant AKS/storage + Front Door + zone-redundant PostgreSQL | AWS DR concepts (RTO/RPO, pilot light, warm standby) map directly to Azure"
    },
    interview: [
      { q: "Define RTO and RPO and explain how they drive architecture decisions.", a: "RTO (Recovery Time Objective) is the maximum acceptable TIME to restore service after a disaster — how long you can be down. RPO (Recovery Point Objective) is the maximum acceptable DATA LOSS, measured in time — how much recent data you can afford to lose. They drive architecture: a near-zero RPO demands synchronous replication (e.g., zone-redundant or geo-synchronous database) so no committed data is lost; an aggressive RTO (minutes) demands AUTOMATED failover (health-probe-driven rerouting, auto-promoting replicas) rather than manual recovery. Looser RTO/RPO allow cheaper approaches (backups + restore, pilot-light). You design — and pay — to meet the targets the business actually requires." },
      { q: "How does a zone-redundant architecture survive an Availability Zone outage?", a: "By spreading every tier across all 3 AZs so no single zone is a single point of failure: AKS node pools span zones (pods reschedule to surviving zones, with PodDisruptionBudgets and enough capacity headroom), the database uses zone-redundant HA (e.g., PostgreSQL Flexible Server with a standby in another zone that auto-promotes), storage uses ZRS (data replicated across zones), and the load balancer/Front Door routes only to healthy zones. When one AZ fails, the surviving zones absorb the load and automated failover handles stateful components — ideally with no manual intervention and the SLO maintained. The Game Day proves this actually works." },
      { q: "What's the difference between zonal resilience and regional disaster recovery, and the cost/complexity trade-off?", a: "Zonal resilience protects against the loss of one datacenter/zone WITHIN a region using zone-redundant services — relatively straightforward and often automatic, covering the common failure case. Regional DR protects against losing an ENTIRE region (rare but catastrophic) and requires replicating to a PAIRED region: geo-redundant storage (GZRS), cross-region database replicas, and global routing (Front Door/Traffic Manager) to fail over — much more complex, costly (duplicate capacity, cross-region data transfer), and often involves data-consistency and failover-orchestration challenges. Trade-off: most workloads get zone redundancy; only the most critical justify full regional DR given its cost and operational complexity." },
      { q: "Why include the human/team response in a Game Day, not just the technical failover?", a: "Because real incidents are resolved (or prolonged) by PEOPLE following process under pressure — and that's frequently the weakest link. A system can fail over perfectly while the response is chaotic: stale or missing runbooks, alerts that don't fire or page the wrong team, unclear escalation/ownership, poor incident communication, and engineers unsure how to execute or verify failover. A Game Day stresses both the architecture AND the socio-technical response, revealing gaps like 'the runbook references a deleted dashboard' or 'nobody knew who owns the DB failover' — exactly the failures you must fix in a drill rather than discover live, since RTO depends on humans executing correctly and quickly." },
      { q: "After a Game Day reveals a service that didn't fail over correctly, how do you handle the findings?", a: "Treat every finding as a tracked remediation item with a clear OWNER, priority, and DEADLINE — not just a note. Root-cause why it failed (e.g., the service had only single-zone replicas, a missing PodDisruptionBudget, a hardcoded zone-specific endpoint, or a too-slow manual DB failover step). Prioritize by risk/impact, fix it, and ideally RE-TEST in the next exercise to confirm the fix works. Capture systemic patterns (e.g., 'several services lack multi-zone config') and address them via guardrails — a Policy or a hardened Helm base chart default — so new services inherit resilience. The Game Day's value is realized only if findings convert into measurable, verified improvements year over year." },
      { q: "Design a high-level resilient production architecture for JioMart checkout that survives a zone outage with near-zero RPO.", a: "Front Door (global L7, health-probe routing + WAF) -> Application Gateway/AGIC in the region. AKS cluster with node pools spread across all 3 AZs, checkout deployed with multiple replicas, PodDisruptionBudgets, HPA, and anti-affinity so replicas don't co-locate in one zone. State: PostgreSQL Flexible Server with zone-redundant HA (synchronous standby in another zone for near-zero RPO, auto-promotion on failure) and ZRS/GZRS storage. Redis with zone redundancy for sessions. Secrets via Key Vault + CSI. Observability via Azure Monitor/Log Analytics with SLO-based alerts, and the whole thing defined in Terraform so it's reproducible. For regional disaster, add a paired-region warm standby with geo-replicated data and Front Door failover. Validate it all annually with a Game Day measuring actual RTO/RPO against targets." }
    ]
  },
};
