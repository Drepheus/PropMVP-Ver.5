import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useMiniWorkflow } from "@/hooks/useMiniWorkflow";
import { 
  Search, 
  BarChart3, 
  TrendingUp, 
  Users, 
  Menu,
  Home,
  LogOut,
  Zap,
  ZapOff
} from "lucide-react";

interface NavigationBarProps {
  onMenuClick?: () => void;
}

export default function NavigationBar({ onMenuClick }: NavigationBarProps) {
  const [location] = useLocation();
  const { user } = useAuth();
  const { miniWorkflowEnabled, toggleMiniWorkflow } = useMiniWorkflow();

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const navigationItems = [
    {
      icon: TrendingUp,
      label: "Market Intelligence",
      path: "/",
      active: location === "/"
    },
    {
      icon: Search,
      label: "Property Search",
      path: "/property-search",
      active: location === "/property-search"
    },
    {
      icon: BarChart3,
      label: "Analytics",
      path: "/analytics",
      active: location === "/analytics"
    },
    {
      icon: Users,
      label: "Lead Management",
      path: "/lead-management",
      active: location === "/lead-management"
    }
  ];

  return (
    <nav className="sticky top-0 z-30 w-full border-b border-slate-900 bg-black/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left side - Logo and Mobile Menu */}
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-slate-400 hover:text-white mr-3"
              onClick={onMenuClick}
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105">
                <Home className="text-black h-4 w-4" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight hidden sm:block">
                PropAnalyzed
              </span>
            </Link>
          </div>

          {/* Center - Navigation Items (Hidden on mobile) */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <Button
                  variant="ghost"
                  className={cn(
                    "px-4 py-2 rounded-xl transition-all duration-300 flex items-center space-x-2 font-bold text-xs uppercase tracking-widest",
                    item.active
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "text-slate-500 hover:text-white"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="font-medium">{item.label}</span>
                </Button>
              </Link>
            ))}
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center space-x-3">
            {/* Mini Workflow Toggle */}
            <Button
              variant="ghost"
              onClick={() => toggleMiniWorkflow()}
              className={cn(
                "text-slate-500 hover:text-white p-2 rounded-xl transition-all duration-300",
                miniWorkflowEnabled && "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              )}
              title={miniWorkflowEnabled ? "Hide Deal Workflow" : "Show Deal Workflow"}
            >
              {miniWorkflowEnabled ? <Zap className="h-4 w-4" /> : <ZapOff className="h-4 w-4" />}
            </Button>
            
            <div className="hidden sm:block text-sm text-slate-400">
              {(user as any)?.email || "Professional Plan"}
            </div>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="text-slate-400 hover:text-slate-200 hover:bg-slate-700/30 p-2 rounded-xl transition-all duration-300"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu (Visible on small screens) */}
        <div className="md:hidden border-t border-slate-700/30 py-3">
          <div className="flex items-center justify-between space-x-1">
            {navigationItems.map((item) => (
              <Link key={item.path} href={item.path} className="flex-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "w-full px-2 py-2 rounded-xl transition-all duration-300 flex flex-col items-center space-y-1 text-[10px] font-black uppercase tracking-tight",
                    item.active
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "text-slate-500 hover:text-white"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="font-medium truncate">{item.label.split(' ')[0]}</span>
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}