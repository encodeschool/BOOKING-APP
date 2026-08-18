import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';

import '../models/business_model.dart';

class MapWidget extends StatelessWidget {
  final List<BusinessModel> businesses;
  final LatLng? userLocation;
  final VoidCallback? onLocate;

  const MapWidget({
    super.key,
    required this.businesses,
    this.userLocation,
    this.onLocate,
  });

  @override
  Widget build(BuildContext context) {
    final initialCenter = userLocation ?? const LatLng(56.9496, 24.1052);

    return Stack(
      children: [
        FlutterMap(
          options: MapOptions(initialCenter: initialCenter, initialZoom: 13),
          children: [
            TileLayer(
              urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
              userAgentPackageName: 'uz.encode.fresh',
            ),
            MarkerLayer(
              markers: businesses.map((business) {
                return Marker(
                  point: LatLng(business.latitude, business.longitude),
                  width: 50,
                  height: 50,
                  child: const Icon(
                    Icons.location_on,
                    color: Colors.red,
                    size: 40,
                  ),
                );
              }).toList(),
            ),
          ],
        ),
        if (onLocate != null)
          Positioned(
            bottom: 24,
            right: 24,
            child: FloatingActionButton.small(
              heroTag: 'locate-map',
              onPressed: onLocate,
              child: const Icon(Icons.my_location_rounded),
            ),
          ),
      ],
    );
  }
}
