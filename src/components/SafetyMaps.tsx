import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Icon } from 'leaflet';
import { Search, MapPin, Home } from 'lucide-react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";

// Location interface for lat, lng coordinates
interface Location {
  lat: number;
  lng: number;
}

interface Disaster {
  id: number;
  type: string;
  location: Location;
  severity: string;
}

interface Shelter {
  id: number;
  name: string;
  location: Location;
}

interface EvacuationRoute {
  id: number;
  path: Location[];
}

// Mock data - Natural disasters in Kenya
const disasters: Disaster[] = [
  { id: 1, type: 'Flood', location: { lat: -1.286389, lng: 36.817223 }, severity: 'High' }, // Nairobi
  { id: 2, type: 'Flood', location: { lat: -0.048545, lng: 37.335072 }, severity: 'Medium' }, // Kisumu
  { id: 3, type: 'Drought', location: { lat: -2.029134, lng: 38.839417 }, severity: 'High' }, // Turkana
  { id: 4, type: 'Wildfire', location: { lat: -0.021175, lng: 36.767746 }, severity: 'Medium' }, // Mt. Kenya region
  { id: 5, type: 'Flood', location: { lat: -3.072602, lng: 39.643524 }, severity: 'High' }, // Mombasa
  { id: 6, type: 'Earthquake', location: { lat: -4.202646, lng: 39.725456 }, severity: 'Medium' }, // Lamu
  { id: 7, type: 'Landslide', location: { lat: -0.780685, lng: 34.998978 }, severity: 'High' }, // Eldoret
  { id: 8, type: 'Drought', location: { lat: -2.804499, lng: 37.621137 }, severity: 'Medium' }, // Garissa
  { id: 9, type: 'Flood', location: { lat: -1.966200, lng: 37.681421 }, severity: 'High' }, // Nakuru
  { id: 10, type: 'Wildfire', location: { lat: -1.469062, lng: 37.322559 }, severity: 'Low' }, // Aberdares
  { id: 11, type: 'Flood', location: { lat: -1.283333, lng: 36.823333 }, severity: 'Medium' }, // Nairobi River
  { id: 12, type: 'Earthquake', location: { lat: -4.046467, lng: 39.668282 }, severity: 'High' }, // Kisumu
  { id: 13, type: 'Landslide', location: { lat: -0.349136, lng: 37.007241 }, severity: 'Low' }, // Nanyuki
  { id: 14, type: 'Wildfire', location: { lat: -1.752347, lng: 36.811035 }, severity: 'High' }, // Laikipia
  { id: 15, type: 'Flood', location: { lat: -3.688085, lng: 40.074456 }, severity: 'Medium' }, // Tana River
];

const shelters: Shelter[] = [
  { id: 1, name: 'Nairobi National Park Shelter', location: { lat: -1.325125, lng: 36.749175 } },
  { id: 2, name: 'Kisumu Community Shelter', location: { lat: -0.091699, lng: 34.768013 } },
  { id: 3, name: 'Turkana Relief Shelter', location: { lat: -2.043348, lng: 36.080484 } },
  { id: 4, name: 'Mombasa Coastal Shelter', location: { lat: -3.068931, lng: 39.625766 } },
  { id: 5, name: 'Lamu Island Shelter', location: { lat: -4.173158, lng: 39.590564 } },
];

const evacuationRoutes: EvacuationRoute[] = [
  { id: 1, path: [
    { lat: -1.286389, lng: 36.817223 }, // Nairobi center
    { lat: -1.325125, lng: 36.749175 }, // Nairobi National Park Shelter
  ]},
  { id: 2, path: [
    { lat: -0.048545, lng: 37.335072 }, // Kisumu
    { lat: -0.091699, lng: 34.768013 }, // Kisumu Community Shelter
  ]},
  { id: 3, path: [
    { lat: -2.029134, lng: 38.839417 }, // Turkana
    { lat: -2.043348, lng: 36.080484 }, // Turkana Relief Shelter
  ]},
  { id: 4, path: [
    { lat: -3.072602, lng: 39.643524 }, // Mombasa
    { lat: -3.068931, lng: 39.625766 }, // Mombasa Coastal Shelter
    { lat: -3.060000, lng: 39.630000 }  // A curved route near the coastline
  ]},
  { id: 5, path: [
    { lat: -4.202646, lng: 39.725456 }, // Lamu
    { lat: -4.173158, lng: 39.590564 }, // Lamu Island Shelter
    { lat: -4.180000, lng: 39.600000 }  // A curved route around the island
  ]},
];

// Custom icons for disaster and shelter
const disasterIcon = new Icon({
  iconUrl: '/disaster.svg', // You can replace this with an appropriate icon for disasters in Kenya
  iconSize: [25, 25],
});

const shelterIcon = new Icon({
  iconUrl: '/shelter.svg', // You can replace this with an appropriate icon for shelters
  iconSize: [25, 25],
});

const SafetyMaps: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const center: Location = { lat: -1.286389, lng: 36.817223 }; // Centering on Nairobi, Kenya

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h1 className="text-3xl font-bold mb-6">Kenya Safety Maps & Evacuation Routes</h1>
      
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <div className="relative flex-grow mr-2">
            <Input
              type="text"
              placeholder="Search by location"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            Search
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardContent className="p-0">
            <MapContainer
              center={[center.lat, center.lng]}
              zoom={7}
              style={{ height: '600px', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              
              {disasters.map((disaster) => (
                <Marker
                  key={disaster.id}
                  position={[disaster.location.lat, disaster.location.lng]}
                  icon={disasterIcon}
                >
                  <Popup>
                    <strong>{disaster.type}</strong><br />
                    Severity: {disaster.severity}
                  </Popup>
                </Marker>
              ))}

              {shelters.map((shelter) => (
                <Marker
                  key={shelter.id}
                  position={[shelter.location.lat, shelter.location.lng]}
                  icon={shelterIcon}
                >
                  <Popup>{shelter.name}</Popup>
                </Marker>
              ))}

              {evacuationRoutes.map((route) => (
                <Polyline
                  key={route.id}
                  positions={route.path.map(pos => [pos.lat, pos.lng])}
                  color="blue"
                  weight={4}
                  opacity={0.7}
                  dashArray="5,10"
                />
              ))}
            </MapContainer>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h2 className="text-xl font-semibold mb-4">Legend</h2>
            <div className="space-y-2">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-red-500 mr-2" />
                <span>Disaster Area</span>
              </div>
              <div className="flex items-center">
                <Home className="h-5 w-5 text-green-500 mr-2" />
                <span>Shelter</span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-0.5 bg-blue-500 mr-2"></div>
                <span>Evacuation Route</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SafetyMaps;
