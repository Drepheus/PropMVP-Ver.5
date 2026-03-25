import { PropertyWithDetails } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileCode, FileText, FileSpreadsheet, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ExportActionsProps {
  property: PropertyWithDetails;
}

export default function ExportActions({ property }: ExportActionsProps) {
  const { toast } = useToast();

  const handleExportJSON = async () => {
    try {
      const response = await fetch(`/api/properties/${property.id}/export`, {
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Export failed");
      }
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'property-report.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export Successful",
        description: "Property data exported as JSON file.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export property data.",
        variant: "destructive",
      });
    }
  };

  const handleExportPDF = () => {
    toast({
      title: "PDF Export",
      description: "PDF export functionality would be implemented with a report generation service.",
    });
  };

  const handleExportExcel = () => {
    toast({
      title: "Excel Export",
      description: "Excel export functionality would be implemented with spreadsheet generation.",
    });
  };

  return (
    <Card className="bg-black border border-slate-900 rounded-[1.5rem] shadow-lg overflow-hidden">
      <CardHeader className="bg-black border-b border-slate-900 pb-4">
        <CardTitle className="flex items-center justify-between text-slate-100 text-xl">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-500/20 rounded-xl">
              <Download className="h-5 w-5 text-purple-400" />
            </div>
            Export & Reporting Suite
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Export Options */}
          <div className="space-y-3">
            <h4 className="text-slate-300 font-semibold text-sm uppercase tracking-wide">Export Formats</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                onClick={handleExportJSON}
                className="bg-black border border-slate-900 rounded-[1.5rem] flex flex-col items-center space-y-3 py-4 px-4 h-auto rounded-xl group hover:bg-slate-800/40 transition-all duration-300 border border-slate-700/30"
              >
                <div className="p-3 bg-blue-500/20 rounded-xl group-hover:bg-blue-500/30 transition-colors">
                  <FileCode className="h-6 w-6 text-blue-400" />
                </div>
                <div className="text-center">
                  <div className="font-semibold text-slate-200">JSON Export</div>
                  <div className="text-xs text-slate-400 mt-1">Raw data format</div>
                </div>
              </Button>
              
              <Button
                onClick={handleExportPDF}
                className="bg-black border border-slate-900 rounded-[1.5rem] flex flex-col items-center space-y-3 py-4 px-4 h-auto rounded-xl group hover:bg-slate-800/40 transition-all duration-300 border border-slate-700/30"
              >
                <div className="p-3 bg-red-500/20 rounded-xl group-hover:bg-red-500/30 transition-colors">
                  <FileText className="h-6 w-6 text-red-400" />
                </div>
                <div className="text-center">
                  <div className="font-semibold text-slate-200">PDF Report</div>
                  <div className="text-xs text-slate-400 mt-1">Professional format</div>
                </div>
              </Button>
              
              <Button
                onClick={handleExportExcel}
                className="bg-black border border-slate-900 rounded-[1.5rem] flex flex-col items-center space-y-3 py-4 px-4 h-auto rounded-xl group hover:bg-slate-800/40 transition-all duration-300 border border-slate-700/30"
              >
                <div className="p-3 bg-emerald-500/20 rounded-xl group-hover:bg-emerald-500/30 transition-colors">
                  <FileSpreadsheet className="h-6 w-6 text-emerald-400" />
                </div>
                <div className="text-center">
                  <div className="font-semibold text-slate-200">Excel Export</div>
                  <div className="text-xs text-slate-400 mt-1">Spreadsheet format</div>
                </div>
              </Button>
            </div>
        
        <div className="mt-8 p-6 bg-black border border-slate-900 rounded-[1.5rem] border border-slate-600/30">
          <div className="flex items-start space-x-4">
            <div className="p-2 bg-blue-500/20 rounded-xl">
              <Info className="h-5 w-5 text-blue-400" />
            </div>
            <div className="flex-1">
              <h4 className="text-slate-200 font-semibold mb-2">Comprehensive Report Contents</h4>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                All exports include property specifications, financial analysis, comparable sales data, 
                market insights, and neighborhood statistics. Premium subscribers receive additional 
                owner contact information and investment analysis.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className="text-slate-400 text-sm">Property Details</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-slate-400 text-sm">Market Analysis</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-slate-400 text-sm">Comparable Sales</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <span className="text-slate-400 text-sm">Contact Data (Pro)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
