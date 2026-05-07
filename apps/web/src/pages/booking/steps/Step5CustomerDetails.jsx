import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useBooking } from "../../../context/BookingContext";

const Step5CustomerDetails = () => {
  const {
    booking,
    updateBooking,
    goNext,
    goBack,
  } = useBooking();

  const [errors, setErrors] = useState({});

  const [customer, setCustomer] = useState(
    booking.customer || {
      name: "",
      email: "",
      phone: "",
      notes: "",
    }
  );

  // VALIDATION
  const validate = () => {
    const newErrors = {};

    // NAME
    if (!customer.name || customer.name.trim().length < 2) {
      newErrors.name = "Please enter your full name";
    }

    // EMAIL
    if (!customer.email) {
      newErrors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)
    ) {
      newErrors.email = "Invalid email format";
    }

    // PHONE
    if (!customer.phone) {
      newErrors.phone = "Phone number is required";
    } else if (
      !/^\+?[0-9\s\-()]{7,20}$/.test(customer.phone)
    ) {
      newErrors.phone = "Invalid phone number";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // INPUT CHANGE
  const handleChange = (field, value) => {
    setCustomer((prev) => ({
      ...prev,
      [field]: value,
    }));

    // REMOVE ERROR WHILE TYPING
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  // CONTINUE
  const handleContinue = () => {
    const isValid = validate();

    if (!isValid) return;

    updateBooking({
      customer,
    });

    goNext();
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow p-6">

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-8">

        <button
          onClick={goBack}
          className="p-2 rounded-lg hover:bg-gray-100 transition"
        >
          <ArrowLeft size={20} />
        </button>

        <div>
          <h2 className="text-2xl font-semibold">
            Your details
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Enter your contact information
          </p>
        </div>

      </div>

      {/* FORM */}
      <div className="space-y-5">

        {/* NAME */}
        <div>

          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full name
          </label>

          <input
            type="text"
            value={customer.name}
            onChange={(e) =>
              handleChange("name", e.target.value)
            }
            placeholder="John Doe"
            className={`w-full border rounded-xl p-4 outline-none transition ${
              errors.name
                ? "border-red-500 focus:ring-2 focus:ring-red-200"
                : "focus:ring-2 focus:ring-black"
            }`}
          />

          {errors.name && (
            <p className="text-red-500 text-sm mt-2">
              {errors.name}
            </p>
          )}

        </div>

        {/* EMAIL */}
        <div>

          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email address
          </label>

          <input
            type="email"
            value={customer.email}
            onChange={(e) =>
              handleChange("email", e.target.value)
            }
            placeholder="john@email.com"
            className={`w-full border rounded-xl p-4 outline-none transition ${
              errors.email
                ? "border-red-500 focus:ring-2 focus:ring-red-200"
                : "focus:ring-2 focus:ring-black"
            }`}
          />

          {errors.email && (
            <p className="text-red-500 text-sm mt-2">
              {errors.email}
            </p>
          )}

        </div>

        {/* PHONE */}
        <div>

          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone number
          </label>

          <input
            type="tel"
            value={customer.phone}
            onChange={(e) =>
              handleChange("phone", e.target.value)
            }
            placeholder="+371 20 123 456"
            className={`w-full border rounded-xl p-4 outline-none transition ${
              errors.phone
                ? "border-red-500 focus:ring-2 focus:ring-red-200"
                : "focus:ring-2 focus:ring-black"
            }`}
          />

          {errors.phone && (
            <p className="text-red-500 text-sm mt-2">
              {errors.phone}
            </p>
          )}

        </div>

        {/* NOTES */}
        <div>

          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes for provider
            <span className="text-gray-400 ml-1">
              (optional)
            </span>
          </label>

          <textarea
            rows={5}
            value={customer.notes}
            onChange={(e) =>
              handleChange("notes", e.target.value)
            }
            placeholder="Any special requests, allergies, preferences, or additional information..."
            className="w-full border rounded-xl p-4 outline-none resize-none focus:ring-2 focus:ring-black transition"
          />

        </div>

      </div>

      {/* ACTIONS */}
      <div className="flex items-center justify-between mt-8">

        <button
          onClick={goBack}
          className="px-6 py-3 border rounded-xl hover:bg-gray-100 transition"
        >
          Back
        </button>

        <button
          onClick={handleContinue}
          className="px-8 py-3 bg-black text-white rounded-xl hover:opacity-90 transition"
        >
          Continue
        </button>

      </div>

    </div>
  );
};

export default Step5CustomerDetails;