import 'package:flutter/material.dart';

class StaffBottomNav extends StatelessWidget {
  final int currentIndex;
  final ValueChanged<int> onTap;

  const StaffBottomNav({required this.currentIndex, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final color = Theme.of(context).primaryColor;
    return SafeArea(
      top: false,
      child: BottomAppBar(
        shape: CircularNotchedRectangle(),
        notchMargin: 6.0,
        child: SizedBox(
          // height: 64,
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8.0, vertical: 6.0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _NavItem(
                  icon: Icons.dashboard,
                  label: 'Dashboard',
                  active: currentIndex == 0,
                  color: color,
                  onTap: () => onTap(0),
                ),
                _NavItem(
                  icon: Icons.calendar_today,
                  label: 'Calendar',
                  active: currentIndex == 1,
                  color: color,
                  onTap: () => onTap(1),
                ),
                _NavItem(
                  icon: Icons.person,
                  label: 'Profile',
                  active: currentIndex == 2,
                  color: color,
                  onTap: () => onTap(2),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _NavItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final bool active;
  final Color color;
  final VoidCallback onTap;

  const _NavItem({
    required this.icon,
    required this.label,
    required this.active,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 0.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(icon, color: active ? color : Colors.grey),
              // const SizedBox(height: 4),
              Text(
                label,
                style: TextStyle(
                  fontSize: 12,
                  color: active ? color : Colors.grey,
                  fontWeight: active ? FontWeight.w600 : FontWeight.w500,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
