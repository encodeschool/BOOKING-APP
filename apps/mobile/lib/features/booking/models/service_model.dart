class ServiceModel {
  final int id;
  final String name;
  final String? category;
  final double price;
  final int? duration;
  final String? description;

  ServiceModel({
    required this.id,
    required this.name,
    required this.price,
    this.category,
    this.duration,
    this.description,
  });

  factory ServiceModel.fromJson(Map<String, dynamic> json) {
    return ServiceModel(
      id: json['id'] ?? 0,
      name: json['name'] ?? '',

      category: json['category'],

      price: (json['price'] as num?)?.toDouble() ?? 0.0,

      duration: json['duration'] as int?,

      description: json['description'],
    );
  }
}