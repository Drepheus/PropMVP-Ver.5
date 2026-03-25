import { useState } from "react";
import { 
  TrendingUp, 
  MapPin, 
  Calendar, 
  Layers, 
  StickyNote, 
  Flag, 
  Target, 
  Zap,
  ArrowLeft,
  RefreshCw,
  MoreVertical,
  CheckCircle2,
  Home,
  User,
  Phone,
  Clock,
  ChevronDown
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { PropertyWithDetails } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

interface PropertyTriageViewProps {
  property: PropertyWithDetails;
}

export default function PropertyTriageView({ property }: PropertyTriageViewProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [notes, setNotes] = useState(property.currentLead?.notes || "");

  const claimMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/leads/claim", { propertyId: property.id });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leads"] });
      queryClient.invalidateQueries({ queryKey: ["/api/properties/search"] });
      toast({ title: "Property Claimed", description: "This deal has been added to your pipeline." });
    }
  });

  const updateNotesMutation = useMutation({
    mutationFn: async (newNotes: string) => {
      if (!property.currentLead) return;
      await apiRequest("PATCH", `/api/leads/${property.currentLead.id}/notes`, { notes: newNotes });
    }
  });

  return (
    <div className="bg-black min-h-screen text-white p-6 space-y-6">
      {/* Top Header */}
      <div className="flex justify-between items-center px-2">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-emerald-500 rounded flex items-center justify-center">
              <Home className="h-3.5 w-3.5 text-black" />
            </div>
            <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Property Intelligence</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold cursor-pointer hover:text-slate-300">
            <span>Analyzed</span>
            <ChevronDown className="h-3 w-3" />
          </div>
          <Button variant="ghost" size="sm" className="text-slate-300 gap-2 border border-slate-800 hover:bg-slate-900 h-9">
            <RefreshCw className="h-3.5 w-3.5" />
            Re-analyze
          </Button>
        </div>
      </div>

      {/* Hero Section: Address & Signal Bar */}
      <div className="px-2">
        <h1 className="text-4xl font-bold tracking-tight mb-2 text-white">{property.address.toLowerCase()}</h1>
        <div className="text-[10px] text-slate-500 flex items-center gap-2 mb-6 font-medium">
          <span>Last analyzed 2/19/2026, 6:16:05 PM</span>
          <span className="text-emerald-500 font-bold uppercase tracking-widest">refreshed</span>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 px-3 py-1.5 gap-2 rounded-full font-bold text-[11px] shadow-sm">
             <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
             Property verified
          </Badge>
          <Badge className="bg-blue-500/10 text-blue-400 border border-blue-500/10 px-3 py-1.5 gap-2 rounded-full font-bold text-[11px] shadow-sm">
             Strong rent yield
          </Badge>
          <Badge className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/10 px-3 py-1.5 gap-2 rounded-full font-bold text-[11px] shadow-sm">
             Stable comps
          </Badge>
          <Badge className="bg-amber-500/10 text-amber-500 border border-amber-500/10 px-3 py-1.5 gap-2 rounded-full font-bold text-[11px] shadow-sm">
             Fresh activity
          </Badge>
        </div>
      </div>

      {/* Main Intelligence Grid */}
      <Card className="bg-[#050505] border-slate-900 rounded-2xl overflow-hidden mb-8 border-[0.5px]">
        <CardContent className="p-10">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-y-12 gap-x-12">
            {/* Top Row: Physical Stats */}
            <div className="space-y-2">
              <div className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                <Home className="h-3 w-3 text-emerald-500/50" /> Beds
              </div>
              <div className="text-3xl font-bold tracking-tight">{property.beds || "—"}</div>
            </div>
            <div className="space-y-2">
              <div className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                <Zap className="h-3 w-3 text-emerald-500/50" /> Baths
              </div>
              <div className="text-3xl font-bold tracking-tight">{property.baths || "—"}</div>
            </div>
            <div className="space-y-2">
              <div className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                <Layers className="h-3 w-3 text-emerald-500/50" /> Sq Ft
              </div>
              <div className="text-3xl font-bold tracking-tight">{property.sqft?.toLocaleString() || "—"}</div>
            </div>
            <div className="space-y-2">
              <div className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                <Calendar className="h-3 w-3 text-emerald-500/50" /> Year Built
              </div>
              <div className="text-3xl font-bold tracking-tight">{property.yearBuilt || "—"}</div>
            </div>
            
            {/* Street View Coming Soon Placeholder */}
            <div className="hidden lg:flex flex-col items-center justify-center border-l border-slate-900 pl-12 row-span-2">
               <div className="w-16 h-16 bg-slate-950 rounded-2xl flex items-center justify-center mb-4 border border-slate-900">
                 <RefreshCw className="h-7 w-7 text-slate-800" />
               </div>
               <span className="text-[9px] text-slate-600 font-black uppercase tracking-[0.2em] text-center max-w-[80px]">Street View coming soon</span>
            </div>

            {/* Bottom Row: Financial Signals */}
            <div className="space-y-2">
              <div className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Est. Value</div>
              <div className="text-3xl font-bold tracking-tight text-white">${parseFloat(property.estimatedValue || "0").toLocaleString()}</div>
            </div>
            <div className="space-y-2">
              <div className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-1.5">
                Mortgage <Flag className="h-3 w-3 text-slate-800" />
              </div>
              <div className="text-3xl font-bold tracking-tight text-white">$255,000</div>
            </div>
            <div className="space-y-2">
              <div className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-1.5">
                Equity <Flag className="h-3 w-3 text-slate-800" />
              </div>
              <div className="text-3xl font-bold tracking-tight text-white">${parseFloat(property.equity || "0").toLocaleString()}</div>
            </div>
            <div className="space-y-2">
              <div className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-1.5">
                Deal Score <Flag className="h-3 w-3 text-slate-800" />
              </div>
              <div className="text-3xl font-bold tracking-tight text-emerald-400">8<span className="text-slate-700 text-lg">/10</span></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sub-Details Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 px-2 pb-20">
        {/* Column 1: Property Details */}
        <div className="space-y-8">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">Property Details</h2>
          <div className="space-y-5">
            <div className="flex justify-between items-center border-b border-slate-900/50 pb-4">
              <span className="text-sm text-slate-500">Property Type</span>
              <span className="text-sm font-bold text-slate-200">{property.propertyType}</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-900/50 pb-4">
              <span className="text-sm text-slate-500">Lot Size</span>
              <span className="text-sm font-bold text-slate-200">—</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-900/50 pb-4">
              <span className="text-sm text-slate-500">County</span>
              <span className="text-sm font-bold text-slate-200">Collin</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-900/50 pb-4">
              <span className="text-sm text-slate-500">Zoning</span>
              <span className="text-sm font-bold text-slate-200">—</span>
            </div>
          </div>
        </div>

        {/* Column 2: Listing Status */}
        <div className="space-y-8 lg:border-l lg:border-slate-900 lg:pl-10">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">Listing Status</h2>
          <div className="space-y-8">
            <Badge className="bg-emerald-500/10 text-emerald-400 border-none px-4 py-2 rounded-full font-bold text-[11px] hover:bg-emerald-500/15 cursor-default">
               <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-2 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
               Off-market opportunity
            </Badge>

            <div className="space-y-5">
              <div className="flex gap-4 text-sm text-slate-500 items-center">
                 <RefreshCw className="h-4 w-4 text-slate-800" />
                 <span className="font-medium text-slate-400">Not currently listed</span>
              </div>

              <div className="flex gap-4 text-sm text-slate-500 items-center">
                 <TrendingUp className="h-4 w-4 text-slate-800" />
                 <div>
                   <span className="text-slate-200 font-bold">~40% equity</span>
                   <span className="ml-3 text-[9px] bg-slate-900 px-2 py-0.5 rounded text-slate-600 uppercase font-black tracking-widest">very_low</span>
                 </div>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-6">
               <Button className="bg-emerald-500 hover:bg-emerald-400 text-black font-black h-11 px-8 rounded-xl transition-all shadow-[0_8px_20px_-8px_rgba(16,185,129,0.3)]">
                  Get contact info
               </Button>
               <Button variant="ghost" className="text-slate-500 gap-2 h-11 hover:text-slate-300 transition-colors font-bold text-sm">
                  <User className="h-4 w-4" />
                  Text person
               </Button>
            </div>
          </div>
        </div>

        {/* Column 3: Owner Intelligence */}
        <div className="space-y-8 lg:border-l lg:border-slate-900 lg:pl-10">
          <div className="flex justify-between items-center">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">Owner Intelligence</h2>
            <div className="flex items-center gap-2">
               <span className="text-[10px] text-slate-500 font-bold">Skip traces: 0 / 3</span>
               <span className="text-[10px] text-emerald-500 font-black uppercase tracking-tighter">free</span>
            </div>
          </div>
          
          <div className="space-y-8">
            <div className="relative group">
               <Button
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-black py-8 rounded-2xl text-xl transition-all shadow-[0_12px_30px_-10px_rgba(16,185,129,0.25)] border-none"
                onClick={() => property.currentLead ? null : claimMutation.mutate()}
                disabled={claimMutation.isPending || !!property.currentLead}
               >
                {property.currentLead ? "ALREADY CLAIMED" : "Get contact info"}
               </Button>
               {!property.currentLead && <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] text-slate-600 font-bold uppercase tracking-widest bg-black px-3">Uses 1 skip trace credit</div>}
            </div>

            <div className="space-y-3 pt-4">
               <label className="text-[10px] font-black text-slate-700 uppercase tracking-[0.2em]">Notes</label>
               <Textarea 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                onBlur={() => updateNotesMutation.mutate(notes)}
                placeholder="Add notes..."
                className="bg-slate-950/50 border-slate-900 p-4 rounded-xl focus-visible:ring-1 focus-visible:ring-emerald-500/30 text-slate-300 placeholder:text-slate-800 resize-none min-h-[100px] text-sm"
               />
            </div>

            <div className="space-y-5 pt-2">
               <h3 className="text-[10px] font-black text-slate-700 uppercase tracking-[0.2em]">Next Actions</h3>
               <div className="space-y-4">
                 {[ "Call owner", "Text owner", "Pull comps", "Make offer" ].map((action) => (
                   <div key={action} className="flex items-center gap-4 group cursor-pointer">
                      <Checkbox className="h-5 w-5 border-slate-800 bg-black rounded-md transition-all group-hover:border-emerald-500/50 data-[state=checked]:bg-emerald-500 data-[state=checked]:text-black" />
                      <span className="text-sm font-medium text-slate-500 group-hover:text-slate-300 transition-colors uppercase tracking-tight">{action}</span>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
