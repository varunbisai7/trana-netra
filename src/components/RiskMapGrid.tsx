import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sector } from '@/types/telemetry';
import { cn } from '@/lib/utils';
import { Clock, TrendingUp } from 'lucide-react';

interface RiskMapGridProps {
  sectors: Sector[];
  onSectorClick?: (sector: Sector) => void;
  title?: string;
}

const getRiskColor = (level: string) => {
  switch (level) {
    case 'low':
      return 'bg-risk-low border-risk-low text-white';
    case 'medium':
      return 'bg-risk-medium border-risk-medium text-white';
    case 'high':
      return 'bg-risk-high border-risk-high text-white';
    case 'critical':
      return 'bg-risk-critical border-risk-critical text-white animate-pulse';
    default:
      return 'bg-muted border-muted-foreground';
  }
};

const getRiskBadgeVariant = (level: string) => {
  switch (level) {
    case 'low':
      return 'default';
    case 'medium':
      return 'secondary';
    case 'high':
      return 'destructive';
    case 'critical':
      return 'destructive';
    default:
      return 'outline';
  }
};

export const RiskMapGrid = ({ sectors, onSectorClick, title = "Sector Risk Map" }: RiskMapGridProps) => {
  // Filter out empty sectors and create dynamic grid
  const activeSectors = sectors.filter(sector => sector && sector.id);
  
  // Calculate grid dimensions based on active sectors
  const maxX = Math.max(...activeSectors.map(s => s.grid_position.x));
  const maxY = Math.max(...activeSectors.map(s => s.grid_position.y));
  
  const grid = [];
  for (let y = 0; y <= maxY; y++) {
    const row = [];
    for (let x = 0; x <= maxX; x++) {
      const sector = activeSectors.find(s => s.grid_position.x === x && s.grid_position.y === y);
      if (sector) {
        row.push(sector);
      }
    }
    if (row.length > 0) {
      grid.push(row);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-4 mb-6">
          {grid.map((row, y) =>
            row.map((sector, x) => (
              <div
                key={`${x}-${y}`}
                className={cn(
                  'aspect-square rounded-lg border-2 cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg',
                  sector ? getRiskColor(sector.current_risk_level) : 'bg-muted border-muted-foreground opacity-50',
                  'flex flex-col items-center justify-center p-3 text-center'
                )}
                onClick={() => sector && onSectorClick?.(sector)}
              >
                {sector ? (
                  <>
                    <div className="font-semibold text-lg mb-1">{sector.name}</div>
                    <Badge variant={getRiskBadgeVariant(sector.current_risk_level)} className="mb-2">
                      {sector.current_risk_level.toUpperCase()}
                    </Badge>
                    <div className="flex items-center text-xs opacity-90">
                      <Clock className="h-3 w-3 mr-1" />
                      {new Date(sector.last_updated).toLocaleTimeString()}
                    </div>
                  </>
                ) : (
                  <div className="text-muted-foreground text-sm">Empty</div>
                )}
              </div>
            ))
          )}
        </div>
        
        {/* Legend with Risk Reasons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
          <div className="flex flex-col gap-2 p-3 rounded-lg bg-risk-low/10 border border-risk-low/20">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-risk-low"></div>
              <span className="font-medium text-sm">Low Risk</span>
            </div>
            <p className="text-xs text-muted-foreground">Stable strata, controlled mining operations.</p>
          </div>
          <div className="flex flex-col gap-2 p-3 rounded-lg bg-risk-medium/10 border border-risk-medium/20">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-risk-medium"></div>
              <span className="font-medium text-sm">Medium Risk</span>
            </div>
            <p className="text-xs text-muted-foreground">Moderate vibration impact, partial support failure.</p>
          </div>
          <div className="flex flex-col gap-2 p-3 rounded-lg bg-risk-high/10 border border-risk-high/20">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-risk-high"></div>
              <span className="font-medium text-sm">High Risk</span>
            </div>
            <p className="text-xs text-muted-foreground">Recent seismic activity, high water seepage, loose strata.</p>
          </div>
          <div className="flex flex-col gap-2 p-3 rounded-lg bg-risk-critical/10 border border-risk-critical/20">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-risk-critical animate-pulse"></div>
              <span className="font-medium text-sm">Critical Risk</span>
            </div>
            <p className="text-xs text-muted-foreground">Active rockfall zones, unstable roof.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};