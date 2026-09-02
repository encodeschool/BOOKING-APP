import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/api_service.dart';

class BusinessNameDisplay extends StatelessWidget {
  final TextStyle? style;

  const BusinessNameDisplay({this.style});

  @override
  Widget build(BuildContext context) {
    final api = Provider.of<ApiService>(context, listen: false);
    return FutureBuilder<String?>(
      future: api.getSelectedBusinessName(),
      builder: (context, snap) {
        final name = snap.data;
        if (name == null || name.isEmpty) return SizedBox.shrink();
        return Padding(
          padding: EdgeInsets.symmetric(horizontal: 12),
          child: Center(
            child: Text(
              name,
              style: style ?? TextStyle(fontWeight: FontWeight.w600),
              overflow: TextOverflow.ellipsis,
              maxLines: 1,
            ),
          ),
        );
      },
    );
  }
}
