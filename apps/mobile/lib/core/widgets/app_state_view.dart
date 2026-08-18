import 'package:flutter/material.dart';

class AppStateView extends StatelessWidget {
  final bool isLoading;
  final bool isRefreshing;
  final bool isOffline;
  final String title;
  final String description;
  final IconData icon;
  final String? actionLabel;
  final VoidCallback? onAction;
  final Widget? child;

  const AppStateView({
    super.key,
    this.isLoading = false,
    this.isRefreshing = false,
    this.isOffline = false,
    required this.title,
    required this.description,
    required this.icon,
    this.actionLabel,
    this.onAction,
    this.child,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Center(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 28),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                color: theme.colorScheme.primary.withOpacity(0.12),
                borderRadius: BorderRadius.circular(24),
              ),
              child: Icon(icon, size: 42, color: theme.colorScheme.primary),
            ),
            const SizedBox(height: 20),
            Text(
              title,
              style: theme.textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.w700,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 8),
            Text(
              description,
              style: theme.textTheme.bodyMedium?.copyWith(
                color: theme.colorScheme.onSurfaceVariant,
              ),
              textAlign: TextAlign.center,
            ),
            if (isLoading || isRefreshing) ...[
              const SizedBox(height: 24),
              SizedBox(
                width: 220,
                child: Column(
                  children: [
                    LinearProgressIndicator(
                      minHeight: 6,
                      borderRadius: BorderRadius.circular(999),
                    ),
                    const SizedBox(height: 12),
                    Text(
                      isRefreshing
                          ? 'Refreshing content…'
                          : 'Loading your experience…',
                      style: theme.textTheme.bodySmall?.copyWith(
                        color: theme.colorScheme.onSurfaceVariant,
                      ),
                    ),
                  ],
                ),
              ),
            ],
            if (actionLabel != null && onAction != null) ...[
              const SizedBox(height: 20),
              FilledButton.icon(
                onPressed: onAction,
                icon: const Icon(Icons.refresh_rounded),
                label: Text(actionLabel!),
              ),
            ],
            if (child != null) ...[const SizedBox(height: 20), child!],
          ],
        ),
      ),
    );
  }
}
