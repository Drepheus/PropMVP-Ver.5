import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  Zap
} from "lucide-react";

export default function Landing() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/10 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-black border-b border-slate-900 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <span className="text-2xl font-bold bg-black border-b border-slate-900 bg-clip-text text-transparent">
                PropAnalyzed
              </span>
            </div>
            <AuthModal>
              <Button className="bg-black border-b border-slate-900 hover:bg-emerald-500 hover:text-black text-white font-semibold px-6 py-2 rounded-lg transition-all duration-200">
                Sign In
              </Button>
            </AuthModal>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <Badge className="mb-6 bg-blue-500/20 text-blue-300 border-blue-500/30">
              AI-Powered Real Estate Analytics
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Transform Your{" "}
              <span className="bg-black border-b border-slate-900 bg-clip-text text-transparent">
                Real Estate
              </span>{" "}
              Investment
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Discover profitable wholesale opportunities with comprehensive market analysis, 
              AI-driven insights, and interactive property visualization tools.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <AuthModal>
                <Button 
                  size="lg"
                  className="bg-black border-b border-slate-900 hover:bg-emerald-500 hover:text-black text-white font-semibold px-8 py-4 rounded-lg transition-all duration-200 text-lg"
                >
                  Get Started Free
                </Button>
              </AuthModal>
              <Button 
                variant="outline" 
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-lg text-lg"
              >
                Watch Demo
              </Button>
            </div>
          </div>
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Everything You Need for Successful Wholesaling
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Advanced analytics and market intelligence tools designed specifically for real estate wholesalers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-black border border-slate-900 rounded-[1.5rem] bg-white/5 border-white/20 hover:bg-white/10 transition-all duration-300">
              <CardHeader>
                <Search className="h-10 w-10 text-blue-400 mb-4" />
                <CardTitle className="text-white">Smart Property Search</CardTitle>
                <CardDescription className="text-gray-300">
                  Find profitable properties with advanced filtering and real-time market data
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-black border border-slate-900 rounded-[1.5rem] bg-white/5 border-white/20 hover:bg-white/10 transition-all duration-300">
              <CardHeader>
                <Brain className="h-10 w-10 text-purple-400 mb-4" />
                <CardTitle className="text-white">AI Investment Analysis</CardTitle>
                <CardDescription className="text-gray-300">
                  Get instant property grading and profit estimates powered by artificial intelligence
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-black border border-slate-900 rounded-[1.5rem] bg-white/5 border-white/20 hover:bg-white/10 transition-all duration-300">
              <CardHeader>
                <MapPin className="h-10 w-10 text-green-400 mb-4" />
                <CardTitle className="text-white">Interactive Heatmaps</CardTitle>
                <CardDescription className="text-gray-300">
                  Visualize investment opportunities with color-coded property potential mapping
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-black border border-slate-900 rounded-[1.5rem] bg-white/5 border-white/20 hover:bg-white/10 transition-all duration-300">
              <CardHeader>
                <BarChart3 className="h-10 w-10 text-yellow-400 mb-4" />
                <CardTitle className="text-white">Market Intelligence</CardTitle>
                <CardDescription className="text-gray-300">
                  Track hot markets, distressed properties, and investor activity in real-time
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-black border border-slate-900 rounded-[1.5rem] bg-white/5 border-white/20 hover:bg-white/10 transition-all duration-300">
              <CardHeader>
                <Users className="h-10 w-10 text-orange-400 mb-4" />
                <CardTitle className="text-white">Lead Management</CardTitle>
                <CardDescription className="text-gray-300">
                  Manage your pipeline with source tracking and conversion optimization
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-black border border-slate-900 rounded-[1.5rem] bg-white/5 border-white/20 hover:bg-white/10 transition-all duration-300">
              <CardHeader>
                <Zap className="h-10 w-10 text-pink-400 mb-4" />
                <CardTitle className="text-white">Export & Reports</CardTitle>
                <CardDescription className="text-gray-300">
                  Generate professional reports and export data for stakeholders
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <Shield className="h-16 w-16 text-blue-400 mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Accelerate Your Wholesaling Business?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of successful real estate investors who use PropAnalyzed to find and close profitable deals faster.
          </p>
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                size="lg"
                className="bg-black border-b border-slate-900 hover:bg-emerald-500 hover:text-black text-white font-semibold px-12 py-4 rounded-lg transition-all duration-200 text-lg"
              >
                Start Your Free Trial
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-md border-white/20">
              <DialogHeader>
                <DialogTitle className="text-center text-2xl font-bold bg-black border-b border-slate-900 bg-clip-text text-transparent">
                  Get Started with PropAnalyzed
                </DialogTitle>
                <DialogDescription className="text-center text-gray-600">
                  Choose your preferred sign-in method to access advanced property analytics
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-6">
                <Button
                  onClick={handleGoogleLogin}
                  className="w-full flex items-center justify-center space-x-3 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 py-3 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <SiGoogle className="h-5 w-5 text-red-500" />
                  <span className="font-medium">Continue with Google</span>
                </Button>
                
                <Button
                  onClick={handleAppleLogin}
                  className="w-full flex items-center justify-center space-x-3 bg-black hover:bg-gray-900 text-white py-3 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <SiApple className="h-5 w-5" />
                  <span className="font-medium">Continue with Apple</span>
                </Button>
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500">
                  By signing in, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </DialogContent>
          </Dialog>
          <p className="text-sm text-gray-400 mt-4">
            No credit card required • Full access to all features
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/20 bg-black/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-black border-b border-slate-900 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-semibold bg-black border-b border-slate-900 bg-clip-text text-transparent">
                PropAnalyzed
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              © 2025 PropAnalyzed. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}