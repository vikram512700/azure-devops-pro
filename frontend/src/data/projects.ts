export type ProjectDifficulty = "Beginner" | "Intermediate" | "Advanced" | "Production" | "DevOps" | "Security" | "Terraform" | "GitHub Actions";
export type ProjectCategory =
  | "Azure Fundamentals"
  | "DevOps"
  | "AKS"
  | "Terraform"
  | "GitHub Actions"
  | "Monitoring"
  | "Security"
  | "Portfolio";

export interface ProjectStep {
  id: number;
  title: string;
  description: string;
  commands: string[];
  expectedOutput?: string;
  validationCmd?: string;
}

export interface ProjectInterviewQ {
  q: string;
  a: string;
  level: "Basic" | "Intermediate" | "Advanced";
}

export interface ProjectArch {
  nodes: string[];
  connections: string[];
  description: string;
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  difficulty: ProjectDifficulty;
  category: ProjectCategory;
  estimatedHours: number;
  isFeatured: boolean;
  linkedModuleIds: string[];
  skills: string[];
  deliverables: string[];
  architecture: ProjectArch;
  steps: ProjectStep[];
  interviewQuestions: ProjectInterviewQ[];
  githubTemplateUrl?: string;
  jdKeywords: string[];
}

export const projectsData: Record<string, Project> = {
  p1: {
    id: "p1",
    title: "Azure VM Deployment",
    subtitle: "End-to-End VM Provisioning with Secure Networking",
    difficulty: "Beginner",
    category: "Azure Fundamentals",
    estimatedHours: 2,
    isFeatured: false,
    linkedModuleIds: ["1", "2", "3"],
    skills: ["Resource Groups", "VNET", "NSG", "VM", "Azure CLI"],
    deliverables: ["Architecture diagram", "Deployment script", "NSG rule validation"],
    jdKeywords: ["Azure Virtual Machines", "NSG", "Resource Groups", "Azure CLI"],
    architecture: {
      description: "Standard single VM deployment using Azure Virtual Network and secured via Network Security Group.",
      nodes: ["Internet", "NSG (inbound 22/80)", "VNET (10.0.0.0/16)", "Subnet (10.0.1.0/24)", "VM (Standard_B2s)", "OS Disk (Premium SSD 30 GB)"],
      connections: [
        "Internet → NSG",
        "NSG → VNET",
        "VNET → Subnet",
        "Subnet → VM",
        "VM → OS Disk"
      ]
    },
    steps: [
      {
        id: 1,
        title: "Login and Context",
        description: "Authenticate to Azure and set the active subscription.",
        commands: [
          "az login",
          "az account set --subscription [SUBSCRIPTION_ID]"
        ]
      },
      {
        id: 2,
        title: "Resource Group",
        description: "Create a resource group with mandatory tagging policies.",
        commands: [
          "az group create --name rg-vm-lab-[YOUR_ALIAS] --location eastus --tags env=learning owner=[YOUR_ALIAS] project=vm-lab"
        ]
      },
      {
        id: 3,
        title: "Virtual Network",
        description: "Provision the VNET and the default subnet.",
        commands: [
          "az network vnet create --resource-group rg-vm-lab-[YOUR_ALIAS] --name vnet-vm-lab --address-prefix 10.0.0.0/16 --subnet-name snet-default --subnet-prefix 10.0.1.0/24"
        ]
      },
      {
        id: 4,
        title: "Network Security Group",
        description: "Secure the network with an NSG allowing SSH access.",
        commands: [
          "az network nsg create --resource-group rg-vm-lab-[YOUR_ALIAS] --name nsg-vm-lab",
          "az network nsg rule create --resource-group rg-vm-lab-[YOUR_ALIAS] --nsg-name nsg-vm-lab --name allow-ssh --priority 1000 --access Allow --direction Inbound --protocol Tcp --destination-port-ranges 22"
        ]
      },
      {
        id: 5,
        title: "Deploy Virtual Machine",
        description: "Spin up the compute instance attached to the network.",
        commands: [
          "az vm create --resource-group rg-vm-lab-[YOUR_ALIAS] --name vm-lab-01 --image Ubuntu2204 --size Standard_B2s --vnet-name vnet-vm-lab --subnet snet-default --nsg nsg-vm-lab --admin-username azureuser --generate-ssh-keys --zone 1"
        ]
      },
      {
        id: 6,
        title: "Validation",
        description: "Verify the VM is running and retrieve the public IP.",
        commands: [
          "az vm show --resource-group rg-vm-lab-[YOUR_ALIAS] --name vm-lab-01 --query \"{State:powerState,IP:publicIpAddress}\" -o table"
        ]
      }
    ],
    interviewQuestions: [
      { q: "What is the difference between NSG and Azure Firewall?", a: "NSG operates at layer 3/4 filtering traffic by IP/port per subnet/NIC. Firewall is a central stateful service operating up to layer 7 with advanced threat intelligence and routing.", level: "Basic" },
      { q: "What are availability zones and why use `--zone 1`?", a: "Availability Zones are physically separate data centers within a region. Deploying to a specific zone protects against data center-level failures.", level: "Basic" },
      { q: "How would you restrict SSH to only a corporate IP range?", a: "Update the NSG rule `--source-address-prefixes` to match the exact corporate public IP CIDR rather than '*'.", level: "Intermediate" },
      { q: "How would you replace the public IP with Azure Bastion for production?", a: "Remove the public IP from the VM, deploy an AzureBastionSubnet, provision an Azure Bastion Host, and connect securely over TLS via the Azure Portal without exposing SSH.", level: "Advanced" }
    ]
  },
  p2: {
    id: "p2",
    title: "Static Website Hosting",
    subtitle: "Global Content Delivery with Storage Accounts and CDN",
    difficulty: "Beginner",
    category: "Azure Fundamentals",
    estimatedHours: 1.5,
    isFeatured: false,
    linkedModuleIds: ["5"],
    skills: ["Storage Account", "Static Website", "Azure CDN", "Custom Domain"],
    deliverables: ["Storage Account", "CDN Profile", "Deployed index.html"],
    jdKeywords: ["Azure Storage", "CDN", "Static Site", "HTTPS"],
    architecture: {
      description: "Serverless web hosting using blob storage static website endpoints, globally accelerated by Azure CDN.",
      nodes: ["User Browser", "HTTPS Connection", "Azure CDN (global POP)", "Storage Account ($web)"],
      connections: [
        "User Browser → HTTPS Connection",
        "HTTPS Connection → Azure CDN",
        "Azure CDN → Storage Account (Origin Pull)"
      ]
    },
    steps: [
      {
        id: 1,
        title: "Create Storage Account",
        description: "Provision a v2 storage account with secure defaults.",
        commands: [
          "az storage account create --name sa[YOURALIAS]static --resource-group [RG_NAME] --location eastus --sku Standard_LRS --kind StorageV2 --https-only true --min-tls-version TLS1_2"
        ]
      },
      {
        id: 2,
        title: "Enable Static Website",
        description: "Turn on static website hosting on the blob service.",
        commands: [
          "az storage blob service-properties update --account-name sa[YOURALIAS]static --static-website --index-document index.html --404-document 404.html"
        ]
      },
      {
        id: 3,
        title: "Upload Files",
        description: "Deploy the index.html payload to the $web container.",
        commands: [
          "echo '<h1>Deployed by Vikram on Azure</h1>' > index.html",
          "az storage blob upload --account-name sa[YOURALIAS]static --container-name '$web' --name index.html --file index.html --content-type \"text/html\""
        ]
      },
      {
        id: 4,
        title: "Provision CDN Profile",
        description: "Create a CDN profile and endpoint to globally cache the storage account.",
        commands: [
          "az cdn profile create --name cdn-static-lab --resource-group [RG_NAME] --sku Standard_Microsoft",
          "az cdn endpoint create --name ep-[YOURALIAS] --profile-name cdn-static-lab --resource-group [RG_NAME] --origin sa[YOURALIAS]static.z13.web.core.windows.net --origin-host-header sa[YOURALIAS]static.z13.web.core.windows.net --https-port 443"
        ]
      }
    ],
    interviewQuestions: [
      { q: "Why use Azure CDN in front of a Static Website?", a: "CDN drastically reduces latency by caching content at edge PoPs globally. It also offloads traffic from the origin storage account and provides DDoS protection.", level: "Basic" },
      { q: "How do you map a custom domain?", a: "You configure a CNAME record in your DNS provider pointing to the CDN endpoint, then add the custom domain via `az cdn custom-domain create` and enable managed HTTPS.", level: "Intermediate" }
    ]
  },
  p3: {
    id: "p3",
    title: "App Service Blue-Green Deployment",
    subtitle: "PaaS Web Hosting with Deployment Slots",
    difficulty: "Beginner",
    category: "Azure Fundamentals",
    estimatedHours: 2,
    isFeatured: false,
    linkedModuleIds: ["6"],
    skills: ["App Service Plan", "Deployment Slots", "Autoscale", "App Insights"],
    deliverables: ["Linux App Service", "Staging Slot", "Production Swap"],
    jdKeywords: ["App Service", "Deployment Slots", "Blue-Green", "Application Insights"],
    architecture: {
      description: "PaaS web hosting environment featuring zero-downtime blue-green deployments via staging slots.",
      nodes: ["Internet Traffic", "Azure App Service Router", "Production Slot", "Staging Slot", "Application Insights"],
      connections: [
        "Internet Traffic → App Service Router",
        "App Service Router → Production Slot",
        "App Service Router → Staging Slot (Preview Traffic)",
        "Production Slot → Application Insights"
      ]
    },
    steps: [
      {
        id: 1,
        title: "App Service Plan",
        description: "Create the underlying compute infrastructure (S1 tier).",
        commands: [
          "az appservice plan create --name asp-lab-[YOURALIAS] --resource-group [RG_NAME] --sku S1 --is-linux"
        ]
      },
      {
        id: 2,
        title: "Create Web App",
        description: "Provision the Node.js runtime web application.",
        commands: [
          "az webapp create --name app-[YOURALIAS]-lab --resource-group [RG_NAME] --plan asp-lab-[YOURALIAS] --runtime \"NODE:18-lts\""
        ]
      },
      {
        id: 3,
        title: "Deployment Slot",
        description: "Create a 'staging' slot for safe deployments.",
        commands: [
          "az webapp deployment slot create --name app-[YOURALIAS]-lab --resource-group [RG_NAME] --slot staging"
        ]
      },
      {
        id: 4,
        title: "Deploy & Swap",
        description: "Deploy code to staging, then swap seamlessly to production.",
        commands: [
          "zip -r app.zip . -x \"*.git*\"",
          "az webapp deployment source config-zip --resource-group [RG_NAME] --name app-[YOURALIAS]-lab --slot staging --src app.zip",
          "az webapp deployment slot swap --resource-group [RG_NAME] --name app-[YOURALIAS]-lab --slot staging --target-slot production"
        ]
      }
    ],
    interviewQuestions: [
      { q: "What is the advantage of Deployment Slots?", a: "They allow you to validate code in a live environment (staging) without affecting customers. When ready, you perform a zero-downtime swap of the IP routing to production.", level: "Basic" },
      { q: "What happens if the code crashes after swapping?", a: "You simply perform the swap command again. Because the previous production code is now sitting in the staging slot, swapping reverts the environment instantly.", level: "Intermediate" }
    ]
  },
  p4: {
    id: "p4",
    title: "Infrastructure with Terraform",
    subtitle: "Declarative Infrastructure as Code State Management",
    difficulty: "Intermediate",
    category: "Terraform",
    estimatedHours: 3,
    isFeatured: true,
    linkedModuleIds: ["18", "19"],
    skills: ["Terraform HCL", "State Management", "Variables", "Modules"],
    deliverables: ["tfstate backend", "main.tf", "variables.tf"],
    jdKeywords: ["Terraform", "IaC", "Remote State", "azurerm provider"],
    architecture: {
      description: "Terraform remote state architecture managing an Azure deployment.",
      nodes: ["Terraform CLI", "azurerm provider", "Azure Blob Storage (tfstate)", "Azure Resource Group", "VNET", "NSG", "VM"],
      connections: [
        "Terraform CLI → azurerm provider",
        "azurerm provider → Azure Blob Storage (Locks state)",
        "azurerm provider → Azure Resource Group",
        "Azure Resource Group → VNET",
        "Azure Resource Group → VM"
      ]
    },
    steps: [
      {
        id: 1,
        title: "Directory Setup",
        description: "Prepare the module structure.",
        commands: [
          "mkdir -p terraform-azure-lab/{modules/vm,environments/dev}",
          "cd terraform-azure-lab"
        ]
      },
      {
        id: 2,
        title: "Write Configuration",
        description: "Create main.tf with the azurerm provider and remote backend block.",
        commands: [
          "cat > main.tf << 'EOF'",
          "# Use Terraform block to define backend and providers",
          "EOF"
        ]
      },
      {
        id: 3,
        title: "Terraform Init & Plan",
        description: "Initialize the workspace and preview changes.",
        commands: [
          "terraform init",
          "terraform fmt",
          "terraform validate",
          "terraform plan -out=tfplan"
        ]
      },
      {
        id: 4,
        title: "Apply Configuration",
        description: "Apply the plan to create real Azure resources.",
        commands: [
          "terraform apply tfplan",
          "terraform state list"
        ]
      }
    ],
    interviewQuestions: [
      { q: "What is `terraform.tfstate` and why should it never be in Git?", a: "State files map real-world resources to your configuration. They often contain plain-text secrets, passwords, and connection strings, which would be compromised if committed to Git.", level: "Basic" },
      { q: "Explain `terraform plan` vs `terraform apply`.", a: "Plan performs a dry-run and calculates the delta between local config and remote state. Apply executes those delta changes. Saving a plan file `-out=tfplan` ensures apply runs exactly what was approved.", level: "Intermediate" },
      { q: "Your Terraform state is locked. How do you safely fix it?", a: "Verify no pipeline is currently running. If it crashed midway, you can manually break the lease on the Azure Blob storage file using Azure Portal/CLI, or run `terraform force-unlock <LOCK_ID>`.", level: "Advanced" }
    ]
  },
  p5: {
    id: "p5",
    title: "Dockerized Node.js Application",
    subtitle: "Multi-stage Builds and Container Security",
    difficulty: "Intermediate",
    category: "DevOps",
    estimatedHours: 2.5,
    isFeatured: true,
    linkedModuleIds: ["7", "8"],
    skills: ["Dockerfile", "Multi-stage builds", "ACR", "Container scanning"],
    deliverables: ["Dockerfile", "Azure Container Registry", "Trivy Scan Results"],
    jdKeywords: ["Docker", "ACR", "Container", "Multi-stage build", "Trivy"],
    architecture: {
      description: "Secure containerization lifecycle from multi-stage local build to vulnerability scanning and ACR registry storage.",
      nodes: ["Source Code", "Docker Multi-stage Build", "Azure Container Registry", "Trivy Security Scanner", "Azure Container Instances"],
      connections: [
        "Source Code → Docker Multi-stage Build",
        "Docker Multi-stage Build → Azure Container Registry (Push)",
        "Azure Container Registry → Trivy Security Scanner",
        "Azure Container Registry → Azure Container Instances (Pull)"
      ]
    },
    steps: [
      {
        id: 1,
        title: "Write Multi-stage Dockerfile",
        description: "Create a Dockerfile that separates build dependencies from the runtime image.",
        commands: [
          "cat > Dockerfile << 'EOF'",
          "# Stage 1: Build",
          "FROM node:18-alpine AS builder",
          "...",
          "EOF"
        ]
      },
      {
        id: 2,
        title: "Create ACR",
        description: "Provision a private Azure Container Registry.",
        commands: [
          "az acr create --name acr[YOURALIAS]lab --resource-group [RG_NAME] --sku Basic --admin-enabled false"
        ]
      },
      {
        id: 3,
        title: "ACR Build",
        description: "Offload the docker build process to Azure using ACR Tasks.",
        commands: [
          "az acr build --registry acr[YOURALIAS]lab --image myapp:v1.0 --file Dockerfile ."
        ]
      },
      {
        id: 4,
        title: "Security Scan",
        description: "Scan the generated image using Trivy, failing on critical vulnerabilities.",
        commands: [
          "trivy image acr[YOURALIAS]lab.azurecr.io/myapp:v1.0 --severity HIGH,CRITICAL --exit-code 1"
        ]
      }
    ],
    interviewQuestions: [
      { q: "Why use Multi-stage builds in Docker?", a: "It drastically reduces image size and attack surface by omitting build tools (like compilers, npm cache) from the final production runtime image.", level: "Basic" },
      { q: "Why keep `--admin-enabled false` on ACR?", a: "Admin credentials are a shared secret. Enterprise best practice relies on Azure Entra ID (Managed Identities or Service Principals) mapped with `AcrPull` or `AcrPush` RBAC roles for secure authentication.", level: "Intermediate" }
    ]
  }
};
