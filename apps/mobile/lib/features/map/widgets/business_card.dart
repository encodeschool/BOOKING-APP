import 'package:flutter/material.dart';

import '../../booking/screens/booking_sheet.dart';
import '../models/business_model.dart';

class BusinessCard extends StatelessWidget {
  final BusinessModel business;

  const BusinessCard({
    super.key,
    required this.business,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        showModalBottomSheet(
          context: context,
          isScrollControlled: true,
          backgroundColor: Colors.transparent,

          builder: (_) => BookingSheet(
            business: business,
          ),
        );
      },

      child: Container(
        margin: const EdgeInsets.all(12),
        padding: const EdgeInsets.all(16),

        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius:
          BorderRadius.circular(20),
          boxShadow: [
            BoxShadow(
              blurRadius: 10,
              color:
              Colors.black.withOpacity(0.05),
            ),
          ],
        ),

        child: Column(
          crossAxisAlignment:
          CrossAxisAlignment.start,
          children: [

            // ClipRRect(
            //   borderRadius:
            //   BorderRadius.circular(16),
            //
            //   child: Image.network(
            //     business.imageUrl ?? "",
            //     height: 180,
            //     width: double.infinity,
            //     fit: BoxFit.cover,
            //   ),
            // ),

            const SizedBox(height: 12),

            Text(
              business.name,
              style: const TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),

            const SizedBox(height: 4),

            Text(
              business.address ?? "",
            ),
          ],
        ),
      ),
    );
  }
}