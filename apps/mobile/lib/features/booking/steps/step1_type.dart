import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../providers/booking_provider.dart';
import '../utils/booking_navigation.dart';

class Step1Type extends ConsumerWidget {
  const Step1Type({super.key});

  @override
  Widget build(
      BuildContext context,
      WidgetRef ref,
      ) {
    final theme = Theme.of(context);

    return SafeArea(
      top: false,
      child: SingleChildScrollView(
        padding: const EdgeInsets.fromLTRB(
          24,
          12,
          24,
          32,
        ),
        child: Column(
          crossAxisAlignment:
          CrossAxisAlignment.start,
          children: [
            // =====================================
            // TITLE
            // =====================================

            Text(
              "Choose booking type",
              style: theme.textTheme.headlineMedium
                  ?.copyWith(
                fontWeight: FontWeight.w800,
                letterSpacing: -0.8,
              ),
            ),

            const SizedBox(height: 10),

            Text(
              "Select how you want to make your reservation.",
              style: TextStyle(
                fontSize: 15,
                height: 1.5,
                color: Colors.grey.shade600,
                fontWeight: FontWeight.w500,
              ),
            ),

            const SizedBox(height: 34),

            // =====================================
            // INDIVIDUAL BOOKING
            // =====================================

            _BookingTypeCard(
              icon: Icons.person_rounded,
              title: "Book appointment",
              subtitle:
              "Schedule services for yourself with a selected specialist and time slot.",
              badge: "Most Popular",
              gradient: const LinearGradient(
                colors: [
                  Color(0xFF111111),
                  Color(0xFF2A2A2A),
                ],
              ),
              onTap: () {
                ref
                    .read(
                  bookingProvider.notifier,
                )
                    .setType(
                  "individual",
                );

                goNext(ref);
              },
            ),

            const SizedBox(height: 18),

            // =====================================
            // GROUP BOOKING
            // =====================================

            _BookingTypeCard(
              icon: Icons.groups_rounded,
              title: "Group booking",
              subtitle:
              "Reserve services for multiple people at the same time.",
              badge: "Team / Family",
              gradient: LinearGradient(
                colors: [
                  Colors.grey.shade100,
                  Colors.white,
                ],
              ),
              dark: false,
              onTap: () {
                ref
                    .read(
                  bookingProvider.notifier,
                )
                    .setType(
                  "group",
                );

                goNext(ref);
              },
            ),

            const SizedBox(height: 28),

            // =====================================
            // INFO BOX
            // =====================================

            Container(
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                color: Colors.grey.shade50,
                borderRadius:
                BorderRadius.circular(22),
                border: Border.all(
                  color: Colors.grey.shade200,
                ),
              ),
              child: Row(
                crossAxisAlignment:
                CrossAxisAlignment.start,
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
                    child: const Icon(
                      Icons.info_outline_rounded,
                      color: Colors.white,
                    ),
                  ),

                  const SizedBox(width: 14),

                  Expanded(
                    child: Column(
                      crossAxisAlignment:
                      CrossAxisAlignment
                          .start,
                      children: [
                        const Text(
                          "Flexible booking",
                          style: TextStyle(
                            fontWeight:
                            FontWeight.w700,
                            fontSize: 15,
                          ),
                        ),

                        const SizedBox(height: 6),

                        Text(
                          "You can change your selected services, staff member, and booking time in the next steps.",
                          style: TextStyle(
                            color:
                            Colors.grey.shade600,
                            height: 1.45,
                            fontSize: 13.5,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// =========================================================
// BOOKING TYPE CARD
// =========================================================

class _BookingTypeCard extends StatefulWidget {
  final String title;
  final String subtitle;
  final String badge;
  final IconData icon;
  final VoidCallback onTap;
  final Gradient gradient;
  final bool dark;

  const _BookingTypeCard({
    required this.title,
    required this.subtitle,
    required this.badge,
    required this.icon,
    required this.onTap,
    required this.gradient,
    this.dark = true,
  });

  @override
  State<_BookingTypeCard> createState() =>
      _BookingTypeCardState();
}

class _BookingTypeCardState
    extends State<_BookingTypeCard> {
  bool _pressed = false;

  @override
  Widget build(BuildContext context) {
    final textColor =
    widget.dark
        ? Colors.white
        : Colors.black87;

    final subtitleColor =
    widget.dark
        ? Colors.white70
        : Colors.grey.shade700;

    return GestureDetector(
      onTapDown: (_) {
        setState(() {
          _pressed = true;
        });
      },
      onTapUp: (_) {
        setState(() {
          _pressed = false;
        });

        widget.onTap();
      },
      onTapCancel: () {
        setState(() {
          _pressed = false;
        });
      },
      child: AnimatedScale(
        duration:
        const Duration(milliseconds: 120),
        scale: _pressed ? 0.985 : 1,
        child: AnimatedContainer(
          duration:
          const Duration(milliseconds: 220),
          padding: const EdgeInsets.all(22),
          decoration: BoxDecoration(
            gradient: widget.gradient,
            borderRadius:
            BorderRadius.circular(30),

            border: Border.all(
              color: widget.dark
                  ? Colors.black
                  : Colors.grey.shade300,
            ),

            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(
                  widget.dark ? 0.16 : 0.05,
                ),
                blurRadius: 24,
                offset: const Offset(0, 10),
              ),
            ],
          ),

          child: Column(
            crossAxisAlignment:
            CrossAxisAlignment.start,
            children: [
              // ============================
              // TOP ROW
              // ============================

              Row(
                children: [
                  Container(
                    width: 58,
                    height: 58,
                    decoration: BoxDecoration(
                      color: widget.dark
                          ? Colors.white12
                          : Colors.black,
                      borderRadius:
                      BorderRadius.circular(
                        18,
                      ),
                    ),
                    child: Icon(
                      widget.icon,
                      color: widget.dark
                          ? Colors.white
                          : Colors.white,
                      size: 28,
                    ),
                  ),

                  const Spacer(),

                  Container(
                    padding:
                    const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 7,
                    ),
                    decoration: BoxDecoration(
                      color: widget.dark
                          ? Colors.white12
                          : Colors.black,
                      borderRadius:
                      BorderRadius.circular(
                        30,
                      ),
                    ),
                    child: Text(
                      widget.badge,
                      style: TextStyle(
                        color: widget.dark
                            ? Colors.white
                            : Colors.white,
                        fontWeight:
                        FontWeight.w600,
                        fontSize: 12,
                      ),
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 26),

              // ============================
              // TITLE
              // ============================

              Text(
                widget.title,
                style: TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.w800,
                  color: textColor,
                  letterSpacing: -0.4,
                ),
              ),

              const SizedBox(height: 10),

              // ============================
              // SUBTITLE
              // ============================

              Text(
                widget.subtitle,
                style: TextStyle(
                  fontSize: 14.5,
                  height: 1.5,
                  color: subtitleColor,
                  fontWeight: FontWeight.w500,
                ),
              ),

              const SizedBox(height: 22),

              // ============================
              // BUTTON ROW
              // ============================

              Row(
                children: [
                  Text(
                    "Continue",
                    style: TextStyle(
                      color: textColor,
                      fontWeight: FontWeight.w700,
                      fontSize: 15,
                    ),
                  ),

                  const SizedBox(width: 8),

                  Icon(
                    Icons.arrow_forward_rounded,
                    color: textColor,
                    size: 20,
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}