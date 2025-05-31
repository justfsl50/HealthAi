
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { analyzeSymptoms, type AnalyzeSymptomsOutput } from "@/ai/flows/ai-symptom-analyzer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, Sparkles, Stethoscope, Lightbulb } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const symptomAnalyzerSchema = z.object({
  symptoms: z.string().min(10, { message: "Please describe your symptoms in at least 10 characters." }),
});

type SymptomAnalyzerFormValues = z.infer<typeof symptomAnalyzerSchema>;

export default function SymptomAnalyzerPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeSymptomsOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<SymptomAnalyzerFormValues>({
    resolver: zodResolver(symptomAnalyzerSchema),
    defaultValues: {
      symptoms: "",
    },
  });

  async function onSubmit(values: SymptomAnalyzerFormValues) {
    setIsLoading(true);
    setAnalysisResult(null);
    try {
      const result = await analyzeSymptoms({ symptoms: values.symptoms });
      setAnalysisResult(result);
      toast({
        title: "Analysis Complete",
        description: "Potential causes and specialists have been identified.",
      });
    } catch (error) {
      console.error("Symptom analysis error:", error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "Could not analyze symptoms. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div>
        <div className="border-b pb-4 mb-6">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            AI Symptom Analyzer
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Describe your symptoms, and our AI will provide potential causes and suggest relevant specialists. This is not a medical diagnosis.
          </p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="symptoms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="symptoms-input" className="text-lg">Your Symptoms</FormLabel>
                  <FormControl>
                    <Textarea
                      id="symptoms-input"
                      placeholder="e.g., persistent headache, fatigue, and slight fever for 3 days..."
                      rows={5}
                      className="resize-none"
                      {...field}
                      aria-describedby="symptoms-help"
                    />
                  </FormControl>
                  <p id="symptoms-help" className="text-sm text-muted-foreground">
                    Please be as detailed as possible for a more accurate analysis.
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Analyze Symptoms"
              )}
            </Button>
          </form>
        </Form>
      </div>

      {analysisResult && (
        <Card className="shadow-xl mt-8">
          <CardHeader>
            <CardTitle className="text-xl">Analysis Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                Potential Causes
              </h3>
              <p className="text-muted-foreground whitespace-pre-line">{analysisResult.potentialCauses}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
                <Stethoscope className="h-5 w-5 text-primary" />
                Suggested Specialists
              </h3>
              <p className="text-muted-foreground whitespace-pre-line">{analysisResult.suggestedSpecialists}</p>
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-muted-foreground">
              <strong>Disclaimer:</strong> This AI analysis is for informational purposes only and does not constitute medical advice. Always consult with a qualified healthcare professional for diagnosis and treatment.
            </p>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
