import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter/foundation.dart';
import 'dart:io' show Platform;
import 'package:shared_preferences/shared_preferences.dart';
import '../models/user.dart';
import '../models/booking.dart';
import '../models/business.dart';

class ApiService {
  // Local development: point to the API gateway running locally.
  // For Android emulator use 10.0.2.2, otherwise localhost works for desktop/web.
  String get baseUrl {
    try {
      if (kIsWeb) return 'http://localhost:9087';
      if (Platform.isAndroid) return 'http://10.0.2.2:9087';
      return 'http://localhost:9087';
    } catch (e) {
      return 'http://localhost:9087';
    }
  }

  Future<String?> login(String email, String password) async {
    final url = Uri.parse('$baseUrl/api/auth/login');
    final res = await http.post(url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'email': email, 'password': password}));
    if (res.statusCode == 200) {
      final data = jsonDecode(res.body);
      // support multiple shapes: {token}, {accessToken}, {data: {token}}
      String? token;
      if (data is Map<String, dynamic>) {
        token = (data['token'] as String?) ?? (data['accessToken'] as String?);
        if (token == null && data['data'] is Map) {
          token = (data['data']['token'] as String?) ??
              (data['data']['accessToken'] as String?);
        }
      }
      if (token != null) {
        final prefs = await SharedPreferences.getInstance();
        // persist under both common keys so other apps/tools can read it
        await prefs.setString('auth_token', token);
        await prefs.setString('admin-token', token);
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
    // support multiple keys used across apps
    return prefs.getString('auth_token') ?? prefs.getString('admin-token');
  }

  Future<User?> getProfile() async {
    final t = await _token();
    // Prefer the users service for profile; /api/staff/me returns a list of staff entries.
    final url = Uri.parse('$baseUrl/api/users/me');
    final headers = <String, String>{};
    if (t != null) headers['Authorization'] = 'Bearer $t';
    final res = await http.get(url, headers: headers);
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
      final headers = <String, String>{};
      if (t != null) headers['Authorization'] = 'Bearer $t';
      final res = await http.get(url, headers: headers);
      if (res.statusCode == 200) {
        final list = jsonDecode(res.body) as List;
        return list.map((e) => Booking.fromJson(e)).toList();
      }
      return [];
    }

    // fallback to staff bookings
    final url = Uri.parse('$baseUrl/api/bookings/staff/me');
    final headers = <String, String>{};
    if (t != null) headers['Authorization'] = 'Bearer $t';
    final res = await http.get(url, headers: headers);
    if (res.statusCode == 200) {
      final list = jsonDecode(res.body) as List;
      return list.map((e) => Booking.fromJson(e)).toList();
    }
    return [];
  }

  Future<List<Business>> getBusinesses() async {
    final t = await _token();
    final url = Uri.parse('$baseUrl/api/businesses');
    final headers = <String, String>{};
    if (t != null) headers['Authorization'] = 'Bearer $t';
    final res = await http.get(url, headers: headers);
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

  Future<String?> getSelectedBusinessId() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('selected_business_id');
  }

  Future<bool> approveBooking(String id) async {
    final t = await _token();
    final url = Uri.parse('$baseUrl/api/bookings/$id/status');
    final headers = <String, String>{'Content-Type': 'application/json'};
    if (t != null) headers['Authorization'] = 'Bearer $t';
    final res = await http.patch(url,
        headers: headers, body: jsonEncode({'status': 'CONFIRMED'}));
    return res.statusCode == 200 || res.statusCode == 204;
  }

  Future<bool> cancelBooking(String id) async {
    final t = await _token();
    final url = Uri.parse('$baseUrl/api/bookings/$id/status');
    final headers = <String, String>{'Content-Type': 'application/json'};
    if (t != null) headers['Authorization'] = 'Bearer $t';
    final res = await http.patch(url,
        headers: headers, body: jsonEncode({'status': 'CANCELLED'}));
    return res.statusCode == 200 || res.statusCode == 204;
  }

  Future<bool> rescheduleBooking(String id, DateTime bookingDate, String bookingTime, {String? reason}) async {
    final t = await _token();
    final url = Uri.parse('$baseUrl/api/bookings/$id/reschedule');
    final headers = <String, String>{'Content-Type': 'application/json'};
    if (t != null) headers['Authorization'] = 'Bearer $t';
    final body = {
      'bookingDate': bookingDate.toIso8601String().split('T')[0],
      'bookingTime': bookingTime,
      if (reason != null) 'reason': reason,
    };
    final res = await http.patch(url, headers: headers, body: jsonEncode(body));
    return res.statusCode == 200 || res.statusCode == 204;
  }

  Future<List<Booking>> getCalendarEvents(DateTime from, DateTime to) async {
    final t = await _token();
    final prefs = await SharedPreferences.getInstance();
    final selectedBusinessId = prefs.getString('selected_business_id');

    String? businessId = selectedBusinessId;
    // ensure we always supply a businessId; if none selected, pick the first accessible
    if (businessId == null || businessId.isEmpty) {
      final businesses = await getBusinesses();
      if (businesses.isNotEmpty) {
        businessId = businesses.first.id;
        await setSelectedBusiness(businessId, businesses.first.name);
      }
    }

    // server expects date-only strings (YYYY-MM-DD)
    final params = {
      if (businessId != null) 'businessId': businessId,
      'from': from.toIso8601String().split('T')[0],
      'to': to.toIso8601String().split('T')[0]
    };
    final uri = Uri.parse('$baseUrl/api/bookings/calendar')
        .replace(queryParameters: params);
    final headers = <String, String>{};
    if (t != null) headers['Authorization'] = 'Bearer $t';
    final res = await http.get(uri, headers: headers);
    if (res.statusCode == 200) {
      final list = jsonDecode(res.body) as List;
      return list.map((e) => Booking.fromJson(e)).toList();
    }
    return [];
  }

  Future<Map<String, dynamic>?> getDashboardMetrics(String businessId) async {
    final t = await _token();
    final uri =
        Uri.parse('$baseUrl/api/bookings/dashboard/$businessId/metrics');
    final headers = <String, String>{};
    if (t != null) headers['Authorization'] = 'Bearer $t';
    final res = await http.get(uri, headers: headers);
    if (res.statusCode == 200) {
      return jsonDecode(res.body) as Map<String, dynamic>;
    }
    return null;
  }
}
