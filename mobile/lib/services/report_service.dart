import '../core/network/api_client.dart';
import '../models/report_model.dart';

/// Service laporan — mengonsumsi /api/v1/reports.
class ReportService {
  final _api = ApiClient();

  /// Buat laporan: POST /reports
  Future<ReportModel> createReport({
    required String reportableType,
    required int reportableId,
    required String reason,
  }) async {
    final res = await _api.post('/reports', data: {
      'reportable_type': reportableType,
      'reportable_id': reportableId,
      'reason': reason,
    });
    return ReportModel.fromJson(res.data['data']);
  }

  /// Ambil laporan saya: GET /reports/mine
  Future<List<ReportModel>> getMyReports() async {
    final res = await _api.get('/reports/mine');
    final data = res.data['data'];
    if (data is List) {
      return data.map((e) => ReportModel.fromJson(e as Map<String, dynamic>)).toList();
    }
    return [];
  }
}
