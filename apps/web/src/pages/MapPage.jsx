import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const mockVenues = [
  {
    id: 1,
    name: "M87 Barber Shop",
    address: "Dzirnavu iela 87, Rīga",
    rating: 5.0,
    reviews: 1337,
    distance: "1.6 km",
    image:
      "https://images.fresha.com/locations/location-profile-images/2506300/4458503/51f9c977-77d0-4e2f-9db9-b3f8747b35e4-M87BarberShop-LV-Rga-CentraRajons-Fresha.jpg",
    lat: 56.9659,
    lng: 24.1433,
    services: [
      { name: "Haircut", duration: "35-45 min", price: "€30" },
      { name: "Beard", duration: "30 min", price: "€20" },
    ],
  },
  {
    id: 2,
    name: "Luxe Beauty Studio",
    address: "Brīvības iela 45, Rīga",
    rating: 4.8,
    reviews: 200,
    distance: "2.1 km",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a9c",
    lat: 56.9721,
    lng: 24.1587,
    services: [{ name: "Facial", duration: "60 min", price: "€35" }],
  },
];

const MapPage = () => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);

  const [search, setSearch] = useState("");
  const [selectedVenue, setSelectedVenue] = useState(null);

  const filtered = mockVenues.filter((v) =>
    v.name.toLowerCase().includes(search.toLowerCase())
  );

  // INIT MAP
  useEffect(() => {
    if (!mapInstance.current) {
      mapInstance.current = L.map(mapRef.current).setView(
        [56.96, 24.14],
        13
      );

      L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          attribution: "&copy; OpenStreetMap",
        }
      ).addTo(mapInstance.current);
    }

    setTimeout(() => {
      mapInstance.current.invalidateSize();
    }, 200);
  }, []);

  // UPDATE MARKERS
  useEffect(() => {
    if (!mapInstance.current) return;

    markersRef.current.forEach((m) =>
      mapInstance.current.removeLayer(m)
    );
    markersRef.current = [];

    filtered.forEach((v) => {
      const marker = L.marker([v.lat, v.lng], {
        icon: L.icon({
          iconUrl: markerIcon,
          shadowUrl: markerShadow,
        }),
      })
        .addTo(mapInstance.current)
        .bindPopup(`<b>${v.name}</b>`);

      marker.on("click", () => setSelectedVenue(v));

      markersRef.current.push(marker);
    });
  }, [filtered]);

  return (
    <div className="flex h-screen">

      {/* LEFT SIDE (SCROLLABLE) */}
      <div className="w-[60%] flex flex-col bg-white border-r">

        {/* FILTER */}
        <div className="sticky top-[60px] z-20 bg-white/70 backdrop-blur-md p-4 border-b shadow-sm">
          <input
            placeholder="Search venues..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 border rounded-xl"
          />
        </div>

        {/* LIST */}
        <div className="flex-1 overflow-y-auto p-5">
          <div className="grid grid-cols-2 gap-5">

            {filtered.map((venue) => (
              <div
                key={venue.id}
                onClick={() => setSelectedVenue(venue)}
                className={`border rounded-3xl overflow-hidden cursor-pointer transition hover:shadow-xl ${
                  selectedVenue?.id === venue.id
                    ? "border-black shadow-xl"
                    : "border-gray-200"
                }`}
              >

                {/* IMAGE */}
                <div className="relative h-56">
                  <img
                    src={venue.image}
                    className="w-full h-full object-cover"
                    alt=""
                  />
                  <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full text-sm shadow">
                    {venue.distance}
                  </div>
                </div>

                {/* CONTENT */}
                <div className="p-4">
                  <div className="flex justify-between">
                    <h3 className="font-semibold">
                      {venue.name}
                    </h3>
                    <span className="text-sm">
                      ⭐ {venue.rating}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500">
                    {venue.address}
                  </p>

                  {/* SERVICES */}
                  <div className="mt-3 space-y-2">
                    {venue.services?.map((s, i) => (
                      <div
                        key={i}
                        className="flex justify-between text-sm"
                      >
                        <span>{s.name}</span>
                        <span>{s.price}</span>
                      </div>
                    ))}
                  </div>

                  <button className="mt-4 w-full bg-black text-white py-2 rounded-xl">
                    Book
                  </button>
                </div>

              </div>
            ))}

          </div>
        </div>
      </div>

      {/* RIGHT MAP (ALWAYS FIXED) */}
      <div className="w-[40%] h-screen sticky top-0">
        <div ref={mapRef} className="w-full h-full" />
      </div>

    </div>
  );
};

export default MapPage;