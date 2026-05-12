import '../../map/models/business_model.dart';
import 'service_model.dart';
import 'staff_model.dart';

class BookingModel {
  String? type;

  BusinessModel? business;

  ServiceModel? service;

  StaffModel? staff;

  DateTime? date;

  String? time;

  Map<String, dynamic>? customer;

  BookingModel({
    this.type,
    this.business,
    this.service,
    this.staff,
    this.date,
    this.time,
    this.customer,
  });

  BookingModel copyWith({
    String? type,
    BusinessModel? business,
    ServiceModel? service,
    StaffModel? staff,
    DateTime? date,
    String? time,
    Map<String, dynamic>? customer,
  }) {
    return BookingModel(
      type: type ?? this.type,
      business: business ?? this.business,
      service: service ?? this.service,
      staff: staff ?? this.staff,
      date: date ?? this.date,
      time: time ?? this.time,
      customer: customer ?? this.customer,
    );
  }
}