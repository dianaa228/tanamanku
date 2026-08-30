import 'plant_species_model.dart';

class PlantListingModel {
  final int id;
  final int userId;
  final int? plantSpeciesId;
  final String title;
  final String? description;
  final double price;
  final String type; // sell, exchange
  final List<String> images;
  final String status; // active, sold, inactive
  final DateTime? createdAt;
  final PlantSpeciesModel? species;

  PlantListingModel({
    required this.id,
    required this.userId,
    this.plantSpeciesId,
    required this.title,
    this.description,
    this.price = 0,
    this.type = 'sell',
    this.images = const [],
    this.status = 'active',
    this.createdAt,
    this.species,
  });

  factory PlantListingModel.fromJson(Map<String, dynamic> json) {
    return PlantListingModel(
      id: json['id'] ?? 0,
      userId: json['user_id'] ?? 0,
      plantSpeciesId: json['plant_species_id'],
      title: json['title'] ?? '',
      description: json['description'],
      price: (json['price'] ?? 0).toDouble(),
      type: json['type'] ?? 'sell',
      images: (json['images'] as List<dynamic>?)?.cast<String>() ?? [],
      status: json['status'] ?? 'active',
      createdAt: json['created_at'] != null ? DateTime.tryParse(json['created_at']) : null,
      species: json['species'] != null ? PlantSpeciesModel.fromJson(json['species']) : null,
    );
  }
}
