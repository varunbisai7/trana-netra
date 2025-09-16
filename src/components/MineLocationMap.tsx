import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Map, MapPin } from 'lucide-react';
import L from 'leaflet';
import tranaNetraLogo from '@/assets/trana-netra-logo.png';
import 'leaflet/dist/leaflet.css';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
// @ts-ignore
import * as GeocoderControl from 'leaflet-control-geocoder';

// Fix for default markers in Leaflet with React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Sector {
  sector: string;
  minerals: string;
  risk: 'Low' | 'Medium' | 'High';
}

interface StateLocation {
  name: string;
  coords: [number, number];
  sectors: Sector[];
}

const stateSectors: Record<string, Sector[]> = {
  "Jharkhand": [
    { sector: "Jharia", minerals: "Coal", risk: "High" },
    { sector: "Bokaro", minerals: "Coal", risk: "Medium" }
  ],
  "Karnataka": [
    { sector: "Kolar Gold Fields", minerals: "Gold", risk: "Low" },
    { sector: "Kudremukh", minerals: "Iron Ore", risk: "Medium" }
  ],
  "Chhattisgarh": [
    { sector: "Bailadila", minerals: "Iron Ore", risk: "High" },
    { sector: "Dalli Rajhara", minerals: "Iron Ore", risk: "Medium" }
  ],
  "Odisha": [
    { sector: "Keonjhar", minerals: "Iron Ore", risk: "High" },
    { sector: "Talcher", minerals: "Coal", risk: "Medium" }
  ],
  "Madhya Pradesh": [
    { sector: "Singrauli", minerals: "Coal", risk: "High" },
    { sector: "Panna", minerals: "Diamond", risk: "Low" }
  ],
  "Telangana": [
    { sector: "Kothagudem", minerals: "Coal", risk: "Medium" },
    { sector: "Ramagundam", minerals: "Coal", risk: "High" },
    { sector: "Mancherial", minerals: "Coal", risk: "Medium" }
  ],
  "Ramagundam": [
    { sector: "OCP 3", minerals: "Coal", risk: "High" }
  ]
};

const stateLocations: StateLocation[] = [
  { name: "Jharkhand", coords: [23.61, 85.28], sectors: stateSectors["Jharkhand"] },
  { name: "Karnataka", coords: [15.32, 75.71], sectors: stateSectors["Karnataka"] },
  { name: "Chhattisgarh", coords: [21.27, 81.61], sectors: stateSectors["Chhattisgarh"] },
  { name: "Odisha", coords: [20.95, 85.10], sectors: stateSectors["Odisha"] },
  { name: "Madhya Pradesh", coords: [23.25, 77.41], sectors: stateSectors["Madhya Pradesh"] },
  { name: "Telangana", coords: [17.96, 79.59], sectors: stateSectors["Telangana"] },
  { name: "Ramagundam", coords: [18.719911938667778, 79.52777800410752], sectors: stateSectors["Ramagundam"] }
];

interface MineLocationMapProps {
  onMineClick?: (mineName: string) => void;
}

export const MineLocationMap = ({ onMineClick }: MineLocationMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [selectedState, setSelectedState] = useState<string>('');

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map centered on India
    const map = L.map(mapRef.current).setView([22.9734, 78.6569], 5);
    mapInstanceRef.current = map;

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Add geocoder control
    const geocoder = GeocoderControl.geocoder({
      defaultMarkGeocode: true,
      placeholder: 'Search for mine locations...',
      errorMessage: 'Location not found'
    }).addTo(map);

    // Add state markers
    stateLocations.forEach(state => {
      const marker = L.marker(state.coords).addTo(map);
      marker.bindPopup(`
        <div class="font-semibold">${state.name}</div>
        <div class="text-sm text-muted-foreground">Click for mining details</div>
        <div class="text-xs">
          Lat: ${state.coords[0].toFixed(4)}, Lng: ${state.coords[1].toFixed(4)}
        </div>
      `);
      marker.on('click', () => {
        setSelectedState(state.name);
        onMineClick?.(state.name);
      });
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <img 
            src={tranaNetraLogo} 
            alt="Trana Netra" 
            className="h-6 w-6 object-contain"
          />
          Mine Locations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          ref={mapRef} 
          className="h-[600px] w-full rounded-lg border overflow-hidden"
        />
        
        {/* Details Panel */}
        <div className="mt-4 p-4 bg-muted/50 rounded-lg border">
          {selectedState ? (
            <div>
              <h3 className="font-semibold text-lg mb-2">{selectedState} - Mining Sectors</h3>
              <div className="space-y-2">
                {stateSectors[selectedState]?.map((sector, index) => (
                  <div key={index} className="p-3 border-l-4 border-primary bg-background/50 rounded-r">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Sector: {sector.sector}</p>
                        <p className="text-sm text-muted-foreground">Minerals: {sector.minerals}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        sector.risk === 'High' ? 'bg-destructive/20 text-destructive' :
                        sector.risk === 'Medium' ? 'bg-orange-500/20 text-orange-600' :
                        'bg-green-500/20 text-green-600'
                      }`}>
                        Risk: {sector.risk}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              ℹ️ Select a state marker on the map to view mining sector details here.
            </p>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {stateLocations.map((state, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <MapPin className="h-3 w-3 text-primary" />
              <span className="font-medium">{state.name}</span>
              <span className="text-muted-foreground">({state.sectors.length} sectors)</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};