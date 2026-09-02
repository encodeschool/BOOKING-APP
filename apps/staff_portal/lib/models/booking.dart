class Booking {
  final String id;
  final String customerName;
  final DateTime start;
  final DateTime end;
  final String status;
  final String serviceName;

  Booking(
      {required this.id,
      required this.customerName,
      required this.start,
      required this.end,
      required this.status,
      required this.serviceName});

  factory Booking.fromJson(Map<String, dynamic> json) => Booking(
      id: json['id'] != null ? json['id'].toString() : '',
      customerName: (json['customerName'] ?? json['customer'] ?? '').toString(),
      start: _parseBookingStart(json) ?? DateTime.now(),
      end: _parseBookingEnd(json) ??
          (_parseBookingStart(json) ?? DateTime.now()).add(Duration(hours: 1)),
      status: (json['status'] ?? json['bookingStatus'] ?? 'PENDING').toString(),
      serviceName: _extractServiceName(json));
}

DateTime? _parseDate(dynamic v) {
  if (v == null) return null;
  try {
    if (v is int) return DateTime.fromMillisecondsSinceEpoch(v);
    return DateTime.tryParse(v.toString());
  } catch (_) {
    return null;
  }
}

DateTime? _parseBookingStart(Map<String, dynamic> json) {
  // Possible shapes: {start: '2023-09-01T10:00:00'}, or {bookingDate: '2023-09-01', startTime: '10:00:00'}
  if (json['start'] != null) return _parseDate(json['start']);
  final bookingDate = json['bookingDate'] ?? json['date'];
  final startTime = json['startTime'] ?? json['time'] ?? json['bookingTime'];
  if (bookingDate != null && startTime != null) {
    final combined = '${bookingDate.toString()}T${startTime.toString()}';
    final parsed = DateTime.tryParse(combined);
    if (parsed != null) return parsed;
    // try without T (some APIs return '2023-09-01' and '10:00')
    return DateTime.tryParse(
        '${bookingDate.toString()} ${startTime.toString()}');
  }
  // fallback to createdAt/start timestamps
  if (json['createdAt'] != null) return _parseDate(json['createdAt']);
  return null;
}

DateTime? _parseBookingEnd(Map<String, dynamic> json) {
  if (json['end'] != null) return _parseDate(json['end']);
  final bookingDate = json['bookingDate'] ?? json['date'];
  final endTime = json['endTime'];
  if (bookingDate != null && endTime != null) {
    final combined = '${bookingDate.toString()}T${endTime.toString()}';
    final parsed = DateTime.tryParse(combined);
    if (parsed != null) return parsed;
    return DateTime.tryParse('${bookingDate.toString()} ${endTime.toString()}');
  }
  // if duration is provided in nested service
  try {
    final service = json['service'];
    if (service is Map && service['durationMinutes'] != null) {
      final start = _parseBookingStart(json);
      final mins = int.tryParse(service['durationMinutes'].toString()) ?? 60;
      if (start != null) return start.add(Duration(minutes: mins));
    }
  } catch (_) {}
  return null;
}

String _extractServiceName(Map<String, dynamic> json) {
  try {
    if (json['serviceName'] != null) return json['serviceName'].toString();
    final service = json['service'];
    if (service is Map) {
      if (service['name'] != null) return service['name'].toString();
      if (service['title'] != null) return service['title'].toString();
    }
  } catch (_) {}
  return (json['serviceId'] != null) ? 'Service #${json['serviceId']}' : 'N/A';
}
