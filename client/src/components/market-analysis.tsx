import { PropertyWithDetails } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, BarChart3 } from "lucide-react";

interface MarketAnalysisProps {
  property: PropertyWithDetails;
}

export default function MarketAnalysis({ property }: MarketAnalysisProps) {
  const { marketMetrics } = property;
  
  // Mock chart data for visualization
  const chartData = [
    { month: "Jan", height: 40 },
    { month: "Feb", height: 55 },
    { month: "Mar", height: 48 },
    { month: "Apr", height: 62 },
    { month: "May", height: 70 },
    { month: "Jun", height: 85 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" data-tour="market-analysis">
      {/* Market Intelligence Card */}
      <Card className="bg-black border border-slate-900 rounded-[1.5rem] shadow-lg overflow-hidden h-fit">
        <CardHeader className="bg-black border-b border-slate-900 pb-4">
          <CardTitle className="flex items-center justify-between text-slate-100 text-xl">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/20 rounded-xl">
                <BarChart3 className="h-5 w-5 text-blue-400" />
              </div>
              Market Intelligence
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="space-y-3">
              <h4 className="text-slate-300 font-semibold text-sm uppercase tracking-wide">Key Metrics</h4>
              <div className="grid grid-cols-1 gap-3">
                <div className="bg-slate-800/30 rounded-lg p-4 hover:bg-slate-800/40 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm">Avg Days on Market</span>
                    <span className="text-2xl font-bold text-blue-400">
                      {marketMetrics?.avgDaysOnMarket || 0}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">Neighborhood average</div>
                </div>
                
                <div className="bg-slate-800/30 rounded-lg p-4 hover:bg-slate-800/40 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm">Median Sale Price</span>
                    <span className="text-2xl font-bold text-emerald-400">
                      {marketMetrics?.medianSalePrice ? 
                        `$${(parseInt(marketMetrics.medianSalePrice) / 1000000).toFixed(1)}M` : 
                        "N/A"
                      }
                    </span>
                  </div>
                  <div className="text-xs text-emerald-400 mt-1">
                    +{marketMetrics?.priceAppreciation || 0}% YoY
                  </div>
                </div>
                
                <div className="bg-slate-800/30 rounded-lg p-4 hover:bg-slate-800/40 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm">Price per Sq Ft</span>
                    <span className="text-2xl font-bold text-purple-400">
                      ${marketMetrics?.avgPricePerSqft || 0}
                    </span>
                  </div>
                  <div className="text-xs text-purple-400 mt-1">+12.3% YoY</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-black border border-slate-900 rounded-[1.5rem] shadow-lg overflow-hidden">
        <CardHeader className="bg-black border-b border-slate-900 pb-6">
          <CardTitle className="flex items-center justify-between text-slate-100 text-2xl">
            Price Trend Analysis
            <div className="p-2 bg-emerald-500/20 rounded-xl">
              <TrendingUp className="h-6 w-6 text-emerald-400" />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="bg-slate-800/30 rounded-2xl p-6">
            <div className="h-64 flex items-end justify-between space-x-3">
              {chartData.map((data, index) => (
                <div key={data.month} className="flex flex-col items-center space-y-3 flex-1 group">
                  <div 
                    className={`w-full rounded-t-lg transition-all duration-500 hover:scale-105 ${
                      index === chartData.length - 1 
                        ? 'bg-black border-b border-slate-900 shadow-lg shadow-emerald-500/25' 
                        : 'bg-black border-b border-slate-900 shadow-lg shadow-blue-500/25'
                    }`}
                    style={{ height: `${data.height}px` }}
                  />
                  <span className="text-xs text-slate-400 font-medium group-hover:text-slate-300 transition-colors">
                    {data.month}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-slate-700/20 rounded-xl">
              <div className="flex items-center justify-between">
                <p className="text-slate-400 text-sm font-medium">6-month price trend</p>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-slate-400 text-xs">Historical</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></div>
                    <span className="text-slate-400 text-xs">Current</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
