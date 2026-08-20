# Mobile — Tanamanku (Flutter)

> ⚠️ Folder ini belum berisi kode — **Flutter SDK belum terpasang** di mesin pengembang saat ini. Berikut panduan scaffold-nya.

## Teknologi

- **Flutter** (Android + iOS)
- Mengonsumsi API Laravel yang sama dengan web (`/api/v1`)
- **Aturan:** Flutter hanya menangani UI, state, interaksi, dan konsumsi API. Business logic utama ada di backend — jangan duplikasi logic React.

## Cara Scaffold (setelah Flutter SDK terpasang)

```bash
cd mobile
flutter create . --org id.tanamanku --project-name tanamanku
flutter pub add dio shared_preferences provider
```

## Struktur Target

```
mobile/
├── lib/
│   ├── core/          → config, constants, network, storage, theme, utils
│   ├── models/        → user, product, category, cart, order, plant, garden, reminder, post
│   ├── services/      → api, auth, product, cart, order, garden, community
│   ├── features/      → auth, home, marketplace, cart, checkout, orders,
│   │                    my_garden, plant_finder, plant_diagnosis, community, profile
│   ├── widgets/       → app_button, app_card, app_text_field, product_card, plant_card, ...
│   ├── routes/        → app_routes.dart
│   └── main.dart
└── test/              → unit, widget, integration
```

## Referensi

- Struktur lengkap: `../docs/08-mobile-flutter.json`
- Kontrak API: `../docs/06-api.json`
