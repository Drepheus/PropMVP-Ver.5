import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  DollarSign, 
  Clock,
  Target,
  Zap
} from "lucide-react";
import { PropertyWithDetails } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { formatCurrency } from "@/lib/utils";

interface AIAnalysis {
  grade: string;
  score: number;
  summary: string;
  keyStrengths: string[];
  riskFactors: string[];
  recommendation: string;
  estimatedProfit: number;
  confidenceLevel: number;
  marketPosition: string;
  urgency: string;
}

export default function AIAnalysis() {
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>("");
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);

  // Fetch all properties for selection
  const { data: properties = [], isLoading: propertiesLoading } = useQuery<PropertyWithDetails[]>({
    queryKey: ["/api/properties"],
    enabled: true
  });

  // AI Analysis mutation
  const analysisMutation = useMutation({
    mutationFn: async (propertyId: string) => {
      const response = await fetch(`/api/properties/${propertyId}/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to analyze property');
      }
      
      return await response.json() as AIAnalysis;
    },
    onSuccess: (data) => {
      setAnalysis(data);
    }
  });

  const handleAnalyze = () => {
    if (selectedPropertyId) {
      analysisMutation.mutate(selectedPropertyId);
    }
  };

  const getGradeColor = (grade: string) => {
    const gradeMap: { [key: string]: string } = {
      'A+': 'text-emerald-400 bg-emerald-500/20',
      'A': 'text-emerald-400 bg-emerald-500/20',
      'A-': 'text-emerald-400 bg-emerald-500/20',
      'B+': 'text-blue-400 bg-blue-500/20',
      'B': 'text-blue-400 bg-blue-500/20',
      'B-': 'text-blue-400 bg-blue-500/20',
      'C+': 'text-yellow-400 bg-yellow-500/20',
      'C': 'text-yellow-400 bg-yellow-500/20',
      'C-': 'text-yellow-400 bg-yellow-500/20',
      'D+': 'text-orange-400 bg-orange-500/20',
      'D': 'text-orange-400 bg-orange-500/20',
      'D-': 'text-orange-400 bg-orange-500/20',
      'F': 'text-red-400 bg-red-500/20'
    };
    return gradeMap[grade] || 'text-slate-400 bg-slate-500/20';
  };

  const getUrgencyColor = (urgency: string) => {
    const urgencyMap: { [key: string]: string } = {
      'Buy ASAP': 'text-emerald-400 bg-emerald-500/20',
      'Strong Consider': 'text-blue-400 bg-blue-500/20',
      'Evaluate Further': 'text-yellow-400 bg-yellow-500/20',
      'Proceed with Caution': 'text-orange-400 bg-orange-500/20',
      'Avoid': 'text-red-400 bg-red-500/20'
    };
    return urgencyMap[urgency] || 'text-slate-400 bg-slate-500/20';
  };

  return (
    <Card className="bg-black border border-slate-900 rounded-[1.5rem] shadow-lg overflow-hidden" data-tour="ai-analysis">
      <CardHeader className="bg-black border-b border-slate-900 pb-6">
        <CardTitle className="flex items-center justify-between text-slate-100 text-2xl">
          <div className="flex items-center">
            <Brain className="h-6 w-6 text-purple-400 mr-3" />
            AI Property Analysis
          </div>
          <div className="p-2 bg-purple-500/20 rounded-xl">
            <Zap className="h-6 w-6 text-purple-400" />
          </div>
        </CardTitle>
        <p className="text-slate-400 mt-2">
          Get AI-powered investment grades and detailed analysis for any property in your portfolio
        </p>
      </CardHeader>
      
      <CardContent className="p-6">
        {/* Property Selection */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="text-slate-300 text-sm font-medium mb-2 block">
              Select Property to Analyze
            </label>
            <div className="flex gap-4">
              <Select value={selectedPropertyId} onValueChange={setSelectedPropertyId}>
                <SelectTrigger className="flex-1 modern-input bg-slate-800/50 border-slate-600">
                  <SelectValue placeholder="Choose a property from your searches..." />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  {propertiesLoading ? (
                    <SelectItem value="loading">Loading properties...</SelectItem>
                  ) : properties.length === 0 ? (
                    <SelectItem value="none">No properties found. Search for properties first.</SelectItem>
                  ) : (
                    properties.map((property) => (
                      <SelectItem key={property.id} value={property.id.toString()}>
                        {property.address}, {property.city}, {property.state} - ${property.listPrice || 'Price TBD'}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              
              <Button 
                onClick={handleAnalyze}
                disabled={!selectedPropertyId || analysisMutation.isPending}
                className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold min-w-[120px]"
              >
                {analysisMutation.isPending ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Analyzing...
                  </div>
                ) : (
                  <>
                    <Brain className="h-4 w-4 mr-2" />
                    Analyze
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Analysis Results */}
        {analysis && (
          <div className="space-y-6">
            {/* Grade and Score Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-black border border-slate-900 rounded-[1.5rem] p-4 text-center">
                <div className="mb-2">
                  <span className={`text-4xl font-bold px-4 py-2 rounded-xl ${getGradeColor(analysis.grade)}`}>
                    {analysis.grade}
                  </span>
                </div>
                <p className="text-slate-400 text-sm">Investment Grade</p>
              </div>
              
              <div className="bg-black border border-slate-900 rounded-[1.5rem] p-4 text-center">
                <div className="text-3xl font-bold text-white mb-2">{analysis.score}</div>
                <p className="text-slate-400 text-sm">Score (0-100)</p>
                <Progress value={analysis.score} className="mt-2 h-2" />
              </div>
              
              <div className="bg-black border border-slate-900 rounded-[1.5rem] p-4 text-center">
                <div className="text-2xl font-bold text-emerald-400 mb-2">
                  {formatCurrency(analysis.estimatedProfit)}
                </div>
                <p className="text-slate-400 text-sm">Est. Profit</p>
              </div>
              
              <div className="bg-black border border-slate-900 rounded-[1.5rem] p-4 text-center">
                <div className="text-2xl font-bold text-blue-400 mb-2">{analysis.confidenceLevel}%</div>
                <p className="text-slate-400 text-sm">Confidence</p>
              </div>
            </div>

            {/* Executive Summary */}
            <div className="bg-black border border-slate-900 rounded-[1.5rem] p-6">
              <h3 className="text-lg font-semibold text-slate-200 mb-3 flex items-center">
                <Target className="h-5 w-5 text-blue-400 mr-2" />
                Executive Summary
              </h3>
              <p className="text-slate-300 leading-relaxed">{analysis.summary}</p>
              
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-600">
                <div>
                  <span className="text-slate-400 text-sm">Market Position: </span>
                  <span className="text-slate-200 font-medium">{analysis.marketPosition}</span>
                </div>
                <Badge className={`${getUrgencyColor(analysis.urgency)} border-none`}>
                  {analysis.urgency}
                </Badge>
              </div>
            </div>

            {/* Strengths and Risks */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Key Strengths */}
              <div className="bg-black border border-slate-900 rounded-[1.5rem] p-6">
                <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center">
                  <CheckCircle className="h-5 w-5 text-emerald-400 mr-2" />
                  Key Strengths
                </h3>
                <div className="space-y-3">
                  {analysis.keyStrengths.map((strength, index) => (
                    <div key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <p className="text-slate-300 text-sm">{strength}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risk Factors */}
              <div className="bg-black border border-slate-900 rounded-[1.5rem] p-6">
                <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center">
                  <AlertTriangle className="h-5 w-5 text-amber-400 mr-2" />
                  Risk Factors
                </h3>
                <div className="space-y-3">
                  {analysis.riskFactors.map((risk, index) => (
                    <div key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <p className="text-slate-300 text-sm">{risk}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Detailed Recommendation */}
            <div className="bg-black border border-slate-900 rounded-[1.5rem] p-6">
              <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 text-purple-400 mr-2" />
                Investment Recommendation
              </h3>
              <p className="text-slate-300 leading-relaxed">{analysis.recommendation}</p>
            </div>
          </div>
        )}

        {/* Error Handling */}
        {analysisMutation.isError && (
          <div className="bg-black border border-slate-900 rounded-[1.5rem] p-6 border border-red-500/30">
            <div className="flex items-center mb-2">
              <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
              <h3 className="text-red-400 font-semibold">Analysis Failed</h3>
            </div>
            <p className="text-slate-300">
              {analysisMutation.error instanceof Error 
                ? analysisMutation.error.message 
                : "Failed to analyze property. Please try again."}
            </p>
            <Button 
              onClick={() => analysisMutation.reset()}
              variant="outline"
              className="mt-3"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Getting Started */}
        {!analysis && !analysisMutation.isPending && (
          <div className="text-center py-8">
            <Brain className="h-16 w-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-300 mb-2">Ready for AI Analysis</h3>
            <p className="text-slate-400 max-w-md mx-auto">
              Select a property from your searches above and click "Analyze" to get a comprehensive AI-powered investment grade from F to A+.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}