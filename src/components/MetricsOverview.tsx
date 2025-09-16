import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DashboardMetrics } from '@/types/telemetry';
import { TrendingUp, AlertTriangle, MapPin, Clock } from 'lucide-react';

interface MetricsOverviewProps {
  metrics: DashboardMetrics;
}

export const MetricsOverview = ({ metrics }: MetricsOverviewProps) => {
  const total = Object.values(metrics.risk_distribution).reduce((sum, count) => sum + count, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Sectors</CardTitle>
          <MapPin className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.total_sectors}</div>
          <p className="text-xs text-muted-foreground">
            Active monitoring zones
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
          <AlertTriangle className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-destructive">{metrics.active_alerts}</div>
          <p className="text-xs text-muted-foreground">
            Requiring attention
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Risk Distribution</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-1 mb-2">
            <Badge variant="outline" className="text-xs">
              Critical: {metrics.risk_distribution.critical}
            </Badge>
            <Badge variant="destructive" className="text-xs">
              High: {metrics.risk_distribution.high}
            </Badge>
          </div>
          <div className="flex flex-wrap gap-1">
            <Badge variant="secondary" className="text-xs">
              Medium: {metrics.risk_distribution.medium}
            </Badge>
            <Badge variant="default" className="text-xs">
              Low: {metrics.risk_distribution.low}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Last Update</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {new Date(metrics.latest_reading_time).toLocaleTimeString()}
          </div>
          <p className="text-xs text-muted-foreground">
            {new Date(metrics.latest_reading_time).toLocaleDateString()}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};