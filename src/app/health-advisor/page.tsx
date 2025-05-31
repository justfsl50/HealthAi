
"use client";

import { useState, useEffect, useRef } from "react";
import { aiHealthAdvisor, type AIHealthAdvisorOutput } from "@/ai/flows/ai-health-advisor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, BotMessageSquare, User, Send, Smile, RefreshCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  content: string;
  timestamp: Date;
}

const initialAiMessageContent = "Hello! I'm your AI Health Advisor. To get started, please provide your age and optionally your medical history using the fields that were initially visible, then tell me about your symptoms in the chat. This service is not a substitute for professional medical advice.";

export default function HealthAdvisorPage() {
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [age, setAge] = useState<string>("");
  const [medicalHistory, setMedicalHistory] = useState<string>("");
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatStarted, setChatStarted] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && chatMessages.length === 0) {
      setChatMessages([
        {
          id: crypto.randomUUID(),
          sender: "ai",
          content: initialAiMessageContent,
          timestamp: new Date(),
        },
      ]);
    }
  }, [isClient, chatMessages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleNewChat = () => {
    if (isClient) {
      setChatMessages([
        {
          id: crypto.randomUUID(),
          sender: "ai",
          content: initialAiMessageContent,
          timestamp: new Date(),
        },
      ]);
    } else {
      setChatMessages([]); // Should ideally be empty and then repopulated by the effect above
    }
    setAge("");
    setMedicalHistory("");
    setCurrentMessage("");
    setChatStarted(false);
    setIsLoading(false);
    toast({
      title: "New Chat Started",
      description: "Please provide your age and medical history again if needed.",
    });
  };

  const handleSendMessage = async () => {
    if (!age.trim() && !chatStarted) {
      toast({
        variant: "destructive",
        title: "Age Required",
        description: "Please enter your age before sending your first message.",
      });
      return;
    }
    if (!currentMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      sender: "user",
      content: currentMessage,
      timestamp: new Date(),
    };
    setChatMessages((prev) => [...prev, userMessage]);
    setCurrentMessage("");
    setIsLoading(true);

    if (!chatStarted) {
      setChatStarted(true);
    }

    try {
      const parsedAge = parseInt(age, 10);
      if (isNaN(parsedAge) || parsedAge <= 0 || parsedAge > 120) {
        toast({
          variant: "destructive",
          title: "Invalid Age",
          description: "Please enter a valid age.",
        });
        const aiErrorMessage: ChatMessage = {
            id: crypto.randomUUID(),
            sender: "ai",
            content: "I couldn't process that age. Please enter a valid age (e.g., 35).",
            timestamp: new Date(),
        };
        setChatMessages((prev) => [...prev, aiErrorMessage]);
        setIsLoading(false);
        return;
      }

      const result: AIHealthAdvisorOutput = await aiHealthAdvisor({
        symptoms: userMessage.content,
        age: parsedAge,
        medicalHistory: medicalHistory.trim() || "Not provided",
      });

      const aiResponseContent = `
        <p><strong>Advice:</strong> ${result.advice}</p>
        <p class="mt-2"><strong>Suggestions:</strong> ${result.suggestions}</p>
        <div class="mt-4 p-3 bg-muted/50 rounded-md text-xs flex items-start gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5 text-destructive flex-shrink-0 mt-0.5"><path d="M20 12.58A9.94 9.94 0 0 0 12.01 2C6.48 2 2 6.48 2 12s4.48 10 10.01 10c2.82 0 5.37-1.17 7.26-3.06"></path><path d="M17.03 20.3a9.95 9.95 0 0 1-10-14.63"></path><path d="M12 12H12.01"></path><path d="M12 8v5"></path></svg>
          <p><strong>Disclaimer:</strong> ${result.disclaimer} This AI-generated advice is for informational purposes only and should not be considered a substitute for professional medical consultation, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.</p>
        </div>
      `;

      const aiMessage: ChatMessage = {
        id: crypto.randomUUID(),
        sender: "ai",
        content: aiResponseContent,
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Health advice error:", error);
      toast({
        variant: "destructive",
        title: "Advice Generation Failed",
        description: "Could not generate health advice. Please try again.",
      });
       const aiErrorMessage: ChatMessage = {
            id: crypto.randomUUID(),
            sender: "ai",
            content: "Sorry, I encountered an error trying to get advice. Please try again.",
            timestamp: new Date(),
        };
      setChatMessages((prev) => [...prev, aiErrorMessage]);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="flex flex-col h-full bg-background rounded-lg shadow-lg overflow-hidden">
      {/* Header Section */}
      <div className="p-6 border-b flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <BotMessageSquare className="h-6 w-6 text-primary" />
            AI Health Advisor
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Chat with our AI for health advice. This is not a substitute for professional medical advice.
          </p>
        </div>
        <Button variant="outline" size="icon" onClick={handleNewChat} aria-label="Start new chat">
          <RefreshCcw className="h-4 w-4" />
        </Button>
      </div>

      {/* Conditionally Rendered User Inputs */}
      {!chatStarted && (
        <div className="px-6 pt-6 pb-4 border-b bg-card">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="age-input" className="text-base flex items-center gap-1 mb-1">
                <User className="h-4 w-4"/> Your Age (Required)
              </Label>
              <Input 
                id="age-input" 
                type="number" 
                placeholder="e.g., 35" 
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="medical-history-input" className="text-base flex items-center gap-1 mb-1">
                <Smile className="h-4 w-4"/> Medical History (Optional)
              </Label>
              <Input
                id="medical-history-input"
                placeholder="e.g., diabetic, allergic to penicillin..."
                value={medicalHistory}
                onChange={(e) => setMedicalHistory(e.target.value)}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Chat Messages Area */}
      <ScrollArea className="flex-grow p-6">
        <div className="space-y-4">
          {chatMessages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex items-end gap-2",
                msg.sender === "user" ? "justify-end" : "justify-start"
              )}
            >
              {msg.sender === "ai" && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback><BotMessageSquare className="text-primary" /></AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  "max-w-[70%] rounded-lg p-3 shadow",
                  msg.sender === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                )}
              >
                {msg.sender === "ai" ? (
                    <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: msg.content }} />
                ) : (
                  <p className="text-sm">{msg.content}</p>
                )}
                <p className="text-xs opacity-70 mt-1 text-right">
                  {isClient ? msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                </p>
              </div>
              {msg.sender === "user" && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback><User /></AvatarFallback>
                  </Avatar>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-end gap-2 justify-start">
                <Avatar className="h-8 w-8">
                  <AvatarFallback><BotMessageSquare className="text-primary" /></AvatarFallback>
                </Avatar>
              <div className="max-w-[70%] rounded-lg p-3 shadow bg-muted text-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Message Input Section */}
      <div className="px-6 py-4 border-t bg-background">
        <div className="flex w-full items-center gap-2">
          <Textarea
            placeholder="Type your symptoms or health query..."
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !e.shiftKey && !isLoading) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            rows={1}
            className="min-h-[40px] flex-grow resize-none"
            disabled={isLoading}
          />
          <Button onClick={handleSendMessage} disabled={isLoading || (!chatStarted && !age.trim()) || !currentMessage.trim()}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
