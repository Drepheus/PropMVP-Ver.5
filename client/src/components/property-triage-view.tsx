import { PropertyWithDetails, Lead } from "@shared/schema";
import { 
  Users, 
  DollarSign, 
  Home, 
  Clock, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  XCircle,
  TrendingUp,
  MapPin,
  Calendar,
  Layers,
  StickyNote,
  Flag,
  Target,
  Zap
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
      toast({ title: "Property Claimed", description: "This deal is now in your pipeline." });
      queryClient.invalidateQueries({ queryKey: [`/api/properties/${property.id}`] });
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async (status: string) => {
      if (!property.currentLead) return;
      await apiRequest("PATCH", `/api/leads/${property.currentLead.id}/status`, { status });
    },
    onSuccess: () => {
      toast({ title: "Status Updated" });
      queryClient.invalidateQueries({ queryKey: [`/api/properties/${property.id}`] });
    }
  });

  const updateNotesMutation = useMutation({
    mutationFn: async () => {
      if (!property.currentLead) return;
      await apiRequest("PATCH", `/api/leads/${property.currentLead.id}/notes`, { notes });
    },
    onSuccess: () => {
      toast({ title: "Notes Saved" });
    }
  });

  // Calculate signals
  const signals = [];
  if (property.equityPercent && property.equityPercent > 50) signals.push({ label: "High Equity", icon: TrendingUp, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" });
  if (property.ownerOccupied === false) signals.push({ label: "Absentee Owner", icon: Home, color: "text-blue-400 bg-blue-500/10 border-blue-500/30" });
  if (property.investorType === "Investor (Entity)") signals.push({ label: "Corporate Owned", icon: Users, color: "text-purple-400 bg-purple-500/10 border-purple-500/30" });
  if (parseFloat(property.liens || "0") > 0) signals.push({ label: "Has Liens", icon: AlertCircle, color: "text-red-400 bg-red-500/10 border-red-500/30" });
  if (property.listingStatus === "Expired" || property.listingStatus === "Withdrawn") signals.push({ label: "Off Market Distress", icon: Flag, color: "text-amber-400 bg-amber-500/10 border-amber-500/30" });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Signal Bar */}
      <div className="flex flex-wrap gap-2">
        {signals.map((s, i) => (
          <Badge key={i} variant="outline" className={`px-3 py-1 text-sm font-medium flex items-center gap-2 rounded-full border ${s.color}`}>
            <s.icon className="h-3.5 w-3.5" />
            {s.label}
          </Badge>
        ))}
        {signals.length === 0 && <span className="text-slate-500 italic text-sm">No immediate high-probability signals detected.</span>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content Areas */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Identity */}
          <Card className="glass-card border-slate-700/50">
            <CardHeader className="pb-3 border-b border-slate-700/30 bg-slate-800/20">
              <CardTitle className="text-sm font-medium text-slate-400 flex items-center uppercase tracking-wider">
                <Users className="h-4 w-4 mr-2 text-blue-400" />
                The Identity
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div>
                <div className="text-2xl font-bold text-slate-100">{property.ownerName || "Private Owner"}</div>
                <div className="text-sm text-slate-400 mt-1 flex items-center gap-2">
                  <Badge variant="secondary" className="bg-slate-700/50 text-slate-300 border-none font-normal">
                    {property.investorType || "Individual"}
                  </Badge>
                  {property.ownerOccupied ? 
                    <Badge variant="outline" className="text-amber-400 border-amber-400/30">Owner Occupied</Badge> : 
                    <Badge variant="outline" className="text-emerald-400 border-emerald-400/30">Absentee/Rental</Badge>
                  }
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                  <div className="text-xs text-slate-500 uppercase">Last Sale</div>
                  <div className="text-sm font-medium text-slate-300">{property.lastSaleDate || "Unknown"}</div>
                </div>
                <div className="space-y-1 text-right">
                  <div className="text-xs text-slate-500 uppercase">Sale Price</div>
                  <div className="text-sm font-medium text-slate-300">${parseFloat(property.lastSalePrice || "0").toLocaleString()}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Money */}
          <Card className="glass-card border-slate-700/50">
            <CardHeader className="pb-3 border-b border-slate-700/30 bg-slate-800/20">
              <CardTitle className="text-sm font-medium text-slate-400 flex items-center uppercase tracking-wider">
                <DollarSign className="h-4 w-4 mr-2 text-emerald-400" />
                The Money
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-xs text-slate-500 uppercase">Estimated Value</div>
                  <div className="text-2xl font-bold text-slate-100">${parseFloat(property.estimatedValue || "0").toLocaleString()}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-500 uppercase">Equity</div>
                  <div className="text-lg font-bold text-emerald-400">${parseFloat(property.equity || "0").toLocaleString()}</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Equity Strength</span>
                  <span className="text-emerald-400 font-bold">{property.equityPercent || 0}%</span>
                </div>
                <Progress value={property.equityPercent || 0} className="h-2 bg-slate-700/50" />
              </div>

              <div className="flex justify-between text-sm py-1">
                <span className="text-slate-400">Liens Found</span>
                <span className={parseFloat(property.liens || "0") > 0 ? "text-red-400 font-bold" : "text-emerald-400"}>
                  {parseFloat(property.liens || "0") > 0 ? `$${parseFloat(property.liens || "0").toLocaleString()}` : "$0.00"}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Physical */}
          <Card className="glass-card border-slate-700/50">
            <CardHeader className="pb-3 border-b border-slate-700/30 bg-slate-800/20">
              <CardTitle className="text-sm font-medium text-slate-400 flex items-center uppercase tracking-wider">
                <Home className="h-4 w-4 mr-2 text-amber-400" />
                The Physical
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 grid grid-cols-2 gap-y-4 gap-x-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-700/30 rounded-lg"><Layers className="h-4 w-4 text-slate-400" /></div>
                <div>
                  <div className="text-xs text-slate-500">Sqft</div>
                  <div className="text-sm font-bold">{property.sqft?.toLocaleString() || "N/A"}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-700/30 rounded-lg"><Calendar className="h-4 w-4 text-slate-400" /></div>
                <div>
                  <div className="text-xs text-slate-500">Built</div>
                  <div className="text-sm font-bold">{property.yearBuilt || "N/A"}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-700/30 rounded-lg"><Target className="h-4 w-4 text-slate-400" /></div>
                <div>
                  <div className="text-xs text-slate-500">Beds/Baths</div>
                  <div className="text-sm font-bold">{property.beds || 0} / {property.baths || 0}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-700/30 rounded-lg"><MapPin className="h-4 w-4 text-slate-400" /></div>
                <div>
                  <div className="text-xs text-slate-500">Lot Size</div>
                  <div className="text-sm font-bold text-nowrap truncate">{property.lotSize || "N/A"}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status */}
          <Card className="glass-card border-slate-700/50">
            <CardHeader className="pb-3 border-b border-slate-700/30 bg-slate-800/20">
              <CardTitle className="text-sm font-medium text-slate-400 flex items-center uppercase tracking-wider">
                <Clock className="h-4 w-4 mr-2 text-purple-400" />
                The Status
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-slate-100">{property.listingStatus || "Off-Market"}</div>
                <Badge variant={property.isListed ? "default" : "secondary"} className={property.isListed ? "bg-red-500 text-white" : "bg-slate-700"}>
                  {property.isListed ? "Listed" : "Off-Market"}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="text-xs text-slate-500 uppercase">Listing History</div>
                {Array.isArray(property.listingHistory) && (property.listingHistory as any[]).length > 0 ? (
                  <div className="space-y-2 max-h-24 overflow-y-auto pr-2 custom-scrollbar">
                    {(property.listingHistory as any[]).slice(0, 3).map((h, i) => (
                      <div key={i} className="flex justify-between text-xs bg-slate-800/40 p-1.5 rounded border border-slate-700/30">
                        <span className="text-slate-400">{h.date}</span>
                        <span className="text-slate-200">{h.event}</span>
                        <span className="text-emerald-400 font-medium">${h.price?.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-slate-500 italic py-2">No recent listing activity found.</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Sidebar */}
        <div className="space-y-6">
          <Card className="glass-card border-slate-700/50 shadow-xl ring-1 ring-emerald-500/20">
            <CardHeader className="pb-3 border-b border-slate-700/30 bg-emerald-500/10">
              <CardTitle className="text-sm font-bold text-emerald-400 flex items-center uppercase tracking-widest">
                <ShieldCheck className="h-4 w-4 mr-2" />
                Control Center
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {!property.currentLead ? (
                <div className="space-y-4">
                  <div className="text-xs text-slate-400 text-center leading-relaxed">
                    This property has not been claimed. Add it to your pipeline to begin deal management.
                  </div>
                  <Button 
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-6 text-lg shadow-lg hover:shadow-emerald-500/20"
                    onClick={() => claimMutation.mutate()}
                    disabled={claimMutation.isPending}
                  >
                    {claimMutation.isPending ? "Claiming..." : "CLAIM PROPERTY"}
                  </Button>
                  <Button variant="ghost" className="w-full text-red-400 hover:bg-red-500/10 hover:text-red-300">
                    <XCircle className="h-4 w-4 mr-2" />
                    KILL DEAL (PASS)
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs text-slate-500 uppercase font-bold tracking-tight px-1">Lead Status</label>
                    <Select 
                      defaultValue={property.currentLead.status} 
                      onValueChange={(val) => updateStatusMutation.mutate(val)}
                    >
                      <SelectTrigger className="bg-slate-800/50 border-slate-700 text-slate-100 h-10">
                        <SelectValue placeholder="Set Status" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-slate-700">
                        <SelectItem value="New">NEW OPPORTUNITY</SelectItem>
                        <SelectItem value="Follow Up">FOLLOW UP</SelectItem>
                        <SelectItem value="Hot">HOT DEAL</SelectItem>
                        <SelectItem value="Dead">DEAD / PASSED</SelectItem>
                        <SelectItem value="Closed">CLOSED DEAL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-slate-500 uppercase font-bold tracking-tight px-1 flex items-center gap-2">
                      <StickyNote className="h-3 w-3" />
                      Internal Notes
                    </label>
                    <Textarea 
                      placeholder="Add strategic notes about this owner or property condition..."
                      className="bg-slate-800/40 border-slate-700 text-slate-200 min-h-[120px] text-sm resize-none focus:ring-emerald-500/30"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full h-8 text-xs border-slate-700 hover:bg-emerald-500/10 hover:text-emerald-400 transition-all"
                      onClick={() => updateNotesMutation.mutate()}
                      disabled={updateNotesMutation.isPending}
                    >
                      {updateNotesMutation.isPending ? "Saving..." : "Update Notes"}
                    </Button>
                  </div>

                  <div className="pt-4 border-t border-slate-700/50">
                    <div className="text-[10px] text-slate-500 flex justify-between uppercase">
                      <span>Claimed On</span>
                      <span>{new Date(property.currentLead.claimedAt!).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Quick Metrics */}
          <div className="glass-card rounded-2xl p-4 border border-slate-700/50 bg-blue-500/5">
            <h4 className="text-xs font-bold text-blue-400 uppercase mb-3 flex items-center gap-2">
              <Zap className="h-3 w-3" />
              Quick Signal
            </h4>
            <div className="text-sm text-slate-300 leading-snug">
              {property.ownerOccupied === false && property.equityPercent! > 40 ? 
                "High matching: Absentee owner with significant equity. Prime for off-market outreach." :
                "Market data indicates stable property. Monitor for listing changes."
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
