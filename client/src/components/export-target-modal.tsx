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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { 
  Download, 
  FileText, 
  Table, 
  Mail,
  Database,
  Target,
  Calendar,
  MapPin,
  Zap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ExportField {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

interface ExportTargetModalProps {
  children: React.ReactNode;
  onExportComplete?: (format: string, fields: ExportField[]) => void;
}

export default function ExportTargetModal({ children, onExportComplete }: ExportTargetModalProps) {
  const [open, setOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState("csv");
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const [exportFields, setExportFields] = useState<ExportField[]>([
    { id: "address", name: "Property Address", description: "Full street address", enabled: true },
    { id: "price", name: "List Price", description: "Current asking price", enabled: true },
    { id: "bedrooms", name: "Bedrooms", description: "Number of bedrooms", enabled: true },
    { id: "bathrooms", name: "Bathrooms", description: "Number of bathrooms", enabled: true },
    { id: "sqft", name: "Square Footage", description: "Total living area", enabled: true },
    { id: "lot_size", name: "Lot Size", description: "Property lot dimensions", enabled: false },
    { id: "year_built", name: "Year Built", description: "Construction year", enabled: true },
    { id: "property_type", name: "Property Type", description: "Single family, condo, etc.", enabled: true },
    { id: "days_on_market", name: "Days on Market", description: "Time since listing", enabled: true },
    { id: "price_per_sqft", name: "Price per Sq Ft", description: "Calculated price ratio", enabled: false },
    { id: "motivation_score", name: "Motivation Score", description: "Seller motivation rating", enabled: true },
    { id: "investment_grade", name: "Investment Grade", description: "AI-generated grade A-F", enabled: true },
    { id: "estimated_rent", name: "Estimated Rent", description: "Monthly rental potential", enabled: false },
    { id: "cash_flow", name: "Cash Flow Estimate", description: "Monthly cash flow projection", enabled: false },
    { id: "owner_name", name: "Owner Name", description: "Property owner information", enabled: false },
    { id: "owner_phone", name: "Owner Phone", description: "Contact information", enabled: false },
    { id: "mls_number", name: "MLS Number", description: "Multiple listing ID", enabled: false },
    { id: "listing_agent", name: "Listing Agent", description: "Real estate agent details", enabled: false },
  ]);

  const toggleField = (fieldId: string) => {
    setExportFields(prev => 
      prev.map(field => 
        field.id === fieldId 
          ? { ...field, enabled: !field.enabled }
          : field
      )
    );
  };

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const enabledFields = exportFields.filter(f => f.enabled);
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `target-properties-${timestamp}.${exportFormat}`;
      
      // In a real app, this would generate and download the actual file
      const mockData = generateMockExportData(enabledFields);
      downloadFile(mockData, filename, exportFormat);
      
      onExportComplete?.(exportFormat, enabledFields);
      
      toast({
        title: "Export Complete",
        description: `Successfully exported ${mockData.length} properties to ${filename}`,
      });
      
      setOpen(false);
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export target list. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const generateMockExportData = (fields: ExportField[]) => {
    // Generate sample data based on enabled fields
    const sampleProperties = [
      {
        address: "123 Oak Street, Los Angeles, CA 90210",
        price: "$485,000",
        bedrooms: "3",
        bathrooms: "2",
        sqft: "1,850",
        year_built: "1987",
        property_type: "Single Family",
        days_on_market: "67",
        motivation_score: "8.5/10",
        investment_grade: "B+",
      },
      {
        address: "456 Pine Avenue, Long Beach, CA 90802",
        price: "$425,000", 
        bedrooms: "2",
        bathrooms: "2",
        sqft: "1,200",
        year_built: "1995",
        property_type: "Townhouse",
        days_on_market: "89",
        motivation_score: "9.2/10",
        investment_grade: "A-",
      },
      {
        address: "789 Maple Drive, Anaheim, CA 92805",
        price: "$395,000",
        bedrooms: "4",
        bathrooms: "2.5",
        sqft: "2,100",
        year_built: "1983",
        property_type: "Single Family",
        days_on_market: "134",
        motivation_score: "9.8/10",
        investment_grade: "A",
      },
    ];

    return sampleProperties;
  };

  const downloadFile = (data: any[], filename: string, format: string) => {
    let content = "";
    let mimeType = "";

    if (format === "csv") {
      const enabledFields = exportFields.filter(f => f.enabled);
      const headers = enabledFields.map(f => f.name).join(",");
      const rows = data.map(row => 
        enabledFields.map(field => row[field.id] || "").join(",")
      ).join("\n");
      content = headers + "\n" + rows;
      mimeType = "text/csv";
    } else if (format === "json") {
      content = JSON.stringify(data, null, 2);
      mimeType = "application/json";
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportFormats = [
    { value: "csv", label: "CSV Spreadsheet", icon: Table, description: "Excel-compatible format" },
    { value: "json", label: "JSON Data", icon: Database, description: "Structured data format" },
    { value: "pdf", label: "PDF Report", icon: FileText, description: "Formatted document" },
    { value: "email", label: "Email List", icon: Mail, description: "Send via email" },
  ];

  const enabledFieldsCount = exportFields.filter(f => f.enabled).length;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3 text-slate-100 text-2xl">
            <div className="p-2 bg-emerald-500/20 rounded-xl">
              <Download className="h-6 w-6 text-emerald-400" />
            </div>
            Export Target Property List
          </DialogTitle>
          <p className="text-slate-400 mt-2">
            Export your filtered property targets with customizable fields and formats.
          </p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Export Summary */}
          <Card className="bg-black border border-slate-900 rounded-[1.5rem]">
            <CardHeader>
              <CardTitle className="text-slate-200 text-lg">Export Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                  <div className="text-2xl font-bold text-emerald-400">247</div>
                  <div className="text-sm text-slate-400">Properties Found</div>
                </div>
                <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-400">{enabledFieldsCount}</div>
                  <div className="text-sm text-slate-400">Fields Selected</div>
                </div>
                <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-400">8.7</div>
                  <div className="text-sm text-slate-400">Avg Motivation</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Export Format */}
          <Card className="bg-black border border-slate-900 rounded-[1.5rem]">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-slate-200">
                <FileText className="h-5 w-5" />
                <span>Export Format</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {exportFormats.map((format) => {
                  const Icon = format.icon;
                  return (
                    <div 
                      key={format.value}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        exportFormat === format.value 
                          ? "bg-slate-800/50 border-emerald-500/50" 
                          : "bg-slate-900/50 border-slate-700 hover:border-slate-600"
                      }`}
                      onClick={() => setExportFormat(format.value)}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="h-5 w-5 text-emerald-400" />
                        <div>
                          <div className="font-medium text-slate-200">{format.label}</div>
                          <div className="text-sm text-slate-400">{format.description}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Field Selection */}
          <Card className="bg-black border border-slate-900 rounded-[1.5rem]">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-slate-200">
                <Target className="h-5 w-5" />
                <span>Select Fields to Export</span>
                <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {enabledFieldsCount} Selected
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {exportFields.map((field) => (
                  <div 
                    key={field.id}
                    className={`p-3 rounded-lg border transition-all cursor-pointer ${
                      field.enabled 
                        ? "bg-slate-800/50 border-slate-600" 
                        : "bg-slate-900/50 border-slate-700"
                    }`}
                    onClick={() => toggleField(field.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        checked={field.enabled}
                        onCheckedChange={() => toggleField(field.id)}
                      />
                      <div className="flex-1">
                        <div className="font-medium text-slate-200 text-sm">{field.name}</div>
                        <div className="text-xs text-slate-400">{field.description}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-slate-600 text-slate-300 hover:bg-slate-800"
              disabled={isExporting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleExport}
              disabled={isExporting || enabledFieldsCount === 0}
              className="bg-black border-b border-slate-900 hover:from-emerald-700 hover:to-blue-700"
            >
              {isExporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Exporting...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Export {enabledFieldsCount} Fields
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}