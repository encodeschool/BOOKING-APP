import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/api/api_client.dart';
import '../models/service_model.dart';

final servicesProvider =
FutureProvider.family<
    List<ServiceModel>,
    int
>((ref, businessId) async {
  final data =
  await apiClient.getServices(
    businessId,
  );

  return data
      .map<ServiceModel>(
        (e) => ServiceModel.fromJson(e),
  )
      .toList();
});