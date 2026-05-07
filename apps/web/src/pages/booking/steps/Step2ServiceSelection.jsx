import { useState } from "react";
import { Search, ArrowLeft } from "lucide-react";
import { useBooking } from "../../../context/BookingContext";

const mockServices = [
  {
    id: 1,
    name: "Haircut",
    category: "Hair",
    duration: "30 min",
    price: "€25",
  },
  {
    id: 2,
    name: "Beard Trim",
    category: "Hair",
    duration: "20 min",
    price: "€15",
  },
  {
    id: 3,
    name: "Facial",
    category: "Skin",
    duration: "45 min",
    price: "€40",
  },
  {
    id: 4,
    name: "Full Body Massage",
    category: "Massage",
    duration: "60 min",
    price: "€60",
  },
];

const Step2ServiceSelection = () => {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Hair", "Skin", "Massage"];

  const {
    updateBooking,
    goNext,
    goBack,
    booking,
  } = useBooking();

  // FILTER SERVICES
  const filtered = mockServices.filter((service) => {
    const matchCategory =
      selectedCategory === "All" ||
      service.category === selectedCategory;

    const matchSearch = service.name
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
    <div className="w-full min-h-[700px] bg-white flex flex-col rounded-2xl overflow-hidden">

      {/* HEADER */}
      <div className="flex items-center gap-3 p-5 border-b">

        <button
          onClick={goBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <ArrowLeft size={20} />
        </button>

        <div>
          <h2 className="text-xl font-semibold">
            Select a service
          </h2>

          <p className="text-sm text-gray-500">
            Choose the service you want to book
          </p>
        </div>

      </div>

      {/* SEARCH */}
      <div className="p-5 border-b">

        <div className="flex items-center gap-2 bg-gray-100 px-4 py-3 rounded-full">

          <Search size={18} className="text-gray-500" />

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search services..."
            className="bg-transparent w-full outline-none text-sm"
          />

        </div>

      </div>

      {/* CATEGORIES */}
      <div className="px-5 py-4 flex gap-2 overflow-x-auto border-b">

        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full border text-sm whitespace-nowrap transition ${
              selectedCategory === category
                ? "bg-black text-white border-black"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            {category}
          </button>
        ))}

      </div>

      {/* SERVICE LIST */}
      <div className="flex-1 overflow-y-scroll p-5 space-y-3">

        {filtered.map((service) => {
          const isSelected =
            booking?.service?.id === service.id;

          return (
            <button
              key={service.id}
              onClick={() => handleSelectService(service)}
              className={`w-full border rounded-2xl p-5 flex items-center justify-between text-left transition ${
                isSelected
                  ? "border-black bg-gray-50"
                  : "hover:bg-gray-50"
              }`}
            >

              {/* LEFT */}
              <div>

                <h3 className="font-semibold text-lg">
                  {service.name}
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  {service.category} • {service.duration}
                </p>

              </div>

              {/* RIGHT */}
              <div className="text-right">

                <p className="font-bold text-lg">
                  {service.price}
                </p>

              </div>

            </button>
          );
        })}

        {/* EMPTY */}
        {filtered.length === 0 && (
          <div className="text-center py-20">

            <p className="text-gray-500">
              No services found
            </p>

          </div>
        )}

      </div>

    </div>
  );
};

export default Step2ServiceSelection;