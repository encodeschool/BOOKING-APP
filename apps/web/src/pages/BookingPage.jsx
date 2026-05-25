import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Calendar, Clock, User, Scissors, ChevronRight, ChevronLeft, Check, X } from "lucide-react";
import { useBusinesses, useServices, useStaff, useAvailableSlots, useStaffWorkingHours } from "../hooks/useApi";
import { apiClient } from "../lib/api";

const STEPS = [
  { id: 1, title: "Business & Service", label: "Choose" },
  { id: 2, title: "Date & Time", label: "Select" },
  { id: 3, title: "Your Details", label: "Enter" },
  { id: 4, title: "Confirm", label: "Review" },
];

const BookingPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const API_URL =
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_API_URL ||
    (import.meta.env.DEV ? "http://localhost:8080" : "");
  const [formData, setFormData] = useState({
    businessId: searchParams.get("businessId") || "",
    serviceId: searchParams.get("serviceId") || "",
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
    formData.date?.toISOString().split("T")[0]
  );

  const next14Days = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const selectedBusiness = businesses.find((b) => b.id === parseInt(formData.businessId));
  const selectedService = services.find((s) => s.id === parseInt(formData.serviceId));
  const selectedStaff = staff.find((m) => m.id === parseInt(formData.staffId));
  const { hours: staffHours, loading: staffHoursLoading } = useStaffWorkingHours(
    formData.staffId ? parseInt(formData.staffId) : null
  );

  const selectedDateString = formData.date?.toISOString().split("T")[0] || null;
  const selectedDayName = formData.date
    ? formData.date
        .toLocaleDateString("en-US", {
          weekday: "long",
        })
        .toUpperCase()
    : null;

  const parseTimeString = (timeString) => {
    const [hour = 0, minute = 0] = String(timeString)
      .slice(0, 5)
      .split(":")
      .map(Number);
    return { hour, minute };
  };

  const formatTimeSlot = (totalMinutes) => {
    const hour = Math.floor(totalMinutes / 60)
      .toString()
      .padStart(2, "0");
    const minute = (totalMinutes % 60)
      .toString()
      .padStart(2, "0");
    return `${hour}:${minute}`;
  };

  const closeConfirmationModal = () => {
    setShowConfirmationModal(false);
  };

  const ConfirmationModal = ({ booking, onClose }) => {
    if (!booking) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
        <div className="relative w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 text-slate-500 hover:bg-slate-100"
          >
            <X size={20} />
          </button>
          <div className="text-center pt-4">
            <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <Check size={32} />
            </div>
            <h2 className="text-3xl font-semibold text-slate-900 mb-2">Booking Confirmed</h2>
            <p className="text-sm text-slate-500 mb-6">Your appointment has been successfully booked.</p>
          </div>
          <div className="grid gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700 mb-6">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Business</p>
              <p className="font-semibold text-slate-900">{booking.businessName}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Service</p>
              <p className="font-semibold text-slate-900">{booking.serviceName}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Date & Time</p>
              <p className="font-semibold text-slate-900">{formData.date?.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} at {booking.startTime}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Staff</p>
              <p className="font-semibold text-slate-900">{booking.staffName}</p>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate("/my-bookings")}
              className="btn-primary w-full"
            >
              View my bookings
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-3xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  const selectedStaffWorkingDay = selectedDayName
    ? staffHours.find((h) => h.dayOfWeek === selectedDayName)
    : null;

  const staffTimeSlots = useMemo(() => {
    if (!selectedStaff || !selectedService || !formData.date || !selectedStaffWorkingDay) {
      return [];
    }

    if (selectedStaffWorkingDay.isOff || !selectedStaffWorkingDay.startTime || !selectedStaffWorkingDay.endTime) {
      return [];
    }

    const duration = Number(selectedService.duration) || 30;
    const slots = [];

    const { hour: startHour, minute: startMinute } = parseTimeString(
      selectedStaffWorkingDay.startTime
    );
    const { hour: endHour, minute: endMinute } = parseTimeString(
      selectedStaffWorkingDay.endTime
    );

    const startTotal = startHour * 60 + startMinute;
    const endTotal = endHour * 60 + endMinute;
    let currentTotal = startTotal;

    const today = new Date();
    const isToday = formData.date.toDateString() === today.toDateString();
    const nowTotal = today.getHours() * 60 + today.getMinutes();

    while (currentTotal + duration <= endTotal) {
      const formatted = formatTimeSlot(currentTotal);

      if (isToday) {
        if (currentTotal > nowTotal) {
          slots.push(formatted);
        }
      } else {
        slots.push(formatted);
      }

      currentTotal += 30;
    }

    return slots;
  }, [selectedStaff, selectedService, formData.date, selectedStaffWorkingDay]);

  const effectiveSlots = selectedStaff ? staffTimeSlots : slots;
  const isLoadingSlots = selectedStaff ? staffHoursLoading : slotsLoading;

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (field === "businessId") {
      setFormData((prev) => ({
        ...prev,
        serviceId: "",
        staffId: "",
        date: null,
        time: "",
      }));
    }
  };

  const canProceedStep1 = formData.businessId && formData.serviceId;
  const canProceedStep2 = canProceedStep1 && formData.date && formData.time;
  const canProceedStep3 = canProceedStep2 && formData.customerName && formData.customerEmail && formData.customerPhone;

  const handleNext = () => {
    if (currentStep === 1 && !canProceedStep1) {
      toast.error("Please select a business and service");
      return;
    }
    if (currentStep === 2 && !canProceedStep2) {
      toast.error("Please select date and time");
      return;
    }
    if (currentStep === 3 && !canProceedStep3) {
      toast.error("Please fill in all your details");
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!canProceedStep3) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const bookingData = {
        businessId: parseInt(formData.businessId),
        serviceId: parseInt(formData.serviceId),
        staffId: parseInt(formData.staffId) || null,
        bookingDate: formData.date.toISOString().split("T")[0],
        startTime: formData.time,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        notes: formData.notes,
      };

      const createdBooking = await apiClient.createBooking(bookingData);
      setConfirmedBooking({
        ...bookingData,
        id: createdBooking?.id,
        businessName: selectedBusiness?.name,
        serviceName: selectedService?.name,
        staffName: selectedStaff?.name || "Any available staff",
      });
      setShowConfirmationModal(true);
      toast.success("Booking confirmed successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to create booking");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-600">Book Your Appointment</p>
          <h1 className="mt-4 text-4xl font-bold text-slate-900 sm:text-5xl">Complete your booking in 4 steps</h1>
        </div>

        {/* Progress Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            {STEPS.map((step, idx) => (
              <div key={step.id} className="flex items-center flex-1">
                <button
                  onClick={() => setCurrentStep(step.id)}
                  disabled={step.id > currentStep}
                  className={`relative flex items-center justify-center w-12 h-12 rounded-full font-semibold transition ${
                    step.id < currentStep
                      ? "bg-primary-600 text-white"
                      : step.id === currentStep
                      ? "bg-primary-600 text-white ring-4 ring-primary-100"
                      : "bg-slate-200 text-slate-500 cursor-not-allowed"
                  }`}
                >
                  {step.id < currentStep ? <Check size={20} /> : step.id}
                </button>
                <div className="ml-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{step.label}</p>
                  <p className="text-sm font-semibold text-slate-900">{step.title}</p>
                </div>
                {idx < STEPS.length - 1 && (
                  <div className={`flex-1 h-1 mx-4 rounded-full transition ${
                    step.id < currentStep ? "bg-primary-600" : "bg-slate-200"
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="rounded-3xl bg-white p-8 shadow-lg border border-slate-200">
          {showConfirmationModal && (
            <ConfirmationModal booking={confirmedBooking} onClose={closeConfirmationModal} />
          )}
          <form onSubmit={handleSubmit}>
            {/* Step 1: Business & Service */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Select a business and service</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-3">Which business interests you? *</label>
                      {businessesLoading ? (
                        <div className="flex items-center justify-center py-6">
                          <div className="h-10 w-10 rounded-full border-4 border-primary-500 border-t-transparent animate-spin" />
                        </div>
                      ) : (
                        <div className="grid gap-3 sm:grid-cols-2">
                          {businesses.map((business) => (
                            <button
                              key={business.id}
                              type="button"
                              onClick={() => handleInputChange("businessId", business.id.toString())}
                              className={`text-left p-4 rounded-3xl border-2 transition ${
                                formData.businessId === business.id.toString()
                                  ? "border-primary-600 bg-primary-50"
                                  : "border-slate-200 hover:border-slate-300"
                              }`}
                            >
                              <p className="font-semibold text-slate-900">{business.name}</p>
                              <p className="text-sm text-slate-600 mt-1">{business.address}</p>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-3">What service do you need? *</label>
                      {servicesLoading ? (
                        <div className="flex items-center justify-center py-6">
                          <div className="h-10 w-10 rounded-full border-4 border-primary-500 border-t-transparent animate-spin" />
                        </div>
                      ) : (
                        <div className="grid gap-3 sm:grid-cols-2">
                          {services.map((service) => (
                            <button
                              key={service.id}
                              type="button"
                              onClick={() => handleInputChange("serviceId", service.id.toString())}
                              className={`text-left p-4 rounded-3xl border-2 transition ${
                                formData.serviceId === service.id.toString()
                                  ? "border-primary-600 bg-primary-50"
                                  : "border-slate-200 hover:border-slate-300"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-semibold text-slate-900">{service.name}</p>
                                  <p className="text-sm text-slate-600 mt-1">{service.duration} min</p>
                                </div>
                                <p className="font-bold text-primary-600">${service.price}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Date & Time */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">When would you like to come?</h2>
                  <p className="text-slate-600 mb-6">Choose a date and time that works best for you</p>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-3">Select staff member (optional)</label>
                      {staffLoading ? (
                        <div className="flex items-center justify-center py-4">
                          <div className="h-10 w-10 rounded-full border-4 border-primary-500 border-t-transparent animate-spin" />
                        </div>
                      ) : (
                        <>
                          <select
                            value={formData.staffId}
                            onChange={(e) => handleInputChange("staffId", e.target.value)}
                            className="input-field"
                          >
                            <option value="">Any staff member</option>
                            {staff.map((member) => (
                              <option key={member.id} value={member.id}>
                                {member.name} - {member.specialization}
                              </option>
                            ))}
                          </select>

                          <div className="mt-3 flex items-center gap-3 overflow-x-auto">
                            {staff.map((member) => (
                              <button
                                key={member.id}
                                type="button"
                                onClick={() => handleInputChange("staffId", String(member.id))}
                                className={`flex-shrink-0 flex items-center gap-3 p-2 rounded-2xl border ${String(formData.staffId) === String(member.id) ? 'border-primary-600 bg-primary-50' : 'border-slate-200'}`}
                              >
                                <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100">
                                  {member.imageUrl ? (
                                    <img src={`${API_URL}${member.imageUrl}`} alt={member.name} className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-white bg-primary-600">{member.name?.charAt(0)}</div>
                                  )}
                                </div>

                                <div className="text-left">
                                  <div className="text-sm font-semibold">{member.name}</div>
                                  <div className="text-xs text-slate-500">{member.specialization}</div>
                                </div>
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-3">Select date *</label>
                      <div className="grid grid-cols-7 gap-2">
                        {next14Days.map((d) => {
                          const iso = d.toISOString().split("T")[0];
                          const isSelected =
                            formData.date && formData.date.toISOString().split("T")[0] === iso;

                          return (
                            <button
                              key={iso}
                              type="button"
                              onClick={() => handleInputChange("date", new Date(d))}
                              className={`p-2 rounded-2xl text-sm flex flex-col items-center justify-center transition ${
                                isSelected
                                  ? "bg-primary-600 text-white"
                                  : "bg-slate-50 hover:bg-slate-100"
                              }`}
                              aria-pressed={isSelected}
                            >
                              <div className="text-xs">
                                {d.toLocaleDateString("en-US", { weekday: "short" })}
                              </div>
                              <div className="text-lg font-semibold">{d.getDate()}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-semibold text-slate-700 mb-3">Select time *</label>
                    {isLoadingSlots ? (
                      <div className="flex items-center justify-center py-4">
                        <div className="h-10 w-10 rounded-full border-4 border-primary-500 border-t-transparent animate-spin" />
                      </div>
                    ) : selectedStaff && selectedStaffWorkingDay?.isOff ? (
                      <div className="text-red-500 text-sm">Selected staff is not working on this day</div>
                    ) : effectiveSlots.length > 0 ? (
                      <div className="grid gap-2 sm:grid-cols-4">
                        {effectiveSlots.map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => handleInputChange("time", slot)}
                            className={`px-4 py-3 rounded-3xl border-2 font-medium transition ${
                              formData.time === slot
                                ? "border-primary-600 bg-primary-50 text-primary-600"
                                : "border-slate-200 text-slate-700 hover:border-slate-300"
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-gray-500 text-sm">No available slots for the selected date.</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Personal Details */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">What's your contact information?</h2>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-3">Full name *</label>
                      <input
                        type="text"
                        value={formData.customerName}
                        onChange={(e) => handleInputChange("customerName", e.target.value)}
                        className="input-field"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-3">Email address *</label>
                      <input
                        type="email"
                        value={formData.customerEmail}
                        onChange={(e) => handleInputChange("customerEmail", e.target.value)}
                        className="input-field"
                        placeholder="your@email.com"
                        required
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 mb-3">Phone number *</label>
                      <input
                        type="tel"
                        value={formData.customerPhone}
                        onChange={(e) => handleInputChange("customerPhone", e.target.value)}
                        className="input-field"
                        placeholder="+1 (555) 000-0000"
                        required
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 mb-3">Additional notes</label>
                      <textarea
                        value={formData.notes}
                        onChange={(e) => handleInputChange("notes", e.target.value)}
                        rows={4}
                        className="input-field"
                        placeholder="Tell us about any preferences or special requests..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Review & Confirm */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Review your booking</h2>

                  <div className="space-y-4">
                    <div className="rounded-3xl bg-slate-50 p-6">
                      <p className="text-sm uppercase tracking-[0.2em] text-slate-500 mb-2">Business</p>
                      <p className="text-xl font-semibold text-slate-900">{selectedBusiness?.name}</p>
                      <p className="text-sm text-slate-600 mt-2">{selectedBusiness?.address}</p>
                    </div>

                    <div className="rounded-3xl bg-slate-50 p-6">
                      <p className="text-sm uppercase tracking-[0.2em] text-slate-500 mb-2">Service</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xl font-semibold text-slate-900">{selectedService?.name}</p>
                          <p className="text-sm text-slate-600 mt-2">{selectedService?.duration} minutes</p>
                        </div>
                        <p className="text-2xl font-bold text-primary-600">${selectedService?.price}</p>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-3xl bg-slate-50 p-6">
                        <p className="text-sm uppercase tracking-[0.2em] text-slate-500 mb-2">Date & Time</p>
                        <p className="text-lg font-semibold text-slate-900">
                          {formData.date?.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                        </p>
                        <p className="text-sm text-slate-600 mt-2">{formData.time}</p>
                      </div>

                      {selectedStaff && (
                        <div className="rounded-3xl bg-slate-50 p-6 flex items-center gap-4">
                          <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100">
                            {selectedStaff.imageUrl ? (
                              <img src={`${API_URL}${selectedStaff.imageUrl}`} alt={selectedStaff.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-white bg-primary-600">{selectedStaff.name?.charAt(0)}</div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm uppercase tracking-[0.2em] text-slate-500 mb-2">Staff</p>
                            <p className="text-lg font-semibold text-slate-900">{selectedStaff.name}</p>
                            <p className="text-sm text-slate-600 mt-2">{selectedStaff.specialization}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="rounded-3xl bg-slate-50 p-6">
                      <p className="text-sm uppercase tracking-[0.2em] text-slate-500 mb-2">Your Information</p>
                      <div className="space-y-2 text-sm text-slate-700">
                        <p><strong>Name:</strong> {formData.customerName}</p>
                        <p><strong>Email:</strong> {formData.customerEmail}</p>
                        <p><strong>Phone:</strong> {formData.customerPhone}</p>
                      </div>
                    </div>

                    {formData.notes && (
                      <div className="rounded-3xl bg-slate-50 p-6">
                        <p className="text-sm uppercase tracking-[0.2em] text-slate-500 mb-2">Notes</p>
                        <p className="text-sm text-slate-700">{formData.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-10 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={handleBack}
                disabled={currentStep === 1}
                className={`inline-flex items-center gap-2 rounded-3xl px-6 py-3 text-sm font-semibold transition ${
                  currentStep === 1
                    ? "text-slate-400 cursor-not-allowed"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <ChevronLeft size={18} /> Back
              </button>

              {currentStep < STEPS.length ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="btn-primary inline-flex items-center gap-2"
                >
                  Next <ChevronRight size={18} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary"
                >
                  {isSubmitting ? "Confirming..." : "Confirm booking"}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
