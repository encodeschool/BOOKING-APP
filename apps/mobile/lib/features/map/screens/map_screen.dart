import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../booking/screens/booking_sheet.dart';
import '../models/business_model.dart';
import '../providers/business_provider.dart';
import '../widgets/business_list.dart';
import '../widgets/map_widget.dart';

class MapScreen extends ConsumerStatefulWidget {
  const MapScreen({super.key});

  @override
  ConsumerState<MapScreen> createState() => _MapScreenState();
}

class _MapScreenState extends ConsumerState<MapScreen> {
  final DraggableScrollableController _sheetController =
  DraggableScrollableController();

  bool _isExpanded = false;

  void _openBooking(BusinessModel business) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => BookingSheet(
        business: business,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final businesses = ref.watch(businessesProvider);

    return Scaffold(
      backgroundColor: Colors.black,
      body: businesses.when(
        data: (items) {
          return Stack(
            children: [
              Positioned.fill(
                child: MapWidget(
                  businesses: items,
                ),
              ),

              // TOP SHADOW
              Positioned(
                top: 0,
                left: 0,
                right: 0,
                child: IgnorePointer(
                  child: Container(
                    height: 180,
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [
                          Colors.black.withOpacity(0.45),
                          Colors.transparent,
                        ],
                      ),
                    ),
                  ),
                ),
              ),

              // TOP BAR
              SafeArea(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(
                    12,
                    12,
                    12,
                    0,
                  ),
                  child: Row(
                    children: [
                      _glassButton(
                        icon: Icons.menu_rounded,
                        onTap: () {},
                      ),

                      const SizedBox(width: 12),

                      Expanded(
                        child: _searchBar(),
                      ),

                      const SizedBox(width: 12),

                      _glassButton(
                        icon: Icons.my_location_rounded,
                        onTap: () {},
                      ),
                    ],
                  ),
                ),
              ),

              // FLOATING ACTIONS
              Positioned(
                right: 16,
                bottom: 340,
                child: Column(
                  children: [
                    _floatingMapButton(
                      icon: Icons.layers_rounded,
                      onTap: () {},
                    ),
                    const SizedBox(height: 12),
                    _floatingMapButton(
                      icon: Icons.tune_rounded,
                      onTap: () {},
                    ),
                  ],
                ),
              ),

              // SHEET
              NotificationListener<
                  DraggableScrollableNotification>(
                onNotification: (notification) {
                  final expanded = notification.extent > 0.75;

                  if (_isExpanded != expanded) {
                    setState(() {
                      _isExpanded = expanded;
                    });
                  }

                  return true;
                },
                child: DraggableScrollableSheet(
                  controller: _sheetController,
                  initialChildSize: 0.30,
                  minChildSize: 0.14,
                  maxChildSize: 0.94,
                  snap: true,
                  snapSizes: const [
                    0.14,
                    0.30,
                    0.94,
                  ],
                  builder: (context, scrollController) {
                    return Container(
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius:
                        const BorderRadius.vertical(
                          top: Radius.circular(30),
                        ),
                        boxShadow: [
                          BoxShadow(
                            color:
                            Colors.black.withOpacity(0.15),
                            blurRadius: 20,
                            offset: const Offset(0, -6),
                          ),
                        ],
                      ),
                      child: Column(
                        children: [
                          const SizedBox(height: 10),

                          Container(
                            width: 50,
                            height: 5,
                            decoration: BoxDecoration(
                              color: Colors.grey.shade300,
                              borderRadius:
                              BorderRadius.circular(30),
                            ),
                          ),

                          Padding(
                            padding:
                            const EdgeInsets.fromLTRB(
                              20,
                              18,
                              20,
                              14,
                            ),
                            child: Row(
                              children: [
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment:
                                    CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        'Nearby Places',
                                        style: Theme.of(context)
                                            .textTheme
                                            .titleLarge
                                            ?.copyWith(
                                          fontWeight:
                                          FontWeight.w800,
                                        ),
                                      ),
                                      const SizedBox(height: 4),
                                      Text(
                                        '${items.length} places found',
                                        style: TextStyle(
                                          color:
                                          Colors.grey.shade600,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                                Icon(
                                  _isExpanded
                                      ? Icons.map_rounded
                                      : Icons.list_rounded,
                                ),
                              ],
                            ),
                          ),

                          Divider(
                            height: 1,
                            color: Colors.grey.shade200,
                          ),

                          SizedBox(
                            height: 15
                          ),

                          SizedBox(
                            height: 46,
                            child: ListView(
                              padding:
                              const EdgeInsets.symmetric(horizontal: 16),
                              scrollDirection: Axis.horizontal,
                              children: [
                                _filterChip(
                                  label: 'Restaurants',
                                  icon: Icons.restaurant_rounded,
                                  selected: true,
                                ),
                                _filterChip(
                                  label: 'Hotels',
                                  icon: Icons.hotel_rounded,
                                ),
                                _filterChip(
                                  label: 'Coffee',
                                  icon: Icons.coffee_rounded,
                                ),
                                _filterChip(
                                  label: 'Shopping',
                                  icon: Icons.shopping_bag_rounded,
                                ),
                              ],
                            ),
                          ),

                          SizedBox(
                              height: 15
                          ),

                          Expanded(
                            child: BusinessList(
                              businesses: items,
                              scrollController:
                              scrollController,
                              onBusinessTap: _openBooking,
                            ),
                          ),
                        ],
                      ),
                    );
                  },
                ),
              ),
            ],
          );
        },

        loading: () => const Scaffold(
          body: Center(
            child: CircularProgressIndicator(),
          ),
        ),

        error: (e, _) => Scaffold(
          body: Center(
            child: Text(e.toString()),
          ),
        ),
      ),
    );
  }

  // SEARCH BAR

  Widget _searchBar() {
    return ClipRRect(
      borderRadius: BorderRadius.circular(18),
      child: BackdropFilter(
        filter: ImageFilter.blur(
          sigmaX: 14,
          sigmaY: 14,
        ),
        child: Container(
          height: 54,
          padding:
          const EdgeInsets.symmetric(horizontal: 16),
          decoration: BoxDecoration(
            color: Colors.white.withOpacity(0.16),
            borderRadius: BorderRadius.circular(18),
            border: Border.all(
              color: Colors.white.withOpacity(0.12),
            ),
          ),
          child: const Row(
            children: [
              Icon(
                Icons.search_rounded,
                color: Colors.white,
              ),
              SizedBox(width: 10),
              Expanded(
                child: Text(
                  'Search places...',
                  style: TextStyle(
                    color: Colors.white,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // GLASS BUTTON

  Widget _glassButton({
    required IconData icon,
    required VoidCallback onTap,
  }) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(18),
      child: BackdropFilter(
        filter: ImageFilter.blur(
          sigmaX: 14,
          sigmaY: 14,
        ),
        child: Material(
          color: Colors.white.withOpacity(0.16),
          borderRadius: BorderRadius.circular(18),
          child: InkWell(
            onTap: onTap,
            borderRadius: BorderRadius.circular(18),
            child: Container(
              width: 54,
              height: 54,
              alignment: Alignment.center,
              child: Icon(
                icon,
                color: Colors.white,
              ),
            ),
          ),
        ),
      ),
    );
  }

  // FILTER CHIP

  Widget _filterChip({
    required String label,
    required IconData icon,
    bool selected = false,
  }) {
    return Container(
      margin: const EdgeInsets.only(right: 10),
      padding: const EdgeInsets.symmetric(
        horizontal: 16,
        vertical: 10,
      ),
      decoration: BoxDecoration(
        color:
        selected ? Colors.black : Colors.grey[100],
        borderRadius: BorderRadius.circular(14),
      ),
      child: Row(
        children: [
          Icon(
            icon,
            size: 18,
            color: selected
                ? Colors.white
                : Colors.black,
          ),
          const SizedBox(width: 8),
          Text(
            label,
            style: TextStyle(
              color: selected
                  ? Colors.white
                  : Colors.black,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }

  // FLOATING BUTTON

  Widget _floatingMapButton({
    required IconData icon,
    required VoidCallback onTap,
  }) {
    return Material(
      color: Colors.white,
      borderRadius: BorderRadius.circular(16),
      elevation: 4,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: SizedBox(
          width: 52,
          height: 52,
          child: Icon(icon),
        ),
      ),
    );
  }
}