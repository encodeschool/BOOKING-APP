import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../models/booking_model.dart';

enum BookingStep {
  type,
  service,
  staff,
  time,
  customer,
  confirmation,
}

class BookingNotifier
    extends StateNotifier<BookingModel> {
  BookingNotifier(this.ref)
      : super(BookingModel());

  final Ref ref;

  // =========================================================
  // STEP GETTER
  // =========================================================

  BookingStep get currentStep =>
      ref.read(bookingStepProvider);

  // =========================================================
  // BUSINESS
  // =========================================================

  void setBusiness(dynamic business) {
    state = state.copyWith(
      business: business,
    );
  }

  // =========================================================
  // TYPE
  // =========================================================

  void setType(String type) {
    state = state.copyWith(type: type);
  }

  // =========================================================
  // SERVICE
  // =========================================================

  void setService(dynamic service) {
    state = state.copyWith(
      service: service,
    );
  }

  // =========================================================
  // STAFF
  // =========================================================

  void setStaff(dynamic staff) {
    state = state.copyWith(
      staff: staff,
    );
  }

  // =========================================================
  // DATE
  // =========================================================

  void setDate(DateTime date) {
    state = state.copyWith(date: date);
  }

  // =========================================================
  // TIME
  // =========================================================

  void setTime(String time) {
    state = state.copyWith(time: time);
  }

  // =========================================================
  // CUSTOMER
  // =========================================================

  void setCustomer(
      Map<String, dynamic> customer,
      ) {
    state = state.copyWith(
      customer: customer,
    );
  }

  // =========================================================
  // NEXT STEP
  // =========================================================

  void nextStep() {
    final current =
    ref.read(bookingStepProvider);

    if (current.index <
        BookingStep.values.length - 1) {
      ref
          .read(
        bookingStepProvider.notifier,
      )
          .state = BookingStep
          .values[current.index + 1];
    }
  }

  // =========================================================
  // PREVIOUS STEP
  // =========================================================

  void previousStep() {
    final current =
    ref.read(bookingStepProvider);

    if (current.index > 0) {
      ref
          .read(
        bookingStepProvider.notifier,
      )
          .state = BookingStep
          .values[current.index - 1];
    }
  }

  // =========================================================
  // GO TO SPECIFIC STEP
  // =========================================================

  void goToStep(BookingStep step) {
    ref
        .read(
      bookingStepProvider.notifier,
    )
        .state = step;
  }

  // =========================================================
  // RESET BOOKING
  // =========================================================

  void reset() {
    state = BookingModel();

    ref
        .read(
      bookingStepProvider.notifier,
    )
        .state = BookingStep.type;
  }
}

// =============================================================
// PROVIDERS
// =============================================================

final bookingProvider =
StateNotifierProvider<
    BookingNotifier,
    BookingModel
>(
      (ref) => BookingNotifier(ref),
);

final bookingStepProvider =
StateProvider<BookingStep>(
      (ref) => BookingStep.type,
);