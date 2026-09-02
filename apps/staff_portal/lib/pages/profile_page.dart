import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/api_service.dart';
import '../models/user.dart';
import '../widgets/business_name.dart';

class ProfilePage extends StatefulWidget {
  @override
  _ProfilePageState createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  User? _user;
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() => _loading = true);
    final api = Provider.of<ApiService>(context, listen: false);
    final u = await api.getProfile();
    setState(() {
      _user = u;
      _loading = false;
    });
  }

  void _signOut() async {
    final api = Provider.of<ApiService>(context, listen: false);
    await api.logout();
    Navigator.pushReplacementNamed(context, '/');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Profile'), actions: [
        Padding(
            padding: EdgeInsets.only(right: 4), child: BusinessNameDisplay())
      ]),
      body: _loading
          ? Center(child: CircularProgressIndicator())
          : Padding(
              padding: EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(_user?.name ?? '—',
                      style: Theme.of(context).textTheme.headlineMedium),
                  SizedBox(height: 8),
                  Text('Email: ${_user?.email ?? ''}'),
                  SizedBox(height: 8),
                  Text('Role: ${_user?.role ?? ''}'),
                  Spacer(),
                  ElevatedButton(onPressed: _signOut, child: Text('Sign out'))
                ],
              ),
            ),
    );
  }
}
