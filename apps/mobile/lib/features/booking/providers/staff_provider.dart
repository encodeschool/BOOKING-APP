import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/api/api_client.dart';
import '../models/staff_model.dart';

final staffProvider =
FutureProvider.family<
    List<StaffModel>,
    int
>((ref, businessId) async {
  final data =
  await apiClient.getStaff(
    businessId,
  );

  return data
      .map<StaffModel>(
        (e) => StaffModel.fromJson(e),
  )
      .toList();
});