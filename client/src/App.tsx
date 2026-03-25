import { Switch, Route, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import MiniWorkflowAssistant from "@/components/mini-workflow-assistant";
import { useMiniWorkflow } from "@/hooks/useMiniWorkflow";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import AnalyticsDashboard from "@/pages/analytics-dashboard";
import MarketIntelligence from "@/pages/market-intelligence";
import LeadManagement from "@/pages/lead-management";
import MakeOfferPage from "@/pages/make-offer";
import SecureContractPage from "@/pages/secure-contract";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();
  const [location] = useLocation();
  const { 
    miniWorkflowEnabled, 
    workflowState, 
    updateWorkflowState, 
    toggleMiniWorkflow 
  } = useMiniWorkflow();

  // Determine current step based on route
  const getCurrentStep = () => {
    if (location === "/" || location.includes("market-intelligence")) return "market";
    if (location.includes("property-search")) return "search";
    if (location.includes("analytics")) return "analysis";
    if (location.includes("lead-management")) return "leads";
    return "market";
  };

  // Show loading spinner briefly, then show landing page for unauthenticated users
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Switch>
        {!isAuthenticated ? (
          <Route path="/" component={Landing} />
        ) : (
          <>
            <Route path="/" component={MarketIntelligence} />
            <Route path="/market-intelligence" component={MarketIntelligence} />
            <Route path="/property-search" component={Dashboard} />
            <Route path="/analytics" component={AnalyticsDashboard} />
            <Route path="/lead-management" component={LeadManagement} />
            <Route path="/make-offer" component={MakeOfferPage} />
            <Route path="/secure-contract" component={SecureContractPage} />
          </>
        )}
        <Route component={NotFound} />
      </Switch>

      {/* Mini Workflow Assistant - Always available when authenticated */}
      {isAuthenticated && (
        <MiniWorkflowAssistant
          currentStep={getCurrentStep()}
          marketResearched={workflowState.marketResearched}
          propertySearched={workflowState.propertySearched}
          propertyAnalyzed={workflowState.propertyAnalyzed}
          leadAdded={workflowState.leadAdded}
          isVisible={miniWorkflowEnabled}
          onToggle={toggleMiniWorkflow}
          onStepClick={(step) => {
            // Update workflow state when user interacts with steps
            if (step === "market") updateWorkflowState({ marketResearched: true });
            if (step === "search") updateWorkflowState({ propertySearched: true });
            if (step === "analysis") updateWorkflowState({ propertyAnalyzed: true });
            if (step === "leads") updateWorkflowState({ leadAdded: true });
          }}
        />
      )}
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
