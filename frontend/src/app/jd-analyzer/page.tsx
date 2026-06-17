"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Briefcase, FileText, Target, Crosshair, CheckCircle2, XCircle, Sparkles } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import { getGeminiClient, JD_ANALYZER_PROMPT } from "@/lib/gemini";

interface JDAnalysisResult {
  match_score: number;
  summary: string;
  matched_skills: string[];
  missing_skills: string[];
  learning_plan: { week: number; focus: string; milestone: string }[];
}

const LOADING_STEPS = [
  "Initializing AI Engine...",
  "Extracting requirements from JD...",
  "Mapping skills to Azure DevOps framework...",
  "Calculating compatibility score...",
  "Generating personalized learning roadmap...",
];

export default function JDAnalyzerPage() {
  const [jdText, setJdText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [results, setResults] = useState<JDAnalysisResult | null>(null);
  const { apiKey } = useSettings();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAnalyzing) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev));
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  const handleAnalyze = async () => {
    if (!jdText) return;
    setIsAnalyzing(true);
    setResults(null);
    
    try {
      if (!apiKey) {
        throw new Error("Please enter your Gemini API Key in the Dashboard Settings first.");
      }
      
      const client = getGeminiClient(apiKey);
      const model = client.getGenerativeModel({ model: "gemini-3.5-flash" });

      const fullPrompt = `${JD_ANALYZER_PROMPT}\n\nJob Description to Analyze:\n${jdText}`;
      const result = await model.generateContent(fullPrompt);
      const responseText = result.response.text();
      
      let jsonStr = responseText;
      if (jsonStr.includes('```json')) {
         jsonStr = jsonStr.split('```json')[1].split('```')[0].trim();
      } else if (jsonStr.includes('```')) {
         jsonStr = jsonStr.split('```')[1].split('```')[0].trim();
      }

      const parsedResults = JSON.parse(jsonStr);
      setResults(parsedResults);
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      alert("AI Analysis Error: " + message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400 stroke-emerald-500";
    if (score >= 50) return "text-yellow-400 stroke-yellow-500";
    return "text-red-400 stroke-red-500";
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-6 md:p-12 pt-24 max-w-7xl mx-auto space-y-12">
      
      <div className="text-center space-y-6 mb-12 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/20 blur-[120px] rounded-full pointer-events-none" />
        <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/20 px-4 py-1.5 text-sm uppercase tracking-wider font-semibold">
          <Sparkles className="w-4 h-4 mr-2 inline" /> AI Mentor Engine
        </Badge>
        <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-gray-400 tracking-tight">
          JD Skill Gap Analyzer
        </h1>
        <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
          Paste any Job Description below. Our LangGraph AI will instantly map your current skills against the requirements and generate a personalized learning plan.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-12 relative z-10">
        
        {/* Left: Input */}
        <Card className="bg-[#0f1115] border-white/5 shadow-2xl relative overflow-hidden flex flex-col h-[700px]">
          {isAnalyzing && (
            <div className="absolute inset-0 pointer-events-none z-20">
              <div className="w-full h-1 bg-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.8)] animate-[scan_2s_ease-in-out_infinite]" />
            </div>
          )}
          <CardHeader className="pb-4 shrink-0">
            <CardTitle className="text-xl text-white flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <FileText className="w-5 h-5 text-blue-400" />
              </div>
              Job Description
            </CardTitle>
            <CardDescription className="text-base mt-1">Paste the raw text of the Azure/DevOps JD</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 flex-grow flex flex-col min-h-0">
            <div className="relative flex-grow min-h-0">
              <textarea
                className={`w-full h-full absolute inset-0 bg-black/40 border border-white/10 rounded-xl p-5 text-sm text-gray-300 font-mono resize-none focus:outline-none focus:border-purple-500/50 transition-all ${isAnalyzing ? 'opacity-50 blur-[1px]' : ''}`}
                placeholder="e.g., Required: AKS production management, Terraform, Azure Pipelines, ArgoCD..."
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                disabled={isAnalyzing}
              />
            </div>
            
            <Button 
              onClick={handleAnalyze} 
              disabled={isAnalyzing || !jdText}
              className="w-full h-16 shrink-0 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-lg rounded-xl shadow-[0_0_20px_rgba(147,51,234,0.3)] transition-all hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 relative overflow-hidden"
            >
              {isAnalyzing ? (
                <div className="flex flex-col items-center justify-center relative w-full h-full">
                  <div className="flex items-center absolute top-2">
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" /> 
                    <span>Analyzing...</span>
                  </div>
                  <span className="text-sm text-purple-200 font-normal absolute bottom-2">{LOADING_STEPS[loadingStep]}</span>
                </div>
              ) : (
                <span className="flex items-center">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Analyze JD & Generate Plan
                </span>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Right: Results */}
        <Card className={`bg-[#0f1115] border-white/5 shadow-2xl transition-all duration-700 flex flex-col h-[700px] overflow-hidden ${results ? 'opacity-100 translate-y-0' : 'opacity-40 grayscale pointer-events-none translate-y-4'}`}>
          <CardHeader className="pb-4 shrink-0 bg-[#0f1115] z-10 border-b border-white/5">
            <CardTitle className="text-xl text-white flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <Target className="w-5 h-5 text-emerald-400" />
              </div>
              Analysis Results
            </CardTitle>
            <CardDescription className="text-base mt-1">Your personalized roadmap to land this job</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {results ? (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                
                {/* Score Header */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6 rounded-2xl bg-white/[0.02] border border-white/5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[50px]" />
                  
                  {/* Circular Progress */}
                  <div className="relative w-24 h-24 flex-shrink-0">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" className="stroke-white/10" strokeWidth="8" fill="none" />
                      <circle 
                        cx="50" cy="50" r="40" 
                        className={`${getScoreColor(results.match_score).split(' ')[1]} transition-all duration-1500 ease-out`} 
                        strokeWidth="8" fill="none" 
                        strokeLinecap="round"
                        strokeDasharray="251.2"
                        strokeDashoffset={251.2 - (251.2 * results.match_score) / 100}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className={`text-2xl font-bold ${getScoreColor(results.match_score).split(' ')[0]}`}>
                        {results.match_score}%
                      </span>
                    </div>
                  </div>

                  <div className="relative z-10 text-center sm:text-left mt-2 sm:mt-0">
                    <h3 className="text-xl font-bold text-white mb-2">Match Score</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">{results.summary}</p>
                  </div>
                </div>

                {/* Skills Breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 h-full">
                    <h4 className="text-emerald-400 font-semibold flex items-center gap-2 mb-4">
                      <CheckCircle2 className="w-4 h-4" /> Matched Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {results.matched_skills?.length > 0 ? results.matched_skills.map((skill, i) => (
                        <Badge key={i} variant="outline" className="bg-emerald-500/10 text-emerald-300 border-emerald-500/20">{skill}</Badge>
                      )) : <span className="text-sm text-gray-500">None detected</span>}
                    </div>
                  </div>
                  
                  <div className="p-5 rounded-2xl bg-rose-500/5 border border-rose-500/10 h-full">
                    <h4 className="text-rose-400 font-semibold flex items-center gap-2 mb-4">
                      <XCircle className="w-4 h-4" /> Missing Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {results.missing_skills?.length > 0 ? results.missing_skills.map((skill, i) => (
                        <Badge key={i} variant="outline" className="bg-rose-500/10 text-rose-300 border-rose-500/20">{skill}</Badge>
                      )) : <span className="text-sm text-gray-500">None detected</span>}
                    </div>
                  </div>
                </div>

                {/* Learning Plan */}
                <div className="pb-4">
                  <h4 className="text-white font-semibold flex items-center gap-2 mb-8">
                    <Crosshair className="w-5 h-5 text-blue-400" />
                    Targeted Action Plan
                  </h4>
                  <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-blue-500 before:via-purple-500 before:to-transparent">
                    {results.learning_plan.map((plan, i) => (
                      <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        {/* Timeline dot */}
                        <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#0f1115] bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] text-white font-bold text-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                          W{plan.week}
                        </div>
                        {/* Card */}
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-blue-500/30 transition-colors ml-4 md:ml-0 shadow-lg">
                          <h5 className="font-bold text-blue-300 mb-2">{plan.focus}</h5>
                          <p className="text-sm text-gray-400 leading-relaxed">{plan.milestone}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground pb-20">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />
                  <Target className="w-20 h-20 mb-6 opacity-30 relative z-10" />
                </div>
                <p className="text-lg">Awaiting JD analysis...</p>
                <p className="text-sm opacity-50 mt-2">Paste a job description to see the magic</p>
              </div>
            )}
          </CardContent>
        </Card>

      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0% { transform: translateY(-50px); }
          50% { transform: translateY(650px); }
          100% { transform: translateY(-50px); }
        }
      `}} />
    </div>
  );
}
