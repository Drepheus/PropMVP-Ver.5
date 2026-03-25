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
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Smart Property
              <span className="block bg-black border-b border-slate-900 bg-clip-text text-transparent">
                Investment Tools
              </span>
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

      {/* Features Grid */}
      <div className="py-20 bg-black border-b border-slate-900 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Everything You Need for Success
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Comprehensive tools designed specifically for real estate wholesaling and investment analysis
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="bg-black border border-slate-900 rounded-[1.5rem] bg-white/5 border-white/20 hover:bg-white/10 transition-all duration-300">
              <CardHeader>
                <Search className="h-10 w-10 text-blue-400 mb-4" />
                <CardTitle className="text-white">Property Search</CardTitle>
                <CardDescription className="text-gray-300">
                  Advanced search with comprehensive property details and market insights
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-black border border-slate-900 rounded-[1.5rem] bg-white/5 border-white/20 hover:bg-white/10 transition-all duration-300">
              <CardHeader>
                <Brain className="h-10 w-10 text-purple-400 mb-4" />
                <CardTitle className="text-white">AI Analysis</CardTitle>
                <CardDescription className="text-gray-300">
                  Machine learning powered investment scoring and deal recommendations
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
                <Zap className="h-10 w-10 text-cyan-400 mb-4" />
                <CardTitle className="text-white">Real-time Updates</CardTitle>
                <CardDescription className="text-gray-300">
                  Live market data and instant notifications for time-sensitive opportunities
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-black border border-slate-900 rounded-[1.5rem] bg-white/5 border-white/20 hover:bg-white/10 transition-all duration-300">
              <CardHeader>
                <Shield className="h-10 w-10 text-pink-400 mb-4" />
                <CardTitle className="text-white">Secure & Reliable</CardTitle>
                <CardDescription className="text-gray-300">
                  Enterprise-grade security with 99.9% uptime and data protection
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-black border border-slate-900 rounded-[1.5rem] bg-white/5 border-white/20 hover:bg-white/10 transition-all duration-300">
              <CardHeader>
                <TrendingUp className="h-10 w-10 text-red-400 mb-4" />
                <CardTitle className="text-white">Performance Tracking</CardTitle>
                <CardDescription className="text-gray-300">
                  Monitor your deals, ROI, and portfolio performance with detailed analytics
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
          <AuthModal>
            <Button 
              size="lg"
              className="bg-black border-b border-slate-900 hover:bg-emerald-500 hover:text-black text-white font-semibold px-12 py-4 rounded-lg transition-all duration-200 text-lg"
            >
              Start Your Free Trial
            </Button>
          </AuthModal>
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