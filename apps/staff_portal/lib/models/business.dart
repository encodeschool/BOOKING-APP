class Business {
  final String id;
  final String name;

  Business({required this.id, required this.name});

  factory Business.fromJson(Map<String, dynamic> json) => Business(
        id: json['id'].toString(),
        name: json['name'] ?? json['title'] ?? '',
      );
}
