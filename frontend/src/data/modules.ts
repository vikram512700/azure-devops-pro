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
    title: "Azure Virtual Networks",
    subtitle: "VNet Implementation",
    description: "Deploy a secure Hub-Spoke network topology.",
    theory: {
      title: "Azure Virtual Networks (VNet)",
      description: "Core networking component in Azure",
      whatIsIt: "A Virtual Network (VNet) is the fundamental building block for your private network in Azure. It enables many types of Azure resources, such as VMs, to securely communicate.",
      keyConcepts: [
        { label: "Address Space", desc: "The CIDR block for the VNet (e.g. 10.0.0.0/16)." },
        { label: "Subnets", desc: "Smaller logical partitions of your VNet (e.g. 10.0.1.0/24)." },
        { label: "Network Security Groups", desc: "Firewalls containing security rules that allow or deny traffic." }
      ]
    },
    realWorld: {
      title: "Jio/Reliance Enterprise Use Case",
      description: "How VNets are used in production at scale",
      intro: "In a massive GCC like Jio Platforms, you use a Hub-Spoke Topology to manage hundreds of microservices.",
      points: [
        "Hub VNet: Acts as the central point of connectivity to the on-premises Data Center.",
        "Spoke VNets: Each product team gets their own isolated Spoke VNet peered to the Hub."
      ],
      shortcut: "AWS VPC == Azure VNet\nAWS Subnet == Azure Subnet\nAWS Security Group == Azure NSG"
    },
    interview: [
      {
        q: "What is the difference between an NSG and Azure Firewall?",
        a: "An NSG operates at Layer 3/4 based on 5-tuple rules. Azure Firewall operates at Layer 7 with threat intelligence."
      }
    ]
  },
  "2": {
    id: "2",
    title: "Azure Compute & AKS",
    subtitle: "Kubernetes Cluster Architecture",
    description: "Architect and scale highly available microservices.",
    theory: {
      title: "Azure Kubernetes Service (AKS)",
      description: "Managed Kubernetes by Microsoft",
      whatIsIt: "AKS simplifies deploying a managed Kubernetes cluster in Azure by offloading the operational overhead to Azure.",
      keyConcepts: [
        { label: "Control Plane", desc: "Managed by Azure. You don't pay for this." },
        { label: "Node Pools", desc: "Groups of VMs running your workloads." },
        { label: "Azure CNI", desc: "Advanced networking where every pod gets a unique IP from the VNet." }
      ]
    },
    realWorld: {
      title: "High Traffic Telecommunications",
      description: "Handling Jio scale traffic spikes",
      intro: "During events like IPL streams, traffic spikes unpredictably.",
      points: [
        "KEDA: Used to scale pods instantly based on queue length.",
        "Spot Node Pools: Used for background transcoding jobs to save 90% cost."
      ],
      shortcut: "AWS EKS == Azure AKS\nAWS EC2 Auto Scaling == VM Scale Sets"
    },
    interview: [
      {
        q: "What happens if the AKS Control Plane goes down?",
        a: "Your existing pods continue to run, but you cannot deploy new pods."
      }
    ]
  },
  "3": {
    id: "3",
    title: "Infrastructure as Code",
    subtitle: "Terraform & Bicep",
    description: "Automate your infrastructure deployments.",
    theory: {
      title: "Terraform in Azure",
      description: "Declarative Infrastructure Automation",
      whatIsIt: "Terraform allows you to define your Azure infrastructure in HashiCorp Configuration Language (HCL). It maintains a state file to understand the current configuration of your resources.",
      keyConcepts: [
        { label: "State File (terraform.tfstate)", desc: "JSON file mapping your code to real Azure resources." },
        { label: "AzureRM Provider", desc: "The plugin used to interact with the Azure API." },
        { label: "Remote Backend", desc: "Storing state in an Azure Storage Account for team collaboration." }
      ]
    },
    realWorld: {
      title: "Multi-Environment Consistency",
      description: "Managing Jio Platforms Infrastructure",
      intro: "We deploy the exact same architecture to Dev, QA, Staging, and Production by using parameterized Terraform modules.",
      points: [
        "State Locking: We use Azure Blob Storage leasing to lock the state file so two pipelines don't overwrite each other.",
        "Module Registry: Custom modules for secure-by-default AKS clusters are shared across the company."
      ],
      shortcut: "AWS CloudFormation == Azure ARM Templates\nAWS CDK == Azure Bicep"
    },
    interview: [
      {
        q: "How do you securely pass a database password into Terraform?",
        a: "We never hardcode it. We use the Azure Key Vault data source (`data \"azurerm_key_vault_secret\"`) to fetch it dynamically during `terraform apply`."
      }
    ]
  },
  "4": {
    id: "4",
    title: "CI/CD Pipelines",
    subtitle: "Azure DevOps & GitHub Actions",
    description: "Build and release software at DevOps speed.",
    theory: {
      title: "Azure Pipelines",
      description: "Continuous Integration & Delivery",
      whatIsIt: "A service that automatically builds, tests, and deploys your code using YAML-defined workflows.",
      keyConcepts: [
        { label: "Agents (Runners)", desc: "The VMs or containers that actually run your pipeline jobs." },
        { label: "Artifacts", desc: "The compiled output of a build pipeline (e.g. a Docker image or a .zip file) passed to the release pipeline." },
        { label: "Service Connections", desc: "Securely connecting Azure DevOps to your Azure Subscription using a Service Principal." }
      ]
    },
    realWorld: {
      title: "Zero-Downtime Deployments",
      description: "Releasing telco software safely",
      intro: "We use Blue/Green deployments for our microservices to ensure users never experience a dropped call during updates.",
      points: [
        "Approval Gates: Production deployments require manual sign-off from QA via Teams integration.",
        "Self-Hosted Agents: We run our build agents inside our private VNet so they can securely access internal SonarQube servers."
      ],
      shortcut: "AWS CodePipeline == Azure Pipelines\nAWS CodeBuild == Azure Build Pipeline"
    },
    interview: [
      {
        q: "What is the difference between a Microsoft-hosted and Self-hosted agent?",
        a: "Microsoft-hosted agents are fresh, ephemeral VMs provided by Azure per job. Self-hosted agents are VMs you manage, allowing caching, private VNet access, and custom software."
      }
    ]
  },
  "5": {
    id: "5",
    title: "Monitoring & Observability",
    subtitle: "Azure Monitor & Log Analytics",
    description: "Achieve SRE excellence through proactive alerting.",
    theory: {
      title: "Log Analytics Workspaces",
      description: "Centralized logging and metrics",
      whatIsIt: "A unified platform that collects telemetry data from all your Azure resources. You query this data using Kusto Query Language (KQL).",
      keyConcepts: [
        { label: "Metrics vs Logs", desc: "Metrics are numerical values at a point in time (CPU%). Logs are detailed records of events (Errors)." },
        { label: "Application Insights", desc: "APM tool for code-level tracing (exceptions, dependency latency)." },
        { label: "Action Groups", desc: "Defines what happens when an alert triggers (Email, SMS, Webhook)." }
      ]
    },
    realWorld: {
      title: "SRE Incident Response",
      description: "Detecting anomalies before users do",
      intro: "At Jio scale, we cannot look at dashboards manually. We rely on automated anomaly detection.",
      points: [
        "Dynamic Thresholds: Instead of alerting when CPU > 90%, we alert when CPU deviates from historical baselines using Azure ML.",
        "PagerDuty Integration: Critical alerts (HTTP 5xx spikes) trigger an Azure Action Group webhook to page the on-call engineer."
      ],
      shortcut: "AWS CloudWatch == Azure Monitor\nAWS X-Ray == Application Insights"
    },
    interview: [
      {
        q: "Write a KQL query to find all failed HTTP requests in the last hour.",
        a: "AppRequests | where Success == false | where TimeGenerated > ago(1h) | summarize count() by resultCode"
      }
    ]
  },
  "6": {
    id: "6",
    title: "Identity & Security",
    subtitle: "Entra ID & Key Vault",
    description: "Implement Zero-Trust architecture.",
    theory: {
      title: "Microsoft Entra ID",
      description: "Formerly Azure Active Directory",
      whatIsIt: "The cloud-based identity and access management service that controls who can access what in Azure.",
      keyConcepts: [
        { label: "Managed Identities", desc: "An identity automatically managed by Azure for your VM/App Service. No credentials to rotate." },
        { label: "Role-Based Access Control (RBAC)", desc: "Assigning permissions (e.g. Reader, Contributor) at specific scopes." },
        { label: "Azure Key Vault", desc: "Securely stores and tightly controls access to tokens, passwords, certificates, and API keys." }
      ]
    },
    realWorld: {
      title: "Zero-Trust at Scale",
      description: "No more hardcoded passwords",
      intro: "Security is non-negotiable for telecommunications data. We enforce a strict zero-trust model.",
      points: [
        "Passwordless: Our AKS clusters use Workload Identity to authenticate to Azure SQL. There are zero passwords stored in code.",
        "JIT Access: Engineers do not have standing Contributor access to production. They request Just-In-Time access via PIM."
      ],
      shortcut: "AWS IAM == Microsoft Entra ID\nAWS KMS / Secrets Manager == Azure Key Vault"
    },
    interview: [
      {
        q: "What is the difference between a System-Assigned and User-Assigned Managed Identity?",
        a: "System-assigned is tied to the lifecycle of a single Azure resource (deleted when the resource is deleted). User-assigned is an independent Azure resource that can be shared across multiple VMs."
      }
    ]
  },
  "7": {
    id: "7",
    title: "Azure Storage",
    subtitle: "Blob, Files & Managed Disks",
    description: "Design durable, scalable data storage solutions.",
    theory: {
      title: "Azure Storage Accounts",
      description: "Massive scale cloud storage",
      whatIsIt: "A highly available, massively scalable, durable, and secure cloud storage service.",
      keyConcepts: [
        { label: "Blob Storage", desc: "Object storage for unstructured data (images, videos, backups)." },
        { label: "Access Tiers", desc: "Hot, Cool, and Archive tiers for cost optimization." },
        { label: "Redundancy (LRS vs GRS)", desc: "Locally Redundant (3 copies in 1 DC) vs Geo-Redundant (copies replicated to a secondary region)." }
      ]
    },
    realWorld: {
      title: "Massive Data Lakes",
      description: "Storing exabytes of telemetry",
      intro: "Jio processes petabytes of network telemetry daily. We use Azure Data Lake Storage Gen2.",
      points: [
        "Lifecycle Management: Logs older than 30 days are automatically moved to the Archive tier to save costs.",
        "Private Endpoints: Storage accounts are completely locked down. They can only be accessed via private IP addresses from within our VNet."
      ],
      shortcut: "AWS S3 == Azure Blob Storage\nAWS EBS == Managed Disks\nAWS EFS == Azure Files"
    },
    interview: [
      {
        q: "How do you temporarily grant a 3rd party access to a specific Blob file without making the container public?",
        a: "Generate a Shared Access Signature (SAS) token with a specific expiration time and Read-only permissions."
      }
    ]
  },
  "8": {
    id: "8",
    title: "Container Registries",
    subtitle: "ACR & Helm Chart Management",
    description: "Secure and distribute your container images.",
    theory: {
      title: "Azure Container Registry (ACR)",
      description: "Private Docker registry",
      whatIsIt: "A managed, private Docker registry service based on the open-source Docker Registry 2.0.",
      keyConcepts: [
        { label: "Image Vulnerability Scanning", desc: "Microsoft Defender automatically scans images for CVEs upon push." },
        { label: "Geo-replication", desc: "Premium ACR can automatically replicate images across global regions for fast local pulling." },
        { label: "ACR Tasks", desc: "Cloud-based automated container building." }
      ]
    },
    realWorld: {
      title: "Global Artifact Distribution",
      description: "Fast deployments everywhere",
      intro: "When we deploy a new microservice, the image needs to be pulled by AKS clusters in Mumbai and Chennai simultaneously.",
      points: [
        "Geo-Replication: We use a Premium ACR to ensure images are physically close to the nodes pulling them.",
        "Helm OCI: We store not just Docker images, but also our Helm charts directly in ACR as OCI artifacts."
      ],
      shortcut: "AWS ECR == Azure Container Registry (ACR)"
    },
    interview: [
      {
        q: "How do you authenticate AKS to pull images from ACR?",
        a: "During cluster creation (or later via `az aks update`), we attach the ACR. Azure automatically grants the AKS agent pool Managed Identity the `AcrPull` role on the registry."
      }
    ]
  },
  "9": {
    id: "9",
    title: "Cost Management",
    subtitle: "FinOps & Azure Policy",
    description: "Govern cloud spend and enforce compliance.",
    theory: {
      title: "Azure FinOps",
      description: "Cloud Financial Management",
      whatIsIt: "The practice of bringing financial accountability to the variable spend model of cloud.",
      keyConcepts: [
        { label: "Azure Policy", desc: "Rules that enforce organizational standards (e.g. 'All resources must have a CostCenter tag')." },
        { label: "Reserved Instances (RIs)", desc: "Committing to 1 or 3 years of compute for up to 72% discount." },
        { label: "Azure Advisor", desc: "Free service that analyzes configurations to recommend cost savings." }
      ]
    },
    realWorld: {
      title: "Stopping Cloud Waste",
      description: "Saving millions at enterprise scale",
      intro: "In a massive enterprise, orphaned disks and over-provisioned VMs can cost millions.",
      points: [
        "Auto-Shutdown: Non-production VMs are aggressively auto-shutdown at 7PM daily via Automation Accounts.",
        "Deny Policies: We use Azure Policy with a 'Deny' effect to prevent developers from spinning up expensive GPU instances without approval."
      ],
      shortcut: "AWS Organizations == Azure Management Groups\nAWS Cost Explorer == Azure Cost Management"
    },
    interview: [
      {
        q: "What is an Azure Policy 'DeployIfNotExists' effect?",
        a: "If a resource is created without a required sub-resource (like a VM created without the Log Analytics agent), Azure Policy will automatically trigger a deployment to install it."
      }
    ]
  },
  "10": {
    id: "10",
    title: "Chaos Engineering",
    subtitle: "Advanced SRE Practices",
    description: "Test resiliency by injecting faults into production.",
    theory: {
      title: "Azure Chaos Studio",
      description: "Controlled fault injection",
      whatIsIt: "A fully managed chaos engineering experimentation platform to measure, understand, and improve application resilience.",
      keyConcepts: [
        { label: "Fault Injection", desc: "Intentionally causing failures (e.g. killing a VM, adding network latency)." },
        { label: "Experiments", desc: "A defined series of faults executed against target resources." },
        { label: "Blast Radius", desc: "Carefully controlling the scope of a chaos experiment to prevent actual customer impact." }
      ]
    },
    realWorld: {
      title: "Game Days",
      description: "Preparing for the worst",
      intro: "We regularly conduct 'Game Days' where we simulate complete zonal outages in Azure to verify our HA architecture actually works.",
      points: [
        "Network Disconnects: We use Chaos Studio to block all traffic to our primary Redis cache to ensure the app gracefully degrades or fails over.",
        "CPU Pressure: We simulate 100% CPU on AKS nodes to test if our Pod Disruption Budgets and Cluster Autoscaler respond fast enough."
      ],
      shortcut: "AWS Fault Injection Simulator == Azure Chaos Studio"
    },
    interview: [
      {
        q: "Why do we perform Chaos Engineering in production?",
        a: "Because staging environments never perfectly replicate production traffic, state, or scale. Testing in production ensures our recovery mechanisms work when real users are relying on them."
      }
    ]
  }
};
