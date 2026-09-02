class DashboardMetrics {
  final double revenue;
  final int bookings;
  final int pending;
  final int completed;

  DashboardMetrics({
    required this.revenue,
    required this.bookings,
    required this.pending,
    required this.completed,
  });

  factory DashboardMetrics.fromJson(Map<String, dynamic> json) =>
      DashboardMetrics(
        revenue: (json['revenue'] is num)
            ? (json['revenue'] as num).toDouble()
            : 0.0,
        bookings: (json['bookings'] as num?)?.toInt() ?? 0,
        pending: (json['pending'] as num?)?.toInt() ?? 0,
        completed: (json['completed'] as num?)?.toInt() ?? 0,
      );
}
