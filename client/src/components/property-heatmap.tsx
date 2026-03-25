import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  MapPin, 
  TrendingUp, 
  Home, 
  DollarSign, 
  Filter,
  RotateCcw,
  Maximize,
  Eye,
  Search,
  Target,
  Zap,
  AlertTriangle,
  CheckCircle,
  XCircle
} from "lucide-react";

// Property data with investment scoring
interface Property {
  id: number;
  address: string;
  lat: number;
  lng: number;
  price: number;
  estimatedValue: number;
  equity: number;
  investmentScore: number; // 0-100
  riskLevel: "low" | "medium" | "high";
  dealType: "wholesale" | "flip" | "rental" | "land";
  daysOnMarket: number;
  motivation: string;
  distressLevel: number; // 0-100
  roi: number;
  cashFlow: number;
  appreciationPotential: number;
}

// Investment potential data with real property locations
const propertyHeatmapData: Property[] = [
  {
    id: 1,
    address: "1234 Oak Street, Los Angeles, CA",
    lat: 34.0522,
    lng: -118.2437,
    price: 285000,
    estimatedValue: 425000,
    equity: 140000,
    investmentScore: 92,
    riskLevel: "low",
    dealType: "wholesale",
    daysOnMarket: 12,
    motivation: "Foreclosure",
    distressLevel: 85,
    roi: 35.2,
    cashFlow: 1200,
    appreciationPotential: 18.5
  },
  {
    id: 2,
    address: "5678 Pine Avenue, Beverly Hills, CA",
    lat: 34.0736,
    lng: -118.4004,
    price: 650000,
    estimatedValue: 785000,
    equity: 135000,
    investmentScore: 78,
    riskLevel: "medium",
    dealType: "flip",
    daysOnMarket: 28,
    motivation: "Divorce",
    distressLevel: 65,
    roi: 21.8,
    cashFlow: 800,
    appreciationPotential: 12.3
  },
  {
    id: 3,
    address: "9012 Elm Drive, Santa Monica, CA",
    lat: 34.0195,
    lng: -118.4912,
    price: 495000,
    estimatedValue: 625000,
    equity: 130000,
    investmentScore: 85,
    riskLevel: "low",
    dealType: "rental",
    daysOnMarket: 18,
    motivation: "Relocation",
    distressLevel: 55,
    roi: 26.3,
    cashFlow: 1450,
    appreciationPotential: 15.7
  },
  {
    id: 4,
    address: "3456 Maple Lane, Pasadena, CA",
    lat: 34.1478,
    lng: -118.1445,
    price: 175000,
    estimatedValue: 245000,
    equity: 70000,
    investmentScore: 68,
    riskLevel: "medium",
    dealType: "wholesale",
    daysOnMarket: 45,
    motivation: "Financial Distress",
    distressLevel: 78,
    roi: 18.5,
    cashFlow: 650,
    appreciationPotential: 9.8
  },
  {
    id: 5,
    address: "7890 Cedar Court, Long Beach, CA",
    lat: 33.7701,
    lng: -118.1937,
    price: 325000,
    estimatedValue: 445000,
    equity: 120000,
    investmentScore: 88,
    riskLevel: "low",
    dealType: "flip",
    daysOnMarket: 8,
    motivation: "Inheritance",
    distressLevel: 70,
    roi: 32.1,
    cashFlow: 950,
    appreciationPotential: 11.2
  },
  {
    id: 6,
    address: "2468 Birch Street, Burbank, CA",
    lat: 34.1808,
    lng: -118.3090,
    price: 225000,
    estimatedValue: 285000,
    equity: 60000,
    investmentScore: 55,
    riskLevel: "high",
    dealType: "wholesale",
    daysOnMarket: 67,
    motivation: "Job Loss",
    distressLevel: 60,
    roi: 14.2,
    cashFlow: 450,
    appreciationPotential: 8.1
  },
  {
    id: 7,
    address: "1357 Spruce Ave, Glendale, CA",
    lat: 34.1425,
    lng: -118.2551,
    price: 385000,
    estimatedValue: 475000,
    equity: 90000,
    investmentScore: 72,
    riskLevel: "medium",
    dealType: "rental",
    daysOnMarket: 32,
    motivation: "Downsizing",
    distressLevel: 45,
    roi: 19.8,
    cashFlow: 750,
    appreciationPotential: 10.5
  },
  {
    id: 8,
    address: "9753 Willow Dr, Torrance, CA",
    lat: 33.8358,
    lng: -118.3406,
    price: 265000,
    estimatedValue: 345000,
    equity: 80000,
    investmentScore: 75,
    riskLevel: "medium",
    dealType: "wholesale",
    daysOnMarket: 21,
    motivation: "Medical Bills",
    distressLevel: 72,
    roi: 22.4,
    cashFlow: 680,
    appreciationPotential: 7.9
  },
  {
    id: 9,
    address: "4680 Poplar Rd, Compton, CA",
    lat: 33.8958,
    lng: -118.2201,
    price: 145000,
    estimatedValue: 225000,
    equity: 80000,
    investmentScore: 95,
    riskLevel: "low",
    dealType: "wholesale",
    daysOnMarket: 5,
    motivation: "Bankruptcy",
    distressLevel: 95,
    roi: 42.8,
    cashFlow: 1100,
    appreciationPotential: 22.1
  },
  {
    id: 10,
    address: "8024 Aspen St, Inglewood, CA",
    lat: 33.9617,
    lng: -118.3531,
    price: 195000,
    estimatedValue: 285000,
    equity: 90000,
    investmentScore: 89,
    riskLevel: "low",
    dealType: "flip",
    daysOnMarket: 14,
    motivation: "Estate Sale",
    distressLevel: 80,
    roi: 35.7,
    cashFlow: 1050,
    appreciationPotential: 19.3
  },
  {
    id: 11,
    address: "6159 Hickory Ln, Hawthorne, CA",
    lat: 33.9164,
    lng: -118.3526,
    price: 155000,
    estimatedValue: 195000,
    equity: 40000,
    investmentScore: 45,
    riskLevel: "high",
    dealType: "land",
    daysOnMarket: 89,
    motivation: "Tax Issues",
    distressLevel: 50,
    roi: 12.8,
    cashFlow: 280,
    appreciationPotential: 6.7
  },
  {
    id: 12,
    address: "3791 Sycamore Ct, El Segundo, CA",
    lat: 33.9192,
    lng: -118.4165,
    price: 475000,
    estimatedValue: 525000,
    equity: 50000,
    investmentScore: 62,
    riskLevel: "medium",
    dealType: "rental",
    daysOnMarket: 52,
    motivation: "Retirement",
    distressLevel: 35,
    roi: 16.5,
    cashFlow: 620,
    appreciationPotential: 5.2
  }
];

export default function PropertyHeatmap() {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [filterScore, setFilterScore] = useState<number>(0);
  const [filterDealType, setFilterDealType] = useState<string>("all");
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Fetch properties from API
  const { data: apiProperties } = useQuery({
    queryKey: ['/api/properties'],
    queryFn: async () => {
      const response = await fetch('/api/properties');
      return response.json();
    }
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getInvestmentColor = (score: number) => {
    if (score >= 90) return "#10B981"; // emerald-500 - Excellent
    if (score >= 80) return "#3B82F6"; // blue-500 - Very Good
    if (score >= 70) return "#8B5CF6"; // violet-500 - Good
    if (score >= 60) return "#F59E0B"; // amber-500 - Fair
    if (score >= 50) return "#EF4444"; // red-500 - Poor
    return "#6B7280"; // gray-500 - Very Poor
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return { label: "🎯 Excellent Deal", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" };
    if (score >= 80) return { label: "⭐ Very Good", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" };
    if (score >= 70) return { label: "👍 Good Deal", color: "bg-violet-500/20 text-violet-400 border-violet-500/30" };
    if (score >= 60) return { label: "⚠️ Fair Deal", color: "bg-amber-500/20 text-amber-400 border-amber-500/30" };
    if (score >= 50) return { label: "⛔ Poor Deal", color: "bg-red-500/20 text-red-400 border-red-500/30" };
    return { label: "🚫 Avoid", color: "bg-gray-500/20 text-gray-400 border-gray-500/30" };
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case "low": return <CheckCircle className="h-4 w-4 text-emerald-400" />;
      case "medium": return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      case "high": return <XCircle className="h-4 w-4 text-red-400" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getMarkerSize = (score: number) => {
    if (score >= 90) return "w-8 h-8";
    if (score >= 80) return "w-7 h-7";
    if (score >= 70) return "w-6 h-6";
    if (score >= 60) return "w-5 h-5";
    return "w-4 h-4";
  };

  const filteredProperties = propertyHeatmapData.filter(property => {
    if (filterScore > 0 && property.investmentScore < filterScore) return false;
    if (filterDealType !== "all" && property.dealType !== filterDealType) return false;
    return true;
  });

  return (
    <Card className="bg-black border border-slate-900 rounded-[1.5rem] shadow-2xl overflow-hidden border border-slate-700/20 backdrop-blur-xl">
      <CardHeader className="bg-[#050505] border border-slate-900 pb-8 relative overflow-hidden">
        {/* Premium Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-transparent to-blue-500/20"></div>
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="premium-dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="currentColor" opacity="0.3"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#premium-dots)"/>
          </svg>
        </div>
        
        <CardTitle className="flex items-center justify-between text-slate-100 text-3xl font-bold relative z-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-black border-b border-slate-900 rounded-2xl backdrop-blur-sm border border-white/10">
              <Target className="h-8 w-8 text-emerald-300" />
            </div>
            <div>
              <div className="bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Investment Property Heatmap
              </div>
              <div className="text-sm font-normal text-slate-400 mt-1">Advanced Real Estate Intelligence</div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-slate-800/60 backdrop-blur-sm rounded-2xl p-3 border border-slate-600/30">
              <select 
                className="bg-slate-700/80 border border-slate-500/50 rounded-xl px-4 py-2 text-sm text-slate-200 font-medium backdrop-blur-sm focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-400/50 transition-all duration-300"
                value={filterDealType}
                onChange={(e) => setFilterDealType(e.target.value)}
              >
                <option value="all">🏘️ All Types</option>
                <option value="wholesale">💼 Wholesale</option>
                <option value="flip">🔨 Flip</option>
                <option value="rental">🏠 Rental</option>
                <option value="land">🌍 Land</option>
              </select>
              
              <div className="flex items-center gap-2 px-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={filterScore}
                  onChange={(e) => setFilterScore(Number(e.target.value))}
                  className="w-24 h-2 bg-slate-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-emerald-400 [&::-webkit-slider-thumb]:to-blue-400 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-emerald-500/30"
                />
                <span className="text-xs text-slate-300 min-w-[65px] font-medium bg-slate-700/50 px-2 py-1 rounded-lg">
                  {filterScore === 0 ? 'All' : `${filterScore}+`}
                </span>
              </div>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
          
          {/* Interactive Investment Heatmap */}
          <div className="lg:col-span-2 relative bg-[#050505] border border-slate-900 min-h-[700px] overflow-hidden">
            
            {/* Premium Map Background */}
            <div className="absolute inset-0">
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/10 via-blue-900/5 to-purple-900/10"></div>
              
              {/* Sophisticated Grid Pattern */}
              <div className="absolute inset-0 opacity-10">
                <svg width="100%" height="100%" className="text-slate-400">
                  <defs>
                    <pattern id="premium-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                      <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                      <circle cx="30" cy="30" r="1" fill="currentColor" opacity="0.3"/>
                    </pattern>
                    <linearGradient id="grid-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: "#10b981", stopOpacity: 0.1 }} />
                      <stop offset="50%" style={{ stopColor: "#3b82f6", stopOpacity: 0.05 }} />
                      <stop offset="100%" style={{ stopColor: "#8b5cf6", stopOpacity: 0.1 }} />
                    </linearGradient>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#premium-grid)" />
                  <rect width="100%" height="100%" fill="url(#grid-gradient)" />
                </svg>
              </div>
              
              {/* Ambient Light Effects */}
              <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
              <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500/3 rounded-full blur-2xl transform -translate-x-1/2 -translate-y-1/2"></div>
            </div>

            {/* Property Markers */}
            <div className="absolute inset-0 p-8">
              <div className="relative w-full h-full">
                {filteredProperties.map((property) => {
                  const x = ((property.lng + 118.5) / 1.0) * 100; // Normalize longitude
                  const y = ((34.3 - property.lat) / 0.6) * 100; // Normalize latitude
                  
                  return (
                    <div
                      key={property.id}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10"
                      style={{ 
                        left: `${Math.max(5, Math.min(95, x))}%`, 
                        top: `${Math.max(5, Math.min(95, y))}%` 
                      }}
                      onClick={() => setSelectedProperty(property)}
                    >
                      {/* Multi-layer Pulse Animation */}
                      <div 
                        className={`absolute ${getMarkerSize(property.investmentScore)} rounded-full animate-ping opacity-30`}
                        style={{ backgroundColor: getInvestmentColor(property.investmentScore) }}
                      />
                      <div 
                        className={`absolute ${getMarkerSize(property.investmentScore)} rounded-full animate-pulse opacity-20`}
                        style={{ 
                          backgroundColor: getInvestmentColor(property.investmentScore),
                          animationDelay: '0.5s',
                          transform: 'scale(1.3)'
                        }}
                      />
                      
                      {/* Glow Effect */}
                      <div 
                        className={`absolute ${getMarkerSize(property.investmentScore)} rounded-full blur-sm opacity-60 group-hover:opacity-100 transition-all duration-500`}
                        style={{ backgroundColor: getInvestmentColor(property.investmentScore) }}
                      />
                      
                      {/* Main Property Marker with Premium Styling */}
                      <div 
                        className={`${getMarkerSize(property.investmentScore)} rounded-full border-2 border-white/80 shadow-2xl transform transition-all duration-500 group-hover:scale-150 group-hover:shadow-3xl z-20 relative flex items-center justify-center backdrop-blur-sm`}
                        style={{ 
                          backgroundColor: getInvestmentColor(property.investmentScore),
                          boxShadow: `0 0 20px ${getInvestmentColor(property.investmentScore)}40, 0 0 40px ${getInvestmentColor(property.investmentScore)}20`
                        }}
                      >
                        <Home className="h-3 w-3 text-white drop-shadow-lg" />
                        
                        {/* Inner Highlight */}
                        <div className="absolute inset-1 rounded-full bg-white/20 opacity-50"></div>
                      </div>
                      
                      {/* Investment Score Badge with Premium Styling */}
                      <div className="absolute -top-3 -right-3 bg-black border-b border-slate-900 backdrop-blur-md text-white text-xs px-2 py-1 rounded-lg border border-slate-600/50 shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-500 z-30 font-bold">
                        <div className="text-center">
                          <div className="text-emerald-400">{property.investmentScore}</div>
                          <div className="text-slate-400 text-[10px]">SCORE</div>
                        </div>
                      </div>
                      
                      {/* Enhanced Hover Details */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 opacity-0 group-hover:opacity-100 transition-all duration-500 z-40">
                        <div className="bg-black border-b border-slate-900 backdrop-blur-xl text-white text-sm px-4 py-3 rounded-xl border border-slate-600/30 shadow-2xl whitespace-nowrap">
                          <div className="flex items-center gap-2 mb-2">
                            <div 
                              className="w-3 h-3 rounded-full shadow-lg"
                              style={{ backgroundColor: getInvestmentColor(property.investmentScore) }}
                            ></div>
                            <div className="font-bold text-slate-100">{property.address.split(',')[0]}</div>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between gap-4">
                              <span className="text-slate-400">Score:</span>
                              <span className="text-emerald-400 font-semibold">{property.investmentScore}/100</span>
                            </div>
                            <div className="flex justify-between gap-4">
                              <span className="text-slate-400">Price:</span>
                              <span className="text-blue-400 font-semibold">{formatCurrency(property.price)}</span>
                            </div>
                            <div className="flex justify-between gap-4">
                              <span className="text-slate-400">ROI:</span>
                              <span className="text-purple-400 font-semibold">{property.roi}%</span>
                            </div>
                            <div className="flex justify-between gap-4">
                              <span className="text-slate-400">Type:</span>
                              <span className="text-amber-400 font-semibold capitalize">{property.dealType}</span>
                            </div>
                          </div>
                          
                          {/* Tooltip Arrow */}
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                            <div className="w-3 h-3 bg-slate-900 transform rotate-45 border border-slate-600/30"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Premium Control Panel */}
            <div className="absolute top-6 left-6 flex flex-col gap-3">
              <div className="bg-black border-b border-slate-900 backdrop-blur-xl rounded-2xl p-3 border border-slate-600/30 shadow-2xl">
                <div className="flex flex-col gap-2">
                  <Button variant="outline" size="sm" className="bg-slate-800/50 border-slate-600/50 hover:bg-slate-700/60 hover:border-slate-500/60 transition-all duration-300 text-slate-200">
                    <Filter className="h-4 w-4 mr-2 text-emerald-400" />
                    <span className="font-medium">Filter</span>
                  </Button>
                  <Button variant="outline" size="sm" className="bg-slate-800/50 border-slate-600/50 hover:bg-slate-700/60 hover:border-slate-500/60 transition-all duration-300 text-slate-200" onClick={() => setFilterScore(0)}>
                    <RotateCcw className="h-4 w-4 mr-2 text-blue-400" />
                    <span className="font-medium">Reset</span>
                  </Button>
                  <Button variant="outline" size="sm" className="bg-slate-800/50 border-slate-600/50 hover:bg-slate-700/60 hover:border-slate-500/60 transition-all duration-300 text-slate-200">
                    <Maximize className="h-4 w-4 mr-2 text-purple-400" />
                    <span className="font-medium">Expand</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Premium Investment Legend */}
            <div className="absolute bottom-6 left-6 bg-black border-b border-slate-900 backdrop-blur-xl rounded-2xl p-5 border border-slate-600/30 shadow-2xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-emerald-500/20 rounded-xl">
                  <Target className="h-4 w-4 text-emerald-400" />
                </div>
                <div className="text-slate-200 text-sm font-bold">Investment Score</div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full shadow-lg border border-white/20" style={{ backgroundColor: "#10B981" }}></div>
                  <span className="text-slate-300 text-sm font-medium">90-100</span>
                  <span className="text-emerald-400 text-xs font-bold px-2 py-1 bg-emerald-500/20 rounded-lg">Excellent</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full shadow-lg border border-white/20" style={{ backgroundColor: "#3B82F6" }}></div>
                  <span className="text-slate-300 text-sm font-medium">80-89</span>
                  <span className="text-blue-400 text-xs font-bold px-2 py-1 bg-blue-500/20 rounded-lg">Very Good</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full shadow-lg border border-white/20" style={{ backgroundColor: "#8B5CF6" }}></div>
                  <span className="text-slate-300 text-sm font-medium">70-79</span>
                  <span className="text-violet-400 text-xs font-bold px-2 py-1 bg-violet-500/20 rounded-lg">Good</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full shadow-lg border border-white/20" style={{ backgroundColor: "#F59E0B" }}></div>
                  <span className="text-slate-300 text-sm font-medium">60-69</span>
                  <span className="text-amber-400 text-xs font-bold px-2 py-1 bg-amber-500/20 rounded-lg">Fair</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full shadow-lg border border-white/20" style={{ backgroundColor: "#EF4444" }}></div>
                  <span className="text-slate-300 text-sm font-medium">50-59</span>
                  <span className="text-red-400 text-xs font-bold px-2 py-1 bg-red-500/20 rounded-lg">Poor</span>
                </div>
              </div>
            </div>

            {/* Premium Stats Overlay */}
            <div className="absolute top-6 right-6 bg-black border-b border-slate-900 backdrop-blur-xl rounded-2xl p-5 border border-slate-600/30 shadow-2xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-blue-500/20 rounded-xl">
                  <Zap className="h-4 w-4 text-blue-400" />
                </div>
                <div className="text-slate-200 text-sm font-bold">Live Analytics</div>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center gap-6">
                  <span className="text-slate-400 font-medium">Properties:</span>
                  <div className="bg-slate-700/50 px-3 py-1 rounded-lg">
                    <span className="text-slate-200 font-bold">{filteredProperties.length}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center gap-6">
                  <span className="text-slate-400 font-medium">Avg Score:</span>
                  <div className="bg-emerald-500/20 px-3 py-1 rounded-lg">
                    <span className="text-emerald-400 font-bold">
                      {filteredProperties.length > 0 ? (filteredProperties.reduce((acc, p) => acc + p.investmentScore, 0) / filteredProperties.length).toFixed(0) : '0'}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center gap-6">
                  <span className="text-slate-400 font-medium">Excellent:</span>
                  <div className="bg-emerald-500/20 px-3 py-1 rounded-lg">
                    <span className="text-emerald-400 font-bold">
                      {filteredProperties.filter(p => p.investmentScore >= 90).length}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center gap-6">
                  <span className="text-slate-400 font-medium">High ROI:</span>
                  <div className="bg-purple-500/20 px-3 py-1 rounded-lg">
                    <span className="text-purple-400 font-bold">
                      {filteredProperties.filter(p => p.roi >= 25).length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Premium Property Details Panel */}
          <div className="bg-[#050505] border border-slate-900 p-8 border-l border-slate-600/30 backdrop-blur-xl relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="detail-pattern" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
                    <circle cx="3" cy="3" r="1" fill="currentColor" opacity="0.2"/>
                    <circle cx="15" cy="15" r="0.5" fill="currentColor" opacity="0.3"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#detail-pattern)"/>
              </svg>
            </div>
            {selectedProperty ? (
              <div className="space-y-8 relative z-10">
                {/* Property Header */}
                <div className="text-center pb-6 border-b border-slate-600/30">
                  <div className="flex items-center gap-3 mb-4 justify-center">
                    <div 
                      className="w-6 h-6 rounded-full shadow-lg border border-white/20"
                      style={{ backgroundColor: getInvestmentColor(selectedProperty.investmentScore) }}
                    ></div>
                    <h3 className="text-2xl font-bold bg-black border-b border-slate-900 bg-clip-text text-transparent">
                      {selectedProperty.address.split(',')[0]}
                    </h3>
                  </div>
                  <Badge className={getScoreLabel(selectedProperty.investmentScore).color + " border text-sm px-4 py-2 font-bold"}>
                    {getScoreLabel(selectedProperty.investmentScore).label}
                  </Badge>
                </div>
                  
                <div className="space-y-6">
                  {/* Investment Score Card */}
                  <div className="bg-black border-b border-slate-900 backdrop-blur-sm rounded-3xl p-6 border border-slate-600/30 shadow-2xl">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-slate-300 text-lg font-semibold">Investment Score</span>
                      <div className="p-3 bg-emerald-500/20 rounded-2xl">
                        <Target className="h-6 w-6 text-emerald-400" />
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-5xl font-black bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                        {selectedProperty.investmentScore}
                      </div>
                      <div className="text-slate-400 text-sm font-medium">out of 100 points</div>
                      
                      {/* Score Progress Bar */}
                      <div className="w-full bg-slate-700/50 rounded-full h-3 mt-4 overflow-hidden">
                        <div 
                          className="h-full bg-black border-b border-slate-900 rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${selectedProperty.investmentScore}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Deal Details Card */}
                  <div className="bg-black border-b border-slate-900 backdrop-blur-sm rounded-3xl p-6 border border-slate-600/30 shadow-2xl">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-slate-300 text-lg font-semibold">Deal Details</span>
                      <div className="p-3 bg-blue-500/20 rounded-2xl">
                        <DollarSign className="h-6 w-6 text-blue-400" />
                      </div>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 font-medium">Price:</span>
                        <span className="text-slate-200 font-bold">{formatCurrency(selectedProperty.price)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 font-medium">Est. Value:</span>
                        <span className="text-slate-200 font-bold">{formatCurrency(selectedProperty.estimatedValue)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 font-medium">Equity:</span>
                        <span className="text-emerald-400 font-bold">{formatCurrency(selectedProperty.equity)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 font-medium">ROI:</span>
                        <span className="text-purple-400 font-bold">{selectedProperty.roi}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Risk & Performance Card */}
                  <div className="bg-black border-b border-slate-900 backdrop-blur-sm rounded-3xl p-6 border border-slate-600/30 shadow-2xl">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-slate-300 text-lg font-semibold">Risk & Performance</span>
                      <div className="p-3 bg-purple-500/20 rounded-2xl">
                        <TrendingUp className="h-6 w-6 text-purple-400" />
                      </div>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 font-medium">Risk Level:</span>
                        <div className="flex items-center gap-2">
                          {getRiskIcon(selectedProperty.riskLevel)}
                          <span className={`font-bold ${
                            selectedProperty.riskLevel === 'low' ? 'text-emerald-400' :
                            selectedProperty.riskLevel === 'medium' ? 'text-yellow-400' : 'text-red-400'
                          }`}>
                            {selectedProperty.riskLevel.charAt(0).toUpperCase() + selectedProperty.riskLevel.slice(1)}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 font-medium">Deal Type:</span>
                        <span className="text-slate-200 font-bold capitalize">{selectedProperty.dealType}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 font-medium">Cash Flow:</span>
                        <span className="text-emerald-400 font-bold">{formatCurrency(selectedProperty.cashFlow)}/mo</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 font-medium">Motivation:</span>
                        <span className="text-orange-400 font-bold">{selectedProperty.motivation}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3 pt-4">
                    <Button className="w-full bg-black border-b border-slate-900 hover:from-emerald-600 hover:to-emerald-700 text-white font-medium py-3 px-4 rounded-xl">
                      <Eye className="h-4 w-4 mr-2" />
                      Analyze Deal
                    </Button>
                    <Button variant="outline" className="w-full bg-slate-800/50 border-slate-600/50 hover:bg-slate-700/60 text-slate-200 py-3 px-4 rounded-xl">
                      <Search className="h-4 w-4 mr-2" />
                      View Comparables
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-700/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Home className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-300 mb-2">Select a Property</h3>
                <p className="text-slate-400 text-sm">Click on any property marker to view detailed investment analysis and metrics</p>
                <div className="mt-4 text-xs text-slate-500">
                  {filteredProperties.length} properties shown
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}