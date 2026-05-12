import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/api/api_client.dart';

import '../providers/booking_provider.dart';

import '../utils/booking_navigation.dart';

class Step6Confirmation
    extends ConsumerStatefulWidget {
  const Step6Confirmation({
    super.key,
  });

  @override
  ConsumerState<Step6Confirmation>
  createState() =>
      _Step6ConfirmationState();
}

class _Step6ConfirmationState
    extends ConsumerState<
        Step6Confirmation> {
  bool loading = false;

  bool success = false;

  Future<void> confirmBooking(
      WidgetRef ref,
      ) async {
    try {
      setState(() {
        loading = true;
      });

      final booking =
      ref.read(bookingProvider);

      await apiClient.createBooking({
        "businessId":
        booking.business!.id,

        "serviceId":
        booking.service!.id,

        "staffId":
        booking.staff?.id,

        "bookingDate":
        booking.date!
            .toIso8601String()
            .split("T")[0],

        "startTime":
        booking.time,

        "customerName":
        booking.customer!["name"],

        "customerEmail":
        booking.customer!["email"],

        "customerPhone":
        booking.customer!["phone"],

        "notes":
        booking.customer!["notes"],
      });

      setState(() {
        success = true;
      });
    } catch (e) {
      ScaffoldMessenger.of(context)
          .showSnackBar(
        SnackBar(
          behavior:
          SnackBarBehavior.floating,
          backgroundColor: Colors.black,
          content: Text(
            e.toString(),
            style: const TextStyle(
              color: Colors.white,
            ),
          ),
        ),
      );
    } finally {
      setState(() {
        loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final booking =
    ref.watch(bookingProvider);

    final theme = Theme.of(context);

    if (success) {
      return SafeArea(
        child: Center(
          child: SingleChildScrollView(
            child: Padding(
              padding:
              const EdgeInsets.all(32),
              child: Column(
                mainAxisAlignment:
                MainAxisAlignment.center,
                children: [
                  // =================================
                  // SUCCESS ICON
                  // =================================
            
                  Container(
                    width: 140,
                    height: 140,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      gradient:
                      const LinearGradient(
                        colors: [
                          Color(0xFF111111),
                          Color(0xFF2A2A2A),
                        ],
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black
                              .withOpacity(0.15),
                          blurRadius: 30,
                          offset:
                          const Offset(
                            0,
                            14,
                          ),
                        ),
                      ],
                    ),
                    child: const Icon(
                      Icons
                          .check_rounded,
                      color: Colors.white,
                      size: 72,
                    ),
                  ),
            
                  const SizedBox(height: 34),
            
                  // =================================
                  // TITLE
                  // =================================
            
                  Text(
                    "Booking Confirmed",
                    textAlign:
                    TextAlign.center,
                    style: theme
                        .textTheme
                        .headlineMedium
                        ?.copyWith(
                      fontWeight:
                      FontWeight.w800,
                      letterSpacing: -1,
                    ),
                  ),
            
                  const SizedBox(height: 14),
            
                  Text(
                    "Your appointment has been successfully scheduled.",
                    textAlign:
                    TextAlign.center,
                    style: TextStyle(
                      color:
                      Colors.grey.shade600,
                      fontSize: 15,
                      height: 1.5,
                      fontWeight:
                      FontWeight.w500,
                    ),
                  ),
            
                  const SizedBox(height: 34),
            
                  // =================================
                  // SUMMARY CARD
                  // =================================
            
                  Container(
                    padding:
                    const EdgeInsets.all(
                      24,
                    ),
                    decoration: BoxDecoration(
                      color:
                      Colors.grey.shade50,
                      borderRadius:
                      BorderRadius.circular(
                        30,
                      ),
                      border: Border.all(
                        color: Colors
                            .grey
                            .shade200,
                      ),
                    ),
                    child: Column(
                      children: [
                        _successRow(
                          Icons
                              .business_rounded,
                          "Business",
                          booking
                              .business!
                              .name,
                        ),
            
                        const SizedBox(
                            height: 18),
            
                        _successRow(
                          Icons
                              .content_cut_rounded,
                          "Service",
                          booking
                              .service!
                              .name,
                        ),
            
                        const SizedBox(
                            height: 18),
            
                        _successRow(
                          Icons
                              .person_rounded,
                          "Staff",
                          booking
                              .staff
                              ?.name ??
                              "Any available",
                        ),
            
                        const SizedBox(
                            height: 18),
            
                        _successRow(
                          Icons
                              .calendar_month_rounded,
                          "Date",
                          _formatDate(
                            booking.date!,
                          ),
                        ),
            
                        const SizedBox(
                            height: 18),
            
                        _successRow(
                          Icons
                              .schedule_rounded,
                          "Time",
                          booking.time!,
                        ),
                      ],
                    ),
                  ),
            
                  const SizedBox(height: 34),
            
                  // =================================
                  // BUTTON
                  // =================================
            
                  SizedBox(
                    width: double.infinity,
                    height: 58,
                    child: ElevatedButton(
                      onPressed: () {
                        Navigator.pop(
                          context,
                        );
                      },
                      style:
                      ElevatedButton.styleFrom(
                        elevation: 0,
                        backgroundColor:
                        Colors.black,
                        foregroundColor:
                        Colors.white,
                        shape:
                        RoundedRectangleBorder(
                          borderRadius:
                          BorderRadius.circular(
                            22,
                          ),
                        ),
                      ),
                      child: Row(
                        mainAxisAlignment:
                        MainAxisAlignment
                            .center,
                        children: [
                          const Text(
                            "Done",
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight:
                              FontWeight
                                  .w700,
                            ),
                          ),
            
                          const SizedBox(
                              width: 10),
            
                          Container(
                            width: 26,
                            height: 26,
                            decoration:
                            BoxDecoration(
                              color:
                              Colors.white12,
                              borderRadius:
                              BorderRadius.circular(
                                30,
                              ),
                            ),
                            child: const Icon(
                              Icons
                                  .arrow_forward_rounded,
                              size: 16,
                              color:
                              Colors.white,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      );
    }

    return SafeArea(
      top: false,
      child: Column(
        children: [
          Expanded(
            child: SingleChildScrollView(
              physics:
              const BouncingScrollPhysics(),
              padding:
              const EdgeInsets.fromLTRB(
                24,
                20,
                24,
                24,
              ),
              child: Column(
                crossAxisAlignment:
                CrossAxisAlignment
                    .start,
                children: [
                  // =================================
                  // HEADER
                  // =================================

                  Row(
                    children: [
                      Material(
                        color:
                        Colors.grey
                            .shade100,
                        borderRadius:
                        BorderRadius
                            .circular(
                          14,
                        ),
                        child: InkWell(
                          borderRadius:
                          BorderRadius
                              .circular(
                            14,
                          ),
                          onTap: () =>
                              goBack(ref),
                          child: Container(
                            width: 46,
                            height: 46,
                            alignment:
                            Alignment
                                .center,
                            child:
                            const Icon(
                              Icons
                                  .arrow_back_ios_new_rounded,
                              size: 18,
                            ),
                          ),
                        ),
                      ),

                      const SizedBox(
                          width: 16),

                      Expanded(
                        child: Column(
                          crossAxisAlignment:
                          CrossAxisAlignment
                              .start,
                          children: [
                            Text(
                              "Confirmation",
                              style: theme
                                  .textTheme
                                  .headlineMedium
                                  ?.copyWith(
                                fontWeight:
                                FontWeight
                                    .w800,
                                letterSpacing:
                                -0.8,
                              ),
                            ),

                            const SizedBox(
                                height:
                                4),

                            Text(
                              "Review your booking details before confirming your appointment.",
                              style:
                              TextStyle(
                                color: Colors
                                    .grey
                                    .shade600,
                                fontSize:
                                14.5,
                                height:
                                1.45,
                                fontWeight:
                                FontWeight
                                    .w500,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(
                      height: 30),

                  // =================================
                  // HERO CARD
                  // =================================

                  Container(
                    padding:
                    const EdgeInsets.all(
                      24,
                    ),
                    decoration:
                    BoxDecoration(
                      gradient:
                      const LinearGradient(
                        colors: [
                          Color(
                            0xFF111111,
                          ),
                          Color(
                            0xFF2A2A2A,
                          ),
                        ],
                      ),
                      borderRadius:
                      BorderRadius
                          .circular(
                        30,
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: Colors
                              .black
                              .withOpacity(
                            0.14,
                          ),
                          blurRadius:
                          24,
                          offset:
                          const Offset(
                            0,
                            12,
                          ),
                        ),
                      ],
                    ),
                    child: Row(
                      children: [
                        Container(
                          width: 72,
                          height: 72,
                          decoration:
                          BoxDecoration(
                            color: Colors
                                .white12,
                            borderRadius:
                            BorderRadius.circular(
                              22,
                            ),
                          ),
                          child:
                          const Icon(
                            Icons
                                .event_available_rounded,
                            color:
                            Colors.white,
                            size: 34,
                          ),
                        ),

                        const SizedBox(
                            width: 18),

                        Expanded(
                          child: Column(
                            crossAxisAlignment:
                            CrossAxisAlignment
                                .start,
                            children: [
                              const Text(
                                "Ready to Confirm",
                                style:
                                TextStyle(
                                  color: Colors
                                      .white,
                                  fontSize:
                                  20,
                                  fontWeight:
                                  FontWeight
                                      .w700,
                                ),
                              ),

                              const SizedBox(
                                  height:
                                  8),

                              Text(
                                booking
                                    .service!
                                    .name,
                                style:
                                const TextStyle(
                                  color: Colors
                                      .white70,
                                  fontSize:
                                  14.5,
                                  height:
                                  1.45,
                                  fontWeight:
                                  FontWeight
                                      .w500,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(
                      height: 32),

                  // =================================
                  // BOOKING DETAILS
                  // =================================

                  const Text(
                    "Booking Summary",
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight:
                      FontWeight.w700,
                    ),
                  ),

                  const SizedBox(
                      height: 18),

                  _summaryTile(
                    icon: Icons
                        .business_rounded,
                    title: "Business",
                    value: booking
                        .business!
                        .name,
                  ),

                  _summaryTile(
                    icon: Icons
                        .content_cut_rounded,
                    title: "Service",
                    value: booking
                        .service!
                        .name,
                  ),

                  _summaryTile(
                    icon:
                    Icons.person_rounded,
                    title: "Staff",
                    value: booking
                        .staff
                        ?.name ??
                        "Any available",
                  ),

                  _summaryTile(
                    icon: Icons
                        .calendar_today_rounded,
                    title: "Date",
                    value: _formatDate(
                      booking.date!,
                    ),
                  ),

                  _summaryTile(
                    icon: Icons
                        .schedule_rounded,
                    title: "Time",
                    value: booking.time!,
                  ),

                  _summaryTile(
                    icon: Icons
                        .mail_outline_rounded,
                    title: "Email",
                    value: booking
                        .customer!["email"],
                  ),

                  _summaryTile(
                    icon:
                    Icons.phone_rounded,
                    title: "Phone",
                    value: booking
                        .customer!["phone"],
                  ),

                  if ((booking.customer![
                  "notes"] ??
                      "")
                      .toString()
                      .isNotEmpty)
                    _summaryTile(
                      icon:
                      Icons.notes_rounded,
                      title: "Notes",
                      value: booking
                          .customer!["notes"],
                    ),
                ],
              ),
            ),
          ),

          // =====================================
          // CONFIRM BUTTON
          // =====================================

          Padding(
            padding:
            const EdgeInsets.fromLTRB(
              24,
              0,
              24,
              24,
            ),
            child: SizedBox(
              width: double.infinity,
              height: 58,
              child: ElevatedButton(
                onPressed: loading
                    ? null
                    : () => confirmBooking(
                  ref,
                ),
                style:
                ElevatedButton.styleFrom(
                  elevation: 0,
                  backgroundColor:
                  Colors.black,
                  disabledBackgroundColor:
                  Colors.grey.shade300,
                  foregroundColor:
                  Colors.white,
                  shape:
                  RoundedRectangleBorder(
                    borderRadius:
                    BorderRadius.circular(
                      22,
                    ),
                  ),
                ),
                child: loading
                    ? const SizedBox(
                  width: 24,
                  height: 24,
                  child:
                  CircularProgressIndicator(
                    strokeWidth: 2.5,
                    color:
                    Colors.white,
                  ),
                )
                    : Row(
                  mainAxisAlignment:
                  MainAxisAlignment
                      .center,
                  children: [
                    const Text(
                      "Confirm Booking",
                      style:
                      TextStyle(
                        fontSize: 16,
                        fontWeight:
                        FontWeight
                            .w700,
                      ),
                    ),

                    const SizedBox(
                        width: 10),

                    Container(
                      width: 26,
                      height: 26,
                      decoration:
                      BoxDecoration(
                        color: Colors
                            .white12,
                        borderRadius:
                        BorderRadius.circular(
                          30,
                        ),
                      ),
                      child:
                      const Icon(
                        Icons
                            .check_rounded,
                        size: 16,
                        color:
                        Colors.white,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  // =============================================
  // SUMMARY TILE
  // =============================================

  Widget _summaryTile({
    required IconData icon,
    required String title,
    required String value,
  }) {
    return Container(
      margin:
      const EdgeInsets.only(
        bottom: 16,
      ),
      padding:
      const EdgeInsets.all(
        20,
      ),
      decoration: BoxDecoration(
        color: Colors.grey.shade50,
        borderRadius:
        BorderRadius.circular(
          24,
        ),
        border: Border.all(
          color:
          Colors.grey.shade200,
        ),
      ),
      child: Row(
        crossAxisAlignment:
        CrossAxisAlignment.start,
        children: [
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              color: Colors.black,
              borderRadius:
              BorderRadius.circular(
                16,
              ),
            ),
            child: Icon(
              icon,
              color: Colors.white,
              size: 22,
            ),
          ),

          const SizedBox(width: 16),

          Expanded(
            child: Column(
              crossAxisAlignment:
              CrossAxisAlignment
                  .start,
              children: [
                Text(
                  title,
                  style: TextStyle(
                    color:
                    Colors.grey.shade600,
                    fontSize: 13,
                    fontWeight:
                    FontWeight.w600,
                  ),
                ),

                const SizedBox(height: 6),

                Text(
                  value,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight:
                    FontWeight.w700,
                    height: 1.4,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // =============================================
  // SUCCESS ROW
  // =============================================

  Widget _successRow(
      IconData icon,
      String title,
      String value,
      ) {
    return Row(
      children: [
        Container(
          width: 42,
          height: 42,
          decoration: BoxDecoration(
            color: Colors.black,
            borderRadius:
            BorderRadius.circular(
              14,
            ),
          ),
          child: Icon(
            icon,
            color: Colors.white,
            size: 20,
          ),
        ),

        const SizedBox(width: 14),

        Expanded(
          child: Column(
            crossAxisAlignment:
            CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: TextStyle(
                  color:
                  Colors.grey.shade600,
                  fontSize: 12,
                  fontWeight:
                  FontWeight.w600,
                ),
              ),

              const SizedBox(height: 4),

              Text(
                value,
                style: const TextStyle(
                  fontSize: 15,
                  fontWeight:
                  FontWeight.w700,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  // =============================================
  // FORMAT DATE
  // =============================================

  String _formatDate(
      DateTime date,
      ) {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    return "${date.day} ${months[date.month - 1]}, ${date.year}";
  }
}