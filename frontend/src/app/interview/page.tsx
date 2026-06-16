"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mic, Send, Bot, User, StopCircle } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import { getGeminiClient, INTERVIEW_SYSTEM_PROMPT } from "@/lib/gemini";

export default function InterviewPage() {
  const [messages, setMessages] = useState<{ role: 'ai' | 'user', text: string }[]>([
    { role: 'ai', text: "Welcome to your mock interview for the Senior Azure DevOps Engineer role. Let's start with a scenario. Your organization wants to deploy an AKS cluster, but security policy dictates that no nodes can have public IP addresses. How would you architect this?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { apiKey } = useSettings();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, { role: 'user', text: input }]);
    setInput("");
    setIsTyping(true);

    try {
      if (!apiKey) {
        throw new Error("Please enter your Gemini API Key in the Dashboard Settings first.");
      }
      const client = getGeminiClient(apiKey);
      const model = client.getGenerativeModel({ model: "gemini-pro" });
      
      const history = messages.map(m => ({
        role: m.role === 'ai' ? 'model' : 'user',
        parts: [{ text: m.text }]
      }));

      let promptToSend = input;
      if (history.length === 0) {
        promptToSend = `SYSTEM INSTRUCTION: ${INTERVIEW_SYSTEM_PROMPT}\n\nUSER MESSAGE:\n${input}`;
      }

      const chat = model.startChat({ history });
      const result = await chat.sendMessage(promptToSend);
      const responseText = result.response.text();

      setMessages(prev => [...prev, { role: 'ai', text: responseText }]);
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      setMessages(prev => [...prev, { role: 'ai', text: "Error: " + message }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 md:p-12 pt-24 max-w-5xl mx-auto space-y-8 flex flex-col">
      
      <div className="flex justify-between items-end mb-4">
        <div>
          <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20 px-3 py-1 text-sm mb-4">
            <Bot className="w-4 h-4 mr-2 inline" /> AI Interviewer
          </Badge>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Mock Interview Session</h1>
          <p className="text-muted-foreground mt-2">Module: Azure Virtual Networks & AKS</p>
        </div>
        <Button variant="destructive" className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/50">
          <StopCircle className="w-4 h-4 mr-2" /> End Interview
        </Button>
      </div>

      <Card className="flex-1 bg-white/[0.02] border-white/5 shadow-2xl flex flex-col overflow-hidden min-h-[60vh]">
        {/* Chat Area */}
        <CardContent className="flex-1 p-6 overflow-y-auto space-y-6" ref={scrollRef}>
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'ai' ? 'bg-blue-600' : 'bg-purple-600'}`}>
                {msg.role === 'ai' ? <Bot className="w-6 h-6 text-white" /> : <User className="w-6 h-6 text-white" />}
              </div>
              <div className={`max-w-[80%] rounded-2xl p-5 ${
                msg.role === 'ai' 
                  ? 'bg-white/5 border border-white/10 text-gray-200' 
                  : 'bg-purple-600 text-white'
              }`}>
                <p className="leading-relaxed">{msg.text}</p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
        </CardContent>

        {/* Input Area */}
        <div className="p-4 bg-black/40 border-t border-white/5">
          <div className="flex gap-4 max-w-4xl mx-auto">
            <Button variant="outline" size="icon" className="h-14 w-14 rounded-full bg-white/5 border-white/10 hover:bg-white/10 text-gray-300">
              <Mic className="w-6 h-6" />
            </Button>
            <input
              type="text"
              placeholder="Type your answer or speak into the microphone..."
              className="flex-1 bg-white/5 border border-white/10 rounded-full px-6 text-gray-200 focus:outline-none focus:border-blue-500 transition-colors"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <Button 
              onClick={handleSend}
              className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/20"
            >
              <Send className="w-5 h-5 ml-1" />
            </Button>
          </div>
        </div>
      </Card>

    </div>
  );
}
