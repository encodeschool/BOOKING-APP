import 'package:flutter/material.dart';

import '../models/business_model.dart';

class BusinessCard extends StatelessWidget {
  final BusinessModel business;

  final VoidCallback onTap;

  const BusinessCard({super.key, required this.business, required this.onTap});

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
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            ClipRRect(
              borderRadius: const BorderRadius.vertical(
                top: Radius.circular(24),
              ),
              child: _BusinessImageSlider(images: business.images),
            ),

            Padding(
              padding: const EdgeInsets.all(18),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
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
                    business.address ?? 'Unknown location',
                    style: TextStyle(color: Colors.grey.shade700),
                  ),

                  const SizedBox(height: 16),

                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton.icon(
                      onPressed: onTap,

                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.black,
                        foregroundColor: Colors.white,
                        elevation: 0,
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16),
                        ),
                      ),

                      icon: const Icon(Icons.calendar_month_rounded),

                      label: const Text('Book Now'),
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

class _BusinessImageSlider extends StatefulWidget {
  final List<String>? images;

  const _BusinessImageSlider({this.images});

  @override
  State<_BusinessImageSlider> createState() => _BusinessImageSliderState();
}

class _BusinessImageSliderState extends State<_BusinessImageSlider> {
  final PageController _controller = PageController();
  int _index = 0;

  List<String> get images {
    final imgs = widget.images ?? [];
    if (imgs.isEmpty) {
      return ["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4"];
    }
    return imgs;
  }

  String fixUrl(String url) {
    if (url.startsWith("http")) return url;
    return "http://localhost:8080$url";
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        SizedBox(
          height: 190,
          width: double.infinity,
          child: PageView.builder(
            controller: _controller,
            itemCount: images.length,
            onPageChanged: (i) {
              setState(() => _index = i);
            },
            itemBuilder: (context, i) {
              return Image.network(
                fixUrl(images[i]),
                fit: BoxFit.cover,
                width: double.infinity,
              );
            },
          ),
        ),

        // LEFT ARROW
        if (images.length > 1)
          Positioned(
            left: 8,
            top: 80,
            child: _arrowButton(Icons.chevron_left, () {
              if (_index > 0) {
                _controller.previousPage(
                  duration: const Duration(milliseconds: 300),
                  curve: Curves.easeInOut,
                );
              }
            }),
          ),

        // RIGHT ARROW
        if (images.length > 1)
          Positioned(
            right: 8,
            top: 80,
            child: _arrowButton(Icons.chevron_right, () {
              if (_index < images.length - 1) {
                _controller.nextPage(
                  duration: const Duration(milliseconds: 300),
                  curve: Curves.easeInOut,
                );
              }
            }),
          ),

        // DOTS
        if (images.length > 1)
          Positioned(
            bottom: 10,
            left: 0,
            right: 0,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: List.generate(
                images.length,
                (i) => Container(
                  margin: const EdgeInsets.symmetric(horizontal: 3),
                  width: _index == i ? 10 : 6,
                  height: _index == i ? 10 : 6,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: _index == i ? Colors.white : Colors.white54,
                  ),
                ),
              ),
            ),
          ),
      ],
    );
  }

  Widget _arrowButton(IconData icon, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(6),
        decoration: BoxDecoration(
          color: Colors.black.withOpacity(0.4),
          shape: BoxShape.circle,
        ),
        child: Icon(icon, color: Colors.white, size: 22),
      ),
    );
  }
}
