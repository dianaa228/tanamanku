class PlantSpeciesModel {
  final int id;
  final String name;
  final String slug;
  final String? scientificName;
  final String? category;
  final String careLevel;
  final String? lightRequirement;
  final String? waterRequirement;
  final String? humidity;
  final String? temperature;
  final String? growthDuration;
  final String? description;
  final String? image;
  final String? icon;

  PlantSpeciesModel({
    required this.id,
    required this.name,
    required this.slug,
    this.scientificName,
    this.category,
    this.careLevel = 'mudah',
    this.lightRequirement,
    this.waterRequirement,
    this.humidity,
    this.temperature,
    this.growthDuration,
    this.description,
    this.image,
    this.icon,
  });

  factory PlantSpeciesModel.fromJson(Map<String, dynamic> json) {
    return PlantSpeciesModel(
      id: json['id'] ?? 0,
      name: json['name'] ?? '',
      slug: json['slug'] ?? '',
      scientificName: json['scientific_name'],
      category: json['category'],
      careLevel: json['care_level'] ?? 'mudah',
      lightRequirement: json['light_requirement'],
      waterRequirement: json['water_requirement'],
      humidity: json['humidity'],
      temperature: json['temperature'],
      growthDuration: json['growth_duration'],
      description: json['description'],
      image: json['image'],
      icon: json['icon'],
    );
  }
}
