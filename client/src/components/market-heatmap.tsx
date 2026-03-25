import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { 
  MapPin, 
  TrendingUp, 
  Activity, 
  Zap, 
  Filter,
  RotateCcw,
  Maximize,
  Eye,
  DollarSign
} from "lucide-react";

// Heatmap data structure with geographic coordinates and activity metrics
const heatmapData = {
  regions: [
    {
      id: 1,
      name: "Downtown LA",
      lat: 34.0522,
      lng: -118.2437,
      dealCount: 156,
      avgDealValue: 125000,
      activityLevel: 95,
      priceAppreciation: 18.5,
      color: "rgb(239, 68, 68)", // red-500
      size: "large"
    },
    {
      id: 2,
      name: "Beverly Hills",
      lat: 34.0736,
      lng: -118.4004,
      dealCount: 89,
      avgDealValue: 285000,
      activityLevel: 82,
      priceAppreciation: 12.3,
      color: "rgb(245, 101, 101)", // red-400
      size: "large"
    },
    {
      id: 3,
      name: "Santa Monica",
      lat: 34.0195,
      lng: -118.4912,
      dealCount: 134,
      avgDealValue: 195000,
      activityLevel: 88,
      priceAppreciation: 15.7,
      color: "rgb(239, 68, 68)", // red-500
      size: "large"
    },
    {
      id: 4,
      name: "Pasadena",
      lat: 34.1478,
      lng: -118.1445,
      dealCount: 67,
      avgDealValue: 98000,
      activityLevel: 72,
      priceAppreciation: 9.8,
      color: "rgb(251, 146, 60)", // orange-400
      size: "medium"
    },
    {
      id: 5,
      name: "Long Beach",
      lat: 33.7701,
      lng: -118.1937,
      dealCount: 112,
      avgDealValue: 87000,
      activityLevel: 79,
      priceAppreciation: 11.2,
      color: "rgb(245, 101, 101)", // red-400
      size: "large"
    },
    {
      id: 6,
      name: "Burbank",
      lat: 34.1808,
      lng: -118.3090,
      dealCount: 45,
      avgDealValue: 76000,
      activityLevel: 65,
      priceAppreciation: 8.1,
      color: "rgb(251, 146, 60)", // orange-400
      size: "medium"
    },
    {
      id: 7,
      name: "Glendale",
      lat: 34.1425,
      lng: -118.2551,
      dealCount: 58,
      avgDealValue: 92000,
      activityLevel: 68,
      priceAppreciation: 10.5,
      color: "rgb(251, 146, 60)", // orange-400
      size: "medium"
    },
    {
      id: 8,
      name: "Torrance",
      lat: 33.8358,
      lng: -118.3406,
      dealCount: 73,
      avgDealValue: 105000,
      activityLevel: 71,
      priceAppreciation: 7.9,
      color: "rgb(251, 146, 60)", // orange-400
      size: "medium"
    },
    {
      id: 9,
      name: "Compton",
      lat: 33.8958,
      lng: -118.2201,
      dealCount: 187,
      avgDealValue: 65000,
      activityLevel: 92,
      priceAppreciation: 22.1,
      color: "rgb(220, 38, 38)", // red-600
      size: "extra-large"
    },
    {
      id: 10,
      name: "Inglewood",
      lat: 33.9617,
      lng: -118.3531,
      dealCount: 145,
      avgDealValue: 78000,
      activityLevel: 85,
      priceAppreciation: 19.3,
      color: "rgb(239, 68, 68)", // red-500
      size: "large"
    },
    {
      id: 11,
      name: "Hawthorne",
      lat: 33.9164,
      lng: -118.3526,
      dealCount: 34,
      avgDealValue: 58000,
      activityLevel: 58,
      priceAppreciation: 6.7,
      color: "rgb(252, 176, 64)", // yellow-400
      size: "small"
    },
    {
      id: 12,
      name: "El Segundo",
      lat: 33.9192,
      lng: -118.4165,
      dealCount: 28,
      avgDealValue: 145000,
      activityLevel: 54,
      priceAppreciation: 5.2,
      color: "rgb(252, 176, 64)", // yellow-400
      size: "small"
    }
  ],
  metrics: {
    totalDeals: 1128,
    avgActivityLevel: 74.2,
    hotspotCount: 6,
    coverageArea: "Greater Los Angeles"
  }
};

export default function MarketHeatmap() {
  const [selectedRegion, setSelectedRegion] = useState<typeof heatmapData.regions[0] | null>(null);
  const [viewMode, setViewMode] = useState<"deals" | "activity" | "appreciation">("deals");
  const [isFullscreen, setIsFullscreen] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getActivityColor = (level: number) => {
    if (level >= 90) return "rgb(220, 38, 38)"; // red-600
    if (level >= 80) return "rgb(239, 68, 68)"; // red-500
    if (level >= 70) return "rgb(245, 101, 101)"; // red-400
    if (level >= 60) return "rgb(251, 146, 60)"; // orange-400
    return "rgb(252, 176, 64)"; // yellow-400
  };

  const getMarkerSize = (size: string) => {
    switch (size) {
      case "extra-large": return "w-8 h-8";
      case "large": return "w-6 h-6";
      case "medium": return "w-5 h-5";
      case "small": return "w-4 h-4";
      default: return "w-5 h-5";
    }
  };

  const getActivityBadge = (level: number) => {
    if (level >= 90) return { label: "🔥 Extremely Hot", color: "bg-red-500/20 text-red-400 border-red-500/30" };
    if (level >= 80) return { label: "🚀 Very Hot", color: "bg-orange-500/20 text-orange-400 border-orange-500/30" };
    if (level >= 70) return { label: "📈 Hot", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" };
    if (level >= 60) return { label: "⚡ Active", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" };
    return { label: "📊 Moderate", color: "bg-slate-500/20 text-slate-400 border-slate-500/30" };
  };

  return (
    <Card className="bg-black border border-slate-900 rounded-[1.5rem] shadow-lg overflow-hidden">
      <CardHeader className="bg-black border-b border-slate-900 pb-6">
        <CardTitle className="flex items-center justify-between text-slate-100 text-2xl">
          Market Activity Heatmap
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className={`bg-black border border-slate-900 rounded-[1.5rem] text-xs ${viewMode === "deals" ? "bg-cyan-500/20 text-cyan-400" : ""}`}
                onClick={() => setViewMode("deals")}
              >
                Deal Volume
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={`bg-black border border-slate-900 rounded-[1.5rem] text-xs ${viewMode === "activity" ? "bg-cyan-500/20 text-cyan-400" : ""}`}
                onClick={() => setViewMode("activity")}
              >
                Activity Level
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={`bg-black border border-slate-900 rounded-[1.5rem] text-xs ${viewMode === "appreciation" ? "bg-cyan-500/20 text-cyan-400" : ""}`}
                onClick={() => setViewMode("appreciation")}
              >
                Price Growth
              </Button>
            </div>
            <div className="p-2 bg-cyan-500/20 rounded-xl">
              <Activity className="h-6 w-6 text-cyan-400" />
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
          
          {/* Interactive Heatmap Visualization */}
          <div className="lg:col-span-2 relative bg-slate-900/50 min-h-[600px] overflow-hidden">
            
            {/* Map Background with Grid */}
            <div className="absolute inset-0 opacity-20">
              <svg width="100%" height="100%" className="text-slate-600">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            {/* Geographic Markers */}
            <div className="absolute inset-0 p-8">
              <div className="relative w-full h-full">
                {heatmapData.regions.map((region, index) => {
                  const x = ((region.lng + 118.5) / 1.0) * 100; // Normalize longitude
                  const y = ((34.3 - region.lat) / 0.6) * 100; // Normalize latitude
                  
                  return (
                    <div
                      key={region.id}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                      style={{ 
                        left: `${Math.max(5, Math.min(95, x))}%`, 
                        top: `${Math.max(5, Math.min(95, y))}%` 
                      }}
                      onClick={() => setSelectedRegion(region)}
                    >
                      {/* Pulse Animation */}
                      <div 
                        className={`absolute ${getMarkerSize(region.size)} rounded-full animate-ping opacity-30`}
                        style={{ backgroundColor: getActivityColor(region.activityLevel) }}
                      />
                      
                      {/* Main Marker */}
                      <div 
                        className={`${getMarkerSize(region.size)} rounded-full border-2 border-white shadow-lg transform transition-all duration-300 group-hover:scale-125 z-10 relative`}
                        style={{ backgroundColor: getActivityColor(region.activityLevel) }}
                      />
                      
                      {/* Hover Label */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                        <div className="bg-slate-900/95 text-white text-xs px-3 py-2 rounded-lg border border-slate-700/50 whitespace-nowrap">
                          <div className="font-semibold">{region.name}</div>
                          <div className="text-slate-300">{region.dealCount} deals</div>
                          <div className="text-slate-300">{formatCurrency(region.avgDealValue)} avg</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Control Panel */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <Button variant="outline" size="sm" className="bg-black border border-slate-900 rounded-[1.5rem]">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm" className="bg-black border border-slate-900 rounded-[1.5rem]">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button variant="outline" size="sm" className="bg-black border border-slate-900 rounded-[1.5rem]">
                <Maximize className="h-4 w-4 mr-2" />
                Fullscreen
              </Button>
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-slate-900/95 rounded-xl p-4 border border-slate-700/50">
              <div className="text-slate-200 text-sm font-semibold mb-3">Activity Level</div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-600"></div>
                  <span className="text-slate-300 text-xs">90%+ (Extremely Hot)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-slate-300 text-xs">80-89% (Very Hot)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <span className="text-slate-300 text-xs">70-79% (Hot)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-400"></div>
                  <span className="text-slate-300 text-xs">60-69% (Active)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <span className="text-slate-300 text-xs">50-59% (Moderate)</span>
                </div>
              </div>
            </div>

            {/* Metrics Overlay */}
            <div className="absolute top-4 right-4 bg-slate-900/95 rounded-xl p-4 border border-slate-700/50">
              <div className="text-slate-200 text-sm font-semibold mb-3">Live Metrics</div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between gap-4">
                  <span className="text-slate-400">Total Deals:</span>
                  <span className="text-slate-200 font-medium">{heatmapData.metrics.totalDeals}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-400">Avg Activity:</span>
                  <span className="text-slate-200 font-medium">{heatmapData.metrics.avgActivityLevel}%</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-400">Hotspots:</span>
                  <span className="text-slate-200 font-medium">{heatmapData.metrics.hotspotCount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Region Details Panel */}
          <div className="bg-slate-800/30 p-6 border-l border-slate-700/30">
            {selectedRegion ? (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-slate-200">{selectedRegion.name}</h3>
                    <Badge className={getActivityBadge(selectedRegion.activityLevel).color + " border"}>
                      {getActivityBadge(selectedRegion.activityLevel).label}
                    </Badge>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-black border border-slate-900 rounded-[1.5rem] p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-400 text-sm">Deal Volume</span>
                        <div className="p-1 bg-blue-500/20 rounded-lg">
                          <TrendingUp className="h-4 w-4 text-blue-400" />
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-white">{selectedRegion.dealCount}</div>
                      <div className="text-slate-500 text-xs mt-1">Total deals this quarter</div>
                    </div>

                    <div className="bg-black border border-slate-900 rounded-[1.5rem] p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-400 text-sm">Avg Deal Value</span>
                        <div className="p-1 bg-emerald-500/20 rounded-lg">
                          <DollarSign className="h-4 w-4 text-emerald-400" />
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-white">{formatCurrency(selectedRegion.avgDealValue)}</div>
                      <div className="text-slate-500 text-xs mt-1">Assignment fee average</div>
                    </div>

                    <div className="bg-black border border-slate-900 rounded-[1.5rem] p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-400 text-sm">Activity Level</span>
                        <div className="p-1 bg-purple-500/20 rounded-lg">
                          <Activity className="h-4 w-4 text-purple-400" />
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-white">{selectedRegion.activityLevel}%</div>
                      <div className="text-slate-500 text-xs mt-1">Market activity score</div>
                    </div>

                    <div className="bg-black border border-slate-900 rounded-[1.5rem] p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-400 text-sm">Price Appreciation</span>
                        <div className="p-1 bg-orange-500/20 rounded-lg">
                          <Zap className="h-4 w-4 text-orange-400" />
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-white">+{selectedRegion.priceAppreciation}%</div>
                      <div className="text-slate-500 text-xs mt-1">Year over year growth</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button className="w-full bg-black border-b border-slate-900 hover:from-cyan-600 hover:to-cyan-700 text-white font-medium py-2 px-4 rounded-xl">
                    <Eye className="h-4 w-4 mr-2" />
                    View Listings
                  </Button>
                  <Button variant="outline" className="w-full bg-black border border-slate-900 rounded-[1.5rem]">
                    <MapPin className="h-4 w-4 mr-2" />
                    Get Directions
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-700/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-300 mb-2">Select a Region</h3>
                <p className="text-slate-400 text-sm">Click on any marker to view detailed market data and activity metrics</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}