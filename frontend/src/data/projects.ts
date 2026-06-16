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
  },
  p6: {
    id: "p6",
    title: "CI/CD Pipeline to App Service",
    subtitle: "Automated Build, Test, and Deploy with GitHub Actions",
    difficulty: "Intermediate",
    category: "GitHub Actions",
    estimatedHours: 3,
    isFeatured: true,
    linkedModuleIds: ["15", "16"],
    skills: ["GitHub Actions", "CI/CD", "App Service", "Container Deployments"],
    deliverables: ["GitHub Actions Workflow", "Deployed App Service"],
    jdKeywords: ["GitHub Actions", "CI/CD"],
    architecture: {
      description: "End-to-end continuous integration and deployment pipeline targeting Azure App Service.",
      nodes: ["GitHub Repository", "GitHub Actions", "Trivy Scan", "Azure Container Registry", "App Service (Staging)", "App Service (Production)"],
      connections: [
        "GitHub Repository → GitHub Actions (Push event)",
        "GitHub Actions → Trivy Scan",
        "Trivy Scan → Azure Container Registry (Build/Push)",
        "Azure Container Registry → App Service (Staging Slot Update)",
        "App Service (Staging) → App Service (Production) (Swap)"
      ]
    },
    steps: [
      {
        id: 1,
        title: "Create Workflow File",
        description: "Set up the basic GitHub Actions YAML structure.",
        commands: [
          "mkdir -p .github/workflows",
          "touch .github/workflows/deploy.yml"
        ]
      },
      {
        id: 2,
        title: "Define CI Stages",
        description: "Configure Node.js setup, testing, and container vulnerability scanning.",
        commands: [
          "cat << 'EOF' > .github/workflows/deploy.yml",
          "name: CI/CD → Azure App Service",
          "...",
          "EOF"
        ]
      },
      {
        id: 3,
        title: "Configure Secrets",
        description: "Add necessary Azure credentials to your GitHub repository secrets.",
        commands: [
          "gh secret set ACR_USERNAME --body \"$ACR_USER\"",
          "gh secret set ACR_PASSWORD --body \"$ACR_PASS\"",
          "gh secret set WEBAPP_NAME --body \"app-[YOURALIAS]-lab\""
        ]
      },
      {
        id: 4,
        title: "Trigger Pipeline",
        description: "Push changes to trigger the automated build and deployment.",
        commands: [
          "git add .",
          "git commit -m \"setup: add ci/cd pipeline\"",
          "git push origin main"
        ]
      }
    ],
    interviewQuestions: [
      { q: "What is the difference between Continuous Integration and Continuous Deployment?", a: "CI involves automatically building and testing code on every commit. CD extends this by automatically deploying the validated code to a staging or production environment.", level: "Basic" },
      { q: "How do you securely manage Azure credentials in GitHub Actions?", a: "Use GitHub Secrets to store credentials or, preferably, use OpenID Connect (OIDC) to authenticate GitHub Actions to Azure without storing long-lived credentials.", level: "Intermediate" }
    ]
  },
  p7: {
    id: "p7",
    title: "AKS Production Deployment",
    subtitle: "Highly Available Kubernetes with Azure CNI and Managed Identity",
    difficulty: "Advanced",
    category: "AKS",
    estimatedHours: 5,
    isFeatured: true,
    linkedModuleIds: ["9", "10", "11", "12"],
    skills: ["AKS", "Azure CNI", "ACR integration", "Ingress", "Managed Identity", "HPA"],
    deliverables: ["AKS Cluster", "HPA Config", "Deployed Workloads"],
    jdKeywords: ["AKS", "Kubernetes", "Ingress", "KEDA", "Managed Identity", "Azure CNI"],
    architecture: {
      description: "A production-grade Azure Kubernetes Service architecture with advanced networking and autoscale capabilities.",
      nodes: ["Application Gateway (WAF)", "AGIC", "AKS Cluster (Azure CNI)", "System Node Pool", "User Node Pool (Autoscale)", "Managed Identity"],
      connections: [
        "Internet → Application Gateway (WAF)",
        "Application Gateway → AGIC",
        "AGIC → User Node Pool (Pods)",
        "User Node Pool → Managed Identity (ACR Pull/Key Vault)"
      ]
    },
    steps: [
      {
        id: 1,
        title: "Provision AKS Cluster",
        description: "Create an AKS cluster with advanced networking and identity settings.",
        commands: [
          "az aks create --resource-group [RG_NAME] --name aks-prod-[YOURALIAS] --node-count 2 --node-vm-size Standard_D2s_v3 --network-plugin azure --network-policy azure --enable-managed-identity --enable-workload-identity --zones 1 2 3"
        ]
      },
      {
        id: 2,
        title: "Attach Container Registry",
        description: "Grant the AKS cluster pull permissions to your ACR.",
        commands: [
          "ACR_ID=$(az acr show --name acr[YOURALIAS]lab --query id -o tsv)",
          "az aks update --name aks-prod-[YOURALIAS] --resource-group [RG_NAME] --attach-acr $ACR_ID"
        ]
      },
      {
        id: 3,
        title: "Deploy Workload",
        description: "Deploy the application with resource limits and topology spread constraints.",
        commands: [
          "kubectl apply -f deployment.yaml"
        ]
      },
      {
        id: 4,
        title: "Configure Autoscaling",
        description: "Set up a Horizontal Pod Autoscaler (HPA) to scale pods based on CPU usage.",
        commands: [
          "kubectl autoscale deployment myapp --cpu-percent=70 --min=3 --max=10",
          "kubectl get hpa"
        ]
      }
    ],
    interviewQuestions: [
      { q: "What is Azure CNI and how does it differ from Kubenet?", a: "Azure CNI assigns every pod an IP from the subnet, making them directly routable in the VNET. Kubenet uses NAT and internal routing, saving VNET IP space but adding networking complexity.", level: "Advanced" },
      { q: "Why do we separate System and User node pools?", a: "System pools host critical cluster components (CoreDNS, metrics-server). Isolating them prevents user applications from starving the cluster control plane of resources.", level: "Intermediate" }
    ]
  },
  p8: {
    id: "p8",
    title: "GitOps with ArgoCD",
    subtitle: "Declarative Kubernetes Configuration Management",
    difficulty: "Advanced",
    category: "DevOps",
    estimatedHours: 4,
    isFeatured: true,
    linkedModuleIds: ["27"],
    skills: ["ArgoCD", "GitOps", "App-of-Apps", "Rollback"],
    deliverables: ["ArgoCD Deployment", "GitOps Repository", "Automated Sync"],
    jdKeywords: ["ArgoCD", "GitOps", "Helm", "Sync", "Rollback"],
    architecture: {
      description: "Implementation of the GitOps pattern where a Git repository serves as the single source of truth for the cluster state.",
      nodes: ["Git Repository (Config)", "ArgoCD Controller", "Kubernetes API", "Target Namespace"],
      connections: [
        "ArgoCD Controller → Git Repository (Polls for changes)",
        "ArgoCD Controller → Kubernetes API (Applies manifests)",
        "Kubernetes API → Target Namespace (Updates state)"
      ]
    },
    steps: [
      {
        id: 1,
        title: "Install ArgoCD",
        description: "Deploy the ArgoCD control plane to your cluster.",
        commands: [
          "kubectl create namespace argocd",
          "kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml"
        ]
      },
      {
        id: 2,
        title: "Access ArgoCD UI",
        description: "Retrieve credentials and set up port-forwarding for the dashboard.",
        commands: [
          "kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath=\"{.data.password}\" | base64 -d",
          "kubectl port-forward svc/argocd-server -n argocd 8080:443"
        ]
      },
      {
        id: 3,
        title: "Create Application",
        description: "Link a Git repository to ArgoCD and configure automated syncing.",
        commands: [
          "argocd app create myapp --repo https://github.com/[YOURALIAS]/myapp-gitops --path helm/myapp --dest-server https://kubernetes.default.svc --dest-namespace default --sync-policy automated"
        ]
      },
      {
        id: 4,
        title: "Test Rollback",
        description: "Simulate a bad deployment and perform a rapid GitOps rollback.",
        commands: [
          "argocd app history myapp",
          "argocd app rollback myapp [REVISION_ID]"
        ]
      }
    ],
    interviewQuestions: [
      { q: "What problem does GitOps solve over traditional CI/CD Push models?", a: "GitOps prevents 'configuration drift' by continuously ensuring the cluster matches Git. It removes the need to give CI pipelines direct admin access to the Kubernetes cluster.", level: "Intermediate" },
      { q: "What is an 'App of Apps' pattern in ArgoCD?", a: "It's a pattern where a root ArgoCD Application points to a directory containing other ArgoCD Application manifests, allowing you to bootstrap an entire cluster from a single repository.", level: "Advanced" }
    ]
  },
  p9: {
    id: "p9",
    title: "Observability Stack",
    subtitle: "Prometheus, Grafana, and Custom Alerting",
    difficulty: "Advanced",
    category: "Monitoring",
    estimatedHours: 4,
    isFeatured: true,
    linkedModuleIds: ["24", "25"],
    skills: ["Prometheus", "Grafana", "KQL", "AlertManager"],
    deliverables: ["kube-prometheus-stack", "Custom Dashboard", "Alert Rules"],
    jdKeywords: ["Prometheus", "Grafana", "Alerting"],
    architecture: {
      description: "A comprehensive monitoring solution using the kube-prometheus-stack Helm chart.",
      nodes: ["AKS Cluster", "Prometheus Server", "AlertManager", "Grafana Dashboard", "Azure Monitor (Container Insights)"],
      connections: [
        "Prometheus Server → AKS Cluster (Scrapes metrics)",
        "Prometheus Server → AlertManager (Fires alerts)",
        "Grafana Dashboard → Prometheus Server (Queries data)",
        "Azure Monitor → AKS Cluster (Diagnostic logs)"
      ]
    },
    steps: [
      {
        id: 1,
        title: "Add Helm Repositories",
        description: "Register Prometheus and Grafana Helm charts.",
        commands: [
          "helm repo add prometheus-community https://prometheus-community.github.io/helm-charts",
          "helm repo add grafana https://grafana.github.io/helm-charts",
          "helm repo update"
        ]
      },
      {
        id: 2,
        title: "Install Monitoring Stack",
        description: "Deploy Prometheus, Alertmanager, and Grafana using Helm.",
        commands: [
          "helm upgrade --install monitoring prometheus-community/kube-prometheus-stack --namespace monitoring --create-namespace --set grafana.adminPassword=Admin@12345"
        ]
      },
      {
        id: 3,
        title: "Configure Alert Rules",
        description: "Create a PrometheusRule custom resource to alert on failing pods.",
        commands: [
          "kubectl apply -f pod-alert.yaml"
        ]
      },
      {
        id: 4,
        title: "Enable Azure Monitor",
        description: "Integrate Azure Container Insights for deep log analytics.",
        commands: [
          "az aks enable-addons --addons monitoring --name aks-prod-[YOURALIAS] --resource-group [RG_NAME] --workspace-resource-id [LOG_ANALYTICS_WS_ID]"
        ]
      }
    ],
    interviewQuestions: [
      { q: "How does Prometheus gather metrics?", a: "Prometheus uses a 'pull' model, scraping metrics endpoints (usually /metrics) exposed by services over HTTP at defined intervals.", level: "Basic" },
      { q: "What is PromQL?", a: "Prometheus Query Language. It allows users to select and aggregate time series data in real time, forming the basis for Grafana dashboards and Alertmanager rules.", level: "Intermediate" }
    ]
  },
  p10: {
    id: "p10",
    title: "Enterprise Landing Zone",
    subtitle: "Hub-Spoke Topology with Azure Firewall",
    difficulty: "Production",
    category: "Azure Fundamentals",
    estimatedHours: 6,
    isFeatured: true,
    linkedModuleIds: ["2", "3", "22", "23"],
    skills: ["Hub-Spoke", "Azure Firewall", "Private Endpoints", "Key Vault", "Policy"],
    deliverables: ["Hub VNET", "Spoke VNET", "Azure Firewall", "Private Endpoints"],
    jdKeywords: ["Landing Zone", "Hub-Spoke", "Private Endpoint", "Azure Firewall", "Azure Policy"],
    architecture: {
      description: "A secure, scalable enterprise network topology enforcing centralized egress traffic inspection.",
      nodes: ["Hub VNET", "Azure Firewall", "Spoke VNET (Workloads)", "Private Endpoint (Key Vault)", "UDR (Route Table)"],
      connections: [
        "Spoke VNET → Hub VNET (VNET Peering)",
        "Spoke VNET → UDR (Default Route 0.0.0.0/0)",
        "UDR → Azure Firewall (Traffic Inspection)",
        "Spoke Subnet → Private Endpoint (Secure PaaS Access)"
      ]
    },
    steps: [
      {
        id: 1,
        title: "Create Hub Network",
        description: "Provision the central Hub VNET and AzureFirewallSubnet.",
        commands: [
          "az network vnet create --name vnet-hub --resource-group [HUB_RG] --address-prefix 10.0.0.0/16 --subnet-name AzureFirewallSubnet --subnet-prefix 10.0.0.0/26"
        ]
      },
      {
        id: 2,
        title: "Deploy Azure Firewall",
        description: "Deploy the managed firewall to inspect and filter all traffic.",
        commands: [
          "az network firewall create --name fw-hub --resource-group [HUB_RG] --location eastus --vnet-name vnet-hub --sku-tier Standard"
        ]
      },
      {
        id: 3,
        title: "Configure Spoke & Peering",
        description: "Create workload VNETs and peer them to the Hub.",
        commands: [
          "az network vnet create --name vnet-spoke-workloads --resource-group [SPOKE_RG] --address-prefix 10.1.0.0/16",
          "az network vnet peering create --name hub-to-spoke --resource-group [HUB_RG] --vnet-name vnet-hub --remote-vnet vnet-spoke-workloads --allow-forwarded-traffic"
        ]
      },
      {
        id: 4,
        title: "Implement UDR",
        description: "Force all spoke egress traffic through the Azure Firewall via Route Tables.",
        commands: [
          "az network route-table route create --name default-to-firewall --route-table-name rt-spoke --resource-group [SPOKE_RG] --address-prefix 0.0.0.0/0 --next-hop-type VirtualAppliance --next-hop-ip-address $FW_IP"
        ]
      },
      {
        id: 5,
        title: "Deploy Private Endpoints",
        description: "Secure PaaS services (Key Vault) by attaching them directly to the spoke VNET.",
        commands: [
          "az network private-endpoint create --name pe-keyvault --resource-group [SPOKE_RG] --vnet-name vnet-spoke-workloads --subnet DataSubnet --private-connection-resource-id $KV_ID --group-id vault"
        ]
      }
    ],
    interviewQuestions: [
      { q: "Why use a Hub and Spoke network topology?", a: "It provides centralized management for security (Firewall) and connectivity (VPN/ExpressRoute), reducing costs and preventing individual teams from bypassing corporate security controls.", level: "Intermediate" },
      { q: "What is the difference between Service Endpoints and Private Endpoints?", a: "Service Endpoints route traffic over the Azure backbone but the PaaS service retains a public IP. Private Endpoints inject a private IP from your VNET directly into the PaaS service, allowing you to completely disable public network access.", level: "Advanced" }
    ]
  },
  p11: {
    id: "p11",
    title: "Multi-Environment Platform",
    subtitle: "Dev → QA → UAT → Prod Deployment Pipeline",
    difficulty: "Production",
    category: "DevOps",
    estimatedHours: 5,
    isFeatured: true,
    linkedModuleIds: ["15", "16", "17", "18"],
    skills: ["Multi-env", "GitOps", "Pipeline gates", "Terraform Workspaces"],
    deliverables: ["Terraform Workspaces", "GitHub Actions Environments", "Approval Gates"],
    jdKeywords: ["Multi-env", "GitOps", "Pipeline gates"],
    architecture: {
      description: "An enterprise-grade deployment topology spanning multiple isolated environments with manual approval gates.",
      nodes: ["Feature Branch", "Main Branch", "GitHub Actions", "Dev Environment", "QA Environment", "UAT Environment", "Production Environment"],
      connections: [
        "Feature Branch → Dev Environment (Auto-deploy on PR)",
        "Main Branch → QA Environment (Auto-deploy on Merge)",
        "QA Environment → UAT Environment (QA Lead Approval)",
        "UAT Environment → Production Environment (Product Owner Approval)"
      ]
    },
    steps: [
      {
        id: 1,
        title: "Terraform Workspaces",
        description: "Create state isolation for each environment using Terraform workspaces.",
        commands: [
          "terraform workspace new dev",
          "terraform workspace new qa",
          "terraform workspace new uat",
          "terraform workspace new prod"
        ]
      },
      {
        id: 2,
        title: "Environment Variables",
        description: "Apply infrastructure using environment-specific tfvars.",
        commands: [
          "terraform workspace select dev",
          "terraform apply -var-file=\"environments/dev.tfvars\""
        ]
      },
      {
        id: 3,
        title: "GitHub Environments",
        description: "Configure GitHub repository environments with protection rules and reviewers.",
        commands: [
          "gh api -X PUT /repos/[USER]/[REPO]/environments/production",
          "# Add manual approval gates via GitHub UI for Production"
        ]
      },
      {
        id: 4,
        title: "Deployment Job",
        description: "Reference the GitHub environment in the workflow job to enforce the gate.",
        commands: [
          "cat << 'EOF' > deploy-prod.yml",
          "jobs:",
          "  deploy-prod:",
          "    environment:",
          "      name: production",
          "    runs-on: ubuntu-latest",
          "EOF"
        ]
      }
    ],
    interviewQuestions: [
      { q: "How do you achieve environment parity?", a: "By using the exact same Terraform modules and Docker images across all environments, varying only the environment-specific variables (like VM size or replica counts) via tfvars and configuration maps.", level: "Intermediate" },
      { q: "Why use Terraform Workspaces vs separate state files/directories?", a: "Workspaces allow you to use a single directory of Terraform code while maintaining separate state files. However, for strict blast-radius isolation in production, many enterprises prefer entirely separate state backends and directory structures.", level: "Advanced" }
    ]
  },
  p12: {
    id: "p12",
    title: "Highly Available AKS Platform",
    subtitle: "Multi-Zone Resiliency, Autoscaling, and Velero Backups",
    difficulty: "Production",
    category: "AKS",
    estimatedHours: 5,
    isFeatured: true,
    linkedModuleIds: ["10", "11", "12", "13"],
    skills: ["Multi-node pools", "Cluster autoscaler", "PDB", "Velero backup", "Zone spread"],
    deliverables: ["Zonal Node Pools", "Pod Disruption Budget", "Velero Backup Schedule"],
    jdKeywords: ["HA", "Cluster Autoscaler", "PodDisruptionBudget", "Multi-AZ", "Velero"],
    architecture: {
      description: "A highly resilient Kubernetes cluster spread across availability zones with automated disaster recovery.",
      nodes: ["AKS Control Plane", "System Node Pool (AZ 1,2,3)", "User Node Pool (Autoscaler)", "Pod Disruption Budget", "Velero Operator", "Azure Blob Storage (Backup)"],
      connections: [
        "AKS Control Plane → System Node Pool",
        "AKS Control Plane → User Node Pool",
        "User Node Pool → Pod Disruption Budget (Enforces minimum availability)",
        "Velero Operator → Azure Blob Storage (Scheduled ETCD/Volume backups)"
      ]
    },
    steps: [
      {
        id: 1,
        title: "Zonal System Pool",
        description: "Create the system node pool spanning 3 availability zones.",
        commands: [
          "az aks nodepool add --resource-group [RG_NAME] --cluster-name aks-prod-[YOURALIAS] --name system --node-count 3 --zones 1 2 3 --mode System"
        ]
      },
      {
        id: 2,
        title: "Autoscaling User Pool",
        description: "Create the user node pool with cluster autoscaler enabled.",
        commands: [
          "az aks nodepool add --resource-group [RG_NAME] --cluster-name aks-prod-[YOURALIAS] --name workloads --node-count 2 --min-count 2 --max-count 10 --enable-cluster-autoscaler --zones 1 2 3 --mode User"
        ]
      },
      {
        id: 3,
        title: "Pod Disruption Budget",
        description: "Ensure voluntary disruptions (like node upgrades) don't take down the application.",
        commands: [
          "kubectl apply -f pdb.yaml"
        ]
      },
      {
        id: 4,
        title: "Velero Backup",
        description: "Install Velero and schedule a daily backup of the cluster state to Azure Blob Storage.",
        commands: [
          "velero install --provider azure --plugins velero/velero-plugin-for-microsoft-azure:v1.8.0 --bucket [BACKUP_CONTAINER] --secret-file ./credentials-velero --backup-location-config resourceGroup=[RG_NAME],storageAccount=[SA_NAME],subscriptionId=[SUB_ID]",
          "velero schedule create daily-backup --schedule=\"0 2 * * *\" --ttl 720h0m0s"
        ]
      }
    ],
    interviewQuestions: [
      { q: "What is the difference between HPA and Cluster Autoscaler?", a: "HPA (Horizontal Pod Autoscaler) adds more pod replicas when CPU/Memory spikes. Cluster Autoscaler adds more underlying VM Nodes to the cluster when pods are pending because there isn't enough capacity to schedule them.", level: "Intermediate" },
      { q: "How does a Pod Disruption Budget (PDB) protect against downtime during upgrades?", a: "During a node drain (e.g., Kubernetes version upgrade), the eviction API checks the PDB. If evicting a pod would violate the `minAvailable` threshold, the drain is blocked until a replacement pod is running elsewhere.", level: "Advanced" }
    ]
  },
  p13: {
    id: "p13",
    title: "End-to-End DevOps Platform",
    subtitle: "Complete Lifecycle from Code to Production",
    difficulty: "DevOps",
    category: "DevOps",
    estimatedHours: 6,
    isFeatured: true,
    linkedModuleIds: ["14", "15", "16", "17"],
    skills: ["SonarQube", "Trivy", "Docker", "Helm", "AKS"],
    deliverables: ["Full Pipeline", "Code Quality Gate", "Security Gate", "Helm Deployment"],
    jdKeywords: ["End-to-End", "SonarQube", "Trivy", "Helm"],
    architecture: {
      description: "A mature, full-lifecycle CI/CD pipeline incorporating code quality, security scanning, and Helm deployments.",
      nodes: ["GitHub Repo", "GitHub Actions", "SonarQube", "Trivy Scan", "ACR", "AKS (Staging)", "AKS (Production)"],
      connections: [
        "GitHub Repo → GitHub Actions",
        "GitHub Actions → SonarQube (Quality Gate)",
        "GitHub Actions → Trivy Scan (Security Gate)",
        "GitHub Actions → ACR (Push Image)",
        "ACR → AKS (Staging) (Helm Upgrade)",
        "AKS (Staging) → AKS (Production) (Manual Promotion)"
      ]
    },
    steps: [
      {
        id: 1,
        title: "Quality Gate",
        description: "Integrate SonarQube for static application security testing (SAST).",
        commands: [
          "# In GitHub Actions YAML:",
          "- uses: SonarSource/sonarcloud-github-action@master",
          "  env:",
          "    SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}"
        ]
      },
      {
        id: 2,
        title: "Security Gate",
        description: "Integrate Trivy container scanning to block critical vulnerabilities.",
        commands: [
          "- uses: aquasecurity/trivy-action@master",
          "  with:",
          "    severity: HIGH,CRITICAL",
          "    exit-code: '1'"
        ]
      },
      {
        id: 3,
        title: "Helm Package",
        description: "Package the application manifests into a reusable Helm chart.",
        commands: [
          "helm create myapp",
          "helm lint ./myapp"
        ]
      },
      {
        id: 4,
        title: "Helm Deploy",
        description: "Deploy the chart to the cluster, passing in the dynamic image tag.",
        commands: [
          "helm upgrade --install myapp ./myapp --namespace staging --create-namespace --set image.tag=${{ github.sha }}"
        ]
      }
    ],
    interviewQuestions: [
      { q: "Why use Helm instead of plain Kubernetes manifests (`kubectl apply`)?", a: "Helm acts as a package manager, allowing templating of YAML files. This means you can use one set of files for all environments and just inject different `values.yaml` files. It also supports atomic rollbacks (`helm rollback`).", level: "Intermediate" },
      { q: "What happens if the SonarQube quality gate fails?", a: "The GitHub Actions workflow step will return a non-zero exit code, immediately failing the pipeline and preventing the flawed code from being built or deployed.", level: "Basic" }
    ]
  },
  p14: {
    id: "p14",
    title: "DevSecOps Pipeline",
    subtitle: "Shift-Left Security with SAST, DAST, and IaC Scanning",
    difficulty: "Security",
    category: "Security",
    estimatedHours: 5,
    isFeatured: true,
    linkedModuleIds: ["22", "23"],
    skills: ["Checkov", "Trivy", "GitLeaks", "SonarQube", "Shift-Left"],
    deliverables: ["Security Pipeline", "Checkov Report", "GitLeaks Integration"],
    jdKeywords: ["DevSecOps", "Trivy", "Checkov", "SAST", "Secret Scanning"],
    architecture: {
      description: "A 'Shift-Left' DevSecOps implementation ensuring infrastructure and code vulnerabilities are caught before merging.",
      nodes: ["Pull Request", "GitLeaks (Secrets)", "Checkov (IaC)", "SonarQube (SAST)", "Trivy (Container)", "Approval Gate"],
      connections: [
        "Pull Request → GitLeaks (Blocks hardcoded secrets)",
        "Pull Request → Checkov (Blocks insecure Terraform)",
        "Pull Request → SonarQube (Blocks bad code)",
        "Pull Request → Trivy (Blocks vulnerable dependencies)",
        "All Gates Pass → Approval Gate"
      ]
    },
    steps: [
      {
        id: 1,
        title: "Secret Detection",
        description: "Prevent hardcoded credentials from ever entering the repository.",
        commands: [
          "- name: GitLeaks",
          "  uses: gitleaks/gitleaks-action@v2"
        ]
      },
      {
        id: 2,
        title: "IaC Scanning",
        description: "Scan Terraform code for misconfigurations (e.g., open NSGs) using Checkov.",
        commands: [
          "- name: Checkov (Terraform)",
          "  uses: bridgecrewio/checkov-action@master",
          "  with:",
          "    directory: infra/terraform",
          "    soft_fail: false"
        ]
      },
      {
        id: 3,
        title: "Dependency Scanning",
        description: "Scan the container filesystem for CVEs.",
        commands: [
          "- name: Trivy",
          "  uses: aquasecurity/trivy-action@master"
        ]
      }
    ],
    interviewQuestions: [
      { q: "What does 'Shift-Left' mean in DevSecOps?", a: "It means moving security testing as early in the software development lifecycle (to the 'left' on a timeline) as possible, usually at the developer's IDE or the PR stage, rather than finding out in production.", level: "Basic" },
      { q: "What is the difference between SAST and DAST?", a: "SAST (Static Application Security Testing) analyzes source code at rest (like SonarQube). DAST (Dynamic Application Security Testing) analyzes a running application from the outside to find runtime vulnerabilities like SQL injection.", level: "Intermediate" }
    ]
  },
  p15: {
    id: "p15",
    title: "Azure Infrastructure Factory",
    subtitle: "Modular, Reusable Terraform Architecture",
    difficulty: "Terraform",
    category: "Terraform",
    estimatedHours: 4,
    isFeatured: true,
    linkedModuleIds: ["18", "19", "20"],
    skills: ["Terraform Modules", "DRY", "Outputs", "Variables"],
    deliverables: ["Networking Module", "Compute Module", "AKS Module", "Root Configuration"],
    jdKeywords: ["Terraform Modules", "IaC", "Reusable Architecture"],
    architecture: {
      description: "A highly reusable Terraform architecture abstracting complex Azure resources into simple, callable modules.",
      nodes: ["Root Module (main.tf)", "Networking Module", "AKS Module", "Compute Module", "Storage Module"],
      connections: [
        "Root Module → Networking Module (Passes CIDRs)",
        "Networking Module → Root Module (Returns Subnet IDs)",
        "Root Module → AKS Module (Passes Subnet ID)",
        "Root Module → Compute Module",
        "Root Module → Storage Module"
      ]
    },
    steps: [
      {
        id: 1,
        title: "Directory Structure",
        description: "Create the modular folder hierarchy.",
        commands: [
          "mkdir -p modules/{networking,compute,aks,storage}",
          "touch modules/networking/{main.tf,variables.tf,outputs.tf}"
        ]
      },
      {
        id: 2,
        title: "Networking Module",
        description: "Define the VNET and outputs its Subnet IDs.",
        commands: [
          "cat << 'EOF' > modules/networking/outputs.tf",
          "output \"subnet_ids\" {",
          "  value = { for s in azurerm_subnet.main : s.name => s.id }",
          "}",
          "EOF"
        ]
      },
      {
        id: 3,
        title: "Root Consumption",
        description: "Call the modules from the root environment file.",
        commands: [
          "cat << 'EOF' > main.tf",
          "module \"network\" {",
          "  source = \"./modules/networking\"",
          "  vnet_address_space = [\"10.0.0.0/16\"]",
          "}",
          "EOF"
        ]
      },
      {
        id: 4,
        title: "Cross-Module Referencing",
        description: "Pass the output of the network module directly into the AKS module.",
        commands: [
          "module \"aks\" {",
          "  source = \"./modules/aks\"",
          "  subnet_id = module.network.subnet_ids[\"aks\"]",
          "}"
        ]
      }
    ],
    interviewQuestions: [
      { q: "Why use Terraform Modules?", a: "Modules enforce the DRY (Don't Repeat Yourself) principle. They standardize resource creation with enterprise best practices baked in, allowing developers to provision complex infrastructure simply by passing a few variables.", level: "Basic" },
      { q: "How do you pass data between two sibling modules?", a: "You define an `output` in the first module (e.g., returning a subnet ID). In the root module, you capture that output and pass it as an input `variable` to the second module.", level: "Intermediate" }
    ]
  },
  p16: {
    id: "p16",
    title: "Multi-Region Deployment",
    subtitle: "Active-Active Architecture with Traffic Manager",
    difficulty: "Terraform",
    category: "Terraform",
    estimatedHours: 4,
    isFeatured: false,
    linkedModuleIds: ["18", "19"],
    skills: ["Traffic Manager", "Multi-region", "Terraform Workspaces"],
    deliverables: ["East US Deployment", "Central India Deployment", "Traffic Manager Profile"],
    jdKeywords: ["Multi-region", "Active-Active", "Traffic Manager"],
    architecture: {
      description: "A globally distributed application spread across two Azure regions, load-balanced by Azure Traffic Manager.",
      nodes: ["User Request", "Azure Traffic Manager", "East US Region", "Central India Region", "East US AKS", "Central India AKS"],
      connections: [
        "User Request → Azure Traffic Manager (DNS Resolution)",
        "Azure Traffic Manager → East US Region (Priority 1)",
        "Azure Traffic Manager → Central India Region (Priority 2)",
        "East US Region → East US AKS",
        "Central India Region → Central India AKS"
      ]
    },
    steps: [
      {
        id: 1,
        title: "Create Region Workspaces",
        description: "Initialize separate terraform workspaces for each physical region.",
        commands: [
          "terraform workspace new eastus",
          "terraform workspace new centralindia"
        ]
      },
      {
        id: 2,
        title: "Define Region Variables",
        description: "Create distinct tfvars for each region.",
        commands: [
          "cat << 'EOF' > environments/eastus.tfvars",
          "location = \"eastus\"",
          "aks_node_count = 3",
          "EOF",
          "cat << 'EOF' > environments/centralindia.tfvars",
          "location = \"centralindia\"",
          "aks_node_count = 2",
          "EOF"
        ]
      },
      {
        id: 3,
        title: "Deploy Infrastructure",
        description: "Apply the exact same Terraform modules twice, varying only the workspace.",
        commands: [
          "terraform workspace select eastus",
          "terraform apply -var-file=\"environments/eastus.tfvars\"",
          "terraform workspace select centralindia",
          "terraform apply -var-file=\"environments/centralindia.tfvars\""
        ]
      },
      {
        id: 4,
        title: "Configure Traffic Manager",
        description: "Create a priority-based global DNS router to failover traffic.",
        commands: [
          "az network traffic-manager profile create --name tm-platform-global --resource-group [RG_NAME] --routing-method Priority --dns-config-relative-name platform-[YOURALIAS] --ttl 30 --monitor-protocol HTTPS --monitor-port 443 --monitor-path /health"
        ]
      }
    ],
    interviewQuestions: [
      { q: "What is the difference between Azure Front Door and Azure Traffic Manager?", a: "Traffic Manager operates at DNS level (Layer 7) and redirects clients to the closest IP. Azure Front Door is an actual reverse proxy acting as a global load balancer and WAF that terminates SSL connections at the edge.", level: "Intermediate" },
      { q: "How does priority routing work in Traffic Manager?", a: "All traffic goes to the primary endpoint (Priority 1). If the health probe fails for the primary, Traffic Manager automatically updates DNS to point clients to the secondary endpoint (Priority 2).", level: "Basic" }
    ]
  },
  p17: {
    id: "p17",
    title: "CI/CD for AKS",
    subtitle: "GitHub Actions with Helm deployments",
    difficulty: "GitHub Actions",
    category: "GitHub Actions",
    estimatedHours: 3,
    isFeatured: false,
    linkedModuleIds: ["15", "16"],
    skills: ["GitHub Actions", "Helm", "AKS", "ACR"],
    deliverables: ["Helm Workflow", "Deployed Chart"],
    jdKeywords: ["GitHub Actions", "CI/CD", "Helm", "AKS deployment"],
    architecture: {
      description: "Automated deployment pipeline taking a Docker image from ACR and deploying it to AKS using Helm.",
      nodes: ["GitHub Repo", "GitHub Actions", "ACR", "AKS Cluster", "Helm Release"],
      connections: [
        "GitHub Repo → GitHub Actions (Triggers run)",
        "GitHub Actions → ACR (Pulls image tag)",
        "GitHub Actions → AKS Cluster (Authenticates)",
        "GitHub Actions → Helm Release (Executes upgrade)"
      ]
    },
    steps: [
      {
        id: 1,
        title: "Lint Helm Chart",
        description: "Validate the Helm chart templates before attempting a deployment.",
        commands: [
          "- name: Helm Lint",
          "  run: helm lint ./helm/myapp"
        ]
      },
      {
        id: 2,
        title: "Authenticate to AKS",
        description: "Retrieve cluster credentials securely inside the runner.",
        commands: [
          "az aks get-credentials --name [AKS_NAME] --resource-group [RG_NAME]"
        ]
      },
      {
        id: 3,
        title: "Execute Helm Upgrade",
        description: "Install or upgrade the chart using the newly built image tag.",
        commands: [
          "helm upgrade --install myapp ./helm/myapp --namespace production --create-namespace --set image.tag=${{ github.sha }} --set replicaCount=3 --wait --timeout 5m"
        ]
      }
    ],
    interviewQuestions: [
      { q: "Why use the `--wait` flag in `helm upgrade`?", a: "It forces the CI/CD pipeline step to hang until all pods are actually running and healthy. Without it, Helm immediately returns success once the API accepts the YAML, even if the pods crash-loop seconds later.", level: "Intermediate" }
    ]
  },
  p18: {
    id: "p18",
    title: "Reusable Workflow Templates",
    subtitle: "DRY CI/CD for Enterprise Repositories",
    difficulty: "GitHub Actions",
    category: "GitHub Actions",
    estimatedHours: 3,
    isFeatured: false,
    linkedModuleIds: ["15", "16"],
    skills: ["workflow_call", "Reusable Workflows", "Secrets Management"],
    deliverables: ["Central Template Repo", "Consumer Workflow"],
    jdKeywords: ["Reusable workflows", "GitHub Actions templates", "DRY"],
    architecture: {
      description: "An enterprise template repository providing centralized, standardized CI/CD workflows for downstream consumption.",
      nodes: ["Template Repository", "Workflow Call", "App Repo 1", "App Repo 2", "App Repo 3"],
      connections: [
        "App Repo 1 → Workflow Call",
        "App Repo 2 → Workflow Call",
        "App Repo 3 → Workflow Call",
        "Workflow Call → Template Repository (Executes centralized logic)"
      ]
    },
    steps: [
      {
        id: 1,
        title: "Create Template Workflow",
        description: "Define a workflow that triggers on `workflow_call`.",
        commands: [
          "cat << 'EOF' > .github/workflows/build-template.yml",
          "on:",
          "  workflow_call:",
          "    inputs:",
          "      image-name: { required: true, type: string }",
          "    secrets:",
          "      ACR_USERNAME: { required: true }",
          "EOF"
        ]
      },
      {
        id: 2,
        title: "Consume Template",
        description: "Call the reusable workflow from a different application repository.",
        commands: [
          "cat << 'EOF' > .github/workflows/main.yml",
          "jobs:",
          "  call-workflow:",
          "    uses: myorg/templates/.github/workflows/build-template.yml@main",
          "    with:",
          "      image-name: 'myapp'",
          "    secrets:",
          "      ACR_USERNAME: ${{ secrets.ACR_USERNAME }}",
          "EOF"
        ]
      }
    ],
    interviewQuestions: [
      { q: "Why are reusable workflows important for large organizations?", a: "They ensure compliance (e.g., every app runs SonarQube) without copying and pasting YAML. If you need to update a security scanning tool, you update it once in the template, and all 100+ downstream repos inherit the fix instantly.", level: "Advanced" }
    ]
  },
  p19: {
    id: "p19",
    title: "Zero Trust Azure Platform",
    subtitle: "Identity-Based Security and Key Vault Integration",
    difficulty: "Security",
    category: "Security",
    estimatedHours: 5,
    isFeatured: true,
    linkedModuleIds: ["21", "22", "23"],
    skills: ["Managed Identity", "Key Vault CSI", "RBAC", "Private Endpoints"],
    deliverables: ["User-Assigned Identity", "Key Vault", "CSI SecretProviderClass"],
    jdKeywords: ["Zero Trust", "Managed Identity", "Key Vault CSI", "RBAC"],
    architecture: {
      description: "A Zero Trust implementation replacing hardcoded secrets with Entra ID identities and mounting secrets via CSI drivers.",
      nodes: ["AKS Pod", "Workload Identity", "Azure Key Vault", "CSI Driver", "Azure RBAC"],
      connections: [
        "AKS Pod → Workload Identity",
        "Workload Identity → Azure RBAC (Validates permissions)",
        "Azure RBAC → Azure Key Vault",
        "Azure Key Vault → CSI Driver (Mounts secrets as files)",
        "CSI Driver → AKS Pod"
      ]
    },
    steps: [
      {
        id: 1,
        title: "Create Managed Identity",
        description: "Create an identity for the workload to assume.",
        commands: [
          "az identity create --name mi-aks-workload --resource-group [RG_NAME]",
          "MI_CLIENT_ID=$(az identity show -n mi-aks-workload -g [RG_NAME] --query clientId -o tsv)"
        ]
      },
      {
        id: 2,
        title: "Grant Key Vault Access",
        description: "Use Azure RBAC to allow the identity to read secrets.",
        commands: [
          "KV_ID=$(az keyvault show -n [KV_NAME] --query id -o tsv)",
          "az role assignment create --assignee $MI_CLIENT_ID --role \"Key Vault Secrets User\" --scope $KV_ID"
        ]
      },
      {
        id: 3,
        title: "Install CSI Driver",
        description: "Install the Secrets Store CSI driver in the AKS cluster.",
        commands: [
          "helm repo add secrets-store-csi-driver https://kubernetes-sigs.github.io/secrets-store-csi-driver/charts",
          "helm install csi-secrets-store secrets-store-csi-driver/secrets-store-csi-driver --namespace kube-system"
        ]
      },
      {
        id: 4,
        title: "Configure SecretProviderClass",
        description: "Map the Key Vault secret to the Kubernetes pod volume.",
        commands: [
          "kubectl apply -f spc.yaml"
        ]
      }
    ],
    interviewQuestions: [
      { q: "What is the core principle of Zero Trust?", a: "Never trust, always verify. It assumes breach and requires strict identity verification and least-privilege access for every user or service attempting to access resources.", level: "Basic" },
      { q: "Why use Key Vault CSI driver instead of Kubernetes native Secrets?", a: "Kubernetes Secrets are just base64 encoded strings stored in ETCD. The CSI driver maps secrets directly from Azure Key Vault to temporary memory volumes in the pod, ensuring passwords never persist on the cluster and are centrally managed/rotated in Azure.", level: "Advanced" }
    ]
  },
  p20: {
    id: "p20",
    title: "Security Monitoring",
    subtitle: "Microsoft Defender for Cloud and Microsoft Sentinel",
    difficulty: "Security",
    category: "Security",
    estimatedHours: 4,
    isFeatured: false,
    linkedModuleIds: ["24", "25"],
    skills: ["Microsoft Defender", "Microsoft Sentinel", "KQL", "Threat Hunting"],
    deliverables: ["Defender Plans", "Sentinel Workspace", "KQL Alert Rule"],
    jdKeywords: ["Microsoft Defender", "Sentinel", "KQL", "SIEM"],
    architecture: {
      description: "Cloud-native SIEM and XDR deployment for enterprise threat detection.",
      nodes: ["AKS Cluster", "Azure VMs", "Microsoft Defender (XDR)", "Log Analytics Workspace", "Microsoft Sentinel (SIEM)"],
      connections: [
        "AKS Cluster → Microsoft Defender (Container anomalies)",
        "Azure VMs → Microsoft Defender (OS vulnerabilities)",
        "Microsoft Defender → Log Analytics Workspace",
        "Log Analytics Workspace → Microsoft Sentinel (Correlation/Alerting)"
      ]
    },
    steps: [
      {
        id: 1,
        title: "Enable Defender Plans",
        description: "Turn on advanced threat protection for VMs, Storage, and Kubernetes.",
        commands: [
          "az security pricing create --name VirtualMachines --tier Standard",
          "az security pricing create --name KubernetesService --tier Standard",
          "az security pricing create --name StorageAccounts --tier Standard"
        ]
      },
      {
        id: 2,
        title: "Deploy Sentinel",
        description: "Onboard Microsoft Sentinel onto a Log Analytics Workspace.",
        commands: [
          "az sentinel onboarding-state create --resource-group [RG_NAME] --workspace-name [LA_WORKSPACE] --name default"
        ]
      },
      {
        id: 3,
        title: "Create Analytics Rule",
        description: "Enable built-in incident creation rules for high-severity Defender alerts.",
        commands: [
          "az sentinel alert-rule create --resource-group [RG_NAME] --workspace-name [LA_WORKSPACE] --rule-id [TEMPLATE_ID] --kind MicrosoftSecurityIncidentCreation --enabled true --display-name \"High Severity Defender Alerts\""
        ]
      },
      {
        id: 4,
        title: "KQL Threat Hunt",
        description: "Write a KQL query to detect anomalous failed logins across the cluster.",
        commands: [
          "AzureDiagnostics",
          "| where Category == \"kube-audit\"",
          "| where log_s contains \"Forbidden\"",
          "| summarize count() by bin(TimeGenerated, 1h), requestURI_s",
          "| where count_ > 10"
        ]
      }
    ],
    interviewQuestions: [
      { q: "What is the difference between Microsoft Defender for Cloud and Microsoft Sentinel?", a: "Defender is a Cloud Security Posture Management (CSPM) and Cloud Workload Protection Platform (CWPP) that generates security alerts. Sentinel is a SIEM/SOAR that aggregates those alerts along with external logs to provide enterprise-wide threat correlation and automated response.", level: "Intermediate" },
      { q: "What is Kusto Query Language (KQL)?", a: "KQL is the read-only query language used to analyze telemetry data in Azure Data Explorer, Log Analytics, and Sentinel. It is heavily used for log analysis and threat hunting.", level: "Basic" }
    ]
  }
};
