import 'dart:ui';

import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:geolocator/geolocator.dart';
import 'package:latlong2/latlong.dart';
import 'package:permission_handler/permission_handler.dart';

import '../../../core/api/api_client.dart';
import '../../../core/storage/auth_storage.dart';
import '../../../core/widgets/app_state_view.dart';
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
  final TextEditingController _searchController = TextEditingController();
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();
  final AuthStorage _authStorage = AuthStorage();

  bool _isExpanded = false;
  bool _isOffline = false;
  bool _isLocationLoading = false;
  bool _isAppointmentsLoading = false;
  String _searchText = '';
  String _selectedFilter = 'All';
  String _appointmentsFilter = 'upcoming';
  List<dynamic> _appointments = [];
  LatLng? _userLocation;
  final List<String> _filters = [
    'All',
    'Restaurants',
    'Hotels',
    'Coffee',
    'Shopping',
  ];

  @override
  void initState() {
    super.initState();
    _checkConnectivity();
    _loadAppointments();
    Connectivity().onConnectivityChanged.listen((results) {
      if (!mounted) return;
      setState(() {
        _isOffline = results.contains(ConnectivityResult.none);
      });
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _checkConnectivity() async {
    final result = await Connectivity().checkConnectivity();
    if (!mounted) return;
    setState(() {
      _isOffline = result.contains(ConnectivityResult.none);
    });
  }

  Future<void> _loadAppointments() async {
    if (!mounted) return;
    setState(() => _isAppointmentsLoading = true);
    try {
      final token = await _authStorage.getToken();
      if (token == null || token.isEmpty) {
        if (!mounted) return;
        setState(() => _appointments = []);
        return;
      }

      final appointments = await apiClient.getMyBookings(token);
      if (!mounted) return;
      setState(() => _appointments = appointments);
    } catch (_) {
      if (!mounted) return;
      setState(() => _appointments = []);
    } finally {
      if (mounted) setState(() => _isAppointmentsLoading = false);
    }
  }

  Future<void> _requestLocation() async {
    if (!mounted) return;

    setState(() {
      _isLocationLoading = true;
    });

    final status = await Permission.location.request();
    if (status != PermissionStatus.granted) {
      if (!mounted) return;
      setState(() => _isLocationLoading = false);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text(
            'Location access is required to center the map on your position.',
          ),
        ),
      );
      return;
    }

    final position = await Geolocator.getCurrentPosition(
      locationSettings: const LocationSettings(accuracy: LocationAccuracy.high),
    );

    if (!mounted) return;

    setState(() {
      _userLocation = LatLng(position.latitude, position.longitude);
      _isLocationLoading = false;
    });
  }

  List<BusinessModel> _filteredBusinesses(List<BusinessModel> items) {
    final query = _searchText.trim().toLowerCase();

    return items.where((business) {
      final title = business.name.toLowerCase();
      final address = (business.address ?? '').toLowerCase();
      final category = business.category.toLowerCase();

      final matchesQuery =
          query.isEmpty || title.contains(query) || address.contains(query);

      final matchesFilter =
          _selectedFilter == 'All' || category == _selectedFilter.toLowerCase();

      return matchesQuery && matchesFilter;
    }).toList();
  }

  void _openBooking(BusinessModel business) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => BookingSheet(business: business),
    );
  }

  void _showAppointmentsSheet() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => StatefulBuilder(
        builder: (context, setBottomSheetState) {
          final appointments = _appointments.where((item) {
            final status = item['status']?.toString() ?? '';
            final bookingDate = DateTime.tryParse(
              item['bookingDate']?.toString() ?? '',
            );
            final bookingTime = item['startTime']?.toString() ?? '';
            final combined = bookingDate != null
                ? DateTime.tryParse(
                    '${bookingDate.toIso8601String().split('T').first}T$bookingTime',
                  )
                : null;
            final isUpcoming =
                combined == null || combined.isAfter(DateTime.now());
            if (_appointmentsFilter == 'upcoming')
              return isUpcoming && status != 'CANCELLED';
            if (_appointmentsFilter == 'archived')
              return !isUpcoming || status == 'CANCELLED';
            return true;
          }).toList();

          return Container(
            height: MediaQuery.of(context).size.height * 0.7,
            decoration: const BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.start,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Padding(
                  padding: const EdgeInsets.fromLTRB(20, 20, 20, 0),
                  child: const Text(
                    'Your appointments',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.fromLTRB(20, 20, 20, 0),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.start,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      SegmentedButton<String>(
                        segments: const [
                          ButtonSegment(
                            value: 'upcoming',
                            label: Text('Upcoming'),
                          ),
                          ButtonSegment(
                            value: 'archived',
                            label: Text('Archived'),
                          ),
                        ],
                        selected: {_appointmentsFilter},
                        onSelectionChanged: (selection) {
                          setBottomSheetState(
                            () => _appointmentsFilter = selection.first,
                          );
                        },
                      ),
                    ],
                  ),
                ),
                if (_isAppointmentsLoading)
                  const Padding(
                    padding: EdgeInsets.all(24),
                    child: CircularProgressIndicator(),
                  )
                else if (appointments.isEmpty)
                  const Padding(
                    padding: EdgeInsets.all(24),
                    child: Text('No appointments yet.'),
                  )
                else
                  Expanded(
                    child: ListView.separated(
                      padding: const EdgeInsets.fromLTRB(20, 8, 20, 24),
                      itemCount: appointments.length,
                      separatorBuilder: (_, _) => const SizedBox(height: 12),
                      itemBuilder: (_, index) {
                        final appointment = appointments[index];
                        return Container(
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: const Color(0xFFF8FAFC),
                            borderRadius: BorderRadius.circular(18),
                          ),
                          child: Row(
                            children: [
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      appointment['service']?['name']
                                              ?.toString() ??
                                          'Service',
                                      style: const TextStyle(
                                        fontWeight: FontWeight.w700,
                                      ),
                                    ),
                                    const SizedBox(height: 4),
                                    Text(
                                      appointment['business']?['name']
                                              ?.toString() ??
                                          'Business',
                                      style: const TextStyle(
                                        color: Colors.grey,
                                      ),
                                    ),
                                    const SizedBox(height: 8),
                                    Text(
                                      '${appointment['bookingDate']} • ${appointment['startTime']} • ${appointment['status']}',
                                    ),
                                  ],
                                ),
                              ),
                              TextButton(
                                onPressed: () async {
                                  final token = await _authStorage.getToken();
                                  if (token == null || token.isEmpty) {
                                    if (context.mounted) {
                                      ScaffoldMessenger.of(
                                        context,
                                      ).showSnackBar(
                                        const SnackBar(
                                          content: Text(
                                            'Please sign in to cancel an appointment.',
                                          ),
                                        ),
                                      );
                                    }
                                    return;
                                  }

                                  await apiClient.cancelBooking(
                                    appointment['id'],
                                    token,
                                  );
                                  await _loadAppointments();
                                  if (context.mounted) Navigator.pop(context);
                                },
                                child: const Text('Cancel'),
                              ),
                            ],
                          ),
                        );
                      },
                    ),
                  ),
              ],
            ),
          );
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final businesses = ref.watch(businessesProvider);

    return Scaffold(
      key: _scaffoldKey,
      drawer: Drawer(
        child: ListView(
          padding: const EdgeInsets.all(20),
          children: [
            const SizedBox(height: 24),
            Row(
              children: [
                CircleAvatar(
                  radius: 24,
                  backgroundColor: Theme.of(
                    context,
                  ).colorScheme.primaryContainer,
                  child: const Icon(Icons.person_rounded),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Welcome back',
                        style: Theme.of(context).textTheme.titleMedium,
                      ),
                      Text(
                        'Explore nearby places',
                        style: Theme.of(context).textTheme.bodySmall,
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 24),
            ListTile(
              leading: const Icon(Icons.home_rounded),
              title: const Text('Home'),
              onTap: () => Navigator.pop(context),
            ),
            ListTile(
              leading: const Icon(Icons.calendar_today_rounded),
              title: const Text('Appointments'),
              onTap: () {
                Navigator.pop(context);
                _showAppointmentsSheet();
              },
            ),
            ListTile(
              leading: const Icon(Icons.notifications_rounded),
              title: const Text('Notifications'),
              onTap: () => Navigator.pop(context),
            ),
            ListTile(
              leading: const Icon(Icons.settings_rounded),
              title: const Text('Settings'),
              onTap: () => Navigator.pop(context),
            ),
          ],
        ),
      ),
      backgroundColor: Colors.black,
      body: businesses.when(
        data: (items) {
          final filteredItems = _filteredBusinesses(items);

          if (_isOffline) {
            return Scaffold(
              backgroundColor: const Color(0xFFF8FAFC),
              body: AppStateView(
                icon: Icons.wifi_off_rounded,
                title: 'You are offline',
                description:
                    'Reconnect to the internet to load fresh places and continue exploring.',
                actionLabel: 'Retry',
                onAction: () async {
                  await _checkConnectivity();
                  if (!_isOffline) {
                    ref.invalidate(businessesProvider);
                  }
                },
              ),
            );
          }

          if (items.isEmpty) {
            return Scaffold(
              backgroundColor: const Color(0xFFF8FAFC),
              body: AppStateView(
                icon: Icons.explore_off_rounded,
                title: 'No places yet',
                description:
                    'We could not find any businesses nearby right now. Try again later.',
                actionLabel: 'Refresh',
                onAction: () => ref.invalidate(businessesProvider),
              ),
            );
          }

          return Stack(
            children: [
              Positioned.fill(
                child: MapWidget(
                  businesses: filteredItems,
                  userLocation: _userLocation,
                  onLocate: _requestLocation,
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
                          Colors.black.withValues(alpha: 0.45),
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
                  padding: const EdgeInsets.fromLTRB(12, 12, 12, 0),
                  child: Row(
                    children: [
                      _glassButton(
                        icon: Icons.menu_rounded,
                        onTap: () => _scaffoldKey.currentState?.openDrawer(),
                      ),

                      const SizedBox(width: 12),

                      Expanded(child: _searchBar()),

                      const SizedBox(width: 12),

                      _glassButton(
                        icon: _isLocationLoading
                            ? Icons.hourglass_top_rounded
                            : Icons.my_location_rounded,
                        onTap: _requestLocation,
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
                      onTap: () => ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Map layers coming soon')),
                      ),
                    ),
                    const SizedBox(height: 12),
                    _floatingMapButton(
                      icon: Icons.tune_rounded,
                      onTap: () => ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text(
                            'Filters are ready — tap a category chip below',
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),

              // SHEET
              NotificationListener<DraggableScrollableNotification>(
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
                  snapSizes: const [0.14, 0.30, 0.94],
                  builder: (context, scrollController) {
                    return Container(
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: const BorderRadius.vertical(
                          top: Radius.circular(30),
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withValues(alpha: 0.15),
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
                              borderRadius: BorderRadius.circular(30),
                            ),
                          ),

                          Padding(
                            padding: const EdgeInsets.fromLTRB(20, 18, 20, 14),
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
                                              fontWeight: FontWeight.w800,
                                            ),
                                      ),
                                      const SizedBox(height: 4),
                                      Text(
                                        '${filteredItems.length} places found',
                                        style: TextStyle(
                                          color: Colors.grey.shade600,
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

                          Divider(height: 1, color: Colors.grey.shade200),

                          SizedBox(height: 15),

                          SizedBox(
                            height: 46,
                            child: ListView(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 16,
                              ),
                              scrollDirection: Axis.horizontal,
                              children: _filters.map((filter) {
                                final isSelected = _selectedFilter == filter;
                                final icon = switch (filter) {
                                  'Restaurants' => Icons.restaurant_rounded,
                                  'Hotels' => Icons.hotel_rounded,
                                  'Coffee' => Icons.coffee_rounded,
                                  'Shopping' => Icons.shopping_bag_rounded,
                                  _ => Icons.explore_rounded,
                                };

                                return GestureDetector(
                                  onTap: () =>
                                      setState(() => _selectedFilter = filter),
                                  child: _filterChip(
                                    label: filter,
                                    icon: icon,
                                    selected: isSelected,
                                  ),
                                );
                              }).toList(),
                            ),
                          ),

                          SizedBox(height: 15),

                          Expanded(
                            child: RefreshIndicator(
                              color: Theme.of(context).colorScheme.primary,
                              onRefresh: () async {
                                ref.invalidate(businessesProvider);
                                await Future.delayed(
                                  const Duration(milliseconds: 800),
                                );
                              },
                              child: BusinessList(
                                businesses: filteredItems,
                                scrollController: scrollController,
                                onBusinessTap: _openBooking,
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

        loading: () => const Scaffold(
          backgroundColor: Color(0xFFF8FAFC),
          body: AppStateView(
            isLoading: true,
            icon: Icons.hourglass_top_rounded,
            title: 'Loading your area',
            description: 'We are preparing the latest nearby places for you.',
          ),
        ),

        error: (e, _) => Scaffold(
          backgroundColor: const Color(0xFFF8FAFC),
          body: AppStateView(
            icon: Icons.wifi_off_rounded,
            title: 'Connection issue',
            description:
                'We could not load the places. Check your connection and try again.',
            actionLabel: 'Retry',
            onAction: () => ref.invalidate(businessesProvider),
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
        filter: ImageFilter.blur(sigmaX: 14, sigmaY: 14),
        child: Container(
          height: 54,
          padding: const EdgeInsets.symmetric(horizontal: 16),
          decoration: BoxDecoration(
            color: Colors.white.withValues(alpha: 0.16),
            borderRadius: BorderRadius.circular(18),
            border: Border.all(color: Colors.white.withValues(alpha: 0.12)),
          ),
          child: Row(
            children: [
              const Icon(Icons.search_rounded, color: Colors.white),
              const SizedBox(width: 10),
              Expanded(
                child: TextField(
                  controller: _searchController,
                  style: const TextStyle(color: Colors.white),
                  cursorColor: Colors.white,
                  decoration: const InputDecoration(
                    hintText: 'Search places...',
                    hintStyle: TextStyle(color: Colors.white70),
                    border: InputBorder.none,
                    isDense: true,
                    contentPadding: EdgeInsets.zero,
                  ),
                  onChanged: (value) => setState(() => _searchText = value),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // GLASS BUTTON

  Widget _glassButton({required IconData icon, required VoidCallback onTap}) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(18),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 14, sigmaY: 14),
        child: Material(
          color: Colors.white.withValues(alpha: 0.16),
          borderRadius: BorderRadius.circular(18),
          child: InkWell(
            onTap: onTap,
            borderRadius: BorderRadius.circular(18),
            child: Container(
              width: 54,
              height: 54,
              alignment: Alignment.center,
              child: Icon(icon, color: Colors.white),
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
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
      decoration: BoxDecoration(
        color: selected ? Colors.black : Colors.grey[100],
        borderRadius: BorderRadius.circular(14),
      ),
      child: Row(
        children: [
          Icon(icon, size: 18, color: selected ? Colors.white : Colors.black),
          const SizedBox(width: 8),
          Text(
            label,
            style: TextStyle(
              color: selected ? Colors.white : Colors.black,
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
        child: SizedBox(width: 52, height: 52, child: Icon(icon)),
      ),
    );
  }
}
