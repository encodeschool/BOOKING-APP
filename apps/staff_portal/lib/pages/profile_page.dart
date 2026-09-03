import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../models/user.dart';
import '../services/api_service.dart';
import '../widgets/business_name.dart';

class ProfilePage extends StatefulWidget {
  const ProfilePage({Key? key}) : super(key: key);

  @override
  State<ProfilePage> createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  User? _user;
  bool _loading = true;
  bool _signingOut = false;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    if (mounted) {
      setState(() => _loading = true);
    }

    try {
      final api = Provider.of<ApiService>(
        context,
        listen: false,
      );

      final u = await api.getProfile();

      if (!mounted) return;

      setState(() {
        _user = u;
        _loading = false;
      });
    } catch (e) {
      if (!mounted) return;

      setState(() => _loading = false);

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          behavior: SnackBarBehavior.floating,
          content: Text(
            'Failed to load profile: $e',
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
          ),
        ),
      );
    }
  }

  Future<void> _signOut() async {
    if (_signingOut) return;

    final confirmed = await showDialog<bool>(
      context: context,
      builder: (dialogContext) {
        final theme = Theme.of(dialogContext);
        final scheme = theme.colorScheme;

        return AlertDialog(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(24),
          ),
          title: Row(
            children: [
              Container(
                width: 42,
                height: 42,
                decoration: BoxDecoration(
                  color: Colors.red.withOpacity(0.10),
                  borderRadius: BorderRadius.circular(13),
                ),
                child: const Icon(
                  Icons.logout_rounded,
                  color: Colors.red,
                ),
              ),
              const SizedBox(width: 12),
              const Expanded(
                child: Text(
                  'Sign out?',
                  style: TextStyle(
                    fontWeight: FontWeight.w800,
                  ),
                ),
              ),
            ],
          ),
          content: Text(
            'Are you sure you want to sign out of your account?',
            style: theme.textTheme.bodyMedium?.copyWith(
              height: 1.45,
              color: theme.textTheme.bodyMedium?.color?.withOpacity(0.65),
            ),
          ),
          actionsPadding: const EdgeInsets.fromLTRB(
            20,
            0,
            20,
            18,
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.pop(dialogContext, false);
              },
              child: const Text('Cancel'),
            ),
            FilledButton(
              style: FilledButton.styleFrom(
                backgroundColor: scheme.error,
                foregroundColor: scheme.onError,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              onPressed: () {
                Navigator.pop(dialogContext, true);
              },
              child: const Text('Sign out'),
            ),
          ],
        );
      },
    );

    if (confirmed != true || !mounted) return;

    setState(() => _signingOut = true);

    try {
      final api = Provider.of<ApiService>(
        context,
        listen: false,
      );

      await api.logout();

      if (!mounted) return;

      Navigator.pushReplacementNamed(
        context,
        '/',
      );
    } catch (e) {
      if (!mounted) return;

      setState(() => _signingOut = false);

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          behavior: SnackBarBehavior.floating,
          content: Text(
            'Sign out failed: $e',
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
          ),
        ),
      );
    }
  }

  String _initials(String? name) {
    final value = name?.trim() ?? '';

    if (value.isEmpty) return 'U';

    final parts = value
        .split(RegExp(r'\s+'))
        .where((e) => e.isNotEmpty)
        .toList();

    if (parts.length == 1) {
      return parts.first.substring(0, 1).toUpperCase();
    }

    return '${parts.first.substring(0, 1)}'
        '${parts.last.substring(0, 1)}'
        .toUpperCase();
  }

  String _displayRole(String? role) {
    final value = role?.trim() ?? '';

    if (value.isEmpty) return 'Staff';

    return value
        .replaceAll('_', ' ')
        .replaceAll('-', ' ')
        .split(' ')
        .where((e) => e.isNotEmpty)
        .map(
          (word) =>
      '${word.substring(0, 1).toUpperCase()}${word.substring(1).toLowerCase()}',
    )
        .join(' ');
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final scheme = theme.colorScheme;

    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      appBar: AppBar(
        elevation: 0,
        scrolledUnderElevation: 0,
        backgroundColor: theme.scaffoldBackgroundColor,
        surfaceTintColor: Colors.transparent,
        automaticallyImplyLeading: false,
        toolbarHeight: 76,
        titleSpacing: 20,
        title: Row(
          children: [
            Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                color: scheme.primary.withOpacity(0.10),
                borderRadius: BorderRadius.circular(14),
              ),
              child: Icon(
                Icons.person_rounded,
                color: scheme.primary,
                size: 23,
              ),
            ),
            const SizedBox(width: 12),
            const Expanded(
              child: Text(
                'Profile',
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: TextStyle(
                  fontSize: 23,
                  fontWeight: FontWeight.w800,
                  letterSpacing: -0.5,
                ),
              ),
            ),
          ],
        ),
        actions: [
          Container(
            constraints: const BoxConstraints(
              maxWidth: 180,
            ),
            margin: const EdgeInsets.only(
              right: 16,
              top: 15,
              bottom: 15,
            ),
            padding: const EdgeInsets.symmetric(
              horizontal: 12,
            ),
            decoration: BoxDecoration(
              color: theme.cardColor,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(
                color: theme.dividerColor.withOpacity(0.6),
              ),
            ),
            alignment: Alignment.center,
            child: BusinessNameDisplay(),
          ),
        ],
      ),
      body: _loading
          ? Center(
        child: CircularProgressIndicator(
          strokeWidth: 2.5,
          color: scheme.primary,
        ),
      )
          : RefreshIndicator(
        onRefresh: _load,
        color: scheme.primary,
        child: LayoutBuilder(
          builder: (context, constraints) {
            final isWide = constraints.maxWidth >= 850;

            return SingleChildScrollView(
              physics: const AlwaysScrollableScrollPhysics(
                parent: BouncingScrollPhysics(),
              ),
              padding: EdgeInsets.fromLTRB(
                isWide ? 28 : 16,
                8,
                isWide ? 28 : 16,
                32,
              ),
              child: Center(
                child: ConstrainedBox(
                  constraints: const BoxConstraints(
                    maxWidth: 900,
                  ),
                  child: Column(
                    children: [
                      _buildProfileHero(
                        context,
                        isWide: isWide,
                      ),
                      const SizedBox(height: 18),
                      _buildAccountSection(
                        context,
                        isWide: isWide,
                      ),
                      const SizedBox(height: 18),
                      _buildSecuritySection(
                        context,
                      ),
                      const SizedBox(height: 24),
                      _buildSignOutButton(
                        context,
                      ),
                    ],
                  ),
                ),
              ),
            );
          },
        ),
      ),
    );
  }

  Widget _buildProfileHero(
      BuildContext context, {
        required bool isWide,
      }) {
    final theme = Theme.of(context);
    final scheme = theme.colorScheme;

    final name = _user?.name?.trim().isNotEmpty == true
        ? _user!.name!.trim()
        : 'User';

    final role = _displayRole(_user?.role);

    return Container(
      width: double.infinity,
      padding: EdgeInsets.all(isWide ? 28 : 22),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            scheme.primary,
            Color.lerp(
              scheme.primary,
              scheme.secondary,
              0.55,
            ) ??
                scheme.primary,
          ],
        ),
        borderRadius: BorderRadius.circular(28),
        boxShadow: [
          BoxShadow(
            color: scheme.primary.withOpacity(0.20),
            blurRadius: 30,
            offset: const Offset(0, 14),
          ),
        ],
      ),
      child: isWide
          ? Row(
        children: [
          _buildAvatar(
            context,
            large: true,
          ),
          const SizedBox(width: 20),
          Expanded(
            child: _buildHeroText(
              context,
              name,
              role,
            ),
          ),
          const SizedBox(width: 20),
          _buildVerifiedBadge(),
        ],
      )
          : Column(
        children: [
          _buildAvatar(
            context,
            large: true,
          ),
          const SizedBox(height: 16),
          _buildHeroText(
            context,
            name,
            role,
            centered: true,
          ),
          const SizedBox(height: 16),
          _buildVerifiedBadge(),
        ],
      ),
    );
  }

  Widget _buildAvatar(
      BuildContext context, {
        bool large = false,
      }) {
    final size = large ? 82.0 : 58.0;
    final name = _user?.name;

    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.16),
        shape: BoxShape.circle,
        border: Border.all(
          color: Colors.white.withOpacity(0.25),
          width: 2,
        ),
      ),
      child: Center(
        child: Text(
          _initials(name),
          style: TextStyle(
            color: Colors.white,
            fontSize: large ? 27 : 20,
            fontWeight: FontWeight.w800,
          ),
        ),
      ),
    );
  }

  Widget _buildHeroText(
      BuildContext context,
      String name,
      String role, {
        bool centered = false,
      }) {
    final theme = Theme.of(context);

    return Column(
      crossAxisAlignment:
      centered ? CrossAxisAlignment.center : CrossAxisAlignment.start,
      children: [
        Text(
          name,
          textAlign: centered ? TextAlign.center : TextAlign.start,
          maxLines: 2,
          overflow: TextOverflow.ellipsis,
          style: const TextStyle(
            color: Colors.white,
            fontSize: 25,
            height: 1.15,
            fontWeight: FontWeight.w800,
            letterSpacing: -0.5,
          ),
        ),
        const SizedBox(height: 6),
        Text(
          role,
          textAlign: centered ? TextAlign.center : TextAlign.start,
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
          style: TextStyle(
            color: Colors.white.withOpacity(0.78),
            fontSize: 14,
            fontWeight: FontWeight.w600,
          ),
        ),
        if (_user?.email?.isNotEmpty == true) ...[
          const SizedBox(height: 6),
          Text(
            _user!.email!,
            textAlign: centered ? TextAlign.center : TextAlign.start,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: TextStyle(
              color: Colors.white.withOpacity(0.70),
              fontSize: 13,
            ),
          ),
        ],
      ],
    );
  }

  Widget _buildVerifiedBadge() {
    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: 13,
        vertical: 9,
      ),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.12),
        borderRadius: BorderRadius.circular(999),
        border: Border.all(
          color: Colors.white.withOpacity(0.18),
        ),
      ),
      child: const Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            Icons.verified_rounded,
            color: Colors.white,
            size: 17,
          ),
          SizedBox(width: 6),
          Text(
            'Account active',
            style: TextStyle(
              color: Colors.white,
              fontSize: 12,
              fontWeight: FontWeight.w700,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAccountSection(
      BuildContext context, {
        required bool isWide,
      }) {
    final theme = Theme.of(context);

    return _buildSectionCard(
      context,
      title: 'Account information',
      subtitle: 'Your personal account details',
      icon: Icons.account_circle_rounded,
      child: isWide
          ? Row(
        children: [
          Expanded(
            child: _buildInfoTile(
              context,
              icon: Icons.person_outline_rounded,
              label: 'Full name',
              value: _user?.name?.isNotEmpty == true
                  ? _user!.name!
                  : 'Not provided',
            ),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: _buildInfoTile(
              context,
              icon: Icons.email_outlined,
              label: 'Email address',
              value: _user?.email?.isNotEmpty == true
                  ? _user!.email!
                  : 'Not provided',
            ),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: _buildInfoTile(
              context,
              icon: Icons.badge_outlined,
              label: 'Role',
              value: _displayRole(_user?.role),
            ),
          ),
        ],
      )
          : Column(
        children: [
          _buildInfoTile(
            context,
            icon: Icons.person_outline_rounded,
            label: 'Full name',
            value: _user?.name?.isNotEmpty == true
                ? _user!.name!
                : 'Not provided',
          ),
          const SizedBox(height: 10),
          _buildInfoTile(
            context,
            icon: Icons.email_outlined,
            label: 'Email address',
            value: _user?.email?.isNotEmpty == true
                ? _user!.email!
                : 'Not provided',
          ),
          const SizedBox(height: 10),
          _buildInfoTile(
            context,
            icon: Icons.badge_outlined,
            label: 'Role',
            value: _displayRole(_user?.role),
          ),
        ],
      ),
    );
  }

  Widget _buildInfoTile(
      BuildContext context, {
        required IconData icon,
        required String label,
        required String value,
      }) {
    final theme = Theme.of(context);
    final scheme = theme.colorScheme;

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(15),
      decoration: BoxDecoration(
        color: theme.scaffoldBackgroundColor.withOpacity(0.55),
        borderRadius: BorderRadius.circular(17),
        border: Border.all(
          color: theme.dividerColor.withOpacity(0.45),
        ),
      ),
      child: Row(
        children: [
          Container(
            width: 42,
            height: 42,
            decoration: BoxDecoration(
              color: scheme.primary.withOpacity(0.09),
              borderRadius: BorderRadius.circular(13),
            ),
            child: Icon(
              icon,
              color: scheme.primary,
              size: 20,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: theme.textTheme.bodySmall?.copyWith(
                    color: theme.textTheme.bodySmall?.color?.withOpacity(0.55),
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  value,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: theme.textTheme.bodyMedium?.copyWith(
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionCard(
      BuildContext context, {
        required String title,
        required String subtitle,
        required IconData icon,
        required Widget child,
      }) {
    final theme = Theme.of(context);
    final scheme = theme.colorScheme;

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: theme.cardColor,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(
          color: theme.dividerColor.withOpacity(0.55),
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.03),
            blurRadius: 18,
            offset: const Offset(0, 7),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 42,
                height: 42,
                decoration: BoxDecoration(
                  color: scheme.primary.withOpacity(0.09),
                  borderRadius: BorderRadius.circular(13),
                ),
                child: Icon(
                  icon,
                  color: scheme.primary,
                  size: 21,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: theme.textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      subtitle,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: theme.textTheme.bodySmall?.copyWith(
                        color:
                        theme.textTheme.bodySmall?.color?.withOpacity(0.55),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          child,
        ],
      ),
    );
  }

  Widget _buildSecuritySection(BuildContext context) {
    return _buildSectionCard(
      context,
      title: 'Account security',
      subtitle: 'Your account and session',
      icon: Icons.shield_outlined,
      child: Container(
        padding: const EdgeInsets.all(15),
        decoration: BoxDecoration(
          color: Colors.green.withOpacity(0.055),
          borderRadius: BorderRadius.circular(17),
          border: Border.all(
            color: Colors.green.withOpacity(0.14),
          ),
        ),
        child: Row(
          children: [
            Container(
              width: 42,
              height: 42,
              decoration: BoxDecoration(
                color: Colors.green.withOpacity(0.10),
                borderRadius: BorderRadius.circular(13),
              ),
              child: const Icon(
                Icons.lock_outline_rounded,
                color: Colors.green,
                size: 20,
              ),
            ),
            const SizedBox(width: 12),
            const Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Session secured',
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                  SizedBox(height: 3),
                  Text(
                    'Your account is currently signed in securely.',
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(
                      fontSize: 12,
                      height: 1.35,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(width: 8),
            Container(
              width: 9,
              height: 9,
              decoration: const BoxDecoration(
                color: Colors.green,
                shape: BoxShape.circle,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSignOutButton(BuildContext context) {
    final theme = Theme.of(context);
    final scheme = theme.colorScheme;

    return SizedBox(
      width: double.infinity,
      height: 54,
      child: OutlinedButton.icon(
        onPressed: _signingOut ? null : _signOut,
        icon: _signingOut
            ? SizedBox(
          width: 18,
          height: 18,
          child: CircularProgressIndicator(
            strokeWidth: 2,
            color: scheme.error,
          ),
        )
            : Icon(
          Icons.logout_rounded,
          color: scheme.error,
        ),
        label: Text(
          _signingOut ? 'Signing out...' : 'Sign out',
          style: TextStyle(
            color: scheme.error,
            fontWeight: FontWeight.w700,
          ),
        ),
        style: OutlinedButton.styleFrom(
          side: BorderSide(
            color: scheme.error.withOpacity(0.28),
          ),
          backgroundColor: scheme.error.withOpacity(0.035),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(17),
          ),
        ),
      ),
    );
  }
}
