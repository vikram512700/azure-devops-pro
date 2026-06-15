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
      whatIsIt: "A Virtual Network (VNet) is the fundamental building block for your private network in Azure. It enables many types of Azure resources, such as Azure Virtual Machines (VM), to securely communicate with each other, the internet, and on-premises networks.",
      keyConcepts: [
        { label: "Address Space", desc: "The CIDR block for the VNet (e.g. 10.0.0.0/16)." },
        { label: "Subnets", desc: "Smaller logical partitions of your VNet (e.g. 10.0.1.0/24)." },
        { label: "Network Security Groups (NSG)", desc: "Firewalls containing security rules that allow or deny inbound/outbound network traffic." }
      ]
    },
    realWorld: {
      title: "Jio/Reliance Enterprise Use Case",
      description: "How VNets are used in production at scale",
      intro: "In a massive GCC like Jio Platforms, you don't just create isolated networks. You use a Hub-Spoke Topology to manage hundreds of microservices.",
      points: [
        "Hub VNet: Acts as the central point of connectivity to the on-premises Jio Data Center via ExpressRoute. It houses shared services like Azure Firewall, Bastion, and Private DNS Resolvers.",
        "Spoke VNets: Each product team (e.g., JioMart, JioCinema) gets their own isolated Spoke VNet. This Spoke VNet is peered directly to the Hub VNet."
      ],
      shortcut: "AWS VPC == Azure VNet\nAWS Subnet == Azure Subnet\nAWS Security Group == Azure NSG"
    },
    interview: [
      {
        q: "What is the difference between an NSG and Azure Firewall?",
        a: "An NSG operates at Layer 3/4 and allows/denies traffic based on simple 5-tuple rules. Azure Firewall is a managed network security service operating at Layer 7 with threat intelligence and deep packet inspection."
      },
      {
        q: "How do you connect two VNets in different regions?",
        a: "By using Global VNet Peering. It securely routes traffic through the Microsoft backbone infrastructure without needing a public internet connection or VPN gateway."
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
      whatIsIt: "AKS simplifies deploying a managed Kubernetes cluster in Azure by offloading the operational overhead to Azure. Azure manages the control plane, and you manage the agent nodes.",
      keyConcepts: [
        { label: "Control Plane", desc: "Managed by Azure, contains API server, etcd, scheduler. You don't pay for this." },
        { label: "Node Pools", desc: "Groups of VMs running your workloads. You can mix Linux and Windows node pools." },
        { label: "Azure CNI", desc: "Advanced networking where every pod gets a unique IP address directly from the Azure VNet." }
      ]
    },
    realWorld: {
      title: "High Traffic Telecommunications",
      description: "Handling Jio scale traffic spikes",
      intro: "During events like IPL streams, traffic spikes unpredictably. A standard VM scale set isn't fast enough.",
      points: [
        "KEDA (Kubernetes Event-driven Autoscaling): We use KEDA to scale pods instantly based on Azure Service Bus queue length, rather than waiting for CPU spikes.",
        "Spot Node Pools: For background video transcoding jobs, we use Azure Spot VMs inside AKS to reduce compute costs by up to 90%."
      ],
      shortcut: "AWS EKS == Azure AKS\nAWS EC2 Auto Scaling == VM Scale Sets\nAWS Fargate == Azure Container Instances"
    },
    interview: [
      {
        q: "What happens if the AKS Control Plane goes down?",
        a: "Your existing pods will continue to run, but you cannot deploy new pods, scale deployments, or query the API server until Azure restores the control plane."
      },
      {
        q: "What is the difference between Kubenet and Azure CNI?",
        a: "Kubenet uses NAT for pod communication and conserves VNet IP space. Azure CNI gives every pod a real VNet IP, allowing direct connectivity from on-prem, but can quickly exhaust your subnet CIDR block."
      }
    ]
  }
};
