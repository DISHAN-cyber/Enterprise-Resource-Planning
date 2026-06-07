class LoginResponse {
  final String accessToken;
  final String refreshToken;
  final String tokenType;
  final int expiresIn;

  LoginResponse({
    required this.accessToken,
    required this.refreshToken,
    required this.tokenType,
    required this.expiresIn,
  });

  factory LoginResponse.fromJson(Map<String, dynamic> json) {
    return LoginResponse(
      accessToken: (json['access_token'] ?? json['accessToken'])?.toString() ?? '',
      refreshToken: (json['refresh_token'] ?? json['refreshToken'])?.toString() ?? '',
      tokenType: (json['token_type'] ?? json['tokenType'])?.toString() ?? 'Bearer',
      expiresIn: (() {
        final val = json['expires_in'] ?? json['expiresIn'];
        if (val == null) return 0;
        if (val is int) return val;
        return int.tryParse(val.toString()) ?? 0;
      })(),
    );
  }
}
