import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AuthModal from "@/components/auth-modal";
import { 
  TrendingUp, 
  MapPin, 
  BarChart3, 
  Users, 
  Search, 
  Brain,
  Shield,
  Zap,
  Target,
  ArrowRight,
  Database,
  Cpu
} from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-black text-slate-200">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-xl border-b border-slate-900/80">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
              <Zap className="h-5 w-5 text-black" />
            </div>
            <div>
               <span className="text-xl font-bold text-white tracking-tight">
                 PropAnalyzed
               </span>
               <div className="text-[10px] text-slate-500 font-black uppercase mt-0.5 tracking-[0.1em]">Professional</div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex gap-8 text-sm font-semibold text-slate-400">
              <a href="#features" className="hover:text-emerald-400 transition-colors">Platform</a>
              <a href="#intelligence" className="hover:text-emerald-400 transition-colors">Intelligence</a>
              <a href="#pricing" className="hover:text-emerald-400 transition-colors">Pricing</a>
            </div>
            <AuthModal>
              <Button className="bg-emerald-500 hover:bg-emerald-400 text-black font-black px-6 py-5 rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                ENTER ENGINE
              </Button>
            </AuthModal>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden border-b border-slate-900">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-[1000px] pointer-events-none">
           <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] mix-blend-screen"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-4xl">
            <Badge className="mb-8 bg-slate-900 text-emerald-400 border border-emerald-500/30 px-4 py-2 text-xs font-black tracking-widest uppercase rounded-full shadow-[0_0_15px_rgba(16,185,129,0.15)]">
              <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
              Live Market Intelligence
            </Badge>
            
            <h1 className="text-6xl md:text-8xl font-black text-white mb-8 leading-[0.9] tracking-tighter">
              HIGH-SPEED <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-emerald-400 to-emerald-700">REAL ESTATE </span> <br />
              TRIAGE
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-400 mb-12 max-w-2xl font-medium leading-relaxed">
              Drop an address. Get instant equity signals, owner identity, and repair estimates. Decide if it's a deal in under 60 seconds.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6">
              <AuthModal>
                <Button 
                  className="bg-emerald-500 hover:bg-emerald-400 text-black font-black px-10 py-8 rounded-2xl text-lg transition-all shadow-[0_10px_40px_-10px_rgba(16,185,129,0.5)] border-none group"
                >
                  START SOURCING
                  <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </AuthModal>
              <Button 
                variant="outline" 
                className="bg-transparent border border-slate-800 text-white hover:bg-slate-900 px-10 py-8 rounded-2xl text-lg font-bold transition-all"
              >
                VIEW LIVE DEMO
              </Button>
            </div>
            
            <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl pt-8 border-t border-slate-900">
               <div>
                 <div className="text-3xl font-black text-white mb-1">1.2M+</div>
                 <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Properties Processed</div>
               </div>
               <div>
                 <div className="text-3xl font-black text-white mb-1">&lt; 1s</div>
                 <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Analysis Time</div>
               </div>
               <div>
                 <div className="text-3xl font-black text-emerald-400 mb-1">$4B+</div>
                 <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Value Uncovered</div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Grids */}
      <div id="features" className="py-32 bg-[#020202]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-20">
            <h2 className="text-[10px] text-emerald-500 font-black uppercase tracking-[0.3em] mb-4">The Engine</h2>
            <h3 className="text-5xl font-black text-white tracking-tight leading-tight max-w-2xl">
              BUILT FOR SPEED. <br/>
              DESIGNED FOR SCALE.
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-[#050505] border border-slate-900 rounded-[2rem] p-10 hover:border-emerald-500/30 transition-all group">
              <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-8 border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-all">
                <Search className="h-6 w-6 text-emerald-500" />
              </div>
              <h4 className="text-2xl font-bold text-white mb-4">Deep Sourcing</h4>
              <p className="text-slate-400 leading-relaxed font-medium">
                Pulls comprehensive property details instantly. No more jumping between dozens of tabs to find lot size or last sale date.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#050505] border border-slate-900 rounded-[2rem] p-10 hover:border-blue-500/30 transition-all group">
              <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-8 border border-blue-500/20 group-hover:bg-blue-500/20 transition-all">
                <Target className="h-6 w-6 text-blue-500" />
              </div>
              <h4 className="text-2xl font-bold text-white mb-4">Automated ARV</h4>
              <p className="text-slate-400 leading-relaxed font-medium">
                Instantly aggregates recent comparables within a 1-mile radius to calculate hyper-accurate After Repair Values.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#050505] border border-slate-900 rounded-[2rem] p-10 hover:border-purple-500/30 transition-all group">
              <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-8 border border-purple-500/20 group-hover:bg-purple-500/20 transition-all">
                <Users className="h-6 w-6 text-purple-500" />
              </div>
              <h4 className="text-2xl font-bold text-white mb-4">Instant Skip Tracing</h4>
              <p className="text-slate-400 leading-relaxed font-medium">
                One click reveals the true owner's phone numbers and emails. Turn a dead address into an active negotiation.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-[#050505] border border-slate-900 rounded-[2rem] p-10 hover:border-amber-500/30 transition-all group lg:col-span-2 relative overflow-hidden">
               <div className="absolute right-0 bottom-0 opacity-10">
                 <BarChart3 className="w-64 h-64 -mr-10 -mb-10 text-amber-500" />
               </div>
              <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-8 border border-amber-500/20 group-hover:bg-amber-500/20 transition-all relative z-10">
                <Database className="h-6 w-6 text-amber-500" />
              </div>
              <h4 className="text-2xl font-bold text-white mb-4 relative z-10">Visual Pipeline</h4>
              <p className="text-slate-400 leading-relaxed font-medium max-w-md relative z-10">
                Drag and drop leads from New to Won. Built-in tracking ensures high-priority deals never slip through the cracks.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-[#050505] border border-slate-900 rounded-[2rem] p-10 hover:border-emerald-500/30 transition-all group">
              <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center mb-8 border border-red-500/20 group-hover:bg-red-500/20 transition-all">
                <Cpu className="h-6 w-6 text-red-500" />
              </div>
              <h4 className="text-2xl font-bold text-white mb-4">MAO Calculator</h4>
              <p className="text-slate-400 leading-relaxed font-medium">
                The golden 70% rule hardcoded into a lightning-fast widget. Generate maximum allowable offers instantly.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-32 border-t border-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-emerald-500/5"></div>
        <div className="max-w-4xl mx-auto text-center px-6 relative z-10">
          <Zap className="h-20 w-20 text-emerald-500 mx-auto mb-8 animate-pulse" />
          <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter loading-tight">
            STOP RESEARCHING.<br/>
            START CLOSING.
          </h2>
          <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto font-medium">
            The market moves too fast for slow analysis. Empower your wholesale business with utility-driven intelligence today.
          </p>
          <AuthModal>
            <Button 
              className="bg-emerald-500 hover:bg-emerald-400 text-black font-black px-12 py-8 rounded-2xl text-xl transition-all shadow-[0_10px_40px_-10px_rgba(16,185,129,0.5)] border-none hover:scale-105"
            >
              LAUNCH ENGINE FOR FREE
            </Button>
          </AuthModal>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-8">
            NO CREDIT CARD REQUIRED • INSTANT ACCESS
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-black py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-emerald-500/10 rounded-lg border border-emerald-500/20 flex items-center justify-center">
              <Zap className="h-4 w-4 text-emerald-500" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              PropAnalyzed
            </span>
          </div>
          <div className="flex gap-6 text-sm font-semibold text-slate-500">
            <a href="#" className="hover:text-emerald-400 transition-colors">Platform</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</a>
          </div>
          <p className="text-slate-600 text-xs font-bold uppercase tracking-widest">
            © {new Date().getFullYear()} PROPANALYZED
          </p>
        </div>
      </footer>
    </div>
  );
}