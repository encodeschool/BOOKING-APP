import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../providers/booking_provider.dart';
import '../providers/service_provider.dart';

import '../utils/booking_navigation.dart';

class Step2Service extends ConsumerWidget {
  const Step2Service({super.key});

  @override
  Widget build(
      BuildContext context,
      WidgetRef ref,
      ) {
    final booking =
    ref.watch(bookingProvider);

    final business = booking.business;

    final services = ref.watch(
      servicesProvider(
        business!.id,
      ),
    );

    final theme = Theme.of(context);

    return services.when(
      data: (items) {
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
                  22,
                  24,
                  12,
                ),
                child: Column(
                  crossAxisAlignment:
                  CrossAxisAlignment.start,
                  children: [
                    Text(
                      "Choose Service",
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
                      "Select the service you want to book at ${business.name}.",
                      style: TextStyle(
                        color:
                        Colors.grey.shade600,
                        fontSize: 15,
                        height: 1.5,
                        fontWeight:
                        FontWeight.w500,
                      ),
                    ),

                    const SizedBox(height: 24),

                    // SEARCH
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
                              "Search services...",
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
                            Icons
                                .tune_rounded,
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
            // SERVICES LIST
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
                    final service =
                    items[index];

                    return _ServiceCard(
                      service: service,
                      onTap: () {
                        ref
                            .read(
                          bookingProvider
                              .notifier,
                        )
                            .setService(
                          service,
                        );

                        goNext(ref);
                      },
                    );
                  },
                  childCount: items.length,
                ),
              ),
            ),

            // BOTTOM SPACE
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
              "Loading services...",
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
                Icons.error_outline_rounded,
                size: 72,
                color: Colors.red.shade300,
              ),

              const SizedBox(height: 20),

              const Text(
                "Unable to load services",
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
                    servicesProvider(
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
// SERVICE CARD
// =========================================================

class _ServiceCard extends StatefulWidget {
  final dynamic service;
  final VoidCallback onTap;

  const _ServiceCard({
    required this.service,
    required this.onTap,
  });

  @override
  State<_ServiceCard> createState() =>
      _ServiceCardState();
}

class _ServiceCardState
    extends State<_ServiceCard> {
  bool _pressed = false;

  @override
  Widget build(BuildContext context) {
    final service = widget.service;

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
          margin:
          const EdgeInsets.only(
            bottom: 18,
          ),
          padding:
          const EdgeInsets.all(22),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius:
            BorderRadius.circular(
              28,
            ),

            border: Border.all(
              color: Colors.grey.shade200,
            ),

            boxShadow: [
              BoxShadow(
                color: Colors.black
                    .withOpacity(0.05),
                blurRadius: 18,
                offset: const Offset(0, 8),
              ),
            ],
          ),

          child: Column(
            crossAxisAlignment:
            CrossAxisAlignment.start,
            children: [
              // ===================================
              // TOP ROW
              // ===================================

              Row(
                children: [
                  Container(
                    width: 58,
                    height: 58,
                    decoration: BoxDecoration(
                      color:
                      Colors.grey.shade100,
                      borderRadius:
                      BorderRadius.circular(
                        18,
                      ),
                    ),
                    child: const Icon(
                      Icons.spa_rounded,
                      size: 28,
                    ),
                  ),

                  const Spacer(),

                  Container(
                    padding:
                    const EdgeInsets.symmetric(
                      horizontal: 14,
                      vertical: 8,
                    ),
                    decoration: BoxDecoration(
                      color: Colors.black,
                      borderRadius:
                      BorderRadius.circular(
                        30,
                      ),
                    ),
                    child: Text(
                      "€${service.price}",
                      style: const TextStyle(
                        color: Colors.white,
                        fontWeight:
                        FontWeight.w700,
                        fontSize: 14,
                      ),
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 22),

              // ===================================
              // SERVICE NAME
              // ===================================

              Text(
                service.name,
                style: const TextStyle(
                  fontSize: 21,
                  fontWeight:
                  FontWeight.w800,
                  letterSpacing: -0.5,
                ),
              ),

              const SizedBox(height: 10),

              // ===================================
              // DESCRIPTION
              // ===================================

              Text(
                service.description ??
                    "Professional service provided by experienced specialists.",
                style: TextStyle(
                  color:
                  Colors.grey.shade600,
                  fontSize: 14.5,
                  height: 1.5,
                  fontWeight:
                  FontWeight.w500,
                ),
              ),

              const SizedBox(height: 22),

              // ===================================
              // FOOTER
              // ===================================

              Row(
                children: [
                  Container(
                    padding:
                    const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 8,
                    ),
                    decoration: BoxDecoration(
                      color:
                      Colors.grey.shade100,
                      borderRadius:
                      BorderRadius.circular(
                        14,
                      ),
                    ),
                    child: Row(
                      children: [
                        const Icon(
                          Icons
                              .schedule_rounded,
                          size: 16,
                        ),

                        const SizedBox(
                            width: 6),

                        Text(
                          "${service.duration ?? 0} min",
                          style:
                          const TextStyle(
                            fontWeight:
                            FontWeight
                                .w600,
                          ),
                        ),
                      ],
                    ),
                  ),

                  const Spacer(),

                  Row(
                    children: const [
                      Text(
                        "Select",
                        style: TextStyle(
                          fontWeight:
                          FontWeight.w700,
                          fontSize: 15,
                        ),
                      ),

                      SizedBox(width: 6),

                      Icon(
                        Icons
                            .arrow_forward_rounded,
                        size: 20,
                      ),
                    ],
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