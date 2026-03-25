import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import WorkflowProgress from "@/components/workflow-progress";
import CollapsibleSection from "@/components/collapsible-section";
import { 
  FileText, 
  Calculator, 
  DollarSign, 
  Calendar, 
  Send, 
  Crown, 
  Download,
  CheckCircle,
  Clock,
  AlertTriangle,
  Info,
  PenTool
} from "lucide-react";

export default function MakeOfferPage() {
  const [showWorkflow, setShowWorkflow] = useState(true);
  const [offerAmount, setOfferAmount] = useState("");
  const [earnestMoney, setEarnestMoney] = useState("1000");
  const [inspectionPeriod, setInspectionPeriod] = useState("10");
  const [closingDate, setClosingDate] = useState("");
  const [wholesaleFee, setWholesaleFee] = useState("10000");
  const [assignmentClause, setAssignmentClause] = useState(true);
  const [contractTemplate, setContractTemplate] = useState("standard");
  const [negotiationNotes, setNegotiationNotes] = useState("");
  const [offerStatus, setOfferStatus] = useState<'draft' | 'sent' | 'negotiating' | 'accepted' | 'rejected'>('draft');

  // Mock property data (would come from context/API)
  const propertyData = {
    address: "1234 Investment Dr, Phoenix, AZ 85001",
    arv: 250000,
    repairCosts: 35000,
    mao: 140000,
    recommendedOffer: 125000
  };

  const calculateOfferMetrics = () => {
    const offer = parseFloat(offerAmount) || 0;
    const wholesale = parseFloat(wholesaleFee) || 0;
    const repairs = propertyData.repairCosts;
    const arv = propertyData.arv;
    
    const totalInvestment = offer + repairs + wholesale;
    const profitMargin = arv - totalInvestment;
    const profitPercentage = arv > 0 ? (profitMargin / arv) * 100 : 0;
    const offerToARVRatio = arv > 0 ? (offer / arv) * 100 : 0;

    return {
      totalInvestment,
      profitMargin,
      profitPercentage,
      offerToARVRatio,
      isViableOffer: profitPercentage >= 15 && offerToARVRatio <= 70
    };
  };

  const metrics = calculateOfferMetrics();

  const generateContract = () => {
    // Contract generation logic would go here
    console.log("Generating contract with:", {
      offerAmount,
      earnestMoney,
      inspectionPeriod,
      closingDate,
      assignmentClause
    });
  };

  const sendOffer = () => {
    setOfferStatus('sent');
    // API call to send offer would go here
    console.log("Sending offer to seller");
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-black border-b border-slate-900 rounded-2xl mr-3">
              <FileText className="h-8 w-8 text-amber-400" />
            </div>
            <Badge className="bg-black border-b border-slate-900 text-amber-300 border-amber-500/30">
              <Crown className="h-4 w-4 mr-1" />
              PREMIUM FEATURE
            </Badge>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent mb-4">
            Make an Offer
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Present a cash offer based on your MAO calculation, with professional purchase agreements and assignment clauses
          </p>
        </div>

        {/* Workflow Progress */}
        {showWorkflow && (
          <div className="mb-8">
            <WorkflowProgress
              currentStep="offer"
              marketResearched={true}
              propertySearched={true}
              propertyAnalyzed={true}
              leadAdded={true}
              isPremium={true}
              isVisible={showWorkflow}
              onToggle={setShowWorkflow}
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Property Summary & Offer Calculator */}
          <div className="space-y-6">
            {/* Property Summary */}
            <Card className="bg-black border border-slate-900 rounded-[1.5rem] border-slate-700/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Calculator className="h-5 w-5 mr-2 text-emerald-400" />
                  Deal Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-slate-800/50 rounded-lg">
                  <p className="text-sm text-slate-400 mb-1">Property Address</p>
                  <p className="text-white font-medium">{propertyData.address}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-800/50 rounded-lg text-center">
                    <p className="text-xs text-slate-400 mb-1">ARV</p>
                    <p className="text-emerald-400 font-bold">${propertyData.arv.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-slate-800/50 rounded-lg text-center">
                    <p className="text-xs text-slate-400 mb-1">Repair Costs</p>
                    <p className="text-red-400 font-bold">${propertyData.repairCosts.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-slate-800/50 rounded-lg text-center">
                    <p className="text-xs text-slate-400 mb-1">MAO (70%)</p>
                    <p className="text-blue-400 font-bold">${propertyData.mao.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-slate-800/50 rounded-lg text-center">
                    <p className="text-xs text-slate-400 mb-1">Recommended</p>
                    <p className="text-amber-400 font-bold">${propertyData.recommendedOffer.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Offer Metrics */}
            <Card className="bg-black border border-slate-900 rounded-[1.5rem] border-slate-700/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-blue-400" />
                  Offer Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex justify-between items-center p-2 bg-slate-800/50 rounded">
                    <span className="text-slate-400">Offer to ARV Ratio</span>
                    <span className={`font-bold ${metrics.offerToARVRatio <= 70 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {metrics.offerToARVRatio.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-slate-800/50 rounded">
                    <span className="text-slate-400">Projected Profit</span>
                    <span className={`font-bold ${metrics.profitMargin > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      ${metrics.profitMargin.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-slate-800/50 rounded">
                    <span className="text-slate-400">Profit Margin</span>
                    <span className={`font-bold ${metrics.profitPercentage >= 15 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {metrics.profitPercentage.toFixed(1)}%
                    </span>
                  </div>
                </div>

                {metrics.isViableOffer ? (
                  <div className="flex items-center p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/30">
                    <CheckCircle className="h-4 w-4 text-emerald-400 mr-2" />
                    <span className="text-emerald-400 text-sm">Viable offer within guidelines</span>
                  </div>
                ) : (
                  <div className="flex items-center p-3 bg-red-500/10 rounded-lg border border-red-500/30">
                    <AlertTriangle className="h-4 w-4 text-red-400 mr-2" />
                    <span className="text-red-400 text-sm">Review offer - may be outside guidelines</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Center Column - Offer Form */}
          <div className="space-y-6">
            <CollapsibleSection
              title="Offer Details"
              description="Configure your purchase offer terms"
              icon={FileText}
            >
              <div className="space-y-4">
                <div>
                  <Label htmlFor="offerAmount" className="text-slate-200">Offer Amount *</Label>
                  <Input
                    id="offerAmount"
                    type="number"
                    placeholder="125000"
                    value={offerAmount}
                    onChange={(e) => setOfferAmount(e.target.value)}
                    className="bg-slate-800/50 border-slate-700/30 text-white"
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    Recommended: ${propertyData.recommendedOffer.toLocaleString()} (10-15% below MAO)
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="earnestMoney" className="text-slate-200">Earnest Money</Label>
                    <Input
                      id="earnestMoney"
                      type="number"
                      value={earnestMoney}
                      onChange={(e) => setEarnestMoney(e.target.value)}
                      className="bg-slate-800/50 border-slate-700/30 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="wholesaleFee" className="text-slate-200">Wholesale Fee</Label>
                    <Input
                      id="wholesaleFee"
                      type="number"
                      value={wholesaleFee}
                      onChange={(e) => setWholesaleFee(e.target.value)}
                      className="bg-slate-800/50 border-slate-700/30 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="inspectionPeriod" className="text-slate-200">Inspection Period (days)</Label>
                    <Input
                      id="inspectionPeriod"
                      type="number"
                      value={inspectionPeriod}
                      onChange={(e) => setInspectionPeriod(e.target.value)}
                      className="bg-slate-800/50 border-slate-700/30 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="closingDate" className="text-slate-200">Target Closing Date</Label>
                    <Input
                      id="closingDate"
                      type="date"
                      value={closingDate}
                      onChange={(e) => setClosingDate(e.target.value)}
                      className="bg-slate-800/50 border-slate-700/30 text-white"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="assignmentClause"
                    checked={assignmentClause}
                    onCheckedChange={setAssignmentClause}
                  />
                  <Label htmlFor="assignmentClause" className="text-slate-200">
                    Include Assignment Clause
                  </Label>
                  <Info className="h-4 w-4 text-slate-400" />
                </div>

                <div>
                  <Label htmlFor="contractTemplate" className="text-slate-200">Contract Template</Label>
                  <Select value={contractTemplate} onValueChange={setContractTemplate}>
                    <SelectTrigger className="bg-slate-800/50 border-slate-700/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="standard">Standard Purchase Agreement</SelectItem>
                      <SelectItem value="investor">Investor-Friendly Contract</SelectItem>
                      <SelectItem value="wholesale">Wholesale Assignment Contract</SelectItem>
                      <SelectItem value="custom">Custom Template</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CollapsibleSection>

            <CollapsibleSection
              title="Negotiation Strategy"
              description="Plan your negotiation approach"
              icon={PenTool}
            >
              <div className="space-y-4">
                <div>
                  <Label htmlFor="negotiationNotes" className="text-slate-200">Negotiation Notes</Label>
                  <Textarea
                    id="negotiationNotes"
                    placeholder="Add your negotiation strategy, seller motivations, and key talking points..."
                    value={negotiationNotes}
                    onChange={(e) => setNegotiationNotes(e.target.value)}
                    className="bg-slate-800/50 border-slate-700/30 text-white min-h-[100px]"
                  />
                </div>

                <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
                  <h4 className="text-blue-300 font-semibold mb-2">Negotiation Tips</h4>
                  <ul className="text-sm text-slate-300 space-y-1">
                    <li>• Emphasize cash offer and quick closing</li>
                    <li>• Highlight "as-is" purchase (no repairs needed)</li>
                    <li>• Mention flexible closing date if needed</li>
                    <li>• Be prepared for counteroffers</li>
                  </ul>
                </div>
              </div>
            </CollapsibleSection>
          </div>

          {/* Right Column - Contract Generation & Status */}
          <div className="space-y-6">
            <Card className="bg-black border border-slate-900 rounded-[1.5rem] border-slate-700/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-amber-400" />
                    Contract Status
                  </div>
                  <Badge 
                    className={`
                      ${offerStatus === 'draft' ? 'bg-slate-500/20 text-slate-400 border-slate-500/30' :
                        offerStatus === 'sent' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                        offerStatus === 'negotiating' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                        offerStatus === 'accepted' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                        'bg-red-500/20 text-red-400 border-red-500/30'
                      }
                    `}
                  >
                    {offerStatus === 'draft' && <Clock className="h-3 w-3 mr-1" />}
                    {offerStatus === 'accepted' && <CheckCircle className="h-3 w-3 mr-1" />}
                    {offerStatus.charAt(0).toUpperCase() + offerStatus.slice(1)}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Button
                    onClick={generateContract}
                    className="w-full btn-secondary-gradient"
                    disabled={!offerAmount}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Generate Contract
                  </Button>
                  
                  <Button
                    onClick={sendOffer}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold"
                    disabled={!offerAmount || offerStatus === 'sent'}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send Offer to Seller
                  </Button>
                </div>

                <div className="p-3 bg-slate-800/50 rounded-lg">
                  <h4 className="text-slate-200 font-medium mb-2">Contract Features</h4>
                  <ul className="text-sm text-slate-400 space-y-1">
                    <li>✓ Assignment clause included</li>
                    <li>✓ {inspectionPeriod}-day inspection period</li>
                    <li>✓ E-signature integration</li>
                    <li>✓ Automated document generation</li>
                  </ul>
                </div>

                {offerStatus === 'sent' && (
                  <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
                    <div className="flex items-center mb-2">
                      <Clock className="h-4 w-4 text-blue-400 mr-2" />
                      <span className="text-blue-400 font-medium">Offer Sent</span>
                    </div>
                    <p className="text-sm text-slate-300">
                      Your offer has been sent to the seller. Typical response time is 24-48 hours.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Integration Features */}
            <Card className="bg-black border border-slate-900 rounded-[1.5rem] border-slate-700/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Crown className="h-5 w-5 mr-2 text-amber-400" />
                  Premium Integrations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                  <h4 className="text-amber-300 font-medium mb-1">DocuSign Integration</h4>
                  <p className="text-xs text-slate-400">E-signature workflow for contracts</p>
                </div>
                <div className="p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                  <h4 className="text-emerald-300 font-medium mb-1">CRM Tracking</h4>
                  <p className="text-xs text-slate-400">Automatic negotiation logging</p>
                </div>
                <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <h4 className="text-blue-300 font-medium mb-1">Contract Templates</h4>
                  <p className="text-xs text-slate-400">State-specific purchase agreements</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}