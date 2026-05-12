import 'package:flutter/material.dart';

import '../models/business_model.dart';
import 'business_card.dart';

class BusinessList extends StatelessWidget {
  final List<BusinessModel> businesses;

  final ScrollController
  scrollController;

  const BusinessList({
    super.key,
    required this.businesses,
    required this.scrollController,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [

        // HANDLE
        Container(
          margin: const EdgeInsets.only(
            top: 10,
            bottom: 10,
          ),
          width: 60,
          height: 6,
          decoration: BoxDecoration(
            color: Colors.grey.shade300,
            borderRadius:
            BorderRadius.circular(20),
          ),
        ),

        Expanded(
          child: ListView.builder(
            controller: scrollController,
            itemCount: businesses.length,
            itemBuilder: (context, index) {
              return BusinessCard(
                business: businesses[index],
              );
            },
          ),
        ),
      ],
    );
  }
}