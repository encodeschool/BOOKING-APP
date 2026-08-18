import 'package:shared_preferences/shared_preferences.dart';

class AuthStorage {
  AuthStorage({SharedPreferences? preferences}) : _preferences = preferences;

  final SharedPreferences? _preferences;

  static const _tokenKey = 'auth_token';
  static const _emailKey = 'auth_email';

  Future<SharedPreferences> _getPreferences() async {
    return _preferences ?? await SharedPreferences.getInstance();
  }

  Future<void> saveToken(String token) async {
    final prefs = await _getPreferences();
    await prefs.setString(_tokenKey, token);
  }

  Future<String?> getToken() async {
    final prefs = await _getPreferences();
    return prefs.getString(_tokenKey);
  }

  Future<void> saveEmail(String email) async {
    final prefs = await _getPreferences();
    await prefs.setString(_emailKey, email);
  }

  Future<String?> getEmail() async {
    final prefs = await _getPreferences();
    return prefs.getString(_emailKey);
  }

  Future<void> clear() async {
    final prefs = await _getPreferences();
    await prefs.remove(_tokenKey);
    await prefs.remove(_emailKey);
  }
}
