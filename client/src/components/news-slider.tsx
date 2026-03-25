import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ExternalLink, 
  Clock, 
  RefreshCw,
  Pause,
  Play,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  author: string;
  description: string;
  categories: string[];
  image?: string;
}

interface NewsSliderProps {
  items: NewsItem[];
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  loading?: boolean;
  onRefresh?: () => void;
  className?: string;
  accentColor?: string;
}

export default function NewsSlider({ 
  items, 
  title, 
  icon: Icon, 
  loading = false, 
  onRefresh,
  className = "",
  accentColor = "orange"
}: NewsSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll functionality
  useEffect(() => {
    if (isPlaying && items.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % items.length);
      }, 6000); // Change every 6 seconds
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, items.length]);

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
      'Markets & Economy': 'bg-blue-500/20 text-blue-400',
      'Mortgage': 'bg-green-500/20 text-green-400',
      'PropTech': 'bg-purple-500/20 text-purple-400',
      'Construction': 'bg-orange-500/20 text-orange-400',
      'Market Analysis': 'bg-red-500/20 text-red-400',
      'Housing Supply': 'bg-yellow-500/20 text-yellow-400',
      'Affordability': 'bg-red-500/20 text-red-400',
      'Market Trends': 'bg-blue-500/20 text-blue-400',
      'Mortgage Rates': 'bg-purple-500/20 text-purple-400',
      'New Construction': 'bg-orange-500/20 text-orange-400',
      'Home Values': 'bg-emerald-500/20 text-emerald-400',
      'Renting': 'bg-cyan-500/20 text-cyan-400',
      'Inventory': 'bg-yellow-500/20 text-yellow-400'
    };
    return colorMap[category] || 'bg-slate-500/20 text-slate-400';
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  if (loading) {
    return (
      <Card className={`bg-black border border-slate-900 rounded-[1.5rem] p-6 h-32 ${className}`}>
        <div className="animate-pulse flex items-center space-x-4">
          <div className="w-8 h-8 bg-slate-700 rounded-lg"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-slate-700 rounded w-1/3"></div>
            <div className="h-3 bg-slate-700 rounded w-3/4"></div>
          </div>
        </div>
      </Card>
    );
  }

  if (!items.length) {
    return (
      <Card className={`bg-black border border-slate-900 rounded-[1.5rem] p-6 h-32 ${className}`}>
        <div className="flex items-center justify-center h-full text-slate-400">
          No news items available
        </div>
      </Card>
    );
  }

  const currentItem = items[currentIndex];

  return (
    <Card className={`bg-black border border-slate-900 rounded-[1.5rem] overflow-hidden ${className}`}>
      {/* Header */}
      <div className={`bg-gradient-to-r ${
        accentColor === 'orange' ? 'from-orange-800/30 to-red-800/30' : 'from-blue-800/30 to-cyan-800/30'
      } p-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 ${
              accentColor === 'orange' ? 'bg-orange-500/20' : 'bg-blue-500/20'
            } rounded-lg`}>
              <Icon className={`h-5 w-5 ${
                accentColor === 'orange' ? 'text-orange-400' : 'text-blue-400'
              }`} />
            </div>
            <h3 className="text-slate-100 font-semibold">{title}</h3>
            <Badge className={`${
              accentColor === 'orange' 
                ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
            }`}>
              <div className={`w-2 h-2 ${
                accentColor === 'orange' ? 'bg-green-400' : 'bg-blue-400'
              } rounded-full animate-pulse mr-1`}></div>
              LIVE
            </Badge>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              onClick={togglePlayPause}
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-slate-200 p-2"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            {onRefresh && (
              <Button
                onClick={onRefresh}
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-slate-200 p-2"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* News Content */}
      <div className="p-4">
        <div className="flex items-center space-x-4">
          {/* Navigation Button */}
          <Button
            onClick={goToPrevious}
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-slate-200 p-2 flex-shrink-0 z-10"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Content Container with Horizontal Scroll Animation */}
          <div className="flex-1 min-w-0 overflow-hidden relative">
            <div 
              className="flex transition-transform duration-1000 ease-in-out"
              style={{ 
                transform: `translateX(-${(currentIndex * 100) / items.length}%)`,
                width: `${items.length * 100}%`
              }}
            >
              {items.map((item, index) => (
                <div 
                  key={index}
                  className="flex-shrink-0"
                  style={{ width: `${100 / items.length}%` }}
                >
                  <div className="flex items-start space-x-4 px-2">
                    {/* Image */}
                    {item.image && (
                      <div className="flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-16 h-12 object-cover rounded-lg"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    
                    {/* Text Content */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-slate-200 font-medium text-sm mb-1 line-clamp-2">
                        {item.title}
                      </h4>
                      <p className="text-slate-400 text-xs mb-2 line-clamp-1">
                        {item.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-xs text-slate-500">
                          <Clock className="h-3 w-3" />
                          <span>{formatTimeAgo(item.pubDate)}</span>
                          <span>•</span>
                          <span>{item.author}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {item.categories.slice(0, 1).map((category, catIndex) => (
                            <Badge 
                              key={catIndex}
                              className={`text-xs px-2 py-0.5 ${getCategoryColor(category)}`}
                            >
                              {category}
                            </Badge>
                          ))}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-slate-400 hover:text-slate-200 p-1 h-auto"
                            onClick={() => window.open(item.link, '_blank')}
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Button */}
          <Button
            onClick={goToNext}
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-slate-200 p-2 flex-shrink-0 z-10"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mt-3 space-x-1">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex 
                  ? (accentColor === 'orange' ? 'bg-orange-400' : 'bg-blue-400')
                  : 'bg-slate-600'
              }`}
            />
          ))}
        </div>
      </div>
    </Card>
  );
}