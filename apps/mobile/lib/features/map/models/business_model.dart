class BusinessModel {
  final int id;
  final String name;
  final String? imageUrl;
  final double latitude;
  final double longitude;
  final String? address;
  final String category;
  final List<String>? images;

  BusinessModel({
    required this.id,
    required this.name,
    required this.latitude,
    required this.longitude,
    this.imageUrl,
    this.address,
    this.category = 'General',
    this.images,
  });

  factory BusinessModel.fromJson(Map<String, dynamic> json) {
    return BusinessModel(
      id: json['id'] ?? 0,
      name: json['name'] ?? '',

      latitude: (json['latitude'] as num?)?.toDouble() ?? 0.0,
      longitude: (json['longitude'] as num?)?.toDouble() ?? 0.0,

      imageUrl: json['imageUrl'],
      address: json['address'],
      category: json['category']?.toString() ?? 'General',

      images: (json['images'] as List<dynamic>?)
          ?.map((e) => e.toString())
          .toList(),
    );
  }
}
