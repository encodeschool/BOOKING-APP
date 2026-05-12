import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/api/api_client.dart';
import '../models/business_model.dart';

final businessesProvider =
FutureProvider<List<BusinessModel>>(
      (ref) async {
    final data =
    await apiClient.getBusinesses();

    return data
        .map<BusinessModel>(
          (e) => BusinessModel.fromJson(e),
    )
        .toList();
  },
);