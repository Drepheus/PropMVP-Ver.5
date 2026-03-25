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
  PenTool, 
  Shield, 
  DollarSign, 
  Calendar, 
  CheckCircle, 
  Crown, 
  Download,
  Upload,
  Clock,
  AlertTriangle,
  Info,
  FileCheck,
  Building,
  Users,
  Lock
} from "lucide-react";

export default function SecureContractPage() {
  const [showWorkflow, setShowWorkflow] = useState(true);
  const [contractStatus, setContractStatus] = useState<'negotiating' | 'reviewing' | 'signed' | 'executed'>('negotiating');
  const [titleStatus, setTitleStatus] = useState<'pending' | 'clear' | 'issues'>('pending');
  const [earnestMoneyPaid, setEarnestMoneyPaid] = useState(false);
  const [inspectionScheduled, setInspectionScheduled] = useState(false);
  const [assignmentRights, setAssignmentRights] = useState(true);
  const [closingDate, setClosingDate] = useState("");
  const [titleCompany, setTitleCompany] = useState("");
  const [escrowAmount, setEscrowAmount] = useState("1000");
  const [contractNotes, setContractNotes] = useState("");
  
  // Mock contract data
  const contractData = {
    propertyAddress: "1234 Investment Dr, Phoenix, AZ 85001",
    purchasePrice: 125000,
    earnestMoney: 1000,
    wholesaleFee: 10000,
    inspectionPeriod: 10,
    offerAcceptedDate: "2024-01-15",
    expectedClosing: "2024-02-15"
  };

  const checkTitleStatus = async () => {
    setTitleStatus('pending');
    // Simulate title check
    setTimeout(() => {
      setTitleStatus('clear');
    }, 2000);
  };

  const uploadSignedContract = () => {
    setContractStatus('signed');
    console.log("Contract uploaded and signed");
  };

  const executeContract = () => {
    setContractStatus('executed');
    console.log("Contract executed and stored");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'clear':
      case 'signed':
      case 'executed':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'pending':
      case 'reviewing':
      case 'negotiating':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'issues':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-black border-b border-slate-900 rounded-2xl mr-3">
              <PenTool className="h-8 w-8 text-amber-400" />
            </div>
            <Badge className="bg-black border-b border-slate-900 text-amber-300 border-amber-500/30">
              <Crown className="h-4 w-4 mr-1" />
              PREMIUM FEATURE
            </Badge>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent mb-4">
            Secure the Contract
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Execute legally binding purchase agreement with assignment rights and title verification
          </p>
        </div>

        {/* Workflow Progress */}
        {showWorkflow && (
          <div className="mb-8">
            <WorkflowProgress
              currentStep="contract"
              marketResearched={true}
              propertySearched={true}
              propertyAnalyzed={true}
              leadAdded={true}
              offerMade={true}
              isPremium={true}
              isVisible={showWorkflow}
              onToggle={setShowWorkflow}
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Contract Overview */}
          <div className="space-y-6">
            {/* Contract Summary */}
            <Card className="bg-black border border-slate-900 rounded-[1.5rem] border-slate-700/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <div className="flex items-center">
                    <FileCheck className="h-5 w-5 mr-2 text-emerald-400" />
                    Contract Overview
                  </div>
                  <Badge className={getStatusColor(contractStatus)}>
                    {contractStatus === 'executed' && <CheckCircle className="h-3 w-3 mr-1" />}
                    {contractStatus.charAt(0).toUpperCase() + contractStatus.slice(1)}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-slate-800/50 rounded-lg">
                  <p className="text-sm text-slate-400 mb-1">Property</p>
                  <p className="text-white font-medium">{contractData.propertyAddress}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-800/50 rounded-lg text-center">
                    <p className="text-xs text-slate-400 mb-1">Purchase Price</p>
                    <p className="text-emerald-400 font-bold">${contractData.purchasePrice.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-slate-800/50 rounded-lg text-center">
                    <p className="text-xs text-slate-400 mb-1">Earnest Money</p>
                    <p className="text-blue-400 font-bold">${contractData.earnestMoney.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-slate-800/50 rounded-lg text-center">
                    <p className="text-xs text-slate-400 mb-1">Inspection Period</p>
                    <p className="text-amber-400 font-bold">{contractData.inspectionPeriod} days</p>
                  </div>
                  <div className="p-3 bg-slate-800/50 rounded-lg text-center">
                    <p className="text-xs text-slate-400 mb-1">Wholesale Fee</p>
                    <p className="text-purple-400 font-bold">${contractData.wholesaleFee.toLocaleString()}</p>
                  </div>
                </div>

                <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
                  <div className="flex items-center mb-2">
                    <Info className="h-4 w-4 text-blue-400 mr-2" />
                    <span className="text-blue-400 font-medium">Assignment Clause</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    "Buyer reserves the right to assign this contract to another party prior to closing."
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card className="bg-black border border-slate-900 rounded-[1.5rem] border-slate-700/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-blue-400" />
                  Contract Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  <div>
                    <p className="text-slate-200 text-sm">Offer Accepted</p>
                    <p className="text-xs text-slate-400">{contractData.offerAcceptedDate}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className={`h-4 w-4 rounded-full ${earnestMoneyPaid ? 'bg-emerald-400' : 'bg-slate-600'}`}></div>
                  <div>
                    <p className="text-slate-200 text-sm">Earnest Money Paid</p>
                    <p className="text-xs text-slate-400">{earnestMoneyPaid ? 'Complete' : 'Pending'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className={`h-4 w-4 rounded-full ${contractStatus === 'signed' ? 'bg-emerald-400' : 'bg-slate-600'}`}></div>
                  <div>
                    <p className="text-slate-200 text-sm">Contract Signed</p>
                    <p className="text-xs text-slate-400">{contractStatus === 'signed' ? 'Complete' : 'In Progress'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className={`h-4 w-4 rounded-full ${titleStatus === 'clear' ? 'bg-emerald-400' : 'bg-slate-600'}`}></div>
                  <div>
                    <p className="text-slate-200 text-sm">Title Verification</p>
                    <p className="text-xs text-slate-400">{titleStatus === 'clear' ? 'Clear' : 'In Progress'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="h-4 w-4 rounded-full bg-slate-600"></div>
                  <div>
                    <p className="text-slate-200 text-sm">Expected Closing</p>
                    <p className="text-xs text-slate-400">{contractData.expectedClosing}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Center Column - Contract Management */}
          <div className="space-y-6">
            <CollapsibleSection
              title="Contract Execution"
              description="Sign and execute the purchase agreement"
              icon={PenTool}
            >
              <div className="space-y-4">
                <Tabs defaultValue="sign" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
                    <TabsTrigger value="sign">Sign Contract</TabsTrigger>
                    <TabsTrigger value="verify">Verify Terms</TabsTrigger>
                    <TabsTrigger value="store">Store Secure</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="sign" className="space-y-4">
                    <div className="p-4 bg-amber-500/10 rounded-lg border border-amber-500/30">
                      <h4 className="text-amber-300 font-medium mb-2">E-Signature Process</h4>
                      <p className="text-sm text-slate-300 mb-3">
                        Upload your signed contract or use our DocuSign integration for electronic signatures.
                      </p>
                      <div className="space-y-3">
                        <Button className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold" onClick={uploadSignedContract}>
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Signed Contract
                        </Button>
                        <Button variant="outline" className="w-full border-amber-500/30 text-amber-300">
                          <PenTool className="h-4 w-4 mr-2" />
                          Use DocuSign Integration
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="earnestMoney"
                        checked={earnestMoneyPaid}
                        onCheckedChange={setEarnestMoneyPaid}
                      />
                      <Label htmlFor="earnestMoney" className="text-slate-200">
                        Earnest Money Deposited
                      </Label>
                    </div>

                    <div>
                      <Label htmlFor="escrowAmount" className="text-slate-200">Escrow Amount</Label>
                      <Input
                        id="escrowAmount"
                        type="number"
                        value={escrowAmount}
                        onChange={(e) => setEscrowAmount(e.target.value)}
                        className="bg-slate-800/50 border-slate-700/30 text-white"
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="verify" className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                        <span className="text-slate-300">Purchase Price</span>
                        <span className="text-emerald-400 font-bold">${contractData.purchasePrice.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                        <span className="text-slate-300">Assignment Rights</span>
                        <CheckCircle className="h-4 w-4 text-emerald-400" />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                        <span className="text-slate-300">Inspection Period</span>
                        <span className="text-blue-400 font-bold">{contractData.inspectionPeriod} days</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                        <span className="text-slate-300">Earnest Money</span>
                        <span className="text-amber-400 font-bold">${contractData.earnestMoney.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/30">
                      <div className="flex items-center mb-2">
                        <CheckCircle className="h-4 w-4 text-emerald-400 mr-2" />
                        <span className="text-emerald-400 font-medium">Contract Verified</span>
                      </div>
                      <p className="text-xs text-slate-300">All terms match your offer and include assignment clause.</p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="store" className="space-y-4">
                    <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
                      <h4 className="text-blue-300 font-medium mb-2">Secure Storage</h4>
                      <p className="text-sm text-slate-300 mb-3">
                        Your contract will be stored securely in our cloud-based system with encryption.
                      </p>
                      <Button 
                        className="w-full btn-secondary-gradient" 
                        onClick={executeContract}
                        disabled={contractStatus !== 'signed'}
                      >
                        <Lock className="h-4 w-4 mr-2" />
                        Store Contract Securely
                      </Button>
                    </div>

                    <div>
                      <Label htmlFor="contractNotes" className="text-slate-200">Contract Notes</Label>
                      <Textarea
                        id="contractNotes"
                        placeholder="Add any important notes about the contract execution..."
                        value={contractNotes}
                        onChange={(e) => setContractNotes(e.target.value)}
                        className="bg-slate-800/50 border-slate-700/30 text-white"
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </CollapsibleSection>

            <CollapsibleSection
              title="Title Verification"
              description="Verify clear title and check for liens"
              icon={Shield}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Building className="h-5 w-5 text-blue-400" />
                    <div>
                      <p className="text-slate-200 font-medium">Title Status</p>
                      <p className="text-sm text-slate-400">Automated title search</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(titleStatus)}>
                    {titleStatus === 'clear' && <CheckCircle className="h-3 w-3 mr-1" />}
                    {titleStatus === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                    {titleStatus.charAt(0).toUpperCase() + titleStatus.slice(1)}
                  </Badge>
                </div>

                <div>
                  <Label htmlFor="titleCompany" className="text-slate-200">Title Company</Label>
                  <Select value={titleCompany} onValueChange={setTitleCompany}>
                    <SelectTrigger className="bg-slate-800/50 border-slate-700/30 text-white">
                      <SelectValue placeholder="Select title company" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="first-american">First American Title</SelectItem>
                      <SelectItem value="old-republic">Old Republic Title</SelectItem>
                      <SelectItem value="fidelity">Fidelity National Title</SelectItem>
                      <SelectItem value="chicago-title">Chicago Title</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={checkTitleStatus} 
                  className="w-full btn-secondary-gradient"
                  disabled={titleStatus === 'pending'}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  {titleStatus === 'pending' ? 'Checking Title...' : 'Verify Title Status'}
                </Button>

                {titleStatus === 'clear' && (
                  <div className="p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/30">
                    <div className="flex items-center mb-2">
                      <CheckCircle className="h-4 w-4 text-emerald-400 mr-2" />
                      <span className="text-emerald-400 font-medium">Clear Title Confirmed</span>
                    </div>
                    <ul className="text-xs text-slate-300 space-y-1">
                      <li>✓ No outstanding liens found</li>
                      <li>✓ Property taxes current</li>
                      <li>✓ No title defects identified</li>
                      <li>✓ Ready for closing</li>
                    </ul>
                  </div>
                )}
              </div>
            </CollapsibleSection>
          </div>

          {/* Right Column - Integration & Status */}
          <div className="space-y-6">
            <Card className="bg-black border border-slate-900 rounded-[1.5rem] border-slate-700/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Crown className="h-5 w-5 mr-2 text-amber-400" />
                  Premium Integrations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-amber-300 font-medium">DocuSign</h4>
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                  </div>
                  <p className="text-xs text-slate-400">E-signature platform integration</p>
                </div>
                <div className="p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-emerald-300 font-medium">Title Companies</h4>
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                  </div>
                  <p className="text-xs text-slate-400">Automated title search API</p>
                </div>
                <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-blue-300 font-medium">Secure Storage</h4>
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                  </div>
                  <p className="text-xs text-slate-400">Encrypted document vault</p>
                </div>
                <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-purple-300 font-medium">CRM Integration</h4>
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                  </div>
                  <p className="text-xs text-slate-400">Automatic contract tracking</p>
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card className="bg-black border border-slate-900 rounded-[1.5rem] border-slate-700/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Users className="h-5 w-5 mr-2 text-blue-400" />
                  Next Steps
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
                  <h4 className="text-blue-300 font-semibold mb-2">After Contract Execution</h4>
                  <ul className="text-sm text-slate-300 space-y-1">
                    <li>• Begin marketing to cash buyers</li>
                    <li>• Schedule property inspection</li>
                    <li>• Prepare assignment agreement</li>
                    <li>• Coordinate closing timeline</li>
                  </ul>
                </div>

                {contractStatus === 'executed' && (
                  <div className="p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/30">
                    <div className="flex items-center mb-2">
                      <CheckCircle className="h-4 w-4 text-emerald-400 mr-2" />
                      <span className="text-emerald-400 font-medium">Contract Secured!</span>
                    </div>
                    <p className="text-sm text-slate-300">
                      Your contract is now secured and stored. Ready to market to buyers!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Risk Management */}
            <Card className="bg-black border border-slate-900 rounded-[1.5rem] border-slate-700/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-red-400" />
                  Risk Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                  <h4 className="text-red-300 font-medium mb-1">Important Reminders</h4>
                  <ul className="text-xs text-slate-400 space-y-1">
                    <li>• Ensure assignment clause is included</li>
                    <li>• Keep earnest money deposits minimal</li>
                    <li>• Verify inspection period timeframes</li>
                    <li>• Confirm seller's legal capacity</li>
                  </ul>
                </div>
                
                <div className="p-3 bg-slate-800/50 rounded-lg">
                  <p className="text-xs text-slate-400 leading-relaxed">
                    <strong className="text-slate-300">Legal Disclaimer:</strong> This platform provides tools and templates for educational purposes. 
                    Always consult with qualified real estate attorneys and professionals before executing contracts.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}