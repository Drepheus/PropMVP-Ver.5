import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserCircle, Lock, Phone, Mail, MapPin, Unlock } from "lucide-react";

export default function SkipTracingPlaceholder() {
  return (
    <Card className="bg-black border border-slate-900 rounded-[1.5rem] shadow-lg overflow-hidden">
      <CardHeader className="bg-black border-b border-slate-900 pb-4">
        <CardTitle className="flex items-center justify-between text-slate-100 text-xl">
          Owner Intelligence
          <div className="p-2 bg-purple-500/20 rounded-xl">
            <UserCircle className="h-6 w-6 text-purple-400" />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="text-center py-4">
          <div className="relative mb-6">
            <div className="w-20 h-20 bg-black border-b border-slate-900 rounded-full flex items-center justify-center mx-auto mb-4 float-animation">
              <Lock className="text-amber-400 h-8 w-8" />
            </div>
            <div className="absolute -top-1 -right-1 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center mx-auto">
              <span className="text-white text-xs font-bold">Pro</span>
            </div>
          </div>
          
          <h4 className="text-xl font-bold text-white mb-2">Premium Skip Tracing</h4>
          <p className="text-slate-400 mb-6">Unlock comprehensive owner contact data</p>
          
          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-between p-4 bg-slate-700/20 rounded-xl border border-slate-600/30">
              <div className="flex items-center">
                <Phone className="mr-3 h-5 w-5 text-emerald-400" />
                <span className="text-slate-300 font-medium">Phone Numbers</span>
              </div>
              <div className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full">Multiple</div>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-700/20 rounded-xl border border-slate-600/30">
              <div className="flex items-center">
                <Mail className="mr-3 h-5 w-5 text-blue-400" />
                <span className="text-slate-300 font-medium">Email Addresses</span>
              </div>
              <div className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">Verified</div>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-700/20 rounded-xl border border-slate-600/30">
              <div className="flex items-center">
                <MapPin className="mr-3 h-5 w-5 text-purple-400" />
                <span className="text-slate-300 font-medium">Mailing Address</span>
              </div>
              <div className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full">Current</div>
            </div>
          </div>
          
          <Button className="w-full bg-black border-b border-slate-900 hover:bg-emerald-500 hover:text-black hover:shadow-emerald-500/25 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-amber-500/25">
            <Unlock className="mr-2 h-5 w-5" />
            Upgrade to Premium
          </Button>
          
          <p className="text-xs text-slate-500 mt-4">30-day money-back guarantee</p>
        </div>
      </CardContent>
    </Card>
  );
}
