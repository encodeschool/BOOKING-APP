import { useBooking, STEPS } from "../../context/BookingContext";

import Step1ChooseBookingType from "./steps/Step1ChooseBookingType";
import Step2ServiceSelection from "./steps/Step2ServiceSelection";
import Step3StaffSelection from "./steps/Step3StaffSelection";
import Step4TimePicker from "./steps/Step4TimePicker";
import Step5CustomerDetails from "./steps/Step5CustomerDetails";
import Step6PaymentConfirmation from "./steps/Step6PaymentConfirmation";

export const BookingModal = () => {
  const { step, closeBooking } = useBooking();

  if (!step) return null;

  return (
    <div className="fixed inset-0 h-[100vh] bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full h-full p-4 relative">

        {/* CLOSE */}
        <button
          onClick={closeBooking}
          className="absolute top-4 right-4"
        >
          ✕
        </button>

        {/* STEP ROUTER */}
        {step === STEPS.TYPE && <Step1ChooseBookingType />}
        {step === STEPS.SERVICE && <Step2ServiceSelection />}
        {step === STEPS.STAFF && <Step3StaffSelection />}
        {step === STEPS.TIME && <Step4TimePicker />}
        {step === STEPS.CUSTOMER && <Step5CustomerDetails />}
        {step === STEPS.PAYMENT && <Step6PaymentConfirmation />}

      </div>
    </div>
  );
};