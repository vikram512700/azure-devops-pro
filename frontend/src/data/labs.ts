// Per-module hands-on labs. Commands are KodeKloud / Azure free-tier friendly and
// use [BRACKETED] placeholders for variable values (Vikram's format convention).
// Each lab is a short, runnable sequence a learner can complete inside a 3-hour sandbox.

export interface LabStep {
  id: number;
  title: string;
  desc: string;
  code: string;
}

export interface ModuleLab {
  intro: string;
  steps: LabStep[];
}

export const moduleLabs: Record<string, ModuleLab> = {
  "1": {
    intro: "Create a tagged resource group across an Indian region and inspect availability zones.",
    steps: [
      { id: 1, title: "Log in to Azure", desc: "Authenticate your CLI session.", code: "az login" },
      { id: 2, title: "Create a tagged Resource Group", desc: "Use the rg-<app>-<env>-<region> convention with FinOps tags.", code: "az group create -n rg-roadmap-dev-cin -l centralindia --tags CostCenter=LEARN Environment=Dev Owner=[YOUR_NAME]" },
      { id: 3, title: "List availability zones", desc: "Confirm the region supports 3 zones for HA design.", code: "az vm list-skus -l centralindia --query \"[?resourceType=='virtualMachines'].locationInfo[0].zones | [0]\" -o tsv | sort -u" },
      { id: 4, title: "Verify the tags", desc: "Confirm tags are applied for cost allocation.", code: "az group show -n rg-roadmap-dev-cin --query tags" },
    ],
  },
  "2": {
    intro: "Explore subscription context, set CLI defaults, and create a scoped service principal.",
    steps: [
      { id: 1, title: "List your subscriptions", desc: "See every subscription you can access.", code: "az account list -o table" },
      { id: 2, title: "Set the active subscription", desc: "Switch CLI context to the target subscription.", code: "az account set --subscription [SUBSCRIPTION_ID]" },
      { id: 3, title: "Set persistent CLI defaults", desc: "Stop repeating --resource-group/--location on every command.", code: "az configure --defaults group=rg-roadmap-dev-cin location=centralindia" },
      { id: 4, title: "Create a scoped service principal", desc: "Least-privilege Contributor scoped to one RG (for pipelines).", code: "az ad sp create-for-rbac --name sp-roadmap-ci --role Contributor --scopes /subscriptions/[SUBSCRIPTION_ID]/resourceGroups/rg-roadmap-dev-cin" },
    ],
  },
  "3": {
    intro: "Build a hub-spoke VNet foundation and peer two networks.",
    steps: [
      { id: 1, title: "Create the Hub VNet", desc: "10.0.0.0/16 hub with a default subnet.", code: "az network vnet create -g rg-roadmap-dev-cin -n hub-vnet --address-prefix 10.0.0.0/16 --subnet-name shared --subnet-prefix 10.0.1.0/24" },
      { id: 2, title: "Create a Spoke VNet", desc: "Non-overlapping 10.1.0.0/16 spoke.", code: "az network vnet create -g rg-roadmap-dev-cin -n spoke-vnet --address-prefix 10.1.0.0/16 --subnet-name workload --subnet-prefix 10.1.0.0/22" },
      { id: 3, title: "Peer hub -> spoke", desc: "Allow forwarded traffic for hub-spoke routing.", code: "az network vnet peering create -g rg-roadmap-dev-cin -n hub-to-spoke --vnet-name hub-vnet --remote-vnet spoke-vnet --allow-vnet-access --allow-forwarded-traffic" },
      { id: 4, title: "Peer spoke -> hub", desc: "Peering is bidirectional — create the reverse link.", code: "az network vnet peering create -g rg-roadmap-dev-cin -n spoke-to-hub --vnet-name spoke-vnet --remote-vnet hub-vnet --allow-vnet-access --allow-forwarded-traffic" },
    ],
  },
  "4": {
    intro: "Create an NSG, add a prioritized allow rule, and inspect effective rules.",
    steps: [
      { id: 1, title: "Create an NSG", desc: "A network security group to attach to a subnet.", code: "az network nsg create -g rg-roadmap-dev-cin -n workload-nsg" },
      { id: 2, title: "Add an Allow-HTTPS rule", desc: "Priority 100 allow for 443 inbound.", code: "az network nsg rule create -g rg-roadmap-dev-cin --nsg-name workload-nsg -n Allow443 --priority 100 --destination-port-ranges 443 --access Allow --protocol Tcp --direction Inbound" },
      { id: 3, title: "Add an explicit Deny-All", desc: "Priority 4096 catch-all deny (rules evaluated low->high).", code: "az network nsg rule create -g rg-roadmap-dev-cin --nsg-name workload-nsg -n DenyAll --priority 4096 --access Deny --protocol '*' --direction Inbound --destination-port-ranges '*'" },
      { id: 4, title: "List the rules by priority", desc: "Confirm evaluation order — first match wins.", code: "az network nsg rule list -g rg-roadmap-dev-cin --nsg-name workload-nsg --query \"sort_by([].{Name:name,Priority:priority,Access:access},&Priority)\" -o table" },
    ],
  },
  "5": {
    intro: "Create a burstable VM, inspect its SKU, and resize it.",
    steps: [
      { id: 1, title: "Create a small Linux VM", desc: "Use a cheap burstable SKU for the sandbox.", code: "az vm create -g rg-roadmap-dev-cin -n lab-vm --image Ubuntu2204 --size Standard_B1s --admin-username azureuser --generate-ssh-keys" },
      { id: 2, title: "Show the VM size & disk", desc: "Inspect SKU and OS disk tier.", code: "az vm show -g rg-roadmap-dev-cin -n lab-vm --query \"{size:hardwareProfile.vmSize, osDisk:storageProfile.osDisk.managedDisk.storageAccountType}\"" },
      { id: 3, title: "Deallocate before resizing", desc: "Stop billing for compute; resize requires deallocation for some SKUs.", code: "az vm deallocate -g rg-roadmap-dev-cin -n lab-vm" },
      { id: 4, title: "Resize the VM", desc: "Move to a slightly larger general-purpose SKU.", code: "az vm resize -g rg-roadmap-dev-cin -n lab-vm --size Standard_B2s && az vm start -g rg-roadmap-dev-cin -n lab-vm" },
    ],
  },
  "6": {
    intro: "Deploy a web app to App Service and add a staging slot for blue-green swaps.",
    steps: [
      { id: 1, title: "Create an App Service Plan", desc: "Standard tier (S1) to enable deployment slots.", code: "az appservice plan create -g rg-roadmap-dev-cin -n roadmap-plan --sku S1 --is-linux" },
      { id: 2, title: "Create the Web App", desc: "Node runtime, hosted on the plan.", code: "az webapp create -g rg-roadmap-dev-cin -p roadmap-plan -n roadmap-app-[UNIQUE] --runtime 'NODE:20-lts'" },
      { id: 3, title: "Add a staging slot", desc: "For zero-downtime blue-green deploys.", code: "az webapp deployment slot create -g rg-roadmap-dev-cin -n roadmap-app-[UNIQUE] --slot staging" },
      { id: 4, title: "Swap staging into production", desc: "Instant cutover; swap back to roll back.", code: "az webapp deployment slot swap -g rg-roadmap-dev-cin -n roadmap-app-[UNIQUE] --slot staging --target-slot production" },
    ],
  },
  "7": {
    intro: "Build a layered Docker image and inspect the cache and layers.",
    steps: [
      { id: 1, title: "Create an optimized Dockerfile", desc: "Copy package files before source for cache efficiency.", code: "printf 'FROM node:20-alpine\\nWORKDIR /app\\nCOPY package*.json ./\\nRUN npm ci --omit=dev\\nCOPY . .\\nUSER node\\nCMD [\"node\",\"index.js\"]\\n' > Dockerfile" },
      { id: 2, title: "Build the image", desc: "Tag with an immutable version, never just 'latest'.", code: "docker build -t roadmap-api:0.1.0 ." },
      { id: 3, title: "Inspect the layers", desc: "See how each instruction created a cached layer.", code: "docker history roadmap-api:0.1.0" },
      { id: 4, title: "Rebuild to see cache hits", desc: "Re-run — dependency layers should say CACHED.", code: "docker build -t roadmap-api:0.1.0 ." },
    ],
  },
  "8": {
    intro: "Convert to a multi-stage build and scan the image with Trivy.",
    steps: [
      { id: 1, title: "Write a multi-stage Dockerfile", desc: "Builder stage compiles; slim runtime stage ships.", code: "printf 'FROM node:20 AS builder\\nWORKDIR /app\\nCOPY . .\\nRUN npm ci && npm run build\\n\\nFROM node:20-alpine\\nWORKDIR /app\\nCOPY --from=builder /app/dist ./dist\\nCOPY --from=builder /app/node_modules ./node_modules\\nUSER node\\nCMD [\"node\",\"dist/index.js\"]\\n' > Dockerfile" },
      { id: 2, title: "Build the slim image", desc: "Final image has no build toolchain.", code: "docker build -t roadmap-api:0.2.0 ." },
      { id: 3, title: "Scan with Trivy", desc: "Fail the build on fixable CRITICAL CVEs.", code: "trivy image --severity CRITICAL --ignore-unfixed --exit-code 1 roadmap-api:0.2.0" },
      { id: 4, title: "Compare image sizes", desc: "Confirm the multi-stage image is dramatically smaller.", code: "docker images roadmap-api" },
    ],
  },
  "9": {
    intro: "Create an ACR, push an image, and inspect repositories.",
    steps: [
      { id: 1, title: "Create a Basic ACR", desc: "Private OCI registry (Basic SKU is fine for the lab).", code: "az acr create -g rg-roadmap-dev-cin -n roadmapacr[UNIQUE] --sku Basic" },
      { id: 2, title: "Build directly in ACR", desc: "ACR Tasks builds without a local Docker daemon.", code: "az acr build -r roadmapacr[UNIQUE] -t roadmap-api:0.2.0 ." },
      { id: 3, title: "List repositories & tags", desc: "Confirm the image landed in the registry.", code: "az acr repository show-tags -n roadmapacr[UNIQUE] --repository roadmap-api -o table" },
      { id: 4, title: "Enable a retention policy", desc: "Auto-purge untagged manifests to control cost (Premium).", code: "az acr config retention update -r roadmapacr[UNIQUE] --status enabled --days 7 --type UntaggedManifests" },
    ],
  },
  "10": {
    intro: "Create a small AKS cluster, attach ACR, and connect kubectl.",
    steps: [
      { id: 1, title: "Create a 1-node AKS cluster", desc: "Single small node pool — sandbox friendly.", code: "az aks create -g rg-roadmap-dev-cin -n roadmap-aks --node-count 1 --node-vm-size Standard_D2s_v3 --network-plugin azure --generate-ssh-keys" },
      { id: 2, title: "Attach ACR (password-less pulls)", desc: "Grant AcrPull to the kubelet managed identity.", code: "az aks update -g rg-roadmap-dev-cin -n roadmap-aks --attach-acr roadmapacr[UNIQUE]" },
      { id: 3, title: "Get cluster credentials", desc: "Merge kubeconfig so kubectl can talk to AKS.", code: "az aks get-credentials -g rg-roadmap-dev-cin -n roadmap-aks" },
      { id: 4, title: "Verify nodes & system pods", desc: "Confirm the node is Ready and system pods run.", code: "kubectl get nodes && kubectl get pods -n kube-system" },
    ],
  },
  "11": {
    intro: "Deploy an app, expose it with a Service, and perform a rolling update.",
    steps: [
      { id: 1, title: "Create a Deployment", desc: "3 replicas of a sample image.", code: "kubectl create deployment web --image=nginx:1.25 --replicas=3" },
      { id: 2, title: "Expose it with a Service", desc: "ClusterIP service load-balancing across the pods.", code: "kubectl expose deployment web --port=80 --target-port=80 --name=web-svc" },
      { id: 3, title: "Check the endpoints", desc: "Confirm the Service routes to the pod IPs.", code: "kubectl get endpoints web-svc -o wide" },
      { id: 4, title: "Rolling update + watch rollout", desc: "Update the image and watch zero-downtime replacement.", code: "kubectl set image deployment/web nginx=nginx:1.27 && kubectl rollout status deployment/web" },
    ],
  },
  "12": {
    intro: "Install the NGINX ingress controller and route traffic by path.",
    steps: [
      { id: 1, title: "Install NGINX ingress", desc: "Deploy the controller into its own namespace.", code: "kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/cloud/deploy.yaml" },
      { id: 2, title: "Verify the controller", desc: "Wait for the controller pod to be Ready.", code: "kubectl get pods -n ingress-nginx -w" },
      { id: 3, title: "Create an Ingress rule", desc: "Route /web to the web-svc backend.", code: "kubectl create ingress web-ingress --rule='[YOUR_HOST]/web*=web-svc:80' --class=nginx" },
      { id: 4, title: "Get the external IP", desc: "Find the public IP assigned to the ingress.", code: "kubectl get svc -n ingress-nginx ingress-nginx-controller" },
    ],
  },
  "13": {
    intro: "Add a Horizontal Pod Autoscaler and a default-deny NetworkPolicy.",
    steps: [
      { id: 1, title: "Set resource requests", desc: "HPA needs CPU requests to compute utilization.", code: "kubectl set resources deployment web --requests=cpu=100m --limits=cpu=250m" },
      { id: 2, title: "Create an HPA", desc: "Scale 2-10 replicas targeting 60% CPU.", code: "kubectl autoscale deployment web --cpu-percent=60 --min=2 --max=10" },
      { id: 3, title: "Watch the HPA", desc: "Observe current vs target utilization.", code: "kubectl get hpa web -w" },
      { id: 4, title: "Apply a default-deny NetworkPolicy", desc: "Lock down all ingress to the namespace (zero trust).", code: "kubectl apply -f - <<'EOF'\napiVersion: networking.k8s.io/v1\nkind: NetworkPolicy\nmetadata:\n  name: default-deny-ingress\nspec:\n  podSelector: {}\n  policyTypes: [Ingress]\nEOF" },
    ],
  },
  "14": {
    intro: "Practice the core Git branch -> commit -> rebase -> merge flow.",
    steps: [
      { id: 1, title: "Create a feature branch", desc: "Branch off main for isolated work.", code: "git checkout -b feature/[TICKET-ID]" },
      { id: 2, title: "Commit your change", desc: "Stage and commit with a clear message.", code: "git add . && git commit -m 'feat: implement [FEATURE]'" },
      { id: 3, title: "Rebase onto latest main", desc: "Replay your commits on top of main for a clean history.", code: "git fetch origin && git rebase origin/main" },
      { id: 4, title: "Push and open a PR", desc: "Push the branch; open a PR with required reviewers.", code: "git push -u origin feature/[TICKET-ID]" },
    ],
  },
  "15": {
    intro: "Author a GitHub Actions workflow with a matrix build and OIDC Azure login.",
    steps: [
      { id: 1, title: "Scaffold a workflow file", desc: "Create the workflows directory and CI file.", code: "mkdir -p .github/workflows && touch .github/workflows/ci.yml" },
      { id: 2, title: "Add a matrix build", desc: "Test across Node 18 and 20 in parallel.", code: "printf 'name: CI\\non: [push]\\njobs:\\n  build:\\n    runs-on: ubuntu-latest\\n    strategy:\\n      matrix:\\n        node: [18, 20]\\n    steps:\\n      - uses: actions/checkout@v4\\n      - uses: actions/setup-node@v4\\n        with:\\n          node-version: ${{ matrix.node }}\\n      - run: npm ci && npm test\\n' > .github/workflows/ci.yml" },
      { id: 3, title: "Create the Azure federated credential", desc: "OIDC trust — no client secret stored in GitHub.", code: "az ad app federated-credential create --id [APP_ID] --parameters '{\"name\":\"gh-main\",\"issuer\":\"https://token.actions.githubusercontent.com\",\"subject\":\"repo:[ORG]/[REPO]:ref:refs/heads/main\",\"audiences\":[\"api://AzureADTokenExchange\"]}'" },
      { id: 4, title: "Commit and push to trigger CI", desc: "The push event runs the workflow.", code: "git add .github && git commit -m 'ci: add matrix build' && git push" },
    ],
  },
  "16": {
    intro: "Create a multi-stage Azure Pipeline and a service connection concept.",
    steps: [
      { id: 1, title: "Create the pipeline YAML", desc: "Stages: Build then Deploy.", code: "printf 'trigger: [main]\\nstages:\\n- stage: Build\\n  jobs:\\n  - job: build\\n    pool: {vmImage: ubuntu-latest}\\n    steps:\\n    - script: docker build -t $(acr)/roadmap-api:$(Build.SourceVersion) .\\n- stage: Deploy\\n  dependsOn: Build\\n  jobs:\\n  - deployment: deploy\\n    environment: Production\\n    pool: {vmImage: ubuntu-latest}\\n    strategy: {runOnce: {deploy: {steps: [{script: echo deploying}]}}}\\n' > azure-pipelines.yml" },
      { id: 2, title: "Lint the YAML locally", desc: "Validate indentation before pushing.", code: "python -c \"import yaml,sys; yaml.safe_load(open('azure-pipelines.yml')); print('valid')\"" },
      { id: 3, title: "Push to the repo", desc: "Azure DevOps picks up azure-pipelines.yml on trigger.", code: "git add azure-pipelines.yml && git commit -m 'ci: add multi-stage pipeline' && git push" },
      { id: 4, title: "Verify ARM connection (CLI analog)", desc: "Confirm the SP/identity the pipeline uses can reach the RG.", code: "az group show -n rg-roadmap-dev-cin --query name" },
    ],
  },
  "17": {
    intro: "Practice a Kubernetes deploy with rollout history and a one-command rollback.",
    steps: [
      { id: 1, title: "Annotate the deploy as a release", desc: "Record a change cause for the rollout history.", code: "kubectl annotate deployment/web kubernetes.io/change-cause='release v1.27' --overwrite" },
      { id: 2, title: "Deploy a 'bad' version", desc: "Simulate a release that fails (invalid tag).", code: "kubectl set image deployment/web nginx=nginx:doesnotexist" },
      { id: 3, title: "Inspect the rollout history", desc: "See revisions and change causes.", code: "kubectl rollout history deployment/web" },
      { id: 4, title: "Roll back instantly", desc: "Revert to the previous good revision.", code: "kubectl rollout undo deployment/web" },
    ],
  },
  "18": {
    intro: "Initialize Terraform with an Azure Blob remote state backend.",
    steps: [
      { id: 1, title: "Create a state storage account", desc: "Backend storage for locked remote state.", code: "az storage account create -g rg-roadmap-dev-cin -n tfstate[UNIQUE] --sku Standard_LRS && az storage container create --account-name tfstate[UNIQUE] -n tfstate" },
      { id: 2, title: "Write the backend config", desc: "Point Terraform at the Blob backend.", code: "printf 'terraform {\\n  backend \"azurerm\" {\\n    resource_group_name  = \"rg-roadmap-dev-cin\"\\n    storage_account_name = \"tfstate[UNIQUE]\"\\n    container_name       = \"tfstate\"\\n    key                  = \"dev.tfstate\"\\n  }\\n}\\nprovider \"azurerm\" { features {} skip_provider_registration = true }\\n' > main.tf" },
      { id: 3, title: "Initialize Terraform", desc: "Download providers and configure the backend.", code: "terraform init" },
      { id: 4, title: "Plan a resource group", desc: "Preview the change before applying.", code: "terraform plan" },
    ],
  },
  "19": {
    intro: "Refactor into a reusable module and apply per-environment with tfvars.",
    steps: [
      { id: 1, title: "Create a module folder", desc: "Reusable component for a resource group.", code: "mkdir -p modules/rg && printf 'variable \"name\" {}\\nvariable \"location\" { default = \"centralindia\" }\\nresource \"azurerm_resource_group\" \"this\" {\\n  name     = var.name\\n  location = var.location\\n}\\n' > modules/rg/main.tf" },
      { id: 2, title: "Consume the module", desc: "Call the module from root config.", code: "printf 'module \"rg\" {\\n  source = \"./modules/rg\"\\n  name   = var.rg_name\\n}\\nvariable \"rg_name\" {}\\n' >> main.tf" },
      { id: 3, title: "Create env tfvars", desc: "Per-environment values, same module logic.", code: "echo 'rg_name = \"rg-roadmap-dev-cin\"' > dev.tfvars" },
      { id: 4, title: "Apply with the var-file", desc: "Provision using the dev values.", code: "terraform init && terraform apply -var-file=dev.tfvars -auto-approve" },
    ],
  },
  "20": {
    intro: "Author a Bicep file, preview with what-if, then deploy.",
    steps: [
      { id: 1, title: "Write a Bicep template", desc: "Declare a storage account declaratively.", code: "printf 'param location string = resourceGroup().location\\nresource sa \"Microsoft.Storage/storageAccounts@2023-01-01\" = {\\n  name: ''roadmap[UNIQUE]''\\n  location: location\\n  sku: { name: ''Standard_LRS'' }\\n  kind: ''StorageV2''\\n}\\n' > main.bicep" },
      { id: 2, title: "Validate / build the Bicep", desc: "Transpile to ARM JSON to catch errors.", code: "az bicep build -f main.bicep" },
      { id: 3, title: "Preview with what-if", desc: "See exactly what will change (Bicep's 'plan').", code: "az deployment group what-if -g rg-roadmap-dev-cin -f main.bicep" },
      { id: 4, title: "Deploy the template", desc: "Apply the declared state to the RG.", code: "az deployment group create -g rg-roadmap-dev-cin -f main.bicep" },
    ],
  },
  "21": {
    intro: "Create a user-assigned managed identity and grant it a scoped role.",
    steps: [
      { id: 1, title: "Create a managed identity", desc: "Standalone identity, shareable across resources.", code: "az identity create -g rg-roadmap-dev-cin -n roadmap-mi" },
      { id: 2, title: "Capture its principal ID", desc: "Needed to assign RBAC.", code: "az identity show -g rg-roadmap-dev-cin -n roadmap-mi --query principalId -o tsv" },
      { id: 3, title: "Assign a least-privilege role", desc: "Reader scoped to one resource group only.", code: "az role assignment create --assignee [PRINCIPAL_ID] --role Reader --scope /subscriptions/[SUBSCRIPTION_ID]/resourceGroups/rg-roadmap-dev-cin" },
      { id: 4, title: "Verify the assignment", desc: "Confirm scope and role are correct.", code: "az role assignment list --assignee [PRINCIPAL_ID] -o table" },
    ],
  },
  "22": {
    intro: "Create a Key Vault, store a secret, and read it back with RBAC.",
    steps: [
      { id: 1, title: "Create an RBAC-enabled Key Vault", desc: "Use Azure RBAC instead of legacy access policies.", code: "az keyvault create -g rg-roadmap-dev-cin -n roadmapkv[UNIQUE] --enable-rbac-authorization true" },
      { id: 2, title: "Grant yourself Secrets Officer", desc: "Permission to set/read secrets.", code: "az role assignment create --assignee [YOUR_OBJECT_ID] --role 'Key Vault Secrets Officer' --scope /subscriptions/[SUBSCRIPTION_ID]/resourceGroups/rg-roadmap-dev-cin/providers/Microsoft.KeyVault/vaults/roadmapkv[UNIQUE]" },
      { id: 3, title: "Store a secret", desc: "Save a DB connection string.", code: "az keyvault secret set --vault-name roadmapkv[UNIQUE] -n db-conn --value '[CONNECTION_STRING]'" },
      { id: 4, title: "Read the secret back", desc: "Retrieve the value to confirm access.", code: "az keyvault secret show --vault-name roadmapkv[UNIQUE] -n db-conn --query value -o tsv" },
    ],
  },
  "23": {
    intro: "Create a storage account, upload a blob, and apply a lifecycle tiering rule.",
    steps: [
      { id: 1, title: "Create a storage account", desc: "StandardV2 with hot default tier.", code: "az storage account create -g rg-roadmap-dev-cin -n roadmapblob[UNIQUE] --sku Standard_LRS --access-tier Hot" },
      { id: 2, title: "Create a container", desc: "Object container for the blob.", code: "az storage container create --account-name roadmapblob[UNIQUE] -n media --auth-mode login" },
      { id: 3, title: "Upload a blob", desc: "Upload a sample file.", code: "az storage blob upload --account-name roadmapblob[UNIQUE] -c media -n sample.txt -f ./sample.txt --auth-mode login" },
      { id: 4, title: "Generate a short-lived SAS", desc: "Read-only token expiring in 15 minutes.", code: "az storage blob generate-sas --account-name roadmapblob[UNIQUE] -c media -n sample.txt --permissions r --expiry $(date -u -d '15 minutes' '+%Y-%m-%dT%H:%MZ') --auth-mode login --as-user" },
    ],
  },
  "24": {
    intro: "Create an action group and a metric alert on a resource.",
    steps: [
      { id: 1, title: "Create an action group", desc: "Reusable notification target (email).", code: "az monitor action-group create -g rg-roadmap-dev-cin -n oncall --short-name oncall --action email me [YOUR_EMAIL]" },
      { id: 2, title: "Find the resource ID to monitor", desc: "Get the VM/resource ID for the alert scope.", code: "az vm show -g rg-roadmap-dev-cin -n lab-vm --query id -o tsv" },
      { id: 3, title: "Create a CPU metric alert", desc: "Fire when average CPU > 80% for 5 min.", code: "az monitor metrics alert create -g rg-roadmap-dev-cin -n high-cpu --scopes [RESOURCE_ID] --condition 'avg Percentage CPU > 80' --window-size 5m --action oncall" },
      { id: 4, title: "List your alert rules", desc: "Confirm the rule is enabled.", code: "az monitor metrics alert list -g rg-roadmap-dev-cin -o table" },
    ],
  },
  "25": {
    intro: "Create a Log Analytics workspace and run KQL queries.",
    steps: [
      { id: 1, title: "Create a workspace", desc: "Central log store for KQL queries.", code: "az monitor log-analytics workspace create -g rg-roadmap-dev-cin -n roadmap-logs" },
      { id: 2, title: "Get the workspace ID", desc: "Needed to run queries against it.", code: "az monitor log-analytics workspace show -g rg-roadmap-dev-cin -n roadmap-logs --query customerId -o tsv" },
      { id: 3, title: "Run a KQL heartbeat query", desc: "List agents reporting in the last hour.", code: "az monitor log-analytics query -w [WORKSPACE_ID] --analytics-query 'Heartbeat | summarize count() by Computer, bin(TimeGenerated, 5m)'" },
      { id: 4, title: "Query for errors", desc: "Aggregate error log lines over time.", code: "az monitor log-analytics query -w [WORKSPACE_ID] --analytics-query \"AzureActivity | where Level == 'Error' | summarize count() by bin(TimeGenerated, 1h)\"" },
    ],
  },
  "26": {
    intro: "Package a Kubernetes app as a Helm chart and deploy per-environment.",
    steps: [
      { id: 1, title: "Scaffold a chart", desc: "Create a new chart skeleton.", code: "helm create roadmap-chart" },
      { id: 2, title: "Install the release", desc: "Render templates and deploy as a tracked release.", code: "helm install roadmap ./roadmap-chart --set replicaCount=2" },
      { id: 3, title: "Upgrade with prod values", desc: "Same chart, different values = different env.", code: "helm upgrade roadmap ./roadmap-chart --set replicaCount=5 --set image.tag=0.2.0" },
      { id: 4, title: "Inspect history & rollback", desc: "View revisions; roll back if needed.", code: "helm history roadmap && helm rollback roadmap 1" },
    ],
  },
  "27": {
    intro: "Install ArgoCD and create a GitOps Application synced from Git.",
    steps: [
      { id: 1, title: "Install ArgoCD", desc: "Deploy the controller into its namespace.", code: "kubectl create namespace argocd && kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml" },
      { id: 2, title: "Wait for ArgoCD pods", desc: "Confirm the server and controller are Ready.", code: "kubectl get pods -n argocd -w" },
      { id: 3, title: "Get the admin password", desc: "Initial password to log in to the UI.", code: "kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath='{.data.password}' | base64 -d" },
      { id: 4, title: "Create an Application", desc: "Point ArgoCD at a Git repo to reconcile.", code: "kubectl apply -f - <<'EOF'\napiVersion: argoproj.io/v1alpha1\nkind: Application\nmetadata:\n  name: roadmap\n  namespace: argocd\nspec:\n  project: default\n  source: { repoURL: '[GIT_REPO_URL]', path: 'k8s', targetRevision: main }\n  destination: { server: 'https://kubernetes.default.svc', namespace: default }\n  syncPolicy: { automated: { selfHeal: true, prune: true } }\nEOF" },
    ],
  },
  "28": {
    intro: "Set a budget, enforce mandatory tags with Policy, and review cost.",
    steps: [
      { id: 1, title: "Create a budget with alerts", desc: "Notify at 80%/100% of a monthly amount.", code: "az consumption budget create --budget-name roadmap-budget --amount 50 --time-grain Monthly --category Cost --resource-group rg-roadmap-dev-cin" },
      { id: 2, title: "Assign a 'require tag' policy", desc: "Deny resources missing CostCenter tag.", code: "az policy assignment create --name require-costcenter --policy [POLICY_DEF_ID] --params '{\"tagName\":{\"value\":\"CostCenter\"}}' --scope /subscriptions/[SUBSCRIPTION_ID]/resourceGroups/rg-roadmap-dev-cin" },
      { id: 3, title: "List Advisor cost recommendations", desc: "Find right-sizing / idle-resource savings.", code: "az advisor recommendation list --category Cost -o table" },
      { id: 4, title: "Review spend by resource group", desc: "Slice current costs for chargeback.", code: "az consumption usage list --query \"[].{Resource:instanceName, Cost:pretaxCost}\" -o table" },
    ],
  },
  "29": {
    intro: "Simulate chaos safely: kill pods and verify the Deployment self-heals.",
    steps: [
      { id: 1, title: "Confirm steady state", desc: "Record the healthy replica count (your hypothesis baseline).", code: "kubectl get deployment web -o wide" },
      { id: 2, title: "Inject a fault (kill a pod)", desc: "Delete one pod and watch the controller react.", code: "kubectl delete pod -l app=web --field-selector=status.phase=Running --grace-period=0 | head -1" },
      { id: 3, title: "Observe self-healing", desc: "The ReplicaSet should recreate the pod automatically.", code: "kubectl get pods -l app=web -w" },
      { id: 4, title: "Add a PodDisruptionBudget", desc: "Guarantee minimum availability during disruptions.", code: "kubectl apply -f - <<'EOF'\napiVersion: policy/v1\nkind: PodDisruptionBudget\nmetadata:\n  name: web-pdb\nspec:\n  minAvailable: 2\n  selector:\n    matchLabels:\n      app: web\nEOF" },
    ],
  },
  "30": {
    intro: "Capstone: validate zonal resilience by draining a node and confirming SLO.",
    steps: [
      { id: 1, title: "Spread pods & confirm zones", desc: "Check which zones your nodes are in.", code: "kubectl get nodes -L topology.kubernetes.io/zone" },
      { id: 2, title: "Cordon a node (simulate zone loss)", desc: "Prevent scheduling on one node.", code: "kubectl cordon [NODE_NAME]" },
      { id: 3, title: "Drain the node", desc: "Evict pods; they should reschedule to surviving nodes.", code: "kubectl drain [NODE_NAME] --ignore-daemonsets --delete-emptydir-data" },
      { id: 4, title: "Verify service stayed up, then restore", desc: "Confirm pods rescheduled and uncordon the node.", code: "kubectl get pods -o wide && kubectl uncordon [NODE_NAME]" },
    ],
  },
};
