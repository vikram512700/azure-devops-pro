"""
JD Analyzer Agent — LangGraph implementation
Input: raw JD text or PDF
Output: skill gap analysis + personalized learning plan
Uses Vikram's skill baseline as default user profile
"""

from typing import TypedDict
from langgraph.graph import StateGraph, END
from langchain_openai import AzureChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage
import json
import os

llm = AzureChatOpenAI(
    azure_endpoint=os.environ["AZURE_OPENAI_ENDPOINT"],
    api_key=os.environ["AZURE_OPENAI_KEY"],
    azure_deployment=os.environ.get("AZURE_OPENAI_DEPLOYMENT", "gpt-4o"),
    api_version="2024-02-01",
    temperature=0,
    response_format={"type": "json_object"},
)

# Vikram's default skill baseline (loaded from DB in production)
VIKRAM_BASELINE = {
    "strong": [
        "AWS EC2", "VPC", "IAM", "S3", "RDS", "CloudWatch",
        "Azure VMs", "VMSS", "Azure CLI", "Terraform", "Bicep",
        "Docker", "ACR", "Azure Pipelines", "Key Vault", "RBAC",
        "Git", "Azure DevOps", "Load Balancer",
    ],
    "building": ["AKS", "Helm", "KQL", "Azure Monitor", "Grafana", "GitOps"],
    "gap": ["ArgoCD", "SRE design", "Chaos Engineering", "PIM", "Azure OpenAI", "LangGraph"],
}


class JDAnalysisState(TypedDict):
    raw_jd: str
    user_skills: dict   # {strong: [], building: [], gap: []}
    extracted_jd_skills: dict
    gap_analysis: dict
    learning_plan: list
    match_score: int
    summary: str


JD_EXTRACTION_PROMPT = """Extract all technical skills, tools, certifications, and experience requirements from this job description.

Return ONLY valid JSON in this exact schema:
{
  "title": "job title",
  "company_type": "GCC|Product|Service|Startup",
  "experience_years": {"min": 0, "max": 0},
  "seniority": "junior|mid|senior|lead|architect",
  "required_skills": [
    {"name": "skill", "category": "cloud|containers|iac|cicd|security|observability|sre|networking|languages|platform_engineering", "importance": "critical|important"}
  ],
  "preferred_skills": [
    {"name": "skill", "category": "...", "importance": "nice-to-have"}
  ],
  "certifications": ["AZ-104", "CKA"],
  "tools": ["Terraform", "ArgoCD"],
  "salary_range": {"min": 0, "max": 0, "currency": "INR"},
  "location": "Hyderabad|Remote|Hybrid",
  "gcc_specific": true,
  "key_responsibilities": ["responsibility 1", "responsibility 2"]
}"""


GAP_ANALYSIS_PROMPT = """You are a senior Azure DevOps career coach for Hyderabad GCC hiring.

Given:
1. JD requirements (extracted JSON)
2. User's current skills (strong/building/gap)

Perform gap analysis and return ONLY valid JSON:
{
  "match_score": 75,
  "matched_skills": ["skill1", "skill2"],
  "partial_match": ["AKS (building but not production-ready)"],
  "missing_critical": [
    {"skill": "ArgoCD", "why_important": "GitOps is mandatory in 80% of AKS JDs", "weeks_to_learn": 2}
  ],
  "missing_important": [
    {"skill": "KQL advanced", "why_important": "...", "weeks_to_learn": 1}
  ],
  "missing_nice_to_have": ["skill1"],
  "strengths_to_highlight": [
    "7 years AWS + Azure hybrid experience is rare and valuable",
    "Terraform + Bicep IaC expertise"
  ],
  "interview_talking_points": [
    "Use O2C Reliance project for AKS production context even if KodeKloud-based",
    "Quantify: managed X VMs, reduced deployment time by Y%"
  ]
}"""


LEARNING_PLAN_PROMPT = """Generate a personalized learning plan for this candidate to close their skill gaps.

Context:
- Target role: {title}
- Current match score: {score}%
- Missing critical skills: {critical}
- Missing important skills: {important}

Return ONLY valid JSON:
{
  "total_weeks": 6,
  "target_score": 90,
  "weeks": [
    {
      "week": 1,
      "focus": "ArgoCD + GitOps",
      "daily_hours": 1.5,
      "resources": [
        {"type": "lab", "name": "KodeKloud GitOps lab", "url": "https://..."},
        {"type": "doc", "name": "ArgoCD Getting Started", "url": "https://argo-cd.readthedocs.io"},
        {"type": "module", "name": "Track 06 - DevOps/GitOps", "url": "/roadmap/track-06"}
      ],
      "hands_on": "Deploy ArgoCD to KodeKloud AKS, sync sample app from Azure Repos",
      "milestone": "Can explain GitOps principles + demo ArgoCD App of Apps in interview"
    }
  ],
  "certifications_path": [
    {"cert": "AZ-104", "estimated_weeks": 4, "priority": 1},
    {"cert": "CKA", "estimated_weeks": 6, "priority": 2}
  ]
}"""


def extract_jd_skills(state: JDAnalysisState) -> JDAnalysisState:
    """Parse raw JD text and extract structured skills."""
    response = llm.invoke([
        SystemMessage(content=JD_EXTRACTION_PROMPT),
        HumanMessage(content=state["raw_jd"][:4000]),
    ])
    extracted = json.loads(response.content)
    return {**state, "extracted_jd_skills": extracted}


def analyze_gap(state: JDAnalysisState) -> JDAnalysisState:
    """Compare user skills against JD requirements."""
    context = json.dumps({
        "jd_requirements": state["extracted_jd_skills"],
        "user_skills": state["user_skills"],
    }, indent=2)

    response = llm.invoke([
        SystemMessage(content=GAP_ANALYSIS_PROMPT),
        HumanMessage(content=context),
    ])
    gap = json.loads(response.content)
    return {
        **state,
        "gap_analysis": gap,
        "match_score": gap.get("match_score", 0),
    }


def generate_learning_plan(state: JDAnalysisState) -> JDAnalysisState:
    """Create week-by-week learning plan to close gaps."""
    jd = state["extracted_jd_skills"]
    gap = state["gap_analysis"]

    prompt = LEARNING_PLAN_PROMPT.format(
        title=jd.get("title", "Azure DevOps Engineer"),
        score=state["match_score"],
        critical=json.dumps([s["skill"] for s in gap.get("missing_critical", [])]),
        important=json.dumps([s["skill"] for s in gap.get("missing_important", [])]),
    )

    response = llm.invoke([
        SystemMessage(content=prompt),
        HumanMessage(content="Generate the learning plan now."),
    ])
    plan_data = json.loads(response.content)
    return {**state, "learning_plan": plan_data.get("weeks", [])}


def summarize(state: JDAnalysisState) -> JDAnalysisState:
    """Generate human-readable summary."""
    gap = state["gap_analysis"]
    summary = (
        f"Match score: {state['match_score']}%. "
        f"You have {len(gap.get('matched_skills', []))} matching skills. "
        f"Critical gaps: {', '.join(s['skill'] for s in gap.get('missing_critical', [])[:3])}. "
        f"Estimated time to reach 90% match: {state['learning_plan'][-1]['week'] if state['learning_plan'] else 0} weeks."
    )
    return {**state, "summary": summary}


def build_jd_analyzer_graph() -> StateGraph:
    graph = StateGraph(JDAnalysisState)

    graph.add_node("extract", extract_jd_skills)
    graph.add_node("analyze_gap", analyze_gap)
    graph.add_node("learning_plan", generate_learning_plan)
    graph.add_node("summarize", summarize)

    graph.set_entry_point("extract")
    graph.add_edge("extract", "analyze_gap")
    graph.add_edge("analyze_gap", "learning_plan")
    graph.add_edge("learning_plan", "summarize")
    graph.add_edge("summarize", END)

    return graph.compile()


# ─── Entry Point for Testing ───────────────────────────────────────────────────
if __name__ == "__main__":
    sample_jd = """
    Senior Azure DevOps Engineer — EY GDS Hyderabad
    Experience: 6-10 years
    
    Required: AKS production management, Terraform, Azure Pipelines, ArgoCD/Flux,
    Key Vault, RBAC, Entra ID, Azure Monitor + KQL, Prometheus/Grafana,
    Docker, Helm, GitOps, SRE practices (SLO/SLA), Chaos Engineering.
    
    Preferred: Platform Engineering (Backstage), KEDA, Crossplane, eBPF/Cilium,
    Azure OpenAI integration, AZ-400 certified.
    
    Responsibilities: Design and manage production AKS clusters, implement GitOps
    pipelines, define SLOs and runbooks, lead incident management for SAP integration.
    
    Salary: 35-55 LPA. Location: Hyderabad (Hybrid).
    """

    app = build_jd_analyzer_graph()

    result = app.invoke({
        "raw_jd": sample_jd,
        "user_skills": VIKRAM_BASELINE,
        "extracted_jd_skills": {},
        "gap_analysis": {},
        "learning_plan": [],
        "match_score": 0,
        "summary": "",
    })

    print("=== JD Analysis Result ===")
    print(f"Match Score: {result['match_score']}%")
    print(f"\nSummary: {result['summary']}")
    print(f"\nLearning Plan ({len(result['learning_plan'])} weeks):")
    for week in result["learning_plan"]:
        print(f"  Week {week['week']}: {week['focus']} — {week['milestone']}")
