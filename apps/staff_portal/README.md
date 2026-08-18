Staff Portal (Flutter)

Quick start:

1. Install Flutter SDK (see https://flutter.dev/docs/get-started/install)
2. From this folder run:

```bash
flutter pub get
flutter run
```

Notes:
- The app uses `ApiService.baseUrl` pointing to `http://10.0.2.2:8080` by default. Adjust `lib/services/api_service.dart` to match your backend host.
- Android emulator should use `10.0.2.2` to reach host machine `localhost`.
- Implemented pages: login, dashboard, calendar, profile. Calendar uses `table_calendar` package.
