import 'package:flutter/material.dart';

import 'screens/login_screen.dart';
import 'screens/main_screen.dart';
import 'services/api_service.dart';
import 'services/auth_service.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await AuthService.init();

  if (AuthService.token != null && AuthService.token!.isNotEmpty) {
    ApiService.token = AuthService.token;
  }

  runApp(ErpFinanceMobileApp(initialToken: AuthService.token));
}

class ErpFinanceMobileApp extends StatelessWidget {
  final String? initialToken;

  const ErpFinanceMobileApp({super.key, this.initialToken});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'ERP Finance Mobile',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.indigo),
        useMaterial3: true,
      ),
      home: initialToken != null ? const MainScreen() : const LoginScreen(),
    );
  }
}
