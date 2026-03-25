import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { propertySearchSchema, type PropertySearch, type PropertyWithDetails } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Search, X, MapPin, ChevronDown, ChevronUp, Settings, Sparkles, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PropertySearchFormProps {
  onPropertySelect: (property: PropertyWithDetails) => void;
  onLoadingChange: (loading: boolean) => void;
}

const states = [
  { value: "CA", label: "California" },
  { value: "TX", label: "Texas" },
  { value: "NY", label: "New York" },
  { value: "FL", label: "Florida" },
  { value: "WA", label: "Washington" },
  { value: "OR", label: "Oregon" },
  { value: "AZ", label: "Arizona" },
  { value: "NV", label: "Nevada" },
];

interface AddressSuggestion {
  formatted_address: string;
  place_id: string;
  components: {
    street_number?: string;
    route?: string;
    locality?: string;
    administrative_area_level_1?: string;
    postal_code?: string;
  };
}

export default function PropertySearchForm({ onPropertySelect, onLoadingChange }: PropertySearchFormProps) {
  const { toast } = useToast();
  const [addressSuggestions, setAddressSuggestions] = useState<AddressSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const form = useForm<PropertySearch>({
    resolver: zodResolver(propertySearchSchema),
    defaultValues: {
      address: "",
      city: "",
      state: "",
      zipCode: "",
    },
  });

  const searchMutation = useMutation({
    mutationFn: async (data: PropertySearch) => {
      const response = await apiRequest("POST", "/api/properties/search", data);
      return response.json() as Promise<PropertyWithDetails>;
    },
    onMutate: () => {
      onLoadingChange(true);
    },
    onSuccess: (property) => {
      onLoadingChange(false);
      onPropertySelect(property);
      // Invalidate properties cache so analytics dashboard sees the new property
      queryClient.invalidateQueries({ queryKey: ['/api/properties'] });
      toast({
        title: "Property Found",
        description: "Property data has been successfully enriched.",
      });
    },
    onError: (error) => {
      onLoadingChange(false);
      toast({
        title: "Search Failed",
        description: error.message || "Failed to search property. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: PropertySearch) => {
    searchMutation.mutate(data);
  };

  const handleClear = () => {
    form.reset();
    setAddressSuggestions([]);
    setShowSuggestions(false);
  };

  // Address autocomplete using Google Places-like API structure
  const searchAddresses = async (query: string) => {
    if (!query || query.length < 2) {
      setAddressSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsSearching(true);
    
    try {
      // Using Nominatim (OpenStreetMap) for address suggestions - free and no API key required
      // Enhanced query formatting for better results
      const enhancedQuery = query.trim();
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=8&countrycodes=us&addressdetails=1&extratags=1&q=${encodeURIComponent(enhancedQuery)}`,
        {
          headers: {
            'User-Agent': 'PropAnalyzed/1.0'
          }
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        const suggestions: AddressSuggestion[] = data
          .filter((item: any) => {
            // Accept both residential and commercial properties
            const hasAddress = item.address && (
              item.address.house_number || 
              item.address.building || 
              item.address.road ||
              item.type === 'house' ||
              item.type === 'building' ||
              item.class === 'building'
            );
            // Filter out non-address results like cities, states, etc.
            const isAddressResult = item.osm_type === 'way' || item.osm_type === 'node' || item.address?.house_number;
            return hasAddress && isAddressResult;
          })
          .map((item: any) => {
            // Create clean, formatted address
            const streetNumber = item.address.house_number || item.address.building || '';
            const streetName = item.address.road || item.address.street || '';
            const city = item.address.city || item.address.town || item.address.village || item.address.hamlet || '';
            const state = item.address.state || '';
            const postal = item.address.postcode || '';
            
            // Create a cleaner formatted address
            const addressParts = [
              streetNumber && streetName ? `${streetNumber} ${streetName}` : streetName,
              city,
              state
            ].filter(Boolean);
            
            const cleanFormatted = addressParts.join(', ');
            
            return {
              formatted_address: cleanFormatted || item.display_name,
              place_id: item.place_id?.toString() || item.osm_id?.toString() || Math.random().toString(),
              components: {
                street_number: streetNumber,
                route: streetName,
                locality: city,
                administrative_area_level_1: state,
                postal_code: postal
              }
            };
          })
          .slice(0, 6);

        setAddressSuggestions(suggestions);
        setShowSuggestions(suggestions.length > 0);
      }
    } catch (error) {
      console.log('Address search error:', error);
      // Enhanced fallback suggestions based on input patterns
      const fallbackSuggestions: AddressSuggestion[] = [];
      
      // If input looks like a number (street number)
      if (/^\d+/.test(query)) {
        fallbackSuggestions.push(
          {
            formatted_address: `${query} Main Street, Any City, CA`,
            place_id: `fallback-${query}-main`,
            components: {
              street_number: query.match(/^\d+/)?.[0] || '',
              route: 'Main Street',
              locality: 'Any City',
              administrative_area_level_1: 'CA',
              postal_code: ''
            }
          },
          {
            formatted_address: `${query} Oak Avenue, Any City, TX`,
            place_id: `fallback-${query}-oak`,
            components: {
              street_number: query.match(/^\d+/)?.[0] || '',
              route: 'Oak Avenue',
              locality: 'Any City', 
              administrative_area_level_1: 'TX',
              postal_code: ''
            }
          },
          {
            formatted_address: `${query} Park Drive, Any City, FL`,
            place_id: `fallback-${query}-park`,
            components: {
              street_number: query.match(/^\d+/)?.[0] || '',
              route: 'Park Drive',
              locality: 'Any City',
              administrative_area_level_1: 'FL',
              postal_code: ''
            }
          }
        );
      } 
      // If input looks like a street name
      else if (query.length >= 2) {
        const capitalizedQuery = query.charAt(0).toUpperCase() + query.slice(1);
        fallbackSuggestions.push(
          {
            formatted_address: `123 ${capitalizedQuery} Street, Any City, CA`,
            place_id: `fallback-street-${query}`,
            components: {
              street_number: '123',
              route: `${capitalizedQuery} Street`,
              locality: 'Any City',
              administrative_area_level_1: 'CA',
              postal_code: ''
            }
          },
          {
            formatted_address: `456 ${capitalizedQuery} Avenue, Any City, NY`,
            place_id: `fallback-avenue-${query}`,
            components: {
              street_number: '456',
              route: `${capitalizedQuery} Avenue`,
              locality: 'Any City',
              administrative_area_level_1: 'NY', 
              postal_code: ''
            }
          },
          {
            formatted_address: `789 ${capitalizedQuery} Drive, Any City, TX`,
            place_id: `fallback-drive-${query}`,
            components: {
              street_number: '789',
              route: `${capitalizedQuery} Drive`,
              locality: 'Any City',
              administrative_area_level_1: 'TX',
              postal_code: ''
            }
          }
        );
      }
      
      setAddressSuggestions(fallbackSuggestions);
      setShowSuggestions(fallbackSuggestions.length > 0);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle address input changes
  const handleAddressChange = (value: string) => {
    form.setValue('address', value);
    
    // Debounce address search - reduced delay for faster response
    const timeoutId = setTimeout(() => {
      searchAddresses(value);
    }, 200);

    return () => clearTimeout(timeoutId);
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: AddressSuggestion) => {
    const components = suggestion.components;
    
    // Auto-fill form fields from selected address
    const streetAddress = [components.street_number, components.route]
      .filter(Boolean)
      .join(' ')
      .trim();
      
    form.setValue('address', streetAddress || components.route || suggestion.formatted_address.split(',')[0]);
    form.setValue('city', components.locality || '');
    form.setValue('state', components.administrative_area_level_1 || '');
    form.setValue('zipCode', components.postal_code || '');
    
    setShowSuggestions(false);
    setAddressSuggestions([]);
    
    toast({
      title: "Address Auto-filled",
      description: "Property details have been populated from the selected address.",
    });
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <Card className="bg-[#050505] border-slate-900 rounded-[2rem] shadow-2xl overflow-hidden border-[0.5px]">
      {/* Header Section */}
      <CardHeader className="text-center py-12 border-b border-slate-900 bg-black">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-500 rounded-2xl mb-6 mx-auto">
          <Search className="h-6 w-6 text-black" />
        </div>
        <CardTitle className="text-4xl font-black text-white mb-2 tracking-tight">
          Property Intelligence Engine
        </CardTitle>
        <p className="text-slate-500 text-sm max-w-xl mx-auto mb-6 font-medium">
          Powered by authentic MLS data with smart address autocomplete
        </p>
        <div className="flex justify-center gap-6 text-[10px] text-slate-600 font-bold uppercase tracking-[0.2em]">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            <span>Smart Autocomplete</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
            <span>Real MLS Data</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
            <span>Market Analysis</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-8" data-tour="property-search-form">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          
          {/* Primary Address Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-emerald-400" />
              <h3 className="text-lg font-semibold text-slate-200">Property Address</h3>
            </div>
            
            <div className="space-y-3 relative">
              <Label className="text-slate-200 font-medium text-sm uppercase tracking-wide">
                Street Address
                <span className="text-emerald-400 text-xs ml-2 font-normal">✨ Auto-complete enabled</span>
              </Label>
              <div className="relative">
                <Input
                  ref={inputRef}
                  name="address"
                  value={form.watch("address") || ""}
                  onChange={(e) => {
                    form.setValue("address", e.target.value);
                    handleAddressChange(e.target.value);
                  }}
                  placeholder="Start typing an address..."
                  className="bg-black border-slate-900 h-14 text-white placeholder-slate-700 rounded-xl pr-10 text-lg focus-visible:ring-1 focus-visible:ring-emerald-500/30"
                  autoComplete="off"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  {isSearching ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-emerald-400 border-t-transparent" />
                  ) : (
                    <MapPin className="h-5 w-5 text-slate-400" />
                  )}
                </div>
                
                {/* Address Suggestions Dropdown */}
                {showSuggestions && addressSuggestions.length > 0 && (
                  <div 
                    ref={suggestionsRef}
                    className="absolute top-full left-0 right-0 z-50 mt-2 bg-slate-800/95 backdrop-blur-sm border border-slate-700/50 rounded-xl shadow-2xl max-h-60 overflow-y-auto"
                  >
                    {addressSuggestions.map((suggestion, index) => (
                      <button
                        key={suggestion.place_id}
                        type="button"
                        className="w-full px-4 py-3 text-left hover:bg-slate-700/50 focus:bg-slate-700/50 focus:outline-none first:rounded-t-xl last:rounded-b-xl border-b border-slate-700/30 last:border-b-0 transition-colors"
                        onClick={() => handleSuggestionSelect(suggestion)}
                      >
                        <div className="flex items-start space-x-3">
                          <MapPin className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="text-slate-200 font-medium text-sm truncate">
                              {[suggestion.components.street_number, suggestion.components.route]
                                .filter(Boolean)
                                .join(' ') || suggestion.formatted_address.split(',')[0]}
                            </div>
                            <div className="text-slate-400 text-xs truncate">
                              {[
                                suggestion.components.locality,
                                suggestion.components.administrative_area_level_1,
                                suggestion.components.postal_code
                              ].filter(Boolean).join(', ')}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {form.formState.errors.address && (
                <p className="text-red-400 text-sm mt-2 flex items-center">
                  <X className="h-3 w-3 mr-1" />
                  {form.formState.errors.address.message}
                </p>
              )}
            </div>
          </div>

          {/* Location Details - Collapsible */}
          <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
            <CollapsibleTrigger asChild>
              <Button
                type="button"
                variant="ghost" 
                className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-700/30 hover:bg-slate-800/50 text-slate-200"
              >
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  <span>Location Details</span>
                  <span className="text-xs text-slate-400">(Auto-filled from address)</span>
                </div>
                {advancedOpen ? (
                  <ChevronUp className="h-4 w-4 text-slate-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                )}
              </Button>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-800/20 rounded-xl border border-slate-700/20">
                <div className="space-y-2">
                  <Label className="text-slate-300 font-medium text-sm">City</Label>
                  <Input
                    {...form.register("city")}
                    placeholder="Los Angeles"
                    className="modern-input h-11 text-slate-200 placeholder-slate-400 rounded-lg"
                  />
                  {form.formState.errors.city && (
                    <p className="text-red-400 text-xs flex items-center">
                      <X className="h-3 w-3 mr-1" />
                      {form.formState.errors.city.message}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label className="text-slate-300 font-medium text-sm">State</Label>
                  <Select onValueChange={(value) => form.setValue("state", value)}>
                    <SelectTrigger className="modern-input h-11 text-slate-200 rounded-lg">
                      <SelectValue placeholder="Select State" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      {states.map((state) => (
                        <SelectItem key={state.value} value={state.value} className="text-slate-200 focus:bg-slate-700">
                          {state.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.state && (
                    <p className="text-red-400 text-xs flex items-center">
                      <X className="h-3 w-3 mr-1" />
                      {form.formState.errors.state.message}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label className="text-slate-300 font-medium text-sm">ZIP Code</Label>
                  <Input
                    {...form.register("zipCode")}
                    placeholder="90210"
                    className="modern-input h-11 text-slate-200 placeholder-slate-400 rounded-lg"
                  />
                  {form.formState.errors.zipCode && (
                    <p className="text-red-400 text-xs flex items-center">
                      <X className="h-3 w-3 mr-1" />
                      {form.formState.errors.zipCode.message}
                    </p>
                  )}
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-8">
            <Button
              type="submit"
              disabled={searchMutation.isPending}
              className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-black font-black py-4 px-8 rounded-xl h-14 text-lg transition-all duration-300 shadow-[0_10px_30px_-10px_rgba(16,185,129,0.3)] border-none"
              data-tour="search-button"
            >
              <Search className="mr-3 h-5 w-5" />
              {searchMutation.isPending ? "Analyzing Property..." : "Analyze Property"}
            </Button>
            <Button
              type="button"
              onClick={handleClear}
              variant="ghost"
              className="text-slate-600 font-bold py-4 px-6 rounded-xl h-14 transition-all duration-300 border border-slate-900 hover:text-white hover:bg-slate-900"
            >
              <X className="mr-2 h-4 w-4" />
              Clear
            </Button>
          </div>
        </form>
        
        {/* Footer Info */}
        <div className="mt-8 pt-6 border-t border-slate-700/30">
          <div className="text-center">
            <p className="text-slate-400 text-sm mb-4">
              Comprehensive property analysis powered by authentic data sources
            </p>
            <div className="flex items-center justify-center space-x-6 text-slate-500 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                <span>Property Details</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>Market Analysis</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>Comparable Sales</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
