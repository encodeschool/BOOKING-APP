import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ✅ FIX: proper marker icons (Vite/Webpack safe)
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconUrl: markerIconPng,
  shadowUrl: markerShadowPng,
});

// MOCK DATA
const mockVenues = [
  {
    id: 1,
    name: "M87 Barber Shop",
    address: "Dzirnavu iela 87, Riga Central District",
    rating: 4.9,
    reviews: 124,
    price: "€25",
    image:
      "https://images.fresha.com/locations/location-profile-images/2506300/4458503/51f9c977-77d0-4e2f-9db9-b3f8747b35e4-M87BarberShop-LV-Rga-CentraRajons-Fresha.jpg",
    lat: 56.9659,
    lng: 24.1433,
  },
  {
    id: 2,
    name: "Luxe Beauty Studio",
    address: "Brīvības iela 45, Riga",
    rating: 4.8,
    reviews: 89,
    price: "€35",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a9c",
    lat: 56.9721,
    lng: 24.1587,
  },
  {
    id: 3,
    name: "Central Nail Studio",
    address: "Tērbatas iela 12, Riga",
    rating: 4.7,
    reviews: 56,
    price: "€15",
    image: "https://images.unsplash.com/photo-1604654894610-df63bc536371",
    lat: 56.9584,
    lng: 24.1201,
  },
];

const MapWithListView = () => {
  const [venues] = useState(mockVenues);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredVenues = venues.filter(
    (venue) =>
      venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venue.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">

      {/* LEFT PANEL */}
      <div className="w-5/12 border-r flex flex-col bg-white">

        {/* SEARCH */}
        <div className="p-5 border-b sticky top-0 bg-white z-10">
          <input
            type="text"
            placeholder="Search venues..."
            className="w-full px-4 py-4 border rounded-2xl focus:outline-none focus:border-black"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <p className="text-sm text-gray-500 mt-3">
            {filteredVenues.length} venues found
          </p>
        </div>

        {/* LIST */}
        <div className="flex-1 overflow-auto p-5 space-y-4">
          {filteredVenues.map((venue) => (
            <div
              key={venue.id}
              onClick={() => setSelectedVenue(venue)}
              className={`border rounded-3xl overflow-hidden cursor-pointer transition hover:shadow-xl ${
                selectedVenue?.id === venue.id
                  ? "border-black shadow-xl"
                  : "border-gray-200"
              }`}
            >
              <div className="flex">
                <img
                  src={venue.image}
                  className="w-40 h-40 object-cover"
                  alt={venue.name}
                />

                <div className="flex-1 p-5">
                  <h3 className="font-semibold text-xl">{venue.name}</h3>
                  <p className="text-sm text-gray-600">
                    {venue.address}
                  </p>

                  <div className="flex items-center gap-1 mt-2">
                    <span>⭐</span>
                    <span>{venue.rating}</span>
                    <span className="text-gray-400">
                      ({venue.reviews})
                    </span>
                  </div>

                  <div className="mt-4 flex justify-between items-end">
                    <div>
                      <p className="text-xs text-gray-500">From</p>
                      <p className="text-2xl font-bold">{venue.price}</p>
                    </div>

                    <button className="bg-black text-white px-5 py-2 rounded-xl">
                      Book
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT MAP */}
      <div className="flex-1 relative">

        <MapContainer
          center={[56.96, 24.14]}
          zoom={13}
          className="h-full w-full"
          style={{ height: "100%", width: "100%" }}
        >

          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          {filteredVenues.map((venue) => (
            <Marker
              key={venue.id}
              position={[venue.lat, venue.lng]}
              eventHandlers={{
                click: () => setSelectedVenue(venue),
              }}
            >
              <Popup>
                <div className="min-w-[200px]">
                  <h3 className="font-bold">{venue.name}</h3>
                  <p className="text-sm text-gray-600">
                    {venue.address}
                  </p>

                  <button
                    onClick={() => setSelectedVenue(venue)}
                    className="mt-3 w-full bg-black text-white py-2 rounded-xl"
                  >
                    View Details
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}

        </MapContainer>

        {/* FLOATING BUTTONS */}
        <div className="absolute top-6 right-6 flex flex-col gap-3 z-20">

          <button className="bg-white p-4 rounded-2xl shadow-lg text-xl">
            📍
          </button>

          <button className="bg-white p-4 rounded-2xl shadow-lg text-xl">
            🔎
          </button>

        </div>

      </div>
    </div>
  );
};

export default MapWithListView;