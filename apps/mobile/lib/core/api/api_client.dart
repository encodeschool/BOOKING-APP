import 'package:dio/dio.dart';

import 'dart:io';

class ApiClient {
  static String get baseUrl {
    if (Platform.isAndroid) {
      // return "https://api-enroll.encode.uz";
      return "http://10.0.2.2:9087";
    } else if (Platform.isIOS) {
      return "https://api-enroll.encode.uz";
      // return "http://localhost:9087";
    }
    // return "https://api-enroll.encode.uz";
    return "http://localhost:9087";
  }

  final Dio dio = Dio(
    BaseOptions(
      baseUrl: baseUrl,
      headers: {"Content-Type": "application/json"},
    ),
  );

  Future<List<dynamic>> getBusinesses() async {
    final res = await dio.get("/api/businesses/public");

    return res.data;
  }

  Future<List<dynamic>> getServices(int businessId) async {
    final res = await dio.get("/api/services/public/business/$businessId");

    return res.data;
  }

  Future<List<dynamic>> getStaff(int businessId) async {
    final res = await dio.get("/api/staff/public/business/$businessId");

    return res.data;
  }

  Future<Map<String, dynamic>> createBooking(Map<String, dynamic> data) async {
    final res = await dio.post("/api/bookings/public", data: data);
    return res.data as Map<String, dynamic>;
  }

  Future<List<dynamic>> getMyBookings(String token) async {
    final res = await dio.get(
      "/api/bookings/me",
      options: Options(headers: {"Authorization": "Bearer $token"}),
    );
    return res.data;
  }

  Future<void> cancelBooking(
    int bookingId,
    String token, {
    String? reason,
  }) async {
    await dio.delete(
      "/api/bookings/$bookingId",
      queryParameters: reason == null ? null : {"reason": reason},
      options: Options(headers: {"Authorization": "Bearer $token"}),
    );
  }

  Future<void> rescheduleBooking(
    int bookingId,
    String token,
    Map<String, dynamic> data,
  ) async {
    await dio.patch(
      "/api/bookings/$bookingId/reschedule",
      data: data,
      options: Options(headers: {"Authorization": "Bearer $token"}),
    );
  }

  Future<void> reschedulePublicBooking(
    String bookingToken,
    Map<String, dynamic> data,
  ) async {
    await dio.patch(
      "/api/bookings/public/$bookingToken/reschedule",
      data: data,
    );
  }

  Future<Map<String, dynamic>> getPublicBooking(String bookingToken) async {
    final res = await dio.get("/api/bookings/public/$bookingToken");
    return res.data as Map<String, dynamic>;
  }

  // Notification methods
  Future<void> sendBookingReminder(int bookingId, String token) async {
    await dio.post(
      "/api/notifications/booking/reminder",
      data: {"bookingId": bookingId},
      options: Options(headers: {"Authorization": "Bearer $token"}),
    );
  }

  Future<void> sendCustomNotification(
    Map<String, dynamic> notificationData,
    String token,
  ) async {
    await dio.post(
      "/api/notifications/email",
      data: notificationData,
      options: Options(headers: {"Authorization": "Bearer $token"}),
    );
  }

  // Auth methods
  Future<Map<String, dynamic>> register(String email, String password) async {
    final res = await dio.post(
      "/api/auth/register",
      data: {"email": email, "password": password},
    );
    return res.data;
  }

  Future<Map<String, dynamic>> login(String email, String password) async {
    final res = await dio.post(
      "/api/auth/login",
      data: {"email": email, "password": password},
    );
    return res.data;
  }

  Future<void> forgotPassword(String email) async {
    await dio.post("/api/auth/forgot-password", data: {"email": email});
  }

  Future<void> resetPassword(String token, String newPassword) async {
    await dio.post(
      "/api/auth/reset-password",
      data: {"token": token, "newPassword": newPassword},
    );
  }
}

final apiClient = ApiClient();
