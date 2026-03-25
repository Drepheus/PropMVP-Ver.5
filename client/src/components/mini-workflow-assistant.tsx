import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Search, 
  Brain, 
  Users, 
  ChevronRight,
  Zap,
  CheckCircle,
  Circle,
  ArrowRight
} from "lucide-react";
import { Link, useLocation } from "wouter";

interface MiniWorkflowAssistantProps {
  currentStep?: "market" | "search" | "analysis" | "leads";
  marketResearched?: boolean;
  propertySearched?: boolean;
  propertyAnalyzed?: boolean;
  leadAdded?: boolean;
  isVisible?: boolean;
  onToggle?: (visible: boolean) => void;
  onStepClick?: (step: string) => void;
}

export default function MiniWorkflowAssistant({
  currentStep = "market",
  marketResearched = false,
  propertySearched = false,
  propertyAnalyzed = false,
  leadAdded = false,
  isVisible = true,
  onToggle,
  onStepClick
}: MiniWorkflowAssistantProps) {
  const [location, setLocation] = useLocation();
  const [isHovered, setIsHovered] = useState(false);

  if (!isVisible) return null;

  const steps = [
    {
      id: "market",
      title: "Market",
      subtitle: "Research",
      icon: TrendingUp,
      completed: marketResearched,
      current: currentStep === "market",
      route: "/market-intelligence",
      color: "bg-blue-500/20 text-blue-400 border-blue-500/30"
    },
    {
      id: "search",
      title: "Property",
      subtitle: "Search",
      icon: Search,
      completed: propertySearched,
      current: currentStep === "search",
      route: "/property-search",
      color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
    },
    {
      id: "analysis",
      title: "AI",
      subtitle: "Analysis",
      icon: Brain,
      completed: propertyAnalyzed,
      current: currentStep === "analysis",
      route: "/analytics",
      color: "bg-purple-500/20 text-purple-400 border-purple-500/30"
    },
    {
      id: "leads",
      title: "Lead",
      subtitle: "Management",
      icon: Users,
      completed: leadAdded,
      current: currentStep === "leads",
      route: "/lead-management",
      color: "bg-orange-500/20 text-orange-400 border-orange-500/30"
    }
  ];

  const completedSteps = steps.filter(step => step.completed).length;
  const progressPercentage = (completedSteps / steps.length) * 100;

  const handleStepClick = (step: typeof steps[0]) => {
    setLocation(step.route);
    onStepClick?.(step.id);
  };

  const handleMainWorkflowClick = () => {
    // This would expand the main workflow assistant
    onToggle?.(true);
  };

  return (
    <div 
      className="fixed left-4 top-1/2 transform -translate-y-1/2 z-50 transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-tour="mini-workflow"
    >
      <Card className={`bg-black border border-slate-900 rounded-[1.5rem] shadow-2xl transition-all duration-300 ${
        isHovered ? 'w-64' : 'w-16'
      }`}>
        <CardContent className="p-3">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <div className="p-2 bg-black border-b border-slate-900 rounded-lg">
                <Zap className="h-4 w-4 text-blue-400" />
              </div>
              {isHovered && (
                <div className="ml-3">
                  <h3 className="text-slate-200 font-semibold text-sm">Deal Flow</h3>
                  <p className="text-slate-400 text-xs">{completedSteps}/4 Complete</p>
                </div>
              )}
            </div>
            {isHovered && (
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-slate-200 p-1 h-auto"
                onClick={handleMainWorkflowClick}
              >
                <ArrowRight className="h-3 w-3" />
              </Button>
            )}
          </div>

          {/* Progress Bar */}
          <div className={`mb-4 transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-50'}`}>
            <div className="w-full bg-slate-800/50 rounded-full h-1.5">
              <div 
                className="bg-black border-b border-slate-900 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            {isHovered && (
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>Progress</span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
            )}
          </div>

          {/* Steps */}
          <div className="space-y-2">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <Button
                  key={step.id}
                  variant="ghost"
                  className={`w-full justify-start p-2 h-auto rounded-lg transition-all duration-200 hover:bg-slate-800/50 ${
                    step.current ? 'bg-slate-800/30 border border-slate-600/50' : ''
                  }`}
                  onClick={() => handleStepClick(step)}
                >
                  <div className="flex items-center w-full">
                    {/* Step Icon/Status */}
                    <div className="relative">
                      {step.completed ? (
                        <CheckCircle className="h-4 w-4 text-emerald-400" />
                      ) : step.current ? (
                        <div className="h-4 w-4 rounded-full border-2 border-blue-400 bg-blue-400/20">
                          <div className="h-full w-full rounded-full bg-blue-400/50 animate-pulse" />
                        </div>
                      ) : (
                        <Circle className="h-4 w-4 text-slate-600" />
                      )}
                      
                      {/* Connecting line */}
                      {index < steps.length - 1 && (
                        <div className={`absolute left-1/2 transform -translate-x-1/2 top-4 w-0.5 h-6 ${
                          step.completed ? 'bg-emerald-400/30' : 'bg-slate-700'
                        }`} />
                      )}
                    </div>

                    {/* Step Content */}
                    {isHovered && (
                      <div className="ml-3 flex-1 text-left">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-slate-200 text-sm font-medium">{step.title}</p>
                            <p className="text-slate-400 text-xs">{step.subtitle}</p>
                          </div>
                          <div className="flex items-center">
                            {step.completed && (
                              <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs mr-2">
                                ✓
                              </Badge>
                            )}
                            {step.current && (
                              <Badge className="bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs mr-2">
                                Active
                              </Badge>
                            )}
                            <ChevronRight className="h-3 w-3 text-slate-500" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </Button>
              );
            })}
          </div>

          {/* Quick Stats */}
          {isHovered && (
            <div className="mt-4 pt-3 border-t border-slate-700/30">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="text-center">
                  <p className="text-slate-400">Next</p>
                  <p className="text-slate-200 font-medium">
                    {steps.find(s => !s.completed && !s.current)?.title || "Complete"}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-slate-400">Status</p>
                  <p className="text-blue-400 font-medium">
                    {completedSteps === steps.length ? "Done" : "In Progress"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Minimal indicator when collapsed */}
      {!isHovered && (
        <div className="absolute -right-2 top-1/2 transform -translate-y-1/2">
          <div className="w-1 h-8 bg-black border-b border-slate-900 rounded-full opacity-60" />
        </div>
      )}
    </div>
  );
}