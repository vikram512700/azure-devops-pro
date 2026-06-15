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
      description: "Core principles of Azure Regions & Resource Groups.",
      whatIsIt: "An essential enterprise capability in Azure.",
      keyConcepts: [
        { label: "Concept A", desc: "Fundamentals of Azure Regions & Resource Groups." },
        { label: "Concept B", desc: "Architecture of Azure Regions & Resource Groups." }
      ]
    },
    realWorld: {
      title: "Jio/Reliance Enterprise Use Case",
      description: "How Azure Regions & Resource Groups is used at scale",
      intro: "In a massive GCC, Azure Regions & Resource Groups is critical.",
      points: [
        "High Availability: Deploying across multiple zones.",
        "Security: Zero-trust network integration."
      ],
      shortcut: "AWS equivalent == Azure Azure Regions & Resource Groups"
    },
    interview: [
      {
        q: "How do you secure Azure Regions & Resource Groups?",
        a: "By using private endpoints and Azure AD Managed Identities."
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
      description: "Core principles of Subscriptions, CLI & Portal.",
      whatIsIt: "An essential enterprise capability in Azure.",
      keyConcepts: [
        { label: "Concept A", desc: "Fundamentals of Subscriptions, CLI & Portal." },
        { label: "Concept B", desc: "Architecture of Subscriptions, CLI & Portal." }
      ]
    },
    realWorld: {
      title: "Jio/Reliance Enterprise Use Case",
      description: "How Subscriptions, CLI & Portal is used at scale",
      intro: "In a massive GCC, Subscriptions, CLI & Portal is critical.",
      points: [
        "High Availability: Deploying across multiple zones.",
        "Security: Zero-trust network integration."
      ],
      shortcut: "AWS equivalent == Azure Subscriptions, CLI & Portal"
    },
    interview: [
      {
        q: "How do you secure Subscriptions, CLI & Portal?",
        a: "By using private endpoints and Azure AD Managed Identities."
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
      description: "Core principles of VNETs, Subnets & Peering.",
      whatIsIt: "An essential enterprise capability in Azure.",
      keyConcepts: [
        { label: "Concept A", desc: "Fundamentals of VNETs, Subnets & Peering." },
        { label: "Concept B", desc: "Architecture of VNETs, Subnets & Peering." }
      ]
    },
    realWorld: {
      title: "Jio/Reliance Enterprise Use Case",
      description: "How VNETs, Subnets & Peering is used at scale",
      intro: "In a massive GCC, VNETs, Subnets & Peering is critical.",
      points: [
        "High Availability: Deploying across multiple zones.",
        "Security: Zero-trust network integration."
      ],
      shortcut: "AWS equivalent == Azure VNETs, Subnets & Peering"
    },
    interview: [
      {
        q: "How do you secure VNETs, Subnets & Peering?",
        a: "By using private endpoints and Azure AD Managed Identities."
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
      description: "Core principles of NSGs, Route Tables & Firewalls.",
      whatIsIt: "An essential enterprise capability in Azure.",
      keyConcepts: [
        { label: "Concept A", desc: "Fundamentals of NSGs, Route Tables & Firewalls." },
        { label: "Concept B", desc: "Architecture of NSGs, Route Tables & Firewalls." }
      ]
    },
    realWorld: {
      title: "Jio/Reliance Enterprise Use Case",
      description: "How NSGs, Route Tables & Firewalls is used at scale",
      intro: "In a massive GCC, NSGs, Route Tables & Firewalls is critical.",
      points: [
        "High Availability: Deploying across multiple zones.",
        "Security: Zero-trust network integration."
      ],
      shortcut: "AWS equivalent == Azure NSGs, Route Tables & Firewalls"
    },
    interview: [
      {
        q: "How do you secure NSGs, Route Tables & Firewalls?",
        a: "By using private endpoints and Azure AD Managed Identities."
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
      description: "Core principles of Virtual Machines & VMSS.",
      whatIsIt: "An essential enterprise capability in Azure.",
      keyConcepts: [
        { label: "Concept A", desc: "Fundamentals of Virtual Machines & VMSS." },
        { label: "Concept B", desc: "Architecture of Virtual Machines & VMSS." }
      ]
    },
    realWorld: {
      title: "Jio/Reliance Enterprise Use Case",
      description: "How Virtual Machines & VMSS is used at scale",
      intro: "In a massive GCC, Virtual Machines & VMSS is critical.",
      points: [
        "High Availability: Deploying across multiple zones.",
        "Security: Zero-trust network integration."
      ],
      shortcut: "AWS equivalent == Azure Virtual Machines & VMSS"
    },
    interview: [
      {
        q: "How do you secure Virtual Machines & VMSS?",
        a: "By using private endpoints and Azure AD Managed Identities."
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
      description: "Core principles of App Service & Azure Functions.",
      whatIsIt: "An essential enterprise capability in Azure.",
      keyConcepts: [
        { label: "Concept A", desc: "Fundamentals of App Service & Azure Functions." },
        { label: "Concept B", desc: "Architecture of App Service & Azure Functions." }
      ]
    },
    realWorld: {
      title: "Jio/Reliance Enterprise Use Case",
      description: "How App Service & Azure Functions is used at scale",
      intro: "In a massive GCC, App Service & Azure Functions is critical.",
      points: [
        "High Availability: Deploying across multiple zones.",
        "Security: Zero-trust network integration."
      ],
      shortcut: "AWS equivalent == Azure App Service & Azure Functions"
    },
    interview: [
      {
        q: "How do you secure App Service & Azure Functions?",
        a: "By using private endpoints and Azure AD Managed Identities."
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
      description: "Core principles of Docker Fundamentals & Images.",
      whatIsIt: "An essential enterprise capability in Azure.",
      keyConcepts: [
        { label: "Concept A", desc: "Fundamentals of Docker Fundamentals & Images." },
        { label: "Concept B", desc: "Architecture of Docker Fundamentals & Images." }
      ]
    },
    realWorld: {
      title: "Jio/Reliance Enterprise Use Case",
      description: "How Docker Fundamentals & Images is used at scale",
      intro: "In a massive GCC, Docker Fundamentals & Images is critical.",
      points: [
        "High Availability: Deploying across multiple zones.",
        "Security: Zero-trust network integration."
      ],
      shortcut: "AWS equivalent == Azure Docker Fundamentals & Images"
    },
    interview: [
      {
        q: "How do you secure Docker Fundamentals & Images?",
        a: "By using private endpoints and Azure AD Managed Identities."
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
      description: "Core principles of Multi-Stage Builds & Security.",
      whatIsIt: "An essential enterprise capability in Azure.",
      keyConcepts: [
        { label: "Concept A", desc: "Fundamentals of Multi-Stage Builds & Security." },
        { label: "Concept B", desc: "Architecture of Multi-Stage Builds & Security." }
      ]
    },
    realWorld: {
      title: "Jio/Reliance Enterprise Use Case",
      description: "How Multi-Stage Builds & Security is used at scale",
      intro: "In a massive GCC, Multi-Stage Builds & Security is critical.",
      points: [
        "High Availability: Deploying across multiple zones.",
        "Security: Zero-trust network integration."
      ],
      shortcut: "AWS equivalent == Azure Multi-Stage Builds & Security"
    },
    interview: [
      {
        q: "How do you secure Multi-Stage Builds & Security?",
        a: "By using private endpoints and Azure AD Managed Identities."
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
      description: "Core principles of ACR (Azure Container Registry).",
      whatIsIt: "An essential enterprise capability in Azure.",
      keyConcepts: [
        { label: "Concept A", desc: "Fundamentals of ACR (Azure Container Registry)." },
        { label: "Concept B", desc: "Architecture of ACR (Azure Container Registry)." }
      ]
    },
    realWorld: {
      title: "Jio/Reliance Enterprise Use Case",
      description: "How ACR (Azure Container Registry) is used at scale",
      intro: "In a massive GCC, ACR (Azure Container Registry) is critical.",
      points: [
        "High Availability: Deploying across multiple zones.",
        "Security: Zero-trust network integration."
      ],
      shortcut: "AWS equivalent == Azure ACR (Azure Container Registry)"
    },
    interview: [
      {
        q: "How do you secure ACR (Azure Container Registry)?",
        a: "By using private endpoints and Azure AD Managed Identities."
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
      description: "Core principles of AKS Architecture & Control Plane.",
      whatIsIt: "An essential enterprise capability in Azure.",
      keyConcepts: [
        { label: "Concept A", desc: "Fundamentals of AKS Architecture & Control Plane." },
        { label: "Concept B", desc: "Architecture of AKS Architecture & Control Plane." }
      ]
    },
    realWorld: {
      title: "Jio/Reliance Enterprise Use Case",
      description: "How AKS Architecture & Control Plane is used at scale",
      intro: "In a massive GCC, AKS Architecture & Control Plane is critical.",
      points: [
        "High Availability: Deploying across multiple zones.",
        "Security: Zero-trust network integration."
      ],
      shortcut: "AWS equivalent == Azure AKS Architecture & Control Plane"
    },
    interview: [
      {
        q: "How do you secure AKS Architecture & Control Plane?",
        a: "By using private endpoints and Azure AD Managed Identities."
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
      description: "Core principles of Pods, Deployments & Services.",
      whatIsIt: "An essential enterprise capability in Azure.",
      keyConcepts: [
        { label: "Concept A", desc: "Fundamentals of Pods, Deployments & Services." },
        { label: "Concept B", desc: "Architecture of Pods, Deployments & Services." }
      ]
    },
    realWorld: {
      title: "Jio/Reliance Enterprise Use Case",
      description: "How Pods, Deployments & Services is used at scale",
      intro: "In a massive GCC, Pods, Deployments & Services is critical.",
      points: [
        "High Availability: Deploying across multiple zones.",
        "Security: Zero-trust network integration."
      ],
      shortcut: "AWS equivalent == Azure Pods, Deployments & Services"
    },
    interview: [
      {
        q: "How do you secure Pods, Deployments & Services?",
        a: "By using private endpoints and Azure AD Managed Identities."
      }
    ]
  },
  "12": {
    id: "12",
    title: "Ingress Controllers & Routing",
    subtitle: "Kubernetes / AKS",
    description: "NGINX ingress, TLS termination, and path routing.",
    theory: {
      title: "Ingress Controllers & Routing Theory",
      description: "Core principles of Ingress Controllers & Routing.",
      whatIsIt: "An essential enterprise capability in Azure.",
      keyConcepts: [
        { label: "Concept A", desc: "Fundamentals of Ingress Controllers & Routing." },
        { label: "Concept B", desc: "Architecture of Ingress Controllers & Routing." }
      ]
    },
    realWorld: {
      title: "Jio/Reliance Enterprise Use Case",
      description: "How Ingress Controllers & Routing is used at scale",
      intro: "In a massive GCC, Ingress Controllers & Routing is critical.",
      points: [
        "High Availability: Deploying across multiple zones.",
        "Security: Zero-trust network integration."
      ],
      shortcut: "AWS equivalent == Azure Ingress Controllers & Routing"
    },
    interview: [
      {
        q: "How do you secure Ingress Controllers & Routing?",
        a: "By using private endpoints and Azure AD Managed Identities."
      }
    ]
  },
  "13": {
    id: "13",
    title: "HPA & Network Policies",
    subtitle: "Kubernetes / AKS",
    description: "CPU/memory autoscaling and pod-to-pod traffic control.",
    theory: {
      title: "HPA & Network Policies Theory",
      description: "Core principles of HPA & Network Policies.",
      whatIsIt: "An essential enterprise capability in Azure.",
      keyConcepts: [
        { label: "Concept A", desc: "Fundamentals of HPA & Network Policies." },
        { label: "Concept B", desc: "Architecture of HPA & Network Policies." }
      ]
    },
    realWorld: {
      title: "Jio/Reliance Enterprise Use Case",
      description: "How HPA & Network Policies is used at scale",
      intro: "In a massive GCC, HPA & Network Policies is critical.",
      points: [
        "High Availability: Deploying across multiple zones.",
        "Security: Zero-trust network integration."
      ],
      shortcut: "AWS equivalent == Azure HPA & Network Policies"
    },
    interview: [
      {
        q: "How do you secure HPA & Network Policies?",
        a: "By using private endpoints and Azure AD Managed Identities."
      }
    ]
  },
  "14": {
    id: "14",
    title: "Git Fundamentals & Gitflow",
    subtitle: "DevOps",
    description: "Branching, merging, rebasing, and PR policies.",
    theory: {
      title: "Git Fundamentals & Gitflow Theory",
      description: "Core principles of Git Fundamentals & Gitflow.",
      whatIsIt: "An essential enterprise capability in Azure.",
      keyConcepts: [
        { label: "Concept A", desc: "Fundamentals of Git Fundamentals & Gitflow." },
        { label: "Concept B", desc: "Architecture of Git Fundamentals & Gitflow." }
      ]
    },
    realWorld: {
      title: "Jio/Reliance Enterprise Use Case",
      description: "How Git Fundamentals & Gitflow is used at scale",
      intro: "In a massive GCC, Git Fundamentals & Gitflow is critical.",
      points: [
        "High Availability: Deploying across multiple zones.",
        "Security: Zero-trust network integration."
      ],
      shortcut: "AWS equivalent == Azure Git Fundamentals & Gitflow"
    },
    interview: [
      {
        q: "How do you secure Git Fundamentals & Gitflow?",
        a: "By using private endpoints and Azure AD Managed Identities."
      }
    ]
  },
  "15": {
    id: "15",
    title: "GitHub Actions",
    subtitle: "DevOps",
    description: "Workflows, secrets, and matrix builds.",
    theory: {
      title: "GitHub Actions Theory",
      description: "Core principles of GitHub Actions.",
      whatIsIt: "An essential enterprise capability in Azure.",
      keyConcepts: [
        { label: "Concept A", desc: "Fundamentals of GitHub Actions." },
        { label: "Concept B", desc: "Architecture of GitHub Actions." }
      ]
    },
    realWorld: {
      title: "Jio/Reliance Enterprise Use Case",
      description: "How GitHub Actions is used at scale",
      intro: "In a massive GCC, GitHub Actions is critical.",
      points: [
        "High Availability: Deploying across multiple zones.",
        "Security: Zero-trust network integration."
      ],
      shortcut: "AWS equivalent == Azure GitHub Actions"
    },
    interview: [
      {
        q: "How do you secure GitHub Actions?",
        a: "By using private endpoints and Azure AD Managed Identities."
      }
    ]
  },
  "16": {
    id: "16",
    title: "Azure Repos & Azure Pipelines",
    subtitle: "DevOps",
    description: "YAML pipelines, stages, and Service Connections.",
    theory: {
      title: "Azure Repos & Azure Pipelines Theory",
      description: "Core principles of Azure Repos & Azure Pipelines.",
      whatIsIt: "An essential enterprise capability in Azure.",
      keyConcepts: [
        { label: "Concept A", desc: "Fundamentals of Azure Repos & Azure Pipelines." },
        { label: "Concept B", desc: "Architecture of Azure Repos & Azure Pipelines." }
      ]
    },
    realWorld: {
      title: "Jio/Reliance Enterprise Use Case",
      description: "How Azure Repos & Azure Pipelines is used at scale",
      intro: "In a massive GCC, Azure Repos & Azure Pipelines is critical.",
      points: [
        "High Availability: Deploying across multiple zones.",
        "Security: Zero-trust network integration."
      ],
      shortcut: "AWS equivalent == Azure Azure Repos & Azure Pipelines"
    },
    interview: [
      {
        q: "How do you secure Azure Repos & Azure Pipelines?",
        a: "By using private endpoints and Azure AD Managed Identities."
      }
    ]
  },
  "17": {
    id: "17",
    title: "Release Management & Gates",
    subtitle: "DevOps",
    description: "Environments, approval gates, and rollback strategies.",
    theory: {
      title: "Release Management & Gates Theory",
      description: "Core principles of Release Management & Gates.",
      whatIsIt: "An essential enterprise capability in Azure.",
      keyConcepts: [
        { label: "Concept A", desc: "Fundamentals of Release Management & Gates." },
        { label: "Concept B", desc: "Architecture of Release Management & Gates." }
      ]
    },
    realWorld: {
      title: "Jio/Reliance Enterprise Use Case",
      description: "How Release Management & Gates is used at scale",
      intro: "In a massive GCC, Release Management & Gates is critical.",
      points: [
        "High Availability: Deploying across multiple zones.",
        "Security: Zero-trust network integration."
      ],
      shortcut: "AWS equivalent == Azure Release Management & Gates"
    },
    interview: [
      {
        q: "How do you secure Release Management & Gates?",
        a: "By using private endpoints and Azure AD Managed Identities."
      }
    ]
  },
  "18": {
    id: "18",
    title: "Terraform Basics & State",
    subtitle: "Infrastructure as Code",
    description: "Providers, resources, variables, and remote state in Blob.",
    theory: {
      title: "Terraform Basics & State Theory",
      description: "Core principles of Terraform Basics & State.",
      whatIsIt: "An essential enterprise capability in Azure.",
      keyConcepts: [
        { label: "Concept A", desc: "Fundamentals of Terraform Basics & State." },
        { label: "Concept B", desc: "Architecture of Terraform Basics & State." }
      ]
    },
    realWorld: {
      title: "Jio/Reliance Enterprise Use Case",
      description: "How Terraform Basics & State is used at scale",
      intro: "In a massive GCC, Terraform Basics & State is critical.",
      points: [
        "High Availability: Deploying across multiple zones.",
        "Security: Zero-trust network integration."
      ],
      shortcut: "AWS equivalent == Azure Terraform Basics & State"
    },
    interview: [
      {
        q: "How do you secure Terraform Basics & State?",
        a: "By using private endpoints and Azure AD Managed Identities."
      }
    ]
  },
  "19": {
    id: "19",
    title: "Terraform Modules & Workspaces",
    subtitle: "Infrastructure as Code",
    description: "Reusable components, versioning, and environment separation.",
    theory: {
      title: "Terraform Modules & Workspaces Theory",
      description: "Core principles of Terraform Modules & Workspaces.",
      whatIsIt: "An essential enterprise capability in Azure.",
      keyConcepts: [
        { label: "Concept A", desc: "Fundamentals of Terraform Modules & Workspaces." },
        { label: "Concept B", desc: "Architecture of Terraform Modules & Workspaces." }
      ]
    },
    realWorld: {
      title: "Jio/Reliance Enterprise Use Case",
      description: "How Terraform Modules & Workspaces is used at scale",
      intro: "In a massive GCC, Terraform Modules & Workspaces is critical.",
      points: [
        "High Availability: Deploying across multiple zones.",
        "Security: Zero-trust network integration."
      ],
      shortcut: "AWS equivalent == Azure Terraform Modules & Workspaces"
    },
    interview: [
      {
        q: "How do you secure Terraform Modules & Workspaces?",
        a: "By using private endpoints and Azure AD Managed Identities."
      }
    ]
  },
  "20": {
    id: "20",
    title: "Bicep & ARM Templates",
    subtitle: "Infrastructure as Code",
    description: "Declarative Infrastructure Automation using Microsoft's DSL.",
    theory: {
      title: "Bicep & ARM Templates Theory",
      description: "Core principles of Bicep & ARM Templates.",
      whatIsIt: "An essential enterprise capability in Azure.",
      keyConcepts: [
        { label: "Concept A", desc: "Fundamentals of Bicep & ARM Templates." },
        { label: "Concept B", desc: "Architecture of Bicep & ARM Templates." }
      ]
    },
    realWorld: {
      title: "Jio/Reliance Enterprise Use Case",
      description: "How Bicep & ARM Templates is used at scale",
      intro: "In a massive GCC, Bicep & ARM Templates is critical.",
      points: [
        "High Availability: Deploying across multiple zones.",
        "Security: Zero-trust network integration."
      ],
      shortcut: "AWS equivalent == Azure Bicep & ARM Templates"
    },
    interview: [
      {
        q: "How do you secure Bicep & ARM Templates?",
        a: "By using private endpoints and Azure AD Managed Identities."
      }
    ]
  },
  "21": {
    id: "21",
    title: "Entra ID & RBAC",
    subtitle: "Security",
    description: "Managed identities, custom roles, and PIM.",
    theory: {
      title: "Entra ID & RBAC Theory",
      description: "Core principles of Entra ID & RBAC.",
      whatIsIt: "An essential enterprise capability in Azure.",
      keyConcepts: [
        { label: "Concept A", desc: "Fundamentals of Entra ID & RBAC." },
        { label: "Concept B", desc: "Architecture of Entra ID & RBAC." }
      ]
    },
    realWorld: {
      title: "Jio/Reliance Enterprise Use Case",
      description: "How Entra ID & RBAC is used at scale",
      intro: "In a massive GCC, Entra ID & RBAC is critical.",
      points: [
        "High Availability: Deploying across multiple zones.",
        "Security: Zero-trust network integration."
      ],
      shortcut: "AWS equivalent == Azure Entra ID & RBAC"
    },
    interview: [
      {
        q: "How do you secure Entra ID & RBAC?",
        a: "By using private endpoints and Azure AD Managed Identities."
      }
    ]
  },
  "22": {
    id: "22",
    title: "Key Vault & CSI Driver",
    subtitle: "Security",
    description: "Secrets injection without env vars.",
    theory: {
      title: "Key Vault & CSI Driver Theory",
      description: "Core principles of Key Vault & CSI Driver.",
      whatIsIt: "An essential enterprise capability in Azure.",
      keyConcepts: [
        { label: "Concept A", desc: "Fundamentals of Key Vault & CSI Driver." },
        { label: "Concept B", desc: "Architecture of Key Vault & CSI Driver." }
      ]
    },
    realWorld: {
      title: "Jio/Reliance Enterprise Use Case",
      description: "How Key Vault & CSI Driver is used at scale",
      intro: "In a massive GCC, Key Vault & CSI Driver is critical.",
      points: [
        "High Availability: Deploying across multiple zones.",
        "Security: Zero-trust network integration."
      ],
      shortcut: "AWS equivalent == Azure Key Vault & CSI Driver"
    },
    interview: [
      {
        q: "How do you secure Key Vault & CSI Driver?",
        a: "By using private endpoints and Azure AD Managed Identities."
      }
    ]
  },
  "23": {
    id: "23",
    title: "Azure Storage (Blobs, Files, Tiers)",
    subtitle: "Azure Storage",
    description: "Object storage, hot/cool/archive tiers, and SAS tokens.",
    theory: {
      title: "Azure Storage (Blobs, Files, Tiers) Theory",
      description: "Core principles of Azure Storage (Blobs, Files, Tiers).",
      whatIsIt: "An essential enterprise capability in Azure.",
      keyConcepts: [
        { label: "Concept A", desc: "Fundamentals of Azure Storage (Blobs, Files, Tiers)." },
        { label: "Concept B", desc: "Architecture of Azure Storage (Blobs, Files, Tiers)." }
      ]
    },
    realWorld: {
      title: "Jio/Reliance Enterprise Use Case",
      description: "How Azure Storage (Blobs, Files, Tiers) is used at scale",
      intro: "In a massive GCC, Azure Storage (Blobs, Files, Tiers) is critical.",
      points: [
        "High Availability: Deploying across multiple zones.",
        "Security: Zero-trust network integration."
      ],
      shortcut: "AWS equivalent == Azure Azure Storage (Blobs, Files, Tiers)"
    },
    interview: [
      {
        q: "How do you secure Azure Storage (Blobs, Files, Tiers)?",
        a: "By using private endpoints and Azure AD Managed Identities."
      }
    ]
  },
  "24": {
    id: "24",
    title: "Azure Monitor & Alerts",
    subtitle: "Observability",
    description: "Metrics, dynamic thresholds, and action groups.",
    theory: {
      title: "Azure Monitor & Alerts Theory",
      description: "Core principles of Azure Monitor & Alerts.",
      whatIsIt: "An essential enterprise capability in Azure.",
      keyConcepts: [
        { label: "Concept A", desc: "Fundamentals of Azure Monitor & Alerts." },
        { label: "Concept B", desc: "Architecture of Azure Monitor & Alerts." }
      ]
    },
    realWorld: {
      title: "Jio/Reliance Enterprise Use Case",
      description: "How Azure Monitor & Alerts is used at scale",
      intro: "In a massive GCC, Azure Monitor & Alerts is critical.",
      points: [
        "High Availability: Deploying across multiple zones.",
        "Security: Zero-trust network integration."
      ],
      shortcut: "AWS equivalent == Azure Azure Monitor & Alerts"
    },
    interview: [
      {
        q: "How do you secure Azure Monitor & Alerts?",
        a: "By using private endpoints and Azure AD Managed Identities."
      }
    ]
  },
  "25": {
    id: "25",
    title: "Log Analytics & KQL",
    subtitle: "Observability",
    description: "Centralized logging and Kusto Query Language.",
    theory: {
      title: "Log Analytics & KQL Theory",
      description: "Core principles of Log Analytics & KQL.",
      whatIsIt: "An essential enterprise capability in Azure.",
      keyConcepts: [
        { label: "Concept A", desc: "Fundamentals of Log Analytics & KQL." },
        { label: "Concept B", desc: "Architecture of Log Analytics & KQL." }
      ]
    },
    realWorld: {
      title: "Jio/Reliance Enterprise Use Case",
      description: "How Log Analytics & KQL is used at scale",
      intro: "In a massive GCC, Log Analytics & KQL is critical.",
      points: [
        "High Availability: Deploying across multiple zones.",
        "Security: Zero-trust network integration."
      ],
      shortcut: "AWS equivalent == Azure Log Analytics & KQL"
    },
    interview: [
      {
        q: "How do you secure Log Analytics & KQL?",
        a: "By using private endpoints and Azure AD Managed Identities."
      }
    ]
  },
  "26": {
    id: "26",
    title: "Helm & Package Management",
    subtitle: "Advanced SRE",
    description: "Templating Kubernetes manifests and OCI artifacts.",
    theory: {
      title: "Helm & Package Management Theory",
      description: "Core principles of Helm & Package Management.",
      whatIsIt: "An essential enterprise capability in Azure.",
      keyConcepts: [
        { label: "Concept A", desc: "Fundamentals of Helm & Package Management." },
        { label: "Concept B", desc: "Architecture of Helm & Package Management." }
      ]
    },
    realWorld: {
      title: "Jio/Reliance Enterprise Use Case",
      description: "How Helm & Package Management is used at scale",
      intro: "In a massive GCC, Helm & Package Management is critical.",
      points: [
        "High Availability: Deploying across multiple zones.",
        "Security: Zero-trust network integration."
      ],
      shortcut: "AWS equivalent == Azure Helm & Package Management"
    },
    interview: [
      {
        q: "How do you secure Helm & Package Management?",
        a: "By using private endpoints and Azure AD Managed Identities."
      }
    ]
  },
  "27": {
    id: "27",
    title: "ArgoCD & GitOps",
    subtitle: "Advanced SRE",
    description: "Git as a single source of truth for infra and app state.",
    theory: {
      title: "ArgoCD & GitOps Theory",
      description: "Core principles of ArgoCD & GitOps.",
      whatIsIt: "An essential enterprise capability in Azure.",
      keyConcepts: [
        { label: "Concept A", desc: "Fundamentals of ArgoCD & GitOps." },
        { label: "Concept B", desc: "Architecture of ArgoCD & GitOps." }
      ]
    },
    realWorld: {
      title: "Jio/Reliance Enterprise Use Case",
      description: "How ArgoCD & GitOps is used at scale",
      intro: "In a massive GCC, ArgoCD & GitOps is critical.",
      points: [
        "High Availability: Deploying across multiple zones.",
        "Security: Zero-trust network integration."
      ],
      shortcut: "AWS equivalent == Azure ArgoCD & GitOps"
    },
    interview: [
      {
        q: "How do you secure ArgoCD & GitOps?",
        a: "By using private endpoints and Azure AD Managed Identities."
      }
    ]
  },
  "28": {
    id: "28",
    title: "Cost Management (FinOps) & Policy",
    subtitle: "FinOps",
    description: "Reserved instances, Azure Advisor, and DeployIfNotExists.",
    theory: {
      title: "Cost Management (FinOps) & Policy Theory",
      description: "Core principles of Cost Management (FinOps) & Policy.",
      whatIsIt: "An essential enterprise capability in Azure.",
      keyConcepts: [
        { label: "Concept A", desc: "Fundamentals of Cost Management (FinOps) & Policy." },
        { label: "Concept B", desc: "Architecture of Cost Management (FinOps) & Policy." }
      ]
    },
    realWorld: {
      title: "Jio/Reliance Enterprise Use Case",
      description: "How Cost Management (FinOps) & Policy is used at scale",
      intro: "In a massive GCC, Cost Management (FinOps) & Policy is critical.",
      points: [
        "High Availability: Deploying across multiple zones.",
        "Security: Zero-trust network integration."
      ],
      shortcut: "AWS equivalent == Azure Cost Management (FinOps) & Policy"
    },
    interview: [
      {
        q: "How do you secure Cost Management (FinOps) & Policy?",
        a: "By using private endpoints and Azure AD Managed Identities."
      }
    ]
  },
  "29": {
    id: "29",
    title: "Chaos Engineering (Azure Chaos Studio)",
    subtitle: "Advanced SRE",
    description: "Controlled fault injection and blast radius management.",
    theory: {
      title: "Chaos Engineering (Azure Chaos Studio) Theory",
      description: "Core principles of Chaos Engineering (Azure Chaos Studio).",
      whatIsIt: "An essential enterprise capability in Azure.",
      keyConcepts: [
        { label: "Concept A", desc: "Fundamentals of Chaos Engineering (Azure Chaos Studio)." },
        { label: "Concept B", desc: "Architecture of Chaos Engineering (Azure Chaos Studio)." }
      ]
    },
    realWorld: {
      title: "Jio/Reliance Enterprise Use Case",
      description: "How Chaos Engineering (Azure Chaos Studio) is used at scale",
      intro: "In a massive GCC, Chaos Engineering (Azure Chaos Studio) is critical.",
      points: [
        "High Availability: Deploying across multiple zones.",
        "Security: Zero-trust network integration."
      ],
      shortcut: "AWS equivalent == Azure Chaos Engineering (Azure Chaos Studio)"
    },
    interview: [
      {
        q: "How do you secure Chaos Engineering (Azure Chaos Studio)?",
        a: "By using private endpoints and Azure AD Managed Identities."
      }
    ]
  },
  "30": {
    id: "30",
    title: "Production Architecture Game Day",
    subtitle: "Advanced SRE",
    description: "Simulating complete zonal outages and HA failovers.",
    theory: {
      title: "Production Architecture Game Day Theory",
      description: "Core principles of Production Architecture Game Day.",
      whatIsIt: "An essential enterprise capability in Azure.",
      keyConcepts: [
        { label: "Concept A", desc: "Fundamentals of Production Architecture Game Day." },
        { label: "Concept B", desc: "Architecture of Production Architecture Game Day." }
      ]
    },
    realWorld: {
      title: "Jio/Reliance Enterprise Use Case",
      description: "How Production Architecture Game Day is used at scale",
      intro: "In a massive GCC, Production Architecture Game Day is critical.",
      points: [
        "High Availability: Deploying across multiple zones.",
        "Security: Zero-trust network integration."
      ],
      shortcut: "AWS equivalent == Azure Production Architecture Game Day"
    },
    interview: [
      {
        q: "How do you secure Production Architecture Game Day?",
        a: "By using private endpoints and Azure AD Managed Identities."
      }
    ]
  },
};
