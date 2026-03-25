import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, ArrowRight, Search, BarChart3, Users, Target, TrendingUp, AlertCircle, X, HelpCircle, FileText, PenTool, Crown, ChevronRight, ChevronDown, Play, Pause, SkipForward } from "lucide-react";
import { useLocation } from "wouter";

interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  icon: any;
  route: string;
  status: 'pending' | 'active' | 'completed' | 'skipped';
  requirements?: string[];
  tips?: string[];
  tourElements?: {
    selector: string;
    description: string;
    position: 'top' | 'bottom' | 'left' | 'right';
  }[];
}

interface WorkflowProgressProps {
  currentStep?: string;
  marketResearched?: boolean;
  propertySearched?: boolean;
  propertyAnalyzed?: boolean;
  leadAdded?: boolean;
  offerMade?: boolean;
  contractSecured?: boolean;
  isPremium?: boolean;
  onStepClick?: (step: WorkflowStep) => void;
  isVisible?: boolean;
  onToggle?: (visible: boolean) => void;
  tourMode?: boolean;
  onTourToggle?: (enabled: boolean) => void;
}

const workflowSteps: WorkflowStep[] = [
  {
    id: 'market',
    title: 'Market Intelligence',
    description: 'Research market conditions and identify hot opportunities',
    icon: TrendingUp,
    route: '/',
    status: 'pending',
    requirements: [
      'Market data access',
      'Regional analysis',
      'Investment opportunity identification'
    ],
    tips: [
      'Check market heatmaps for area activity',
      'Review distressed property indicators',
      'Analyze investor activity levels'
    ],
    tourElements: [
      {
        selector: '[data-tour="market-overview"]',
        description: 'Start here to understand current market conditions and trending opportunities',
        position: 'bottom'
      },
      {
        selector: '[data-tour="hot-markets"]',
        description: 'View high-activity markets with the best investment potential',
        position: 'left'
      },
      {
        selector: '[data-tour="market-heatmap"]',
        description: 'Use the interactive heatmap to identify motivated seller areas',
        position: 'top'
      }
    ]
  },
  {
    id: 'search',
    title: 'Find Property',
    description: 'Search for specific investment properties using our MLS-powered engine',
    icon: Search,
    route: '/property-search',
    status: 'pending',
    requirements: [
      'Complete property address',
      'Valid city and state',
      'Accurate property details'
    ],
    tips: [
      'Use full street addresses for best results',
      'Include apartment/unit numbers when applicable',
      'Verify spelling of street names'
    ],
    tourElements: [
      {
        selector: '[data-tour="property-search-form"]',
        description: 'Enter the complete property address here for accurate analysis',
        position: 'bottom'
      },
      {
        selector: '[data-tour="search-button"]',
        description: 'Click to start the property analysis and get comprehensive data',
        position: 'top'
      }
    ]
  },
  {
    id: 'analyze',
    title: 'Research & Analyze',
    description: 'Deep dive into property metrics, comparables, and AI insights',
    icon: BarChart3,
    route: '/analytics',
    status: 'pending',
    requirements: [
      'Property successfully searched',
      'Market data available',
      'Comparable sales found'
    ],
    tips: [
      'Review all comparable sales carefully',
      'Check AI analysis for investment grade',
      'Verify market trends and DOM statistics'
    ],
    tourElements: [
      {
        selector: '[data-tour="property-overview"]',
        description: 'Review comprehensive property details and specifications',
        position: 'right'
      },
      {
        selector: '[data-tour="comparable-sales"]',
        description: 'Analyze recent comparable sales to determine market value',
        position: 'top'
      },
      {
        selector: '[data-tour="market-analysis"]',
        description: 'Study market trends and investment metrics for this area',
        position: 'left'
      },
      {
        selector: '[data-tour="ai-analysis"]',
        description: 'Get AI-powered investment grade and profit estimates',
        position: 'bottom'
      }
    ]
  },
  {
    id: 'convert',
    title: 'Add to Pipeline',
    description: 'Convert qualified property into active lead for follow-up',
    icon: Users,
    route: '/lead-management',
    status: 'pending',
    requirements: [
      'Property fully analyzed',
      'Investment decision made',
      'Contact information gathered'
    ],
    tips: [
      'Set appropriate lead priority',
      'Add detailed notes from analysis',
      'Schedule follow-up activities'
    ],
    tourElements: [
      {
        selector: '[data-tour="add-lead"]',
        description: 'Convert this property into an active lead for your pipeline',
        position: 'bottom'
      },
      {
        selector: '[data-tour="lead-priority"]',
        description: 'Set the priority level based on your analysis',
        position: 'right'
      },
      {
        selector: '[data-tour="lead-notes"]',
        description: 'Add detailed notes from your property analysis',
        position: 'top'
      }
    ]
  },
  {
    id: 'offer',
    title: 'Make an Offer',
    description: 'Present cash offer based on MAO with purchase agreement and assignment clause',
    icon: FileText,
    route: '/make-offer',
    status: 'pending',
    requirements: [
      'MAO calculated and verified',
      'Purchase agreement template ready',
      'Assignment clause included',
      'Negotiation strategy planned'
    ],
    tips: [
      'Offer 10-15% below MAO for negotiation room',
      'Emphasize speed and convenience to seller',
      'Include inspection period contingency',
      'Prepare for counteroffers'
    ]
  },
  {
    id: 'contract',
    title: 'Secure Contract',
    description: 'Execute legally binding purchase agreement with assignment rights',
    icon: PenTool,
    route: '/secure-contract',
    status: 'pending',
    requirements: [
      'Offer accepted by seller',
      'Purchase agreement finalized',
      'Assignment clause confirmed',
      'Title status verified'
    ],
    tips: [
      'Use e-signature for quick execution',
      'Provide small earnest money deposit',
      'Verify clear title with title company',
      'Store contract securely in CRM'
    ]
  }
];

export default function WorkflowProgress({ 
  currentStep = 'market', 
  marketResearched = false,
  propertySearched = false, 
  propertyAnalyzed = false, 
  leadAdded = false,
  offerMade = false,
  contractSecured = false,
  isPremium = false,
  onStepClick,
  isVisible = false,
  onToggle,
  tourMode = false,
  onTourToggle
}: WorkflowProgressProps) {
  const [, setLocation] = useLocation();
  const [steps, setSteps] = useState<WorkflowStep[]>(workflowSteps);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [tourActive, setTourActive] = useState(false);
  const [currentTourElement, setCurrentTourElement] = useState(0);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  const tourOverlayRef = useRef<HTMLDivElement>(null);

  // Tour functionality
  const startTour = () => {
    setTourActive(true);
    setCurrentTourElement(0);
    if (onTourToggle) {
      onTourToggle(true);
    }
    // Navigate to first step route if needed
    const firstStep = steps.find(step => step.status === 'active' || step.status === 'pending');
    if (firstStep && window.location.pathname !== firstStep.route) {
      setLocation(firstStep.route);
    }
  };

  const stopTour = () => {
    setTourActive(false);
    setCurrentTourElement(0);
    setHighlightedElement(null);
    if (onTourToggle) {
      onTourToggle(false);
    }
  };

  const nextTourElement = () => {
    const currentStep = steps[currentStepIndex];
    const totalElements = currentStep?.tourElements?.length || 0;
    
    if (currentTourElement < totalElements - 1) {
      setCurrentTourElement(currentTourElement + 1);
    } else {
      // Move to next step
      const nextStep = currentStepIndex + 1;
      if (nextStep < steps.length) {
        setCurrentStepIndex(nextStep);
        setCurrentTourElement(0);
        const nextStepObj = steps[nextStep];
        if (nextStepObj && nextStepObj.route !== window.location.pathname) {
          setLocation(nextStepObj.route);
        }
      } else {
        stopTour();
      }
    }
  };

  const previousTourElement = () => {
    if (currentTourElement > 0) {
      setCurrentTourElement(currentTourElement - 1);
    } else if (currentStepIndex > 0) {
      const prevStep = currentStepIndex - 1;
      const prevStepObj = steps[prevStep];
      setCurrentStepIndex(prevStep);
      setCurrentTourElement((prevStepObj?.tourElements?.length || 1) - 1);
      if (prevStepObj && prevStepObj.route !== window.location.pathname) {
        setLocation(prevStepObj.route);
      }
    }
  };

  // Auto-scroll and highlight tour elements
  useEffect(() => {
    if (tourActive && steps[currentStepIndex]?.tourElements) {
      const currentElement = steps[currentStepIndex].tourElements![currentTourElement];
      if (currentElement) {
        const element = document.querySelector(currentElement.selector);
        if (element) {
          // Smooth scroll to element
          element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center',
            inline: 'center'
          });
          
          // Highlight element
          setHighlightedElement(currentElement.selector);
          
          // Add pulse effect
          element.classList.add('tour-highlight');
          setTimeout(() => {
            element.classList.remove('tour-highlight');
          }, 2000);
        }
      }
    }
  }, [tourActive, currentStepIndex, currentTourElement]);

  // Update step statuses based on progress
  useEffect(() => {
    const updatedSteps = steps.map((step, index) => {
      let status: 'pending' | 'active' | 'completed' | 'skipped' = 'pending';

      if (step.id === 'market') {
        status = marketResearched ? 'completed' : (currentStep === 'market' ? 'active' : 'pending');
      } else if (step.id === 'search') {
        if (!marketResearched) {
          status = 'pending';
        } else {
          status = propertySearched ? 'completed' : (currentStep === 'search' ? 'active' : 'pending');
        }
      } else if (step.id === 'analyze') {
        if (!propertySearched) {
          status = 'pending';
        } else if (propertyAnalyzed) {
          status = 'completed';
        } else if (currentStep === 'analyze') {
          status = 'active';
        } else {
          status = 'pending';
        }
      } else if (step.id === 'convert') {
        if (!propertyAnalyzed) {
          status = 'pending';
        } else if (leadAdded) {
          status = 'completed';
        } else if (currentStep === 'convert') {
          status = 'active';
        } else {
          status = 'pending';
        }
      } else if (step.id === 'offer') {
        if (!isPremium || !leadAdded) {
          status = 'pending';
        } else if (offerMade) {
          status = 'completed';
        } else if (currentStep === 'offer') {
          status = 'active';
        } else {
          status = 'pending';
        }
      } else if (step.id === 'contract') {
        if (!isPremium || !offerMade) {
          status = 'pending';
        } else if (contractSecured) {
          status = 'completed';
        } else if (currentStep === 'contract') {
          status = 'active';
        } else {
          status = 'pending';
        }
      }

      return { ...step, status };
    });

    setSteps(updatedSteps);

    // Update current step index
    const activeIndex = updatedSteps.findIndex(step => step.status === 'active');
    if (activeIndex !== -1) {
      setCurrentStepIndex(activeIndex);
    } else {
      const lastCompletedIndex = updatedSteps.map(step => step.status).lastIndexOf('completed');
      setCurrentStepIndex(Math.min(lastCompletedIndex + 1, updatedSteps.length - 1));
    }
  }, [currentStep, marketResearched, propertySearched, propertyAnalyzed, leadAdded]);

  const calculateProgress = () => {
    const completedSteps = steps.filter(step => step.status === 'completed').length;
    return (completedSteps / steps.length) * 100;
  };

  const getNextStep = () => {
    const nextStepIndex = steps.findIndex(step => step.status === 'pending' || step.status === 'active');
    return nextStepIndex !== -1 ? steps[nextStepIndex] : null;
  };

  const handleStepClick = (step: WorkflowStep) => {
    // Only allow clicking on available steps
    const stepIndex = steps.findIndex(s => s.id === step.id);
    const canNavigate = stepIndex === 0 || steps[stepIndex - 1].status === 'completed';

    if (canNavigate) {
      console.log('Navigating to:', step.route); // Debug log
      setLocation(step.route);
      if (onStepClick) {
        onStepClick(step);
      }
    }
  };

  const handleNextStep = () => {
    const nextStep = getNextStep();
    if (nextStep) {
      console.log('Next step navigation to:', nextStep.route); // Debug log
      handleStepClick(nextStep);
    }
  };

  const getStepIcon = (step: WorkflowStep) => {
    const IconComponent = step.icon;
    
    if (step.status === 'completed') {
      return <CheckCircle className="h-5 w-5 text-emerald-400" />;
    } else if (step.status === 'active') {
      return <IconComponent className="h-5 w-5 text-blue-400" />;
    } else {
      return <Circle className="h-5 w-5 text-slate-500" />;
    }
  };

  const getStepStatus = (step: WorkflowStep) => {
    switch (step.status) {
      case 'completed':
        return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Completed</Badge>;
      case 'active':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Active</Badge>;
      case 'pending':
        return <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/30">Pending</Badge>;
      default:
        return null;
    }
  };

  const nextStep = getNextStep();
  const progress = calculateProgress();

  // Show toggle button if workflow is not visible
  if (!isVisible) {
    return (
      <Card className="bg-black border border-slate-900 rounded-[1.5rem] border-slate-700/30 rounded-xl">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <HelpCircle className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <h4 className="font-semibold text-white">Need guidance?</h4>
                <p className="text-sm text-slate-400">Enable the workflow assistant to guide you through the deal process</p>
              </div>
            </div>
            <Button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggle && onToggle(true);
              }}
              className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold"
              size="sm"
            >
              Enable Guide
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-black border border-slate-900 rounded-[1.5rem] border-slate-700/30 rounded-xl">
      <CardContent className="p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Deal Workflow Assistant</h3>
            <div className="flex items-center space-x-3">
              <Badge className="bg-black border-b border-slate-900 text-white border-blue-500/30">
                {Math.round(progress)}% Complete
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggle && onToggle(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress 
              value={progress} 
              className="h-2 bg-slate-800/50"
            />
            <p className="text-sm text-slate-400">
              Step {currentStepIndex + 1} of {steps.length}: {steps[currentStepIndex]?.title || 'Getting Started'}
            </p>
          </div>
        </div>

        {/* Current Step Highlight */}
        {nextStep && (
          <div className="mb-6 p-4 bg-black border-b border-slate-900 rounded-xl border border-blue-500/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <nextStep.icon className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Next: {nextStep.title}</h4>
                  <p className="text-sm text-slate-300">{nextStep.description}</p>
                </div>
              </div>
              <Button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleNextStep();
                }}
                className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold"
                size="sm"
              >
                <ArrowRight className="h-4 w-4 mr-1" />
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Step List */}
        <div className="space-y-3">
          {steps.map((step, index) => {
            const canNavigate = index === 0 || steps[index - 1].status === 'completed';
            const isBlocked = !canNavigate && step.status === 'pending';

            return (
              <div
                key={step.id}
                className={`
                  group relative p-4 rounded-xl transition-all duration-200 cursor-pointer
                  ${step.status === 'active' 
                    ? 'bg-blue-500/10 border border-blue-500/30 shadow-lg' 
                    : step.status === 'completed'
                    ? 'bg-emerald-500/10 border border-emerald-500/30'
                    : isBlocked
                    ? 'bg-slate-800/30 border border-slate-700/20 opacity-60'
                    : 'bg-slate-800/20 border border-slate-700/20 hover:bg-slate-700/20'
                  }
                  ${canNavigate ? 'hover:border-blue-500/40' : ''}
                `}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (!isBlocked) {
                    handleStepClick(step);
                  }
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Step Number & Icon */}
                    <div className="flex items-center space-x-3">
                      <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                        ${step.status === 'completed' 
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : step.status === 'active'
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : 'bg-slate-700/50 text-slate-400 border border-slate-600/30'
                        }
                      `}>
                        {index + 1}
                      </div>
                      {getStepIcon(step)}
                    </div>

                    {/* Step Info */}
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className={`font-semibold ${
                          step.status === 'completed' ? 'text-emerald-300' :
                          step.status === 'active' ? 'text-blue-300' :
                          isBlocked ? 'text-slate-500' : 'text-slate-300'
                        }`}>
                          {step.title}
                        </h4>
                        {(step.id === 'offer' || step.id === 'contract') && (
                          <Badge className="bg-black border-b border-slate-900 text-amber-300 border-amber-500/30 text-xs">
                            <Crown className="h-3 w-3 mr-1" />
                            PREMIUM
                          </Badge>
                        )}
                      </div>
                      <p className={`text-sm ${
                        isBlocked ? 'text-slate-600' : 'text-slate-400'
                      }`}>
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center space-x-2">
                    {getStepStatus(step)}
                    {canNavigate && step.status !== 'completed' && (
                      <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
                    )}
                  </div>
                </div>

                {/* Requirements & Tips (shown on hover for pending steps) */}
                {step.status === 'active' && (step.requirements || step.tips) && (
                  <div className="mt-3 pt-3 border-t border-slate-700/30">
                    {step.requirements && (
                      <div className="mb-2">
                        <p className="text-xs font-medium text-slate-300 mb-1">Requirements:</p>
                        <ul className="text-xs text-slate-400 space-y-0.5">
                          {step.requirements.map((req, i) => (
                            <li key={i} className="flex items-center space-x-1">
                              <Circle className="h-2 w-2 text-slate-500" />
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {step.tips && (
                      <div>
                        <p className="text-xs font-medium text-blue-300 mb-1">Pro Tips:</p>
                        <ul className="text-xs text-slate-400 space-y-0.5">
                          {step.tips.map((tip, i) => (
                            <li key={i} className="flex items-center space-x-1">
                              <Circle className="h-2 w-2 text-blue-400" />
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Interactive Tour Controls */}
        <div className="mt-6 pt-4 border-t border-slate-700/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <HelpCircle className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <h4 className="font-semibold text-white">Interactive Tour</h4>
                <p className="text-sm text-slate-400">Get guided walkthrough with arrows and highlights</p>
              </div>
            </div>
            <Button 
              onClick={tourActive ? stopTour : startTour}
              className={tourActive ? "bg-red-500/20 text-red-300 border-red-500/30" : "bg-emerald-500 hover:bg-emerald-400 text-black font-bold"}
              size="sm"
            >
              {tourActive ? (
                <>
                  <Pause className="h-4 w-4 mr-1" />
                  Stop Tour
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-1" />
                  Start Tour
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Completion Message */}
        {progress === 100 && (
          <div className="mt-6 p-4 bg-black border-b border-slate-900 rounded-xl border border-emerald-500/30">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-6 w-6 text-emerald-400" />
              <div>
                <h4 className="font-semibold text-emerald-300">Workflow Complete!</h4>
                <p className="text-sm text-slate-300">
                  You've successfully moved a property through the entire analysis pipeline.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>

      {/* Tour Overlay */}
      {tourActive && (
        <div 
          ref={tourOverlayRef}
          className="fixed inset-0 z-50 pointer-events-none"
          style={{ background: 'rgba(0, 0, 0, 0.3)' }}
        >
          {/* Tour Tooltip */}
          {steps[currentStepIndex]?.tourElements && (
            <TourTooltip
              element={steps[currentStepIndex].tourElements![currentTourElement]}
              stepInfo={{
                current: currentTourElement + 1,
                total: steps[currentStepIndex].tourElements!.length,
                stepTitle: steps[currentStepIndex].title
              }}
              onNext={nextTourElement}
              onPrevious={previousTourElement}
              onClose={stopTour}
              canGoPrevious={currentStepIndex > 0 || currentTourElement > 0}
              canGoNext={currentStepIndex < steps.length - 1 || currentTourElement < (steps[currentStepIndex]?.tourElements?.length || 0) - 1}
            />
          )}
        </div>
      )}
    </Card>
  );
}

// Tour Tooltip Component
interface TourTooltipProps {
  element: {
    selector: string;
    description: string;
    position: 'top' | 'bottom' | 'left' | 'right';
  };
  stepInfo: {
    current: number;
    total: number;
    stepTitle: string;
  };
  onNext: () => void;
  onPrevious: () => void;
  onClose: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
}

function TourTooltip({ element, stepInfo, onNext, onPrevious, onClose, canGoPrevious, canGoNext }: TourTooltipProps) {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [arrowPosition, setArrowPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const targetElement = document.querySelector(element.selector);
    if (targetElement) {
      const rect = targetElement.getBoundingClientRect();
      const tooltipWidth = 320;
      const tooltipHeight = 120;
      
      let top = 0;
      let left = 0;
      let arrowTop = 0;
      let arrowLeft = 0;

      switch (element.position) {
        case 'top':
          top = rect.top - tooltipHeight - 20;
          left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
          arrowTop = rect.top - 10;
          arrowLeft = rect.left + (rect.width / 2) - 10;
          break;
        case 'bottom':
          top = rect.bottom + 20;
          left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
          arrowTop = rect.bottom + 10;
          arrowLeft = rect.left + (rect.width / 2) - 10;
          break;
        case 'left':
          top = rect.top + (rect.height / 2) - (tooltipHeight / 2);
          left = rect.left - tooltipWidth - 20;
          arrowTop = rect.top + (rect.height / 2) - 10;
          arrowLeft = rect.left - 10;
          break;
        case 'right':
          top = rect.top + (rect.height / 2) - (tooltipHeight / 2);
          left = rect.right + 20;
          arrowTop = rect.top + (rect.height / 2) - 10;
          arrowLeft = rect.right + 10;
          break;
      }

      // Keep tooltip in viewport
      top = Math.max(10, Math.min(top, window.innerHeight - tooltipHeight - 10));
      left = Math.max(10, Math.min(left, window.innerWidth - tooltipWidth - 10));

      setPosition({ top, left });
      setArrowPosition({ top: arrowTop, left: arrowLeft });
    }
  }, [element, currentTourElement]);

  return (
    <>
      {/* Pointing Arrow */}
      <div
        className="absolute w-5 h-5 bg-blue-500 transform rotate-45 pointer-events-none z-51"
        style={{
          top: arrowPosition.top,
          left: arrowPosition.left,
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
        }}
      />
      
      {/* Tooltip */}
      <div
        className="absolute bg-slate-900 border border-blue-500/30 rounded-xl p-4 pointer-events-auto z-52 shadow-2xl"
        style={{
          top: position.top,
          left: position.left,
          width: '320px',
          backdropFilter: 'blur(10px)',
          background: 'rgba(15, 23, 42, 0.95)'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-blue-400">{stepInfo.current}</span>
            </div>
            <h4 className="font-semibold text-white text-sm">{stepInfo.stepTitle}</h4>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0 text-slate-400 hover:text-white"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>

        {/* Content */}
        <p className="text-sm text-slate-300 mb-4 leading-relaxed">
          {element.description}
        </p>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="text-xs text-slate-400">
            {stepInfo.current} of {stepInfo.total}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onPrevious}
              disabled={!canGoPrevious}
              className="h-8 px-2 text-slate-400 hover:text-white disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4 rotate-180" />
            </Button>
            <Button
              onClick={onNext}
              size="sm"
              className="h-8 px-3 bg-blue-500/20 text-blue-300 hover:bg-blue-500/30"
            >
              {canGoNext ? (
                <>
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </>
              ) : (
                <>
                  Finish
                  <CheckCircle className="h-4 w-4 ml-1" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}