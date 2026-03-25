import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp } from "lucide-react";

interface CollapsibleSectionProps {
  title: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeVariant?: "default" | "secondary" | "destructive" | "outline";
  defaultExpanded?: boolean;
  children: React.ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
}

export default function CollapsibleSection({
  title,
  description,
  icon: Icon,
  badge,
  badgeVariant = "default",
  defaultExpanded = false,
  children,
  className = "",
  headerClassName = "",
  contentClassName = ""
}: CollapsibleSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className={`relative ${className}`}>
      {/* Animated Neon Border */}
      <div className={`absolute inset-0 rounded-xl transition-opacity duration-300 ${
        isExpanded ? 'neon-border-expanded' : 'neon-border-collapsed'
      }`}></div>
      
      <Card className="bg-black border border-slate-900 rounded-[1.5rem] border-slate-700/30 rounded-xl relative z-10 bg-slate-900/95">
      <CardHeader className={`pb-3 ${headerClassName}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {Icon && (
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Icon className="h-5 w-5 text-blue-400" />
              </div>
            )}
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-semibold text-white">{title}</h3>
                {badge && (
                  <Badge 
                    variant={badgeVariant}
                    className="bg-black border-b border-slate-900 text-white border-blue-500/30"
                  >
                    {badge}
                  </Badge>
                )}
              </div>
              {description && (
                <p className="text-sm text-slate-400 mt-1">{description}</p>
              )}
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="lg"
            onClick={() => setIsExpanded(!isExpanded)}
            className={`transition-all duration-300 p-3 rounded-xl ${
              isExpanded 
                ? 'text-green-400 hover:text-green-300 shadow-[0_0_15px_rgba(34,197,94,0.6)] hover:shadow-[0_0_25px_rgba(34,197,94,0.8)] border border-green-500/30 bg-green-500/10' 
                : 'text-red-400 hover:text-red-300 shadow-[0_0_15px_rgba(239,68,68,0.6)] hover:shadow-[0_0_25px_rgba(239,68,68,0.8)] border border-red-500/30 bg-red-500/10'
            }`}
          >
            {isExpanded ? (
              <ChevronUp className="h-6 w-6 drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
            ) : (
              <ChevronDown className="h-6 w-6 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
            )}
          </Button>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className={`pt-0 ${contentClassName}`}>
          {children}
        </CardContent>
      )}
    </Card>
    </div>
  );
}