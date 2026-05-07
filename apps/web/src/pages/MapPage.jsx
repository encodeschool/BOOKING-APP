import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const NAVBAR_HEIGHT = 60;

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
      { name: "Haircut", price: "€30" },
      { name: "Beard", price: "€20" },
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
    services: [{ name: "Facial", price: "€35" }],
  },
];

export default function MapPage() {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);
  const listRef = useRef(null);

  const [selectedVenue, setSelectedVenue] = useState(null);
  const [activeTab, setActiveTab] = useState("venues");
  const [showMap, setShowMap] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  const filtered = mockVenues;

  useEffect(() => {
    if (!mapInstance.current && mapRef.current) {
      mapInstance.current = L.map(mapRef.current).setView(
        [56.96, 24.14],
        13
      );

      L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        { attribution: "&copy; OpenStreetMap" }
      ).addTo(mapInstance.current);
    }
  }, []);

  useEffect(() => {
    if (showMap && mapInstance.current) {
      setTimeout(() => {
        mapInstance.current.invalidateSize();
      }, 200);
    }
  }, [showMap]);

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

  useEffect(() => {
    const el = listRef.current;
    const handleScroll = () => {
      setScrolled(el.scrollTop > 10);
    };
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex">

      {/* LEFT */}
      <div className={`${showMap ? "w-[60%]" : "w-full"} border-r bg-white`}>

        <div
          ref={listRef}
          className="h-[calc(100vh-60px)] overflow-y-auto"
        >

          {/* HEADER */}
          <div
            className={`sticky top-0 z-20 border-b transition-all ${
              scrolled
                ? "bg-white/70 backdrop-blur-md shadow-sm"
                : "bg-white"
            }`}
          >
            <div className="p-4 space-y-4">

              {/* TOP ROW */}
              <div className="flex items-center justify-between">

                {/* Tabs */}
                <div className="flex bg-gray-100 rounded-xl p-1">
                  <button
                    onClick={() => setActiveTab("venues")}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium ${
                      activeTab === "venues"
                        ? "bg-white shadow"
                        : "text-gray-500"
                    }`}
                  >
                    Venues
                  </button>

                  <button
                    onClick={() => setActiveTab("professionals")}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium ${
                      activeTab === "professionals"
                        ? "bg-white shadow"
                        : "text-gray-500"
                    }`}
                  >
                    Professionals
                  </button>
                </div>

                <p className="text-sm text-gray-500">
                  {filtered.length} venues in map area
                </p>

                <div className="flex gap-2">
                  <button className="px-4 py-2 border rounded-xl text-sm hover:bg-gray-50">
                    ⚙ Filters
                  </button>

                  <button
                    onClick={() => setShowMap(!showMap)}
                    className="px-4 py-2 border rounded-xl text-sm hover:bg-gray-50"
                  >
                    {showMap ? "Hide map" : "Show map"}
                  </button>
                </div>

              </div>
            </div>
          </div>

          {/* LIST */}
          <div className="p-5 grid grid-cols-2 gap-5">
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

                <div className="p-4">
                  <div className="flex justify-between">
                    <h3 className="font-semibold">{venue.name}</h3>
                    <span>⭐ {venue.rating}</span>
                  </div>

                  <p className="text-sm text-gray-500">
                    {venue.address}
                  </p>

                  <div className="mt-3 space-y-2">
                    {venue.services.map((s, i) => (
                      <div key={i} className="flex justify-between text-sm">
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

      {/* ✅ MAP (NOT unmounted, just hidden) */}
      <div
        className={`${showMap ? "block" : "hidden"} w-[40%]  h-screen sticky top-0`}
        style={{
          top: NAVBAR_HEIGHT,
          height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
        }}
      >
        <div ref={mapRef} className="w-full h-full" />
      </div>

    </div>
  );
}