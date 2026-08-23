// ============================================================
// AUTHENTICATION CONFIGURATION
// ============================================================

export const AUTH_CONFIG = {
  accessTokenKey:  'tf_access_token',
  refreshTokenKey: 'tf_refresh_token',
  tokenPrefix:     'Bearer',
  tokenHeader:     'Authorization',
  // Token expiry grace period (refresh 60s before actual expiry)
  expiryGracePeriodMs: 60_000,
} as const;
