import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../models/staff_model.dart';
import '../providers/booking_provider.dart';
import '../providers/staff_provider.dart';

import '../utils/booking_navigation.dart';

class Step3Staff extends ConsumerWidget {
  const Step3Staff({super.key});

  @override
  Widget build(
      BuildContext context,
      WidgetRef ref,
      ) {
    final booking =
    ref.watch(bookingProvider);

    final business = booking.business;

    final staffAsync = ref.watch(
      staffProvider(
        business!.id,
      ),
    );

    final theme = Theme.of(context);

    return staffAsync.when(
      data: (staffList) {
        return CustomScrollView(
          physics:
          const BouncingScrollPhysics(),
          slivers: [
            // =====================================
            // HEADER
            // =====================================

            SliverToBoxAdapter(
              child: Padding(
                padding:
                const EdgeInsets.fromLTRB(
                  24,
                  20,
                  24,
                  8,
                ),
                child: Column(
                  crossAxisAlignment:
                  CrossAxisAlignment.start,
                  children: [
                    // BACK BUTTON
                    Material(
                      color:
                      Colors.grey.shade100,
                      borderRadius:
                      BorderRadius.circular(
                        14,
                      ),
                      child: InkWell(
                        borderRadius:
                        BorderRadius.circular(
                          14,
                        ),
                        onTap: () =>
                            goBack(ref),
                        child: Container(
                          width: 46,
                          height: 46,
                          alignment:
                          Alignment.center,
                          child: const Icon(
                            Icons
                                .arrow_back_ios_new_rounded,
                            size: 18,
                          ),
                        ),
                      ),
                    ),

                    const SizedBox(height: 28),

                    Text(
                      "Choose Staff",
                      style: theme
                          .textTheme
                          .headlineMedium
                          ?.copyWith(
                        fontWeight:
                        FontWeight.w800,
                        letterSpacing: -0.8,
                      ),
                    ),

                    const SizedBox(height: 10),

                    Text(
                      "Select your preferred specialist or let us automatically assign the best available staff member.",
                      style: TextStyle(
                        color:
                        Colors.grey.shade600,
                        fontSize: 15,
                        height: 1.5,
                        fontWeight:
                        FontWeight.w500,
                      ),
                    ),

                    const SizedBox(height: 26),

                    // SEARCH BAR
                    Container(
                      height: 56,
                      padding:
                      const EdgeInsets.symmetric(
                        horizontal: 18,
                      ),
                      decoration: BoxDecoration(
                        color:
                        Colors.grey.shade100,
                        borderRadius:
                        BorderRadius.circular(
                          18,
                        ),
                        border: Border.all(
                          color:
                          Colors.grey.shade200,
                        ),
                      ),
                      child: Row(
                        children: [
                          Icon(
                            Icons.search_rounded,
                            color:
                            Colors.grey.shade600,
                          ),

                          const SizedBox(
                              width: 12),

                          Expanded(
                            child: Text(
                              "Search specialist...",
                              style: TextStyle(
                                color: Colors
                                    .grey
                                    .shade500,
                                fontWeight:
                                FontWeight
                                    .w500,
                              ),
                            ),
                          ),

                          Icon(
                            Icons.people_alt_rounded,
                            color:
                            Colors.grey.shade600,
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 30),
                  ],
                ),
              ),
            ),

            // =====================================
            // ANY STAFF CARD
            // =====================================

            SliverPadding(
              padding:
              const EdgeInsets.symmetric(
                horizontal: 24,
              ),
              sliver: SliverToBoxAdapter(
                child: _StaffCard(
                  title:
                  "Any available staff",
                  subtitle:
                  "Automatically assign the best available specialist for your booking.",
                  role: "Smart Assignment",
                  featured: true,
                  onTap: () {
                    ref
                        .read(
                      bookingProvider
                          .notifier,
                    )
                        .setStaff(
                      StaffModel(
                        id: null,
                        name:
                        "Any available staff",
                      ),
                    );

                    goNext(ref);
                  },
                ),
              ),
            ),

            const SliverToBoxAdapter(
              child: SizedBox(height: 20),
            ),

            // =====================================
            // STAFF TITLE
            // =====================================

            SliverToBoxAdapter(
              child: Padding(
                padding:
                const EdgeInsets.symmetric(
                  horizontal: 24,
                ),
                child: Text(
                  "Available Specialists",
                  style: TextStyle(
                    fontSize: 17,
                    fontWeight:
                    FontWeight.w700,
                    color:
                    Colors.grey.shade800,
                  ),
                ),
              ),
            ),

            const SliverToBoxAdapter(
              child: SizedBox(height: 18),
            ),

            // =====================================
            // STAFF LIST
            // =====================================

            SliverPadding(
              padding:
              const EdgeInsets.symmetric(
                horizontal: 24,
              ),
              sliver: SliverList(
                delegate:
                SliverChildBuilderDelegate(
                      (context, index) {
                    final staff =
                    staffList[index];

                    return Padding(
                      padding:
                      const EdgeInsets.only(
                        bottom: 18,
                      ),
                      child: _StaffCard(
                        title: staff.name,
                        subtitle:
                        "Professional specialist with experience and high customer satisfaction.",
                        role:
                        staff.role ??
                            "Specialist",
                        imageUrl: staff.imageUrl,
                        onTap: () {
                          ref
                              .read(
                            bookingProvider
                                .notifier,
                          )
                              .setStaff(
                            staff,
                          );

                          goNext(ref);
                        },
                      ),
                    );
                  },
                  childCount:
                  staffList.length,
                ),
              ),
            ),

            const SliverToBoxAdapter(
              child: SizedBox(height: 32),
            ),
          ],
        );
      },

      // =====================================
      // LOADING
      // =====================================

      loading: () => Center(
        child: Column(
          mainAxisAlignment:
          MainAxisAlignment.center,
          children: [
            SizedBox(
              width: 34,
              height: 34,
              child: CircularProgressIndicator(
                strokeWidth: 3,
                color:
                Theme.of(context)
                    .primaryColor,
              ),
            ),

            const SizedBox(height: 18),

            Text(
              "Loading staff...",
              style: TextStyle(
                color: Colors.grey.shade600,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
      ),

      // =====================================
      // ERROR
      // =====================================

      error: (e, _) => Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment:
            MainAxisAlignment.center,
            children: [
              Icon(
                Icons.group_off_rounded,
                size: 72,
                color: Colors.red.shade300,
              ),

              const SizedBox(height: 20),

              const Text(
                "Unable to load staff",
                style: TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.w700,
                ),
              ),

              const SizedBox(height: 10),

              Text(
                e.toString(),
                textAlign: TextAlign.center,
                style: TextStyle(
                  color:
                  Colors.grey.shade600,
                  height: 1.5,
                ),
              ),

              const SizedBox(height: 24),

              ElevatedButton(
                onPressed: () {
                  ref.refresh(
                    staffProvider(
                      business.id,
                    ),
                  );
                },
                style:
                ElevatedButton.styleFrom(
                  elevation: 0,
                  padding:
                  const EdgeInsets.symmetric(
                    horizontal: 24,
                    vertical: 14,
                  ),
                  shape:
                  RoundedRectangleBorder(
                    borderRadius:
                    BorderRadius.circular(
                      16,
                    ),
                  ),
                ),
                child: const Text(
                  "Try Again",
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// =========================================================
// STAFF CARD
// =========================================================

class _StaffCard extends StatefulWidget {
  final String title;
  final String subtitle;
  final String role;
  final String? imageUrl;
  final bool featured;
  final VoidCallback onTap;

  const _StaffCard({
    required this.title,
    required this.subtitle,
    required this.role,
    required this.onTap,
    this.imageUrl,
    this.featured = false,
  });

  @override
  State<_StaffCard> createState() =>
      _StaffCardState();
}

class _StaffCardState
    extends State<_StaffCard> {
  bool _pressed = false;

  @override
  Widget build(BuildContext context) {
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
          padding:
          const EdgeInsets.all(22),
          decoration: BoxDecoration(
            gradient: widget.featured
                ? const LinearGradient(
              colors: [
                Color(0xFF111111),
                Color(0xFF2A2A2A),
              ],
            )
                : LinearGradient(
              colors: [
                Colors.white,
                Colors.grey.shade50,
              ],
            ),
            borderRadius:
            BorderRadius.circular(
              30,
            ),

            border: Border.all(
              color: widget.featured
                  ? Colors.black
                  : Colors.grey.shade200,
            ),

            boxShadow: [
              BoxShadow(
                color: Colors.black
                    .withOpacity(
                  widget.featured
                      ? 0.14
                      : 0.05,
                ),
                blurRadius: 18,
                offset: const Offset(
                  0,
                  8,
                ),
              ),
            ],
          ),

          child: Row(
            crossAxisAlignment:
            CrossAxisAlignment.start,
            children: [
              // ===================================
              // AVATAR
              // ===================================

              Hero(
                tag:
                "staff_${widget.title}",
                child: Container(
                  width: 68,
                  height: 68,
                  decoration: BoxDecoration(
                    color: widget.featured
                        ? Colors.white12
                        : Colors.black,
                    borderRadius:
                    BorderRadius.circular(
                      22,
                    ),
                  ),
                  child:
                  widget.imageUrl != null
                      ? ClipRRect(
                    borderRadius:
                    BorderRadius
                        .circular(
                      22,
                    ),
                    child: Image.network(
                      widget.imageUrl!,
                      fit: BoxFit.cover,
                    ),
                  )
                      : Center(
                    child: Text(
                      widget.title
                          .substring(
                        0,
                        1,
                      )
                          .toUpperCase(),
                      style:
                      TextStyle(
                        color: widget
                            .featured
                            ? Colors
                            .white
                            : Colors
                            .white,
                        fontWeight:
                        FontWeight
                            .w800,
                        fontSize: 24,
                      ),
                    ),
                  ),
                ),
              ),

              const SizedBox(width: 18),

              // ===================================
              // CONTENT
              // ===================================

              Expanded(
                child: Column(
                  crossAxisAlignment:
                  CrossAxisAlignment
                      .start,
                  children: [
                    // ROLE
                    Container(
                      padding:
                      const EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 7,
                      ),
                      decoration: BoxDecoration(
                        color: widget.featured
                            ? Colors.white12
                            : Colors.grey
                            .shade200,
                        borderRadius:
                        BorderRadius
                            .circular(
                          30,
                        ),
                      ),
                      child: Text(
                        widget.role,
                        style: TextStyle(
                          color:
                          widget.featured
                              ? Colors.white
                              : Colors
                              .black87,
                          fontWeight:
                          FontWeight.w700,
                          fontSize: 12,
                        ),
                      ),
                    ),

                    const SizedBox(height: 14),

                    // NAME
                    Text(
                      widget.title,
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight:
                        FontWeight.w800,
                        color:
                        widget.featured
                            ? Colors.white
                            : Colors.black,
                        letterSpacing: -0.4,
                      ),
                    ),

                    const SizedBox(height: 8),

                    // DESCRIPTION
                    Text(
                      widget.subtitle,
                      style: TextStyle(
                        fontSize: 14,
                        height: 1.5,
                        color:
                        widget.featured
                            ? Colors.white70
                            : Colors
                            .grey
                            .shade600,
                        fontWeight:
                        FontWeight.w500,
                      ),
                    ),

                    const SizedBox(height: 18),

                    // FOOTER
                    Row(
                      children: [
                        Row(
                          children: [
                            Icon(
                              Icons
                                  .star_rounded,
                              size: 18,
                              color:
                              widget
                                  .featured
                                  ? Colors
                                  .amber
                                  : Colors
                                  .orange,
                            ),

                            const SizedBox(
                                width: 4),

                            Text(
                              "4.9",
                              style:
                              TextStyle(
                                color: widget
                                    .featured
                                    ? Colors
                                    .white
                                    : Colors
                                    .black,
                                fontWeight:
                                FontWeight
                                    .w700,
                              ),
                            ),
                          ],
                        ),

                        const Spacer(),

                        Row(
                          children: [
                            Text(
                              "Select",
                              style:
                              TextStyle(
                                color: widget
                                    .featured
                                    ? Colors
                                    .white
                                    : Colors
                                    .black,
                                fontWeight:
                                FontWeight
                                    .w700,
                              ),
                            ),

                            const SizedBox(
                                width: 6),

                            Icon(
                              Icons
                                  .arrow_forward_rounded,
                              size: 20,
                              color: widget
                                  .featured
                                  ? Colors
                                  .white
                                  : Colors
                                  .black,
                            ),
                          ],
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}