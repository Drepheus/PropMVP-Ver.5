import { useState } from "react";
import { useLocation } from "wouter";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Search, TrendingUp, Zap, ArrowRight } from "lucide-react";

interface WelcomeModalProps {
  open: boolean;
  onClose: () => void;
}

export default function WelcomeModal({ open, onClose }: WelcomeModalProps) {
  const [, setLocation] = useLocation();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const handleChoice = (path: string) => {
    onClose();
    setLocation(path);
  };

  return (
    <Dialog open={open} onOpenChange={(val) => { if (!val) onClose(); }}>
      <DialogContent className="sm:max-w-xl bg-black border border-slate-800 rounded-[2rem] p-0 overflow-hidden shadow-[0_0_80px_rgba(16,185,129,0.08)]">
        {/* Header */}
        <div className="px-10 pt-10 pb-6 text-center">
          <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
            <Zap className="h-8 w-8 text-black" />
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight mb-2">
            YOU'RE IN.
          </h2>
          <p className="text-slate-400 font-medium text-sm max-w-xs mx-auto leading-relaxed">
            Where do you want to start? You can always switch between tools from the sidebar.
          </p>
        </div>

        {/* Choice Cards */}
        <div className="px-8 pb-10 grid grid-cols-2 gap-4">
          {/* Option 1: Search & Decide */}
          <button
            onClick={() => handleChoice("/property-search")}
            onMouseEnter={() => setHoveredCard("search")}
            onMouseLeave={() => setHoveredCard(null)}
            className="group relative bg-[#050505] border border-slate-800 rounded-2xl p-6 text-left transition-all duration-300 hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.1)] focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          >
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-5 border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-all">
              <Search className="h-5 w-5 text-emerald-500" />
            </div>
            <h3 className="text-white font-bold text-lg mb-1.5 tracking-tight">Start Finding Deals</h3>
            <p className="text-slate-500 text-xs font-medium leading-relaxed mb-4">
              Drop an address and triage a property in under 60 seconds.
            </p>
            <div className="flex items-center text-emerald-400 text-xs font-black uppercase tracking-widest group-hover:translate-x-1 transition-transform">
              SEARCH & DECIDE
              <ArrowRight className="ml-2 h-3.5 w-3.5" />
            </div>

            {/* Active indicator */}
            {hoveredCard === "search" && (
              <div className="absolute top-3 right-3 w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
            )}
          </button>

          {/* Option 2: Define Your Market */}
          <button
            onClick={() => handleChoice("/")}
            onMouseEnter={() => setHoveredCard("market")}
            onMouseLeave={() => setHoveredCard(null)}
            className="group relative bg-[#050505] border border-slate-800 rounded-2xl p-6 text-left transition-all duration-300 hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          >
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-5 border border-blue-500/20 group-hover:bg-blue-500/20 transition-all">
              <TrendingUp className="h-5 w-5 text-blue-500" />
            </div>
            <h3 className="text-white font-bold text-lg mb-1.5 tracking-tight">Explore the Tools</h3>
            <p className="text-slate-500 text-xs font-medium leading-relaxed mb-4">
              Scan market conditions, track trends, and find your target zones.
            </p>
            <div className="flex items-center text-blue-400 text-xs font-black uppercase tracking-widest group-hover:translate-x-1 transition-transform">
              DEFINE YOUR MARKET
              <ArrowRight className="ml-2 h-3.5 w-3.5" />
            </div>

            {/* Active indicator */}
            {hoveredCard === "market" && (
              <div className="absolute top-3 right-3 w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
            )}
          </button>
        </div>

        {/* Footer hint */}
        <div className="bg-[#030303] border-t border-slate-900 px-10 py-4 text-center">
          <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.2em]">
            Tip: Use the sidebar to switch between tools anytime
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
