import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { TelemetryReading } from '@/types/telemetry';
import { Database, Send, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DataInputFormProps {
  onSubmit?: (data: Omit<TelemetryReading, 'id'>) => void;
}

export const DataInputForm = ({ onSubmit }: DataInputFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    site_id: 'mine123',
    sector_id: 'A1',
    dem_slope_deg: 35.5,
    dem_roughness: 0.65,
    drone_crack_detected: 0,
    drone_optical_flow: 0.025,
    sensor_disp_rate_mmpd: 1.2,
    sensor_strain: 0.02,
    sensor_pore_pressure_kpa: 150,
    env_rain_6h_mm: 10.5,
    env_temp_c: 15.0,
    env_vibration_mms: 0.015
  });

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: typeof value === 'string' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const reading: Omit<TelemetryReading, 'id'> = {
        ...formData,
        timestamp: new Date().toISOString()
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSubmit?.(reading);
      
      toast({
        title: "Data Submitted Successfully",
        description: `Telemetry data for ${reading.site_id}-${reading.sector_id} has been processed.`,
      });

      // Simulate prediction result
      const riskLevel = formData.sensor_disp_rate_mmpd > 2.5 || formData.env_rain_6h_mm > 20 ? 'high' : 
                       formData.sensor_disp_rate_mmpd > 1.5 || formData.sensor_strain > 0.03 ? 'medium' : 'low';
      
      setTimeout(() => {
        toast({
          title: "Risk Assessment Complete",
          description: `Predicted risk level: ${riskLevel.toUpperCase()}`,
          variant: riskLevel === 'high' ? 'destructive' : 'default'
        });
      }, 1500);

    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error processing your data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      site_id: 'mine123',
      sector_id: 'A1',
      dem_slope_deg: 35.5,
      dem_roughness: 0.65,
      drone_crack_detected: 0,
      drone_optical_flow: 0.025,
      sensor_disp_rate_mmpd: 1.2,
      sensor_strain: 0.02,
      sensor_pore_pressure_kpa: 150,
      env_rain_6h_mm: 10.5,
      env_temp_c: 15.0,
      env_vibration_mms: 0.015
    });
  };

  const loadHighRiskSample = () => {
    setFormData({
      site_id: 'mine123',
      sector_id: 'B2',
      dem_slope_deg: 42.5,
      dem_roughness: 0.78,
      drone_crack_detected: 1,
      drone_optical_flow: 0.045,
      sensor_disp_rate_mmpd: 3.2,
      sensor_strain: 0.055,
      sensor_pore_pressure_kpa: 195,
      env_rain_6h_mm: 32.1,
      env_temp_c: 12.8,
      env_vibration_mms: 0.028
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Telemetry Data Input
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={loadHighRiskSample}>
              Load High Risk Sample
            </Button>
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Site and Sector Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="site_id">Site ID</Label>
              <Select value={formData.site_id} onValueChange={(value) => handleInputChange('site_id', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mine123">mine123 - Northern Slope</SelectItem>
                  <SelectItem value="mine456">mine456 - Eastern Pit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sector_id">Sector ID</Label>
              <Select value={formData.sector_id} onValueChange={(value) => handleInputChange('sector_id', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3'].map(sector => (
                    <SelectItem key={sector} value={sector}>Sector {sector}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* DEM Data */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline">DEM Data</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dem_slope_deg">Slope (degrees)</Label>
                <Input
                  id="dem_slope_deg"
                  type="number"
                  step="0.1"
                  value={formData.dem_slope_deg}
                  onChange={(e) => handleInputChange('dem_slope_deg', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dem_roughness">Roughness</Label>
                <Input
                  id="dem_roughness"
                  type="number"
                  step="0.01"
                  value={formData.dem_roughness}
                  onChange={(e) => handleInputChange('dem_roughness', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Drone Data */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline">Drone Data</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="drone_crack_detected">Crack Detected (0/1)</Label>
                <Select 
                  value={formData.drone_crack_detected.toString()} 
                  onValueChange={(value) => handleInputChange('drone_crack_detected', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">No Crack</SelectItem>
                    <SelectItem value="1">Crack Detected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="drone_optical_flow">Optical Flow</Label>
                <Input
                  id="drone_optical_flow"
                  type="number"
                  step="0.001"
                  value={formData.drone_optical_flow}
                  onChange={(e) => handleInputChange('drone_optical_flow', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Sensor Data */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline">Sensor Data</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sensor_disp_rate_mmpd">Displacement Rate (mm/day)</Label>
                <Input
                  id="sensor_disp_rate_mmpd"
                  type="number"
                  step="0.1"
                  value={formData.sensor_disp_rate_mmpd}
                  onChange={(e) => handleInputChange('sensor_disp_rate_mmpd', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sensor_strain">Strain</Label>
                <Input
                  id="sensor_strain"
                  type="number"
                  step="0.001"
                  value={formData.sensor_strain}
                  onChange={(e) => handleInputChange('sensor_strain', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sensor_pore_pressure_kpa">Pore Pressure (kPa)</Label>
                <Input
                  id="sensor_pore_pressure_kpa"
                  type="number"
                  step="1"
                  value={formData.sensor_pore_pressure_kpa}
                  onChange={(e) => handleInputChange('sensor_pore_pressure_kpa', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Environmental Data */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline">Environmental Data</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="env_rain_6h_mm">Rain 6h (mm)</Label>
                <Input
                  id="env_rain_6h_mm"
                  type="number"
                  step="0.1"
                  value={formData.env_rain_6h_mm}
                  onChange={(e) => handleInputChange('env_rain_6h_mm', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="env_temp_c">Temperature (°C)</Label>
                <Input
                  id="env_temp_c"
                  type="number"
                  step="0.1"
                  value={formData.env_temp_c}
                  onChange={(e) => handleInputChange('env_temp_c', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="env_vibration_mms">Vibration (mm/s)</Label>
                <Input
                  id="env_vibration_mms"
                  type="number"
                  step="0.001"
                  value={formData.env_vibration_mms}
                  onChange={(e) => handleInputChange('env_vibration_mms', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting} className="min-w-32">
              {isSubmitting ? (
                "Processing..."
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Data
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};