import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import NavigationBar from "@/components/navigation-bar";
import Sidebar from "@/components/sidebar";
import MarketHeatmap from "@/components/market-heatmap";
import MarketFeeds from "@/components/market-feeds";
import ZillowMarketFeeds from "@/components/zillow-market-feeds";
import NewsSlider from "@/components/news-slider";
import WorkflowProgress from "@/components/workflow-progress";
import CollapsibleSection from "@/components/collapsible-section";
import TargetCriteriaModal from "@/components/target-criteria-modal";
import FilterMotivationModal from "@/components/filter-motivation-modal";
import ExportTargetModal from "@/components/export-target-modal";
import { 
  TrendingUp, 
  TrendingDown, 
  Home, 
  DollarSign, 
  Calendar, 
  MapPin, 
  BarChart3, 
  PieChart, 
  Activity,
  Building,
  Users,
  Clock,
  Target,
  Zap,
  Globe,
  Filter,
  Download,
  RefreshCw,
  Rss
} from "lucide-react";

// Market Intelligence data structure
const marketIntelligenceData = {
  overview: {
    totalMarkets: 24,
    activeListings: 3247,
    avgPriceAppreciation: 8.7,
    marketVolume: 1240000000
  },
  hotMarkets: [
    {
      city: "Los Angeles",
      county: "Los Angeles County",
      state: "CA",
      medianPrice: 875000,
      priceChange: 12.3,
      inventory: 1.8,
      daysOnMarket: 18,
      dealFlow: 156,
      investorActivity: "High",
      trend: "up",
      hotness: 95
    },
    {
      city: "San Diego", 
      county: "San Diego County",
      state: "CA",
      medianPrice: 795000,
      priceChange: 9.8,
      inventory: 2.1,
      daysOnMarket: 22,
      dealFlow: 134,
      investorActivity: "High",
      trend: "up",
      hotness: 89
    },
    {
      city: "Orange County",
      county: "Orange County", 
      state: "CA",
      medianPrice: 920000,
      priceChange: 7.2,
      inventory: 2.4,
      daysOnMarket: 28,
      dealFlow: 98,
      investorActivity: "Medium",
      trend: "stable",
      hotness: 82
    },
    {
      city: "Riverside",
      county: "Riverside County",
      state: "CA", 
      medianPrice: 485000,
      priceChange: 15.6,
      inventory: 1.4,
      daysOnMarket: 15,
      dealFlow: 187,
      investorActivity: "Very High",
      trend: "up",
      hotness: 97
    }
  ],
  marketSegments: [
    {
      segment: "Single Family Homes",
      volume: 68,
      avgPrice: 675000,
      priceChange: 9.2,
      inventory: 2.1
    },
    {
      segment: "Condos/Townhomes", 
      volume: 22,
      avgPrice: 485000,
      priceChange: 7.8,
      inventory: 2.8
    },
    {
      segment: "Multi-Family",
      volume: 7,
      avgPrice: 1250000,
      priceChange: 11.4,
      inventory: 1.6
    },
    {
      segment: "Land/Lots",
      volume: 3,
      avgPrice: 185000,
      priceChange: 18.3,
      inventory: 4.2
    }
  ],
  distressedProperties: {
    foreclosures: 847,
    preForeclosures: 1456,
    taxDelinquent: 923,
    bankOwned: 234,
    auctions: 156,
    probate: 567
  },
  priceRanges: [
    { range: "Under $300K", count: 1247, percentage: 18.2, avgDOM: 12 },
    { range: "$300K - $500K", count: 2156, percentage: 31.5, avgDOM: 18 },
    { range: "$500K - $750K", count: 1834, percentage: 26.8, avgDOM: 25 },
    { range: "$750K - $1M", count: 987, percentage: 14.4, avgDOM: 32 },
    { range: "Over $1M", count: 623, percentage: 9.1, avgDOM: 45 }
  ],
  investorMetrics: {
    cashBuyers: 34.5,
    flipperActivity: 12.8,
    rentalPurchases: 28.7,
    institutionalBuying: 8.4
  }
};

// Mock property data for filtered results
const generateFilteredProperties = (activeFilters: any[]) => {
  const mockProperties = [
    {
      id: "prop_001",
      address: "1234 Oak Street, Los Angeles, CA 90210",
      price: 485000,
      bedrooms: 3,
      bathrooms: 2,
      sqft: 1850,
      yearBuilt: 1995,
      motivation: ["divorce", "foreclosure"],
      daysOnMarket: 180,
      priceReductions: 2,
      equity: 125000,
      condition: "Needs Work",
      distressScore: 85,
      ownerType: "Absentee"
    },
    {
      id: "prop_002",
      address: "5678 Pine Avenue, Orange County, CA 92603",
      price: 395000,
      bedrooms: 4,
      bathrooms: 2,
      sqft: 2100,
      yearBuilt: 1988,
      motivation: ["estate-sale", "vacant-properties"],
      daysOnMarket: 145,
      priceReductions: 1,
      equity: 95000,
      condition: "Fair",
      distressScore: 72,
      ownerType: "Estate"
    },
    {
      id: "prop_003",
      address: "9012 Maple Drive, Riverside, CA 92501",
      price: 325000,
      bedrooms: 3,
      bathrooms: 1,
      sqft: 1650,
      yearBuilt: 1982,
      motivation: ["financial-distress", "tax-liens"],
      daysOnMarket: 220,
      priceReductions: 3,
      equity: 75000,
      condition: "Poor",
      distressScore: 92,
      ownerType: "Owner-Occupied"
    },
    {
      id: "prop_004",
      address: "3456 Cedar Lane, San Diego, CA 92101",
      price: 650000,
      bedrooms: 4,
      bathrooms: 3,
      sqft: 2400,
      yearBuilt: 2005,
      motivation: ["job-relocation", "market-time"],
      daysOnMarket: 120,
      priceReductions: 1,
      equity: 180000,
      condition: "Good",
      distressScore: 68,
      ownerType: "Owner-Occupied"
    },
    {
      id: "prop_005",
      address: "7890 Birch Court, Long Beach, CA 90802",
      price: 425000,
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1450,
      yearBuilt: 1990,
      motivation: ["price-reductions", "vacant-properties"],
      daysOnMarket: 165,
      priceReductions: 2,
      equity: 110000,
      condition: "Fair",
      distressScore: 78,
      ownerType: "Investment"
    }
  ];

  const enabledFilterIds = activeFilters.filter(f => f.enabled).map(f => f.id);
  
  if (enabledFilterIds.length === 0) {
    return mockProperties; // Show all if no filters
  }
  
  return mockProperties.filter(property => 
    property.motivation.some(m => enabledFilterIds.includes(m))
  );
};

// Mock feed data for news sliders
const marketFeedData = [
  {
    title: "Trump tells Federal Reserve governor Lisa Cook to 'resign now'",
    link: "https://www.inman.com/2025/08/20/trump-tells-federal-reserve-governor-lisa-cook-to-resign-now/",
    pubDate: "Wed, 20 Aug 2025 17:38:24 +0000",
    author: "Marian McPherson",
    description: "The president asked Cook to resign from her post after FHFA Director Bill Pulte accused her of mortgage fraud.",
    categories: ["Markets & Economy", "Mortgage", "Federal Reserve"],
    image: "https://images.unsplash.com/photo-1560472355-536de3962603?w=400&h=200&fit=crop&crop=entropy&auto=format&q=80"
  },
  {
    title: "How Opendoor's CEO resignation underscores the power of visibility",
    link: "https://www.inman.com/2025/08/20/how-opendoors-ceo-resignation-underscores-the-power-of-visibility/",
    pubDate: "Wed, 20 Aug 2025 17:00:10 +0000",
    author: "Cristin Culver",
    description: "Leadership changes in PropTech highlight the importance of executive visibility in today's attention economy.",
    categories: ["PropTech", "Leadership", "Executive Brand"],
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&h=200&fit=crop&crop=entropy&auto=format&q=80"
  },
  {
    title: "Fannie Mae dials back sales expectations by 220K homes",
    link: "https://www.inman.com/2025/08/19/fannie-mae-dials-back-sales-expectations-by-220000-homes/",
    pubDate: "Tue, 19 Aug 2025 22:28:04 +0000",
    author: "Matt Carter",
    description: "Government-sponsored enterprise reduces home sales forecast amid market uncertainty and inventory challenges.",
    categories: ["Markets & Economy", "Home Sales", "Fannie Mae"],
    image: "https://images.unsplash.com/photo-1586105251261-72a756497a11?w=400&h=200&fit=crop&crop=entropy&auto=format&q=80"
  },
  {
    title: "'Construction is in a funk': Homebuilding improves, but inventory issues remain",
    link: "https://www.inman.com/2025/08/19/single-family-starts-and-permits-inched-higher-in-july-but-not-enough-to-meet-inventory-needs/",
    pubDate: "Tue, 19 Aug 2025 14:47:27 +0000",
    author: "Lillian Dickerson",
    description: "Single-family starts and permits rose in July but not enough to address ongoing inventory shortage.",
    categories: ["Construction", "Housing Supply", "Market Analysis"],
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=200&fit=crop&crop=entropy&auto=format&q=80"
  }
];

const zillowFeedData = [
  {
    title: "Mortgage Rates Steady as Markets Look Past Outdated Fed Minutes",
    link: "https://www.zillow.com/research/mortgage-rates-18722/",
    pubDate: "Wed, 20 Aug 2025 08:00:16 +0000",
    author: "Kara Ng",
    description: "Zillow maintains its expectation that mortgage rates will end the year near the mid-6% range",
    categories: ["Affordability", "Market Trends", "Fed", "Mortgage Rates"],
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=200&fit=crop&crop=entropy&auto=format&q=80"
  },
  {
    title: "July 2025 Housing Starts: Starts Increase Again, Permits Point To Slowdown Ahead",
    link: "https://www.zillow.com/research/july-2025-housing-starts-35492/",
    pubDate: "Tue, 19 Aug 2025 13:41:34 +0000",
    author: "Orphe Divounguy",
    description: "Building permits issued in July fell to 1,354,000 (SAAR). Housing starts increased to 1,428,000 (SAAR) in July.",
    categories: ["News", "New Construction", "Housing Starts"],
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=200&fit=crop&crop=entropy&auto=format&q=80"
  },
  {
    title: "Seven Major Metros Where Rents Are Flat or Falling This Summer",
    link: "https://www.zillow.com/research/july-2025-rent-report-35469/",
    pubDate: "Mon, 18 Aug 2025 12:00:33 +0000",
    author: "Orphe Divounguy",
    description: "Rent growth continued to cool in July as more housing supply gives renters more bargaining power.",
    categories: ["Market Reports", "Renting", "Rent Report"],
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=200&fit=crop&crop=entropy&auto=format&q=80"
  }
];

export default function MarketIntelligence() {
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [workflowVisible, setWorkflowVisible] = useState(false);
  const [lastDataUpdate, setLastDataUpdate] = useState(new Date());
  const [isUpdatingData, setIsUpdatingData] = useState(false);
  const [filteredProperties, setFilteredProperties] = useState<any[]>([]);
  const [activeFilters, setActiveFilters] = useState<any[]>([]);
  const [showFilteredResults, setShowFilteredResults] = useState(false);
  const [newsLoading, setNewsLoading] = useState(false);

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

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-emerald-400" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-400" />;
      default:
        return <Activity className="h-4 w-4 text-blue-400" />;
    }
  };

  const getHotnessColor = (hotness: number) => {
    if (hotness >= 90) return "text-red-400 bg-red-500/20";
    if (hotness >= 80) return "text-orange-400 bg-orange-500/20";
    if (hotness >= 70) return "text-yellow-400 bg-yellow-500/20";
    return "text-blue-400 bg-blue-500/20";
  };

  // Load saved filters on component mount
  useEffect(() => {
    const savedFilters = localStorage.getItem("motivationFilters");
    if (savedFilters) {
      try {
        const filters = JSON.parse(savedFilters);
        setActiveFilters(filters);
        const hasActiveFilters = filters.some((f: any) => f.enabled);
        if (hasActiveFilters) {
          setFilteredProperties(generateFilteredProperties(filters));
          setShowFilteredResults(true);
        }
      } catch (error) {
        console.error("Error loading saved filters:", error);
      }
    }
  }, []);

  const handleFilterUpdate = (filters: any[]) => {
    setActiveFilters(filters);
    const properties = generateFilteredProperties(filters);
    setFilteredProperties(properties);
    setShowFilteredResults(true);
    
    // Scroll to results section after a brief delay
    setTimeout(() => {
      const resultsSection = document.getElementById("filtered-results");
      if (resultsSection) {
        resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 500);
  };

  const clearFilters = () => {
    setActiveFilters([]);
    setFilteredProperties([]);
    setShowFilteredResults(false);
    localStorage.removeItem("motivationFilters");
    
    toast({
      title: "Filters Cleared",
      description: "All motivation filters have been removed.",
    });
  };

  const handleUpdateMarketData = async () => {
    setIsUpdatingData(true);
    try {
      // Simulate data update
      await new Promise(resolve => setTimeout(resolve, 3000));
      setLastDataUpdate(new Date());
      
      toast({
        title: "Market Data Updated",
        description: "Successfully refreshed market intelligence data from all sources.",
      });
      
      // In a real app, this would refresh market data from APIs
    } finally {
      setIsUpdatingData(false);
    }
  };

  const refreshNewsFeeds = () => {
    setNewsLoading(true);
    setTimeout(() => {
      setNewsLoading(false);
      toast({
        title: "News Feeds Refreshed",
        description: "Latest market news and research data updated.",
      });
    }, 1000);
  };

  const getMotivationBadgeColor = (motivation: string) => {
    const colorMap: {[key: string]: string} = {
      "divorce": "bg-red-500/20 text-red-400 border-red-500/30",
      "foreclosure": "bg-orange-500/20 text-orange-400 border-orange-500/30",
      "financial-distress": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      "estate-sale": "bg-purple-500/20 text-purple-400 border-purple-500/30",
      "job-relocation": "bg-blue-500/20 text-blue-400 border-blue-500/30",
      "vacant-properties": "bg-slate-500/20 text-slate-400 border-slate-500/30",
      "tax-liens": "bg-red-600/20 text-red-300 border-red-600/30",
      "market-time": "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
      "price-reductions": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
    };
    return colorMap[motivation] || "bg-slate-500/20 text-slate-400 border-slate-500/30";
  };

  const getDistressScoreColor = (score: number) => {
    if (score >= 85) return "text-red-400";
    if (score >= 70) return "text-orange-400";
    if (score >= 55) return "text-yellow-400";
    return "text-blue-400";
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
            currentStep="market"
            marketResearched={true}
            propertySearched={false}
            propertyAnalyzed={false}
            leadAdded={false}
            isVisible={workflowVisible}
            onToggle={setWorkflowVisible}
          />
        </div>
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-5xl font-bold text-white mb-4">Define Your Target Market</h1>
          <p className="text-slate-400 text-xl max-w-4xl mx-auto">
            Step 1 of Wholesaling: Choose your geographic area and property type. Research high-motivation areas with distressed properties, foreclosures, and motivated sellers to maximize deal potential.
          </p>
          <div className="flex justify-center gap-4 mt-6">
            <TargetCriteriaModal>
              <Button variant="outline" className="bg-black border border-slate-900 rounded-[1.5rem]">
                <Target className="h-4 w-4 mr-2" />
                Set Target Criteria
              </Button>
            </TargetCriteriaModal>
            
            <FilterMotivationModal onFilterUpdate={handleFilterUpdate}>
              <Button variant="outline" className={`bg-black border border-slate-900 rounded-[1.5rem] ${showFilteredResults ? 'ring-2 ring-orange-400/50' : ''}`}>
                <Filter className="h-4 w-4 mr-2" />
                Filter by Motivation
                {showFilteredResults && (
                  <Badge className="ml-2 bg-orange-500/20 text-orange-400 border-orange-500/30">
                    {activeFilters.filter(f => f.enabled).length}
                  </Badge>
                )}
              </Button>
            </FilterMotivationModal>
            
            <ExportTargetModal>
              <Button variant="outline" className="bg-black border border-slate-900 rounded-[1.5rem]">
                <Download className="h-4 w-4 mr-2" />
                Export Target List
              </Button>
            </ExportTargetModal>
            
            <Button 
              variant="outline" 
              className="bg-black border border-slate-900 rounded-[1.5rem]"
              onClick={handleUpdateMarketData}
              disabled={isUpdatingData}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isUpdatingData ? 'animate-spin' : ''}`} />
              {isUpdatingData ? 'Updating...' : 'Update Market Data'}
            </Button>
          </div>
        </div>

        {/* Real-Time Market Intelligence - Compact News Sliders */}
        <CollapsibleSection
          title="Real-Time Market Intelligence"
          description="Live market feeds and data streams in compact news format"
          icon={Globe}
          defaultExpanded={true}
        >
          <div className="space-y-4 mb-6">
            {/* Market News Sliders Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <NewsSlider
                items={marketFeedData}
                title="Market News"
                icon={Rss}
                loading={newsLoading}
                onRefresh={refreshNewsFeeds}
                accentColor="orange"
              />
              
              <NewsSlider
                items={zillowFeedData}
                title="Zillow Research"
                icon={BarChart3}
                loading={newsLoading}
                onRefresh={refreshNewsFeeds}
                accentColor="blue"
              />
            </div>
            
            {/* Geographic Targeting - Right under the feeds */}
            <Card className="bg-black border border-slate-900 rounded-[1.5rem] shadow-lg overflow-hidden">
              <CardHeader className="bg-black border-b border-slate-900 pb-6">
                <CardTitle className="flex items-center justify-between text-slate-100 text-2xl">
                  Geographic Targeting
                  <div className="p-2 bg-blue-500/20 rounded-xl">
                    <MapPin className="h-6 w-6 text-blue-400" />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="bg-black border border-slate-900 rounded-[1.5rem] p-4">
                  <h4 className="text-slate-200 font-semibold mb-3">Select Target Areas</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="justify-start">
                      <MapPin className="h-4 w-4 mr-2" />
                      Los Angeles County
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <MapPin className="h-4 w-4 mr-2" />
                      Orange County
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <MapPin className="h-4 w-4 mr-2" />
                      Riverside County
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <MapPin className="h-4 w-4 mr-2" />
                      San Bernardino
                    </Button>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-600">
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div>
                        <p className="text-slate-400">Foreclosure Rate</p>
                        <p className="text-red-400 font-bold">2.8%</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Median Price</p>
                        <p className="text-slate-200 font-bold">$675K</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Vacancy Rate</p>
                        <p className="text-yellow-400 font-bold">12%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CollapsibleSection>

        {/* Target Market Selection Tools - Property Criteria moved further down */}
        <CollapsibleSection
          title="Target Market Selection"
          description="Define your geographic focus and property criteria for maximum deal potential"
          icon={Target}
          defaultExpanded={false}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Additional Geographic Options */}
            <Card className="bg-black border border-slate-900 rounded-[1.5rem] shadow-lg overflow-hidden">
              <CardHeader className="bg-black border-b border-slate-900 pb-6">
                <CardTitle className="flex items-center justify-between text-slate-100 text-2xl">
                  Advanced Geographic Tools
                  <div className="p-2 bg-blue-500/20 rounded-xl">
                    <MapPin className="h-6 w-6 text-blue-400" />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="bg-black border border-slate-900 rounded-[1.5rem] p-4">
                  <h4 className="text-slate-200 font-semibold mb-3">Market Boundaries & Zones</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Focus Zone</span>
                      <span className="text-blue-400 font-medium">5-mile radius</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">School Districts</span>
                      <span className="text-slate-200 font-medium">Top-rated only</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Crime Rate</span>
                      <span className="text-emerald-400 font-medium">Low to Moderate</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Public Transit</span>
                      <span className="text-slate-200 font-medium">Within 2 miles</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4 bg-blue-500 hover:bg-blue-600">
                    <Filter className="h-4 w-4 mr-2" />
                    Apply Geographic Filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Property Type Criteria */}
            <Card className="bg-black border border-slate-900 rounded-[1.5rem] shadow-lg overflow-hidden">
              <CardHeader className="bg-black border-b border-slate-900 pb-6">
                <CardTitle className="flex items-center justify-between text-slate-100 text-2xl">
                  Property Criteria
                  <div className="p-2 bg-emerald-500/20 rounded-xl">
                    <Home className="h-6 w-6 text-emerald-400" />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="bg-black border border-slate-900 rounded-[1.5rem] p-4">
                  <h4 className="text-slate-200 font-semibold mb-3">Ideal Property Profile</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Property Type</span>
                      <span className="text-slate-200 font-medium">Single Family</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Bedrooms</span>
                      <span className="text-slate-200 font-medium">3-4 BR</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Price Range</span>
                      <span className="text-emerald-400 font-medium">$200K - $500K</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Built</span>
                      <span className="text-slate-200 font-medium">1980-2010</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Condition</span>
                      <span className="text-yellow-400 font-medium">Needs Work</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4 bg-emerald-500 hover:bg-emerald-600">
                    <Target className="h-4 w-4 mr-2" />
                    Set as Target Criteria
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Market Overview Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-tour="market-overview">
          <Card className="bg-[#0a0a0a] border border-slate-900 rounded-[1.5rem] overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium uppercase tracking-wide">Total Markets</p>
                  <p className="text-3xl font-bold text-white mt-1">{marketIntelligenceData.overview.totalMarkets}</p>
                </div>
                <div className="p-3 bg-blue-500/20 rounded-xl">
                  <Globe className="h-6 w-6 text-blue-400" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-slate-400 text-sm">Actively monitored</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#0a0a0a] border border-slate-900 rounded-[1.5rem] overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium uppercase tracking-wide">Active Listings</p>
                  <p className="text-3xl font-bold text-white mt-1">{formatNumber(marketIntelligenceData.overview.activeListings)}</p>
                </div>
                <div className="p-3 bg-emerald-500/20 rounded-xl">
                  <Home className="h-6 w-6 text-emerald-400" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-emerald-400 text-sm">+8.2% vs last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#0a0a0a] border border-slate-900 rounded-[1.5rem] overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium uppercase tracking-wide">Avg Price Growth</p>
                  <p className="text-3xl font-bold text-white mt-1">+{marketIntelligenceData.overview.avgPriceAppreciation}%</p>
                </div>
                <div className="p-3 bg-purple-500/20 rounded-xl">
                  <TrendingUp className="h-6 w-6 text-purple-400" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-purple-400 text-sm">YoY appreciation</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#0a0a0a] border border-slate-900 rounded-[1.5rem] overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium uppercase tracking-wide">Market Volume</p>
                  <p className="text-3xl font-bold text-white mt-1">${(marketIntelligenceData.overview.marketVolume / 1000000000).toFixed(1)}B</p>
                </div>
                <div className="p-3 bg-orange-500/20 rounded-xl">
                  <DollarSign className="h-6 w-6 text-orange-400" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-orange-400 text-sm">Total transaction value</span>
              </div>
            </CardContent>
          </Card>
          </div>
        </CollapsibleSection>

        {/* Market Activity Heatmap */}
        <CollapsibleSection
          title="Market Activity & Opportunity Heatmap"
          description="Visual representation of high-motivation areas and deal activity for target identification"
          icon={MapPin}
          defaultExpanded={true}
        >
          <div className="space-y-6">
            {/* Heatmap Controls */}
            <div className="bg-slate-800/30 rounded-2xl p-4">
              <h4 className="text-slate-200 font-semibold mb-3 flex items-center">
                <Filter className="h-4 w-4 mr-2 text-blue-400" />
                Filter Market Data
              </h4>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" size="sm" className="bg-black border border-slate-900 rounded-[1.5rem]">
                  <Zap className="h-4 w-4 mr-2" />
                  Foreclosure Density
                </Button>
                <Button variant="outline" size="sm" className="bg-black border border-slate-900 rounded-[1.5rem]">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Tax Delinquent
                </Button>
                <Button variant="outline" size="sm" className="bg-black border border-slate-900 rounded-[1.5rem]">
                  <Users className="h-4 w-4 mr-2" />
                  Absentee Owners
                </Button>
                <Button variant="outline" size="sm" className="bg-black border border-slate-900 rounded-[1.5rem]">
                  <Home className="h-4 w-4 mr-2" />
                  Property Age (1980-2010)
                </Button>
                <Button variant="outline" size="sm" className="bg-black border border-slate-900 rounded-[1.5rem]">
                  <Activity className="h-4 w-4 mr-2" />
                  Investor Activity
                </Button>
              </div>
            </div>
            <div data-tour="market-heatmap">
              <MarketHeatmap />
            </div>
            
            {/* Heatmap Legend & Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Card className="bg-black border border-slate-900 rounded-[1.5rem] p-4">
                <h4 className="text-slate-200 font-semibold mb-3">Heat Map Legend</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span className="text-slate-400">High Motivation (90%+)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-orange-400 rounded"></div>
                    <span className="text-slate-400">Medium Motivation (70-89%)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-yellow-400 rounded"></div>
                    <span className="text-slate-400">Some Motivation (50-69%)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-blue-400 rounded"></div>
                    <span className="text-slate-400">Low Motivation (&lt;50%)</span>
                  </div>
                </div>
              </Card>
              
              <Card className="bg-black border border-slate-900 rounded-[1.5rem] p-4">
                <h4 className="text-slate-200 font-semibold mb-3">Targeting Insights</h4>
                <div className="space-y-2 text-sm text-slate-400">
                  <p>• <span className="text-red-400">Riverside County</span> shows highest foreclosure density</p>
                  <p>• <span className="text-amber-400">78% absentee owners</span> in tax delinquent areas</p>
                  <p>• <span className="text-emerald-400">Properties built 1980-2010</span> most common</p>
                  <p>• <span className="text-blue-400">Low competition</span> in outlying areas</p>
                </div>
              </Card>
            </div>
          </div>
        </CollapsibleSection>

        {/* Filtered Property Results */}
        {showFilteredResults && (
          <div id="filtered-results" className="fade-in">
            <CollapsibleSection
              title={`Filtered Properties (${filteredProperties.length} found)`}
              description="Properties matching your selected motivation criteria"
              icon={Filter}
              defaultExpanded={true}
            >
              <div className="space-y-6">
                {/* Active Filters Summary */}
                <Card className="bg-black border border-slate-900 rounded-[1.5rem] p-4 bg-black border-b border-slate-900 border-orange-500/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-slate-200 font-semibold mb-2 flex items-center">
                        <Filter className="h-4 w-4 mr-2 text-orange-400" />
                        Active Motivation Filters
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {activeFilters.filter(f => f.enabled).map(filter => (
                          <Badge 
                            key={filter.id} 
                            className={`${getMotivationBadgeColor(filter.id)} text-xs px-2 py-1`}
                          >
                            {filter.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={clearFilters}
                      className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10"
                    >
                      Clear Filters
                    </Button>
                  </div>
                </Card>

                {/* Property Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredProperties.map((property, index) => (
                    <Card key={property.id} className="bg-black border border-slate-900 rounded-[1.5rem] shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                      <CardHeader className="bg-black border-b border-slate-900 pb-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-slate-100 text-lg leading-tight mb-2">
                              {property.address}
                            </CardTitle>
                            <div className="flex items-center space-x-4 text-sm">
                              <span className="text-emerald-400 font-bold text-xl">
                                {formatCurrency(property.price)}
                              </span>
                              <Badge className={`${getDistressScoreColor(property.distressScore)} bg-opacity-20 border-0`}>
                                {property.distressScore}% Distress
                              </Badge>
                            </div>
                          </div>
                          <div className={`p-2 rounded-xl ${getDistressScoreColor(property.distressScore)} bg-opacity-20`}>
                            <Home className="h-5 w-5" />
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="p-6 space-y-4">
                        {/* Property Details */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-slate-400">Bedrooms</span>
                              <span className="text-slate-200 font-medium">{property.bedrooms} BR</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Bathrooms</span>
                              <span className="text-slate-200 font-medium">{property.bathrooms} BA</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Square Feet</span>
                              <span className="text-slate-200 font-medium">{formatNumber(property.sqft)} sqft</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Year Built</span>
                              <span className="text-slate-200 font-medium">{property.yearBuilt}</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-slate-400">Days on Market</span>
                              <span className="text-orange-400 font-medium">{property.daysOnMarket} days</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Price Reductions</span>
                              <span className="text-red-400 font-medium">{property.priceReductions}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Est. Equity</span>
                              <span className="text-emerald-400 font-medium">{formatCurrency(property.equity)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Owner Type</span>
                              <span className="text-blue-400 font-medium">{property.ownerType}</span>
                            </div>
                          </div>
                        </div>

                        {/* Motivation Tags */}
                        <div>
                          <h5 className="text-slate-300 font-medium mb-2 text-sm">Motivation Indicators</h5>
                          <div className="flex flex-wrap gap-2">
                            {property.motivation.map(motivation => (
                              <Badge 
                                key={motivation} 
                                className={`${getMotivationBadgeColor(motivation)} text-xs px-2 py-1`}
                              >
                                {motivation.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Property Condition */}
                        <div className="bg-slate-800/30 rounded-lg p-3">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400 text-sm">Property Condition</span>
                            <span className={`font-medium text-sm ${
                              property.condition === 'Poor' ? 'text-red-400' :
                              property.condition === 'Fair' ? 'text-yellow-400' :
                              property.condition === 'Good' ? 'text-emerald-400' : 'text-blue-400'
                            }`}>
                              {property.condition}
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-2">
                          <Button 
                            size="sm" 
                            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                          >
                            <Activity className="h-4 w-4 mr-2" />
                            Analyze Property
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="flex-1 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                          >
                            <Users className="h-4 w-4 mr-2" />
                            Add to Leads
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filteredProperties.length === 0 && (
                  <Card className="bg-black border border-slate-900 rounded-[1.5rem] p-8 text-center">
                    <div className="space-y-4">
                      <div className="p-4 bg-slate-800/50 rounded-xl w-fit mx-auto">
                        <Filter className="h-8 w-8 text-slate-400" />
                      </div>
                      <div>
                        <h4 className="text-slate-200 font-semibold mb-2">No Properties Found</h4>
                        <p className="text-slate-400 text-sm">
                          No properties match your current filter criteria. Try adjusting your motivation filters to see more results.
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        onClick={clearFilters}
                        className="border-slate-600 text-slate-300 hover:bg-slate-800"
                      >
                        Clear All Filters
                      </Button>
                    </div>
                  </Card>
                )}
              </div>
            </CollapsibleSection>
          </div>
        )}

        {/* Hot Markets Table */}
        <CollapsibleSection
          title="Hottest Markets"
          description="Top performing markets with highest activity"
          icon={Zap}
          defaultExpanded={false}
        >
          <Card className="bg-black border border-slate-900 rounded-[1.5rem] shadow-lg overflow-hidden" data-tour="hot-markets">
          <CardHeader className="bg-black border-b border-slate-900 pb-6">
            <CardTitle className="flex items-center justify-between text-slate-100 text-2xl">
              Hottest Markets
              <div className="p-2 bg-red-500/20 rounded-xl">
                <Zap className="h-6 w-6 text-red-400" />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-800/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-slate-300 font-medium">Market</th>
                    <th className="px-6 py-4 text-right text-slate-300 font-medium">Median Price</th>
                    <th className="px-6 py-4 text-right text-slate-300 font-medium">Price Change</th>
                    <th className="px-6 py-4 text-right text-slate-300 font-medium">Inventory</th>
                    <th className="px-6 py-4 text-right text-slate-300 font-medium">Days on Market</th>
                    <th className="px-6 py-4 text-right text-slate-300 font-medium">Deal Flow</th>
                    <th className="px-6 py-4 text-center text-slate-300 font-medium">Hotness</th>
                  </tr>
                </thead>
                <tbody>
                  {marketIntelligenceData.hotMarkets.map((market, index) => (
                    <tr key={index} className="border-t border-slate-700/50 hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-semibold text-slate-200">{market.city}</div>
                          <div className="text-sm text-slate-400">{market.county}, {market.state}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right text-slate-200 font-medium">
                        {formatCurrency(market.medianPrice)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end">
                          {getTrendIcon(market.trend)}
                          <span className={market.priceChange > 0 ? "text-emerald-400 ml-1" : "text-red-400 ml-1"}>
                            {market.priceChange > 0 ? '+' : ''}{market.priceChange}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right text-slate-200">
                        {market.inventory} months
                      </td>
                      <td className="px-6 py-4 text-right text-slate-200">
                        {market.daysOnMarket} days
                      </td>
                      <td className="px-6 py-4 text-right text-slate-200 font-medium">
                        {market.dealFlow} deals
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Badge className={`${getHotnessColor(market.hotness)} border-0`}>
                          {market.hotness}% Hot
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        </CollapsibleSection>

        {/* High-Motivation Seller Analysis */}
        <CollapsibleSection
          title="High-Motivation Seller Analysis"
          description="Identify areas with distressed properties, foreclosures, and motivated sellers"
          icon={Zap}
          defaultExpanded={true}
        >
          {/* Motivation Indicators */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <Card className="bg-black border border-slate-900 rounded-[1.5rem] shadow-lg overflow-hidden">
              <CardHeader className="bg-black border-b border-slate-900 pb-6">
                <CardTitle className="flex items-center justify-between text-slate-100 text-xl">
                  Foreclosure Hotspots
                  <div className="p-2 bg-red-500/20 rounded-xl">
                    <Home className="h-5 w-5 text-red-400" />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-red-400 mb-1">{marketIntelligenceData.distressedProperties.foreclosures}</div>
                  <div className="text-slate-400 text-sm">Active Foreclosures</div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Pre-Foreclosures</span>
                    <span className="text-yellow-400">{marketIntelligenceData.distressedProperties.preForeclosures}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Bank Owned</span>
                    <span className="text-red-400">{marketIntelligenceData.distressedProperties.bankOwned}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Auction Properties</span>
                    <span className="text-orange-400">{marketIntelligenceData.distressedProperties.auctions}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black border border-slate-900 rounded-[1.5rem] shadow-lg overflow-hidden">
              <CardHeader className="bg-black border-b border-slate-900 pb-6">
                <CardTitle className="flex items-center justify-between text-slate-100 text-xl">
                  Tax Delinquent
                  <div className="p-2 bg-amber-500/20 rounded-xl">
                    <DollarSign className="h-5 w-5 text-amber-400" />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-amber-400 mb-1">{marketIntelligenceData.distressedProperties.taxDelinquent}</div>
                  <div className="text-slate-400 text-sm">Tax Delinquent Properties</div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Avg Owed</span>
                    <span className="text-amber-400">$12,500</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">1+ Years Behind</span>
                    <span className="text-red-400">687</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Absentee Owners</span>
                    <span className="text-orange-400">78%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black border border-slate-900 rounded-[1.5rem] shadow-lg overflow-hidden">
              <CardHeader className="bg-black border-b border-slate-900 pb-6">
                <CardTitle className="flex items-center justify-between text-slate-100 text-xl">
                  Estate/Probate
                  <div className="p-2 bg-purple-500/20 rounded-xl">
                    <Users className="h-5 w-5 text-purple-400" />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-purple-400 mb-1">{marketIntelligenceData.distressedProperties.probate}</div>
                  <div className="text-slate-400 text-sm">Probate Properties</div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Inherited</span>
                    <span className="text-purple-400">423</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Estate Sales</span>
                    <span className="text-blue-400">144</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Avg Timeline</span>
                    <span className="text-green-400">6-12 mo</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Wholesaling Target Criteria Helper */}
          <Card className="bg-black border border-slate-900 rounded-[1.5rem] shadow-lg overflow-hidden">
            <CardHeader className="bg-black border-b border-slate-900 pb-6">
              <CardTitle className="flex items-center justify-between text-slate-100 text-2xl">
                Wholesaling Target Criteria
                <div className="p-2 bg-indigo-500/20 rounded-xl">
                  <Target className="h-6 w-6 text-indigo-400" />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Geographic Focus */}
                <div className="bg-black border border-slate-900 rounded-[1.5rem] p-4">
                  <h4 className="text-indigo-400 font-semibold mb-3 flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    Geographic Focus
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Primary Market</span>
                      <span className="text-slate-200">Riverside County</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Median Price</span>
                      <span className="text-emerald-400">$485K</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Deal Flow</span>
                      <span className="text-blue-400">187 deals/mo</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Competition</span>
                      <span className="text-yellow-400">Medium</span>
                    </div>
                  </div>
                </div>

                {/* Property Criteria */}
                <div className="bg-black border border-slate-900 rounded-[1.5rem] p-4">
                  <h4 className="text-emerald-400 font-semibold mb-3 flex items-center">
                    <Home className="h-4 w-4 mr-2" />
                    Property Criteria
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Type</span>
                      <span className="text-slate-200">Single Family</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Price Range</span>
                      <span className="text-emerald-400">$200K - $500K</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Bedrooms</span>
                      <span className="text-slate-200">3-4 BR</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Built</span>
                      <span className="text-slate-200">1980-2010</span>
                    </div>
                  </div>
                </div>

                {/* Motivation Indicators */}
                <div className="bg-black border border-slate-900 rounded-[1.5rem] p-4">
                  <h4 className="text-red-400 font-semibold mb-3 flex items-center">
                    <Zap className="h-4 w-4 mr-2" />
                    Motivation Signals
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Foreclosures</span>
                      <span className="text-red-400">High Priority</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Tax Delinquent</span>
                      <span className="text-amber-400">Monitor</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Probate/Estate</span>
                      <span className="text-purple-400">Target</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Absentee Owners</span>
                      <span className="text-orange-400">Focus Area</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-4 mt-6">
                <Button className="bg-indigo-500 hover:bg-indigo-600">
                  <Target className="h-4 w-4 mr-2" />
                  Save Target Profile
                </Button>
                <Button variant="outline" className="bg-black border border-slate-900 rounded-[1.5rem]">
                  <Filter className="h-4 w-4 mr-2" />
                  Apply Filters to Search
                </Button>
                <Button variant="outline" className="bg-black border border-slate-900 rounded-[1.5rem]">
                  <Download className="h-4 w-4 mr-2" />
                  Export Target List
                </Button>
              </div>
            </CardContent>
          </Card>
        </CollapsibleSection>

        {/* Market Segments & Property Types */}
        <CollapsibleSection
          title="Property Type Analysis"
          description="Market segment breakdown and property type performance"
          icon={PieChart}
          defaultExpanded={false}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Market Segments */}
          <Card className="bg-black border border-slate-900 rounded-[1.5rem] shadow-lg overflow-hidden">
            <CardHeader className="bg-black border-b border-slate-900 pb-6">
              <CardTitle className="flex items-center justify-between text-slate-100 text-2xl">
                Market Segments
                <div className="p-2 bg-blue-500/20 rounded-xl">
                  <PieChart className="h-6 w-6 text-blue-400" />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {marketIntelligenceData.marketSegments.map((segment, index) => (
                <div key={index} className="bg-black border border-slate-900 rounded-[1.5rem] p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-200 font-medium">{segment.segment}</span>
                    <span className="text-slate-300 text-lg font-bold">{segment.volume}%</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-slate-400">Avg Price</p>
                      <p className="text-slate-200 font-medium">{formatCurrency(segment.avgPrice)}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Price Change</p>
                      <p className="text-emerald-400 font-medium">+{segment.priceChange}%</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Inventory</p>
                      <p className="text-slate-200 font-medium">{segment.inventory} mo</p>
                    </div>
                  </div>
                  <Progress 
                    value={segment.volume} 
                    className="mt-3 h-2 bg-slate-700"
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Distressed Properties */}
          <Card className="bg-black border border-slate-900 rounded-[1.5rem] shadow-lg overflow-hidden">
            <CardHeader className="bg-black border-b border-slate-900 pb-6">
              <CardTitle className="flex items-center justify-between text-slate-100 text-2xl">
                Distressed Properties
                <div className="p-2 bg-yellow-500/20 rounded-xl">
                  <Target className="h-6 w-6 text-yellow-400" />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black border border-slate-900 rounded-[1.5rem] p-4 text-center">
                  <div className="text-2xl font-bold text-white mb-1">
                    {formatNumber(marketIntelligenceData.distressedProperties.foreclosures)}
                  </div>
                  <div className="text-slate-400 text-sm">Foreclosures</div>
                </div>
                <div className="bg-black border border-slate-900 rounded-[1.5rem] p-4 text-center">
                  <div className="text-2xl font-bold text-white mb-1">
                    {formatNumber(marketIntelligenceData.distressedProperties.preForeclosures)}
                  </div>
                  <div className="text-slate-400 text-sm">Pre-Foreclosures</div>
                </div>
                <div className="bg-black border border-slate-900 rounded-[1.5rem] p-4 text-center">
                  <div className="text-2xl font-bold text-white mb-1">
                    {formatNumber(marketIntelligenceData.distressedProperties.taxDelinquent)}
                  </div>
                  <div className="text-slate-400 text-sm">Tax Delinquent</div>
                </div>
                <div className="bg-black border border-slate-900 rounded-[1.5rem] p-4 text-center">
                  <div className="text-2xl font-bold text-white mb-1">
                    {formatNumber(marketIntelligenceData.distressedProperties.bankOwned)}
                  </div>
                  <div className="text-slate-400 text-sm">Bank Owned</div>
                </div>
                <div className="bg-black border border-slate-900 rounded-[1.5rem] p-4 text-center">
                  <div className="text-2xl font-bold text-white mb-1">
                    {formatNumber(marketIntelligenceData.distressedProperties.auctions)}
                  </div>
                  <div className="text-slate-400 text-sm">Auctions</div>
                </div>
                <div className="bg-black border border-slate-900 rounded-[1.5rem] p-4 text-center">
                  <div className="text-2xl font-bold text-white mb-1">
                    {formatNumber(marketIntelligenceData.distressedProperties.probate)}
                  </div>
                  <div className="text-slate-400 text-sm">Probate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Price Ranges & Investor Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Price Range Analysis */}
          <Card className="bg-black border border-slate-900 rounded-[1.5rem] shadow-lg overflow-hidden">
            <CardHeader className="bg-black border-b border-slate-900 pb-6">
              <CardTitle className="flex items-center justify-between text-slate-100 text-2xl">
                Price Range Analysis
                <div className="p-2 bg-purple-500/20 rounded-xl">
                  <BarChart3 className="h-6 w-6 text-purple-400" />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {marketIntelligenceData.priceRanges.map((range, index) => (
                <div key={index} className="bg-black border border-slate-900 rounded-[1.5rem] p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-slate-200 font-medium">{range.range}</span>
                    <span className="text-slate-300 text-sm">{formatNumber(range.count)} listings</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-400 text-sm">{range.percentage}% of market</span>
                    <span className="text-slate-400 text-sm">Avg DOM: {range.avgDOM} days</span>
                  </div>
                  <Progress 
                    value={range.percentage} 
                    className="h-2 bg-slate-700"
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Investor Activity */}
          <Card className="bg-black border border-slate-900 rounded-[1.5rem] shadow-lg overflow-hidden">
            <CardHeader className="bg-black border-b border-slate-900 pb-6">
              <CardTitle className="flex items-center justify-between text-slate-100 text-2xl">
                Investor Activity
                <div className="p-2 bg-emerald-500/20 rounded-xl">
                  <Users className="h-6 w-6 text-emerald-400" />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-black border border-slate-900 rounded-[1.5rem] p-5 text-center">
                  <div className="text-3xl font-bold text-white mb-2">{marketIntelligenceData.investorMetrics.cashBuyers}%</div>
                  <div className="text-slate-400 text-sm">Cash Buyers</div>
                  <div className="mt-2 text-xs text-emerald-400 bg-emerald-500/20 px-2 py-1 rounded-full w-fit mx-auto">
                    Above Average
                  </div>
                </div>
                <div className="bg-black border border-slate-900 rounded-[1.5rem] p-5 text-center">
                  <div className="text-3xl font-bold text-white mb-2">{marketIntelligenceData.investorMetrics.flipperActivity}%</div>
                  <div className="text-slate-400 text-sm">Flipper Activity</div>
                  <div className="mt-2 text-xs text-blue-400 bg-blue-500/20 px-2 py-1 rounded-full w-fit mx-auto">
                    Moderate
                  </div>
                </div>
                <div className="bg-black border border-slate-900 rounded-[1.5rem] p-5 text-center">
                  <div className="text-3xl font-bold text-white mb-2">{marketIntelligenceData.investorMetrics.rentalPurchases}%</div>
                  <div className="text-slate-400 text-sm">Rental Purchases</div>
                  <div className="mt-2 text-xs text-purple-400 bg-purple-500/20 px-2 py-1 rounded-full w-fit mx-auto">
                    High Activity
                  </div>
                </div>
                <div className="bg-black border border-slate-900 rounded-[1.5rem] p-5 text-center">
                  <div className="text-3xl font-bold text-white mb-2">{marketIntelligenceData.investorMetrics.institutionalBuying}%</div>
                  <div className="text-slate-400 text-sm">Institutional</div>
                  <div className="mt-2 text-xs text-orange-400 bg-orange-500/20 px-2 py-1 rounded-full w-fit mx-auto">
                    Growing
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          </div>
        </CollapsibleSection>
        </div>
      </div>
    </div>
  );
}