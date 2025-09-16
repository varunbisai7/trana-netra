export interface TelemetryReading {
  id: string;
  site_id: string;
  sector_id: string;
  timestamp: string;
  dem_slope_deg: number;
  dem_roughness: number;
  drone_crack_detected: number;
  drone_optical_flow: number;
  sensor_disp_rate_mmpd: number;
  sensor_strain: number;
  sensor_pore_pressure_kpa: number;
  env_rain_6h_mm: number;
  env_temp_c: number;
  env_vibration_mms: number;
}

export interface RiskPrediction {
  id: string;
  reading_id: string;
  site_id: string;
  sector_id: string;
  timestamp: string;
  model_version: string;
  probability: number;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  top_features: Array<[string, number]>;
}

export interface Alert {
  id: string;
  timestamp: string;
  site_id: string;
  sector_id: string;
  probability: number;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  status: 'active' | 'acknowledged' | 'resolved';
  acknowledged_by?: string;
  acknowledged_at?: string;
}

export interface Site {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  sectors: Sector[];
}

export interface Sector {
  id: string;
  site_id: string;
  name: string;
  grid_position: {
    x: number;
    y: number;
  };
  current_risk_level: 'low' | 'medium' | 'high' | 'critical';
  last_updated: string;
}

export interface DashboardMetrics {
  total_sectors: number;
  active_alerts: number;
  risk_distribution: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  latest_reading_time: string;
}