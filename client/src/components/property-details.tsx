import { PropertyWithDetails } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PropertyDetailsProps {
  property: PropertyWithDetails;
}

export default function PropertyDetails({ property }: PropertyDetailsProps) {
  // Check if data appears to be unavailable (indicating missing API key)
  const isDataLimited = property.listingStatus === "Data Unavailable" || 
                       property.propertyType === "Data Unavailable" ||
                       (property.sqft === 0 && property.yearBuilt === 0);

  const basicDetails = [
    { label: "Property Type", value: property.propertyType || "N/A", icon: Home },
    { label: "Bedrooms", value: property.beds || "N/A", icon: Home },
    { label: "Bathrooms", value: property.baths || "N/A", icon: Home },
    { label: "Square Feet", value: property.sqft ? `${property.sqft.toLocaleString()} sq ft` : "N/A", icon: Home },
  ];

  const additionalDetails = [
    { label: "Lot Size", value: property.lotSize || "N/A" },
    { label: "Year Built", value: property.yearBuilt || "N/A" },
    { label: "Parking", value: property.parking || "N/A" },
    { label: "Pool", value: property.hasPool ? "Yes" : "No" },
    { label: "HOA", value: property.hoaFees && property.hoaFees !== "0.00" ? `$${property.hoaFees}/month` : "None" },
  ];

  return (
    <Card className="bg-black border border-slate-900 rounded-[1.5rem] shadow-lg overflow-hidden h-fit" data-tour="property-overview">
      <CardHeader className="bg-black border-b border-slate-900 pb-4">
        <CardTitle className="flex items-center justify-between text-slate-100 text-xl">
          <div className="flex items-center gap-3">
            Property Details
            {isDataLimited && (
              <Badge variant="secondary" className="bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Limited Data
              </Badge>
            )}
          </div>
          <div className="p-2 bg-blue-500/20 rounded-xl">
            <Home className="h-6 w-6 text-blue-400" />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Basic Property Info */}
        <div className="space-y-3">
          <h4 className="text-slate-300 font-semibold text-sm uppercase tracking-wide">Basic Information</h4>
          <div className="grid grid-cols-2 gap-3">
            {basicDetails.map((detail) => (
              <div key={detail.label} className="bg-slate-800/30 rounded-lg p-3">
                <div className="text-slate-400 text-xs uppercase tracking-wide">{detail.label}</div>
                <div className="text-slate-200 font-semibold text-sm mt-1">{detail.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Details */}
        <div className="space-y-3">
          <h4 className="text-slate-300 font-semibold text-sm uppercase tracking-wide">Additional Details</h4>
          <div className="space-y-2">
            {additionalDetails.map((detail, index) => (
              <div 
                key={detail.label}
                className="flex justify-between items-center py-2 px-3 rounded-lg transition-all duration-200 hover:bg-slate-800/30"
              >
                <span className="text-slate-400 text-sm font-medium">{detail.label}</span>
                <span className={`font-semibold text-sm ${
                  detail.label === "Pool" && property.hasPool 
                    ? "text-emerald-400" 
                    : "text-slate-200"
                }`}>
                  {detail.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
