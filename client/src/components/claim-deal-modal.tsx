import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  User, DollarSign, Zap, ArrowRight, X, 
  Flame, ThermometerSun, Snowflake,
  MessageSquare, Phone
} from "lucide-react";
import { PropertyWithDetails } from "@shared/schema";

interface ClaimDealModalProps {
  open: boolean;
  onClose: () => void;
  property: PropertyWithDetails;
  onClaim: () => void;
  isPending: boolean;
}

type LeadTemp = "hot" | "warm" | "cold";

export default function ClaimDealModal({ open, onClose, property, onClaim, isPending }: ClaimDealModalProps) {
  const [, setLocation] = useLocation();
  const [selectedTemp, setSelectedTemp] = useState<LeadTemp>("warm");
  const [quickNote, setQuickNote] = useState("");
  const [nextAction, setNextAction] = useState("sms");

  // Calculate MAO using 70% rule
  const estimatedValue = parseFloat(property.estimatedValue || "0");
  const repairEstimate = estimatedValue * 0.1; // 10% estimate
  const wholesaleFee = 10000;
  const mao = Math.round((estimatedValue * 0.7) - repairEstimate - wholesaleFee);

  const equityPercent = property.equityPercent || 0;

  // Keyboard shortcut: Enter to claim
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey && !isPending) {
        e.preventDefault();
        onClaim();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, isPending, onClaim]);

  const tempConfig = {
    hot: { icon: Flame, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/30", label: "HOT" },
    warm: { icon: ThermometerSun, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30", label: "WARM" },
    cold: { icon: Snowflake, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30", label: "COLD" },
  };

  return (
    <Dialog open={open} onOpenChange={(val) => { if (!val) onClose(); }}>
      <DialogContent className="sm:max-w-lg bg-black border border-slate-800 rounded-[2rem] p-0 overflow-hidden shadow-[0_0_80px_rgba(16,185,129,0.08)]">
        {/* Header */}
        <div className="px-8 pt-8 pb-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                <Zap className="h-5 w-5 text-black" />
              </div>
              <div>
                <h2 className="text-lg font-black text-white tracking-tight">CLAIM THIS DEAL</h2>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Quick capture</p>
              </div>
            </div>
          </div>

          {/* Owner & Address */}
          <div className="bg-[#050505] border border-slate-900 rounded-2xl p-5 mb-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center border border-slate-800">
                <User className="h-4 w-4 text-slate-400" />
              </div>
              <div>
                <div className="text-white font-bold text-sm">{property.ownerName || "Owner Unknown"}</div>
                <div className="text-[10px] text-slate-500 font-medium">{property.address}</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 pt-3 border-t border-slate-900">
              <div>
                <div className="text-[9px] text-slate-600 font-black uppercase tracking-widest">Est. Value</div>
                <div className="text-lg font-black text-white">${estimatedValue.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-[9px] text-slate-600 font-black uppercase tracking-widest">Equity</div>
                <div className={`text-lg font-black ${equityPercent > 40 ? "text-emerald-400" : "text-white"}`}>
                  {equityPercent}%
                </div>
              </div>
              <div>
                <div className="text-[9px] text-slate-600 font-black uppercase tracking-widest">MAO</div>
                <div className="text-lg font-black text-emerald-400">${mao.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Lead Temperature */}
        <div className="px-8 pb-4">
          <label className="text-[10px] text-slate-600 font-black uppercase tracking-[0.2em] block mb-3">Lead Temperature</label>
          <div className="grid grid-cols-3 gap-3">
            {(Object.entries(tempConfig) as [LeadTemp, typeof tempConfig.hot][]).map(([key, config]) => {
              const Icon = config.icon;
              const isSelected = selectedTemp === key;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedTemp(key)}
                  className={`
                    relative flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200
                    ${isSelected 
                      ? `${config.bg} ${config.border} ${config.color}` 
                      : "bg-[#050505] border-slate-900 text-slate-600 hover:border-slate-700"
                    }
                  `}
                >
                  <Icon className={`h-5 w-5 ${isSelected ? config.color : "text-slate-700"}`} />
                  <span className="text-[10px] font-black uppercase tracking-widest">{config.label}</span>
                  {isSelected && (
                    <div className={`absolute top-2 right-2 w-1.5 h-1.5 rounded-full animate-pulse ${
                      key === "hot" ? "bg-red-500" : key === "warm" ? "bg-amber-500" : "bg-blue-500"
                    }`} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Note */}
        <div className="px-8 pb-4">
          <label className="text-[10px] text-slate-600 font-black uppercase tracking-[0.2em] block mb-3">Quick Note (optional)</label>
          <Textarea
            value={quickNote}
            onChange={(e) => setQuickNote(e.target.value)}
            placeholder="Motivated seller, vacant property..."
            className="bg-[#050505] border-slate-900 rounded-xl text-sm text-slate-300 placeholder:text-slate-800 resize-none h-16 focus-visible:ring-1 focus-visible:ring-emerald-500/30"
          />
        </div>

        {/* Next Action */}
        <div className="px-8 pb-6">
          <label className="text-[10px] text-slate-600 font-black uppercase tracking-[0.2em] block mb-3">First Action After Claim</label>
          <div className="flex gap-3">
            <button
              onClick={() => setNextAction("sms")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                nextAction === "sms" 
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
                  : "bg-[#050505] border-slate-900 text-slate-600 hover:border-slate-700"
              }`}
            >
              <MessageSquare className="h-3.5 w-3.5" /> Send SMS
            </button>
            <button
              onClick={() => setNextAction("call")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                nextAction === "call" 
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
                  : "bg-[#050505] border-slate-900 text-slate-600 hover:border-slate-700"
              }`}
            >
              <Phone className="h-3.5 w-3.5" /> Call Owner
            </button>
            <button
              onClick={() => setNextAction("skip")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                nextAction === "skip" 
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
                  : "bg-[#050505] border-slate-900 text-slate-600 hover:border-slate-700"
              }`}
            >
              <User className="h-3.5 w-3.5" /> Skip Trace
            </button>
          </div>
        </div>

        {/* Action Footer */}
        <div className="bg-[#030303] border-t border-slate-900 px-8 py-5 flex items-center justify-between">
          <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">
            Press ENTER to claim
          </p>
          <Button
            onClick={onClaim}
            disabled={isPending}
            className="bg-emerald-500 hover:bg-emerald-400 text-black font-black px-8 py-5 rounded-xl text-sm transition-all shadow-[0_8px_20px_-8px_rgba(16,185,129,0.4)] group"
          >
            {isPending ? "CLAIMING..." : "CLAIM DEAL"}
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
