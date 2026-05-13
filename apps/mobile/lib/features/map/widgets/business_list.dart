import 'package:flutter/material.dart';

import '../models/business_model.dart';
import 'business_card.dart';

class BusinessList extends StatelessWidget {
  final List<BusinessModel> businesses;
  final ScrollController scrollController;

  final Function(BusinessModel) onBusinessTap;

  const BusinessList({
    super.key,
    required this.businesses,
    required this.scrollController,
    required this.onBusinessTap,
  });

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      controller: scrollController,
      padding: const EdgeInsets.all(16),
      itemCount: businesses.length,
      itemBuilder: (context, index) {
        return BusinessCard(
          business: businesses[index],
          onTap: () => onBusinessTap(
            businesses[index],
          ),
        );
      },
    );
  }
}