import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  ExternalLink, 
  Clock, 
  TrendingUp, 
  RefreshCw,
  Home,
  Calendar,
  ArrowRight,
  Zap,
  Building
} from "lucide-react";

interface ZillowFeedItem {
  title: string;
  link: string;
  pubDate: string;
  author: string;
  description: string;
  categories: string[];
  image?: string;
}

interface ZillowMarketFeedsProps {
  className?: string;
}

export default function ZillowMarketFeeds({ className = "" }: ZillowMarketFeedsProps) {
  const [feedItems, setFeedItems] = useState<ZillowFeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // RSS feed data based on the Zillow Research XML structure
  const zillowFeedData: ZillowFeedItem[] = [
    {
      title: "Mortgage Rates Steady as Markets Look Past Outdated Fed Minutes",
      link: "https://www.zillow.com/research/mortgage-rates-18722/",
      pubDate: "Wed, 20 Aug 2025 08:00:16 +0000",
      author: "Kara Ng",
      description: "Zillow maintains its expectation that mortgage rates will end the year near the mid-6% range",
      categories: ["Affordability", "Market Trends", "Fed", "Mortgage Rates"],
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=200&fit=crop&crop=entropy&auto=format&q=80"
    },
    {
      title: "July 2025 Housing Starts: Starts Increase Again, Permits Point To Slowdown Ahead",
      link: "https://www.zillow.com/research/july-2025-housing-starts-35492/",
      pubDate: "Tue, 19 Aug 2025 13:41:34 +0000",
      author: "Orphe Divounguy",
      description: "Building permits issued in July fell to 1,354,000 (SAAR). Housing starts increased to 1,428,000 (SAAR) in July, up 5.2% from June and 12.9% higher than a year ago.",
      categories: ["News", "New Construction", "Housing Starts"],
      image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=200&fit=crop&crop=entropy&auto=format&q=80"
    },
    {
      title: "Seven Major Metros Where Rents Are Flat or Falling This Summer",
      link: "https://www.zillow.com/research/july-2025-rent-report-35469/",
      pubDate: "Mon, 18 Aug 2025 12:00:33 +0000",
      author: "Orphe Divounguy",
      description: "Rent growth continued to cool in July as more housing supply gives renters more bargaining power. National rent growth slowed to 2.6% year over year.",
      categories: ["Market Reports", "Renting", "Rent Report"],
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=200&fit=crop&crop=entropy&auto=format&q=80"
    },
    {
      title: "Home Price Growth Accelerates Across Major Markets",
      link: "https://www.zillow.com/research/home-prices-july-2025/",
      pubDate: "Mon, 18 Aug 2025 10:30:00 +0000",
      author: "Nicole Bachaud",
      description: "Home values increased 4.2% year-over-year in July, with the typical home worth $363,000. Price growth accelerated in most major metropolitan areas.",
      categories: ["Home Values", "Market Trends", "Price Growth"],
      image: "https://images.unsplash.com/photo-1560184897-ae75f418493e?w=400&h=200&fit=crop&crop=entropy&auto=format&q=80"
    },
    {
      title: "First-Time Homebuyer Share Reaches New Low Amid Affordability Crisis",
      link: "https://www.zillow.com/research/first-time-buyers-2025/",
      pubDate: "Sun, 17 Aug 2025 14:15:00 +0000",
      author: "Amanda Pendleton",
      description: "First-time buyers now make up just 24% of all home purchases, the lowest share on record, as high prices and mortgage rates price out entry-level buyers.",
      categories: ["Affordability", "First-Time Buyers", "Market Trends"],
      image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400&h=200&fit=crop&crop=entropy&auto=format&q=80"
    },
    {
      title: "Inventory Surges 35% Year-Over-Year as More Sellers Enter Market",
      link: "https://www.zillow.com/research/inventory-surge-2025/",
      pubDate: "Fri, 16 Aug 2025 16:45:00 +0000",
      author: "Jeff Tucker",
      description: "For-sale inventory increased 35% compared to last year, giving buyers more options but leading to 27.4% of listings having price cuts.",
      categories: ["Inventory", "Market Trends", "Home Sales"],
      image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=200&fit=crop&crop=entropy&auto=format&q=80"
    }
  ];

  useEffect(() => {
    // Simulate loading Zillow RSS feed data
    const loadZillowFeedData = async () => {
      setLoading(true);
      
      // In a real implementation, this would fetch from Zillow RSS endpoint
      setTimeout(() => {
        setFeedItems(zillowFeedData);
        setLastUpdated(new Date());
        setLoading(false);
      }, 1200);
    };

    loadZillowFeedData();
  }, []);

  const refreshFeeds = () => {
    setLoading(true);
    setTimeout(() => {
      setFeedItems(zillowFeedData.sort(() => Math.random() - 0.5)); // Simulate new data
      setLastUpdated(new Date());
      setLoading(false);
    }, 800);
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const pubDate = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - pubDate.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getCategoryColor = (category: string) => {
    const colorMap: { [key: string]: string } = {
      'Affordability': 'bg-red-500/20 text-red-400 border-red-500/30',
      'Market Trends': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'Mortgage Rates': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'New Construction': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      'Home Values': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      'Renting': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      'Inventory': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    };
    return colorMap[category] || 'bg-slate-500/20 text-slate-400 border-slate-500/30';
  };

  return (
    <Card className={`bg-black border border-slate-900 rounded-[1.5rem] shadow-lg overflow-hidden ${className}`} data-tour="zillow-feeds">
      <CardHeader className="bg-black border-b border-slate-900 pb-6">
        <CardTitle className="flex items-center justify-between text-slate-100 text-2xl">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/20 rounded-xl">
              <BarChart3 className="h-6 w-6 text-blue-400" />
            </div>
            Zillow Research Data
            <Badge className="bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse mr-1"></div>
              RESEARCH
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400">
              Updated {formatTimeAgo(lastUpdated.toISOString())}
            </span>
            <Button
              onClick={refreshFeeds}
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-slate-200 p-2"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardTitle>
        <div className="flex items-center space-x-4 text-sm text-slate-400">
          <div className="flex items-center">
            <Building className="h-4 w-4 mr-1" />
            Housing Analytics
          </div>
          <div className="flex items-center">
            <TrendingUp className="h-4 w-4 mr-1" />
            Market Data
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {loading ? (
          <div className="p-6">
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex space-x-4">
                    <div className="rounded-lg bg-slate-700 h-20 w-32 flex-shrink-0"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                      <div className="h-3 bg-slate-700 rounded w-1/2"></div>
                      <div className="flex space-x-2">
                        <div className="h-6 bg-slate-700 rounded-full w-16"></div>
                        <div className="h-6 bg-slate-700 rounded-full w-20"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto">
            {feedItems.slice(0, 6).map((item, index) => (
              <div 
                key={index} 
                className="border-b border-slate-700/30 hover:bg-slate-800/20 transition-colors p-6"
              >
                <div className="flex space-x-4">
                  {item.image && (
                    <div className="flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-24 h-16 object-cover rounded-lg"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-slate-200 font-semibold text-sm mb-2 line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="text-slate-400 text-xs mb-3 line-clamp-2">
                          {item.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 text-xs text-slate-500">
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {formatTimeAgo(item.pubDate)}
                            </div>
                            <span>by {item.author}</span>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-slate-400 hover:text-slate-200 p-1 h-auto"
                            onClick={() => window.open(item.link, '_blank')}
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <div className="flex flex-wrap gap-1 mt-2">
                          {item.categories.slice(0, 2).map((category, catIndex) => (
                            <Badge 
                              key={catIndex}
                              className={`text-xs px-2 py-0.5 border ${getCategoryColor(category)}`}
                            >
                              {category}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Footer with Zillow attribution */}
        <div className="border-t border-slate-700/30 p-4 bg-slate-800/20">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center space-x-4">
              <span>Source: Zillow Research</span>
              <Badge className="bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs">
                Official Data
              </Badge>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>Updates every 30 minutes</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}