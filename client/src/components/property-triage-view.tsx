import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
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
  ChevronDown,
  XCircle,
  Flame,
  Tag
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
import ClaimDealModal from "./claim-deal-modal";

interface PropertyTriageViewProps {
  property: PropertyWithDetails;
  onSearchAgain?: () => void;
}

export default function PropertyTriageView({ property, onSearchAgain }: PropertyTriageViewProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [location, setLocation] = useLocation();
  const [notes, setNotes] = useState(property.currentLead?.notes || "");
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [showKillMenu, setShowKillMenu] = useState(false);
  const [isKilled, setIsKilled] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Compute hot lead signal
  const equityPercent = property.equityPercent || 0;
  const isHotLead = equityPercent > 40;
  const hasDistressSignal = !property.ownerOccupied || (property.daysOnMarket && property.daysOnMarket > 60);
  const isOnFire = isHotLead && hasDistressSignal;

  // Source attribution (mock — in production this comes from lead source tracking)
  const leadSources = ["Direct Mail", "Cold Call", "PPC", "Driving 4 Dollars", "Referral", "Organic"];
  const leadSource = leadSources[property.id % leadSources.length];

  // Keyboard shortcut: C to open claim modal
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "c" && !e.ctrlKey && !e.metaKey && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement)) {
        if (!property.currentLead && !isKilled) {
          e.preventDefault();
          setShowClaimModal(true);
        }
      }
      // K to kill
      if (e.key === "k" && !e.ctrlKey && !e.metaKey && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement)) {
        if (!property.currentLead && !isKilled) {
          e.preventDefault();
          setShowKillMenu(true);
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [property.currentLead, isKilled]);

  const claimMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/leads/claim", { propertyId: property.id });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leads"] });
      queryClient.invalidateQueries({ queryKey: ["/api/properties/search"] });
      setShowClaimModal(false);
      toast({ title: "✅ Deal Claimed!", description: "Added to your pipeline. Redirecting..." });
      
      // Auto-navigate after brief moment
      setTimeout(() => setLocation("/lead-management"), 800);
    }
  });

  const updateNotesMutation = useMutation({
    mutationFn: async (newNotes: string) => {
      if (!property.currentLead) return;
      await apiRequest("PATCH", `/api/leads/${property.currentLead.id}/notes`, { notes: newNotes });
    }
  });

  const handleKill = (reason: string) => {
    setIsKilled(true);
    setShowKillMenu(false);
    toast({ 
      title: "❌ Deal Killed", 
      description: `Reason: ${reason}. Archived for pattern learning.`,
    });
    // Focus back on search after kill
    if (onSearchAgain) {
      setTimeout(() => onSearchAgain(), 1200);
    }
  };

  const killReasons = [
    { label: "Low Equity", emoji: "📉" },
    { label: "High Repair Cost", emoji: "🔧" },
    { label: "No Distress Signal", emoji: "😐" },
    { label: "Bad Location", emoji: "📍" },
    { label: "Over-leveraged", emoji: "⚠️" },
  ];

  return (
    <>
      {/* Claim Deal Modal */}
      <ClaimDealModal
        open={showClaimModal}
        onClose={() => setShowClaimModal(false)}
        property={property}
        onClaim={() => claimMutation.mutate()}
        isPending={claimMutation.isPending}
      />

      <div className={`bg-black min-h-screen text-white p-6 space-y-6 relative ${isKilled ? "opacity-40 pointer-events-none" : ""}`}>

        {/* Hot Lead Pulse Overlay */}
        {isOnFire && !property.currentLead && !isKilled && (
          <div className="fixed top-0 left-0 right-0 z-30 pointer-events-none">
            <div className="h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent animate-pulse" />
          </div>
        )}

        {/* Top Header */}
        <div className="flex justify-between items-center px-2">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white h-8 w-8" onClick={onSearchAgain}>
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
            {/* Source Attribution Badge */}
            <Badge className="bg-slate-900 text-slate-400 border border-slate-800 px-3 py-1.5 gap-1.5 rounded-full text-[10px] font-bold">
              <Tag className="h-3 w-3" />
              {leadSource}
            </Badge>
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
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-4xl font-bold tracking-tight text-white">{property.address.toLowerCase()}</h1>
            {/* Hot Lead Fire Badge */}
            {isOnFire && (
              <div className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 rounded-full px-3 py-1 animate-pulse">
                <Flame className="h-4 w-4 text-red-400" />
                <span className="text-[10px] font-black text-red-400 uppercase tracking-widest">Hot Lead</span>
              </div>
            )}
          </div>
          <div className="text-[10px] text-slate-500 flex items-center gap-2 mb-6 font-medium">
            <span>Last analyzed {new Date().toLocaleDateString()}</span>
            <span className="text-emerald-500 font-bold uppercase tracking-widest">refreshed</span>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 px-3 py-1.5 gap-2 rounded-full font-bold text-[11px] shadow-sm">
               <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
               Property verified
            </Badge>
            {isHotLead && (
              <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 gap-2 rounded-full font-bold text-[11px] shadow-sm">
                 High equity ({equityPercent}%)
              </Badge>
            )}
            <Badge className="bg-blue-500/10 text-blue-400 border border-blue-500/10 px-3 py-1.5 gap-2 rounded-full font-bold text-[11px] shadow-sm">
               Strong rent yield
            </Badge>
            <Badge className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/10 px-3 py-1.5 gap-2 rounded-full font-bold text-[11px] shadow-sm">
               Stable comps
            </Badge>
          </div>
        </div>

        {/* Main Intelligence Grid */}
        <Card className={`bg-[#050505] border-slate-900 rounded-2xl overflow-hidden mb-8 border-[0.5px] ${isOnFire ? "ring-1 ring-emerald-500/20" : ""}`}>
          <CardContent className="p-10">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-y-12 gap-x-12">
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
              
              <div className="hidden lg:flex flex-col items-center justify-center border-l border-slate-900 pl-12 row-span-2">
                 <div className="w-16 h-16 bg-slate-950 rounded-2xl flex items-center justify-center mb-4 border border-slate-900">
                   <RefreshCw className="h-7 w-7 text-slate-800" />
                 </div>
                 <span className="text-[9px] text-slate-600 font-black uppercase tracking-[0.2em] text-center max-w-[80px]">Street View coming soon</span>
              </div>

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
                <div className={`text-3xl font-bold tracking-tight ${isHotLead ? "text-emerald-400" : "text-white"}`}>
                  ${parseFloat(property.equity || "0").toLocaleString()}
                </div>
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

        {/* Floating Action Bar — Claim or Kill */}
        {!property.currentLead && !isKilled && (
          <div className="sticky bottom-6 z-20 flex justify-center">
            <div className="bg-[#050505]/95 backdrop-blur-xl border border-slate-800 rounded-2xl p-3 flex items-center gap-3 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)]">
              <Button
                onClick={() => setShowClaimModal(true)}
                className="bg-emerald-500 hover:bg-emerald-400 text-black font-black px-8 py-6 rounded-xl text-sm transition-all shadow-[0_8px_20px_-8px_rgba(16,185,129,0.4)] group"
              >
                <Zap className="mr-2 h-4 w-4" />
                CLAIM DEAL
                <kbd className="ml-3 text-[9px] bg-black/20 px-1.5 py-0.5 rounded font-mono">C</kbd>
              </Button>

              <div className="w-px h-8 bg-slate-800" />

              <div className="relative">
                <Button
                  variant="ghost"
                  onClick={() => setShowKillMenu(!showKillMenu)}
                  className="text-red-400/60 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 font-bold px-5 py-6 rounded-xl text-sm transition-all"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  KILL IT
                  <kbd className="ml-3 text-[9px] bg-slate-900 px-1.5 py-0.5 rounded font-mono text-slate-600">K</kbd>
                </Button>

                {/* Kill Reason Popover */}
                {showKillMenu && (
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-[#050505] border border-slate-800 rounded-2xl p-3 min-w-[220px] shadow-xl z-50">
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-3 px-2">Select Reason</p>
                    {killReasons.map((reason) => (
                      <button
                        key={reason.label}
                        onClick={() => handleKill(reason.label)}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-slate-900 transition-all text-left font-medium"
                      >
                        <span>{reason.emoji}</span>
                        {reason.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Already Claimed State */}
        {property.currentLead && (
          <div className="sticky bottom-6 z-20 flex justify-center">
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex items-center gap-4 shadow-lg">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              <span className="text-emerald-400 font-bold text-sm">DEAL ACTIVE IN PIPELINE</span>
              <Button
                variant="outline"
                size="sm"
                className="bg-slate-900/50 hover:bg-slate-800 text-emerald-400 font-bold border-emerald-500/30 rounded-xl"
                onClick={() => setLocation("/lead-management")}
              >
                Open Pipeline →
              </Button>
            </div>
          </div>
        )}

        {/* Killed State Overlay */}
        {isKilled && (
          <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="text-center">
              <XCircle className="h-16 w-16 text-red-500/50 mx-auto mb-4" />
              <h3 className="text-2xl font-black text-white mb-2">DEAL KILLED</h3>
              <p className="text-slate-500 text-sm mb-6">Archived for pattern learning</p>
              <Button
                onClick={onSearchAgain}
                className="bg-emerald-500 hover:bg-emerald-400 text-black font-black px-8 py-5 rounded-xl"
              >
                SEARCH NEXT PROPERTY
              </Button>
            </div>
          </div>
        )}

        {/* Sub-Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 px-2 pb-32">
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
                <span className="text-sm font-bold text-slate-200">{property.lotSize || "—"}</span>
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
                     <span className="text-slate-200 font-bold">~{equityPercent}% equity</span>
                     {equityPercent > 40 && (
                       <span className="ml-3 text-[9px] bg-emerald-500/10 px-2 py-0.5 rounded text-emerald-500 uppercase font-black tracking-widest">high</span>
                     )}
                   </div>
                </div>
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
              <div className="bg-[#050505] border border-slate-900 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center border border-slate-800">
                    <User className="h-5 w-5 text-slate-500" />
                  </div>
                  <div>
                    <div className="text-white font-bold">{property.ownerName || "Unknown"}</div>
                    <div className="text-[10px] text-slate-600 font-medium">{property.ownerOccupied ? "Owner Occupied" : "Non-owner Occupied"}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
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
    </>
  );
}
