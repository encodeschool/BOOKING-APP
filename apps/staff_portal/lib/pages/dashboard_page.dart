import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/api_service.dart';
import '../models/booking.dart';
import '../models/dashboard_metrics.dart';
import '../widgets/bottom_nav.dart';
import '../widgets/business_name.dart';

class DashboardPage extends StatefulWidget {
  @override
  _DashboardPageState createState() => _DashboardPageState();
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
    setState(() => _loading = true);
    final api = Provider.of<ApiService>(context, listen: false);
    final name = await api.getSelectedBusinessName();
    final list = await api.getBookings();
    // load dashboard metrics if we have a selected business id
    final businessId = await api.getSelectedBusinessId();
    DashboardMetrics? metrics;
    if (businessId != null) {
      final raw = await api.getDashboardMetrics(businessId);
      if (raw != null) metrics = DashboardMetrics.fromJson(raw);
    }
    setState(() {
      _bookings = list;
      _businessName = name;
      _metrics = metrics;
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
          // use shared widget so it updates after login
          Padding(
            padding: EdgeInsets.only(right: 4),
            child: BusinessNameDisplay(),
          )
        ],
      ),
      body: _loading
          ? Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _load,
              child: Padding(
                padding: EdgeInsets.all(16),
                child: Column(
                  children: [
                    if (_metrics != null)
                      SizedBox(
                        height: 100,
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            _statCard('Bookings', _metrics!.bookings.toString(),
                                Colors.blue),
                            _statCard('Pending', _metrics!.pending.toString(),
                                Colors.orange),
                            _statCard('Completed',
                                _metrics!.completed.toString(), Colors.green),
                            _statCard(
                                'Revenue',
                                '\$${_metrics!.revenue.toStringAsFixed(2)}',
                                Colors.purple),
                          ],
                        ),
                      ),
                    SizedBox(height: 12),
                    Expanded(
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
                                  style:
                                      Theme.of(context).textTheme.headlineSmall,
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
                                final status = booking.status.toUpperCase();
                                final isConfirmed = status == 'CONFIRMED' ||
                                    status == 'COMPLETED';
                                return Card(
                                  shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(18)),
                                  child: ListTile(
                                    contentPadding: EdgeInsets.symmetric(
                                        horizontal: 16, vertical: 14),
                                    title: Text(booking.customerName,
                                        style: TextStyle(
                                            fontWeight: FontWeight.w600)),
                                    subtitle: Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: [
                                        SizedBox(height: 6),
                                        Text(
                                            '${booking.start} - ${booking.end}'),
                                        SizedBox(height: 4),
                                        Text(
                                          booking.serviceName ?? '',
                                          style: TextStyle(
                                              color: Colors.grey[700]),
                                          overflow: TextOverflow.ellipsis,
                                        ),
                                      ],
                                    ),
                                    trailing: Container(
                                      padding: EdgeInsets.symmetric(
                                          horizontal: 12, vertical: 8),
                                      decoration: BoxDecoration(
                                        color: isConfirmed
                                            ? Colors.green.shade50
                                            : Colors.orange.shade50,
                                        borderRadius: BorderRadius.circular(12),
                                      ),
                                      child: Text(
                                        booking.status,
                                        style: TextStyle(
                                          color: isConfirmed
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
                    )
                  ],
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

  Widget _statCard(String title, String value, Color color) {
    return Expanded(
      child: Card(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        child: Padding(
          padding: EdgeInsets.all(12),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(title, style: TextStyle(color: color.withOpacity(0.9))),
              SizedBox(height: 5),
              Text(value,
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            ],
          ),
        ),
      ),
    );
  }
}
