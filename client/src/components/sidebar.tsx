import { Home, Search, TrendingUp, Users, FileText, Settings, LogOut, X, BarChart3, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLocation } from "wouter";
import { useState } from "react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [location, setLocation] = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(true);
  
  const menuItems = [
    { icon: Search, label: "Property Search", path: "/property-search", active: location === "/property-search" },
    { icon: BarChart3, label: "Analytics Dashboard", path: "/analytics", active: location === "/analytics" },
    { icon: TrendingUp, label: "Market Intelligence", path: "/", active: location === "/" },
    { icon: Users, label: "Lead Management", path: "/lead-management", active: location === "/lead-management" },
    { icon: FileText, label: "Export Reports", path: "/reports", active: false },
  ];

  const accountItems = [
    { icon: Settings, label: "Settings" },
    { icon: LogOut, label: "Logout" },
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={onClose}
        />
      )}
      
      {/* Modern Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 bg-black border-r border-slate-900 transform transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex items-center justify-between h-18 px-3 border-b border-slate-700/30">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
              <Home className="text-black h-5 w-5" />
            </div>
            {!isCollapsed && (
              <div>
                <span className="text-xl font-bold text-white tracking-tight">
                  PropAnalyzed
                </span>
                <div className="text-[10px] text-slate-600 font-black uppercase mt-0.5 tracking-[0.1em]">Professional</div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1">
            {!isCollapsed && (
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-slate-400 hover:text-white transition-colors rounded-xl"
                onClick={onClose}
              >
                <X className="h-5 w-5" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:flex text-slate-400 hover:text-white transition-colors rounded-xl"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        
        <nav className="mt-8 px-2">
          <div className="space-y-3">
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  if (item.path) {
                    setLocation(item.path);
                    onClose();
                  }
                }}
                className={cn(
                  "flex items-center w-full text-left rounded-2xl transition-all duration-300 group relative",
                  isCollapsed ? "px-3 py-3 justify-center" : "px-5 py-4",
                  item.active 
                    ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20" 
                    : "text-slate-500 hover:text-white"
                )}
                title={isCollapsed ? item.label : undefined}
              >
                <div className={cn(
                  "relative p-2 rounded-xl transition-all duration-300",
                  isCollapsed ? "mr-0" : "mr-3",
                  item.active 
                    ? "bg-emerald-500/20 text-emerald-400" 
                    : "bg-slate-900 border border-slate-800 text-slate-500 group-hover:text-white"
                )}>
                  {item.path === "/property-search" && !item.active && (
                    <span className="absolute inset-0 rounded-xl bg-emerald-500 opacity-25 animate-ping" />
                  )}
                  <item.icon className={cn(
                    "h-5 w-5 relative z-10", 
                    item.path === "/property-search" && !item.active && "text-emerald-500/70 group-hover:text-emerald-400"
                  )} />
                </div>
                {!isCollapsed && (
                  <>
                    <span className="font-semibold">{item.label}</span>
                    {item.active && (
                      <div className="ml-auto w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                    )}
                  </>
                )}
                {isCollapsed && item.active && (
                  <div className="absolute right-1 top-1 w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                )}
              </button>
            ))}
          </div>
          
          {!isCollapsed && (
            <>
              <div className="mt-10 pt-8 border-t border-slate-900">
                <div className="px-5 py-3">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Account Settings</p>
                </div>
                <div className="space-y-2">
                  {accountItems.map((item) => (
                    <button
                      key={item.label}
                      className="flex items-center w-full px-5 py-3 text-slate-400 hover:text-slate-200 hover:bg-slate-700/40 rounded-2xl transition-all duration-300 group"
                    >
                      <div className="p-2 rounded-xl mr-3 bg-slate-700/30 text-slate-400 group-hover:bg-slate-700/50 group-hover:text-slate-300 transition-all duration-300">
                        <item.icon className="h-4 w-4" />
                      </div>
                      <span className="font-medium">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mt-8 p-6 bg-[#050505] border border-slate-900 rounded-2xl">
                <div className="text-center">
                  <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                    <span className="text-emerald-500 font-black text-xs">PRO</span>
                  </div>
                  <h4 className="text-white font-bold text-sm mb-1">Upgrade to Pro</h4>
                  <p className="text-slate-600 text-[10px] font-bold uppercase tracking-tight mb-4">Unlock skip tracing</p>
                  <Button className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-black py-2 rounded-lg text-xs transition-all">
                    Upgrade Now
                  </Button>
                </div>
              </div>
            </>
          )}
          
          {isCollapsed && (
            <div className="mt-8 flex flex-col items-center space-y-4">
              {accountItems.map((item) => (
                <button
                  key={item.label}
                  className="p-3 text-slate-400 hover:text-slate-200 hover:bg-slate-700/40 rounded-2xl transition-all duration-300"
                  title={item.label}
                >
                  <item.icon className="h-4 w-4" />
                </button>
              ))}
              <div className="w-8 h-8 bg-black border-b border-slate-900 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xs">Pro</span>
              </div>
            </div>
          )}
        </nav>
      </div>
    </>
  );
}
