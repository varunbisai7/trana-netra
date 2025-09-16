import { ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, Settings, MapPin, BarChart3, AlertTriangle, Database } from 'lucide-react';
import tranaNetraLogo from '@/assets/trana-netra-logo.png';

interface DashboardLayoutProps {
  children: ReactNode;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const navigationItems = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'risk-map', label: 'Risk Map', icon: MapPin },
  { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
  { id: 'locations', label: 'Mine Locations', icon: MapPin },
  { id: 'data-input', label: 'Data Input', icon: Database },
];

export const DashboardLayout = ({ children, activeTab = 'overview', onTabChange }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <img 
                  src={tranaNetraLogo} 
                  alt="Trana Netra Logo" 
                  className="h-10 w-10 object-contain"
                />
                <h1 className="text-xl font-bold text-industrial-dark">Trana Netra</h1>
              </div>
              <Badge variant="outline" className="text-xs">
                v1.0 Production
              </Badge>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar Navigation */}
          <div className="col-span-12 lg:col-span-2">
            <Card className="p-4">
              <nav className="space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.id}
                      variant={activeTab === item.id ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => onTabChange?.(item.id)}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {item.label}
                    </Button>
                  );
                })}
              </nav>
            </Card>
          </div>

          {/* Main Content */}
          <div className="col-span-12 lg:col-span-10">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};