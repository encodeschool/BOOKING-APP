import 'package:flutter/material.dart';

import '../models/business_model.dart';

class BusinessCard extends StatelessWidget {
  final BusinessModel business;

  final VoidCallback onTap;

  const BusinessCard({
    super.key,
    required this.business,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,

      child: Container(
        margin: const EdgeInsets.only(bottom: 18),

        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(24),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.06),
              blurRadius: 18,
              offset: const Offset(0, 8),
            ),
          ],
        ),

        child: Column(
          crossAxisAlignment:
          CrossAxisAlignment.start,
          children: [
            ClipRRect(
              borderRadius:
              const BorderRadius.vertical(
                top: Radius.circular(24),
              ),
              child: Image.network(
                business.imageUrl ??
                    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
                height: 190,
                width: double.infinity,
                fit: BoxFit.cover,
              ),
            ),

            Padding(
              padding: const EdgeInsets.all(18),
              child: Column(
                crossAxisAlignment:
                CrossAxisAlignment.start,
                children: [
                  Text(
                    business.name,
                    style: const TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.w800,
                    ),
                  ),

                  const SizedBox(height: 8),

                  Text(
                    business.address ??
                        'Unknown location',
                    style: TextStyle(
                      color: Colors.grey.shade700,
                    ),
                  ),

                  const SizedBox(height: 16),

                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton.icon(
                      onPressed: onTap,

                      style:
                      ElevatedButton.styleFrom(
                        backgroundColor:
                        Colors.black,
                        foregroundColor:
                        Colors.white,
                        elevation: 0,
                        padding:
                        const EdgeInsets.symmetric(
                          vertical: 14,
                        ),
                        shape:
                        RoundedRectangleBorder(
                          borderRadius:
                          BorderRadius.circular(
                            16,
                          ),
                        ),
                      ),

                      icon: const Icon(
                        Icons.calendar_month_rounded,
                      ),

                      label: const Text(
                        'Book Now',
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}