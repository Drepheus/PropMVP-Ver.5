import { PropertyWithDetails } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, MapPin, Home, AlertTriangle } from "lucide-react";

interface PropertyImageProps {
  property: PropertyWithDetails;
}

export default function PropertyImage({ property }: PropertyImageProps) {
  // Generate a placeholder image URL using a service like Unsplash with property-related keywords
  const getPropertyImageUrl = (property: PropertyWithDetails) => {
    const searchTerms = [
      property.propertyType?.toLowerCase().replace(/\s+/g, '-') || 'house',
      property.city?.toLowerCase().replace(/\s+/g, '-') || 'home',
      'exterior'
    ].join(',');
    
    // Use Unsplash for high-quality property placeholder images
    return `https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80`;
  };

  const propertyImageUrl = getPropertyImageUrl(property);
  const isDataLimited = property.listingStatus === "Data Unavailable" || 
                       property.propertyType === "Data Unavailable";

  return (
    <Card className="bg-black border border-slate-900 rounded-[1.5rem] shadow-lg overflow-hidden" data-tour="property-image">
      <CardHeader className="bg-black border-b border-slate-900 pb-4">
        <CardTitle className="flex items-center justify-between text-slate-100 text-xl">
          <div className="flex items-center gap-3">
            Property Image & Overview
            {isDataLimited && (
              <Badge variant="secondary" className="bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Limited Data
              </Badge>
            )}
          </div>
          <div className="p-2 bg-emerald-500/20 rounded-xl">
            <Camera className="h-6 w-6 text-emerald-400" />
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        {/* Property Image */}
        <div className="relative">
          <img 
            src={propertyImageUrl}
            alt={`Property at ${property.address}`}
            className="w-full h-64 sm:h-80 lg:h-96 object-cover"
            onError={(e) => {
              // Fallback to a different image if the first one fails
              const target = e.target as HTMLImageElement;
              target.src = `https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80`;
            }}
          />
          
          {/* Overlay with property info */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="space-y-2">
                <div className="flex items-center text-white text-lg font-semibold">
                  <MapPin className="h-5 w-5 mr-2 text-emerald-400" />
                  {property.address}
                </div>
                <div className="text-slate-300 text-base">
                  {property.city}, {property.state} {property.zipCode}
                </div>
                
                {/* Quick property stats */}
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-2 bg-black/40 rounded-lg px-3 py-2">
                    <Home className="h-4 w-4 text-blue-400" />
                    <span className="text-white text-sm font-medium">
                      {property.propertyType || "Property"}
                    </span>
                  </div>
                  
                  {property.beds && property.baths && (
                    <div className="flex items-center gap-2 bg-black/40 rounded-lg px-3 py-2">
                      <span className="text-white text-sm font-medium">
                        {property.beds} bed, {property.baths} bath
                      </span>
                    </div>
                  )}
                  
                  {property.sqft && property.sqft > 0 && (
                    <div className="flex items-center gap-2 bg-black/40 rounded-lg px-3 py-2">
                      <span className="text-white text-sm font-medium">
                        {property.sqft.toLocaleString()} sq ft
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Price information */}
                {property.listPrice && (
                  <div className="mt-4">
                    <div className="text-2xl font-bold text-emerald-400">
                      ${parseInt(property.listPrice).toLocaleString()}
                    </div>
                    {property.sqft && property.sqft > 0 && (
                      <div className="text-sm text-slate-300">
                        ${Math.round(parseInt(property.listPrice) / property.sqft)}/sq ft
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Property Status Bar */}
        <div className="p-4 bg-slate-800/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              <span className="text-slate-300 text-sm font-medium">
                Status: {property.listingStatus || "Active"}
              </span>
            </div>
            
            {property.yearBuilt && property.yearBuilt > 0 && (
              <div className="text-slate-400 text-sm">
                Built in {property.yearBuilt}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}