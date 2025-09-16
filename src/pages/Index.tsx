import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { MetricsOverview } from '@/components/MetricsOverview';
import { RiskMapGrid } from '@/components/RiskMapGrid';
import { TimeSeriesChart } from '@/components/TimeSeriesChart';
import { AlertsPanel } from '@/components/AlertsPanel';
import { DataInputForm } from '@/components/DataInputForm';
import { MineLocationMap } from '@/components/MineLocationMap';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockSites, mockAlerts, generateTimeSeriesData } from '@/data/mockData';
import { Alert, TelemetryReading, Sector, DashboardMetrics } from '@/types/telemetry';
import { useToast } from '@/hooks/use-toast';
import { Activity, Zap, Shield } from 'lucide-react';
import tranaNetraLogo from '@/assets/trana-netra-logo.png';
import { sendRiskAlert } from '@/utils/alertService';

const Index = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [selectedSector, setSelectedSector] = useState<string>('A3');
  const [sectors, setSectors] = useState(mockSites[0].sectors);
  const [selectedMine, setSelectedMine] = useState<string | null>(null);
  const [mineSectors, setMineSectors] = useState<Record<string, Sector[]>>({});
  const [intervalCount, setIntervalCount] = useState(0); // Track intervals for reset logic
  const [dashboardMetrics, setDashboardMetrics] = useState<DashboardMetrics>({
    total_sectors: 9,
    active_alerts: 2,
    risk_distribution: { low: 4, medium: 3, high: 1, critical: 1 },
    latest_reading_time: new Date().toISOString()
  });
  
  const riskLevels: ('low' | 'medium' | 'high' | 'critical')[] = ['low', 'medium', 'high', 'critical'];
  const rockfallReasons = [
    'unstable roof',
    'gas accumulation', 
    'water seepage',
    'seismic activity',
    'loose strata',
    'partial support failure'
  ];
  
  const currentSite = { ...mockSites[0], sectors };
  const timeSeriesData = generateTimeSeriesData(selectedSector);

  // Generate mine-specific sectors with different counts (3-14 sectors per mine)
  const generateMineSectors = (mineName: string): Sector[] => {
    const sectorCounts: Record<string, number> = {
      'Jharkhand': 8,
      'Karnataka': 6,
      'Chhattisgarh': 12,
      'Odisha': 10,
      'Madhya Pradesh': 7,
      'Telangana': 9,
      'Ramagundam': 5
    };
    
    const count = sectorCounts[mineName] || 6;
    const riskLevels: ('low' | 'medium' | 'high' | 'critical')[] = ['low', 'medium', 'high', 'critical'];
    
    return Array.from({ length: count }, (_, i) => ({
      id: `${mineName.charAt(0)}${i + 1}`,
      site_id: mineName.toLowerCase().replace(' ', '_'),
      name: `${mineName.charAt(0)}${i + 1}`,
      grid_position: {
        x: i % 4,
        y: Math.floor(i / 4)
      },
      current_risk_level: riskLevels[Math.floor(Math.random() * riskLevels.length)],
      last_updated: new Date().toISOString()
    }));
  };

  // Initialize mine sectors
  useEffect(() => {
    const mineNames = ['Jharkhand', 'Karnataka', 'Chhattisgarh', 'Odisha', 'Madhya Pradesh', 'Telangana', 'Ramagundam'];
    const initialMineSectors: Record<string, Sector[]> = {};
    
    mineNames.forEach(mine => {
      initialMineSectors[mine] = generateMineSectors(mine);
    });
    
    setMineSectors(initialMineSectors);
  }, []);

  // Smart risk distribution function
  const updateSectorRisks = (sectors: Sector[], isResetInterval: boolean) => {
    if (isResetInterval) {
      // Reset all Critical/High to Medium/Low every two intervals
      return sectors.map(sector => ({
        ...sector,
        current_risk_level: Math.random() > 0.5 ? 'medium' : 'low' as 'medium' | 'low',
        last_updated: new Date().toISOString()
      }));
    }

    // Normal interval: max 2 Critical/High risk sectors
    const shuffledSectors = [...sectors].sort(() => Math.random() - 0.5);
    let criticalHighCount = 0;
    
    return shuffledSectors.map(sector => {
      let newRiskLevel: 'low' | 'medium' | 'high' | 'critical';
      
      if (criticalHighCount < 2 && Math.random() > 0.7) {
        // Assign Critical or High (max 2 total)
        newRiskLevel = Math.random() > 0.5 ? 'critical' : 'high';
        criticalHighCount++;
      } else {
        // Assign Medium or Low
        newRiskLevel = Math.random() > 0.4 ? 'medium' : 'low';
      }
      
      return {
        ...sector,
        current_risk_level: newRiskLevel,
        last_updated: new Date().toISOString()
      };
    });
  };

  // Check for high/critical risk and send alerts
  const checkAndSendAlerts = (updatedSectors: Sector[]) => {
    const highRiskSectors = updatedSectors.filter(
      sector => sector.current_risk_level === 'high' || sector.current_risk_level === 'critical'
    );

    if (highRiskSectors.length > 0) {
      const adminMobile = localStorage.getItem('adminMobile');
      const adminEmail = localStorage.getItem('adminEmail');
      
      if (adminMobile && adminEmail) {
        highRiskSectors.forEach(async (sector) => {
          const percentage = Math.floor(Math.random() * 65) + 25; // 25-89%
          
          // Send real-time alert
          await sendRiskAlert(sector.name, sector.current_risk_level as 'high' | 'critical', percentage);
          
          toast({
            title: `${sector.current_risk_level.toUpperCase()} RISK ALERT`,
            description: `Alert sent to ${adminEmail} and ${adminMobile} - Sector ${sector.name} requires immediate attention`,
            variant: "destructive",
          });
        });
      }
    }
  };

  // Dynamic risk cycling effect for main sectors and mine sectors
  useEffect(() => {
    const interval = setInterval(() => {
      setIntervalCount(prev => {
        const newCount = prev + 1;
        const isResetInterval = newCount % 2 === 0; // Every two intervals
        
        setSectors(prevSectors => {
          const updatedSectors = updateSectorRisks(prevSectors, isResetInterval);
          
          // Send alerts for high/critical risks
          checkAndSendAlerts(updatedSectors);
          
          // Update metrics
          const riskDistribution = updatedSectors.reduce((acc, sector) => {
            acc[sector.current_risk_level]++;
            return acc;
          }, { low: 0, medium: 0, high: 0, critical: 0 });
          
          setDashboardMetrics(prev => ({
            ...prev,
            risk_distribution: riskDistribution,
            latest_reading_time: new Date().toISOString()
          }));
          
          return updatedSectors;
        });

        // Also update mine sectors with same logic
        setMineSectors(prevMineSectors => {
          const updatedMineSectors: Record<string, Sector[]> = {};
          
          Object.keys(prevMineSectors).forEach(mine => {
            const sectorArray = updateSectorRisks(prevMineSectors[mine], isResetInterval);
            checkAndSendAlerts(sectorArray);
            updatedMineSectors[mine] = sectorArray;
          });
          
          return updatedMineSectors;
        });
        
        return newCount;
      });
    }, 600000); // Change every 10 minutes

    return () => clearInterval(interval);
  }, []);

  const handleSectorClick = (sector: Sector) => {
    setSelectedSector(sector.id);
    
    const riskLevel = sector.current_risk_level.charAt(0).toUpperCase() + sector.current_risk_level.slice(1);
    
    // Only show reason and percentage for Medium, High, and Critical risks
    if (sector.current_risk_level !== 'low') {
      const randomReason = rockfallReasons[Math.floor(Math.random() * rockfallReasons.length)];
      const randomPercentage = Math.floor(Math.random() * 65) + 25; // 25-89%
      
      toast({
        title: `Alert: ${sector.name} Risk Warning`,
        description: `${sector.name} is at ${riskLevel} Risk (${randomPercentage}%) due to ${randomReason}.`,
        variant: sector.current_risk_level === 'critical' || sector.current_risk_level === 'high' ? 'destructive' : 'default'
      });
    } else {
      toast({
        title: `Sector ${sector.name} Status`,
        description: `${sector.name} is at ${riskLevel} Risk - Operations Normal.`,
        variant: 'default'
      });
    }
  };

  const handleAlertAcknowledge = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { ...alert, status: 'acknowledged' as const, acknowledged_by: 'safety.team@mine123.com', acknowledged_at: new Date().toISOString() }
        : alert
    ));
    toast({
      title: "Alert Acknowledged",
      description: "Alert has been acknowledged and marked for review.",
    });
  };

  const handleAlertResolve = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { ...alert, status: 'resolved' as const }
        : alert
    ));
    toast({
      title: "Alert Resolved",
      description: "Alert has been resolved and closed.",
    });
  };

  const handleDataSubmit = (data: Omit<TelemetryReading, 'id'>) => {
    console.log('Submitted telemetry data:', data);
    // In a real app, this would send data to the backend
  };

  const handleMineLocationClick = (mineName: string) => {
    setSelectedMine(mineName);
    setActiveTab('risk-map');
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <MetricsOverview metrics={dashboardMetrics} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RiskMapGrid 
          sectors={currentSite.sectors} 
          onSectorClick={handleSectorClick}
        />
        
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-green-500" />
                    ML Model Service
                  </span>
                  <Badge variant="default">Online</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-500" />
                    Data Pipeline
                  </span>
                  <Badge variant="default">Healthy</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-green-500" />
                    Alert System
                  </span>
                  <Badge variant="default">Active</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>B2 - Critical alert triggered</span>
                  <span className="text-muted-foreground">2 min ago</span>
                </div>
                <div className="flex justify-between">
                  <span>A3 - High risk prediction</span>
                  <span className="text-muted-foreground">12 min ago</span>
                </div>
                <div className="flex justify-between">
                  <span>Data sync completed</span>
                  <span className="text-muted-foreground">15 min ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <TimeSeriesChart 
        data={timeSeriesData} 
        title={`Sector ${selectedSector} - Risk Trends (24h)`}
      />
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'risk-map':
        const sectorsToShow = selectedMine ? mineSectors[selectedMine] || [] : currentSite.sectors;
        const mapTitle = selectedMine ? `${selectedMine} Mine Risk Map` : 'Sector Risk Map';
        
        return (
          <div className="space-y-6">
            {selectedMine && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Showing risk map for:</span>
                <span className="font-medium text-foreground">{selectedMine} Mine</span>
                <button 
                  onClick={() => setSelectedMine(null)}
                  className="text-primary hover:underline ml-2"
                >
                  Back to Main Map
                </button>
              </div>
            )}
            <RiskMapGrid 
              sectors={sectorsToShow}
              onSectorClick={handleSectorClick}
              title={mapTitle}
            />
            <TimeSeriesChart 
              data={timeSeriesData} 
              title={`Sector ${selectedSector} - Detailed Analysis`}
            />
          </div>
        );
      case 'alerts':
        return <AlertsPanel />;
      case 'data-input':
        return <DataInputForm onSubmit={handleDataSubmit} />;
      case 'locations':
        return <MineLocationMap onMineClick={handleMineLocationClick} />;
      default:
        return renderOverview();
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </DashboardLayout>
  );
};

export default Index;
