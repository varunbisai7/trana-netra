import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface TimeSeriesData {
  timestamp: string;
  probability: number;
  displacement: number;
  strain: number;
  pore_pressure: number;
}

interface TimeSeriesChartProps {
  data: TimeSeriesData[];
  title: string;
}

export const TimeSeriesChart = ({ data, title }: TimeSeriesChartProps) => {
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{formatTime(label)}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value.toFixed(3)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={formatTime}
              className="text-xs"
            />
            <YAxis className="text-xs" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="probability" 
              stroke="hsl(var(--destructive))" 
              strokeWidth={2}
              name="Risk Probability"
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="displacement" 
              stroke="hsl(var(--industrial-blue))" 
              strokeWidth={2}
              name="Displacement (mm/day)"
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="strain" 
              stroke="hsl(var(--industrial-orange))" 
              strokeWidth={2}
              name="Strain"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};