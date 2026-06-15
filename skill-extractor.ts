/**
 * Shared Skill Extractor
 * Uses Azure OpenAI GPT-4o to extract structured skills from raw JD text
 * Returns normalized skill list with categories
 */

import { AzureOpenAI } from 'openai';

const client = new AzureOpenAI({
  endpoint: process.env.AZURE_OPENAI_ENDPOINT!,
  apiKey: process.env.AZURE_OPENAI_KEY!,
  apiVersion: '2024-02-01',
});

const AZURE_DEVOPS_SKILL_TAXONOMY = {
  cloud_platforms: ['Azure', 'AWS', 'GCP'],
  compute: ['AKS', 'VMs', 'VMSS', 'Container Instances', 'App Service', 'Azure Functions'],
  networking: ['VNET', 'NSG', 'Load Balancer', 'Application Gateway', 'Front Door', 'Private Endpoint', 'ExpressRoute', 'VPN Gateway'],
  iac: ['Terraform', 'Bicep', 'ARM Templates', 'Ansible', 'Pulumi', 'OpenTofu'],
  containers: ['Docker', 'Kubernetes', 'Helm', 'ArgoCD', 'Flux', 'Dapr', 'KEDA'],
  cicd: ['Azure Pipelines', 'GitHub Actions', 'Jenkins', 'GitLab CI', 'CircleCI', 'Dagger'],
  security: ['Key Vault', 'Entra ID', 'RBAC', 'PIM', 'Defender for Cloud', 'tfsec', 'Checkov', 'OPA', 'Gatekeeper', 'Cosign'],
  observability: ['Azure Monitor', 'Log Analytics', 'KQL', 'Grafana', 'Prometheus', 'App Insights', 'Datadog', 'New Relic'],
  databases: ['PostgreSQL', 'SQL Server', 'Cosmos DB', 'Redis', 'MongoDB'],
  languages: ['Python', 'PowerShell', 'Bash', 'Go', 'TypeScript', 'Java'],
  sre: ['SLI', 'SLO', 'SLA', 'Incident Management', 'Chaos Engineering', 'Runbooks', 'PagerDuty'],
  platform_engineering: ['Backstage', 'Port', 'IDP', 'Platform Engineering', 'Golden Paths'],
  ai_mlops: ['Azure OpenAI', 'LangChain', 'LangGraph', 'MLflow', 'KubeFlow', 'vLLM'],
  certifications: ['AZ-104', 'AZ-400', 'AZ-305', 'CKA', 'CKS', 'AWS SAA', 'Terraform Associate'],
};

export interface ExtractedSkills {
  required: SkillItem[];
  preferred: SkillItem[];
  certifications: string[];
  experience_years: { min: number; max: number };
  seniority: 'junior' | 'mid' | 'senior' | 'lead' | 'architect';
  raw_categories: Record<string, string[]>;
}

export interface SkillItem {
  name: string;
  category: string;
  importance: 'critical' | 'important' | 'nice-to-have';
}

const EXTRACTION_PROMPT = `You are a technical recruiter analyzing Azure DevOps / Cloud Engineering job descriptions.

Extract structured data from the JD text below. Return ONLY valid JSON matching this schema:

{
  "required": [{"name": "skill name", "category": "category from taxonomy", "importance": "critical|important|nice-to-have"}],
  "preferred": [{"name": "skill name", "category": "category", "importance": "nice-to-have"}],
  "certifications": ["AZ-104", "CKA", ...],
  "experience_years": {"min": 5, "max": 10},
  "seniority": "junior|mid|senior|lead|architect",
  "raw_categories": {
    "cloud_platforms": [],
    "compute": [],
    "networking": [],
    "iac": [],
    "containers": [],
    "cicd": [],
    "security": [],
    "observability": [],
    "databases": [],
    "languages": [],
    "sre": [],
    "platform_engineering": [],
    "ai_mlops": []
  }
}

Taxonomy to use for categories: ${JSON.stringify(AZURE_DEVOPS_SKILL_TAXONOMY)}

Rules:
- Only extract skills that actually appear in the JD
- Mark as "critical" if the JD uses words like "must", "required", "mandatory", "essential"
- Mark as "important" for standard job requirements without qualifier words
- Mark as "nice-to-have" for "preferred", "good to have", "bonus" skills
- For experience_years: look for patterns like "5-8 years", "minimum 5 years", "6+ years"
- For seniority: infer from title and experience range

Return ONLY the JSON object. No explanation, no markdown, no backticks.`;

export async function extractSkills(jobDescription: string): Promise<ExtractedSkills> {
  try {
    const response = await client.chat.completions.create({
      model: process.env.AZURE_OPENAI_DEPLOYMENT ?? 'gpt-4o',
      messages: [
        { role: 'system', content: EXTRACTION_PROMPT },
        { role: 'user', content: jobDescription.slice(0, 4000) }, // stay within token budget
      ],
      temperature: 0,
      max_tokens: 2000,
      response_format: { type: 'json_object' },
    });

    const raw = response.choices[0]?.message?.content ?? '{}';
    return JSON.parse(raw) as ExtractedSkills;
  } catch (err) {
    console.error('[SkillExtractor] Extraction failed:', err);
    // Return empty structure on failure — don't block the crawler
    return {
      required: [],
      preferred: [],
      certifications: [],
      experience_years: { min: 0, max: 0 },
      seniority: 'mid',
      raw_categories: {},
    };
  }
}

/**
 * Gap analysis: compare user skills vs JD requirements
 * Returns match score (0-100) and list of missing skills
 */
export function analyzeGap(
  userSkills: string[],
  jdSkills: ExtractedSkills,
): {
  matchScore: number;
  missingCritical: SkillItem[];
  missingImportant: SkillItem[];
  missingNiceToHave: SkillItem[];
  learningPlan: LearningWeek[];
} {
  const userSkillsLower = userSkills.map((s) => s.toLowerCase());
  const allRequired = jdSkills.required;

  const missingCritical = allRequired.filter(
    (s) => s.importance === 'critical' && !userSkillsLower.includes(s.name.toLowerCase()),
  );
  const missingImportant = allRequired.filter(
    (s) => s.importance === 'important' && !userSkillsLower.includes(s.name.toLowerCase()),
  );
  const missingNiceToHave = jdSkills.preferred.filter(
    (s) => !userSkillsLower.includes(s.name.toLowerCase()),
  );

  // Score: start at 100, deduct for gaps
  let score = 100;
  score -= missingCritical.length * 15; // -15 per critical gap
  score -= missingImportant.length * 7; // -7 per important gap
  score -= missingNiceToHave.length * 2; // -2 per nice-to-have gap
  score = Math.max(0, Math.min(100, score));

  // Build a learning plan: 1 skill per week, critical first
  const gapSkills = [
    ...missingCritical,
    ...missingImportant,
    ...missingNiceToHave.slice(0, 3),
  ].slice(0, 8); // max 8 weeks

  const learningPlan: LearningWeek[] = gapSkills.map((skill, i) => ({
    week: i + 1,
    skill: skill.name,
    category: skill.category,
    importance: skill.importance,
    resources: getResources(skill.name),
  }));

  return { matchScore: score, missingCritical, missingImportant, missingNiceToHave, learningPlan };
}

interface LearningWeek {
  week: number;
  skill: string;
  category: string;
  importance: string;
  resources: string[];
}

function getResources(skillName: string): string[] {
  const resourceMap: Record<string, string[]> = {
    AKS: ['KodeKloud AKS lab', 'Microsoft Learn: AKS', 'azure-devops-roadmap-pro Track 05'],
    ArgoCD: ['KodeKloud GitOps lab', 'ArgoCD Getting Started docs', 'CNCF GitOps Fundamentals'],
    'Chaos Engineering': ['Azure Chaos Studio tutorial', 'Principles of Chaos Engineering', 'Netflix chaos engineering blog'],
    KEDA: ['KEDA.sh quickstart', 'Azure Service Bus + KEDA lab'],
    'OPA/Rego': ['Styra Academy free OPA course', 'Gatekeeper on AKS guide'],
    KQL: ['Microsoft Learn: KQL', 'azure-devops-roadmap-pro Track 08'],
    SRE: ['Google SRE book (free online)', 'azure-devops-roadmap-pro Track 10'],
  };

  return resourceMap[skillName] ?? [`Search: "${skillName} Azure tutorial"`, `Microsoft Learn: ${skillName}`];
}
