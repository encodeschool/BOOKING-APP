import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:table_calendar/table_calendar.dart';
import '../services/api_service.dart';
import '../models/booking.dart';

class CalendarPage extends StatefulWidget {
  @override
  _CalendarPageState createState() => _CalendarPageState();
}

class _CalendarPageState extends State<CalendarPage> {
  DateTime _focused = DateTime.now();
  DateTime? _selected;
  Map<DateTime, List<Booking>> _events = {};
  bool _loading = true;
  String _view = 'month'; // 'day', 'month', 'year'

  @override
  void initState() {
    super.initState();
    _loadEvents();
  }

  Future<void> _loadEvents() async {
    setState(() => _loading = true);
    final api = Provider.of<ApiService>(context, listen: false);
    // determine range based on current view
    DateTime from;
    DateTime to;
    if (_view == 'day') {
      from = DateTime(_focused.year, _focused.month, _focused.day);
      to = from.add(Duration(days: 1));
    } else if (_view == 'year') {
      from = DateTime(_focused.year, 1, 1);
      to = DateTime(_focused.year + 1, 1, 1).subtract(Duration(seconds: 1));
    } else {
      // month
      from = DateTime(_focused.year, _focused.month, 1);
      to = DateTime(_focused.year, _focused.month + 1, 1)
          .subtract(Duration(seconds: 1));
    }

    final bookings = await api.getCalendarEvents(from, to);
    final map = <DateTime, List<Booking>>{};
    for (var b in bookings) {
      final day = DateTime(b.start.year, b.start.month, b.start.day);
      map.putIfAbsent(day, () => []).add(b);
    }
    setState(() {
      _events = map;
      _loading = false;
    });
  }

  List<Booking> _getEventsForDay(DateTime day) {
    final key = DateTime(day.year, day.month, day.day);
    return _events[key] ?? [];
  }

  void _showActions(Booking b) async {
    final api = Provider.of<ApiService>(context, listen: false);
    final action = await showModalBottomSheet<String>(
        context: context,
        builder: (_) => Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                ListTile(
                    title: Text('Approve'),
                    onTap: () => Navigator.pop(context, 'approve')),
                ListTile(
                    title: Text('Cancel'),
                    onTap: () => Navigator.pop(context, 'cancel')),
                ListTile(
                    title: Text('Reschedule'),
                    onTap: () => Navigator.pop(context, 'reschedule')),
              ],
            ));
    if (action == 'approve') {
      await api.approveBooking(b.id);
    } else if (action == 'cancel') {
      await api.cancelBooking(b.id);
    } else if (action == 'reschedule') {
      final dt = await showDatePicker(
          context: context,
          initialDate: b.start,
          firstDate: DateTime.now(),
          lastDate: DateTime.now().add(Duration(days: 365)));
      if (dt != null) {
        await api.rescheduleBooking(b.id, dt);
      }
    }
    await _loadEvents();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Calendar'),
        actions: [
          Padding(
            padding: EdgeInsets.symmetric(horizontal: 8),
            child: Row(
              children: [
                TextButton(
                    onPressed: () {
                      setState(() => _view = 'day');
                      _loadEvents();
                    },
                    child: Text('Day',
                        style: TextStyle(
                            color: _view == 'day'
                                ? Colors.white
                                : Colors.white70))),
                TextButton(
                    onPressed: () {
                      setState(() => _view = 'month');
                      _loadEvents();
                    },
                    child: Text('Month',
                        style: TextStyle(
                            color: _view == 'month'
                                ? Colors.white
                                : Colors.white70))),
                TextButton(
                    onPressed: () {
                      setState(() => _view = 'year');
                      _loadEvents();
                    },
                    child: Text('Year',
                        style: TextStyle(
                            color: _view == 'year'
                                ? Colors.white
                                : Colors.white70))),
              ],
            ),
          )
        ],
      ),
      body: _loading
          ? Center(child: CircularProgressIndicator())
          : Column(
              children: [
                TableCalendar(
                  focusedDay: _focused,
                  firstDay: DateTime(2020),
                  lastDay: DateTime(2035),
                  selectedDayPredicate: (d) => isSameDay(_selected, d),
                  onDaySelected: (s, f) {
                    setState(() {
                      _selected = s;
                      _focused = f;
                    });
                    _loadEvents();
                  },
                  eventLoader: _getEventsForDay,
                  calendarFormat: _view == 'day'
                      ? CalendarFormat.week
                      : CalendarFormat.month,
                ),
                Expanded(
                  child: ListView(
                    children: _getEventsForDay(_selected ?? _focused)
                        .map((b) => ListTile(
                              title: Text(b.customerName),
                              subtitle: Text('${b.start}',
                                  overflow: TextOverflow.ellipsis),
                              trailing: Text(b.status),
                              onTap: () => _showActions(b),
                            ))
                        .toList(),
                  ),
                )
              ],
            ),
    );
  }
}
