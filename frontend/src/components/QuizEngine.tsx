"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Trophy, CheckCircle2, XCircle } from "lucide-react";
import { useProgress } from "@/hooks/useProgress";
import confetti from "canvas-confetti";

type Question = {
  id: string;
  text: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
  explanation: string;
};

const SAMPLE_QUESTIONS: Question[] = [
  {
    id: "q1",
    text: "Which Azure service is used to isolate resources in a secure network boundary?",
    options: [
      { id: "a", text: "Azure ExpressRoute" },
      { id: "b", text: "Azure Virtual Network (VNet)" },
      { id: "c", text: "Azure Load Balancer" },
      { id: "d", text: "Azure Active Directory" },
    ],
    correctOptionId: "b",
    explanation: "Azure Virtual Network (VNet) is the fundamental building block for your private network in Azure.",
  },
  {
    id: "q2",
    text: "You need to prevent traffic from a specific IP address from accessing your VNet. What should you configure?",
    options: [
      { id: "a", text: "Network Security Group (NSG)" },
      { id: "b", text: "Azure Firewall" },
      { id: "c", text: "Azure Bastion" },
      { id: "d", text: "Route Table" },
    ],
    correctOptionId: "a",
    explanation: "NSGs allow you to filter network traffic to and from Azure resources in an Azure virtual network based on IP addresses, ports, and protocols.",
  }
];

export function QuizEngine({ moduleId }: { moduleId: string }) {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const { addXP, markModuleCompleted } = useProgress();

  const currentQuestion = SAMPLE_QUESTIONS[currentQuestionIdx];
  const progress = ((currentQuestionIdx) / SAMPLE_QUESTIONS.length) * 100;

  const handleSubmit = () => {
    if (!isAnswerSubmitted) {
      setIsAnswerSubmitted(true);
      if (selectedAnswer === currentQuestion.correctOptionId) {
        setScore(score + 100);
      }
    } else {
      // Go to next question
      if (currentQuestionIdx < SAMPLE_QUESTIONS.length - 1) {
        setCurrentQuestionIdx(currentQuestionIdx + 1);
        setSelectedAnswer("");
        setIsAnswerSubmitted(false);
      } else {
        setIsFinished(true);
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6']
        });
        // Save progress using hook
        addXP(score + (selectedAnswer === currentQuestion.correctOptionId ? 100 : 0));
        markModuleCompleted(moduleId);
      }
    }
  };

  if (isFinished) {
    return (
      <Card className="bg-white/[0.02] border-white/5 max-w-2xl mx-auto text-center py-8">
        <CardHeader>
          <div className="mx-auto p-4 rounded-full bg-yellow-500/10 mb-4 inline-block">
            <Trophy className="w-12 h-12 text-yellow-500" />
          </div>
          <CardTitle className="text-3xl text-white">Quiz Completed!</CardTitle>
          <CardDescription className="text-lg">You earned {score} XP.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">Keep up the great work! Your progress has been saved to your profile.</p>
          <Button onClick={() => window.location.reload()} className="bg-blue-600 hover:bg-blue-700">
            Return to Dashboard
          </Button>
        </CardContent>
      </Card>
    );
  }

  const isCorrect = selectedAnswer === currentQuestion.correctOptionId;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center text-sm text-muted-foreground mb-2">
        <span>Question {currentQuestionIdx + 1} of {SAMPLE_QUESTIONS.length}</span>
        <span className="flex items-center gap-1 text-yellow-500 font-medium"><Trophy className="w-4 h-4"/> {score} XP</span>
      </div>
      <Progress value={progress} className="h-2 bg-white/5" indicatorClassName="bg-blue-500" />

      <Card className="bg-white/[0.02] border-white/5 mt-8">
        <CardHeader>
          <CardTitle className="text-xl text-white font-medium leading-relaxed">
            {currentQuestion.text}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer} disabled={isAnswerSubmitted}>
            {currentQuestion.options.map((opt) => {
              const isSelected = selectedAnswer === opt.id;
              let optionClass = "flex items-center space-x-3 space-y-0 rounded-lg border border-white/10 p-4 transition-colors hover:bg-white/[0.04]";
              
              if (isAnswerSubmitted) {
                if (opt.id === currentQuestion.correctOptionId) {
                  optionClass += " bg-emerald-500/10 border-emerald-500/50";
                } else if (isSelected) {
                  optionClass += " bg-red-500/10 border-red-500/50";
                } else {
                  optionClass += " opacity-50";
                }
              } else if (isSelected) {
                optionClass += " bg-blue-500/10 border-blue-500/50";
              }

              return (
                <div key={opt.id} className={optionClass}>
                  <RadioGroupItem value={opt.id} id={opt.id} className="border-white/50 text-blue-500" />
                  <Label htmlFor={opt.id} className="flex-1 cursor-pointer font-medium text-gray-200">
                    {opt.text}
                  </Label>
                  {isAnswerSubmitted && opt.id === currentQuestion.correctOptionId && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                  {isAnswerSubmitted && isSelected && opt.id !== currentQuestion.correctOptionId && <XCircle className="w-5 h-5 text-red-500" />}
                </div>
              );
            })}
          </RadioGroup>

          {isAnswerSubmitted && (
            <div className={`p-4 rounded-lg border ${isCorrect ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-200' : 'bg-red-500/10 border-red-500/20 text-red-200'}`}>
              <p className="font-medium mb-1">{isCorrect ? 'Correct!' : 'Incorrect.'}</p>
              <p className="text-sm opacity-90">{currentQuestion.explanation}</p>
            </div>
          )}

          <Button 
            onClick={handleSubmit} 
            disabled={!selectedAnswer}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
          >
            {isAnswerSubmitted ? "Next Question" : "Submit Answer"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
