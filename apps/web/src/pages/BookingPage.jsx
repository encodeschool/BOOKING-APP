import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";
import { Calendar, Clock, User, Scissors } from "lucide-react";
import { useBusinesses, useServices, useStaff, useAvailableSlots } from "../hooks/useApi";
import { apiClient } from "../lib/api";

const BookingPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    businessId: "",
    serviceId: "",
    staffId: "",
    date: null,
    time: "",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    notes: "",
  });

  const { businesses, loading: businessesLoading } = useBusinesses();
  const { services, loading: servicesLoading } = useServices(formData.businessId);
  const { staff, loading: staffLoading } = useStaff(formData.businessId);
  const { slots, loading: slotsLoading } = useAvailableSlots(
    formData.businessId,
    formData.serviceId,
    formData.date?.toISOString().split('T')[0]
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Reset dependent fields when business changes
    if (field === 'businessId') {
      setFormData(prev => ({
        ...prev,
        serviceId: "",
        staffId: "",
        date: null,
        time: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.businessId || !formData.serviceId || !formData.date || !formData.time) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const bookingData = {
        businessId: parseInt(formData.businessId),
        serviceId: parseInt(formData.serviceId),
        staffId: parseInt(formData.staffId),
        bookingDate: formData.date.toISOString().split('T')[0],
        bookingTime: formData.time,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        notes: formData.notes,
      };

      await apiClient.createBooking(bookingData);

      toast.success("Booking created successfully!");
      navigate("/");
    } catch (error) {
      toast.error(error.message || "Failed to create booking");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedService = services.find(s => s.id === parseInt(formData.serviceId));

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Book Your Appointment</h1>
          <p className="text-lg text-gray-600">
            Fill out the form below to schedule your appointment.
          </p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Business Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Business *
              </label>
              {businessesLoading ? (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              ) : (
                <select
                  value={formData.businessId}
                  onChange={(e) => handleInputChange('businessId', e.target.value)}
                  className="input-field"
                  required
                >
                  <option value="">Choose a business</option>
                  {businesses.map((business) => (
                    <option key={business.id} value={business.id}>
                      {business.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Service Selection */}
            {formData.businessId && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Service *
                </label>
                {servicesLoading ? (
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                ) : (
                  <select
                    value={formData.serviceId}
                    onChange={(e) => handleInputChange('serviceId', e.target.value)}
                    className="input-field"
                    required
                  >
                    <option value="">Choose a service</option>
                    {services.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name} - ${service.price} ({service.duration} min)
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}

            {/* Staff Selection */}
            {formData.businessId && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Staff Member
                </label>
                {staffLoading ? (
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                ) : (
                  <select
                    value={formData.staffId}
                    onChange={(e) => handleInputChange('staffId', e.target.value)}
                    className="input-field"
                  >
                    <option value="">Any staff member</option>
                    {staff.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.name} - {member.specialization}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}

            {/* Date and Time Selection */}
            {formData.serviceId && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Date *
                  </label>
                  <DatePicker
                    selected={formData.date}
                    onChange={(date) => handleInputChange('date', date)}
                    minDate={new Date()}
                    className="input-field"
                    placeholderText="Choose a date"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Time *
                  </label>
                  {slotsLoading ? (
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                  ) : (
                    <select
                      value={formData.time}
                      onChange={(e) => handleInputChange('time', e.target.value)}
                      className="input-field"
                      required
                    >
                      <option value="">Choose a time</option>
                      {slots.map((slot, index) => (
                        <option key={index} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
            )}

            {/* Customer Information */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.customerName}
                    onChange={(e) => handleInputChange('customerName', e.target.value)}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.customerPhone}
                    onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows={3}
                  className="input-field"
                  placeholder="Any special requests or notes..."
                />
              </div>
            </div>

            {/* Booking Summary */}
            {selectedService && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Booking Summary</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><strong>Service:</strong> {selectedService.name}</p>
                  <p><strong>Duration:</strong> {selectedService.duration} minutes</p>
                  <p><strong>Price:</strong> ${selectedService.price}</p>
                  {formData.date && (
                    <p><strong>Date:</strong> {formData.date.toLocaleDateString()}</p>
                  )}
                  {formData.time && (
                    <p><strong>Time:</strong> {formData.time}</p>
                  )}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Creating Booking..." : "Confirm Booking"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;