import 'package:dio/dio.dart';

import 'dart:io';

class ApiClient {

  static String get baseUrl {
    if (Platform.isAndroid) {
      return "http://10.0.2.2:8080";
    } else if (Platform.isIOS) {
      return "http://localhost:8080";
    }
    return "http://localhost:8080";
    // return "http://localhost:8080";
  }

  final Dio dio = Dio(
    BaseOptions(
      baseUrl: baseUrl,
      headers: {
        "Content-Type": "application/json",
      },
    ),
  );

  Future<List<dynamic>> getBusinesses() async {
    final res =
    await dio.get("/api/businesses/public");

    return res.data;
  }

  Future<List<dynamic>> getServices(
      int businessId) async {
    final res = await dio.get(
      "/api/services/public/business/$businessId",
    );

    return res.data;
  }

  Future<List<dynamic>> getStaff(
      int businessId) async {
    final res = await dio.get(
      "/api/staff/public/business/$businessId",
    );

    return res.data;
  }

  Future<void> createBooking(
      Map<String, dynamic> data) async {
    await dio.post(
      "/api/bookings/public",
      data: data,
    );
  }
}

final apiClient = ApiClient();