import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../models/booking.dart';
import '../models/dashboard_metrics.dart';
import '../services/api_service.dart';
import '../widgets/bottom_nav.dart';
import '../widgets/business_name.dart';

class DashboardPage extends StatefulWidget {
  const DashboardPage({Key? key}) : super(key: key);

  @override
  State<DashboardPage> createState() => _DashboardPageState();
}

class _DashboardPageState extends State<DashboardPage> {
  int _index = 0;
  List<Booking> _bookings = [];
  bool _loading = true;
  String? _businessName;
  DashboardMetrics? _metrics;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    if (mounted) {
      setState(() => _loading = true);
    }

    try {
      final api = Provider.of<ApiService>(context, listen: false);

      final name = await api.getSelectedBusinessName();
      final list = await api.getBookings();

      final businessId = await api.getSelectedBusinessId();

      DashboardMetrics? metrics;

      if (businessId != null) {
        final raw = await api.getDashboardMetrics(businessId);

        if (raw != null) {
          metrics = DashboardMetrics.fromJson(raw);
        }
      }

      if (!mounted) return;

      setState(() {
        _bookings = list;
        _businessName = name;
        _metrics = metrics;
        _loading = false;
      });
    } catch (e) {
      if (!mounted) return;

      setState(() => _loading = false);

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          behavior: SnackBarBehavior.floating,
          content: Text(
            'Failed to load dashboard: $e',
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
          ),
        ),
      );
    }
  }

  void _onTapNav(int i) {
    _index = i;

    if (i == 1) {
      Navigator.pushNamed(context, '/calendar');
      return;
    }

    if (i == 2) {
      Navigator.pushNamed(context, '/profile');
      return;
    }
  }

  String _normalizedStatus(String status) {
    final value = status.trim().toLowerCase();

    if ([
      'accepted',
      'approve',
      'approved',
      'confirmed',
      'confirmation',
    ].contains(value)) {
      return 'accepted';
    }

    if ([
      'cancelled',
      'canceled',
      'cancel',
    ].contains(value)) {
      return 'cancelled';
    }

    if ([
      'pending',
      'waiting',
      'requested',
    ].contains(value)) {
      return 'pending';
    }

    if ([
      'completed',
      'complete',
    ].contains(value)) {
      return 'completed';
    }

    return value;
  }

  Color _statusColor(String status, ColorScheme scheme) {
    switch (_normalizedStatus(status)) {
      case 'accepted':
        return Colors.green;
      case 'pending':
        return Colors.orange;
      case 'cancelled':
        return Colors.red;
      case 'completed':
        return Colors.blue;
      default:
        return scheme.primary;
    }
  }

  IconData _statusIcon(String status) {
    switch (_normalizedStatus(status)) {
      case 'accepted':
        return Icons.check_circle_rounded;
      case 'pending':
        return Icons.schedule_rounded;
      case 'cancelled':
        return Icons.cancel_rounded;
      case 'completed':
        return Icons.task_alt_rounded;
      default:
        return Icons.info_rounded;
    }
  }

  String _statusLabel(String status) {
    switch (_normalizedStatus(status)) {
      case 'accepted':
        return 'CONFIRMED';
      case 'pending':
        return 'PENDING';
      case 'cancelled':
        return 'CANCELLED';
      case 'completed':
        return 'COMPLETED';
      default:
        return status.toUpperCase();
    }
  }

  String _formatDate(DateTime date) {
    final day = date.day.toString().padLeft(2, '0');
    final month = date.month.toString().padLeft(2, '0');
    final year = date.year.toString();

    return '$day.$month.$year';
  }

  String _formatTime(DateTime date) {
    final hour = date.hour.toString().padLeft(2, '0');
    final minute = date.minute.toString().padLeft(2, '0');

    return '$hour:$minute';
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final scheme = theme.colorScheme;

    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      appBar: AppBar(
        elevation: 0,
        scrolledUnderElevation: 0,
        backgroundColor: theme.scaffoldBackgroundColor,
        surfaceTintColor: Colors.transparent,
        automaticallyImplyLeading: false,
        toolbarHeight: 76,
        titleSpacing: 20,
        title: Row(
          children: [
            Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                color: scheme.primary.withOpacity(0.10),
                borderRadius: BorderRadius.circular(14),
              ),
              child: Icon(
                Icons.dashboard_rounded,
                color: scheme.primary,
                size: 23,
              ),
            ),
            const SizedBox(width: 12),
            const Expanded(
              child: Text(
                'Dashboard',
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: TextStyle(
                  fontSize: 23,
                  fontWeight: FontWeight.w800,
                  letterSpacing: -0.5,
                ),
              ),
            ),
          ],
        ),
        actions: [
          Container(
            constraints: const BoxConstraints(
              maxWidth: 180,
            ),
            margin: const EdgeInsets.only(
              right: 16,
              top: 15,
              bottom: 15,
            ),
            padding: const EdgeInsets.symmetric(
              horizontal: 12,
            ),
            decoration: BoxDecoration(
              color: theme.cardColor,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(
                color: theme.dividerColor.withOpacity(0.6),
              ),
            ),
            alignment: Alignment.center,
            child: BusinessNameDisplay(),
          ),
        ],
      ),
      body: _loading
          ? Center(
        child: CircularProgressIndicator(
          strokeWidth: 2.5,
          color: scheme.primary,
        ),
      )
          : RefreshIndicator(
        onRefresh: _load,
        color: scheme.primary,
        child: LayoutBuilder(
          builder: (context, constraints) {
            final isWide = constraints.maxWidth >= 850;

            return SingleChildScrollView(
              physics: const AlwaysScrollableScrollPhysics(
                parent: BouncingScrollPhysics(),
              ),
              padding: EdgeInsets.fromLTRB(
                isWide ? 28 : 16,
                4,
                isWide ? 28 : 16,
                28,
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildWelcomeCard(
                    context,
                    isWide: isWide,
                  ),
                  const SizedBox(height: 20),
                  _buildSectionHeader(
                    context,
                    title: 'Overview',
                    subtitle: 'Your business at a glance',
                  ),
                  const SizedBox(height: 12),
                  _buildStats(
                    context,
                    isWide: isWide,
                  ),
                  const SizedBox(height: 26),
                  _buildSectionHeader(
                    context,
                    title: 'Recent bookings',
                    subtitle: _bookings.isEmpty
                        ? 'No appointments yet'
                        : '${_bookings.length} appointment${_bookings.length == 1 ? '' : 's'}',
                  ),
                  const SizedBox(height: 12),
                  _bookings.isEmpty
                      ? _buildEmptyState(context)
                      : _buildBookings(
                    context,
                    isWide: isWide,
                  ),
                ],
              ),
            );
          },
        ),
      ),
      bottomNavigationBar: StaffBottomNav(
        currentIndex: _index,
        onTap: _onTapNav,
      ),
    );
  }

  Widget _buildWelcomeCard(
      BuildContext context, {
        required bool isWide,
      }) {
    final theme = Theme.of(context);
    final scheme = theme.colorScheme;

    return Container(
      width: double.infinity,
      padding: EdgeInsets.all(isWide ? 26 : 22),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            scheme.primary,
            Color.lerp(
              scheme.primary,
              scheme.secondary,
              0.55,
            ) ??
                scheme.primary,
          ],
        ),
        borderRadius: BorderRadius.circular(26),
        boxShadow: [
          BoxShadow(
            color: scheme.primary.withOpacity(0.20),
            blurRadius: 28,
            offset: const Offset(0, 12),
          ),
        ],
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Good day 👋',
                  style: TextStyle(
                    color: Colors.white.withOpacity(0.82),
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 7),
                Text(
                  _businessName?.isNotEmpty == true
                      ? _businessName!
                      : 'Welcome back',
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 24,
                    height: 1.15,
                    fontWeight: FontWeight.w800,
                    letterSpacing: -0.4,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Here is what is happening with your business today.',
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                    color: Colors.white.withOpacity(0.78),
                    fontSize: 13,
                    height: 1.4,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 18),
          Container(
            width: isWide ? 82 : 66,
            height: isWide ? 82 : 66,
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.14),
              borderRadius: BorderRadius.circular(24),
              border: Border.all(
                color: Colors.white.withOpacity(0.18),
              ),
            ),
            child: const Icon(
              Icons.auto_awesome_rounded,
              color: Colors.white,
              size: 34,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionHeader(
      BuildContext context, {
        required String title,
        required String subtitle,
      }) {
    final theme = Theme.of(context);

    return Row(
      children: [
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: theme.textTheme.titleLarge?.copyWith(
                  fontWeight: FontWeight.w800,
                  letterSpacing: -0.3,
                ),
              ),
              const SizedBox(height: 2),
              Text(
                subtitle,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: theme.textTheme.bodySmall?.copyWith(
                  color: theme.textTheme.bodySmall?.color?.withOpacity(0.55),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildStats(
      BuildContext context, {
        required bool isWide,
      }) {
    final metrics = _metrics;

    if (metrics == null) {
      return _buildStatsUnavailable(context);
    }

    final cards = [
      _StatData(
        title: 'Bookings',
        value: metrics.bookings.toString(),
        icon: Icons.calendar_month_rounded,
        color: Colors.blue,
      ),
      _StatData(
        title: 'Pending',
        value: metrics.pending.toString(),
        icon: Icons.schedule_rounded,
        color: Colors.orange,
      ),
      _StatData(
        title: 'Completed',
        value: metrics.completed.toString(),
        icon: Icons.check_circle_rounded,
        color: Colors.green,
      ),
      _StatData(
        title: 'Revenue',
        value: '\$${metrics.revenue.toStringAsFixed(2)}',
        icon: Icons.payments_rounded,
        color: Colors.purple,
      ),
    ];

    if (!isWide) {
      return GridView.builder(
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        itemCount: cards.length,
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
          mainAxisSpacing: 12,
          crossAxisSpacing: 12,
          childAspectRatio: 1.55,
        ),
        itemBuilder: (context, index) {
          return _buildStatCard(
            context,
            cards[index],
          );
        },
      );
    }

    return Row(
      children: List.generate(
        cards.length,
            (index) => Expanded(
          child: Padding(
            padding: EdgeInsets.only(
              right: index == cards.length - 1 ? 0 : 12,
            ),
            child: _buildStatCard(
              context,
              cards[index],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildStatsUnavailable(BuildContext context) {
    final theme = Theme.of(context);

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: theme.cardColor,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: theme.dividerColor.withOpacity(0.55),
        ),
      ),
      child: Row(
        children: [
          Icon(
            Icons.analytics_outlined,
            color: theme.colorScheme.primary,
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              'Dashboard statistics are currently unavailable.',
              style: theme.textTheme.bodyMedium?.copyWith(
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatCard(
      BuildContext context,
      _StatData data,
      ) {
    final theme = Theme.of(context);

    return Container(
      constraints: const BoxConstraints(
        minHeight: 128,
      ),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: theme.cardColor,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: theme.dividerColor.withOpacity(0.55),
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.035),
            blurRadius: 18,
            offset: const Offset(0, 7),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: data.color.withOpacity(0.10),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(
                  data.icon,
                  color: data.color,
                  size: 20,
                ),
              ),
              const Spacer(),
              Icon(
                Icons.trending_up_rounded,
                size: 18,
                color: data.color.withOpacity(0.65),
              ),
            ],
          ),
          const Spacer(),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                data.title,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: theme.textTheme.bodySmall?.copyWith(
                  color: theme.textTheme.bodySmall?.color?.withOpacity(0.58),
                  fontWeight: FontWeight.w600,
                ),
              ),
              const SizedBox(height: 3),
              FittedBox(
                fit: BoxFit.scaleDown,
                alignment: Alignment.centerLeft,
                child: Text(
                  data.value,
                  style: theme.textTheme.titleLarge?.copyWith(
                    fontSize: 21,
                    fontWeight: FontWeight.w800,
                    letterSpacing: -0.5,
                  ),
                ),
              ),
            ],
          )
        ],
      ),
    );
  }

  Widget _buildBookings(
      BuildContext context, {
        required bool isWide,
      }) {
    if (isWide) {
      return GridView.builder(
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        itemCount: _bookings.length,
        gridDelegate: const SliverGridDelegateWithMaxCrossAxisExtent(
          maxCrossAxisExtent: 520,
          mainAxisSpacing: 12,
          crossAxisSpacing: 12,
          mainAxisExtent: 165,
        ),
        itemBuilder: (context, index) {
          return _buildBookingCard(
            context,
            _bookings[index],
          );
        },
      );
    }

    return Column(
      children: List.generate(
        _bookings.length,
            (index) => Padding(
          padding: EdgeInsets.only(
            bottom: index == _bookings.length - 1 ? 0 : 12,
          ),
          child: _buildBookingCard(
            context,
            _bookings[index],
          ),
        ),
      ),
    );
  }

  Widget _buildBookingCard(
      BuildContext context,
      Booking booking,
      ) {
    final theme = Theme.of(context);
    final scheme = theme.colorScheme;
    final statusColor = _statusColor(
      booking.status,
      scheme,
    );

    final statusLabel = _statusLabel(booking.status);

    return Material(
      color: Colors.transparent,
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: theme.cardColor,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: theme.dividerColor.withOpacity(0.55),
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.035),
              blurRadius: 18,
              offset: const Offset(0, 7),
            ),
          ],
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                color: statusColor.withOpacity(0.10),
                borderRadius: BorderRadius.circular(15),
              ),
              child: Icon(
                _statusIcon(booking.status),
                color: statusColor,
                size: 23,
              ),
            ),
            const SizedBox(width: 13),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Expanded(
                        child: Text(
                          booking.customerName.isNotEmpty
                              ? booking.customerName
                              : 'Guest',
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: theme.textTheme.titleMedium?.copyWith(
                            fontWeight: FontWeight.w700,
                            letterSpacing: -0.15,
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      _buildStatusPill(
                        context,
                        statusLabel,
                        statusColor,
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      Icon(
                        Icons.schedule_rounded,
                        size: 16,
                        color: theme.iconTheme.color?.withOpacity(0.52),
                      ),
                      const SizedBox(width: 6),
                      Expanded(
                        child: Text(
                          '${_formatDate(booking.start)}  •  '
                              '${_formatTime(booking.start)} - '
                              '${_formatTime(booking.end)}',
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: theme.textTheme.bodySmall?.copyWith(
                            fontWeight: FontWeight.w600,
                            color: theme.textTheme.bodySmall?.color
                                ?.withOpacity(0.65),
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 7),
                  Row(
                    children: [
                      Icon(
                        Icons.room_service_outlined,
                        size: 16,
                        color: theme.iconTheme.color?.withOpacity(0.52),
                      ),
                      const SizedBox(width: 6),
                      Expanded(
                        child: Text(
                          booking.serviceName ?? 'Service',
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: theme.textTheme.bodySmall?.copyWith(
                            color: theme.textTheme.bodySmall?.color
                                ?.withOpacity(0.58),
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatusPill(
      BuildContext context,
      String label,
      Color color,
      ) {
    return Container(
      constraints: const BoxConstraints(
        maxWidth: 110,
      ),
      padding: const EdgeInsets.symmetric(
        horizontal: 9,
        vertical: 5,
      ),
      decoration: BoxDecoration(
        color: color.withOpacity(0.10),
        borderRadius: BorderRadius.circular(999),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 6,
            height: 6,
            decoration: BoxDecoration(
              color: color,
              shape: BoxShape.circle,
            ),
          ),
          const SizedBox(width: 6),
          Flexible(
            child: Text(
              label,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: TextStyle(
                color: color,
                fontSize: 9.5,
                fontWeight: FontWeight.w800,
                letterSpacing: 0.25,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildEmptyState(BuildContext context) {
    final theme = Theme.of(context);
    final scheme = theme.colorScheme;

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(
        horizontal: 24,
        vertical: 42,
      ),
      decoration: BoxDecoration(
        color: theme.cardColor,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(
          color: theme.dividerColor.withOpacity(0.55),
        ),
      ),
      child: Column(
        children: [
          Container(
            width: 78,
            height: 78,
            decoration: BoxDecoration(
              color: scheme.primary.withOpacity(0.09),
              shape: BoxShape.circle,
            ),
            child: Icon(
              Icons.calendar_month_rounded,
              size: 36,
              color: scheme.primary,
            ),
          ),
          const SizedBox(height: 18),
          Text(
            'No bookings yet',
            style: theme.textTheme.titleLarge?.copyWith(
              fontWeight: FontWeight.w800,
            ),
          ),
          const SizedBox(height: 7),
          ConstrainedBox(
            constraints: const BoxConstraints(
              maxWidth: 430,
            ),
            child: Text(
              'New appointment requests from your customers will appear here.',
              textAlign: TextAlign.center,
              style: theme.textTheme.bodyMedium?.copyWith(
                height: 1.45,
                color: theme.textTheme.bodyMedium?.color?.withOpacity(0.58),
              ),
            ),
          ),
          const SizedBox(height: 20),
          OutlinedButton.icon(
            onPressed: _load,
            icon: const Icon(
              Icons.refresh_rounded,
              size: 18,
            ),
            label: const Text('Refresh'),
            style: OutlinedButton.styleFrom(
              padding: const EdgeInsets.symmetric(
                horizontal: 18,
                vertical: 12,
              ),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(14),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _StatData {
  final String title;
  final String value;
  final IconData icon;
  final Color color;

  const _StatData({
    required this.title,
    required this.value,
    required this.icon,
    required this.color,
  });
}
