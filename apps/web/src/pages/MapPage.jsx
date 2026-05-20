import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { useBooking } from "../context/BookingContext";
import { useBusinesses, useServices } from "../hooks/useApi";
import { MoreHorizontal } from "lucide-react";
import ImageCarousel from "../components/ImageCarousel";

const NAVBAR_HEIGHT = 80;

export default function MapPage() {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);
  const listRef = useRef(null);

  const [selectedVenue, setSelectedVenue] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  const { openBooking, updateBooking } = useBooking();
  const { businesses, loading, error } = useBusinesses();

  useEffect(() => {
    if (!mapInstance.current && mapRef.current) {
      mapInstance.current = L.map(mapRef.current).setView([56.9496, 24.1052], 12);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap",
      }).addTo(mapInstance.current);
    }
  }, []);

  useEffect(() => {
    if (mapInstance.current) {
      setTimeout(() => {
        mapInstance.current.invalidateSize();
      }, 200);
    }
  }, []);

  useEffect(() => {
    if (!mapInstance.current) return;

    markersRef.current.forEach((m) => mapInstance.current.removeLayer(m));
    markersRef.current = [];

    businesses.forEach((business) => {
      if (!business.latitude || !business.longitude) return;

      const marker = L.marker([business.latitude, business.longitude], {
        icon: L.icon({ iconUrl: markerIcon, shadowUrl: markerShadow }),
      })
        .addTo(mapInstance.current)
        .bindPopup(`<b>${business.name}</b>`);

      marker.on("click", () => setSelectedVenue(business));
      markersRef.current.push(marker);
    });

    const validBusinesses = businesses.filter((b) => b.latitude && b.longitude);
    if (validBusinesses.length > 0 && mapInstance.current) {
      const bounds = validBusinesses.map((b) => [b.latitude, b.longitude]);
      mapInstance.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [businesses]);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const handleScroll = () => {
      setScrolled(el.scrollTop > 10);
    };
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  const handleBook = (business) => {
    updateBooking({ business });
    openBooking();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="sticky top-20 z-30 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-600">Find venues</p>
            <h1 className="mt-1 text-3xl font-bold text-slate-900">Explore local businesses on the map</h1>
          </div>
        </div>
      </div>

      <div className="h-[calc(100vh-140px)] flex">
        {/* Left: Businesses List */}
        <div className="w-full lg:w-1/2 border-r border-slate-200 bg-white flex flex-col">
          {/* Header */}
          <div className={`sticky top-0 z-20 border-b bg-white transition ${scrolled ? "shadow-sm" : ""}`}>
            <div className="px-6 py-4">
              <div>
                <p className="text-sm text-slate-500">Showing</p>
                <p className="text-lg font-semibold text-slate-900">{businesses.length} businesses</p>
              </div>
            </div>
          </div>

          {/* Business List */}
          <div ref={listRef} className="flex-1 overflow-y-auto">
            {loading && (
              <div className="flex items-center justify-center h-full text-slate-500">
                <div className="h-10 w-10 rounded-full border-4 border-primary-500 border-t-transparent animate-spin" />
              </div>
            )}

            {error && (
              <div className="m-6 rounded-3xl bg-rose-50 p-6 text-rose-700">{error}</div>
            )}

            {!loading && businesses.length === 0 && (
              <div className="flex items-center justify-center h-full text-slate-500">
                <p>No businesses found</p>
              </div>
            )}

            {!loading && (
              <div className="divide-y grid grid-cols-2 divide-slate-100">
                {businesses.map((business) => (
                  <div
                    key={business.id}
                    onClick={() => setSelectedVenue(business)}
                    className={`group cursor-pointer p-5 transition hover:bg-slate-50 ${
                      selectedVenue?.id === business.id ? "bg-primary-50 border-l-4 border-primary-600" : ""
                    }`}
                  >
                    {/* Image Carousel */}
                    <ImageCarousel
                      images={business.images || []}
                      title={business.name}
                      autoPlay={false}
                    />

                    {/* Business Info */}
                    <div className="mt-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900">{business.name}</h3>
                          <p className="mt-1 text-sm text-slate-600">{business.address}</p>
                        </div>
                        {business.rating && (
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-900">
                            ⭐ {business.rating}
                          </span>
                        )}
                      </div>

                      <div className="mt-3 space-y-2 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-primary-600" />
                          {business.category || "General services"}
                        </div>
                        <div className="flex items-center gap-2">
                          <MoreHorizontal className="h-4 w-4" />
                          {business.services?.length ? `${business.services.length} services` : "No services"}
                        </div>
                      </div>

                      <button
                        onClick={() => handleBook(business)}
                        className="mt-4 w-full rounded-3xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition"
                      >
                        Book now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Fixed Map */}
        <div className="hidden z-10 lg:block w-1/2">
          <div
            ref={mapRef}
            className="h-full w-full"
            style={{ minHeight: "420px" }}
          />
        </div>
      </div>
    </div>
  );
}
