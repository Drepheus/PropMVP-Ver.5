import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PropertyWithDetails } from "@shared/schema";
import NavigationBar from "@/components/navigation-bar";
import Sidebar from "@/components/sidebar";
import WorkflowProgress from "@/components/workflow-progress";
import CollapsibleSection from "@/components/collapsible-section";
import { useLocation } from "wouter";
import { 
  Users, 
  Phone, 
  Mail, 
  Calendar, 
  MapPin, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Filter,
  Download,
  Plus,
  Search,
  Star,
  MessageSquare,
  FileText,
  Activity,
  Target,
  Zap,
  Building,
  Home
} from "lucide-react";

// Lead Management data structure
const leadManagementData = {
  overview: {
    totalLeads: 1847,
    qualifiedLeads: 623,
    activeDeals: 89,
    closedDeals: 156,
    conversionRate: 8.4,
    avgDealValue: 12500
  },
  pipeline: [
    { stage: "New Leads", count: 847, value: 10587500, color: "bg-blue-500" },
    { stage: "Contacted", count: 456, value: 5700000, color: "bg-yellow-500" },
    { stage: "Qualified", count: 234, value: 2925000, color: "bg-orange-500" },
    { stage: "Under Contract", count: 89, value: 1112500, color: "bg-purple-500" },
    { stage: "Closed", count: 156, value: 1950000, color: "bg-emerald-500" }
  ],
  recentLeads: [
    {
      id: 1,
      property: "1234 Oak Street",
      owner: "Sarah Johnson",
      phone: "(555) 123-4567",
      email: "sarah.j@email.com",
      source: "Direct Mail",
      status: "qualified",
      priority: "high",
      motivation: "Foreclosure",
      equity: 145000,
      lastContact: "2 hours ago",
      nextAction: "Schedule appointment",
      estimatedValue: 325000,
      listPrice: 285000
    },
    {
      id: 2,
      property: "5678 Pine Avenue",
      owner: "Michael Chen",
      phone: "(555) 234-5678", 
      email: "m.chen@email.com",
      source: "Facebook Ads",
      status: "contacted",
      priority: "medium",
      motivation: "Divorce",
      equity: 89000,
      lastContact: "1 day ago",
      nextAction: "Follow up call",
      estimatedValue: 275000,
      listPrice: 245000
    },
    {
      id: 3,
      property: "9012 Elm Drive",
      owner: "Jennifer Martinez",
      phone: "(555) 345-6789",
      email: "jen.martinez@email.com", 
      source: "Cold Calling",
      status: "new",
      priority: "high",
      motivation: "Relocation",
      equity: 198000,
      lastContact: "Just now",
      nextAction: "Initial contact",
      estimatedValue: 425000,
      listPrice: 395000
    },
    {
      id: 4,
      property: "3456 Maple Lane",
      owner: "Robert Wilson",
      phone: "(555) 456-7890",
      email: "r.wilson@email.com",
      source: "Referral",
      status: "contract",
      priority: "high",
      motivation: "Financial Distress",
      equity: 67000,
      lastContact: "3 hours ago",
      nextAction: "Review contract",
      estimatedValue: 195000,
      listPrice: 165000
    },
    {
      id: 5,
      property: "7890 Cedar Court",
      owner: "Lisa Thompson",
      phone: "(555) 567-8901",
      email: "lisa.t@email.com",
      source: "Bandit Signs",
      status: "qualified",
      priority: "medium",
      motivation: "Inheritance",
      equity: 112000,
      lastContact: "5 hours ago",
      nextAction: "Send offer",
      estimatedValue: 285000,
      listPrice: 255000
    }
  ],
  leadSources: [
    { source: "Direct Mail", count: 456, cost: 12800, conversion: 12.5 },
    { source: "Facebook Ads", count: 234, cost: 8900, conversion: 15.2 },
    { source: "Cold Calling", count: 189, cost: 4500, conversion: 8.7 },
    { source: "Bandit Signs", count: 167, cost: 3200, conversion: 9.8 },
    { source: "Referrals", count: 123, cost: 0, conversion: 28.4 },
    { source: "SEO/Website", count: 98, cost: 2400, conversion: 18.9 }
  ],
  activities: [
    { id: 1, type: "call", lead: "Sarah Johnson", action: "Inbound call received", time: "10 minutes ago", result: "Scheduled appointment" },
    { id: 2, type: "email", lead: "Michael Chen", action: "Follow-up email sent", time: "2 hours ago", result: "Pending response" },
    { id: 3, type: "appointment", lead: "Jennifer Martinez", action: "Property visit scheduled", time: "4 hours ago", result: "Confirmed for tomorrow" },
    { id: 4, type: "contract", lead: "Robert Wilson", action: "Contract sent", time: "6 hours ago", result: "Under review" },
    { id: 5, type: "call", lead: "Lisa Thompson", action: "Outbound call made", time: "8 hours ago", result: "Left voicemail" }
  ],
  notifications: [
    { id: 1, type: "urgent", message: "3 leads need immediate follow-up", count: 3 },
    { id: 2, type: "reminder", message: "5 appointments scheduled today", count: 5 },
    { id: 3, type: "opportunity", message: "2 hot leads in pipeline", count: 2 },
    { id: 4, type: "contract", message: "4 contracts pending signature", count: 4 }
  ]
};

export default function LeadManagement() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [location, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("pipeline");
  const [workflowVisible, setWorkflowVisible] = useState(false);

  const { data: leads = [], isLoading } = useQuery<PropertyWithDetails[]>({
    queryKey: ["/api/leads"],
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'contacted':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'qualified':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'contract':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'closed':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'call':
        return <Phone className="h-4 w-4" />;
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'appointment':
        return <Calendar className="h-4 w-4" />;
      case 'contract':
        return <FileText className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Navigation Bar */}
      <NavigationBar onMenuClick={() => setSidebarOpen(true)} />
      
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="lg:pl-16 relative z-10">
        <div className="max-w-7xl mx-auto space-y-8 p-8">
        
        {/* Workflow Progress Assistant */}
        <div className="fade-in">
          <WorkflowProgress 
            currentStep="convert"
            marketResearched={true}
            propertySearched={true}
            propertyAnalyzed={true}
            leadAdded={true}
            isVisible={workflowVisible}
            onToggle={setWorkflowVisible}
          />
        </div>
        
        {/* Header */}
        <div className="text-center py-12">
          <h1 className="text-6xl font-black text-white mb-4 tracking-tighter">LEAD MANAGEMENT</h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium leading-relaxed">
            Comprehensive lead tracking, pipeline management, and conversion optimization for wholesale operations
          </p>
          <div className="flex justify-center gap-4 mt-10">
            <Button variant="ghost" className="border border-slate-900 text-slate-400 hover:text-white hover:bg-slate-900 rounded-xl px-6 h-11">
              <Plus className="h-4 w-4 mr-2" />
              Add Lead
            </Button>
            <Button variant="ghost" className="border border-slate-900 text-slate-400 hover:text-white hover:bg-slate-900 rounded-xl px-6 h-11">
              <Filter className="h-4 w-4 mr-2" />
              Filter Leads
            </Button>
            <Button variant="ghost" className="border border-slate-900 text-slate-400 hover:text-white hover:bg-slate-900 rounded-xl px-6 h-11">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>

        {/* Overview Metrics */}
        <CollapsibleSection
          title="Lead Overview"
          description="Key metrics and performance indicators"
          icon={Activity}
          defaultExpanded={true}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          <Card className="bg-[#050505] border-slate-900 rounded-2xl overflow-hidden shadow-xl border-[0.5px]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium uppercase tracking-wide">Total Leads</p>
                  <p className="text-3xl font-bold text-white mt-1">{formatNumber(leadManagementData.overview.totalLeads)}</p>
                </div>
                <div className="p-3 bg-blue-500/20 rounded-xl">
                  <Users className="h-6 w-6 text-blue-400" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-blue-400 text-sm">All time</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#050505] border-slate-900 rounded-2xl overflow-hidden shadow-xl border-[0.5px]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium uppercase tracking-wide">Qualified</p>
                  <p className="text-3xl font-bold text-white mt-1">{formatNumber(leadManagementData.overview.qualifiedLeads)}</p>
                </div>
                <div className="p-3 bg-emerald-500/20 rounded-xl">
                  <CheckCircle className="h-6 w-6 text-emerald-400" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-emerald-400 text-sm">Ready to move</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#050505] border-slate-900 rounded-2xl overflow-hidden shadow-xl border-[0.5px]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium uppercase tracking-wide">Active Deals</p>
                  <p className="text-3xl font-bold text-white mt-1">{leadManagementData.overview.activeDeals}</p>
                </div>
                <div className="p-3 bg-purple-500/20 rounded-xl">
                  <Target className="h-6 w-6 text-purple-400" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-purple-400 text-sm">In progress</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#050505] border-slate-900 rounded-2xl overflow-hidden shadow-xl border-[0.5px]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium uppercase tracking-wide">Closed Deals</p>
                  <p className="text-3xl font-bold text-white mt-1">{leadManagementData.overview.closedDeals}</p>
                </div>
                <div className="p-3 bg-yellow-500/20 rounded-xl">
                  <Star className="h-6 w-6 text-yellow-400" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-yellow-400 text-sm">This month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#050505] border-slate-900 rounded-2xl overflow-hidden shadow-xl border-[0.5px]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium uppercase tracking-wide">Conversion Rate</p>
                  <p className="text-3xl font-bold text-white mt-1">{leadManagementData.overview.conversionRate}%</p>
                </div>
                <div className="p-3 bg-orange-500/20 rounded-xl">
                  <TrendingUp className="h-6 w-6 text-orange-400" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-orange-400 text-sm">Lead to close</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#050505] border-slate-900 rounded-2xl overflow-hidden shadow-xl border-[0.5px]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium uppercase tracking-wide">Avg Deal Value</p>
                  <p className="text-3xl font-bold text-white mt-1">{formatCurrency(leadManagementData.overview.avgDealValue)}</p>
                </div>
                <div className="p-3 bg-red-500/20 rounded-xl">
                  <DollarSign className="h-6 w-6 text-red-400" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-red-400 text-sm">Assignment fee</span>
              </div>
            </CardContent>
          </Card>
          </div>
        </CollapsibleSection>

        {/* Pipeline Visualization */}
        <CollapsibleSection
          title="Deal Pipeline"
          description="Visual pipeline tracking and deal flow analysis"
          icon={Activity}
          defaultExpanded={false}
        >
          <Card className="bg-black border border-slate-900 rounded-[1.5rem] shadow-lg overflow-hidden">
          <CardHeader className="bg-black border-b border-slate-900 pb-6">
            <CardTitle className="flex items-center justify-between text-slate-100 text-2xl">
              Deal Pipeline
              <div className="p-2 bg-indigo-500/20 rounded-xl">
                <Activity className="h-6 w-6 text-indigo-400" />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {leadManagementData.pipeline.map((stage, index) => (
                <div key={index} className="bg-black border border-slate-900 rounded-[1.5rem] p-6 text-center">
                  <div className={`w-4 h-4 ${stage.color} rounded-full mx-auto mb-3`}></div>
                  <h3 className="text-slate-200 font-semibold mb-2">{stage.stage}</h3>
                  <div className="text-2xl font-bold text-white mb-1">{stage.count}</div>
                  <div className="text-slate-400 text-sm mb-3">leads</div>
                  <div className="text-slate-300 font-medium">{formatCurrency(stage.value)}</div>
                  <div className="text-slate-500 text-xs">pipeline value</div>
                </div>
              ))}
            </div>
          </CardContent>
          </Card>
        </CollapsibleSection>

        {/* Lead Management Sections */}
        <CollapsibleSection
          title="Lead Management & Activity"
          description="Detailed lead tracking, sources, and activity monitoring"
          icon={Users}
          defaultExpanded={false}
        >
          <Tabs defaultValue="leads" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-black border border-slate-900 rounded-[1.5rem]">
            <TabsTrigger value="leads" className="rounded-xl">Recent Leads</TabsTrigger>
            <TabsTrigger value="sources" className="rounded-xl">Lead Sources</TabsTrigger>
            <TabsTrigger value="activity" className="rounded-xl">Recent Activity</TabsTrigger>
            <TabsTrigger value="notifications" className="rounded-xl">Notifications</TabsTrigger>
          </TabsList>

          {/* Recent Leads Tab */}
          <TabsContent value="leads">
            <Card className="bg-black border border-slate-900 rounded-[1.5rem] shadow-lg overflow-hidden" data-tour="add-lead">
              <CardHeader className="bg-black border-b border-slate-900 pb-6">
                <CardTitle className="flex items-center justify-between text-slate-100 text-2xl">
                  Recent Leads
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="bg-black border border-slate-900 rounded-[1.5rem]">
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </Button>
                    <div className="p-2 bg-emerald-500/20 rounded-xl">
                      <Users className="h-6 w-6 text-emerald-400" />
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-black">
                      <tr>
                        <th className="px-6 py-4 text-left text-slate-500 font-black text-[10px] uppercase tracking-[0.2em] border-b border-slate-900">Property & Owner</th>
                        <th className="px-6 py-4 text-left text-slate-500 font-black text-[10px] uppercase tracking-[0.2em] border-b border-slate-900">Contact Info</th>
                        <th className="px-6 py-4 text-center text-slate-500 font-black text-[10px] uppercase tracking-[0.2em] border-b border-slate-900">Status</th>
                        <th className="px-6 py-4 text-center text-slate-500 font-black text-[10px] uppercase tracking-[0.2em] border-b border-slate-900">Priority</th>
                        <th className="px-6 py-4 text-right text-slate-500 font-black text-[10px] uppercase tracking-[0.2em] border-b border-slate-900">Value/Equity</th>
                        <th className="px-6 py-4 text-left text-slate-500 font-black text-[10px] uppercase tracking-[0.2em] border-b border-slate-900">Next Action</th>
                        <th className="px-6 py-4 text-center text-slate-500 font-black text-[10px] uppercase tracking-[0.2em] border-b border-slate-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoading ? (
                        <tr><td colSpan={7} className="text-center py-10 text-slate-500">Loading your deals...</td></tr>
                      ) : leads.length === 0 ? (
                        <tr><td colSpan={7} className="text-center py-10 text-slate-500">No deals claimed yet. Go to Search & Decide to find your next deal!</td></tr>
                      ) : leads.map((property) => (
                        <tr key={property.id} className="border-t border-slate-700/50 hover:bg-slate-800/30 transition-colors">
                          <td className="px-6 py-4">
                            <div>
                              <div className="font-semibold text-slate-200">{property.address}</div>
                              <div className="text-sm text-slate-400">{property.ownerName || "Unknown Owner"}</div>
                              <div className="text-xs text-slate-500 mt-1">{property.propertyType} • {property.investorType}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <div className="flex items-center text-sm text-slate-300 italic">
                                Contact hidden (requires skip tracing)
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <Badge className={`${getStatusColor(property.currentLead?.status?.toLowerCase() || 'new')} border`}>
                              {property.currentLead?.status || "New"}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <Badge className={`${property.equityPercent! > 50 ? getPriorityColor('high') : getPriorityColor('medium')} border`}>
                              {property.equityPercent! > 50 ? 'HIGH' : 'NORMAL'}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="text-slate-200 font-medium">${parseFloat(property.estimatedValue || "0").toLocaleString()}</div>
                            <div className="text-sm text-emerald-400">${parseFloat(property.equity || "0").toLocaleString()} equity</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-slate-200 text-sm truncate max-w-[150px]">{property.currentLead?.notes || "No notes yet"}</div>
                            <div className="text-xs text-slate-400 mt-1">Claimed: {new Date(property.currentLead?.claimedAt!).toLocaleDateString()}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <Button size="sm" variant="ghost" className="bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-black border border-emerald-500/20 transition-colors" title="Make Offer" onClick={() => setLocation("/make-offer")}>
                                <DollarSign className="h-4 w-4 mr-1" />
                                Offer
                              </Button>
                              <Button size="sm" variant="ghost" title="View Details" className="bg-slate-900 border border-slate-800 text-slate-400 hover:text-white" onClick={() => setLocation(`/property-search?id=${property.id}`)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Lead Sources Tab */}
          <TabsContent value="sources">
            <Card className="bg-black border border-slate-900 rounded-[1.5rem] shadow-lg overflow-hidden">
              <CardHeader className="bg-black border-b border-slate-900 pb-6">
                <CardTitle className="flex items-center justify-between text-slate-100 text-2xl">
                  Lead Source Performance
                  <div className="p-2 bg-blue-500/20 rounded-xl">
                    <Target className="h-6 w-6 text-blue-400" />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {leadManagementData.leadSources.map((source, index) => (
                    <div key={index} className="bg-black border border-slate-900 rounded-[1.5rem] p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-slate-200 font-semibold">{source.source}</h3>
                        <div className="text-2xl font-bold text-white">{source.count}</div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-slate-400 text-sm">Cost</span>
                          <span className="text-slate-200">{formatCurrency(source.cost)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400 text-sm">Conversion</span>
                          <span className="text-emerald-400 font-medium">{source.conversion}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400 text-sm">Cost per Lead</span>
                          <span className="text-slate-200">
                            {source.cost > 0 ? formatCurrency(source.cost / source.count) : 'Free'}
                          </span>
                        </div>
                      </div>
                      <Progress 
                        value={source.conversion} 
                        className="mt-4 h-2 bg-slate-700"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recent Activity Tab */}
          <TabsContent value="activity">
            <Card className="bg-black border border-slate-900 rounded-[1.5rem] shadow-lg overflow-hidden">
              <CardHeader className="bg-black border-b border-slate-900 pb-6">
                <CardTitle className="flex items-center justify-between text-slate-100 text-2xl">
                  Recent Activity
                  <div className="p-2 bg-purple-500/20 rounded-xl">
                    <Clock className="h-6 w-6 text-purple-400" />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {leadManagementData.activities.map((activity) => (
                    <div key={activity.id} className="bg-black border border-slate-900 rounded-[1.5rem] p-4 flex items-center gap-4">
                      <div className="p-2 bg-slate-700/50 rounded-lg text-slate-400">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-200 font-medium">{activity.lead}</span>
                          <span className="text-slate-400 text-sm">{activity.time}</span>
                        </div>
                        <div className="text-slate-400 text-sm mt-1">{activity.action}</div>
                        <div className="text-slate-300 text-sm mt-1 font-medium">{activity.result}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card className="bg-black border border-slate-900 rounded-[1.5rem] shadow-lg overflow-hidden">
              <CardHeader className="bg-black border-b border-slate-900 pb-6">
                <CardTitle className="flex items-center justify-between text-slate-100 text-2xl">
                  Notifications & Alerts
                  <div className="p-2 bg-red-500/20 rounded-xl">
                    <AlertCircle className="h-6 w-6 text-red-400" />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {leadManagementData.notifications.map((notification) => (
                    <div key={notification.id} className="bg-black border border-slate-900 rounded-[1.5rem] p-6 flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${
                        notification.type === 'urgent' ? 'bg-red-500/20' :
                        notification.type === 'reminder' ? 'bg-yellow-500/20' :
                        notification.type === 'opportunity' ? 'bg-emerald-500/20' :
                        'bg-blue-500/20'
                      }`}>
                        {notification.type === 'urgent' && <AlertCircle className="h-6 w-6 text-red-400" />}
                        {notification.type === 'reminder' && <Clock className="h-6 w-6 text-yellow-400" />}
                        {notification.type === 'opportunity' && <Zap className="h-6 w-6 text-emerald-400" />}
                        {notification.type === 'contract' && <FileText className="h-6 w-6 text-blue-400" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-200 font-medium">{notification.message}</span>
                          <Badge className={`${
                            notification.type === 'urgent' ? 'bg-red-500/20 text-red-400' :
                            notification.type === 'reminder' ? 'bg-yellow-500/20 text-yellow-400' :
                            notification.type === 'opportunity' ? 'bg-emerald-500/20 text-emerald-400' :
                            'bg-blue-500/20 text-blue-400'
                          } border-0`}>
                            {notification.count}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          </Tabs>
        </CollapsibleSection>

        </div>
      </div>
    </div>
  );
}