// Google OAuth Configuration
export const GOOGLE_CONFIG = {
  // Replace with your actual Google Client ID from Google Cloud Console
  // To get a Client ID:
  // 1. Go to https://console.cloud.google.com/
  // 2. Create a new project or select existing one
  // 3. Enable Google+ API and Google OAuth2 API
  // 4. Create OAuth 2.0 Client ID for Web application
  // 5. Add your domain (including localhost for development) to authorized origins
  CLIENT_ID: 'YOUR_GOOGLE_CLIENT_ID_HERE', // 🔧 REPLACE THIS: Get your Client ID from https://console.cloud.google.com/apis/credentials

  // OAuth scopes required
  SCOPES: [
    'openid',
    'email',
    'profile'
  ],

  // Additional configuration (FedCM compliant)
  CONFIG: {
    auto_select: false,
    cancel_on_tap_outside: false, // FedCM requires this to be false
    context: 'signin',
    ux_mode: 'popup', // FedCM compliant mode
    itp_support: true,
    // FedCM specific settings
    use_fedcm: true,
    nonce: '', // Will be generated dynamically if needed
    prompt_parent_id: '' // Optional: specify parent element ID
  }
};

// Development environment check
export const isDevelopment = () => {
  return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
};

// Get authorized origins based on environment
export const getAuthorizedOrigins = () => {
  if (isDevelopment()) {
    return [
      'http://localhost:4000',
      'http://127.0.0.1:4000',
      'https://localhost:4000',
      'https://127.0.0.1:4000'
    ];
  }
  return [
    window.location.origin
  ];
};
