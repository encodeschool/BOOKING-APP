import { useMemo, useState } from "react";
import {
  Search,
  ArrowLeft,
  Loader2,
  Scissors,
} from "lucide-react";

import { useBooking } from "../../../context/BookingContext";
import { useServices } from "../../../hooks/useApi";

const Step2ServiceSelection = () => {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const {
    booking,
    updateBooking,
    goNext,
    goBack,
  } = useBooking();

  const businessId = booking?.business?.id;

  const {
    services,
    loading,
    error,
  } = useServices(businessId);

  // CREATE DYNAMIC CATEGORIES
  const categories = useMemo(() => {
    const unique = [
      ...new Set(
        services
          .map((s) => s.category)
          .filter(Boolean)
      ),
    ];

    return ["All", ...unique];
  }, [services]);

  // FILTER SERVICES
  const filtered = services.filter((service) => {
    const matchCategory =
      selectedCategory === "All" ||
      service.category === selectedCategory;

    const matchSearch = (service.name || "")
      .toLowerCase()
      .includes(query.toLowerCase());

    return matchCategory && matchSearch;
  });

  // SELECT SERVICE
  const handleSelectService = (service) => {
    updateBooking({
      service,
    });

    goNext();
  };

  return (
    <div className="w-full h-full bg-white flex flex-col rounded-3xl overflow-hidden">
      {/* HEADER */}
      <div className="flex items-center gap-3 p-6 border-b border-gray-100">
        <button
          onClick={goBack}
          className="p-2 hover:bg-gray-100 rounded-xl transition"
        >
          <ArrowLeft size={20} />
        </button>

        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Select a service
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Choose the service you want to book
          </p>
        </div>
      </div>

      {/* SEARCH + FILTER */}
      <div className="p-5 border-b border-gray-100 flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
        {/* SEARCH */}
        <div className="flex items-center gap-3 bg-gray-100 px-4 py-3 rounded-2xl flex-1">
          <Search
            size={18}
            className="text-gray-500"
          />

          <input
            type="text"
            value={query}
            onChange={(e) =>
              setQuery(e.target.value)
            }
            placeholder="Search services..."
            className="bg-transparent w-full outline-none text-sm"
          />
        </div>

        {/* CATEGORIES */}
        <div className="flex gap-2 overflow-x-auto">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() =>
                setSelectedCategory(category)
              }
              className={`px-5 py-2 rounded-full border text-sm whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? "bg-black text-white border-black"
                  : "bg-white hover:bg-gray-100 border-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="flex-1 flex flex-col items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-black mb-4" />

          <p className="text-gray-500">
            Loading services...
          </p>
        </div>
      )}

      {/* ERROR */}
      {!loading && error && (
        <div className="flex-1 flex items-center justify-center p-10">
          <div className="text-center">
            <p className="text-red-500 font-medium">
              {error}
            </p>
          </div>
        </div>
      )}

      {/* SERVICES */}
      {!loading && !error && (
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {filtered.map((service) => {
            const isSelected =
              booking?.service?.id ===
              service.id;

            return (
              <button
                key={service.id}
                onClick={() =>
                  handleSelectService(service)
                }
                className={`w-full border rounded-3xl p-5 flex items-center justify-between text-left transition-all ${
                  isSelected
                    ? "border-black bg-gray-50 shadow-sm"
                    : "border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                }`}
              >
                {/* LEFT */}
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-black text-white flex items-center justify-center">
                    <Scissors size={24} />
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">
                      {service.name}
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      {service.category ||
                        "General"}{" "}
                      •{" "}
                      {service.duration
                        ? `${service.duration} min`
                        : "No duration"}
                    </p>

                    {service.description && (
                      <p className="text-sm text-gray-400 mt-2 line-clamp-2">
                        {service.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* RIGHT */}
                <div className="text-right">
                  <p className="font-bold text-2xl text-gray-900">
                    €{service.price}
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    per session
                  </p>
                </div>
              </button>
            );
          })}

          {/* EMPTY */}
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-5">
                <Scissors className="text-gray-400" />
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No services found
              </h3>

              <p className="text-gray-500 text-center">
                Try changing your search or category
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Step2ServiceSelection;