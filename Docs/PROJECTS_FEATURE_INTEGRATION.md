# Projects Feature — Integration Specification

## Real-World Lens

- How this appears in production: on-call fixes, release work, access issues, scaling, or automation.
- What to look for: the symptom, the cause, the safe fix, and the verification step.
- What to remember for interviews: the tradeoff, the guardrail, and the observable result.

## Why It Matters

- This chapter is written to sound like a real system you have touched in a team.
- Use the commands as a runbook, not just as syntax memorization.
- Treat the troubleshooting notes as your first response during incidents.


**Platform:** Azure DevOps Roadmap Pro  
**Route:** `/projects`  
**Status:** Planned  
**Priority:** P0 — Strongest section of the platform

---

## Why This Is the Most Important Page

Theory tabs teach concepts. Labs run commands. The Projects tab is where a learner proves they can build something real. Every Hyderabad GCC hiring manager looks at GitHub first. These 20 projects give Vikram a direct pipeline from "learning" → "portfolio proof" → "JD match."

---

## Project Taxonomy

```
/projects
│
├── /beginner      (Projects 1–3)   Azure fundamentals, zero to first deploy
├── /intermediate  (Projects 4–6)   IaC + containers + first real pipeline
├── /advanced      (Projects 7–9)   AKS, GitOps, observability
├── /production    (Projects 10–12) Enterprise-grade, multi-env, HA
├── /devops        (Projects 13–14) End-to-end DevSecOps platforms
├── /terraform     (Projects 15–16) Reusable module factory
├── /github        (Projects 17–18) Workflow library
├── /security      (Projects 19–20) Zero trust + SIEM
└── /portfolio     ⭐ Featured 8     Curated for job applications
```

---

## Data Model

```typescript
// src/data/projects.ts

export type ProjectDifficulty = "Beginner" | "Intermediate" | "Advanced" | "Production";
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
  commands: string[];          // az / kubectl / terraform / helm commands
  expectedOutput?: string;     // what the terminal should show on success
  validationCmd?: string;      // az cli check to confirm step succeeded
}

export interface ProjectInterviewQ {
  q: string;
  a: string;
  level: "Basic" | "Intermediate" | "Advanced";
}

export interface ProjectArch {
  nodes: string[];             // ordered list of architecture boxes
  connections: string[];       // "NodeA → NodeB" strings for diagram
  description: string;         // 2-3 sentence production context
}

export interface Project {
  id: string;                  // "p1" .. "p20"
  title: string;
  subtitle: string;
  difficulty: ProjectDifficulty;
  category: ProjectCategory;
  estimatedHours: number;
  isFeatured: boolean;         // ⭐ Portfolio projects
  linkedModuleIds: string[];   // which /module/[id] pages this maps to
  skills: string[];
  deliverables: string[];
  architecture: ProjectArch;
  steps: ProjectStep[];
  interviewQuestions: ProjectInterviewQ[];
  githubTemplateUrl?: string;  // starter repo / template link
  jdKeywords: string[];        // exact keywords that appear in GCC JDs
}
```

---

## Route Structure

```
frontend/src/app/projects/
├── page.tsx                   # Projects hub — filter by category/difficulty
├── layout.tsx                 # Shared layout with progress sidebar
└── [id]/
    ├── page.tsx               # generateStaticParams for p1..p20
    └── ProjectClient.tsx      # Tabs: Overview | Architecture | Steps | Interview
```

---

## Component Architecture

### `ProjectClient.tsx` — 4 Tabs

| Tab | Content |
|---|---|
| **Overview** | Skills checklist, deliverables, estimated time, difficulty badge, JD keyword mapping |
| **Architecture** | Visual node diagram (same ArchitectureVisualizer pattern), description, tech rationale |
| **Build Steps** | Step-by-step terminal commands, copy button, expandable expected output, validation command |
| **Interview Prep** | Project-specific Q&As (Basic / Intermediate / Advanced) with collapsible answers |

### `ProjectCard.tsx` — Hub page grid card

```
┌──────────────────────────────────┐
│  ⭐ FEATURED  [Terraform]         │
│  Project 15                      │
│  Azure Infrastructure Factory    │
│                                  │
│  ⏱ 4h  ████░░░░  Intermediate   │
│  Skills: Terraform · AKS · ACR  │
│                                  │
│  [ Start Project ]  [ Preview ]  │
└──────────────────────────────────┘
```

### `ProjectFilterBar.tsx` — Hub page filter

```
All | Beginner | Intermediate | Advanced | Production | ⭐ Featured
[AKS] [Terraform] [GitHub Actions] [Security]     Search...
```

---

## Progress Integration

Projects hook into the existing `useProgress` system:

```typescript
// Extend useProgress hook
interface Progress {
  completedModules: string[];
  xp: number;
  // ADD:
  completedProjects: string[];   // "p1", "p7", etc.
  projectXp: number;
}

// XP awards per difficulty
const PROJECT_XP: Record<ProjectDifficulty, number> = {
  Beginner:     150,
  Intermediate: 300,
  Advanced:     500,
  Production:   750,
};
```

Dashboard badge unlock thresholds (add to existing badge system):
- **First Build** — complete any 1 project (100 XP bonus)
- **Builder** — complete 5 projects (250 XP bonus)
- **Portfolio Ready** — complete all 8 ⭐ featured projects (500 XP bonus)
- **Platform Engineer** — complete all 20 projects (1000 XP bonus)

---

## Full Project Definitions

---

### P1 — Azure VM Deployment
**Difficulty:** Beginner | **Time:** 2h | **Linked Modules:** 1, 2, 3

**Skills:** Resource Groups · VNET · NSG · VM · Azure CLI  
**Deliverables:** Architecture diagram · Deployment script · NSG rule validation  
**JD Keywords:** `Azure Virtual Machines`, `NSG`, `Resource Groups`, `Azure CLI`

**Architecture:**
```
Internet
  ↓
NSG (inbound port 22/80)
  ↓
VNET (10.0.0.0/16)
  ↓  subnet (10.0.1.0/24)
VM (Standard_B2s)
  └── OS Disk (Premium SSD 30 GB)
```

**Steps:**
```bash
# 1. Login and set subscription
az login
az account set --subscription [SUBSCRIPTION_ID]

# 2. Create Resource Group with mandatory tags
az group create \
  --name rg-vm-lab-[YOUR_ALIAS] \
  --location eastus \
  --tags env=learning owner=[YOUR_ALIAS] project=vm-lab

# 3. Create VNET and subnet
az network vnet create \
  --resource-group rg-vm-lab-[YOUR_ALIAS] \
  --name vnet-vm-lab \
  --address-prefix 10.0.0.0/16 \
  --subnet-name snet-default \
  --subnet-prefix 10.0.1.0/24

# 4. Create NSG with SSH and HTTP rules
az network nsg create \
  --resource-group rg-vm-lab-[YOUR_ALIAS] \
  --name nsg-vm-lab

az network nsg rule create \
  --resource-group rg-vm-lab-[YOUR_ALIAS] \
  --nsg-name nsg-vm-lab \
  --name allow-ssh \
  --priority 1000 \
  --access Allow \
  --direction Inbound \
  --protocol Tcp \
  --destination-port-ranges 22

# 5. Deploy VM
az vm create \
  --resource-group rg-vm-lab-[YOUR_ALIAS] \
  --name vm-lab-01 \
  --image Ubuntu2204 \
  --size Standard_B2s \
  --vnet-name vnet-vm-lab \
  --subnet snet-default \
  --nsg nsg-vm-lab \
  --admin-username azureuser \
  --generate-ssh-keys \
  --zone 1

# 6. Validate
az vm show --resource-group rg-vm-lab-[YOUR_ALIAS] --name vm-lab-01 \
  --query "{State:powerState,IP:publicIpAddress}" -o table
```

**Interview Questions:**
- **Basic:** What is the difference between NSG and Azure Firewall?
- **Basic:** What are availability zones and why use `--zone 1`?
- **Intermediate:** How would you restrict SSH to only a corporate IP range?
- **Intermediate:** What is the difference between Standard_B2s and Standard_D2s_v3?
- **Advanced:** How would you replace the public IP with Azure Bastion for production?
- **Advanced:** Design a DR strategy for this VM — RPO 4h, RTO 1h.

---

### P2 — Static Website Hosting
**Difficulty:** Beginner | **Time:** 1.5h | **Linked Modules:** 5

**Skills:** Storage Account · Static Website · Azure CDN · Custom Domain  
**JD Keywords:** `Azure Storage`, `CDN`, `Static Site`, `HTTPS`

**Architecture:**
```
User Browser
  ↓ HTTPS
Azure CDN (global POP)
  ↓ origin pull
Storage Account (static website endpoint)
  └── $web container (index.html, assets)
```

**Steps:**
```bash
# 1. Create storage account
az storage account create \
  --name sa[YOURALIAS]static \
  --resource-group [RG_NAME] \
  --location eastus \
  --sku Standard_LRS \
  --kind StorageV2 \
  --https-only true \
  --min-tls-version TLS1_2

# 2. Enable static website
az storage blob service-properties update \
  --account-name sa[YOURALIAS]static \
  --static-website \
  --index-document index.html \
  --404-document 404.html

# 3. Upload files
echo "<h1>Deployed by Vikram on Azure</h1>" > index.html
az storage blob upload \
  --account-name sa[YOURALIAS]static \
  --container-name '$web' \
  --name index.html \
  --file index.html \
  --content-type "text/html"

# 4. Get website URL
az storage account show \
  --name sa[YOURALIAS]static \
  --query "primaryEndpoints.web" -o tsv

# 5. Create CDN profile and endpoint
az cdn profile create \
  --name cdn-static-lab \
  --resource-group [RG_NAME] \
  --sku Standard_Microsoft

az cdn endpoint create \
  --name ep-[YOURALIAS] \
  --profile-name cdn-static-lab \
  --resource-group [RG_NAME] \
  --origin sa[YOURALIAS]static.z13.web.core.windows.net \
  --origin-host-header sa[YOURALIAS]static.z13.web.core.windows.net \
  --https-port 443
```

---

### P3 — Azure App Service Deployment
**Difficulty:** Beginner | **Time:** 2h | **Linked Modules:** 6

**Skills:** App Service Plan · Deployment Slots · Autoscale · App Insights  
**JD Keywords:** `App Service`, `Deployment Slots`, `Blue-Green`, `Application Insights`

**Steps:**
```bash
# 1. Create App Service Plan
az appservice plan create \
  --name asp-lab-[YOURALIAS] \
  --resource-group [RG_NAME] \
  --sku S1 \
  --is-linux

# 2. Create Web App
az webapp create \
  --name app-[YOURALIAS]-lab \
  --resource-group [RG_NAME] \
  --plan asp-lab-[YOURALIAS] \
  --runtime "NODE:18-lts"

# 3. Create staging deployment slot
az webapp deployment slot create \
  --name app-[YOURALIAS]-lab \
  --resource-group [RG_NAME] \
  --slot staging

# 4. Deploy to staging (zip deploy)
zip -r app.zip . -x "*.git*"
az webapp deployment source config-zip \
  --resource-group [RG_NAME] \
  --name app-[YOURALIAS]-lab \
  --slot staging \
  --src app.zip

# 5. Swap staging → production
az webapp deployment slot swap \
  --resource-group [RG_NAME] \
  --name app-[YOURALIAS]-lab \
  --slot staging \
  --target-slot production

# 6. Enable Application Insights
az monitor app-insights component create \
  --app ai-[YOURALIAS]-lab \
  --location eastus \
  --resource-group [RG_NAME] \
  --application-type web
```

---

### P4 — Infrastructure with Terraform
**Difficulty:** Intermediate | **Time:** 3h | **Linked Modules:** 18, 19

**Skills:** Terraform HCL · State Management · Variables · Modules  
**JD Keywords:** `Terraform`, `IaC`, `Remote State`, `azurerm provider`

**Architecture:**
```
Terraform Config (local)
  ↓ azurerm provider
Azure (eastus)
  └── Resource Group
        ├── VNET (10.0.0.0/16)
        │    └── Subnet (10.0.1.0/24)
        ├── NSG → associated to subnet
        └── VM (Standard_B2s)
              └── NIC → subnet
```

**Steps:**
```bash
# Directory structure
mkdir -p terraform-azure-lab/{modules/vm,environments/dev}
cd terraform-azure-lab

# main.tf
cat > main.tf << 'EOF'
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }
  backend "azurerm" {
    resource_group_name  = "[EXISTING_RG]"
    storage_account_name = "[STATE_SA_NAME]"
    container_name       = "tfstate"
    key                  = "vm-lab.tfstate"
  }
}

provider "azurerm" {
  features {}
  skip_provider_registration = true
}

resource "azurerm_resource_group" "main" {
  name     = var.resource_group_name
  location = var.location
  tags     = var.tags
}
EOF

# variables.tf
cat > variables.tf << 'EOF'
variable "resource_group_name" { default = "rg-tf-lab" }
variable "location"            { default = "eastus" }
variable "tags" {
  default = { env = "learning", owner = "[YOURALIAS]" }
}
EOF

# Plan and apply
terraform init
terraform fmt
terraform validate
terraform plan -out=tfplan
terraform apply tfplan

# Show state
terraform state list
terraform output
```

**Interview Questions:**
- **Basic:** What is `terraform.tfstate` and why should it never be in Git?
- **Intermediate:** Explain `terraform plan` vs `terraform apply`. What does `-out=tfplan` do?
- **Advanced:** Your Terraform state is locked. How do you investigate and safely force-unlock it?

---

### P5 — Dockerized Application
**Difficulty:** Intermediate | **Time:** 2.5h | **Linked Modules:** 7, 8

**Skills:** Dockerfile · Multi-stage builds · ACR · Container scanning  
**JD Keywords:** `Docker`, `ACR`, `Container`, `Multi-stage build`, `Trivy`

**Steps:**
```bash
# 1. Write a multi-stage Dockerfile
cat > Dockerfile << 'EOF'
# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Stage 2: Runtime (minimal image)
FROM node:18-alpine AS runtime
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
USER node
CMD ["node", "server.js"]
EOF

# 2. Create ACR
az acr create \
  --name acr[YOURALIAS]lab \
  --resource-group [RG_NAME] \
  --sku Basic \
  --admin-enabled false

# 3. Build and push with ACR Tasks (no local Docker needed)
az acr build \
  --registry acr[YOURALIAS]lab \
  --image myapp:v1.0 \
  --file Dockerfile .

# 4. Scan image with Trivy
trivy image acr[YOURALIAS]lab.azurecr.io/myapp:v1.0 \
  --severity HIGH,CRITICAL \
  --exit-code 1

# 5. Run locally to validate
az acr login --name acr[YOURALIAS]lab
docker run -p 3000:3000 acr[YOURALIAS]lab.azurecr.io/myapp:v1.0
```

---

### P6 — CI/CD Pipeline (GitHub Actions → ACR → App Service)
**Difficulty:** Intermediate | **Time:** 3h | **Linked Modules:** 15, 16

**Pipeline:**
```
git push → GitHub Actions
  ├── Build & Test (Node.js)
  ├── Trivy scan (block on CRITICAL)
  ├── Docker build + push → ACR
  └── az webapp config container set → App Service (staging slot)
       └── Manual approve → swap to production
```

**Workflow (`.github/workflows/deploy.yml`):**
```yaml
name: CI/CD → Azure App Service

on:
  push:
    branches: [main]

env:
  REGISTRY: ${{ secrets.ACR_NAME }}.azurecr.io
  IMAGE_NAME: myapp

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with: { node-version: '18' }

      - name: Install & Test
        run: npm ci && npm test

      - name: Trivy Security Scan
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }}
          severity: CRITICAL
          exit-code: '1'

      - name: Login to ACR
        uses: azure/docker-login@v1
        with:
          login-server: ${{ env.REGISTRY }}
          username: ${{ secrets.ACR_USERNAME }}
          password: ${{ secrets.ACR_PASSWORD }}

      - name: Build and Push
        run: |
          docker build -t $REGISTRY/$IMAGE_NAME:${{ github.sha }} .
          docker push $REGISTRY/$IMAGE_NAME:${{ github.sha }}

      - name: Deploy to Staging Slot
        uses: azure/webapps-deploy@v2
        with:
          app-name: ${{ secrets.WEBAPP_NAME }}
          slot-name: staging
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }}
```

---

### P7 — AKS Production Deployment
**Difficulty:** Advanced | **Time:** 5h | **Linked Modules:** 9, 10, 11, 12

**Skills:** AKS · Azure CNI · ACR integration · Ingress · Managed Identity · HPA  
**JD Keywords:** `AKS`, `Kubernetes`, `Ingress`, `KEDA`, `Managed Identity`, `Azure CNI`

**Architecture:**
```
Internet
  ↓ HTTPS/443
Application Gateway (WAF v2)
  ↓
AGIC (Ingress Controller)
  ↓
AKS Cluster (Azure CNI)
  ├── System Node Pool (Standard_D2s_v3 × 2)
  └── User Node Pool (Standard_D4s_v3, autoscale 1–5)
        ├── Deployment: myapp (3 replicas, anti-affinity)
        ├── HPA (CPU 70% → scale)
        └── Service (ClusterIP)
              ↑
        Managed Identity → ACR pull
        Managed Identity → Key Vault CSI
```

**Steps:**
```bash
# 1. Create AKS cluster
az aks create \
  --resource-group [RG_NAME] \
  --name aks-prod-[YOURALIAS] \
  --node-count 2 \
  --node-vm-size Standard_D2s_v3 \
  --network-plugin azure \
  --network-policy azure \
  --enable-managed-identity \
  --enable-oidc-issuer \
  --enable-workload-identity \
  --zones 1 2 3 \
  --generate-ssh-keys

# 2. Attach ACR
ACR_ID=$(az acr show --name acr[YOURALIAS]lab --query id -o tsv)
az aks update \
  --name aks-prod-[YOURALIAS] \
  --resource-group [RG_NAME] \
  --attach-acr $ACR_ID

# 3. Get credentials
az aks get-credentials \
  --resource-group [RG_NAME] \
  --name aks-prod-[YOURALIAS]

# 4. Deploy application
kubectl apply -f - << 'EOF'
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
  namespace: default
spec:
  replicas: 3
  selector:
    matchLabels: { app: myapp }
  template:
    metadata:
      labels: { app: myapp }
    spec:
      topologySpreadConstraints:
        - maxSkew: 1
          topologyKey: kubernetes.io/hostname
          whenUnsatisfiable: DoNotSchedule
          labelSelector:
            matchLabels: { app: myapp }
      containers:
        - name: myapp
          image: acr[YOURALIAS]lab.azurecr.io/myapp:v1.0
          resources:
            requests: { cpu: "100m", memory: "128Mi" }
            limits:   { cpu: "500m", memory: "256Mi" }
          readinessProbe:
            httpGet: { path: /health, port: 3000 }
            initialDelaySeconds: 5
EOF

# 5. Create HPA
kubectl autoscale deployment myapp \
  --cpu-percent=70 \
  --min=3 \
  --max=10

# 6. Verify
kubectl get pods -o wide
kubectl get hpa
kubectl top pods
```

---

### P8 — GitOps with ArgoCD
**Difficulty:** Advanced | **Time:** 4h | **Linked Modules:** 27

**Skills:** ArgoCD · GitOps · App-of-Apps · Rollback  
**JD Keywords:** `ArgoCD`, `GitOps`, `Helm`, `Sync`, `Rollback`

**Steps:**
```bash
# 1. Install ArgoCD
kubectl create namespace argocd
kubectl apply -n argocd \
  -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# 2. Wait for pods
kubectl wait --for=condition=available \
  deployment/argocd-server -n argocd --timeout=120s

# 3. Get initial admin password
kubectl -n argocd get secret argocd-initial-admin-secret \
  -o jsonpath="{.data.password}" | base64 -d

# 4. Port-forward UI
kubectl port-forward svc/argocd-server -n argocd 8080:443

# 5. Create an Application via CLI
argocd app create myapp \
  --repo https://github.com/[YOURALIAS]/myapp-gitops \
  --path helm/myapp \
  --dest-server https://kubernetes.default.svc \
  --dest-namespace default \
  --sync-policy automated \
  --auto-prune \
  --self-heal

# 6. Trigger rollback to previous revision
argocd app history myapp
argocd app rollback myapp [REVISION_ID]
```

---

### P9 — Monitoring Stack (Prometheus + Grafana + Azure Monitor)
**Difficulty:** Advanced | **Time:** 4h | **Linked Modules:** 24, 25

**Steps:**
```bash
# 1. Add Helm repos
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo add grafana https://grafana.github.io/helm-charts
helm repo update

# 2. Install kube-prometheus-stack
helm upgrade --install monitoring \
  prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --create-namespace \
  --set grafana.adminPassword=Admin@12345 \
  --set prometheus.prometheusSpec.retention=7d \
  --set grafana.service.type=LoadBalancer

# 3. Verify
kubectl get pods -n monitoring
kubectl get svc -n monitoring | grep grafana

# 4. Create custom alert rule
kubectl apply -f - << 'EOF'
apiVersion: monitoring.coreos.com/v1
kind: PrometheusRule
metadata:
  name: pod-restart-alert
  namespace: monitoring
spec:
  groups:
    - name: pods
      rules:
        - alert: PodRestartingTooMuch
          expr: rate(kube_pod_container_status_restarts_total[15m]) > 0
          for: 5m
          labels:
            severity: warning
          annotations:
            summary: "Pod {{ $labels.pod }} is restarting frequently"
EOF

# 5. Enable Azure Monitor for AKS
az aks enable-addons \
  --addons monitoring \
  --name aks-prod-[YOURALIAS] \
  --resource-group [RG_NAME] \
  --workspace-resource-id [LOG_ANALYTICS_WS_ID]
```

---

### P10 — Enterprise Azure Landing Zone
**Difficulty:** Production | **Time:** 6h | **Linked Modules:** 2, 3, 22, 23

**Skills:** Hub-Spoke · Azure Firewall · Private Endpoints · Key Vault · Policy  
**JD Keywords:** `Landing Zone`, `Hub-Spoke`, `Private Endpoint`, `Azure Firewall`, `Azure Policy`

**Architecture:**
```
Management Group (Contoso Root)
  └── Subscription: Platform
        ├── Hub VNET (10.0.0.0/16)
        │    ├── AzureFirewallSubnet (10.0.0.0/26)
        │    ├── GatewaySubnet (10.0.1.0/27)
        │    └── BastionSubnet (10.0.2.0/27)
        │
        └── VNET Peering (hub → spoke, allow-forwarded-traffic=true)

  └── Subscription: Workloads
        └── Spoke VNET (10.1.0.0/16)
              ├── AppSubnet (10.1.1.0/24)  → UDR → Azure Firewall
              └── DataSubnet (10.1.2.0/24) → Private Endpoint: Key Vault, PostgreSQL
```

**Steps:**
```bash
# 1. Create Hub VNET
az network vnet create \
  --name vnet-hub \
  --resource-group [HUB_RG] \
  --address-prefix 10.0.0.0/16 \
  --subnet-name AzureFirewallSubnet \
  --subnet-prefix 10.0.0.0/26

# 2. Deploy Azure Firewall
az network firewall create \
  --name fw-hub \
  --resource-group [HUB_RG] \
  --location eastus \
  --vnet-name vnet-hub \
  --sku-tier Standard

# 3. Create Spoke VNET
az network vnet create \
  --name vnet-spoke-workloads \
  --resource-group [SPOKE_RG] \
  --address-prefix 10.1.0.0/16

# 4. Peer Hub → Spoke
az network vnet peering create \
  --name hub-to-spoke \
  --resource-group [HUB_RG] \
  --vnet-name vnet-hub \
  --remote-vnet vnet-spoke-workloads \
  --allow-forwarded-traffic \
  --allow-gateway-transit

# 5. Create UDR on spoke → route 0.0.0.0/0 via Firewall
FW_IP=$(az network firewall show -n fw-hub -g [HUB_RG] \
  --query "ipConfigurations[0].privateIPAddress" -o tsv)

az network route-table create \
  --name rt-spoke-workloads \
  --resource-group [SPOKE_RG]

az network route-table route create \
  --name default-to-firewall \
  --route-table-name rt-spoke-workloads \
  --resource-group [SPOKE_RG] \
  --address-prefix 0.0.0.0/0 \
  --next-hop-type VirtualAppliance \
  --next-hop-ip-address $FW_IP

# 6. Create Key Vault with Private Endpoint
az keyvault create \
  --name kv-landing-[YOURALIAS] \
  --resource-group [SPOKE_RG] \
  --location eastus \
  --sku standard \
  --enable-rbac-authorization \
  --public-network-access Disabled

az network private-endpoint create \
  --name pe-keyvault \
  --resource-group [SPOKE_RG] \
  --vnet-name vnet-spoke-workloads \
  --subnet DataSubnet \
  --private-connection-resource-id $(az keyvault show -n kv-landing-[YOURALIAS] -g [SPOKE_RG] --query id -o tsv) \
  --group-id vault \
  --connection-name kv-pe-connection
```

---

### P11 — Multi-Environment Platform (Dev → QA → UAT → Prod)
**Difficulty:** Production | **Time:** 5h | **Linked Modules:** 15, 16, 17, 18

**Pipeline:**
```
feature/* → PR → develop
  ↓ GitHub Actions
Dev AKS namespace (auto-deploy)
  ↓ merge to main
QA AKS namespace (auto-deploy + smoke test)
  ↓ manual approval (QA lead)
UAT AKS namespace (auto-deploy)
  ↓ manual approval (Product Owner)
Prod AKS namespace (auto-deploy)
```

**Environment Terraform workspaces:**
```bash
terraform workspace new dev
terraform workspace new qa
terraform workspace new uat
terraform workspace new prod

# Switch and apply per env
terraform workspace select dev
terraform apply -var-file="environments/dev.tfvars"
```

**GitHub Actions environment gates:**
```yaml
deploy-prod:
  needs: deploy-uat
  environment:
    name: production
    url: https://app.contoso.com
  runs-on: ubuntu-latest
  steps:
    - name: Deploy to Production
      run: kubectl apply -f k8s/prod/
```

---

### P12 — Highly Available AKS Platform
**Difficulty:** Production | **Time:** 5h | **Linked Modules:** 10, 11, 12, 13

**Skills:** Multi-node pools · Cluster autoscaler · PDB · Velero backup · Zone spread  
**JD Keywords:** `HA`, `Cluster Autoscaler`, `PodDisruptionBudget`, `Multi-AZ`, `Velero`

**Steps:**
```bash
# 1. Create system node pool (3 zones)
az aks nodepool add \
  --resource-group [RG_NAME] \
  --cluster-name aks-prod-[YOURALIAS] \
  --name system \
  --node-count 3 \
  --node-vm-size Standard_D2s_v3 \
  --zones 1 2 3 \
  --mode System

# 2. Create user node pool with autoscale
az aks nodepool add \
  --resource-group [RG_NAME] \
  --cluster-name aks-prod-[YOURALIAS] \
  --name workloads \
  --node-count 2 \
  --min-count 2 \
  --max-count 10 \
  --enable-cluster-autoscaler \
  --node-vm-size Standard_D4s_v3 \
  --zones 1 2 3 \
  --mode User

# 3. Set Pod Disruption Budget
kubectl apply -f - << 'EOF'
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: myapp-pdb
spec:
  minAvailable: 2
  selector:
    matchLabels: { app: myapp }
EOF

# 4. Install Velero for backup
velero install \
  --provider azure \
  --plugins velero/velero-plugin-for-microsoft-azure:v1.8.0 \
  --bucket [BACKUP_CONTAINER] \
  --secret-file ./credentials-velero \
  --backup-location-config resourceGroup=[RG_NAME],storageAccount=[SA_NAME],subscriptionId=[SUB_ID]

# 5. Schedule daily backup
velero schedule create daily-backup \
  --schedule="0 2 * * *" \
  --ttl 720h0m0s
```

---

### P13 — End-to-End DevOps Platform
**Difficulty:** DevOps | **Time:** 6h | **Linked Modules:** 14, 15, 16, 17

**Full pipeline:**
```
Code (GitHub)
  ↓ push to main
GitHub Actions: Build & Unit Test
  ↓
SonarQube: Code Quality Gate
  ↓
Trivy: Image Security Scan (block on CRITICAL)
  ↓
Docker Build + Tag (git sha + latest)
  ↓
Push to ACR
  ↓
Helm upgrade --install → AKS (staging namespace)
  ↓ smoke test passes
Helm upgrade --install → AKS (prod namespace)
```

---

### P14 — DevSecOps Pipeline
**Difficulty:** DevOps | **Time:** 5h | **Linked Modules:** 22, 23

**Security gates in pipeline:**
```yaml
security-scan:
  runs-on: ubuntu-latest
  steps:
    # IaC scan
    - name: Checkov (Terraform)
      uses: bridgecrewio/checkov-action@master
      with:
        directory: infra/terraform
        soft_fail: false

    # Container scan
    - name: Trivy (image)
      uses: aquasecurity/trivy-action@master
      with:
        severity: HIGH,CRITICAL
        exit-code: '1'

    # SAST
    - name: SonarQube Scan
      uses: SonarSource/sonarcloud-github-action@master
      env:
        SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}

    # Secret detection
    - name: GitLeaks
      uses: gitleaks/gitleaks-action@v2
```

---

### P15 — Azure Infrastructure Factory (Terraform Modules)
**Difficulty:** Terraform | **Time:** 4h | **Linked Modules:** 18, 19, 20

**Module structure:**
```
modules/
├── networking/
│   ├── main.tf       # vnet, subnets, peering
│   ├── variables.tf
│   └── outputs.tf    # vnet_id, subnet_ids
├── compute/
│   ├── main.tf       # vm, nic, disk
│   ├── variables.tf
│   └── outputs.tf
├── aks/
│   ├── main.tf       # aks cluster, node pools
│   ├── variables.tf
│   └── outputs.tf    # cluster_fqdn, kube_config
└── storage/
    ├── main.tf       # storage account, containers
    └── outputs.tf
```

**Root consumption:**
```hcl
module "network" {
  source              = "./modules/networking"
  resource_group_name = var.resource_group_name
  location            = var.location
  vnet_address_space  = ["10.0.0.0/16"]
  subnets = {
    aks   = "10.0.1.0/24"
    data  = "10.0.2.0/24"
  }
}

module "aks" {
  source              = "./modules/aks"
  resource_group_name = var.resource_group_name
  location            = var.location
  subnet_id           = module.network.subnet_ids["aks"]
  node_count          = var.node_count
}
```

---

### P16 — Multi-Region Azure Deployment
**Difficulty:** Terraform | **Time:** 4h | **Linked Modules:** 18, 19

**Regions:** East US + Central India  
**Pattern:** Same Terraform modules, different `.tfvars` per region

```hcl
# environments/eastus.tfvars
location             = "eastus"
resource_group_name  = "rg-platform-eastus"
aks_node_count       = 3

# environments/centralindia.tfvars
location             = "centralindia"
resource_group_name  = "rg-platform-cin"
aks_node_count       = 2
```

```bash
# Deploy East US
terraform workspace select eastus
terraform apply -var-file="environments/eastus.tfvars"

# Deploy Central India
terraform workspace select centralindia
terraform apply -var-file="environments/centralindia.tfvars"

# Traffic Manager for global failover
az network traffic-manager profile create \
  --name tm-platform-global \
  --resource-group [RG_NAME] \
  --routing-method Priority \
  --dns-config-relative-name platform-[YOURALIAS] \
  --ttl 30 \
  --monitor-protocol HTTPS \
  --monitor-port 443 \
  --monitor-path /health
```

---

### P17 — CI/CD for AKS (GitHub Actions)
**Difficulty:** GitHub Actions | **Time:** 3h | **Linked Modules:** 15, 16

**Full workflow:** Build → Test → Trivy → Helm chart lint → AKS deploy  
See P6 for base workflow; this extends it with Helm:

```yaml
- name: Helm Lint
  run: helm lint ./helm/myapp

- name: Deploy to AKS
  run: |
    az aks get-credentials --name [AKS_NAME] --resource-group [RG_NAME]
    helm upgrade --install myapp ./helm/myapp \
      --namespace production \
      --create-namespace \
      --set image.tag=${{ github.sha }} \
      --set replicaCount=3 \
      --wait \
      --timeout 5m
```

---

### P18 — Reusable Workflow Templates
**Difficulty:** GitHub Actions | **Time:** 3h | **Linked Modules:** 15, 16

**Reusable workflows in `.github/workflows/`:**
```yaml
# Called by downstream repos
on:
  workflow_call:
    inputs:
      image-name: { required: true, type: string }
      acr-name:   { required: true, type: string }
    secrets:
      ACR_USERNAME: { required: true }
      ACR_PASSWORD: { required: true }
```

---

### P19 — Zero Trust Azure Platform
**Difficulty:** Security | **Time:** 5h | **Linked Modules:** 21, 22, 23

**Implements:**
- All VMs use Managed Identity (no stored credentials)
- All secrets in Key Vault (CSI driver in AKS)
- RBAC scoped to minimum required permissions
- All PaaS services: public network disabled, Private Endpoints only
- Conditional Access policy: require MFA + compliant device

```bash
# 1. Create User-Assigned Managed Identity
az identity create \
  --name mi-aks-workload \
  --resource-group [RG_NAME]

MI_CLIENT_ID=$(az identity show -n mi-aks-workload -g [RG_NAME] --query clientId -o tsv)

# 2. Grant RBAC on Key Vault
KV_ID=$(az keyvault show -n [KV_NAME] --query id -o tsv)
az role assignment create \
  --assignee $MI_CLIENT_ID \
  --role "Key Vault Secrets User" \
  --scope $KV_ID

# 3. Install Key Vault CSI driver
helm repo add secrets-store-csi-driver \
  https://kubernetes-sigs.github.io/secrets-store-csi-driver/charts
helm install csi-secrets-store \
  secrets-store-csi-driver/secrets-store-csi-driver \
  --namespace kube-system

# 4. Create SecretProviderClass
kubectl apply -f - << 'EOF'
apiVersion: secrets-store.csi.x-k8s.io/v1
kind: SecretProviderClass
metadata:
  name: kv-provider
spec:
  provider: azure
  parameters:
    usePodIdentity: "false"
    clientID: "[MI_CLIENT_ID]"
    keyvaultName: "[KV_NAME]"
    objects: |
      array:
        - |
          objectName: db-password
          objectType: secret
    tenantId: "[TENANT_ID]"
EOF
```

---

### P20 — Azure Security Monitoring (Defender + Sentinel)
**Difficulty:** Security | **Time:** 4h | **Linked Modules:** 24, 25

```bash
# 1. Enable Defender for Cloud on subscription
az security auto-provisioning-setting update \
  --name mma \
  --auto-provision On

# 2. Enable specific Defender plans
az security pricing create --name VirtualMachines --tier Standard
az security pricing create --name KubernetesService --tier Standard
az security pricing create --name StorageAccounts --tier Standard

# 3. Deploy Sentinel on Log Analytics workspace
az sentinel onboarding-state create \
  --resource-group [RG_NAME] \
  --workspace-name [LA_WORKSPACE] \
  --name default

# 4. Enable built-in analytics rules
az sentinel alert-rule create \
  --resource-group [RG_NAME] \
  --workspace-name [LA_WORKSPACE] \
  --rule-id [TEMPLATE_ID] \
  --kind MicrosoftSecurityIncidentCreation \
  --enabled true \
  --display-name "High Severity Defender Alerts"

# 5. KQL: Hunt for failed logins across AKS
# In Log Analytics:
AzureDiagnostics
| where Category == "kube-audit"
| where log_s contains "Forbidden"
| summarize count() by bin(TimeGenerated, 1h), requestURI_s
| where count_ > 10
| order by TimeGenerated desc
```

---

## ⭐ Portfolio Projects — The 8 That Get You Hired

These 8 projects map directly to the skills requested in 80%+ of Hyderabad GCC Azure DevOps / Platform Engineer JDs (Infosys, Capgemini, HCL, Mphasis, WPP, EY, Deloitte GCC):

| # | Project | Primary JD Keyword | Linked Project |
|---|---|---|---|
| 1 | Terraform Azure Infrastructure | `Terraform`, `IaC`, `azurerm` | P15 |
| 2 | GitHub Actions CI/CD Platform | `GitHub Actions`, `CI/CD` | P6, P17 |
| 3 | Production AKS Deployment | `AKS`, `Kubernetes`, `Azure CNI` | P7 |
| 4 | GitOps with ArgoCD | `ArgoCD`, `GitOps`, `Helm` | P8 |
| 5 | Monitoring with Grafana & Prometheus | `Prometheus`, `Grafana`, `Alerting` | P9 |
| 6 | Azure Landing Zone | `Landing Zone`, `Hub-Spoke`, `Firewall` | P10 |
| 7 | DevSecOps Pipeline | `DevSecOps`, `Trivy`, `Checkov` | P14 |
| 8 | Enterprise Multi-Environment Platform | `Multi-env`, `GitOps`, `Pipeline gates` | P11 |

**Portfolio GitHub repo structure:**
```
github.com/[YOURALIAS]/
├── azure-iac-factory/          # P15 — Terraform modules
├── github-actions-platform/    # P17, P18 — reusable workflows
├── aks-production-platform/    # P7, P12 — AKS + HA
├── gitops-argocd/             # P8 — ArgoCD app-of-apps
├── monitoring-stack/           # P9 — kube-prometheus-stack
├── azure-landing-zone/         # P10 — hub-spoke + firewall
├── devsecops-pipeline/         # P14 — security gates
└── multi-env-platform/         # P11 — dev/qa/uat/prod
```

---

## Dashboard Integration

Extend the existing `MARKET_SKILLS` on the Dashboard with project completion:

```typescript
// Projects completed → skill marked "Proven" (not just "Covered")
const PROJECT_SKILLS = [
  { name: "AKS / Kubernetes",  projectId: "p7"  },
  { name: "Terraform",         projectId: "p15" },
  { name: "CI/CD Pipelines",   projectId: "p6"  },
  { name: "Docker",            projectId: "p5"  },
  { name: "GitOps / ArgoCD",   projectId: "p8"  },
  { name: "Security (Zero Trust)", projectId: "p19" },
  { name: "Observability",     projectId: "p9"  },
  { name: "Landing Zone",      projectId: "p10" },
];
```

Skill bar states:
- `To Learn` — module not completed
- `Covered` — module completed
- `Proven ✅` — module + linked project completed → green bar, bold

---

## Navbar Update

Add **Projects** to the top navbar between **Roadmap** and **Dashboard**:

```
Home | Roadmap | Projects | Dashboard | AI Interview | JD Analyzer
```

---

## XP & Gamification Summary

| Action | XP |
|---|---|
| Complete module quiz | +100 |
| Complete Beginner project | +150 |
| Complete Intermediate project | +300 |
| Complete Advanced project | +500 |
| Complete Production project | +750 |
| Unlock all 8 Portfolio projects | +500 bonus |
| Complete all 20 projects | +1000 bonus |

Total XP if all 30 modules + 20 projects completed: **~14,800 XP**

---

## Implementation Checklist

- [ ] `src/data/projects.ts` — data file with all 20 project definitions
- [ ] `src/app/projects/page.tsx` — hub page with filter bar and grid
- [ ] `src/app/projects/[id]/page.tsx` — static route with `generateStaticParams`
- [ ] `src/app/projects/[id]/ProjectClient.tsx` — 4-tab client component
- [ ] `src/components/ProjectCard.tsx` — grid card component
- [ ] `src/components/ProjectFilterBar.tsx` — difficulty + category filters
- [ ] Extend `useProgress` hook — `completedProjects` + `projectXp` fields
- [ ] Update `dashboard/page.tsx` — add Projects stats card + skill "Proven" state
- [ ] Update `Navbar` — add Projects link
- [ ] Update `generateStaticParams` — include `p1`..`p20` IDs
- [ ] Add 4 new badges to badge system (First Build, Builder, Portfolio Ready, Platform Engineer)
