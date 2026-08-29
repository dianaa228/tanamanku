import 'package:flutter_test/flutter_test.dart';
import 'package:tanamanku/services/exchange_service.dart';

void main() {
  group('PlantListingModel', () {
    test('fromJson parses correctly', () {
      final json = {
        'id': 1,
        'user_id': 10,
        'plant_species_id': 5,
        'title': 'Monstera Deliciosa - Jual',
        'description': 'Tanaman sehat',
        'price': 150000,
        'type': 'sell',
        'status': 'active',
      };

      final listing = PlantListingModel.fromJson(json);

      expect(listing.id, 1);
      expect(listing.userId, 10);
      expect(listing.plantSpeciesId, 5);
      expect(listing.title, 'Monstera Deliciosa - Jual');
      expect(listing.price, 150000);
      expect(listing.type, 'sell');
      expect(listing.status, 'active');
    });

    test('fromJson handles missing optional fields', () {
      final json = {
        'id': 1,
        'user_id': 10,
        'title': 'Test',
        'type': 'exchange',
        'status': 'active',
      };

      final listing = PlantListingModel.fromJson(json);

      expect(listing.price, isNull);
      expect(listing.description, isNull);
      expect(listing.plantSpeciesId, isNull);
    });
  });

  group('PlantExchangeModel', () {
    test('fromJson parses correctly', () {
      final json = {
        'id': 1,
        'listing_id': 10,
        'offerer_id': 20,
        'message': 'Mau tuker sama anggrek',
        'status': 'pending',
      };

      final exchange = PlantExchangeModel.fromJson(json);

      expect(exchange.id, 1);
      expect(exchange.listingId, 10);
      expect(exchange.offererId, 20);
      expect(exchange.message, 'Mau tuker sama anggrek');
      expect(exchange.status, 'pending');
    });
  });

  group('ExchangeService', () {
    late ExchangeService service;

    setUp(() {
      service = ExchangeService();
    });

    test('service can be instantiated', () {
      expect(service, isNotNull);
      expect(service, isA<ExchangeService>());
    });

    test('getListings method exists', () {
      expect(service.getListings, isA<Function>());
    });

    test('getListing method exists', () {
      expect(service.getListing, isA<Function>());
    });

    test('createListing method exists', () {
      expect(service.createListing, isA<Function>());
    });

    test('makeOffer method exists', () {
      expect(service.makeOffer, isA<Function>());
    });

    test('getMyListings method exists', () {
      expect(service.getMyListings, isA<Function>());
    });

    test('getMyExchanges method exists', () {
      expect(service.getMyExchanges, isA<Function>());
    });

    test('respondToExchange method exists', () {
      expect(service.respondToExchange, isA<Function>());
    });
  });
}
