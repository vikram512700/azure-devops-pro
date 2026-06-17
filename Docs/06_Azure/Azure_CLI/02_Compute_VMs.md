# Azure CLI for DevOps - Part 2: Compute & Virtual Machines

## Real-World Lens

- How this appears in production: on-call fixes, release work, access issues, scaling, or automation.
- What to look for: the symptom, the cause, the safe fix, and the verification step.
- What to remember for interviews: the tradeoff, the guardrail, and the observable result.

## Why It Matters

- This chapter is written to sound like a real system you have touched in a team.
- Use the commands as a runbook, not just as syntax memorization.
- Treat the troubleshooting notes as your first response during incidents.

Azure content here should read like someone operating real cloud resources under cost, security, and governance pressure.
Use the CLI and portal examples as if you are building or fixing platform work for a production team.
Always connect the command to the resource, the risk, and the validation step.

**Definition:** Managing Azure Compute via CLI allows DevOps engineers to programmatically spin up, configure, and tear down Virtual Machines and Scale Sets in seconds.

## 📌 1. Create a Virtual Machine

```bash
# Scenario: Spin up a Linux build server
az vm create \
  --resource-group rg-devops \
  --name build-server-01 \
  --image Ubuntu2204 \
  --size Standard_B2s \
  --admin-username azureuser \
  --generate-ssh-keys \
  --public-ip-sku Standard \
  --tags Environment=Dev Team=DevOps

# Scenario: Create Windows VM for IIS deployment
az vm create \
  --resource-group rg-devops \
  --name web-server-win \
  --image Win2022Datacenter \
  --size Standard_D2s_v3 \
  --admin-username adminuser \
  --admin-password 'P@ssw0rd1234!' \
  --public-ip-sku Standard
```

## 📌 2. VM Management

```bash
# List all VMs with status
az vm list -d --output table

# Start / Stop / Restart / Deallocate
az vm start -g rg-devops -n build-server-01
az vm stop -g rg-devops -n build-server-01
az vm restart -g rg-devops -n build-server-01
az vm deallocate -g rg-devops -n build-server-01    # saves cost

# Scenario: Stop all VMs in DEV environment at night (cost saving)
az vm list -d --query "[?tags.Environment=='Dev'].{name:name, rg:resourceGroup}" -o tsv | \
while read name rg; do
  echo "Stopping $name in $rg"
  az vm deallocate -g "$rg" -n "$name" --no-wait
done

# Resize VM
# Scenario: App needs more CPU during peak hours
az vm resize -g rg-devops -n build-server-01 --size Standard_D4s_v3

# List available VM sizes in a region
az vm list-sizes --location eastus --output table

# Delete VM
az vm delete -g rg-devops -n build-server-01 --yes
```

## 📌 3. VM Disks

```bash
# Add a data disk
# Scenario: Build server needs extra storage for artifacts
az vm disk attach \
  --resource-group rg-devops \
  --vm-name build-server-01 \
  --name build-data-disk \
  --size-gb 128 \
  --sku Premium_LRS \
  --new

# List disks
az disk list -g rg-devops --output table

# Detach disk
az vm disk detach -g rg-devops --vm-name build-server-01 --name build-data-disk

# Snapshot a disk (backup before upgrade)
az snapshot create \
  -g rg-devops \
  -n snapshot-before-upgrade \
  --source build-data-disk
```

## 📌 4. VM Extensions (Run Scripts on VMs)

```bash
# Scenario: Install Docker on VM after creation
az vm extension set \
  --resource-group rg-devops \
  --vm-name build-server-01 \
  --name customScript \
  --publisher Microsoft.Azure.Extensions \
  --settings '{"commandToExecute":"apt-get update && apt-get install -y docker.io && systemctl enable docker"}'

# Scenario: Install monitoring agent
az vm extension set \
  --resource-group rg-devops \
  --vm-name build-server-01 \
  --name AzureMonitorLinuxAgent \
  --publisher Microsoft.Azure.Monitor \
  --enable-auto-upgrade true

# Run ad-hoc command on VM
# Scenario: Quick check disk space on production server
az vm run-command invoke \
  -g rg-prod \
  -n web-server-01 \
  --command-id RunShellScript \
  --scripts "df -h && free -m && uptime"
```

## 📌 5. VM Images & Snapshots

```bash
# List available images
az vm image list --output table
az vm image list --offer UbuntuServer --all --output table

# Scenario: Create golden image from configured VM
az vm deallocate -g rg-devops -n golden-vm
az vm generalize -g rg-devops -n golden-vm
az image create \
  -g rg-devops \
  -n golden-image-v1 \
  --source golden-vm

# Create VM from custom image
az vm create -g rg-devops -n new-server \
  --image golden-image-v1 \
  --admin-username azureuser \
  --generate-ssh-keys
```

## 📌 6. VM Scale Sets (VMSS)

```bash
# Scenario: Auto-scaling web tier for e-commerce app
az vmss create \
  --resource-group rg-prod \
  --name vmss-web-tier \
  --image Ubuntu2204 \
  --instance-count 2 \
  --vm-sku Standard_B2s \
  --admin-username azureuser \
  --generate-ssh-keys \
  --load-balancer vmss-lb \
  --upgrade-policy-mode Automatic

# Scale out/in manually
az vmss scale -g rg-prod -n vmss-web-tier --new-capacity 5

# Setup autoscale rules
# Scenario: Scale out when CPU > 70%, scale in when CPU < 30%
az monitor autoscale create \
  -g rg-prod \
  --resource vmss-web-tier \
  --resource-type Microsoft.Compute/virtualMachineScaleSets \
  --min-count 2 --max-count 10 --count 2

az monitor autoscale rule create \
  -g rg-prod \
  --autoscale-name autoscale-vmss \
  --condition "Percentage CPU > 70 avg 5m" \
  --scale out 2

az monitor autoscale rule create \
  -g rg-prod \
  --autoscale-name autoscale-vmss \
  --condition "Percentage CPU < 30 avg 5m" \
  --scale in 1

# List VMSS instances
az vmss list-instances -g rg-prod -n vmss-web-tier --output table

# Update VMSS image
az vmss update -g rg-prod -n vmss-web-tier --set virtualMachineProfile.storageProfile.imageReference.version=latest
az vmss update-instances -g rg-prod -n vmss-web-tier --instance-ids "*"
```

## 📌 7. Availability Sets

```bash
# Scenario: Ensure high availability for database VMs
az vm availability-set create \
  -g rg-prod \
  -n avset-database \
  --platform-fault-domain-count 2 \
  --platform-update-domain-count 5

# Create VM in availability set
az vm create -g rg-prod -n db-server-01 \
  --image Ubuntu2204 \
  --availability-set avset-database \
  --size Standard_D4s_v3 \
  --admin-username azureuser \
  --generate-ssh-keys
```

______________________________________________________________________

> In Azure, the command is only half the job. The other half is knowing which resource changed and how to verify it.

