import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ChevronRight, ChevronLeft, Check } from "lucide-react";
import { useBusinesses, useServices, useStaff, useAvailableDates, useAvailableSlots } from "../hooks/useApi";
import { apiClient } from "../lib/api";

const STEPS = [
  { number: 1, title: "Business", description: "Choose a business" },
  { number: 2, title: "Service", description: "Select a service" },
  { number: 3, title: "Staff", description: "Pick a staff member" },
  { number: 4, title: "Date & Time", description: "Choose date and time" },
  { number: 5, title: "Details", description: "Your information" }
];

export const MultiStepBookingForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    businessId: "",
    serviceId: "",
    staffId: "",
    date: "",
    time: "",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    notes: "",
  });

  // Data fetching
  const { businesses } = useBusinesses();
  const { services } = useServices(formData.businessId);
  const { staff } = useStaff(formData.businessId);
  const { dates: availableDates } = useAvailableDates(formData.businessId, formData.serviceId, formData.staffId);
  const { slots: availableTimes } = useAvailableSlots(formData.businessId, formData.serviceId, formData.date);

  // Get selected business and service for display
  const selectedBusiness = businesses.find(b => b.id == formData.businessId);
  const selectedService = services.find(s => s.id == formData.serviceId);
  const selectedStaff = staff.find(s => s.id == formData.staffId);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    // Validate current step
    switch (currentStep) {
      case 1:
        if (!formData.businessId) {
          toast.error("Please select a business");
          return;
        }
        break;
      case 2:
        if (!formData.serviceId) {
          toast.error("Please select a service");
          return;
        }
        break;
      case 3:
        if (!formData.staffId) {
          toast.error("Please select a staff member");
          return;
        }
        break;
      case 4:
        if (!formData.date || !formData.time) {
          toast.error("Please select date and time");
          return;
        }
        break;
      case 5:
        break;
    }
    
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.customerName || !formData.customerEmail || !formData.customerPhone) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const bookingData = {
        businessId: parseInt(formData.businessId),
        serviceId: parseInt(formData.serviceId),
        staffId: parseInt(formData.staffId),
        bookingDate: formData.date,
        bookingTime: formData.time,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        notes: formData.notes,
      };

      await apiClient.createBooking(bookingData);

      toast.success("Booking created successfully! You'll receive a confirmation email shortly.");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      toast.error(error.message || "Failed to create booking");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Book Your Appointment</h1>
          <p className="text-lg text-gray-600">Follow the steps below to complete your booking</p>
        </div>

        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {STEPS.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-all ${
                    step.number <= currentStep
                      ? "bg-blue-600 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  {step.number < currentStep ? (
                    <Check size={20} />
                  ) : (
                    step.number
                  )}
                </div>
                <div className="ml-2 hidden sm:block">
                  <p className="text-sm font-semibold text-gray-900">{step.title}</p>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 transition-all ${
                      step.number < currentStep ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Business Selection */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Select a Business</h2>
                {businesses.length === 0 ? (
                  <p className="text-gray-500">No businesses available</p>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {businesses.map(business => (
                      <button
                        key={business.id}
                        type="button"
                        onClick={() => {
                          handleInputChange("businessId", business.id);
                          // Reset dependent fields
                          handleInputChange("serviceId", "");
                          handleInputChange("staffId", "");
                          handleInputChange("date", "");
                          handleInputChange("time", "");
                        }}
                        className={`p-4 text-left rounded-lg border-2 transition-all ${
                          formData.businessId == business.id
                            ? "border-blue-600 bg-blue-50"
                            : "border-gray-200 hover:border-blue-400"
                        }`}
                      >
                        <p className="font-semibold text-gray-900">{business.name}</p>
                        <p className="text-sm text-gray-600">{business.address}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Service Selection */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Select a Service</h2>
                <p className="text-sm text-gray-600 mb-4">
                  {selectedBusiness?.name} - Available Services
                </p>
                {services.length === 0 ? (
                  <p className="text-gray-500">No services available for this business</p>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {services.map(service => (
                      <button
                        key={service.id}
                        type="button"
                        onClick={() => {
                          handleInputChange("serviceId", service.id);
                          handleInputChange("staffId", "");
                          handleInputChange("date", "");
                          handleInputChange("time", "");
                        }}
                        className={`p-4 text-left rounded-lg border-2 transition-all ${
                          formData.serviceId == service.id
                            ? "border-blue-600 bg-blue-50"
                            : "border-gray-200 hover:border-blue-400"
                        }`}
                      >
                        <p className="font-semibold text-gray-900">{service.name}</p>
                        <div className="flex justify-between mt-2 text-sm text-gray-600">
                          <span>Duration: {service.durationMinutes} min</span>
                          <span>Price: ${service.price}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Staff Selection */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Select a Staff Member</h2>
                <p className="text-sm text-gray-600 mb-4">{selectedService?.name}</p>
                {staff.length === 0 ? (
                  <p className="text-gray-500">No staff available</p>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {staff.map(member => (
                      <button
                        key={member.id}
                        type="button"
                        onClick={() => {
                          handleInputChange("staffId", member.id);
                          handleInputChange("date", "");
                          handleInputChange("time", "");
                        }}
                        className={`p-4 text-left rounded-lg border-2 transition-all ${
                          formData.staffId == member.id
                            ? "border-blue-600 bg-blue-50"
                            : "border-gray-200 hover:border-blue-400"
                        }`}
                      >
                        <p className="font-semibold text-gray-900">{member.firstName} {member.lastName}</p>
                        <p className="text-sm text-gray-600">{member.specialization}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Date & Time Selection */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Date & Time</h2>
                <p className="text-sm text-gray-600">
                  {selectedStaff?.firstName} {selectedStaff?.lastName}
                </p>

                {/* Date Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Available Dates
                  </label>
                  {availableDates.length === 0 ? (
                    <p className="text-gray-500">No available dates for this service</p>
                  ) : (
                    <div className="grid grid-cols-7 gap-2">
                      {availableDates.map(date => (
                        <button
                          key={date}
                          type="button"
                          onClick={() => {
                            handleInputChange("date", date);
                            handleInputChange("time", "");
                          }}
                          className={`p-2 text-sm rounded-lg font-semibold transition-all ${
                            formData.date === date
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-blue-100"
                          }`}
                        >
                          {new Date(date).toLocaleDateString("en-US", { 
                            month: "short", 
                            day: "numeric" 
                          })}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Time Selection */}
                {formData.date && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Available Times
                    </label>
                    {availableTimes.length === 0 ? (
                      <p className="text-gray-500">No available times for the selected date</p>
                    ) : (
                      <div className="grid grid-cols-4 gap-2">
                        {availableTimes.map(time => (
                          <button
                            key={time}
                            type="button"
                            onClick={() => handleInputChange("time", time)}
                            className={`p-2 text-sm rounded-lg font-semibold transition-all ${
                              formData.time === time
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-blue-100"
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Step 5: Customer Details */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Information</h2>

                {/* Booking Summary */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-3">Booking Summary</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><strong>Business:</strong> {selectedBusiness?.name}</p>
                    <p><strong>Service:</strong> {selectedService?.name}</p>
                    <p><strong>Staff:</strong> {selectedStaff?.firstName} {selectedStaff?.lastName}</p>
                    <p>
                      <strong>Date & Time:</strong> {new Date(formData.date).toLocaleDateString()} at {formData.time}
                    </p>
                  </div>
                </div>

                {/* Customer Form */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.customerName}
                      onChange={(e) => handleInputChange("customerName", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.customerEmail}
                      onChange={(e) => handleInputChange("customerEmail", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.customerPhone}
                      onChange={(e) => handleInputChange("customerPhone", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => handleInputChange("notes", e.target.value)}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Any special requests?"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentStep === 1}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft size={20} />
                Previous
              </button>

              {currentStep === STEPS.length ? (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-6 py-2 rounded-lg font-semibold text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isSubmitting ? "Booking..." : "Complete Booking"}
                  <Check size={20} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all"
                >
                  Next
                  <ChevronRight size={20} />
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
