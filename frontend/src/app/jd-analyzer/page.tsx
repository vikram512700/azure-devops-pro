"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Briefcase, FileText, Target, Crosshair } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import { getGeminiClient, JD_ANALYZER_PROMPT } from "@/lib/gemini";

interface JDAnalysisResult {
  match_score: number;
  summary: string;
  learning_plan: { week: number; focus: string; milestone: string }[];
}

export default function JDAnalyzerPage() {
  const [jdText, setJdText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<JDAnalysisResult | null>(null);
  const { apiKey } = useSettings();

  const handleAnalyze = async () => {
    if (!jdText) return;
    setIsAnalyzing(true);
    
    try {
      if (!apiKey) {
        throw new Error("Please enter your Gemini API Key in the Dashboard Settings first.");
      }
      
      const client = getGeminiClient(apiKey);
      const model = client.getGenerativeModel({ model: "gemini-pro" });

      const fullPrompt = `${JD_ANALYZER_PROMPT}\n\nJob Description to Analyze:\n${jdText}`;
      const result = await model.generateContent(fullPrompt);
      const responseText = result.response.text();
      
      // Extract JSON in case of markdown formatting
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

  return (
    <div className="min-h-screen bg-background p-6 md:p-12 pt-24 max-w-6xl mx-auto space-y-8">
      
      <div className="text-center space-y-4 mb-12">
        <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/20 px-3 py-1 text-sm">
          <Briefcase className="w-4 h-4 mr-2 inline" /> AI Mentor Engine
        </Badge>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">JD Skill Gap Analyzer</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Paste any Job Description below. Our LangGraph AI will instantly map your current skills against the requirements and generate a personalized learning plan.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left: Input */}
        <Card className="bg-white/[0.02] border-white/5 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-400" />
              Job Description
            </CardTitle>
            <CardDescription>Paste the raw text of the Azure/DevOps JD</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <textarea
              className="w-full h-80 bg-black/40 border border-white/10 rounded-lg p-4 text-sm text-gray-300 font-mono resize-none focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="e.g., Required: AKS production management, Terraform, Azure Pipelines, ArgoCD..."
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
            />
            <Button 
              onClick={handleAnalyze} 
              disabled={isAnalyzing || !jdText}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-6 text-lg shadow-lg shadow-purple-900/20"
            >
              {isAnalyzing ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : "Analyze JD & Generate Plan"}
            </Button>
          </CardContent>
        </Card>

        {/* Right: Results */}
        <Card className={`bg-white/[0.02] border-white/5 shadow-xl transition-all duration-500 ${results ? 'opacity-100' : 'opacity-50 grayscale'}`}>
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald-400" />
              Analysis Results
            </CardTitle>
            <CardDescription>Your personalized roadmap to land this job</CardDescription>
          </CardHeader>
          <CardContent>
            {results ? (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                <div className="flex items-center gap-6 p-6 rounded-xl bg-gradient-to-r from-emerald-500/10 to-transparent border border-emerald-500/20">
                  <div className="flex-shrink-0 w-20 h-20 rounded-full flex items-center justify-center border-4 border-emerald-500/30">
                    <span className="text-2xl font-bold text-emerald-400">{results.match_score}%</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-emerald-300 mb-1">Match Score</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">{results.summary}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-white font-semibold flex items-center gap-2 mb-4">
                    <Crosshair className="w-4 h-4 text-blue-400" />
                    Targeted Learning Plan
                  </h4>
                  <div className="space-y-4">
                    {results.learning_plan.map((plan, i: number) => (
                      <div key={i} className="p-4 rounded-lg bg-black/40 border border-white/5 border-l-2 border-l-blue-500 relative pl-6">
                        <div className="absolute -left-2.5 top-5 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-[10px] font-bold text-white shadow-[0_0_10px_rgba(59,130,246,0.5)]">
                          W{plan.week}
                        </div>
                        <h5 className="font-medium text-blue-300 mb-1">{plan.focus}</h5>
                        <p className="text-sm text-gray-400">{plan.milestone}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium">
                  Enroll in Missing Modules
                </Button>

              </div>
            ) : (
              <div className="h-80 flex flex-col items-center justify-center text-muted-foreground">
                <Target className="w-16 h-16 mb-4 opacity-20" />
                <p>Awaiting JD analysis...</p>
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
