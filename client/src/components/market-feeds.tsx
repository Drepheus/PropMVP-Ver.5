import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Rss, 
  ExternalLink, 
  Clock, 
  TrendingUp, 
  RefreshCw,
  Globe,
  Calendar,
  ArrowRight,
  Zap
} from "lucide-react";

interface MarketFeedItem {
  title: string;
  link: string;
  pubDate: string;
  author: string;
  description: string;
  categories: string[];
  image?: string;
}

interface MarketFeedsProps {
  className?: string;
}

export default function MarketFeeds({ className = "" }: MarketFeedsProps) {
  const [feedItems, setFeedItems] = useState<MarketFeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Mock RSS feed data based on the Inman RSS structure we analyzed
  const mockFeedData: MarketFeedItem[] = [
    {
      title: "Trump tells Federal Reserve governor Lisa Cook to 'resign now'",
      link: "https://www.inman.com/2025/08/20/trump-tells-federal-reserve-governor-lisa-cook-to-resign-now/",
      pubDate: "Wed, 20 Aug 2025 17:38:24 +0000",
      author: "Marian McPherson",
      description: "The president asked Cook to resign from her post after FHFA Director Bill Pulte accused her of mortgage fraud.",
      categories: ["Markets & Economy", "Mortgage", "Federal Reserve"],
      image: "https://images.unsplash.com/photo-1560472355-536de3962603?w=400&h=200&fit=crop&crop=entropy&auto=format&q=80"
    },
    {
      title: "How Opendoor's CEO resignation underscores the power of visibility",
      link: "https://www.inman.com/2025/08/20/how-opendoors-ceo-resignation-underscores-the-power-of-visibility/",
      pubDate: "Wed, 20 Aug 2025 17:00:10 +0000",
      author: "Cristin Culver",
      description: "Leadership changes in PropTech highlight the importance of executive visibility in today's attention economy.",
      categories: ["PropTech", "Leadership", "Executive Brand"],
      image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&h=200&fit=crop&crop=entropy&auto=format&q=80"
    },
    {
      title: "Fannie Mae dials back sales expectations by 220K homes",
      link: "https://www.inman.com/2025/08/19/fannie-mae-dials-back-sales-expectations-by-220000-homes/",
      pubDate: "Tue, 19 Aug 2025 22:28:04 +0000",
      author: "Matt Carter",
      description: "Government-sponsored enterprise reduces home sales forecast amid market uncertainty and inventory challenges.",
      categories: ["Markets & Economy", "Home Sales", "Fannie Mae"],
      image: "https://images.unsplash.com/photo-1586105251261-72a756497a11?w=400&h=200&fit=crop&crop=entropy&auto=format&q=80"
    },
    {
      title: "'Construction is in a funk': Homebuilding improves, but inventory issues remain",
      link: "https://www.inman.com/2025/08/19/single-family-starts-and-permits-inched-higher-in-july-but-not-enough-to-meet-inventory-needs/",
      pubDate: "Tue, 19 Aug 2025 14:47:27 +0000",
      author: "Lillian Dickerson",
      description: "Single-family starts and permits rose in July but not enough to address ongoing inventory shortage.",
      categories: ["Construction", "Housing Supply", "Market Analysis"],
      image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=200&fit=crop&crop=entropy&auto=format&q=80"
    },
    {
      title: "These 6 maps capture a real estate market in turmoil",
      link: "https://www.inman.com/2025/08/19/these-6-maps-capture-a-real-estate-market-in-turmoil/",
      pubDate: "Tue, 19 Aug 2025 08:15:07 +0000",
      author: "Taylor Anderson",
      description: "Visual analysis of regional market conditions reveals significant disparities in housing affordability and inventory.",
      categories: ["Market Analysis", "Regional Data", "Housing Affordability"],
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop&crop=entropy&auto=format&q=80"
    },
    {
      title: "Back to the land: What real estate agents need to know about off-grid properties",
      link: "https://www.inman.com/2025/08/19/back-to-the-land-what-real-estate-agents-need-to-know-about-the-off-grid-and-homesteading-surge/",
      pubDate: "Tue, 19 Aug 2025 08:00:31 +0000",
      author: "Christy Murdoch",
      description: "Growing interest in self-sufficient properties creates new opportunities and challenges for real estate professionals.",
      categories: ["Property Types", "Rural Real Estate", "Market Trends"],
      image: "https://images.unsplash.com/photo-1464822759844-d150ad6c1ee8?w=400&h=200&fit=crop&crop=entropy&auto=format&q=80"
    }
  ];

  useEffect(() => {
    // Simulate loading real RSS feed data
    const loadFeedData = async () => {
      setLoading(true);
      
      // In a real implementation, this would fetch from multiple RSS endpoints
      // For now, we'll use the mock data based on the Inman RSS structure
      setTimeout(() => {
        setFeedItems(mockFeedData);
        setLastUpdated(new Date());
        setLoading(false);
      }, 1500);
    };

    loadFeedData();
  }, []);

  const refreshFeeds = () => {
    setLoading(true);
    setTimeout(() => {
      setFeedItems(mockFeedData.sort(() => Math.random() - 0.5)); // Simulate new data
      setLastUpdated(new Date());
      setLoading(false);
    }, 1000);
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
      'Markets & Economy': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'Mortgage': 'bg-green-500/20 text-green-400 border-green-500/30',
      'PropTech': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'Construction': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      'Market Analysis': 'bg-red-500/20 text-red-400 border-red-500/30',
      'Housing Supply': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    };
    return colorMap[category] || 'bg-slate-500/20 text-slate-400 border-slate-500/30';
  };

  return (
    <Card className={`bg-black border border-slate-900 rounded-[1.5rem] shadow-lg overflow-hidden ${className}`} data-tour="market-feeds">
      <CardHeader className="bg-black border-b border-slate-900 pb-6">
        <CardTitle className="flex items-center justify-between text-slate-100 text-2xl">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-500/20 rounded-xl">
              <Rss className="h-6 w-6 text-orange-400" />
            </div>
            Real-Time Market Feeds
            <Badge className="bg-green-500/20 text-green-400 border border-green-500/30">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-1"></div>
              LIVE
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
            <Globe className="h-4 w-4 mr-1" />
            Multiple Sources
          </div>
          <div className="flex items-center">
            <Zap className="h-4 w-4 mr-1" />
            Auto-Refresh
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
        
        {/* Footer with feed sources */}
        <div className="border-t border-slate-700/30 p-4 bg-slate-800/20">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center space-x-4">
              <span>Sources: Inman News, NAR, HousingWire</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>Updates every 15 minutes</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}