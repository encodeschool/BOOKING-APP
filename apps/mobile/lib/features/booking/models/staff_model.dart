class StaffModel {
  final int? id;
  final String name;
  final String? role;
  final String? email;
  final String? phone;
  final String? imageUrl;

  StaffModel({
    this.id,
    required this.name,
    this.role,
    this.email,
    this.phone,
    this.imageUrl
  });

  factory StaffModel.fromJson(
      Map<String, dynamic> json) {
    return StaffModel(
      id: json['id'],
      name: json['name'] ?? '',
      role: json['role'],
      email: json['email'],
      phone: json['phone'],
      imageUrl: json['imageUrl']
    );
  }
}