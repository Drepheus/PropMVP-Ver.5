import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Filter, 
  Heart, 
  AlertTriangle, 
  DollarSign, 
  Clock,
  Home,
  TrendingDown,
  Building,
  Users,
  Zap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MotivationFilter {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  priority: "high" | "medium" | "low";
  enabled: boolean;
}

interface FilterMotivationModalProps {
  children: React.ReactNode;
  onFilterUpdate?: (filters: MotivationFilter[]) => void;
}

export default function FilterMotivationModal({ children, onFilterUpdate }: FilterMotivationModalProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const [motivationFilters, setMotivationFilters] = useState<MotivationFilter[]>([
    {
      id: "divorce",
      name: "Divorce Proceedings",
      description: "Properties from divorce settlements requiring quick sale",
      icon: Heart,
      color: "bg-red-500/20 text-red-400 border-red-500/30",
      priority: "high",
      enabled: true,
    },
    {
      id: "foreclosure",
      name: "Pre-Foreclosure",
      description: "Properties facing foreclosure proceedings",
      icon: AlertTriangle,
      color: "bg-orange-500/20 text-orange-400 border-orange-500/30",
      priority: "high",
      enabled: true,
    },
    {
      id: "financial-distress",
      name: "Financial Distress",
      description: "Owners experiencing financial hardship",
      icon: DollarSign,
      color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      priority: "high",
      enabled: false,
    },
    {
      id: "estate-sale",
      name: "Estate Sales",
      description: "Properties from estate settlements",
      icon: Building,
      color: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      priority: "medium",
      enabled: true,
    },
    {
      id: "job-relocation",
      name: "Job Relocation",
      description: "Owners relocating for work requiring quick sale",
      icon: Users,
      color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      priority: "medium",
      enabled: false,
    },
    {
      id: "vacant-properties",
      name: "Vacant Properties",
      description: "Properties sitting empty for extended periods",
      icon: Home,
      color: "bg-slate-500/20 text-slate-400 border-slate-500/30",
      priority: "medium",
      enabled: true,
    },
    {
      id: "tax-liens",
      name: "Tax Liens",
      description: "Properties with outstanding tax obligations",
      icon: AlertTriangle,
      color: "bg-red-500/20 text-red-400 border-red-500/30",
      priority: "high",
      enabled: false,
    },
    {
      id: "market-time",
      name: "Extended Market Time",
      description: "Properties listed for 90+ days",
      icon: Clock,
      color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
      priority: "low",
      enabled: true,
    },
    {
      id: "price-reductions",
      name: "Multiple Price Reductions",
      description: "Properties with 2+ price cuts",
      icon: TrendingDown,
      color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      priority: "medium",
      enabled: true,
    },
  ]);

  const toggleFilter = (filterId: string) => {
    setMotivationFilters(prev => 
      prev.map(filter => 
        filter.id === filterId 
          ? { ...filter, enabled: !filter.enabled }
          : filter
      )
    );
  };

  const handleApplyFilters = () => {
    // Save filters to localStorage
    localStorage.setItem("motivationFilters", JSON.stringify(motivationFilters));
    
    // Call parent callback
    onFilterUpdate?.(motivationFilters);
    
    const enabledCount = motivationFilters.filter(f => f.enabled).length;
    toast({
      title: "Motivation Filters Applied",
      description: `${enabledCount} motivation filters are now active.`,
    });
    
    setOpen(false);
  };

  const enabledFilters = motivationFilters.filter(f => f.enabled);
  const highPriorityEnabled = enabledFilters.filter(f => f.priority === "high").length;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3 text-slate-100 text-2xl">
            <div className="p-2 bg-orange-500/20 rounded-xl">
              <Filter className="h-6 w-6 text-orange-400" />
            </div>
            Filter by Seller Motivation
          </DialogTitle>
          <p className="text-slate-400 mt-2">
            Select motivation types to focus on the most promising opportunities. 
            High-priority filters identify the most motivated sellers.
          </p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Filter Summary */}
          <Card className="bg-black border border-slate-900 rounded-[1.5rem]">
            <CardHeader>
              <CardTitle className="text-slate-200 text-lg">Active Filters Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-400">{enabledFilters.length}</div>
                  <div className="text-sm text-slate-400">Total Active</div>
                </div>
                <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                  <div className="text-2xl font-bold text-red-400">{highPriorityEnabled}</div>
                  <div className="text-sm text-slate-400">High Priority</div>
                </div>
                <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                  <div className="text-2xl font-bold text-emerald-400">
                    {Math.round((enabledFilters.length / motivationFilters.length) * 100)}%
                  </div>
                  <div className="text-sm text-slate-400">Coverage</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* High Priority Filters */}
          <Card className="bg-black border border-slate-900 rounded-[1.5rem]">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-slate-200">
                <AlertTriangle className="h-5 w-5 text-red-400" />
                <span>High Priority Motivations</span>
                <Badge className="bg-red-500/20 text-red-400 border border-red-500/30">
                  Most Motivated
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {motivationFilters
                  .filter(filter => filter.priority === "high")
                  .map((filter) => {
                    const Icon = filter.icon;
                    return (
                      <div 
                        key={filter.id}
                        className={`p-4 rounded-lg border transition-all cursor-pointer ${
                          filter.enabled 
                            ? "bg-slate-800/50 border-slate-600" 
                            : "bg-slate-900/50 border-slate-700"
                        }`}
                        onClick={() => toggleFilter(filter.id)}
                      >
                        <div className="flex items-start space-x-3">
                          <Checkbox
                            checked={filter.enabled}
                            onCheckedChange={() => toggleFilter(filter.id)}
                          />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <Icon className="h-4 w-4 text-red-400" />
                              <span className="font-medium text-slate-200">{filter.name}</span>
                            </div>
                            <p className="text-sm text-slate-400">{filter.description}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>

          {/* Medium Priority Filters */}
          <Card className="bg-black border border-slate-900 rounded-[1.5rem]">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-slate-200">
                <Clock className="h-5 w-5 text-yellow-400" />
                <span>Medium Priority Motivations</span>
                <Badge className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                  Good Opportunities
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {motivationFilters
                  .filter(filter => filter.priority === "medium")
                  .map((filter) => {
                    const Icon = filter.icon;
                    return (
                      <div 
                        key={filter.id}
                        className={`p-4 rounded-lg border transition-all cursor-pointer ${
                          filter.enabled 
                            ? "bg-slate-800/50 border-slate-600" 
                            : "bg-slate-900/50 border-slate-700"
                        }`}
                        onClick={() => toggleFilter(filter.id)}
                      >
                        <div className="flex items-start space-x-3">
                          <Checkbox
                            checked={filter.enabled}
                            onCheckedChange={() => toggleFilter(filter.id)}
                          />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <Icon className="h-4 w-4 text-yellow-400" />
                              <span className="font-medium text-slate-200">{filter.name}</span>
                            </div>
                            <p className="text-sm text-slate-400">{filter.description}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>

          {/* Low Priority Filters */}
          <Card className="bg-black border border-slate-900 rounded-[1.5rem]">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-slate-200">
                <TrendingDown className="h-5 w-5 text-cyan-400" />
                <span>Low Priority Motivations</span>
                <Badge className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  Market Indicators
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {motivationFilters
                  .filter(filter => filter.priority === "low")
                  .map((filter) => {
                    const Icon = filter.icon;
                    return (
                      <div 
                        key={filter.id}
                        className={`p-4 rounded-lg border transition-all cursor-pointer ${
                          filter.enabled 
                            ? "bg-slate-800/50 border-slate-600" 
                            : "bg-slate-900/50 border-slate-700"
                        }`}
                        onClick={() => toggleFilter(filter.id)}
                      >
                        <div className="flex items-start space-x-3">
                          <Checkbox
                            checked={filter.enabled}
                            onCheckedChange={() => toggleFilter(filter.id)}
                          />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <Icon className="h-4 w-4 text-cyan-400" />
                              <span className="font-medium text-slate-200">{filter.name}</span>
                            </div>
                            <p className="text-sm text-slate-400">{filter.description}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-slate-600 text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </Button>
            <Button
              onClick={handleApplyFilters}
              className="bg-black border-b border-slate-900 hover:from-orange-700 hover:to-red-700"
            >
              <Zap className="h-4 w-4 mr-2" />
              Apply Filters ({enabledFilters.length})
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}