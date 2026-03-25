import { PropertyWithDetails } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, Database } from "lucide-react";

interface PropertyHeaderProps {
  property: PropertyWithDetails;
}

export default function PropertyHeader({ property }: PropertyHeaderProps) {
  const fullAddress = `${property.address}, ${property.city}, ${property.state} ${property.zipCode}`;
  
  // Determine data availability status
  const isDataLimited = property.listingStatus === "Data Unavailable" || 
                       property.propertyType === "Data Unavailable" ||
                       (property.sqft === 0 && property.yearBuilt === 0);
  
  return (
    <Card className="premium-card rounded-3xl shadow-2xl overflow-hidden">
      <CardContent className="p-0">
        <div className="relative bg-black border-b border-slate-900 p-8">
          <div className="absolute inset-0 bg-black border-b border-slate-900"></div>
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-4">
                <h2 className="text-3xl font-bold text-slate-100 mb-2 sm:mb-0">{fullAddress}</h2>
                <div className="flex gap-2">
                  <Badge className="status-active w-fit">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Property Found
                  </Badge>
                  {isDataLimited && (
                    <Badge variant="secondary" className="bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      <Database className="mr-2 h-3 w-3" />
                      API Data Limited
                    </Badge>
                  )}
                </div>
              </div>
              <p className="text-slate-400 text-lg mb-6 flex items-center space-x-2">
                <span className="bg-slate-700/40 px-3 py-1 rounded-full text-sm">
                  {property.propertyType}
                </span>
                <span>•</span>
                <span className="bg-slate-700/40 px-3 py-1 rounded-full text-sm">
                  Built {property.yearBuilt}
                </span>
                <span>•</span>
                <span className="bg-slate-700/40 px-3 py-1 rounded-full text-sm">
                  Last sold {property.lastSaleDate ? new Date(property.lastSaleDate).getFullYear() : 'N/A'}
                </span>
              </p>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-black border border-slate-900 rounded-[1.5rem] p-6 text-center group hover:scale-105 transition-transform duration-300">
                  <div className="text-3xl font-bold text-white mb-1">{property.beds}</div>
                  <div className="text-sm text-slate-400 font-medium">Bedrooms</div>
                </div>
                <div className="bg-black border border-slate-900 rounded-[1.5rem] p-6 text-center group hover:scale-105 transition-transform duration-300">
                  <div className="text-3xl font-bold text-white mb-1">{property.baths}</div>
                  <div className="text-sm text-slate-400 font-medium">Bathrooms</div>
                </div>
                <div className="bg-black border border-slate-900 rounded-[1.5rem] p-6 text-center group hover:scale-105 transition-transform duration-300">
                  <div className="text-3xl font-bold text-white mb-1">{property.sqft?.toLocaleString()}</div>
                  <div className="text-sm text-slate-400 font-medium">Sq Ft</div>
                </div>
                <div className="bg-black border border-slate-900 rounded-[1.5rem] p-6 text-center group hover:scale-105 transition-transform duration-300">
                  <div className="text-3xl font-bold text-white mb-1">{property.yearBuilt}</div>
                  <div className="text-sm text-slate-400 font-medium">Year Built</div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 lg:mt-0 lg:ml-10">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400" 
                  alt="Property exterior view" 
                  className="w-full lg:w-96 h-64 object-cover rounded-2xl shadow-2xl border border-slate-600/30"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center justify-between">
                    <div className="bg-black border border-slate-900 rounded-[1.5rem] px-3 py-2 rounded-full">
                      <span className="text-white text-sm font-medium">Street View</span>
                    </div>
                    <div className="bg-black border border-slate-900 rounded-[1.5rem] px-3 py-2 rounded-full">
                      <span className="text-emerald-400 text-sm font-medium">Active Listing</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
