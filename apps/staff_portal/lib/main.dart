import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'pages/login_page.dart';
import 'pages/dashboard_page.dart';
import 'pages/calendar_page.dart';
import 'pages/profile_page.dart';
import 'services/api_service.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  final api = ApiService();
  runApp(MultiProvider(
    providers: [Provider<ApiService>(create: (_) => api)],
    child: StaffApp(),
  ));
}

class StaffApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Staff Portal',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      debugShowCheckedModeBanner: false,
      home: LoginPage(),
      routes: {
        '/dashboard': (_) => DashboardPage(),
        '/calendar': (_) => CalendarPage(),
        '/profile': (_) => ProfilePage(),
      },
    );
  }
}
