import { MapPin, X, Search, ChevronLeft, Navigation, Loader2, CheckCircle2, Move, AlertCircle } from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface LocationSelectorProps {
  selectedLocation: string | null;
  onLocationSelect: (location: string) => void;
  customTrigger?: React.ReactNode;
}

interface Locality {
  name: string;
  lat: number;
  lng: number;
}

interface Landmark {
  lat: number;
  lng: number;
  label: string;
  color: string;
}

interface City {
  id: string;
  name: string;
  icon: string;
  lat: number;
  lng: number;
  defaultLocality: string;
  localities: Locality[];
  landmarks: Landmark[];
}

const citiesData: City[] = [
  {
    id: 'delhi-ncr',
    name: 'Delhi NCR',
    icon: '🏛️',
    lat: 28.6139,
    lng: 77.2090,
    defaultLocality: 'Connaught Place',
    landmarks: [
      { lat: 28.6304, lng: 77.2177, label: 'CP', color: '#c0392b' },
      { lat: 28.6448, lng: 77.1887, label: 'Karol Bagh', color: '#2980b9' },
      { lat: 28.5685, lng: 77.2410, label: 'Lajpat Nagar', color: '#27ae60' },
      { lat: 28.5244, lng: 77.2066, label: 'Saket', color: '#8e44ad' },
      { lat: 28.5708, lng: 77.3258, label: 'Noida', color: '#e67e22' },
    ],
    localities: [
      { name: 'Connaught Place', lat: 28.6304, lng: 77.2177 },
      { name: 'Saket', lat: 28.5244, lng: 77.2066 },
      { name: 'Vasant Kunj', lat: 28.5387, lng: 77.1554 },
      { name: 'Dwarka', lat: 28.5859, lng: 77.0499 },
      { name: 'Karol Bagh', lat: 28.6448, lng: 77.1887 },
      { name: 'Rajouri Garden', lat: 28.6415, lng: 77.1218 },
      { name: 'Noida Sector 62', lat: 28.6258, lng: 77.3732 },
      { name: 'Indirapuram', lat: 28.6346, lng: 77.3686 },
      { name: 'Gurgaon Phase 3', lat: 28.4893, lng: 77.0896 },
      { name: 'Golf Course Road', lat: 28.4418, lng: 77.0988 },
      { name: 'GK 2', lat: 28.5303, lng: 77.2435 },
      { name: 'Safdarjung', lat: 28.5663, lng: 77.2016 },
      { name: 'Rohini', lat: 28.7159, lng: 77.1139 },
      { name: 'Laxmi Nagar', lat: 28.6304, lng: 77.2777 }
    ]
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    icon: '🏢',
    lat: 19.0760,
    lng: 72.8777,
    defaultLocality: 'Andheri West',
    landmarks: [
      { lat: 19.1136, lng: 72.8697, label: 'Andheri', color: '#2563eb' },
      { lat: 19.0596, lng: 72.8295, label: 'Bandra', color: '#c0392b' },
      { lat: 19.1176, lng: 72.9060, label: 'Powai', color: '#27ae60' },
      { lat: 19.1026, lng: 72.8270, label: 'Juhu', color: '#e67e22' },
      { lat: 19.0178, lng: 72.8173, label: 'Worli', color: '#8e44ad' },
    ],
    localities: [
      { name: 'Andheri West', lat: 19.1176, lng: 72.8270 },
      { name: 'Bandra West', lat: 19.0596, lng: 72.8295 },
      { name: 'Juhu', lat: 19.1026, lng: 72.8270 },
      { name: 'Colaba', lat: 18.9067, lng: 72.8147 },
      { name: 'Worli', lat: 19.0178, lng: 72.8173 },
      { name: 'Powai', lat: 19.1176, lng: 72.9060 },
      { name: 'Borivali', lat: 19.2307, lng: 72.8567 },
      { name: 'Chembur', lat: 19.0622, lng: 72.8974 },
      { name: 'Thane West', lat: 19.2183, lng: 72.9781 },
      { name: 'Vashi', lat: 19.0745, lng: 73.0010 },
      { name: 'Goregaon East', lat: 19.1693, lng: 72.8553 },
      { name: 'Nariman Point', lat: 18.9256, lng: 72.8242 },
      { name: 'Lower Parel', lat: 19.0025, lng: 72.8315 }
    ]
  },
  {
    id: 'bangalore',
    name: 'Bangalore',
    icon: '💻',
    lat: 12.9716,
    lng: 77.5946,
    defaultLocality: 'Koramangala',
    landmarks: [
      { lat: 12.9352, lng: 77.6244, label: 'Koramangala', color: '#2563eb' },
      { lat: 12.9719, lng: 77.6412, label: 'Indiranagar', color: '#c0392b' },
      { lat: 12.9063, lng: 77.5857, label: 'JP Nagar', color: '#27ae60' },
      { lat: 12.9698, lng: 77.7500, label: 'Whitefield', color: '#e67e22' },
      { lat: 13.0031, lng: 77.5684, label: 'Malleshwaram', color: '#8e44ad' },
    ],
    localities: [
      { name: 'Koramangala', lat: 12.9352, lng: 77.6244 },
      { name: 'Indiranagar', lat: 12.9719, lng: 77.6412 },
      { name: 'HSR Layout', lat: 12.9128, lng: 77.6388 },
      { name: 'Whitefield', lat: 12.9698, lng: 77.7500 },
      { name: 'JP Nagar', lat: 12.9063, lng: 77.5857 },
      { name: 'Jayanagar', lat: 12.9307, lng: 77.5838 },
      { name: 'Electronic City', lat: 12.8499, lng: 77.6804 },
      { name: 'Marathahalli', lat: 12.9569, lng: 77.7011 },
      { name: 'Bellandur', lat: 12.9304, lng: 77.6784 },
      { name: 'Yelahanka', lat: 13.1007, lng: 77.5963 },
      { name: 'Malleshwaram', lat: 13.0031, lng: 77.5684 }
    ]
  },
  {
    id: 'jaipur',
    name: 'Jaipur',
    icon: '🏰',
    lat: 26.9124,
    lng: 75.7873,
    defaultLocality: 'Vaishali Nagar',
    landmarks: [
      { lat: 26.9124, lng: 75.7873, label: 'City Center', color: '#c0392b' },
      { lat: 26.9076, lng: 75.7360, label: 'Vaishali Nagar', color: '#2563eb' },
      { lat: 26.8549, lng: 75.8242, label: 'Malviya Nagar', color: '#27ae60' },
      { lat: 26.8523, lng: 75.7674, label: 'Mansarovar', color: '#e67e22' },
      { lat: 26.9088, lng: 75.8016, label: 'C-Scheme', color: '#8e44ad' },
    ],
    localities: [
      { name: 'Vaishali Nagar', lat: 26.9076, lng: 75.7360 },
      { name: 'Malviya Nagar', lat: 26.8549, lng: 75.8242 },
      { name: 'Mansarovar', lat: 26.8523, lng: 75.7674 },
      { name: 'C-Scheme', lat: 26.9088, lng: 75.8016 },
      { name: 'Raja Park', lat: 26.8967, lng: 75.8285 },
      { name: 'Tonk Road', lat: 26.8378, lng: 75.7997 },
      { name: 'Bani Park', lat: 26.9272, lng: 75.7958 },
      { name: 'Jagatpura', lat: 26.8289, lng: 75.8646 },
      { name: 'Pratap Nagar', lat: 26.8048, lng: 75.8236 },
      { name: 'Sodala', lat: 26.9015, lng: 75.7725 }
    ]
  },
  {
    id: 'pune',
    name: 'Pune',
    icon: '⛰️',
    lat: 18.5204,
    lng: 73.8567,
    defaultLocality: 'Kothrud',
    landmarks: [
      { lat: 18.5074, lng: 73.8077, label: 'Kothrud', color: '#2563eb' },
      { lat: 18.5362, lng: 73.8940, label: 'Koregaon Park', color: '#c0392b' },
      { lat: 18.5679, lng: 73.9143, label: 'Viman Nagar', color: '#27ae60' },
      { lat: 18.5089, lng: 73.9260, label: 'Hadapsar', color: '#e67e22' },
      { lat: 18.5913, lng: 73.7389, label: 'Hinjewadi', color: '#8e44ad' },
    ],
    localities: [
      { name: 'Kothrud', lat: 18.5074, lng: 73.8077 },
      { name: 'Koregaon Park', lat: 18.5362, lng: 73.8940 },
      { name: 'Viman Nagar', lat: 18.5679, lng: 73.9143 },
      { name: 'Hinjewadi', lat: 18.5913, lng: 73.7389 },
      { name: 'Baner', lat: 18.5590, lng: 73.7797 },
      { name: 'Wakad', lat: 18.5987, lng: 73.7707 },
      { name: 'Hadapsar', lat: 18.5089, lng: 73.9260 },
      { name: 'Kalyani Nagar', lat: 18.5478, lng: 73.9033 },
      { name: 'Shivajinagar', lat: 18.5314, lng: 73.8446 },
      { name: 'Pimple Saudagar', lat: 18.5983, lng: 73.8005 }
    ]
  },
  {
    id: 'hyderabad',
    name: 'Hyderabad',
    icon: '🕌',
    lat: 17.3850,
    lng: 78.4867,
    defaultLocality: 'Gachibowli',
    landmarks: [
      { lat: 17.4401, lng: 78.3489, label: 'Gachibowli', color: '#2563eb' },
      { lat: 17.4483, lng: 78.3741, label: 'HITEC City', color: '#c0392b' },
      { lat: 17.4326, lng: 78.4071, label: 'Jubilee Hills', color: '#27ae60' },
      { lat: 17.4176, lng: 78.4350, label: 'Banjara Hills', color: '#e67e22' },
      { lat: 17.4855, lng: 78.4062, label: 'Kukatpally', color: '#8e44ad' },
    ],
    localities: [
      { name: 'Gachibowli', lat: 17.4401, lng: 78.3489 },
      { name: 'HITEC City', lat: 17.4483, lng: 78.3741 },
      { name: 'Jubilee Hills', lat: 17.4326, lng: 78.4071 },
      { name: 'Banjara Hills', lat: 17.4176, lng: 78.4350 },
      { name: 'Madhapur', lat: 17.4483, lng: 78.3908 },
      { name: 'Kondapur', lat: 17.4622, lng: 78.3568 },
      { name: 'Kukatpally', lat: 17.4855, lng: 78.4062 },
      { name: 'Secunderabad', lat: 17.4399, lng: 78.4983 },
      { name: 'Begumpet', lat: 17.4448, lng: 78.4602 }
    ]
  },
  {
    id: 'chennai',
    name: 'Chennai',
    icon: '🌊',
    lat: 13.0827,
    lng: 80.2707,
    defaultLocality: 'Adyar',
    landmarks: [
      { lat: 13.0012, lng: 80.2565, label: 'Adyar', color: '#2563eb' },
      { lat: 13.0418, lng: 80.2337, label: 'T-Nagar', color: '#c0392b' },
      { lat: 13.0330, lng: 80.2690, label: 'Mylapore', color: '#27ae60' },
      { lat: 13.0850, lng: 80.2101, label: 'Anna Nagar', color: '#e67e22' },
      { lat: 12.9796, lng: 80.2196, label: 'Velachery', color: '#8e44ad' },
    ],
    localities: [
      { name: 'Adyar', lat: 13.0012, lng: 80.2565 },
      { name: 'T-Nagar', lat: 13.0418, lng: 80.2337 },
      { name: 'Mylapore', lat: 13.0330, lng: 80.2690 },
      { name: 'Velachery', lat: 12.9796, lng: 80.2196 },
      { name: 'Nungambakkam', lat: 13.0569, lng: 80.2425 },
      { name: 'Anna Nagar', lat: 13.0850, lng: 80.2101 },
      { name: 'OMR', lat: 12.9274, lng: 80.2307 },
      { name: 'Guindy', lat: 13.0067, lng: 80.2206 },
      { name: 'Besant Nagar', lat: 13.0003, lng: 80.2721 }
    ]
  },
  {
    id: 'kolkata',
    name: 'Kolkata',
    icon: '🌉',
    lat: 22.5726,
    lng: 88.3639,
    defaultLocality: 'Salt Lake',
    landmarks: [
      { lat: 22.5804, lng: 88.4179, label: 'Salt Lake', color: '#2563eb' },
      { lat: 22.5726, lng: 88.4633, label: 'Newtown', color: '#c0392b' },
      { lat: 22.5529, lng: 88.3516, label: 'Park Street', color: '#27ae60' },
      { lat: 22.5851, lng: 88.3182, label: 'Howrah', color: '#e67e22' },
      { lat: 22.5194, lng: 88.3658, label: 'Gariahat', color: '#8e44ad' },
    ],
    localities: [
      { name: 'Salt Lake', lat: 22.5804, lng: 88.4179 },
      { name: 'Newtown', lat: 22.5726, lng: 88.4633 },
      { name: 'Park Street', lat: 22.5529, lng: 88.3516 },
      { name: 'Ballygunge', lat: 22.5298, lng: 88.3664 },
      { name: 'Gariahat', lat: 22.5194, lng: 88.3658 },
      { name: 'Alipore', lat: 22.5317, lng: 88.3290 },
      { name: 'Dum Dum', lat: 22.6413, lng: 88.4312 },
      { name: 'Howrah', lat: 22.5851, lng: 88.3182 },
      { name: 'Behala', lat: 22.4989, lng: 88.3129 }
    ]
  }
];

const getCityFromLocation = (loc: string | null): string | null => {
  if (!loc) return null;
  const parts = loc.split(', ');
  return parts.length > 1 ? parts[parts.length - 1] : null;
};

// MapRecenter pans map dynamically when search/locality Snaps the coordinates
function MapRecenter({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

// Custom Zoom component
function CustomZoomControls() {
  const map = useMap();
  return (
    <div className="absolute top-3 right-3 z-[1000] flex flex-col gap-1 shadow-md">
      <button
        onClick={(e) => { e.stopPropagation(); map.zoomIn(); }}
        className="w-7 h-7 bg-white border border-gray-200 rounded-lg text-base font-bold text-gray-700 hover:bg-gray-50 flex items-center justify-center shadow-xs active:scale-95 transition-transform"
      >
        +
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); map.zoomOut(); }}
        className="w-7 h-7 bg-white border border-gray-200 rounded-lg text-base font-bold text-gray-700 hover:bg-gray-50 flex items-center justify-center shadow-xs active:scale-95 transition-transform"
      >
        −
      </button>
    </div>
  );
}

// Track drag/panning events of Leaflet map
interface MapEventsHandlerProps {
  onCenterChange: (center: L.LatLng) => void;
  setIsMoving: (moving: boolean) => void;
}

function MapEventsHandler({ onCenterChange, setIsMoving }: MapEventsHandlerProps) {
  const map = useMapEvents({
    movestart: () => {
      setIsMoving(true);
    },
    moveend: () => {
      setIsMoving(false);
      onCenterChange(map.getCenter());
    },
    click: (e) => {
      map.setView(e.latlng, map.getZoom());
    }
  });
  return null;
}

// Clean address from Nominatim fields to be neat (e.g. "Golf Course Road, Sector 54, Gurugram")
const cleanAddress = (data: any, defaultLocality: string, cityName: string): string => {
  if (!data) return `${defaultLocality}, ${cityName}`;
  const addr = data.address;
  if (!addr) return data.display_name ? data.display_name.split(',').slice(0, 3).join(',').trim() : `${defaultLocality}, ${cityName}`;

  const parts: string[] = [];

  // Add road or suburb
  if (addr.road) {
    parts.push(addr.road);
  } else if (addr.suburb || addr.neighbourhood) {
    parts.push(addr.suburb || addr.neighbourhood);
  }

  // Add sub-locality / sector
  const local = addr.suburb || addr.neighbourhood || addr.city_district || defaultLocality;
  if (local && !parts.includes(local)) {
    parts.push(local);
  }

  // Add city
  const city = addr.city || addr.town || addr.municipality || cityName;
  if (city && !parts.includes(city)) {
    parts.push(city);
  }

  if (parts.length === 0) {
    return data.display_name.split(',').slice(0, 3).join(',').trim();
  }

  return parts.join(', ');
};

interface RealMapProps {
  city: City;
  locality: string;
  initialCoords: { lat: number; lng: number };
  onConfirm: (address: string) => void;
}

function RealMap({ city, locality, initialCoords, onConfirm }: RealMapProps) {
  const [mapCenter, setMapCenter] = useState<[number, number]>([initialCoords.lat, initialCoords.lng]);
  const [isMoving, setIsMoving] = useState(false);
  const [resolvedAddress, setResolvedAddress] = useState<string>('Locating address...');
  const [houseDetails, setHouseDetails] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Cache to avoid hit limits on Nominatim
  const lastGeocodeRequest = useRef<{ lat: number; lng: number; address: string } | null>(null);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  // Snaps default location address from locality
  useEffect(() => {
    setMapCenter([initialCoords.lat, initialCoords.lng]);
    setResolvedAddress(`${locality}, ${city.name}`);
    triggerReverseGeocode(initialCoords.lat, initialCoords.lng);
  }, [initialCoords, locality, city]);

  const triggerReverseGeocode = useCallback(async (lat: number, lng: number) => {
    // Avoid duplicate calls for the same location
    if (
      lastGeocodeRequest.current &&
      Math.abs(lastGeocodeRequest.current.lat - lat) < 0.0001 &&
      Math.abs(lastGeocodeRequest.current.lng - lng) < 0.0001
    ) {
      setResolvedAddress(lastGeocodeRequest.current.address);
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'en',
            'User-Agent': 'VisvasaHome_LocalServicesMarketplace'
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        const cleaned = cleanAddress(data, locality, city.name);
        setResolvedAddress(cleaned);
        lastGeocodeRequest.current = { lat, lng, address: cleaned };
      } else {
        throw new Error('Reverse geocode failed');
      }
    } catch (error) {
      console.warn('Geocoding error, falling back to local calculation:', error);
      // Fallback address generation
      const nearest = city.landmarks.reduce((prev, curr) => {
        const prevDist = Math.hypot(lat - prev.lat, lng - prev.lng);
        const currDist = Math.hypot(lat - curr.lat, lng - curr.lng);
        return currDist < prevDist ? curr : prev;
      }, city.landmarks[0]);
      
      const fallback = `Near ${nearest.label}, ${locality}, ${city.name}`;
      setResolvedAddress(fallback);
      setErrorMsg('Network issues. snapped to nearest landmark.');
    } finally {
      setIsLoading(false);
    }
  }, [city, locality]);

  const handleCenterChange = (center: L.LatLng) => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    setMapCenter([center.lat, center.lng]);
    setIsLoading(true);
    
    // Debounce the reverse geocoding API to prevent hitting Nominatim rate limits while user pans
    debounceTimeout.current = setTimeout(() => {
      triggerReverseGeocode(center.lat, center.lng);
    }, 600);
  };

  const handleConfirmClick = () => {
    const finalAddress = houseDetails.trim() 
      ? `${houseDetails.trim()}, ${resolvedAddress}`
      : resolvedAddress;
    onConfirm(finalAddress);
  };

  return (
    <div className="flex flex-col" style={{ fontFamily: 'inherit' }}>
      {/* Map instructions banner */}
      <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border-b border-blue-100 flex-shrink-0">
        <Move className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
        <p className="text-[10px] font-bold text-blue-700">
          Drag/pan the map under the <span className="text-blue-500">📍 center pin</span> to set your exact location
        </p>
      </div>

      {/* Map View Wrapper */}
      <div className="relative w-full h-[280px] bg-gray-100 overflow-hidden">
        <MapContainer
          center={mapCenter}
          zoom={16}
          zoomControl={false}
          style={{ height: '100%', width: '100%', zIndex: 1 }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          <MapRecenter center={mapCenter} />
          <MapEventsHandler onCenterChange={handleCenterChange} setIsMoving={setIsMoving} />
          <CustomZoomControls />
        </MapContainer>

        {/* Center overlay pin with dynamic wobble bounce animation */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[999]">
          <div className="relative flex flex-col items-center select-none" style={{ transform: 'translateY(-16px)' }}>
            {/* Pulsing indicator when static */}
            {!isMoving && !isLoading && (
              <div className="absolute w-8 h-8 -top-1 bg-blue-400/20 border border-blue-500/30 rounded-full animate-ping pointer-events-none"></div>
            )}
            
            {/* The pin itself */}
            <div className={`w-8 h-8 rounded-full bg-blue-500 border-2 border-white shadow-lg flex items-center justify-center transition-all duration-200 ${isMoving ? 'scale-110 -translate-y-2.5 shadow-xl' : ''}`}>
              <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
            </div>
            {/* Pin Stem */}
            <div className="w-1 h-3.5 bg-blue-500 shadow-md"></div>
            {/* Pin shadow on map surface */}
            <div className={`w-4 h-1.5 bg-black/20 rounded-full filter blur-[1px] mt-0.5 transition-all duration-200 ${isMoving ? 'scale-50 opacity-40 translate-y-1.5' : ''}`}></div>
          </div>
        </div>

        {/* Compass indicator */}
        <div className="absolute top-3 left-3 z-[1000] w-7 h-7 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm">
          <span className="text-[9px] font-black text-gray-500">N↑</span>
        </div>

        {/* Loading Spinner overlay */}
        {isLoading && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[1000] bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-full shadow-md flex items-center gap-2 border border-gray-100">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
            <span className="text-[10px] font-bold text-gray-600">Locating...</span>
          </div>
        )}
      </div>

      {/* Address Details Input */}
      <div className="bg-white border-t border-gray-100 px-4 py-3 flex flex-col gap-2.5">
        <div className="flex items-start gap-2.5">
          <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-[9px] font-extrabold text-gray-400 uppercase tracking-widest">Map Pinned Location</p>
            <p className="text-xs font-bold text-gray-800 truncate mt-0.5">
              {resolvedAddress}
            </p>
            {errorMsg && (
              <p className="text-[9px] text-blue-600 font-bold mt-0.5 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errorMsg}
              </p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="house-input" className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
            House No. / Flat / Building / Floor Details
          </label>
          <input
            id="house-input"
            type="text"
            placeholder="e.g. Flat 302, Phase 1, Landmark (Optional)"
            value={houseDetails}
            onChange={(e) => setHouseDetails(e.target.value)}
            className="w-full text-xs font-medium text-gray-800 px-3 py-2 border border-gray-200 rounded-lg outline-none bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Confirm Action Button */}
      <div className="px-4 pb-4 pt-1 bg-white">
        <button
          onClick={handleConfirmClick}
          disabled={isLoading && resolvedAddress === 'Locating address...'}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-md shadow-blue-500/10"
        >
          <CheckCircle2 className="w-4 h-4" />
          Confirm This Location
        </button>
      </div>
    </div>
  );
}

// ─── Main LocationSelector ────────────────────────────────────────────────────
export function LocationSelector({ selectedLocation, onLocationSelect, customTrigger }: LocationSelectorProps) {
  const isForceOpen = !selectedLocation;
  const [isOpen, setIsOpen] = useState(isForceOpen);

  // Initialize selected city and locality from parsed location or default to Jaipur
  const [selectedCity, setSelectedCity] = useState<City>(() => {
    if (selectedLocation) {
      const cityName = getCityFromLocation(selectedLocation);
      const matched = citiesData.find(c => c.name === cityName);
      if (matched) return matched;
    }
    return citiesData.find(c => c.id === 'jaipur') || citiesData[0];
  });

  const [selectedLocality, setSelectedLocality] = useState<Locality>(() => {
    if (selectedLocation && selectedCity) {
      const parts = selectedLocation.split(', ');
      const matched = selectedCity.localities.find(l =>
        parts.some(p => p.toLowerCase() === l.name.toLowerCase())
      );
      if (matched) return matched;
    }
    return selectedCity.localities[0];
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);

  // Parse location when selectedLocation changes
  useEffect(() => {
    if (!selectedLocation) {
      setIsOpen(true);
    } else {
      const cityName = getCityFromLocation(selectedLocation);
      const city = citiesData.find(c => c.name === cityName);
      if (city) {
        setSelectedCity(city);
        const parts = selectedLocation.split(', ');
        const matchedLoc = city.localities.find(l =>
          parts.some(p => p.toLowerCase() === l.name.toLowerCase())
        );
        if (matchedLoc) {
          setSelectedLocality(matchedLoc);
        }
      }
    }
  }, [selectedLocation]);

  // Try to automatically detect location on first load if no location is selected yet
  useEffect(() => {
    if (isOpen && !selectedLocation) {
      handleUseCurrentLocation();
    }
  }, [isOpen]);

  const handleMapConfirm = (finalAddress: string) => {
    onLocationSelect(finalAddress);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      return;
    }
    setIsDetecting(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        // Find nearest city based on coordinates
        let nearestCity = citiesData[0];
        let minDist = Infinity;
        citiesData.forEach((city) => {
          const dist = Math.sqrt(Math.pow(lat - city.lat, 2) + Math.pow(lng - city.lng, 2));
          if (dist < minDist) {
            minDist = dist;
            nearestCity = city;
          }
        });
        
        setIsDetecting(false);
        setSelectedCity(nearestCity);
        
        // Snap map to detected live coordinates
        const gpsLocality: Locality = {
          name: 'Current Location',
          lat,
          lng
        };
        setSelectedLocality(gpsLocality);
      },
      (error) => {
        setIsDetecting(false);
        console.warn("GPS detection failed, fallback to default:", error);
      },
      { timeout: 6000 }
    );
  };

  // Compile all localities for global search query
  const allLocalities: { locality: Locality; city: City }[] = [];
  citiesData.forEach(city => {
    city.localities.forEach(loc => {
      allLocalities.push({ locality: loc, city });
    });
  });

  // Filter suggestions
  const suggestions = searchQuery.trim()
    ? allLocalities.filter(item =>
        item.locality.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.city.name.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const handleSuggestionClick = (loc: Locality, city: City) => {
    setSelectedCity(city);
    setSelectedLocality(loc);
    setSearchQuery('');
  };

  return (
    <div className="relative">
      {/* Trigger Button */}
      {customTrigger ? (
        <div onClick={() => setIsOpen(true)} className="cursor-pointer">
          {customTrigger}
        </div>
      ) : (
        <button
          id="tour-location-selector"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 bg-gray-50 hover:bg-blue-50/55 hover:border-blue-200 text-gray-700 hover:text-[#2563EB] transition-all"
        >
          <MapPin className="w-4 h-4 text-[#2563EB]" />
          <span className="text-xs font-semibold truncate max-w-[150px] md:max-w-[200px]">
            {selectedLocation || 'Select Location'}
          </span>
        </button>
      )}

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className={`fixed inset-0 z-50 transition-all duration-300 ${
              isForceOpen ? 'bg-black/60 backdrop-blur-md' : 'bg-black/40 backdrop-blur-xs'
            }`}
            onClick={() => { if (!isForceOpen) setIsOpen(false); }}
          />

          {/* Modal Container */}
          <div className="fixed bottom-0 md:bottom-auto md:top-1/2 left-1/2 -translate-x-1/2 md:-translate-y-1/2 bg-white rounded-t-2xl md:rounded-2xl shadow-2xl z-[60] w-full md:max-w-md overflow-hidden border border-gray-100 flex flex-col transition-all transform duration-300"
            style={{
              maxHeight: 'min(92vh, 670px)',
            }}
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white flex-shrink-0">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Pin Your Location</h3>
                <p className="text-[10px] text-gray-500 font-medium">Select exact address for service delivery</p>
              </div>

              {!isForceOpen && (
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 text-gray-400 hover:text-gray-600 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Controls Panel */}
            <div className="p-4 border-b border-gray-100 space-y-3 flex-shrink-0 bg-white">
              {/* Search Box */}
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search for area, street, or locality..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] outline-none text-xs text-gray-800 transition-all placeholder:text-gray-400 font-medium"
                />
                
                {/* Search Suggestions Overlay */}
                {suggestions.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-100 rounded-xl shadow-xl z-55 overflow-hidden max-h-48 overflow-y-auto">
                    {suggestions.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSuggestionClick(item.locality, item.city)}
                        className="w-full text-left px-4 py-3 hover:bg-blue-50/50 flex items-center gap-2 border-b border-gray-50 last:border-0 transition-colors"
                      >
                        <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-gray-800 truncate">{item.locality.name}</p>
                          <p className="text-[9px] text-gray-400 font-medium">{item.city.name}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Live GPS button */}
              <button
                onClick={handleUseCurrentLocation}
                disabled={isDetecting}
                className="w-full flex items-center justify-center gap-2.5 py-2.5 border border-blue-100 bg-blue-50/40 text-[#2563EB] rounded-xl hover:bg-blue-50 hover:border-blue-200 transition-all font-bold text-xs disabled:opacity-60 group active:scale-[0.99]"
              >
                {isDetecting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Navigation className="w-4 h-4 group-hover:scale-110 transition-transform text-[#2563EB]" />
                )}
                <span>{isDetecting ? 'Detecting Live GPS...' : 'Detect Current Location'}</span>
              </button>
            </div>

            {/* Map Frame */}
            <div className="overflow-y-auto flex-grow">
              <RealMap
                city={selectedCity}
                locality={selectedLocality.name}
                initialCoords={{ lat: selectedLocality.lat, lng: selectedLocality.lng }}
                onConfirm={handleMapConfirm}
              />
            </div>

            {/* Footer notice */}
            <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 text-center flex-shrink-0">
              <p className="text-[9px] text-gray-400 font-semibold leading-relaxed">
                📍 Pinned location helps us assign the nearest verified Visvasa professional.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

