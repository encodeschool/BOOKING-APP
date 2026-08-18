class Booking {
  final String id;
  final String customerName;
  final DateTime start;
  final DateTime end;
  final String status;
  final String serviceName;

  Booking({
    required this.id,
    required this.customerName,
    required this.start,
    required this.end,
    required this.status,
    required this.serviceName
  });

  factory Booking.fromJson(Map<String, dynamic> json) => Booking(
        id: json['id'].toString(),
        customerName: json['customerName'] ?? json['customer'] ?? '',
        start: DateTime.parse(json['start']),
        end: DateTime.parse(json['end']),
        status: json['status'] ?? 'PENDING',
        serviceName: json['serviceName'] ?? "N/A"
      );
}
