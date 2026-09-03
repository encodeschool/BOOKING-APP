import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../models/booking.dart';
import '../services/api_service.dart';
import '../widgets/business_name.dart';

class CalendarPage extends StatefulWidget {
  const CalendarPage({Key? key}) : super(key: key);
  @override
  State<CalendarPage> createState() => _CalendarPageState();
}

class _CalendarPageState extends State<CalendarPage> {
  DateTime _focused = DateTime.now();
  List<Booking> _dayEvents = [];
  bool _loading = true;
  final ScrollController _scrollController = ScrollController();
  static const double _hourHeight = 90.0;
  static const double _timeColumnWidth = 72.0;
  @override
  void initState() {
    super.initState();
    _focused = DateTime(
      _focused.year,
      _focused.month,
      _focused.day,
    );
    _loadEvents();
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  Future<void> _loadEvents() async {
    if (!mounted) return;
    setState(() {
      _loading = true;
    });
    try {
      final api = Provider.of<ApiService>(
        context,
        listen: false,
      );
      final from = DateTime(
        _focused.year,
        _focused.month,
        _focused.day,
      );
      final to = from.add(
        const Duration(days: 1),
      );
      final bookings = await api.getCalendarEvents(
        from,
        to,
      );
      final dayEvents = bookings.where((b) {
        return b.start.year == _focused.year &&
            b.start.month == _focused.month &&
            b.start.day == _focused.day;
      }).toList();
      dayEvents.sort(
        (a, b) => a.start.compareTo(b.start),
      );
      if (!mounted) return;
      setState(() {
        _dayEvents = dayEvents;
        _loading = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _dayEvents = [];
        _loading = false;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            'Failed to load calendar: $e',
          ),
        ),
      );
    }
  }

  void _changeDay(int amount) {
    setState(() {
      _focused = _focused.add(
        Duration(days: amount),
      );
    });
    _loadEvents();
  }

  Future<void> _selectDate() async {
    final selected = await showDatePicker(
      context: context,
      initialDate: _focused,
      firstDate: DateTime(2020),
      lastDate: DateTime(2035),
      initialDatePickerMode: DatePickerMode.day,
    );
    if (selected == null) return;
    setState(() {
      _focused = DateTime(
        selected.year,
        selected.month,
        selected.day,
      );
    });
    await _loadEvents();
  }

  Future<void> _selectMonthYear() async {
    final result = await showDialog<DateTime>(
      context: context,
      builder: (context) {
        return _MonthYearPicker(
          initialDate: _focused,
          firstDate: DateTime(2020),
          lastDate: DateTime(2035),
        );
      },
    );
    if (result == null) return;
    final lastDay = DateTime(
      result.year,
      result.month + 1,
      0,
    ).day;
    final selectedDay = _focused.day > lastDay ? lastDay : _focused.day;
    setState(() {
      _focused = DateTime(
        result.year,
        result.month,
        selectedDay,
      );
    });
    await _loadEvents();
  }

  void _goToToday() {
    final today = DateTime.now();
    setState(() {
      _focused = DateTime(
        today.year,
        today.month,
        today.day,
      );
    });
    _loadEvents();
  }

  String _monthName(int month) {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    return months[month - 1];
  }

  String _weekdayName(int weekday) {
    const weekdays = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ];
    return weekdays[weekday - 1];
  }

  String _formatTime(DateTime date) {
    final hour = date.hour.toString().padLeft(2, '0');
    final minute = date.minute.toString().padLeft(2, '0');
    return '$hour:$minute';
  }

  String _formatHour(int hour) {
    return '${hour.toString().padLeft(2, '0')}:00';
  }

  bool _isToday() {
    final now = DateTime.now();
    return now.year == _focused.year &&
        now.month == _focused.month &&
        now.day == _focused.day;
  }

  double _eventTop(DateTime start) {
    final minutes = start.hour * 60 + start.minute;
    return (minutes / 60) * _hourHeight;
  }

  double _eventHeight(
    DateTime start,
    DateTime end,
  ) {
    final duration = end.difference(start).inMinutes;
    final minutes = duration <= 15 ? 30 : duration;
    return (minutes / 60) * _hourHeight;
  }

  String _normalizedStatus(String status) {
    final value =
        status.trim().toLowerCase().replaceAll('-', '_').replaceAll(' ', '_');
    switch (value) {
      case 'accepted':
      case 'approve':
      case 'approved':
      case 'confirmed':
      case 'confirmation':
        return 'accepted';
      case 'cancel':
      case 'cancelled':
      case 'canceled':
        return 'cancelled';
      case 'pending':
      case 'waiting':
      case 'requested':
        return 'pending';
      case 'completed':
      case 'complete':
        return 'completed';
      default:
        return value;
    }
  }

  Color _statusColor(String status) {
    switch (_normalizedStatus(status)) {
      case 'pending':
        return Colors.orange;
      case 'accepted':
        return Colors.green;
      case 'cancelled':
        return Colors.red;
      case 'completed':
        return Colors.blue;
      default:
        return Theme.of(context).colorScheme.primary;
    }
  }

  Color _statusBackgroundColor(String status) {
    switch (_normalizedStatus(status)) {
      case 'pending':
        return Colors.orange.withOpacity(0.16);
      case 'accepted':
        return Colors.green.withOpacity(0.16);
      case 'cancelled':
        return Colors.red.withOpacity(0.16);
      case 'completed':
        return Colors.blue.withOpacity(0.16);
      default:
        return Theme.of(context).colorScheme.primary.withOpacity(0.12);
    }
  }

  String _statusLabel(String status) {
    switch (_normalizedStatus(status)) {
      case 'pending':
        return 'PENDING';
      case 'accepted':
        return 'ACCEPTED';
      case 'cancelled':
        return 'CANCELLED';
      case 'completed':
        return 'COMPLETED';
      default:
        return status.toUpperCase();
    }
  }

  IconData _statusIcon(String status) {
    switch (_normalizedStatus(status)) {
      case 'pending':
        return Icons.schedule;
      case 'accepted':
        return Icons.check_circle;
      case 'cancelled':
        return Icons.cancel;
      case 'completed':
        return Icons.task_alt;
      default:
        return Icons.event;
    }
  }

  Future<void> _showActions(
      Booking booking,
      ) async {
    final api = Provider.of<ApiService>(
      context,
      listen: false,
    );

    String formatDateTime(DateTime dateTime) {
      final day = dateTime.day.toString().padLeft(2, '0');
      final month = dateTime.month.toString().padLeft(2, '0');
      final year = dateTime.year.toString();

      final hour = dateTime.hour.toString().padLeft(2, '0');
      final minute = dateTime.minute.toString().padLeft(2, '0');

      return '$day.$month.$year  $hour:$minute';
    }

    final action = await showModalBottomSheet<String>(
      context: context,
      showDragHandle: true,
      isScrollControlled: true,
      // backgroundColor: Colors.transparent,
      builder: (sheetContext) {
        final theme = Theme.of(sheetContext);
        final colorScheme = theme.colorScheme;

        return SafeArea(
          child: Container(
            constraints: BoxConstraints(
              maxHeight: MediaQuery.of(sheetContext).size.height * 0.85,
            ),
            decoration: BoxDecoration(
              color: theme.scaffoldBackgroundColor,
              borderRadius: const BorderRadius.vertical(
                top: Radius.circular(24),
              ),
            ),
            child: SingleChildScrollView(
              padding: EdgeInsets.only(
                bottom: MediaQuery.of(sheetContext).viewInsets.bottom,
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Padding(
                    padding: const EdgeInsets.fromLTRB(
                      20,
                      4,
                      20,
                      12,
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Container(
                              width: 42,
                              height: 42,
                              decoration: BoxDecoration(
                                color: colorScheme.primary.withOpacity(0.10),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Icon(
                                Icons.calendar_month_rounded,
                                color: colorScheme.primary,
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment:
                                CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    'Booking details',
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                    style: theme.textTheme.titleLarge?.copyWith(
                                      fontWeight: FontWeight.w700,
                                    ),
                                  ),
                                  const SizedBox(height: 2),
                                  Text(
                                    'Booking #${booking.id}',
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                    style: theme.textTheme.bodySmall?.copyWith(
                                      color: theme
                                          .textTheme
                                          .bodySmall
                                          ?.color
                                          ?.withOpacity(0.65),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),

                        const SizedBox(height: 18),

                        _bookingDetailRow(
                          context: sheetContext,
                          icon: Icons.person_rounded,
                          label: 'Customer',
                          value: booking.customerName.isNotEmpty
                              ? booking.customerName
                              : 'Guest',
                        ),

                        const SizedBox(height: 12),

                        _bookingDetailRow(
                          context: sheetContext,
                          icon: Icons.access_time_rounded,
                          label: 'Date & time',
                          value:
                          '${formatDateTime(booking.start)}\n'
                              '${formatDateTime(booking.end)}',
                        ),

                        const SizedBox(height: 12),

                        _bookingDetailRow(
                          context: sheetContext,
                          icon: Icons.room_service_rounded,
                          label: 'Service',
                          value: booking.serviceName.isNotEmpty
                              ? booking.serviceName
                              : 'Service',
                        ),

                        const SizedBox(height: 16),

                        Divider(
                          height: 1,
                          color: theme.dividerColor,
                        ),
                      ],
                    ),
                  ),

                  _bookingActionTile(
                    context: sheetContext,
                    icon: Icons.check_circle_rounded,
                    title: 'Approve',
                    subtitle: 'Accept this booking',
                    color: Colors.green,
                    onTap: () {
                      Navigator.pop(
                        sheetContext,
                        'approve',
                      );
                    },
                  ),

                  _bookingActionTile(
                    context: sheetContext,
                    icon: Icons.cancel_rounded,
                    title: 'Cancel',
                    subtitle: 'Cancel this booking',
                    color: Colors.red,
                    onTap: () {
                      Navigator.pop(
                        sheetContext,
                        'cancel',
                      );
                    },
                  ),

                  _bookingActionTile(
                    context: sheetContext,
                    icon: Icons.schedule_rounded,
                    title: 'Reschedule',
                    subtitle: 'Change booking date and time',
                    color: Colors.orange,
                    onTap: () {
                      Navigator.pop(
                        sheetContext,
                        'reschedule',
                      );
                    },
                  ),

                  const SizedBox(height: 8),
                ],
              ),
            ),
          ),
        );
      },
    );

    if (action == null || !mounted) return;

    try {
      if (action == 'approve') {
        await api.approveBooking(
          booking.id,
        );
      } else if (action == 'cancel') {
        await api.cancelBooking(
          booking.id,
        );
      } else if (action == 'reschedule') {
        final dt = await showDatePicker(
          context: context,
          initialDate: booking.start.isBefore(DateTime.now())
              ? DateTime.now()
              : booking.start,
          firstDate: DateTime.now(),
          lastDate: DateTime.now().add(
            const Duration(days: 365),
          ),
        );

        if (dt != null && mounted) {
          final initialTime = TimeOfDay.fromDateTime(booking.start);
          final pickedTime = await showTimePicker(
            context: context,
            initialTime: initialTime,
          );

          if (pickedTime != null && mounted) {
            final bookingTime = '${pickedTime.hour.toString().padLeft(2, '0')}:${pickedTime.minute.toString().padLeft(2, '0')}';
            await api.rescheduleBooking(
              booking.id,
              dt,
              bookingTime,
            );
          }
        }
      }

      if (mounted) {
        await _loadEvents();
      }
    } catch (e) {
      if (!mounted) return;

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          behavior: SnackBarBehavior.floating,
          content: Text(
            'Action failed: $e',
            maxLines: 3,
            overflow: TextOverflow.ellipsis,
          ),
        ),
      );
    }
  }

  Widget _bookingDetailRow({
    required BuildContext context,
    required IconData icon,
    required String label,
    required String value,
  }) {
    final theme = Theme.of(context);

    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          width: 36,
          height: 36,
          decoration: BoxDecoration(
            color: theme.colorScheme.primary.withOpacity(0.08),
            borderRadius: BorderRadius.circular(10),
          ),
          child: Icon(
            icon,
            size: 19,
            color: theme.colorScheme.primary,
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: theme.textTheme.bodySmall?.copyWith(
                  color: theme.textTheme.bodySmall?.color?.withOpacity(0.60),
                  fontWeight: FontWeight.w500,
                ),
              ),
              const SizedBox(height: 3),
              Text(
                value,
                maxLines: 3,
                overflow: TextOverflow.ellipsis,
                style: theme.textTheme.bodyMedium?.copyWith(
                  fontWeight: FontWeight.w600,
                  height: 1.35,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _bookingActionTile({
    required BuildContext context,
    required IconData icon,
    required String title,
    required String subtitle,
    required Color color,
    required VoidCallback onTap,
  }) {
    final theme = Theme.of(context);

    return Padding(
      padding: const EdgeInsets.symmetric(
        horizontal: 12,
        vertical: 3,
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(16),
          child: Padding(
            padding: const EdgeInsets.symmetric(
              horizontal: 8,
              vertical: 9,
            ),
            child: Row(
              children: [
                Container(
                  width: 44,
                  height: 44,
                  decoration: BoxDecoration(
                    color: color.withOpacity(0.10),
                    borderRadius: BorderRadius.circular(13),
                  ),
                  child: Icon(
                    icon,
                    color: color,
                    size: 23,
                  ),
                ),
                const SizedBox(width: 13),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        title,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: theme.textTheme.bodyLarge?.copyWith(
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        subtitle,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: theme.textTheme.bodySmall?.copyWith(
                          color: theme
                              .textTheme
                              .bodySmall
                              ?.color
                              ?.withOpacity(0.60),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 8),
                Icon(
                  Icons.chevron_right_rounded,
                  color: theme.iconTheme.color?.withOpacity(0.45),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }


  Widget _buildHeader() {
    final theme = Theme.of(context);
    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: 16,
        vertical: 10,
      ),
      decoration: BoxDecoration(
        color: theme.scaffoldBackgroundColor,
        border: Border(
          bottom: BorderSide(
            color: theme.dividerColor,
          ),
        ),
      ),
      child: LayoutBuilder(
        builder: (context, constraints) {
          final compact = constraints.maxWidth < 850;
          if (compact) {
            return Column(
              children: [
                Row(
                  children: [
                    IconButton(
                      tooltip: 'Previous day',
                      onPressed: () => _changeDay(-1),
                      icon: const Icon(
                        Icons.chevron_left,
                      ),
                    ),
                    IconButton(
                      tooltip: 'Next day',
                      onPressed: () => _changeDay(1),
                      icon: const Icon(
                        Icons.chevron_right,
                      ),
                    ),
                    const SizedBox(width: 4),
                    Expanded(
                      child: InkWell(
                        borderRadius: BorderRadius.circular(8),
                        onTap: _selectDate,
                        child: Padding(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 8,
                            vertical: 6,
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                '${_monthName(_focused.month)} '
                                '${_focused.day}, '
                                '${_focused.year}',
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: const TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                              const SizedBox(height: 2),
                              Text(
                                _isToday()
                                    ? 'Today · ${_weekdayName(_focused.weekday)}'
                                    : _weekdayName(
                                        _focused.weekday,
                                      ),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: TextStyle(
                                  fontSize: 12,
                                  color: theme.textTheme.bodySmall?.color,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                    OutlinedButton(
                      onPressed: _goToToday,
                      child: const Text('Today'),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                SizedBox(
                  width: double.infinity,
                  child: OutlinedButton.icon(
                    onPressed: _selectMonthYear,
                    icon: const Icon(
                      Icons.calendar_month,
                      size: 18,
                    ),
                    label: Text(
                      '${_monthName(_focused.month)} ' '${_focused.year}',
                    ),
                  ),
                ),
              ],
            );
          }
          return Row(
            children: [
              IconButton(
                tooltip: 'Previous day',
                onPressed: () => _changeDay(-1),
                icon: const Icon(
                  Icons.chevron_left,
                ),
              ),
              IconButton(
                tooltip: 'Next day',
                onPressed: () => _changeDay(1),
                icon: const Icon(
                  Icons.chevron_right,
                ),
              ),
              const SizedBox(width: 6),
              Expanded(
                child: InkWell(
                  borderRadius: BorderRadius.circular(8),
                  onTap: _selectDate,
                  child: Padding(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8,
                      vertical: 6,
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          '${_monthName(_focused.month)} '
                          '${_focused.day}, '
                          '${_focused.year}',
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          _isToday()
                              ? 'Today · ${_weekdayName(_focused.weekday)}'
                              : _weekdayName(
                                  _focused.weekday,
                                ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: TextStyle(
                            fontSize: 13,
                            color: theme.textTheme.bodySmall?.color,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 8),
              OutlinedButton(
                onPressed: _goToToday,
                child: const Text('Today'),
              ),
              const SizedBox(width: 8),
              OutlinedButton.icon(
                onPressed: _selectMonthYear,
                icon: const Icon(
                  Icons.calendar_month,
                  size: 18,
                ),
                label: Text(
                  '${_monthName(_focused.month)} ' '${_focused.year}',
                ),
              ),
            ],
          );
        },
      ),
    );
  }

  Widget _buildTimeColumn() {
    return SizedBox(
      width: _timeColumnWidth,
      height: _hourHeight * 24,
      child: Column(
        children: List.generate(
          24,
          (hour) {
            return SizedBox(
              height: _hourHeight,
              child: Align(
                alignment: Alignment.topRight,
                child: Padding(
                  padding: const EdgeInsets.only(
                    right: 10,
                    top: 5,
                  ),
                  child: Text(
                    _formatHour(hour),
                    style: TextStyle(
                      fontSize: 12,
                      color: Colors.grey.shade600,
                    ),
                  ),
                ),
              ),
            );
          },
        ),
      ),
    );
  }

  Widget _buildHourGrid() {
    final theme = Theme.of(context);
    return SizedBox(
      height: _hourHeight * 24,
      width: double.infinity,
      child: Stack(
        children: [
          Column(
            children: List.generate(
              24,
              (hour) {
                return Container(
                  height: _hourHeight,
                  decoration: BoxDecoration(
                    border: Border(
                      bottom: BorderSide(
                        color: theme.dividerColor.withOpacity(0.45),
                        width: 1,
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
          ..._dayEvents.map(
            (booking) => _buildBookingCard(booking),
          ),
          _buildCurrentTimeIndicator(),
        ],
      ),
    );
  }

  Widget _buildBookingCard(
    Booking booking,
  ) {
    final top = _eventTop(
      booking.start,
    );
    DateTime end = booking.end;
    if (end.isBefore(booking.start) ||
        end.isAtSameMomentAs(
          booking.start,
        )) {
      end = booking.start.add(
        const Duration(minutes: 30),
      );
    }
    final height = _eventHeight(
      booking.start,
      end,
    );
    final statusColor = _statusColor(booking.status);
    final backgroundColor = _statusBackgroundColor(booking.status);
    final statusLabel = _statusLabel(booking.status);
    final statusIcon = _statusIcon(booking.status);
    final safeHeight = height < 34 ? 34.0 : height;
    final isCancelled = _normalizedStatus(booking.status) == 'cancelled';
    return Positioned(
      top: top + 3,
      left: 5,
      right: 8,
      height: safeHeight - 6,
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(8),
          onTap: () => _showActions(booking),
          child: Container(
            decoration: BoxDecoration(
              color: backgroundColor,
              borderRadius: BorderRadius.circular(8),
              border: Border.all(
                color: statusColor.withOpacity(
                  0.45,
                ),
                width: 1,
              ),
              boxShadow: [
                BoxShadow(
                  color: statusColor.withOpacity(
                    0.08,
                  ),
                  blurRadius: 3,
                  offset: const Offset(0, 1),
                ),
              ],
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Container(
                  width: 5,
                  decoration: BoxDecoration(
                    color: statusColor,
                    borderRadius: const BorderRadius.only(
                      topLeft: Radius.circular(8),
                      bottomLeft: Radius.circular(8),
                    ),
                  ),
                ),
                Expanded(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 10,
                      vertical: 6,
                    ),
                    child: LayoutBuilder(
                      builder: (context, constraints) {
                        final compact = constraints.maxHeight < 58;
                        if (compact) {
                          return Row(
                            children: [
                              Icon(
                                statusIcon,
                                size: 14,
                                color: statusColor,
                              ),
                              const SizedBox(width: 5),
                              Expanded(
                                child: Text(
                                  booking.customerName.isNotEmpty
                                      ? booking.customerName
                                      : 'Guest',
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  style: TextStyle(
                                    fontWeight: FontWeight.w600,
                                    fontSize: 13,
                                    color: isCancelled ? statusColor : null,
                                    decoration: isCancelled
                                        ? TextDecoration.lineThrough
                                        : null,
                                  ),
                                ),
                              ),
                              const SizedBox(width: 6),
                              Text(
                                _formatTime(
                                  booking.start,
                                ),
                                maxLines: 1,
                                style: TextStyle(
                                  fontSize: 11,
                                  color: statusColor,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ],
                          );
                        }
                        return Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Icon(
                                  statusIcon,
                                  size: 15,
                                  color: statusColor,
                                ),
                                const SizedBox(width: 6),
                                Expanded(
                                  child: Text(
                                    booking.customerName.isNotEmpty
                                        ? booking.customerName
                                        : 'Guest',
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                    style: TextStyle(
                                      fontWeight: FontWeight.w600,
                                      fontSize: 14,
                                      color: isCancelled ? statusColor : null,
                                      decoration: isCancelled
                                          ? TextDecoration.lineThrough
                                          : null,
                                    ),
                                  ),
                                ),
                                const SizedBox(width: 6),
                                Flexible(
                                  child: Container(
                                    constraints: const BoxConstraints(
                                      maxWidth: 105,
                                    ),
                                    padding: const EdgeInsets.symmetric(
                                      horizontal: 7,
                                      vertical: 3,
                                    ),
                                    decoration: BoxDecoration(
                                      color: statusColor.withOpacity(
                                        0.14,
                                      ),
                                      borderRadius: BorderRadius.circular(
                                        10,
                                      ),
                                    ),
                                    child: Row(
                                      mainAxisSize: MainAxisSize.min,
                                      children: [
                                        Icon(
                                          statusIcon,
                                          size: 10,
                                          color: statusColor,
                                        ),
                                        const SizedBox(
                                          width: 3,
                                        ),
                                        Flexible(
                                          child: Text(
                                            statusLabel,
                                            maxLines: 1,
                                            overflow: TextOverflow.ellipsis,
                                            style: TextStyle(
                                              fontSize: 9,
                                              fontWeight: FontWeight.w700,
                                              color: statusColor,
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 4),
                            Row(
                              children: [
                                Icon(
                                  Icons.access_time,
                                  size: 13,
                                  color: Colors.grey.shade700,
                                ),
                                const SizedBox(width: 4),
                                Expanded(
                                  child: Text(
                                    '${_formatTime(booking.start)} – '
                                    '${_formatTime(end)}',
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                    style: TextStyle(
                                      fontSize: 12,
                                      color: Colors.grey.shade700,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ],
                        );
                      },
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

  Widget _buildCurrentTimeIndicator() {
    if (!_isToday()) {
      return const SizedBox.shrink();
    }
    final now = DateTime.now();
    final minutes = now.hour * 60 + now.minute + now.second / 60;
    final top = (minutes / 60) * _hourHeight;
    return Positioned(
      top: top,
      left: 0,
      right: 0,
      child: IgnorePointer(
        child: Row(
          children: [
            Container(
              width: 7,
              height: 7,
              decoration: const BoxDecoration(
                color: Colors.red,
                shape: BoxShape.circle,
              ),
            ),
            Expanded(
              child: Container(
                height: 1.5,
                color: Colors.red,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCalendarBody() {
    return Scrollbar(
      controller: _scrollController,
      thumbVisibility: true,
      child: SingleChildScrollView(
        controller: _scrollController,
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildTimeColumn(),
            Expanded(
              child: _buildHourGrid(),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Calendar'),
        actions: [
          Padding(
            padding: const EdgeInsets.only(
              right: 12,
            ),
            child: BusinessNameDisplay(),
          ),
        ],
      ),
      body: Column(
        children: [
          _buildHeader(),
          Expanded(
            child: _loading
                ? const Center(
                    child: CircularProgressIndicator(),
                  )
                : _buildCalendarBody(),
          ),
        ],
      ),
    );
  }
}

class _MonthYearPicker extends StatefulWidget {
  final DateTime initialDate;
  final DateTime firstDate;
  final DateTime lastDate;
  const _MonthYearPicker({
    Key? key,
    required this.initialDate,
    required this.firstDate,
    required this.lastDate,
  }) : super(key: key);
  @override
  State<_MonthYearPicker> createState() => _MonthYearPickerState();
}

class _MonthYearPickerState extends State<_MonthYearPicker> {
  late int _month;
  late int _year;
  @override
  void initState() {
    super.initState();
    _month = widget.initialDate.month;
    _year = widget.initialDate.year;
  }

  String _monthName(int month) {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    return months[month - 1];
  }

  bool _isAllowed(
    int year,
    int month,
  ) {
    final date = DateTime(
      year,
      month,
    );
    final first = DateTime(
      widget.firstDate.year,
      widget.firstDate.month,
    );
    final last = DateTime(
      widget.lastDate.year,
      widget.lastDate.month,
    );
    return !date.isBefore(first) && !date.isAfter(last);
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return AlertDialog(
      titlePadding: const EdgeInsets.fromLTRB(
        20,
        18,
        12,
        8,
      ),
      contentPadding: const EdgeInsets.fromLTRB(
        20,
        8,
        20,
        12,
      ),
      title: Row(
        children: [
          const Expanded(
            child: Text(
              'Select month',
            ),
          ),
          DropdownButton<int>(
            value: _year,
            isDense: true,
            items: [
              for (int year = widget.firstDate.year;
                  year <= widget.lastDate.year;
                  year++)
                DropdownMenuItem(
                  value: year,
                  child: Text('$year'),
                ),
            ],
            onChanged: (value) {
              if (value == null) return;
              setState(() {
                _year = value;
              });
            },
          ),
        ],
      ),
      content: SizedBox(
        width: 380,
        child: GridView.builder(
          shrinkWrap: true,
          itemCount: 12,
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 3,
            childAspectRatio: 2.2,
            crossAxisSpacing: 8,
            mainAxisSpacing: 8,
          ),
          itemBuilder: (context, index) {
            final month = index + 1;
            final selected = month == _month;
            final enabled = _isAllowed(
              _year,
              month,
            );
            return InkWell(
              borderRadius: BorderRadius.circular(8),
              onTap: enabled
                  ? () {
                      setState(() {
                        _month = month;
                      });
                    }
                  : null,
              child: Container(
                alignment: Alignment.center,
                decoration: BoxDecoration(
                  color: selected
                      ? theme.colorScheme.primary.withOpacity(0.12)
                      : null,
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(
                    color: selected
                        ? theme.colorScheme.primary
                        : theme.dividerColor,
                  ),
                ),
                child: Text(
                  _monthName(month),
                  style: TextStyle(
                    fontWeight: selected ? FontWeight.w600 : FontWeight.normal,
                    color: enabled ? null : Colors.grey,
                  ),
                ),
              ),
            );
          },
        ),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.pop(context),
          child: const Text(
            'Cancel',
          ),
        ),
        FilledButton(
          onPressed: () {
            Navigator.pop(
              context,
              DateTime(
                _year,
                _month,
                1,
              ),
            );
          },
          child: const Text(
            'Apply',
          ),
        ),
      ],
    );
  }
}
