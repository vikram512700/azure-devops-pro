"""
AI Interview Agent — LangGraph implementation
4-level adaptive interview: Theory → Scenario → Production → Architecture
Streams responses via WebSocket to frontend
"""

from typing import TypedDict, Annotated, Sequence, Literal
from langgraph.graph import StateGraph, END
from langgraph.graph.message import add_messages
from langchain_openai import AzureChatOpenAI
from langchain_core.messages import BaseMessage, HumanMessage, SystemMessage
import operator
import json
import os

# ─── Azure OpenAI Setup ───────────────────────────────────────────────────────
llm = AzureChatOpenAI(
    azure_endpoint=os.environ["AZURE_OPENAI_ENDPOINT"],
    api_key=os.environ["AZURE_OPENAI_KEY"],
    azure_deployment=os.environ.get("AZURE_OPENAI_DEPLOYMENT", "gpt-4o"),
    api_version="2024-02-01",
    temperature=0.7,
    streaming=True,
)

# ─── Interview State ──────────────────────────────────────────────────────────
class InterviewState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], add_messages]
    module: str           # e.g. "AKS", "Terraform", "SRE"
    current_level: int    # 1-4
    score: int            # running score 0-100
    questions_asked: int
    max_questions: int    # 3-5 per level
    user_name: str
    experience_years: int
    feedback_items: list[str]
    session_complete: bool

# ─── System Prompts per Level ─────────────────────────────────────────────────
LEVEL_PROMPTS = {
    1: """You are a senior Azure DevOps interviewer conducting a THEORY round.
Ask clear conceptual questions about {module}. 
- Start easy, progressively harder
- Ask ONE question at a time
- After user answers, give brief feedback (1-2 sentences) then ask next question
- If the user clearly knows the concept, acknowledge and move on quickly
- Score the answer: [SCORE: X/10] at the end of each feedback
- After {max_q} questions, say "Level 1 complete." and summarize their performance""",

    2: """You are a senior Azure DevOps interviewer conducting a SCENARIO-BASED round.
Present realistic workplace scenarios involving {module}.
- Frame each question as: "Your team is... / You receive an alert... / A developer asks you..."
- Scenarios should be realistic for a Hyderabad GCC context (SAP integration, Reliance-scale systems)
- Evaluate their systematic approach, not just the answer
- Score: [SCORE: X/10]
- After {max_q} scenarios, say "Level 2 complete." and summarize""",

    3: """You are a principal engineer conducting a PRODUCTION TROUBLESHOOTING round.
Present production incidents involving {module}.
- Start: "At 2 AM, you get a PagerDuty alert that..."
- The system is broken. User must troubleshoot step by step.
- Ask follow-up questions as they diagnose: "What did kubectl describe show?" "What does the KQL query return?"
- Reward systematic thinking, kubectl/az CLI knowledge, monitoring use
- Score: [SCORE: X/10]
- After {max_q} incidents, say "Level 3 complete." and summarize""",

    4: """You are an Azure architect conducting a DESIGN ROUND.
Present open-ended architecture challenges.
- Ask the user to design a production system from scratch
- Probe: "How does that scale to 10,000 users?" "What's your disaster recovery plan?" "How do you handle compliance?"
- For Hyderabad GCC context: multi-region Azure, SAP workloads, strict data residency (India)
- Evaluate: completeness, scalability, cost awareness, security, SRE principles
- Score: [SCORE: X/10]
- After {max_q} designs, say "Level 4 complete. Interview finished." and give overall feedback"""
}

# ─── Graph Nodes ──────────────────────────────────────────────────────────────
def start_interview(state: InterviewState) -> InterviewState:
    """Initialize interview with welcome message and first question."""
    prompt = LEVEL_PROMPTS[1].format(
        module=state["module"],
        max_q=state["max_questions"],
    )

    system_msg = SystemMessage(content=prompt)
    opening = HumanMessage(
        content=f"Start the Level 1 theory interview for {state['module']}. "
                f"The candidate is {state['user_name']} with {state['experience_years']} years experience. "
                f"Welcome them briefly and ask the first question."
    )

    response = llm.invoke([system_msg, opening])
    return {
        **state,
        "messages": [system_msg, opening, response],
    }


def conduct_interview(state: InterviewState) -> InterviewState:
    """Continue the interview based on user's latest response."""
    level = state["current_level"]
    prompt = LEVEL_PROMPTS[level].format(
        module=state["module"],
        max_q=state["max_questions"],
    )

    # Rebuild with current level's system prompt
    system_msg = SystemMessage(content=prompt)
    messages_for_llm = [system_msg] + list(state["messages"][1:])  # skip old system msg

    response = llm.invoke(messages_for_llm)

    # Extract score if present
    content = response.content if hasattr(response, "content") else str(response)
    score_delta = extract_score(content)

    return {
        **state,
        "messages": list(state["messages"]) + [response],
        "score": min(100, state["score"] + score_delta),
        "questions_asked": state["questions_asked"] + 1,
    }


def advance_level(state: InterviewState) -> InterviewState:
    """Move to the next interview level."""
    next_level = state["current_level"] + 1
    prompt = LEVEL_PROMPTS[next_level].format(
        module=state["module"],
        max_q=state["max_questions"],
    )

    transition_msg = HumanMessage(
        content=f"Transition to Level {next_level} now. "
                f"Briefly acknowledge the level change and ask your first {['', '', 'scenario', 'production incident', 'architecture design'][next_level]} question."
    )

    system_msg = SystemMessage(content=prompt)
    response = llm.invoke([system_msg, transition_msg])

    return {
        **state,
        "current_level": next_level,
        "questions_asked": 0,
        "messages": list(state["messages"]) + [transition_msg, response],
    }


def complete_interview(state: InterviewState) -> InterviewState:
    """Generate final feedback and score summary."""
    summary_prompt = f"""
    Generate a comprehensive interview summary for {state['user_name']}.
    Module: {state['module']}
    Final score: {state['score']}/100
    
    Provide:
    1. Overall performance assessment (2-3 sentences)
    2. Strongest areas (bullet points)
    3. Areas to improve (bullet points with specific resources)
    4. Recommended next steps for Hyderabad GCC job applications
    5. Suggested learning plan (1 item per week for next 4 weeks)
    
    Be constructive, specific, and encouraging.
    """

    final_response = llm.invoke([
        SystemMessage(content="You are a senior Azure DevOps career coach."),
        HumanMessage(content=summary_prompt),
    ])

    return {
        **state,
        "session_complete": True,
        "messages": list(state["messages"]) + [final_response],
    }

# ─── Routing Logic ────────────────────────────────────────────────────────────
def should_advance_level(state: InterviewState) -> Literal["advance", "continue", "complete"]:
    if state["questions_asked"] >= state["max_questions"]:
        if state["current_level"] >= 4:
            return "complete"
        return "advance"
    return "continue"


def extract_score(text: str) -> int:
    """Extract [SCORE: X/10] from LLM response."""
    import re
    match = re.search(r'\[SCORE:\s*(\d+)/10\]', text)
    if match:
        return int(match.group(1))
    return 5  # default neutral score


# ─── Build the Graph ──────────────────────────────────────────────────────────
def build_interview_graph() -> StateGraph:
    graph = StateGraph(InterviewState)

    graph.add_node("start", start_interview)
    graph.add_node("conduct", conduct_interview)
    graph.add_node("advance_level", advance_level)
    graph.add_node("complete", complete_interview)

    graph.set_entry_point("start")
    graph.add_edge("start", "conduct")

    graph.add_conditional_edges(
        "conduct",
        should_advance_level,
        {
            "continue": "conduct",
            "advance": "advance_level",
            "complete": "complete",
        },
    )

    graph.add_edge("advance_level", "conduct")
    graph.add_edge("complete", END)

    return graph.compile()


# ─── Entry Point for Testing ───────────────────────────────────────────────────
if __name__ == "__main__":
    app = build_interview_graph()

    initial_state: InterviewState = {
        "messages": [],
        "module": "AKS",
        "current_level": 1,
        "score": 0,
        "questions_asked": 0,
        "max_questions": 3,
        "user_name": "Vikram",
        "experience_years": 7,
        "feedback_items": [],
        "session_complete": False,
    }

    print("=== Starting AKS Interview for Vikram ===\n")
    for chunk in app.stream(initial_state):
        for node, state in chunk.items():
            if state.get("messages"):
                last_msg = state["messages"][-1]
                content = last_msg.content if hasattr(last_msg, "content") else str(last_msg)
                print(f"\n[{node.upper()}]\n{content}\n{'─' * 60}")

    print(f"\nFinal Score: {state.get('score', 0)}/100")
