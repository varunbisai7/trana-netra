import { TelemetryReading, RiskPrediction, Alert, Site, Sector, DashboardMetrics } from '@/types/telemetry';

// Mock sites and sectors
export const mockSites: Site[] = [
  {
    id: 'mine123',
    name: 'Northern Slope Mine',
    location: { lat: -26.8751, lng: 116.9500 },
    sectors: [
      { id: 'A1', site_id: 'mine123', name: 'Sector A1', grid_position: { x: 0, y: 0 }, current_risk_level: 'low', last_updated: '2025-09-10T15:30:00Z' },
      { id: 'A2', site_id: 'mine123', name: 'Sector A2', grid_position: { x: 1, y: 0 }, current_risk_level: 'medium', last_updated: '2025-09-10T15:25:00Z' },
      { id: 'A3', site_id: 'mine123', name: 'Sector A3', grid_position: { x: 2, y: 0 }, current_risk_level: 'high', last_updated: '2025-09-10T15:20:00Z' },
      { id: 'B1', site_id: 'mine123', name: 'Sector B1', grid_position: { x: 0, y: 1 }, current_risk_level: 'low', last_updated: '2025-09-10T15:15:00Z' },
      { id: 'B2', site_id: 'mine123', name: 'Sector B2', grid_position: { x: 1, y: 1 }, current_risk_level: 'critical', last_updated: '2025-09-10T15:10:00Z' },
      { id: 'B3', site_id: 'mine123', name: 'Sector B3', grid_position: { x: 2, y: 1 }, current_risk_level: 'medium', last_updated: '2025-09-10T15:05:00Z' },
      { id: 'C1', site_id: 'mine123', name: 'Sector C1', grid_position: { x: 0, y: 2 }, current_risk_level: 'low', last_updated: '2025-09-10T15:00:00Z' },
      { id: 'C2', site_id: 'mine123', name: 'Sector C2', grid_position: { x: 1, y: 2 }, current_risk_level: 'low', last_updated: '2025-09-10T14:55:00Z' },
      { id: 'C3', site_id: 'mine123', name: 'Sector C3', grid_position: { x: 2, y: 2 }, current_risk_level: 'medium', last_updated: '2025-09-10T14:50:00Z' },
    ]
  }
];

// Mock alerts
export const mockAlerts: Alert[] = [
  {
    id: 'alert001',
    timestamp: '2025-09-10T15:20:00Z',
    site_id: 'mine123',
    sector_id: 'A3',
    probability: 0.85,
    risk_level: 'high',
    message: 'High displacement rate detected. Immediate inspection recommended.',
    status: 'active'
  },
  {
    id: 'alert002',
    timestamp: '2025-09-10T15:10:00Z',
    site_id: 'mine123',
    sector_id: 'B2',
    probability: 0.92,
    risk_level: 'critical',
    message: 'Critical risk conditions: High strain + Heavy rainfall. Evacuate area immediately.',
    status: 'active'
  },
  {
    id: 'alert003',
    timestamp: '2025-09-10T14:45:00Z',
    site_id: 'mine123',
    sector_id: 'A2',
    probability: 0.65,
    risk_level: 'medium',
    message: 'Elevated pore pressure levels detected.',
    status: 'acknowledged',
    acknowledged_by: 'safety.team@mine123.com',
    acknowledged_at: '2025-09-10T14:50:00Z'
  }
];

// Mock telemetry readings
export const mockTelemetryReadings: TelemetryReading[] = [
  {
    id: 'reading001',
    site_id: 'mine123',
    sector_id: 'A3',
    timestamp: '2025-09-10T15:20:00Z',
    dem_slope_deg: 38.1,
    dem_roughness: 0.67,
    drone_crack_detected: 1,
    drone_optical_flow: 0.03,
    sensor_disp_rate_mmpd: 2.8,
    sensor_strain: 0.04,
    sensor_pore_pressure_kpa: 182,
    env_rain_6h_mm: 25.2,
    env_temp_c: 14.3,
    env_vibration_mms: 0.022
  },
  {
    id: 'reading002',
    site_id: 'mine123',
    sector_id: 'B2',
    timestamp: '2025-09-10T15:10:00Z',
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
  }
];

// Mock dashboard metrics
export const mockDashboardMetrics: DashboardMetrics = {
  total_sectors: 9,
  active_alerts: 2,
  risk_distribution: {
    low: 4,
    medium: 3,
    high: 1,
    critical: 1
  },
  latest_reading_time: '2025-09-10T15:30:00Z'
};

// Generate time series data for charts
export const generateTimeSeriesData = (sectorId: string, hours: number = 24) => {
  const data = [];
  const now = new Date();
  
  for (let i = hours; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - (i * 60 * 60 * 1000));
    const baseRisk = sectorId === 'B2' ? 0.8 : sectorId === 'A3' ? 0.6 : 0.3;
    const noise = (Math.random() - 0.5) * 0.2;
    const probability = Math.max(0, Math.min(1, baseRisk + noise));
    
    data.push({
      timestamp: timestamp.toISOString(),
      probability,
      displacement: 1.5 + Math.random() * 2,
      strain: 0.02 + Math.random() * 0.03,
      pore_pressure: 150 + Math.random() * 50
    });
  }
  
  return data;
};