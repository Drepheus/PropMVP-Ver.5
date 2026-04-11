import { useState, useEffect, useRef } from "react";
import Sidebar from "@/components/sidebar";
import NavigationBar from "@/components/navigation-bar";
import PropertySearchForm from "@/components/property-search-form";
import PropertyDashboard from "@/components/property-dashboard";
import PropertyHeatmap from "@/components/property-heatmap";
import WorkflowProgress from "@/components/workflow-progress";
import CollapsibleSection from "@/components/collapsible-section";
import { PropertyWithDetails } from "@shared/schema";
import { 
  Search, 
  Menu, 
  X, 
  BarChart3, 
  Zap, 
  Calculator,
  Target,
  Home,
  DollarSign,
  TrendingUp,
  Eye,
  FileText,
  Download,
  MapPin,
  Calendar,
  Layers,
  StickyNote,
  Flag,
  Clock,
  RefreshCw,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import PropertyTriageView from "@/components/property-triage-view";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<PropertyWithDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [workflowVisible, setWorkflowVisible] = useState(false);
  const [location, setLocation] = useLocation();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const resultsRef = useRef<HTMLDivElement>(null);
  const [deepDiveOpen, setDeepDiveOpen] = useState(false);

  // ARV and Deal Analysis state
  const [arvEstimate, setArvEstimate] = useState(0);
  const [repairCosts, setRepairCosts] = useState(0);
  const [wholesaleFee, setWholesaleFee] = useState(10000);
  const [calculatedMAO, setCalculatedMAO] = useState(0);

  // Calculate MAO when inputs change
  useEffect(() => {
    if (arvEstimate > 0) {
      const mao = (arvEstimate * 0.7) - repairCosts - wholesaleFee;
      setCalculatedMAO(Math.max(0, mao));
    }
  }, [arvEstimate, repairCosts, wholesaleFee]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
      return;
    }
  }, [isAuthenticated, authLoading, toast]);

  // Apply dark theme on mount
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const handlePropertySelect = (property: PropertyWithDetails) => {
    setSelectedProperty(property);
    // Scroll to results after a brief delay to let the DOM render
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  };

  const handleLoadingChange = (loading: boolean) => {
    setIsLoading(loading);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Navigation Bar */}
      <NavigationBar onMenuClick={() => setSidebarOpen(true)} />
      
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="lg:pl-16 relative z-10">
        {/* Header */}
        <div className="max-w-7xl mx-auto space-y-8 p-8">
          
          {/* Workflow Progress Assistant */}
          <div className="fade-in">
            <WorkflowProgress 
              currentStep="property"
              marketResearched={true}
              propertySearched={selectedProperty !== null}
              propertyAnalyzed={arvEstimate > 0 && repairCosts > 0}
              leadAdded={false}
              isVisible={workflowVisible}
              onToggle={setWorkflowVisible}
            />
          </div>
          
          {/* Page Header */}
          <div className="text-center py-12">
            <h1 className="text-7xl font-black text-white mb-4 tracking-[-0.05em]">SEARCH & DECIDE</h1>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium leading-relaxed">
              High-speed real estate triage. Drop an address, get the signals, and decide in 60 seconds.
            </p>
            <div className="flex justify-center flex-wrap gap-4 mt-10">
              <Button variant="ghost" className="border border-slate-900 text-slate-400 hover:text-white hover:bg-slate-900 rounded-xl px-6 h-11">
                <Calculator className="h-4 w-4 mr-2" />
                ARV Calculator
              </Button>
              <Button variant="ghost" className="border border-slate-900 text-slate-400 hover:text-white hover:bg-slate-900 rounded-xl px-6 h-11">
                <Home className="h-4 w-4 mr-2" />
                Repair Estimator
              </Button>
              <Button variant="ghost" className="border border-slate-900 text-slate-400 hover:text-white hover:bg-slate-900 rounded-xl px-6 h-11">
                <Target className="h-4 w-4 mr-2" />
                MAO Calculator
              </Button>
              <Button variant="ghost" className="border border-slate-900 text-slate-400 hover:text-white hover:bg-slate-900 rounded-xl px-6 h-11">
                <Download className="h-4 w-4 mr-2" />
                Deal Analysis Report
              </Button>
            </div>
          </div>

          {/* Property Search */}
          <CollapsibleSection
            title="Property Search & Selection"
            description="Search and select a property to analyze for wholesaling potential"
            icon={Search}
            defaultExpanded={!selectedProperty}
          >
            <PropertySearchForm 
              onPropertySelect={handlePropertySelect} 
              onLoadingChange={handleLoadingChange}
            />
          </CollapsibleSection>


          {/* Property Assessment Tools - Only show if no property selected */}
          {!selectedProperty && !isLoading && (
            <div className="text-center text-slate-400 text-lg py-12">
              <div className="bg-[#050505] border border-slate-900 rounded-[2.5rem] p-16 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                   <Target className="h-64 w-64 -mr-20 -mt-20 text-emerald-500" />
                </div>
                
                <div className="flex justify-center mb-10 relative">
                  <div className="p-6 bg-emerald-500/10 rounded-3xl border border-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.1)]">
                    <Zap className="h-12 w-12 text-emerald-500 animate-pulse" />
                  </div>
                </div>
                
                <h2 className="text-4xl font-bold text-white mb-4 tracking-tight relative">Ready for Triage?</h2>
                <p className="max-w-xl mx-auto mb-12 text-slate-500 text-lg leading-relaxed relative">
                  Our intelligence engine pulls deep property data instantly. Search an address to see equity signals, owner details, and more.
                </p>
                
                <div className="flex justify-center flex-wrap gap-6 relative">
                  <div className="bg-black border border-slate-900 rounded-[2rem] p-8 w-64 transition-all hover:bg-slate-950 hover:border-emerald-500/30">
                    <TrendingUp className="h-8 w-8 text-emerald-500 mb-4" />
                    <h3 className="text-white font-bold text-base mb-1">Equity Signals</h3>
                    <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.2em]">Instant Math</p>
                  </div>
                  <div className="bg-black border border-slate-900 rounded-[2rem] p-8 w-64 transition-all hover:bg-slate-950 hover:border-blue-500/30">
                    <Users className="h-8 w-8 text-blue-500 mb-4" />
                    <h3 className="text-white font-bold text-base mb-1">Owner Identity</h3>
                    <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.2em]">Distress Signals</p>
                  </div>
                  <div className="bg-black border border-slate-900 rounded-[2rem] p-8 w-64 transition-all hover:bg-slate-950 hover:border-purple-500/30">
                    <Target className="h-8 w-8 text-purple-500 mb-4" />
                    <h3 className="text-white font-bold text-base mb-1">Lead Pipeline</h3>
                    <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.2em]">One-Click Claim</p>
                  </div>
                </div>
              </div>
            </div>
                  {selectedProperty && !isLoading && (
            <div ref={resultsRef} className="space-y-8 animate-in fade-in duration-700">
              {/* Triage View — full screen, clean, 60-second decision */}
              <PropertyTriageView 
                property={selectedProperty} 
                onSearchAgain={() => setSelectedProperty(null)}
                onDeepDive={() => setDeepDiveOpen(true)}
                arv={arvEstimate}
                mao={calculatedMAO}
                profit={wholesaleFee}
              />

              {/* Full Deep-Dive Analysis — right-side Sheet drawer */}
              <Sheet open={deepDiveOpen} onOpenChange={setDeepDiveOpen}>
                <SheetContent side="right" className="w-full sm:max-w-2xl lg:max-w-3xl bg-black border-slate-800 overflow-y-auto p-0">
                  <SheetHeader className="px-8 pt-8 pb-4 border-b border-slate-900">
                    <SheetTitle className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                      <div className="p-2 bg-blue-500/20 rounded-xl">
                        <BarChart3 className="h-5 w-5 text-blue-400" />
                      </div>
                      Full Deep-Dive Analysis
                    </SheetTitle>
                    <p className="text-sm text-slate-500">{selectedProperty.address}, {selectedProperty.city}, {selectedProperty.state}</p>
                  </SheetHeader>

                  <div className="p-8 space-y-8">
                    {/* ARV Analysis */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <Card className="bg-[#050505] border border-slate-900 rounded-[1.5rem] shadow-lg">
                        <CardHeader className="bg-blue-500/5 pb-4">
                          <CardTitle className="text-lg text-slate-200 flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-blue-400" />
                            ARV Analysis
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <Input 
                            type="number"
                            placeholder="Adjust ARV estimate"
                            value={arvEstimate || ''}
                            onChange={(e) => setArvEstimate(Number(e.target.value))}
                            className="bg-slate-800/50 border-slate-700 text-slate-100 mb-4"
                          />
                          <div className="text-3xl font-black text-emerald-400">${(arvEstimate || 0).toLocaleString()}</div>
                        </CardContent>
                      </Card>

                      <Card className="bg-[#050505] border border-slate-900 rounded-[1.5rem] shadow-lg">
                        <CardHeader className="bg-amber-500/5 pb-4">
                          <CardTitle className="text-lg text-slate-200 flex items-center gap-2">
                            <Home className="h-5 w-5 text-amber-400" />
                            Repair Costs
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <Input 
                            type="number"
                            placeholder="Estimate repairs"
                            value={repairCosts || ''}
                            onChange={(e) => setRepairCosts(Number(e.target.value))}
                            className="bg-slate-800/50 border-slate-700 text-slate-100 mb-4"
                          />
                          <div className="text-3xl font-black text-amber-400">${(repairCosts || 0).toLocaleString()}</div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* MAO Summary */}
                    <Card className="bg-[#050505] border border-slate-900 rounded-[1.5rem] p-6">
                      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="space-y-1">
                          <h3 className="text-slate-400 uppercase text-xs font-black tracking-widest">Recommended Max Offer</h3>
                          <div className="text-5xl font-black text-white tracking-tighter">${calculatedMAO.toLocaleString()}</div>
                          <p className="text-slate-500 text-sm">Based on 70% rule: ({arvEstimate} × 0.7) - {repairCosts} - {wholesaleFee}</p>
                        </div>
                        <div className="flex gap-4">
                           <Button 
                             className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-8 py-6 h-auto"
                             onClick={() => setLocation("/make-offer")}
                           >
                             <Target className="mr-2 h-5 w-5" />
                             GENERATE OFFER
                           </Button>
                        </div>
                      </div>
                    </Card>

                    <PropertyDashboard property={selectedProperty} />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
