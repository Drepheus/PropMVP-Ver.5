import { PropertyWithDetails } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tag, Circle } from "lucide-react";

interface ListingStatusProps {
  property: PropertyWithDetails;
}

export default function ListingStatus({ property }: ListingStatusProps) {
  const formatPrice = (price: string | null) => {
    if (!price) return "N/A";
    return `$${parseInt(price).toLocaleString()}`;
  };

  const formatPriceShort = (price: string | null) => {
    if (!price) return "N/A";
    const num = parseInt(price);
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `$${(num / 1000).toFixed(0)}K`;
    }
    return `$${num.toLocaleString()}`;
  };

  return (
    <Card className="bg-black border border-slate-900 rounded-[1.5rem] shadow-lg overflow-hidden">
      <CardHeader className="bg-black border-b border-slate-900 pb-4">
        <CardTitle className="flex items-center justify-between text-slate-100 text-xl">
          Listing Status
          <div className="p-2 bg-emerald-500/20 rounded-xl">
            <Tag className="h-6 w-6 text-emerald-400" />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="text-center bg-black border-b border-slate-900 rounded-2xl p-6 border border-emerald-500/20">
            <div className="text-4xl font-bold text-white mb-2">
              {formatPrice(property.listPrice)}
            </div>
            <div className="text-slate-400 text-sm font-medium uppercase tracking-wide">Current List Price</div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center py-4 px-4 rounded-xl hover:bg-slate-700/20 transition-all duration-200 border-b border-slate-700/30">
              <span className="text-slate-400 font-medium">Status</span>
              <Badge className="status-active">
                <Circle className="mr-2 h-3 w-3 fill-current" />
                {property.listingStatus || "Not Listed"}
              </Badge>
            </div>
            <div className="flex justify-between items-center py-4 px-4 rounded-xl hover:bg-slate-700/20 transition-all duration-200 border-b border-slate-700/30">
              <span className="text-slate-400 font-medium">Days on Market</span>
              <span className="text-slate-200 font-bold bg-slate-700/30 px-3 py-1 rounded-full">
                {property.daysOnMarket || 0} days
              </span>
            </div>
            <div className="flex justify-between items-center py-4 px-4 rounded-xl hover:bg-slate-700/20 transition-all duration-200 border-b border-slate-700/30">
              <span className="text-slate-400 font-medium">Price/Sq Ft</span>
              <span className="text-slate-200 font-bold bg-slate-700/30 px-3 py-1 rounded-full">
                ${property.pricePerSqft || "N/A"}
              </span>
            </div>
            <div className="flex justify-between items-center py-4 px-4 rounded-xl hover:bg-slate-700/20 transition-all duration-200">
              <span className="text-slate-400 font-medium">Last Sale</span>
              <span className="text-slate-200 font-bold bg-slate-700/30 px-3 py-1 rounded-full">
                {formatPriceShort(property.lastSalePrice)} ({property.lastSaleDate ? new Date(property.lastSaleDate).getFullYear() : "N/A"})
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
