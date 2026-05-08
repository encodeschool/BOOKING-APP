import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import { useBooking } from "../context/BookingContext";
import { useBusinesses, useServices } from "../hooks/useApi";

const NAVBAR_HEIGHT = 60;

export default function MapPage() {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);
  const listRef = useRef(null);

  const [selectedVenue, setSelectedVenue] =
    useState(null);

  const [activeTab, setActiveTab] =
    useState("venues");

  const [showMap, setShowMap] =
    useState(true);

  const [scrolled, setScrolled] =
    useState(false);

  const { openBooking, updateBooking } =
    useBooking();

  // API
  const {
    businesses,
    loading,
    error,
  } = useBusinesses();

  // INIT MAP
  useEffect(() => {
    if (
      !mapInstance.current &&
      mapRef.current
    ) {
      mapInstance.current = L.map(
        mapRef.current
      ).setView([56.9496, 24.1052], 12);

      L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          attribution:
            "&copy; OpenStreetMap",
        }
      ).addTo(mapInstance.current);
    }
  }, []);

  // FIX MAP RESIZE
  useEffect(() => {
    if (
      showMap &&
      mapInstance.current
    ) {
      setTimeout(() => {
        mapInstance.current.invalidateSize();
      }, 200);
    }
  }, [showMap]);

  // ADD MARKERS
  useEffect(() => {
    if (!mapInstance.current) return;

    // REMOVE OLD MARKERS
    markersRef.current.forEach((m) =>
      mapInstance.current.removeLayer(m)
    );

    markersRef.current = [];

    businesses.forEach((business) => {
      // skip businesses without coordinates
      if (
        !business.latitude ||
        !business.longitude
      ) {
        return;
      }

      const marker = L.marker(
        [
          business.latitude,
          business.longitude,
        ],
        {
          icon: L.icon({
            iconUrl: markerIcon,
            shadowUrl: markerShadow,
          }),
        }
      )
        .addTo(mapInstance.current)
        .bindPopup(
          `<b>${business.name}</b>`
        );

      marker.on("click", () =>
        setSelectedVenue(business)
      );

      markersRef.current.push(marker);
    });

    // AUTO FIT MAP
    if (businesses.length > 0) {
      const validBusinesses =
        businesses.filter(
          (b) =>
            b.latitude &&
            b.longitude
        );

      if (validBusinesses.length > 0) {
        const bounds =
          validBusinesses.map((b) => [
            b.latitude,
            b.longitude,
          ]);

        mapInstance.current.fitBounds(
          bounds,
          {
            padding: [50, 50],
          }
        );
      }
    }
  }, [businesses]);

  // SCROLL EFFECT
  useEffect(() => {
    const el = listRef.current;

    if (!el) return;

    const handleScroll = () => {
      setScrolled(el.scrollTop > 10);
    };

    el.addEventListener(
      "scroll",
      handleScroll
    );

    return () =>
      el.removeEventListener(
        "scroll",
        handleScroll
      );
  }, []);

  // BOOK
  const handleBook = (business) => {
    updateBooking({
      business,
    });

    openBooking();
  };

  return (
    <div className="flex">
      {/* LEFT */}
      <div
        className={`${
          showMap
            ? "w-[60%]"
            : "w-full"
        } border-r bg-white`}
      >
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
              <div className="flex items-center justify-between">
                {/* TABS */}
                <div className="flex bg-gray-100 rounded-xl p-1">
                  <button
                    onClick={() =>
                      setActiveTab(
                        "venues"
                      )
                    }
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium ${
                      activeTab ===
                      "venues"
                        ? "bg-white shadow"
                        : "text-gray-500"
                    }`}
                  >
                    Venues
                  </button>

                  <button
                    onClick={() =>
                      setActiveTab(
                        "professionals"
                      )
                    }
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium ${
                      activeTab ===
                      "professionals"
                        ? "bg-white shadow"
                        : "text-gray-500"
                    }`}
                  >
                    Professionals
                  </button>
                </div>

                <p className="text-sm text-gray-500">
                  {
                    businesses.length
                  }{" "}
                  venues in map area
                </p>

                <div className="flex gap-2">
                  <button className="px-4 py-2 border rounded-xl text-sm hover:bg-gray-50">
                    ⚙ Filters
                  </button>

                  <button
                    onClick={() =>
                      setShowMap(
                        !showMap
                      )
                    }
                    className="px-4 py-2 border rounded-xl text-sm hover:bg-gray-50"
                  >
                    {showMap
                      ? "Hide map"
                      : "Show map"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* LOADING */}
          {loading && (
            <div className="p-10 text-center text-gray-500">
              Loading businesses...
            </div>
          )}

          {/* ERROR */}
          {error && (
            <div className="p-10 text-center text-red-500">
              {error}
            </div>
          )}

          {/* LIST */}
          {!loading && (
            <div className="p-5 grid grid-cols-2 gap-5">
              {businesses.map(
                (business) => (
                  <div
                    key={business.id}
                    onClick={() =>
                      setSelectedVenue(
                        business
                      )
                    }
                    className={`border rounded-3xl overflow-hidden cursor-pointer transition hover:shadow-xl ${
                      selectedVenue?.id ===
                      business.id
                        ? "border-black shadow-xl"
                        : "border-gray-200"
                    }`}
                  >
                    {/* IMAGE */}
                    <div className="relative h-56">
                      <img
                        src={
                          business.imageUrl ||
                          "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=1200&auto=format&fit=crop"
                        }
                        className="w-full h-full object-cover"
                        alt={
                          business.name
                        }
                      />
                    </div>

                    {/* CONTENT */}
                    <div className="p-4">
                      <div className="flex justify-between">
                        <h3 className="font-semibold">
                          {
                            business.name
                          }
                        </h3>

                        {business.rating && (
                          <span>
                            ⭐{" "}
                            {
                              business.rating
                            }
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-gray-500 mt-1">
                        {
                          business.address
                        }
                      </p>

                      <BusinessServices businessId={business.id} />

                      <button
                        onClick={(e) => {
                          e.stopPropagation();

                          handleBook(
                            business
                          );
                        }}
                        className="mt-4 w-full bg-black text-white py-2 rounded-xl hover:bg-gray-900 transition"
                      >
                        Book
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>

      {/* MAP */}
      <div
        className={`${
          showMap
            ? "block"
            : "hidden"
        } w-[40%] h-screen sticky top-0`}
        style={{
          top: NAVBAR_HEIGHT,
          height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
        }}
      >
        <div
          ref={mapRef}
          className="w-full h-full"
        />
      </div>
    </div>
  );
}

function BusinessServices({ businessId }) {
  const {
    services,
    loading,
  } = useServices(businessId);

  if (loading) {
    return (
      <div className="mt-3 text-sm text-gray-400">
        Loading services...
      </div>
    );
  }

  if (!services?.length) {
    return (
      <div className="mt-3 text-sm text-gray-400">
        No services
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-2">
      {services.slice(0, 3).map((service) => (
        <div
          key={service.id}
          className="flex items-center justify-between text-sm"
        >
          <div>
            <p className="font-medium text-gray-800">
              {service.name}
            </p>

            <p className="text-xs text-gray-500">
              {service.durationMinutes ||
                service.duration ||
                0}{" "}
              min
            </p>
          </div>

          <p className="font-semibold text-gray-900">
            €{service.price}
          </p>
        </div>
      ))}

      {services.length > 3 && (
        <p className="text-xs text-gray-400">
          +{services.length - 3} more services
        </p>
      )}
    </div>
  );
}