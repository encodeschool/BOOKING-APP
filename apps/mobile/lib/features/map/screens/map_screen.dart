import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

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

  @override
  Widget build(BuildContext context) {
    final businesses = ref.watch(businessesProvider);

    return Scaffold(
      backgroundColor: Colors.black,
      body: businesses.when(
        data: (items) {
          return Stack(
            children: [
              // =========================
              // MAP
              // =========================
              Positioned.fill(
                child: MapWidget(
                  businesses: items,
                ),
              ),

              // =========================
              // TOP GRADIENT OVERLAY
              // =========================
              Positioned(
                top: 0,
                left: 0,
                right: 0,
                child: IgnorePointer(
                  child: Container(
                    height: 170,
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

              // =========================
              // TOP APP BAR
              // =========================
              SafeArea(
                child: Padding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 12,
                  ),
                  child: Row(
                    children: [
                      // _glassButton(
                      //   icon: Icons.menu_rounded,
                      //   onTap: () {},
                      // ),

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

              // =========================
              // FILTER CHIPS
              // =========================
              Positioned(
                top: 105,
                left: 0,
                right: 0,
                child: SizedBox(
                  height: 42,
                  child: ListView(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
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
                      _filterChip(
                        label: 'Parks',
                        icon: Icons.park_rounded,
                      ),
                    ],
                  ),
                ),
              ),

              // =========================
              // FLOATING ACTIONS
              // =========================
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

              // =========================
              // DRAGGABLE SHEET
              // =========================
              NotificationListener<DraggableScrollableNotification>(
                onNotification: (notification) {
                  final expanded = notification.extent > 0.75;

                  if (expanded != _isExpanded) {
                    setState(() {
                      _isExpanded = expanded;
                    });
                  }

                  return true;
                },
                child: DraggableScrollableSheet(
                  controller: _sheetController,
                  initialChildSize: 0.32,
                  minChildSize: 0.14,
                  maxChildSize: 0.94,
                  snap: true,
                  snapSizes: const [0.14, 0.32, 0.94],
                  builder: (context, scrollController) {
                    return AnimatedContainer(
                      duration: const Duration(milliseconds: 250),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: const BorderRadius.vertical(
                          top: Radius.circular(30),
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.18),
                            blurRadius: 24,
                            offset: const Offset(0, -6),
                          ),
                        ],
                      ),
                      child: Column(
                        children: [
                          // HANDLE
                          const SizedBox(height: 10),

                          Container(
                            width: 46,
                            height: 5,
                            decoration: BoxDecoration(
                              color: Colors.grey.shade300,
                              borderRadius: BorderRadius.circular(20),
                            ),
                          ),

                          // HEADER
                          Padding(
                            padding: const EdgeInsets.fromLTRB(
                              20,
                              18,
                              20,
                              12,
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
                                          fontWeight: FontWeight.w700,
                                        ),
                                      ),
                                      const SizedBox(height: 4),
                                      Text(
                                        '${items.length} results found',
                                        style: TextStyle(
                                          color: Colors.grey.shade600,
                                          fontSize: 14,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),

                                AnimatedContainer(
                                  duration:
                                  const Duration(milliseconds: 250),
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 14,
                                    vertical: 10,
                                  ),
                                  decoration: BoxDecoration(
                                    color: Colors.grey.shade100,
                                    borderRadius:
                                    BorderRadius.circular(14),
                                  ),
                                  child: Row(
                                    children: [
                                      Icon(
                                        _isExpanded
                                            ? Icons.map_rounded
                                            : Icons.list_rounded,
                                        size: 18,
                                      ),
                                      const SizedBox(width: 6),
                                      Text(
                                        _isExpanded
                                            ? 'Map'
                                            : 'List',
                                        style: const TextStyle(
                                          fontWeight: FontWeight.w600,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          ),

                          Divider(
                            height: 1,
                            color: Colors.grey.shade200,
                          ),

                          // LIST
                          Expanded(
                            child: ClipRRect(
                              borderRadius:
                              const BorderRadius.vertical(
                                top: Radius.circular(30),
                              ),
                              child: BusinessList(
                                businesses: items,
                                scrollController:
                                scrollController,
                              ),
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

        // =========================
        // LOADING
        // =========================
        loading: () => Scaffold(
          backgroundColor: Colors.white,
          body: Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                SizedBox(
                  width: 34,
                  height: 34,
                  child: CircularProgressIndicator(
                    strokeWidth: 3,
                    color: Theme.of(context).primaryColor,
                  ),
                ),
                const SizedBox(height: 18),
                Text(
                  'Loading places...',
                  style: TextStyle(
                    color: Colors.grey.shade700,
                    fontSize: 15,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
        ),

        // =========================
        // ERROR
        // =========================
        error: (e, _) => Scaffold(
          backgroundColor: Colors.white,
          body: Center(
            child: Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.location_off_rounded,
                    size: 72,
                    color: Colors.red.shade300,
                  ),
                  const SizedBox(height: 18),
                  const Text(
                    'Something went wrong',
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
                      color: Colors.grey.shade600,
                    ),
                  ),
                  const SizedBox(height: 24),
                  ElevatedButton(
                    onPressed: () {
                      ref.refresh(businessesProvider);
                    },
                    style: ElevatedButton.styleFrom(
                      elevation: 0,
                      padding: const EdgeInsets.symmetric(
                        horizontal: 24,
                        vertical: 14,
                      ),
                      shape: RoundedRectangleBorder(
                        borderRadius:
                        BorderRadius.circular(14),
                      ),
                    ),
                    child: const Text('Try Again'),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  // =====================================================
  // SEARCH BAR
  // =====================================================

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
          padding: const EdgeInsets.symmetric(horizontal: 16),
          decoration: BoxDecoration(
            color: Colors.white.withOpacity(0.18),
            borderRadius: BorderRadius.circular(18),
            border: Border.all(
              color: Colors.white.withOpacity(0.15),
            ),
          ),
          child: Row(
            children: [
              const Icon(
                Icons.search_rounded,
                color: Colors.white,
              ),
              const SizedBox(width: 10),
              const Expanded(
                child: Text(
                  'Search places...',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 15,
                  ),
                ),
              ),
              Container(
                width: 1,
                height: 18,
                color: Colors.white24,
              ),
              const SizedBox(width: 10),
              const Icon(
                Icons.mic_none_rounded,
                color: Colors.white,
              ),
            ],
          ),
        ),
      ),
    );
  }

  // =====================================================
  // GLASS BUTTON
  // =====================================================

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
          color: Colors.white.withOpacity(0.18),
          borderRadius: BorderRadius.circular(18),
          child: InkWell(
            borderRadius: BorderRadius.circular(18),
            onTap: onTap,
            child: Container(
              width: 54,
              height: 54,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(18),
                border: Border.all(
                  color: Colors.white.withOpacity(0.15),
                ),
              ),
              child: const Icon(
                Icons.menu_rounded,
                color: Colors.white,
              ),
            ),
          ),
        ),
      ),
    );
  }

  // =====================================================
  // FILTER CHIP
  // =====================================================

  Widget _filterChip({
    required String label,
    required IconData icon,
    bool selected = false,
  }) {
    return Container(
      margin: const EdgeInsets.only(right: 10),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 250),
        padding: const EdgeInsets.symmetric(
          horizontal: 16,
          vertical: 10,
        ),
        decoration: BoxDecoration(
          color: selected
              ? Colors.black
              : Colors.white,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(
            color: selected
                ? Colors.black
                : Colors.grey.shade300,
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 10,
              offset: const Offset(0, 3),
            ),
          ],
        ),
        child: Row(
          children: [
            Icon(
              icon,
              size: 18,
              color: selected
                  ? Colors.white
                  : Colors.black87,
            ),
            const SizedBox(width: 8),
            Text(
              label,
              style: TextStyle(
                fontWeight: FontWeight.w600,
                color: selected
                    ? Colors.white
                    : Colors.black87,
              ),
            ),
          ],
        ),
      ),
    );
  }

  // =====================================================
  // FLOATING BUTTON
  // =====================================================

  Widget _floatingMapButton({
    required IconData icon,
    required VoidCallback onTap,
  }) {
    return Material(
      color: Colors.white,
      elevation: 4,
      shadowColor: Colors.black12,
      borderRadius: BorderRadius.circular(16),
      child: InkWell(
        borderRadius: BorderRadius.circular(16),
        onTap: onTap,
        child: Container(
          width: 52,
          height: 52,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(16),
          ),
          child: Icon(
            icon,
            color: Colors.black87,
          ),
        ),
      ),
    );
  }
}