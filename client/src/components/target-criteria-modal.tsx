import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Target, 
  DollarSign, 
  Home, 
  MapPin, 
  Calendar,
  TrendingUp,
  Users,
  Zap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const targetCriteriaSchema = z.object({
  propertyType: z.string().min(1, "Property type is required"),
  minPrice: z.number().min(0),
  maxPrice: z.number().min(0),
  minBedrooms: z.number().min(0),
  maxBedrooms: z.number().min(0),
  minBathrooms: z.number().min(0),
  maxBathrooms: z.number().min(0),
  minSquareFeet: z.number().min(0),
  maxSquareFeet: z.number().min(0),
  yearBuiltMin: z.number().min(1800),
  yearBuiltMax: z.number().min(1800),
  location: z.string().min(1, "Location is required"),
  radius: z.number().min(1).max(50),
  motivatedSellers: z.boolean(),
  distressedProperties: z.boolean(),
  wholesaleReady: z.boolean(),
  cashFlowPositive: z.boolean(),
  investmentGrade: z.string(),
});

type TargetCriteria = z.infer<typeof targetCriteriaSchema>;

interface TargetCriteriaModalProps {
  children: React.ReactNode;
  onCriteriaSave?: (criteria: TargetCriteria) => void;
}

export default function TargetCriteriaModal({ children, onCriteriaSave }: TargetCriteriaModalProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<TargetCriteria>({
    resolver: zodResolver(targetCriteriaSchema),
    defaultValues: {
      propertyType: "single-family",
      minPrice: 100000,
      maxPrice: 500000,
      minBedrooms: 2,
      maxBedrooms: 5,
      minBathrooms: 1,
      maxBathrooms: 3,
      minSquareFeet: 1000,
      maxSquareFeet: 3000,
      yearBuiltMin: 1980,
      yearBuiltMax: 2024,
      location: "",
      radius: 10,
      motivatedSellers: true,
      distressedProperties: false,
      wholesaleReady: true,
      cashFlowPositive: true,
      investmentGrade: "B+",
    },
  });

  const onSubmit = (data: TargetCriteria) => {
    // Save criteria to localStorage
    localStorage.setItem("targetCriteria", JSON.stringify(data));
    
    // Call parent callback
    onCriteriaSave?.(data);
    
    toast({
      title: "Target Criteria Saved",
      description: "Your investment criteria have been updated successfully.",
    });
    
    setOpen(false);
  };

  const propertyTypes = [
    { value: "single-family", label: "Single Family" },
    { value: "multi-family", label: "Multi-Family" },
    { value: "condo", label: "Condominium" },
    { value: "townhouse", label: "Townhouse" },
    { value: "commercial", label: "Commercial" },
  ];

  const investmentGrades = [
    { value: "A+", label: "A+ - Prime Investment" },
    { value: "A", label: "A - Excellent" },
    { value: "B+", label: "B+ - Very Good" },
    { value: "B", label: "B - Good" },
    { value: "C+", label: "C+ - Fair" },
    { value: "C", label: "C - Average" },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3 text-slate-100 text-2xl">
            <div className="p-2 bg-blue-500/20 rounded-xl">
              <Target className="h-6 w-6 text-blue-400" />
            </div>
            Set Target Investment Criteria
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Property Basics */}
          <Card className="bg-black border border-slate-900 rounded-[1.5rem]">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-slate-200">
                <Home className="h-5 w-5" />
                <span>Property Basics</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Property Type</Label>
                <Select 
                  value={form.watch("propertyType")} 
                  onValueChange={(value) => form.setValue("propertyType", value)}
                >
                  <SelectTrigger className="bg-slate-800 border-slate-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {propertyTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">Location</Label>
                <Input
                  {...form.register("location")}
                  placeholder="City, State or ZIP"
                  className="bg-slate-800 border-slate-600 text-slate-200"
                />
              </div>
            </CardContent>
          </Card>

          {/* Price Range */}
          <Card className="bg-black border border-slate-900 rounded-[1.5rem]">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-slate-200">
                <DollarSign className="h-5 w-5" />
                <span>Price Range</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Minimum Price</Label>
                <Input
                  type="number"
                  {...form.register("minPrice", { valueAsNumber: true })}
                  className="bg-slate-800 border-slate-600 text-slate-200"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Maximum Price</Label>
                <Input
                  type="number"
                  {...form.register("maxPrice", { valueAsNumber: true })}
                  className="bg-slate-800 border-slate-600 text-slate-200"
                />
              </div>
            </CardContent>
          </Card>

          {/* Property Features */}
          <Card className="bg-black border border-slate-900 rounded-[1.5rem]">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-slate-200">
                <Home className="h-5 w-5" />
                <span>Property Features</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Min Bedrooms</Label>
                <Input
                  type="number"
                  {...form.register("minBedrooms", { valueAsNumber: true })}
                  className="bg-slate-800 border-slate-600 text-slate-200"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Max Bedrooms</Label>
                <Input
                  type="number"
                  {...form.register("maxBedrooms", { valueAsNumber: true })}
                  className="bg-slate-800 border-slate-600 text-slate-200"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Min Bathrooms</Label>
                <Input
                  type="number"
                  step="0.5"
                  {...form.register("minBathrooms", { valueAsNumber: true })}
                  className="bg-slate-800 border-slate-600 text-slate-200"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Max Bathrooms</Label>
                <Input
                  type="number"
                  step="0.5"
                  {...form.register("maxBathrooms", { valueAsNumber: true })}
                  className="bg-slate-800 border-slate-600 text-slate-200"
                />
              </div>
            </CardContent>
          </Card>

          {/* Investment Filters */}
          <Card className="bg-black border border-slate-900 rounded-[1.5rem]">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-slate-200">
                <TrendingUp className="h-5 w-5" />
                <span>Investment Filters</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Minimum Investment Grade</Label>
                  <Select 
                    value={form.watch("investmentGrade")} 
                    onValueChange={(value) => form.setValue("investmentGrade", value)}
                  >
                    <SelectTrigger className="bg-slate-800 border-slate-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {investmentGrades.map((grade) => (
                        <SelectItem key={grade.value} value={grade.value}>
                          {grade.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Search Radius (miles)</Label>
                  <div className="px-3">
                    <Slider
                      value={[form.watch("radius")]}
                      onValueChange={([value]) => form.setValue("radius", value)}
                      max={50}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-1">
                      <span>1 mile</span>
                      <span>{form.watch("radius")} miles</span>
                      <span>50 miles</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Toggle Switches */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <div className="space-y-1">
                    <Label className="text-slate-300">Motivated Sellers</Label>
                    <p className="text-xs text-slate-400">Focus on distressed sales</p>
                  </div>
                  <Switch
                    checked={form.watch("motivatedSellers")}
                    onCheckedChange={(checked) => form.setValue("motivatedSellers", checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <div className="space-y-1">
                    <Label className="text-slate-300">Wholesale Ready</Label>
                    <p className="text-xs text-slate-400">Properties suitable for wholesale</p>
                  </div>
                  <Switch
                    checked={form.watch("wholesaleReady")}
                    onCheckedChange={(checked) => form.setValue("wholesaleReady", checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <div className="space-y-1">
                    <Label className="text-slate-300">Cash Flow Positive</Label>
                    <p className="text-xs text-slate-400">Rental income potential</p>
                  </div>
                  <Switch
                    checked={form.watch("cashFlowPositive")}
                    onCheckedChange={(checked) => form.setValue("cashFlowPositive", checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <div className="space-y-1">
                    <Label className="text-slate-300">Distressed Properties</Label>
                    <p className="text-xs text-slate-400">Below market opportunities</p>
                  </div>
                  <Switch
                    checked={form.watch("distressedProperties")}
                    onCheckedChange={(checked) => form.setValue("distressedProperties", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-slate-600 text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-black border-b border-slate-900 hover:bg-emerald-500 hover:text-black"
            >
              <Zap className="h-4 w-4 mr-2" />
              Save Criteria
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}