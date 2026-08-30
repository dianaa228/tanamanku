/// Ikon tanaman terpusat — konsisten dengan web (normalizers.visualFor).
/// Menurunkan emoji dari nama/slug spesies via aturan sederhana.
String plantEmoji({String? name, String? slug}) {
  final hay = '${name ?? ''} ${slug ?? ''}'.toLowerCase();

  if (hay.contains('monstera')) return '🪴';
  if (hay.contains('sirih') || hay.contains('pothos')) return '🍃';
  if (hay.contains('aglonema')) return '🌺';
  if (hay.contains('lidah mertua') || hay.contains('sansevieria')) return '🌵';
  if (hay.contains('cabai') || hay.contains('chili')) return '🌶️';
  if (hay.contains('tomat') || hay.contains('tomato')) return '🍅';
  if (hay.contains('kemangi') || hay.contains('basil')) return '🌿';
  if (hay.contains('aloe') || hay.contains('lidah buaya')) return '🌱';
  if (hay.contains('pakcoy') || hay.contains('selada') || hay.contains('bayam') || hay.contains('sayur')) return '🥬';
  if (hay.contains('cocopeat')) return '🥥';
  if (hay.contains('humus') || hay.contains('sekam') || hay.contains('tanah')) return '🪨';
  if (hay.contains('pupuk') || hay.contains('npk') || hay.contains('nutrisi') || hay.contains('kompos')) return '🧪';
  if (hay.contains('sprayer') || hay.contains('penyiram')) return '💧';
  if (hay.contains('terakota')) return '🏺';
  if (hay.contains('rotan') || hay.contains('gantung') || hay.contains('boho')) return '🧺';
  if (hay.contains('kaktus')) return '🌵';
  if (hay.contains('bibit') || hay.contains('seed')) return '🌱';
  if (hay.contains('philodendron')) return '🌿';
  if (hay.contains('pot') || hay.contains('vas')) return '🏺';
  if (hay.contains('ceramic') || hay.contains('keramik')) return '🏺';
  if (hay.contains('ficus')) return '🌳';
  if (hay.contains('echeveria') || hay.contains('sukulen') || hay.contains('succulent')) return '🌵';
  if (hay.contains('mint')) return '🌿';
  if (hay.contains('daun bawang')) return '🧅';
  if (hay.contains('sawi')) return '🥬';
  if (hay.contains('lidah') || hay.contains('bambu')) return '🎋';

  return '🪴';
}
