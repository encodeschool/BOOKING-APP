import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../map/models/business_model.dart';

import '../providers/booking_provider.dart';

import '../steps/step1_type.dart';
import '../steps/step2_service.dart';
import '../steps/step3_staff.dart';
import '../steps/step4_time.dart';
import '../steps/step5_customer.dart';
import '../steps/step6_confirmation.dart';

class BookingSheet extends ConsumerStatefulWidget {
  final BusinessModel business;

  const BookingSheet({
    super.key,
    required this.business,
  });

  @override
  ConsumerState<BookingSheet> createState() =>
      _BookingSheetState();
}

class _BookingSheetState
    extends ConsumerState<BookingSheet> {
  final DraggableScrollableController
  _sheetController =
  DraggableScrollableController();

  @override
  void initState() {
    super.initState();

    Future.microtask(() {
      ref
          .read(bookingProvider.notifier)
          .setBusiness(widget.business);
    });
  }

  @override
  Widget build(BuildContext context) {
    final step =
    ref.watch(bookingStepProvider);

    final stepIndex =
    _stepIndex(step);

    final stepTitle =
    _stepTitle(step);

    final totalSteps = 6;

    Widget child;

    switch (step) {
      case BookingStep.type:
        child = const Step1Type();
        break;

      case BookingStep.service:
        child = const Step2Service();
        break;

      case BookingStep.staff:
        child = const Step3Staff();
        break;

      case BookingStep.time:
        child = const Step4Time();
        break;

      case BookingStep.customer:
        child = const Step5Customer();
        break;

      case BookingStep.confirmation:
        child =
        const Step6Confirmation();
        break;
    }

    return DraggableScrollableSheet(
      controller: _sheetController,
      initialChildSize: 0.94,
      minChildSize: 0.72,
      maxChildSize: 0.98,
      snap: true,
      snapSizes: const [0.72, 0.94],

      builder: (
          context,
          scrollController,
          ) {
        return Container(
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius:
            const BorderRadius.vertical(
              top: Radius.circular(32),
            ),
            boxShadow: [
              BoxShadow(
                color: Colors.black
                    .withOpacity(0.15),
                blurRadius: 30,
                offset: const Offset(
                  0,
                  -8,
                ),
              ),
            ],
          ),

          child: Column(
            children: [
              // =====================================
              // TOP HANDLE
              // =====================================

              const SizedBox(height: 10),

              Container(
                width: 52,
                height: 5,
                decoration: BoxDecoration(
                  color: Colors.grey.shade300,
                  borderRadius:
                  BorderRadius.circular(
                    20,
                  ),
                ),
              ),

              // =====================================
              // HEADER
              // =====================================

              Padding(
                padding:
                const EdgeInsets.fromLTRB(
                  22,
                  20,
                  22,
                  18,
                ),

                child: Column(
                  children: [
                    Row(
                      children: [
                        // BACK BUTTON

                        if (stepIndex > 1)
                          _headerButton(
                            icon: Icons
                                .arrow_back_ios_new_rounded,
                            onTap: () {
                              ref.read(bookingProvider.notifier,).previousStep();
                            },
                          )
                        else
                          const SizedBox(
                            width: 48,
                          ),

                        // TITLE

                        Expanded(
                          child: Column(
                            children: [
                              Text(
                                stepTitle,
                                style: const TextStyle(
                                  fontSize: 22,
                                  fontWeight:
                                  FontWeight
                                      .w700,
                                  letterSpacing:
                                  -0.5,
                                ),
                              ),

                              const SizedBox(
                                height: 4,
                              ),

                              Text(
                                'Step $stepIndex of $totalSteps',
                                style: TextStyle(
                                  color: Colors
                                      .grey
                                      .shade600,
                                  fontSize: 14,
                                  fontWeight:
                                  FontWeight
                                      .w500,
                                ),
                              ),
                            ],
                          ),
                        ),

                        // CLOSE BUTTON

                        _headerButton(
                          icon: Icons
                              .close_rounded,
                          onTap: () {
                            Navigator.pop(
                              context,
                            );
                          },
                        ),
                      ],
                    ),

                    const SizedBox(height: 22),

                    // =====================================
                    // PROGRESS BAR
                    // =====================================

                    Row(
                      children:
                      List.generate(
                        totalSteps,
                            (index) {
                          final current =
                              index + 1;

                          final active =
                              current <=
                                  stepIndex;

                          return Expanded(
                            child:
                            AnimatedContainer(
                              duration:
                              const Duration(
                                milliseconds:
                                300,
                              ),
                              margin:
                              EdgeInsets.only(
                                right: index !=
                                    totalSteps -
                                        1
                                    ? 8
                                    : 0,
                              ),
                              height: 6,
                              decoration:
                              BoxDecoration(
                                color: active
                                    ? Colors
                                    .black
                                    : Colors
                                    .grey
                                    .shade200,
                                borderRadius:
                                BorderRadius
                                    .circular(
                                  20,
                                ),
                              ),
                            ),
                          );
                        },
                      ),
                    ),

                    const SizedBox(height: 22),

                    // =====================================
                    // BUSINESS CARD
                    // =====================================

                    _businessCard(),
                  ],
                ),
              ),

              Divider(
                height: 1,
                color: Colors.grey.shade200,
              ),

              // =====================================
              // CONTENT
              // =====================================

              Expanded(
                child: AnimatedSwitcher(
                  duration:
                  const Duration(
                    milliseconds: 350,
                  ),
                  switchInCurve:
                  Curves.easeOut,
                  switchOutCurve:
                  Curves.easeIn,

                  transitionBuilder:
                      (
                      child,
                      animation,
                      ) {
                    return FadeTransition(
                      opacity: animation,
                      child:
                      SlideTransition(
                        position:
                        Tween<Offset>(
                          begin:
                          const Offset(
                            0.05,
                            0,
                          ),
                          end:
                          Offset.zero,
                        ).animate(
                          animation,
                        ),
                        child: child,
                      ),
                    );
                  },

                  child: Container(
                    key: ValueKey(step),
                    child: child,
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  // =====================================================
  // STEP TITLE
  // =====================================================

  String _stepTitle(
      BookingStep step,
      ) {
    switch (step) {
      case BookingStep.type:
        return 'Booking Type';

      case BookingStep.service:
        return 'Choose Service';

      case BookingStep.staff:
        return 'Choose Specialist';

      case BookingStep.time:
        return 'Select Time';

      case BookingStep.customer:
        return 'Your Information';

      case BookingStep.confirmation:
        return 'Confirmation';
    }
  }

  // =====================================================
  // STEP INDEX
  // =====================================================

  int _stepIndex(
      BookingStep step,
      ) {
    switch (step) {
      case BookingStep.type:
        return 1;

      case BookingStep.service:
        return 2;

      case BookingStep.staff:
        return 3;

      case BookingStep.time:
        return 4;

      case BookingStep.customer:
        return 5;

      case BookingStep.confirmation:
        return 6;
    }
  }

  // =====================================================
  // HEADER BUTTON
  // =====================================================

  Widget _headerButton({
    required IconData icon,
    required VoidCallback onTap,
  }) {
    return ClipRRect(
      borderRadius:
      BorderRadius.circular(16),

      child: BackdropFilter(
        filter: ImageFilter.blur(
          sigmaX: 10,
          sigmaY: 10,
        ),

        child: Material(
          color: Colors.grey.shade100,

          child: InkWell(
            onTap: onTap,
            borderRadius:
            BorderRadius.circular(
              16,
            ),

            child: Container(
              width: 48,
              height: 48,
              alignment: Alignment.center,

              child: Icon(
                icon,
                size: 20,
                color: Colors.black87,
              ),
            ),
          ),
        ),
      ),
    );
  }

  // =====================================================
  // BUSINESS CARD
  // =====================================================

  Widget _businessCard() {
    return Container(
      padding: const EdgeInsets.all(16),

      decoration: BoxDecoration(
        color: Colors.grey.shade50,
        borderRadius:
        BorderRadius.circular(22),
        border: Border.all(
          color: Colors.grey.shade200,
        ),
      ),

      child: Row(
        children: [
          // IMAGE

          ClipRRect(
            borderRadius:
            BorderRadius.circular(18),

            child: Container(
              width: 62,
              height: 62,
              color: Colors.grey.shade200,

              child:
              widget.business.imageUrl !=
                  null
                  ? Image.network(
                widget.business
                    .imageUrl!,
                fit: BoxFit.cover,
              )
                  : const Icon(
                Icons
                    .business_rounded,
                size: 30,
              ),
            ),
          ),

          const SizedBox(width: 14),

          // INFO

          Expanded(
            child: Column(
              crossAxisAlignment:
              CrossAxisAlignment.start,
              children: [
                Text(
                  widget.business.name,
                  maxLines: 1,
                  overflow:
                  TextOverflow.ellipsis,
                  style: const TextStyle(
                    fontSize: 17,
                    fontWeight:
                    FontWeight.w700,
                  ),
                ),

                const SizedBox(height: 6),

                Row(
                  children: [
                    Icon(
                      Icons
                          .location_on_rounded,
                      size: 16,
                      color:
                      Colors.grey.shade600,
                    ),

                    const SizedBox(width: 4),

                    Expanded(
                      child: Text(
                        widget.business
                            .address ??
                            'No address',
                        maxLines: 1,
                        overflow:
                        TextOverflow
                            .ellipsis,
                        style: TextStyle(
                          color: Colors
                              .grey.shade600,
                          fontSize: 13,
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),

          const SizedBox(width: 10),

          // RATING

          Container(
            padding:
            const EdgeInsets.symmetric(
              horizontal: 10,
              vertical: 8,
            ),

            decoration: BoxDecoration(
              color: Colors.black,
              borderRadius:
              BorderRadius.circular(
                14,
              ),
            ),

            child: Row(
              children: const [
                Icon(
                  Icons.star_rounded,
                  size: 16,
                  color: Colors.white,
                ),

                SizedBox(width: 4),

                Text(
                  '4.9',
                  style: TextStyle(
                    color: Colors.white,
                    fontWeight:
                    FontWeight.w700,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}