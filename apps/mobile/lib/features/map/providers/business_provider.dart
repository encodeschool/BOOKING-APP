import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/api/api_client.dart';
import '../../../core/data/mock.dart';
import '../models/business_model.dart';

const bool useMockData = true; // TODO: WHENEVER BACKEND IS READY NEED TO CHANGE TO FALSE

final businessesProvider =
FutureProvider<List<BusinessModel>>((ref) async {

  if (useMockData) {
    await Future.delayed(const Duration(milliseconds: 500));
    return mockBusinesses;
  }

  final data = await apiClient.getBusinesses();

  return data
      .map<BusinessModel>((e) => BusinessModel.fromJson(e))
      .toList();
});