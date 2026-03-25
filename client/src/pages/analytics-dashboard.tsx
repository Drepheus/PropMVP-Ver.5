import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useLocation } from "wouter";
import Sidebar from "@/components/sidebar";
import NavigationBar from "@/components/navigation-bar";
import AIAnalysis from "@/components/ai-analysis";
import WorkflowProgress from "@/components/workflow-progress";
import CollapsibleSection from "@/components/collapsible-section";
import type { PropertyWithDetails } from "@shared/schema";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Home, 
  Users, 
  Target,
  Calendar,
  MapPin,
  BarChart3,
  PieChart,
  Activity,
  Clock,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Eye,
  Phone,
  Mail,
  ArrowLeft,
  Menu,
  Search
} from "lucide-react";

// Mock data for the dashboard - in a real app, this would come from APIs
const mockDashboardData = {
  overview: {
    totalLeads: 1247,
    activeProperties: 89,
    dealsPending: 23,
    monthlyRevenue: 284750,
    conversionRate: 18.5,
    avgDealSize: 47800
  },
  // Sample property for comprehensive analysis
  featuredProperty: {
    // Location & Property Basics
    fullAddress: "1234 Maple Street, Atlanta, GA 30309",
    county: "Fulton County",
    beds: 3,
    baths: 2,
    squareFootage: 1850,
    lotSize: "0.25 acres",
    yearBuilt: 1985,
    propertyType: "Single Family Home",
    
    // Motivation & Distress Indicators
    ownerOccupancy: "Absentee Owner",
    lastSaleDate: "2019-03-15",
    lastSalePrice: 145000,
    mortgageBalance: 98000,
    taxDelinquency: "Current",
    foreclosureStatus: "None",
    codeViolations: 2,
    vacancyStatus: "Likely Vacant",
    
    // Valuation & Deal Analysis
    estimatedMarketValue: 225000,
    arvEstimate: 275000,
    rentalEstimate: 1850,
    estimatedEquity: 127000,
    
    // Market Data for Dispo
    avgDaysOnMarket: 45,
    pricePerSqFt: 122,
    appreciationTrend: "+8.2%",
    floodZone: "No",
    
    // Comparable Sales
    recentComps: [
      { address: "1240 Maple St", price: 235000, distance: "0.1 mi", dom: 32, sqft: 1900 },
      { address: "1156 Oak Ave", price: 218000, distance: "0.3 mi", dom: 28, sqft: 1780 },
      { address: "1301 Pine Dr", price: 242000, distance: "0.2 mi", dom: 41, sqft: 1920 }
    ],
    
    // Active Competition
    activeListings: [
      { address: "1267 Maple St", price: 249000, distance: "0.2 mi", dom: 15, sqft: 1875 },
      { address: "1145 Elm St", price: 239000, distance: "0.4 mi", dom: 22, sqft: 1820 }
    ]
  },
  recentActivity: [
    { id: 1, type: "lead", address: "1234 Oak Street", status: "qualified", time: "2 hours ago", priority: "high" },
    { id: 2, type: "deal", address: "5678 Pine Avenue", status: "contract", time: "4 hours ago", priority: "medium" },
    { id: 3, type: "contact", address: "9012 Elm Drive", status: "contacted", time: "6 hours ago", priority: "low" },
    { id: 4, type: "analysis", address: "3456 Maple Lane", status: "analyzed", time: "8 hours ago", priority: "medium" }
  ],
  marketTrends: {
    priceAppreciation: 12.3,
    daysOnMarket: 28,
    inventoryLevel: 2.8,
    demandIndex: 87
  },
  topMarkets: [
    { city: "Los Angeles", deals: 45, roi: 23.5, trend: "up" },
    { city: "San Diego", deals: 32, roi: 19.8, trend: "up" },
    { city: "Orange County", deals: 28, roi: 21.2, trend: "down" },
    { city: "Riverside", deals: 15, roi: 18.7, trend: "up" }
  ],
  pipeline: [
    { stage: "Leads", count: 156, value: 7450000 },
    { stage: "Qualified", count: 89, value: 4250000 },
    { stage: "Analysis", count: 34, value: 1620000 },
    { stage: "Contract", count: 12, value: 574000 }
  ]
};

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState("30d");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>("");
  const [workflowVisible, setWorkflowVisible] = useState(false);
  const [location, setLocation] = useLocation();

  // Fetch all properties that have been searched
  const { data: properties, isLoading: propertiesLoading } = useQuery<PropertyWithDetails[]>({
    queryKey: ['/api/properties'],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch detailed data for selected property
  const { data: selectedProperty, isLoading: propertyLoading } = useQuery<PropertyWithDetails>({
    queryKey: ['/api/properties', selectedPropertyId],
    enabled: !!selectedPropertyId,
    staleTime: 5 * 60 * 1000,
  });

  // Auto-select first property if none selected
  useEffect(() => {
    if (properties && Array.isArray(properties) && properties.length > 0 && !selectedPropertyId) {
      setSelectedPropertyId(properties[0].id.toString());
    }
  }, [properties, selectedPropertyId]);

  // Apply dark theme
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', { notation: 'compact' }).format(num);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Navigation Bar */}
      <NavigationBar onMenuClick={() => setSidebarOpen(true)} />
      
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="lg:pl-16 relative z-10">
        {/* Top bar */}
        <header className="h-18 bg-[#050505] border border-slate-900 border-b border-slate-700/30 flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-slate-400 hover:text-white transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              onClick={() => setLocation("/")}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Property Search
            </Button>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Property Selection */}
            <Select value={selectedPropertyId} onValueChange={setSelectedPropertyId}>
              <SelectTrigger className="w-80 bg-slate-800/50 text-slate-200 border-slate-600 rounded-xl">
                <SelectValue placeholder="Select property to analyze" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                {properties && Array.isArray(properties) ? properties.map((property: PropertyWithDetails) => (
                  <SelectItem key={property.id} value={property.id.toString()}>
                    {property.address}, {property.city}, {property.state}
                  </SelectItem>
                )) : (
                  <SelectItem value="no-properties" disabled>No properties found</SelectItem>
                )}
              </SelectContent>
            </Select>
            
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value)}
              className="modern-input bg-slate-800/50 text-slate-200 rounded-xl px-4 py-2"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <Button className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold">
              <Activity className="mr-2 h-4 w-4" />
              Live Data
            </Button>
          </div>
        </header>

        <div className="p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* Workflow Progress Assistant */}
            <div className="fade-in">
              <WorkflowProgress 
                currentStep="analyze"
                marketResearched={true}
                propertySearched={properties && Array.isArray(properties) && properties.length > 0}
                propertyAnalyzed={!!selectedProperty}
                leadAdded={false}
                isVisible={workflowVisible}
                onToggle={setWorkflowVisible}
              />
            </div>

            {/* Header */}
            <div className="text-center">
              <h1 className="text-5xl font-bold text-white mb-4">Wholesaler Command Center</h1>
              <p className="text-slate-400 text-xl max-w-3xl mx-auto">
                Advanced analytics, market intelligence, and real-time insights for professional wholesalers
              </p>
            </div>

            {/* Loading and Empty States */}
            {propertiesLoading && (
              <Alert className="bg-slate-800/50 border-slate-600">
                <Activity className="h-4 w-4" />
                <AlertDescription>Loading properties...</AlertDescription>
              </Alert>
            )}

            {!propertiesLoading && (!properties || !Array.isArray(properties) || properties.length === 0) && (
              <Alert className="bg-slate-800/50 border-slate-600">
                <Target className="h-4 w-4" />
                <AlertDescription>
                  No properties found. Go to the Property Search page to search for properties first.
                </AlertDescription>
              </Alert>
            )}

            {propertyLoading && selectedPropertyId && (
              <Alert className="bg-slate-800/50 border-slate-600">
                <Activity className="h-4 w-4" />
                <AlertDescription>Loading property analysis...</AlertDescription>
              </Alert>
            )}

            {/* Property Analysis - Only show when property is selected and loaded */}
            {selectedProperty && !propertyLoading && (
              <div className="space-y-6">
                
                {/* Property Overview */}
                <CollapsibleSection
                  title={`Property Overview: ${selectedProperty.address}`}
                  description="Basic property information and key metrics"
                  icon={Target}
                  badge="Selected"
                  defaultExpanded={true}
                  className="bg-[#050505] border border-slate-900 shadow-lg "
                  headerClassName="bg-black border-b border-slate-900"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
                  
                  {/* Location & Property Basics */}
                  <div className="bg-[#050505] border border-slate-900 rounded-2xl p-6">
                    <div className="flex items-center mb-4">
                      <MapPin className="h-5 w-5 text-blue-400 mr-2" />
                      <h3 className="text-lg font-semibold text-slate-200">Location & Property Basics</h3>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-slate-400 text-sm">Full Address</p>
                        <p className="text-slate-200 font-medium">{selectedProperty.address}, {selectedProperty.city}, {selectedProperty.state} {selectedProperty.zipCode}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Property Type</p>
                        <p className="text-slate-200">{selectedProperty.propertyType || 'N/A'}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-slate-400 text-sm">Beds/Baths</p>
                          <p className="text-slate-200">{selectedProperty.beds || 0}/{selectedProperty.baths || '0'}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-sm">Year Built</p>
                          <p className="text-slate-200">{selectedProperty.yearBuilt || 'N/A'}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Square Footage</p>
                        <p className="text-slate-200">{selectedProperty.sqft ? selectedProperty.sqft.toLocaleString() : 'N/A'} sq ft</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Lot Size</p>
                        <p className="text-slate-200">{selectedProperty.lotSize || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Listing Status</p>
                        <p className="text-slate-200">{selectedProperty.listingStatus || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Motivation & Distress Indicators */}
                  <div className="bg-[#050505] border border-slate-900 rounded-2xl p-6">
                    <div className="flex items-center mb-4">
                      <Zap className="h-5 w-5 text-amber-400 mr-2" />
                      <h3 className="text-lg font-semibold text-slate-200">Motivation & Distress</h3>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-slate-400 text-sm">Days on Market</p>
                        <div className="flex items-center">
                          <p className="text-slate-200">{selectedProperty.daysOnMarket || 0} days</p>
                          {(selectedProperty.daysOnMarket || 0) > 60 ? (
                            <span className="ml-2 px-2 py-1 bg-amber-500/20 text-amber-400 text-xs rounded-full">High Motivation</span>
                          ) : (selectedProperty.daysOnMarket || 0) > 30 ? (
                            <span className="ml-2 px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">Moderate</span>
                          ) : (
                            <span className="ml-2 px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">Fresh</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Last Sale</p>
                        <p className="text-slate-200">{selectedProperty.lastSaleDate !== 'N/A' ? selectedProperty.lastSaleDate : 'No recent sale'} - {selectedProperty.lastSalePrice !== '0.00' ? `$${parseInt(selectedProperty.lastSalePrice || '0').toLocaleString()}` : 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Current List Price</p>
                        <p className="text-slate-200">{selectedProperty.listPrice !== '0' ? `$${parseInt(selectedProperty.listPrice || '0').toLocaleString()}` : 'Not listed'}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Price Per Sq Ft</p>
                        <div className="flex items-center">
                          <p className="text-slate-200">${selectedProperty.pricePerSqft || '0'}/sq ft</p>
                          {parseInt(selectedProperty.pricePerSqft || '0') > 300 ? (
                            <span className="ml-2 px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">High</span>
                          ) : parseInt(selectedProperty.pricePerSqft || '0') > 200 ? (
                            <span className="ml-2 px-2 py-1 bg-amber-500/20 text-amber-400 text-xs rounded-full">Moderate</span>
                          ) : (
                            <span className="ml-2 px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">Good Value</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Property Features</p>
                        <div className="flex items-center space-x-2">
                          {selectedProperty.hasPool && (
                            <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">Pool</span>
                          )}
                          {selectedProperty.parking !== 'N/A' && (
                            <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">Parking</span>
                          )}
                          {selectedProperty.hoaFees !== '0.00' && (
                            <span className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs rounded-full">HOA</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Market Position</p>
                        <div className="flex items-center">
                          <p className="text-slate-200">{selectedProperty.listingStatus}</p>
                          {selectedProperty.listingStatus === 'Property Valued' ? (
                            <span className="ml-2 px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">Analyzed</span>
                          ) : (
                            <span className="ml-2 px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">Available</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Valuation & Deal Analysis */}
                  <div className="bg-[#050505] border border-slate-900 rounded-2xl p-6">
                    <div className="flex items-center mb-4">
                      <DollarSign className="h-5 w-5 text-emerald-400 mr-2" />
                      <h3 className="text-lg font-semibold text-slate-200">Valuation & Deal Analysis</h3>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-slate-400 text-sm">Current List Price</p>
                        <p className="text-2xl font-bold text-white">
                          {selectedProperty.listPrice !== '0' ? `$${parseInt(selectedProperty.listPrice).toLocaleString()}` : 'Not Listed'}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Last Sale Price</p>
                        <p className="text-xl font-semibold text-emerald-400">
                          {selectedProperty.lastSalePrice !== '0.00' ? `$${parseInt(selectedProperty.lastSalePrice).toLocaleString()}` : 'No recent sale'}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Price Per Sq Ft</p>
                        <p className="text-slate-200">${selectedProperty.pricePerSqft}/sq ft</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Total Square Footage</p>
                        <p className="text-xl font-semibold text-blue-400">{selectedProperty.sqft ? selectedProperty.sqft.toLocaleString() : 'N/A'} sq ft</p>
                      </div>
                      <div className="pt-2 border-t border-slate-600">
                        <p className="text-slate-400 text-sm">Deal Status</p>
                        <div className="flex items-center">
                          <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-sm rounded-full font-semibold">{selectedProperty.listingStatus}</span>
                          {selectedProperty.listPrice !== '0' && (
                            <span className="ml-2 text-blue-400 text-sm">Market priced</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Market Data for Dispo */}
                  <div className="bg-[#050505] border border-slate-900 rounded-2xl p-6">
                    <div className="flex items-center mb-4">
                      <TrendingUp className="h-5 w-5 text-purple-400 mr-2" />
                      <h3 className="text-lg font-semibold text-slate-200">Market Data</h3>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-slate-400 text-sm">Market Avg DOM</p>
                        <p className="text-slate-200">{selectedProperty.marketMetrics?.avgDaysOnMarket || 30} days</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Market Price/Sq Ft</p>
                        <p className="text-slate-200">${selectedProperty.marketMetrics?.avgPricePerSqft || '0'}/sq ft</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Price Appreciation</p>
                        <div className="flex items-center">
                          <p className="text-emerald-400 font-semibold">{selectedProperty.marketMetrics?.priceAppreciation || '0.0'}%</p>
                          <ArrowUpRight className="h-4 w-4 text-emerald-400 ml-1" />
                        </div>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Median Sale Price</p>
                        <div className="flex items-center">
                          <p className="text-slate-200">
                            {selectedProperty.marketMetrics?.medianSalePrice && selectedProperty.marketMetrics.medianSalePrice !== '0.00' 
                              ? `$${parseInt(selectedProperty.marketMetrics.medianSalePrice).toLocaleString()}`
                              : 'N/A'
                            }
                          </p>
                          <span className="ml-2 px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">Market</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  </div>
                </CollapsibleSection>

                {/* Comparable Sales Section */}
                <CollapsibleSection
                  title="Comparable Sales Analysis"
                  description="Recent sold comparables and market comps"
                  icon={BarChart3}
                  badge={selectedProperty.comparables?.length ? `${selectedProperty.comparables.length} Comps` : "No Comps"}
                  defaultExpanded={false}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Sold Comps */}
                    <div>
                      <h4 className="text-lg font-semibold text-slate-200 mb-4">Recent Sold Comps</h4>
                    <div className="space-y-3">
                      {selectedProperty.comparables && selectedProperty.comparables.length > 0 ? (
                        selectedProperty.comparables.slice(0, 3).map((comp) => (
                          <div key={comp.id} className="flex justify-between items-center p-3 bg-slate-700/20 rounded-xl">
                            <div>
                              <p className="text-slate-200 font-medium">{comp.address}</p>
                              <p className="text-slate-400 text-sm">{comp.beds} bed • {comp.sqft.toLocaleString()} sq ft</p>
                            </div>
                            <div className="text-right">
                              <p className="text-slate-200 font-semibold">${parseInt(comp.salePrice).toLocaleString()}</p>
                              <p className="text-slate-400 text-sm">{comp.saleDate}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4">
                          <p className="text-slate-400">No comparable sales data available</p>
                          <p className="text-slate-500 text-sm mt-1">Comparables will appear when property data is available</p>
                        </div>
                        )}
                      </div>
                    </div>

                    {/* Property Summary */}
                    <div>
                      <h4 className="text-lg font-semibold text-slate-200 mb-4">Property Summary</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-slate-700/20 rounded-xl">
                        <div>
                          <p className="text-slate-200 font-medium">Total Square Footage</p>
                          <p className="text-slate-400 text-sm">{selectedProperty.propertyType}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-slate-200 font-semibold">{selectedProperty.sqft?.toLocaleString() || 'N/A'} sq ft</p>
                          <p className="text-slate-400 text-sm">Built {selectedProperty.yearBuilt || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-slate-700/20 rounded-xl">
                        <div>
                          <p className="text-slate-200 font-medium">Bed/Bath Configuration</p>
                          <p className="text-slate-400 text-sm">Living spaces</p>
                        </div>
                        <div className="text-right">
                          <p className="text-slate-200 font-semibold">{selectedProperty.beds}/{selectedProperty.baths}</p>
                          <p className="text-slate-400 text-sm">Bed/Bath</p>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-slate-600">
                        <p className="text-slate-400 text-sm">Current Status</p>
                        <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-sm rounded-full">{selectedProperty.listingStatus}</span>
                      </div>
                    </div>
                  </div>
                  </div>
                </CollapsibleSection>

                {/* AI Property Analysis */}
                <CollapsibleSection
                  title="AI Investment Analysis"
                  description="Smart property grading and investment insights"
                  icon={Zap}
                  badge="AI Powered"
                  defaultExpanded={false}
                >
                  <AIAnalysis />
                </CollapsibleSection>

                {/* Dashboard Metrics */}
                <CollapsibleSection
                  title="Dashboard Overview"
                  description="Key metrics and performance indicators"
                  icon={Activity}
                  defaultExpanded={false}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                    <Card className="bg-[#050505] border border-slate-900 rounded-2xl overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm font-medium uppercase tracking-wide">Properties Analyzed</p>
                    <p className="text-3xl font-bold text-white mt-1">{formatNumber(properties?.length || 0)}</p>
                  </div>
                  <div className="p-3 bg-blue-500/20 rounded-xl">
                    <Users className="h-6 w-6 text-blue-400" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <Search className="h-4 w-4 text-blue-400 mr-1" />
                  <span className="text-blue-400 text-sm font-medium">Searched</span>
                  <span className="text-slate-400 text-sm ml-2">from Property Search</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#050505] border border-slate-900 rounded-2xl overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm font-medium uppercase tracking-wide">Active Properties</p>
                    <p className="text-3xl font-bold text-white mt-1">{properties?.length || 0}</p>
                  </div>
                  <div className="p-3 bg-emerald-500/20 rounded-xl">
                    <Home className="h-6 w-6 text-emerald-400" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <Target className="h-4 w-4 text-emerald-400 mr-1" />
                  <span className="text-emerald-400 text-sm font-medium">Available</span>
                  <span className="text-slate-400 text-sm ml-2">for analysis</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#050505] border border-slate-900 rounded-2xl overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm font-medium uppercase tracking-wide">Data Sources</p>
                    <p className="text-3xl font-bold text-white mt-1">MLS</p>
                  </div>
                  <div className="p-3 bg-amber-500/20 rounded-xl">
                    <Target className="h-6 w-6 text-amber-400" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <ArrowDownRight className="h-4 w-4 text-red-400 mr-1" />
                  <span className="text-red-400 text-sm font-medium">-3.2%</span>
                  <span className="text-slate-400 text-sm ml-2">vs last month</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#050505] border border-slate-900 rounded-2xl overflow-hidden ">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm font-medium uppercase tracking-wide">Monthly Revenue</p>
                    <p className="text-3xl font-bold text-white mt-1">{formatCurrency(mockDashboardData.overview.monthlyRevenue)}</p>
                  </div>
                  <div className="p-3 bg-purple-500/20 rounded-xl">
                    <DollarSign className="h-6 w-6 text-purple-400" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <ArrowUpRight className="h-4 w-4 text-emerald-400 mr-1" />
                  <span className="text-emerald-400 text-sm font-medium">+24.1%</span>
                  <span className="text-slate-400 text-sm ml-2">vs last month</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#050505] border border-slate-900 rounded-2xl overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm font-medium uppercase tracking-wide">Conversion Rate</p>
                    <p className="text-3xl font-bold text-white mt-1">{mockDashboardData.overview.conversionRate}%</p>
                  </div>
                  <div className="p-3 bg-emerald-500/20 rounded-xl">
                    <TrendingUp className="h-6 w-6 text-emerald-400" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <ArrowUpRight className="h-4 w-4 text-emerald-400 mr-1" />
                  <span className="text-emerald-400 text-sm font-medium">+5.7%</span>
                  <span className="text-slate-400 text-sm ml-2">vs last month</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#050505] border border-slate-900 rounded-2xl overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm font-medium uppercase tracking-wide">Avg Deal Size</p>
                    <p className="text-3xl font-bold text-white mt-1">{formatCurrency(mockDashboardData.overview.avgDealSize)}</p>
                  </div>
                  <div className="p-3 bg-blue-500/20 rounded-xl">
                    <Star className="h-6 w-6 text-blue-400" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <ArrowUpRight className="h-4 w-4 text-emerald-400 mr-1" />
                  <span className="text-emerald-400 text-sm font-medium">+11.2%</span>
                  <span className="text-slate-400 text-sm ml-2">vs last month</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Deal Pipeline */}
            <Card className="lg:col-span-2 bg-[#050505] border border-slate-900 shadow-2xl overflow-hidden ">
              <CardHeader className="bg-black border-b border-slate-900 pb-6">
                <CardTitle className="flex items-center justify-between text-slate-100 text-2xl">
                  Deal Pipeline Analysis
                  <div className="p-2 bg-blue-500/20 rounded-xl">
                    <BarChart3 className="h-6 w-6 text-blue-400" />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {mockDashboardData.pipeline.map((stage, index) => (
                    <div key={stage.stage} className="bg-[#050505] border border-slate-900 rounded-2xl p-5">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="text-slate-200 font-semibold text-lg">{stage.stage}</h4>
                          <p className="text-slate-400 text-sm">{stage.count} properties</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-white">{formatCurrency(stage.value)}</p>
                          <p className="text-slate-400 text-sm">total value</p>
                        </div>
                      </div>
                      <Progress 
                        value={((stage.count / mockDashboardData.pipeline[0].count) * 100)} 
                        className="h-3 bg-slate-700/30"
                      />
                      <div className="mt-2 flex justify-between text-xs text-slate-400">
                        <span>{((stage.count / mockDashboardData.pipeline[0].count) * 100).toFixed(1)}% of total leads</span>
                        <span>Avg: {formatCurrency(stage.value / stage.count)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-[#050505] border border-slate-900 rounded-3xl shadow-lg overflow-hidden">
              <CardHeader className="bg-black border-b border-slate-900 pb-6">
                <CardTitle className="flex items-center justify-between text-slate-100 text-xl">
                  Recent Activity
                  <div className="p-2 bg-purple-500/20 rounded-xl">
                    <Activity className="h-5 w-5 text-purple-400" />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {mockDashboardData.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-4 p-4 rounded-xl hover:bg-slate-700/20 transition-colors">
                      <div className={`p-2 rounded-lg ${
                        activity.type === 'lead' ? 'bg-blue-500/20 text-blue-400' :
                        activity.type === 'deal' ? 'bg-emerald-500/20 text-emerald-400' :
                        activity.type === 'contact' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-purple-500/20 text-purple-400'
                      }`}>
                        {activity.type === 'lead' && <Users className="h-4 w-4" />}
                        {activity.type === 'deal' && <Target className="h-4 w-4" />}
                        {activity.type === 'contact' && <Phone className="h-4 w-4" />}
                        {activity.type === 'analysis' && <Eye className="h-4 w-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-slate-200 font-medium truncate">{activity.address}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className={`text-xs ${
                            activity.status === 'qualified' ? 'status-active' :
                            activity.status === 'contract' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                            activity.status === 'contacted' ? 'status-pending' :
                            'status-inactive'
                          }`}>
                            {activity.status}
                          </Badge>
                          <span className="text-slate-400 text-xs">{activity.time}</span>
                        </div>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${
                        activity.priority === 'high' ? 'bg-red-400' :
                        activity.priority === 'medium' ? 'bg-amber-400' :
                        'bg-slate-400'
                      }`} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
                  </div>
                </CollapsibleSection>

                {/* Deal Pipeline & Activity */}
                <CollapsibleSection
                  title="Deal Pipeline & Recent Activity"
                  description="Pipeline analysis and recent activity tracking"
                  icon={BarChart3}
                  defaultExpanded={false}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Deal Pipeline */}
                    <Card className="lg:col-span-2 bg-[#050505] border border-slate-900 shadow-2xl overflow-hidden ">
                      <CardHeader className="bg-black border-b border-slate-900 pb-6">
                        <CardTitle className="flex items-center justify-between text-slate-100 text-2xl">
                          Deal Pipeline Analysis
                          <div className="p-2 bg-blue-500/20 rounded-xl">
                            <BarChart3 className="h-6 w-6 text-blue-400" />
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="space-y-6">
                          {mockDashboardData.pipeline.map((stage, index) => (
                            <div key={stage.stage} className="bg-[#050505] border border-slate-900 rounded-2xl p-5">
                              <div className="flex items-center justify-between mb-4">
                                <div>
                                  <h4 className="text-slate-200 font-semibold text-lg">{stage.stage}</h4>
                                  <p className="text-slate-400 text-sm">{stage.count} properties</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-2xl font-bold text-white">{formatCurrency(stage.value)}</p>
                                  <p className="text-slate-400 text-sm">total value</p>
                                </div>
                              </div>
                              <Progress 
                                value={((stage.count / mockDashboardData.pipeline[0].count) * 100)} 
                                className="h-3 bg-slate-700/30"
                              />
                              <div className="mt-2 flex justify-between text-xs text-slate-400">
                                <span>{((stage.count / mockDashboardData.pipeline[0].count) * 100).toFixed(1)}% of total leads</span>
                                <span>Avg: {formatCurrency(stage.value / stage.count)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Recent Activity */}
                    <Card className="bg-[#050505] border border-slate-900 rounded-3xl shadow-lg overflow-hidden">
                      <CardHeader className="bg-black border-b border-slate-900 pb-6">
                        <CardTitle className="flex items-center justify-between text-slate-100 text-xl">
                          Recent Activity
                          <div className="p-2 bg-purple-500/20 rounded-xl">
                            <Activity className="h-5 w-5 text-purple-400" />
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          {mockDashboardData.recentActivity.map((activity) => (
                            <div key={activity.id} className="flex items-center space-x-4 p-4 rounded-xl hover:bg-slate-700/20 transition-colors">
                              <div className={`p-2 rounded-lg ${
                                activity.type === 'lead' ? 'bg-blue-500/20 text-blue-400' :
                                activity.type === 'deal' ? 'bg-emerald-500/20 text-emerald-400' :
                                activity.type === 'contact' ? 'bg-amber-500/20 text-amber-400' :
                                'bg-purple-500/20 text-purple-400'
                              }`}>
                                {activity.type === 'lead' && <Users className="h-4 w-4" />}
                                {activity.type === 'deal' && <Target className="h-4 w-4" />}
                                {activity.type === 'contact' && <Phone className="h-4 w-4" />}
                                {activity.type === 'analysis' && <Eye className="h-4 w-4" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-slate-200 font-medium truncate">{activity.address}</p>
                                <div className="flex items-center space-x-2 mt-1">
                                  <Badge className={`text-xs ${
                                    activity.status === 'qualified' ? 'status-active' :
                                    activity.status === 'contract' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                                    activity.status === 'contacted' ? 'status-pending' :
                                    'status-inactive'
                                  }`}>
                                    {activity.status}
                                  </Badge>
                                  <span className="text-slate-400 text-xs">{activity.time}</span>
                                </div>
                              </div>
                              <div className={`w-2 h-2 rounded-full ${
                                activity.priority === 'high' ? 'bg-red-400' :
                                activity.priority === 'medium' ? 'bg-amber-400' :
                                'bg-slate-400'
                              }`} />
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CollapsibleSection>

                {/* Market Intelligence */}
                <CollapsibleSection
                  title="Market Intelligence & Top Markets"
                  description="Market trends and top performing areas"
                  icon={TrendingUp}
                  defaultExpanded={false}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Market Trends */}
            <Card className="bg-[#050505] border border-slate-900 rounded-3xl shadow-lg overflow-hidden">
              <CardHeader className="bg-black border-b border-slate-900 pb-6">
                <CardTitle className="flex items-center justify-between text-slate-100 text-2xl">
                  Market Intelligence
                  <div className="p-2 bg-emerald-500/20 rounded-xl">
                    <TrendingUp className="h-6 w-6 text-emerald-400" />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-[#050505] border border-slate-900 rounded-2xl p-5 text-center">
                    <div className="text-3xl font-bold text-white mb-2">+{mockDashboardData.marketTrends.priceAppreciation}%</div>
                    <div className="text-slate-400 text-sm">Price Appreciation</div>
                    <div className="mt-2 text-xs text-emerald-400 bg-emerald-500/20 px-2 py-1 rounded-full w-fit mx-auto">
                      Above Average
                    </div>
                  </div>
                  <div className="bg-[#050505] border border-slate-900 rounded-2xl p-5 text-center">
                    <div className="text-3xl font-bold text-white mb-2">{mockDashboardData.marketTrends.daysOnMarket}</div>
                    <div className="text-slate-400 text-sm">Avg Days on Market</div>
                    <div className="mt-2 text-xs text-blue-400 bg-blue-500/20 px-2 py-1 rounded-full w-fit mx-auto">
                      Fast Market
                    </div>
                  </div>
                  <div className="bg-[#050505] border border-slate-900 rounded-2xl p-5 text-center">
                    <div className="text-3xl font-bold text-white mb-2">{mockDashboardData.marketTrends.inventoryLevel}</div>
                    <div className="text-slate-400 text-sm">Months Inventory</div>
                    <div className="mt-2 text-xs text-amber-400 bg-amber-500/20 px-2 py-1 rounded-full w-fit mx-auto">
                      Low Supply
                    </div>
                  </div>
                  <div className="bg-[#050505] border border-slate-900 rounded-2xl p-5 text-center">
                    <div className="text-3xl font-bold text-white mb-2">{mockDashboardData.marketTrends.demandIndex}</div>
                    <div className="text-slate-400 text-sm">Demand Index</div>
                    <div className="mt-2 text-xs text-emerald-400 bg-emerald-500/20 px-2 py-1 rounded-full w-fit mx-auto">
                      High Demand
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Markets */}
            <Card className="bg-[#050505] border border-slate-900 rounded-3xl shadow-lg overflow-hidden">
              <CardHeader className="bg-black border-b border-slate-900 pb-6">
                <CardTitle className="flex items-center justify-between text-slate-100 text-2xl">
                  Top Markets
                  <div className="p-2 bg-purple-500/20 rounded-xl">
                    <MapPin className="h-6 w-6 text-purple-400" />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {mockDashboardData.topMarkets.map((market, index) => (
                    <div key={market.city} className="flex items-center justify-between p-4 bg-[#050505] border border-slate-900 rounded-2xl hover:scale-105 transition-transform duration-300">
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-black border-b border-slate-900 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-slate-200 font-semibold">{market.city}</p>
                          <p className="text-slate-400 text-sm">{market.deals} active deals</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-white">{market.roi}%</span>
                          {market.trend === 'up' ? (
                            <ArrowUpRight className="h-4 w-4 text-emerald-400" />
                          ) : (
                            <ArrowDownRight className="h-4 w-4 text-red-400" />
                          )}
                        </div>
                        <p className="text-slate-400 text-xs">ROI</p>
                      </div>
                    </div>
                  ))}
                </div>
                    </CardContent>
                  </Card>
                  </div>
                </CollapsibleSection>

              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
