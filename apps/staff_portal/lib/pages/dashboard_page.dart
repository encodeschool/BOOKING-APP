import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/api_service.dart';
import '../models/booking.dart';
import '../widgets/bottom_nav.dart';

class DashboardPage extends StatefulWidget {
  @override
  _DashboardPageState createState() => _DashboardPageState();
}

class _DashboardPageState extends State<DashboardPage> {
  int _index = 0;
  List<Booking> _bookings = [];
  bool _loading = true;
  String? _businessName;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() => _loading = true);
    final api = Provider.of<ApiService>(context, listen: false);
    final name = await api.getSelectedBusinessName();
    final list = await api.getBookings();
    setState(() {
      _bookings = list;
      _businessName = name;
      _loading = false;
    });
  }

  void _onTapNav(int i) {
    if (i == 1) {
      Navigator.pushNamed(context, '/calendar');
      return;
    }
    if (i == 2) {
      Navigator.pushNamed(context, '/profile');
      return;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Dashboard'),
        actions: [
          if (_businessName != null)
            Padding(
              padding: EdgeInsets.symmetric(horizontal: 12),
              child: Center(
                child: Text(
                  _businessName!,
                  style: TextStyle(fontWeight: FontWeight.w600),
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            )
        ],
      ),
      body: _loading
          ? Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _load,
              child: Padding(
                padding: EdgeInsets.all(16),
                child: _bookings.isEmpty
                    ? ListView(
                        children: [
                          SizedBox(height: 48),
                          Icon(Icons.calendar_today,
                              size: 80, color: Colors.blue.shade200),
                          SizedBox(height: 24),
                          Text(
                            'No bookings yet',
                            textAlign: TextAlign.center,
                            style: Theme.of(context).textTheme.headlineSmall,
                          ),
                          SizedBox(height: 12),
                          Text(
                            'Pull to refresh or wait for new appointment requests from your customers.',
                            textAlign: TextAlign.center,
                            style: Theme.of(context)
                                .textTheme
                                .bodyMedium
                                ?.copyWith(color: Colors.grey[700]),
                          ),
                        ],
                      )
                    : ListView.separated(
                        itemCount: _bookings.length,
                        separatorBuilder: (_, __) => SizedBox(height: 12),
                        itemBuilder: (context, index) {
                          final booking = _bookings[index];
                          return Card(
                            shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(18)),
                            child: ListTile(
                              contentPadding: EdgeInsets.symmetric(
                                  horizontal: 16, vertical: 14),
                              title: Text(booking.customerName,
                                  style:
                                      TextStyle(fontWeight: FontWeight.w600)),
                              subtitle: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  SizedBox(height: 6),
                                  Text('${booking.start} - ${booking.end}'),
                                  SizedBox(height: 4),
                                  Text(
                                    booking.serviceName ?? '',
                                    style: TextStyle(color: Colors.grey[700]),
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                ],
                              ),
                              trailing: Container(
                                padding: EdgeInsets.symmetric(
                                    horizontal: 12, vertical: 8),
                                decoration: BoxDecoration(
                                  color: booking.status == 'Confirmed'
                                      ? Colors.green.shade50
                                      : Colors.orange.shade50,
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: Text(
                                  booking.status,
                                  style: TextStyle(
                                    color: booking.status == 'Confirmed'
                                        ? Colors.green.shade800
                                        : Colors.orange.shade800,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              ),
                            ),
                          );
                        },
                      ),
              ),
            ),
      bottomNavigationBar: StaffBottomNav(currentIndex: 0, onTap: _onTapNav),
      // floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,
      // floatingActionButton: FloatingActionButton(
      //   tooltip: 'Open calendar',
      //   child: Icon(Icons.calendar_today),
      //   onPressed: () => Navigator.pushNamed(context, '/calendar'),
      // ),
    );
  }
}
