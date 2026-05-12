import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../providers/booking_provider.dart';

void goNext(WidgetRef ref) {
  final current =
  ref.read(bookingStepProvider);

  ref
      .read(bookingStepProvider.notifier)
      .state = BookingStep.values[
  current.index + 1];
}

void goBack(WidgetRef ref) {
  final current =
  ref.read(bookingStepProvider);

  if (current.index == 0) return;

  ref
      .read(bookingStepProvider.notifier)
      .state = BookingStep.values[
  current.index - 1];
}