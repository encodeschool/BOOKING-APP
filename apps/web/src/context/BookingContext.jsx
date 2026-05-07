import { createContext, useContext, useState } from "react";

const BookingContext = createContext(null);

export const STEPS = {
  TYPE: 1,
  SERVICE: 2,
  STAFF: 3,
  TIME: 4,
  CUSTOMER: 5,
  PAYMENT: 6,
};

const initialBooking = {
  type: null,
  service: null,
  staff: null,
  date: null,
  time: null,
  customer: null,
};

export const BookingProvider = ({ children }) => {
  const [step, setStep] = useState(0);
  const [booking, setBooking] = useState(initialBooking);

  const openBooking = () => setStep(STEPS.TYPE);

  const closeBooking = () => {
    setStep(0);
    setBooking(initialBooking);
  };

  const goNext = () => {
    setStep((prev) => Math.min(prev + 1, STEPS.PAYMENT));
  };

  const goBack = () => {
    setStep((prev) => Math.max(prev - 1, STEPS.TYPE));
  };

  const goToStep = (targetStep) => {
    setStep(targetStep);
  };

  const updateBooking = (data) => {
    setBooking((prev) => ({
      ...prev,
      ...data,
    }));
  };

  return (
    <BookingContext.Provider
      value={{
        step,
        booking,
        STEPS,
        openBooking,
        closeBooking,
        goNext,
        goBack,
        goToStep,
        updateBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const ctx = useContext(BookingContext);

  if (!ctx) {
    throw new Error("useBooking must be inside BookingProvider");
  }

  return ctx;
};