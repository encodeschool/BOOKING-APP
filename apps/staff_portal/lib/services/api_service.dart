import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../models/user.dart';
import '../models/booking.dart';
import '../models/business.dart';

class ApiService {
  // Adjust baseUrl to your backend host. Use 10.0.2.2 for Android emulator.
  final String baseUrl = 'https://api-enroll.encode.uz';

  Future<String?> login(String email, String password) async {
    final url = Uri.parse('$baseUrl/api/auth/login');
    final res = await http.post(url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'email': email, 'password': password}));
    if (res.statusCode == 200) {
      final data = jsonDecode(res.body);
      final token = data['token'] ?? data['accessToken'];
      if (token != null) {
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('auth_token', token);
        return token;
      }
    }
    return null;
  }

  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('auth_token');
  }

  Future<String?> _token() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('auth_token');
  }

  Future<User?> getProfile() async {
    final t = await _token();
    // Prefer the users service for profile; /api/staff/me returns a list of staff entries.
    final url = Uri.parse('$baseUrl/api/users/me');
    final res = await http.get(url, headers: {'Authorization': 'Bearer $t'});
    if (res.statusCode == 200) {
      final decoded = jsonDecode(res.body);
      if (decoded is Map<String, dynamic>) {
        return User.fromJson(decoded);
      }
      // sometimes API may return a single-element list; handle defensively
      if (decoded is List &&
          decoded.isNotEmpty &&
          decoded.first is Map<String, dynamic>) {
        return User.fromJson(decoded.first as Map<String, dynamic>);
      }
    }
    return null;
  }

  Future<List<Booking>> getBookings() async {
    final t = await _token();
    final prefs = await SharedPreferences.getInstance();
    final selectedBusinessId = prefs.getString('selected_business_id');

    if (selectedBusinessId != null && selectedBusinessId.isNotEmpty) {
      final url =
          Uri.parse('$baseUrl/api/bookings/business/$selectedBusinessId');
      final res = await http.get(url, headers: {'Authorization': 'Bearer $t'});
      if (res.statusCode == 200) {
        final list = jsonDecode(res.body) as List;
        return list.map((e) => Booking.fromJson(e)).toList();
      }
      return [];
    }

    // fallback to staff bookings
    final url = Uri.parse('$baseUrl/api/bookings/staff/me');
    final res = await http.get(url, headers: {'Authorization': 'Bearer $t'});
    if (res.statusCode == 200) {
      final list = jsonDecode(res.body) as List;
      return list.map((e) => Booking.fromJson(e)).toList();
    }
    return [];
  }

  Future<List<Business>> getBusinesses() async {
    final t = await _token();
    final url = Uri.parse('$baseUrl/api/businesses');
    final res = await http.get(url, headers: {'Authorization': 'Bearer $t'});
    if (res.statusCode == 200) {
      final list = jsonDecode(res.body) as List;
      return list.map((e) => Business.fromJson(e)).toList();
    }
    return [];
  }

  Future<void> setSelectedBusiness(String id, String name) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('selected_business_id', id);
    await prefs.setString('selected_business_name', name);
  }

  Future<String?> getSelectedBusinessName() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('selected_business_name');
  }

  Future<bool> approveBooking(String id) async {
    final t = await _token();
    final url = Uri.parse('$baseUrl/api/bookings/$id/status');
    final res = await http.patch(url,
        headers: {
          'Authorization': 'Bearer $t',
          'Content-Type': 'application/json'
        },
        body: jsonEncode({'status': 'CONFIRMED'}));
    return res.statusCode == 200 || res.statusCode == 204;
  }

  Future<bool> cancelBooking(String id) async {
    final t = await _token();
    final url = Uri.parse('$baseUrl/api/bookings/$id/status');
    final res = await http.patch(url,
        headers: {
          'Authorization': 'Bearer $t',
          'Content-Type': 'application/json'
        },
        body: jsonEncode({'status': 'CANCELLED'}));
    return res.statusCode == 200 || res.statusCode == 204;
  }

  Future<bool> rescheduleBooking(String id, DateTime at) async {
    final t = await _token();
    final url = Uri.parse('$baseUrl/api/bookings/$id/reschedule');
    final res = await http.patch(url,
        headers: {
          'Authorization': 'Bearer $t',
          'Content-Type': 'application/json'
        },
        body: jsonEncode({'datetime': at.toIso8601String()}));
    return res.statusCode == 200 || res.statusCode == 204;
  }

  Future<List<Booking>> getCalendarEvents(DateTime from, DateTime to) async {
    final t = await _token();
    final prefs = await SharedPreferences.getInstance();
    final selectedBusinessId = prefs.getString('selected_business_id');

    final params = {
      if (selectedBusinessId != null) 'businessId': selectedBusinessId,
      'from': from.toIso8601String(),
      'to': to.toIso8601String()
    };
    final uri = Uri.parse('$baseUrl/api/bookings/calendar')
        .replace(queryParameters: params);
    final res = await http.get(uri, headers: {'Authorization': 'Bearer $t'});
    if (res.statusCode == 200) {
      final list = jsonDecode(res.body) as List;
      return list.map((e) => Booking.fromJson(e)).toList();
    }
    return [];
  }
}
