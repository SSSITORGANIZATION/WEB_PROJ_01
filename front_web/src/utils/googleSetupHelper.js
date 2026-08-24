// Google OAuth Setup Helper
// This utility helps with Google OAuth setup and validation

export const validateGoogleConfig = () => {
  const { GOOGLE_CONFIG } = require('../config/googleAuth');
  
  const issues = [];
  
  // Check if Client ID is configured
  if (!GOOGLE_CONFIG.CLIENT_ID || GOOGLE_CONFIG.CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID_HERE') {
    issues.push({
      type: 'error',
      message: 'Google Client ID is not configured',
      solution: 'Follow GOOGLE_OAUTH_SETUP.md to get a Client ID from Google Cloud Console'
    });
  }
  
  // Check Client ID format
  if (GOOGLE_CONFIG.CLIENT_ID && !GOOGLE_CONFIG.CLIENT_ID.includes('.googleusercontent.com')) {
    issues.push({
      type: 'warning',
      message: 'Client ID format may be incorrect',
      solution: 'Client ID should end with .googleusercontent.com'
    });
  }
  
  // Check environment
  const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  if (!isDev && window.location.protocol !== 'https:') {
    issues.push({
      type: 'error',
      message: 'Production environment requires HTTPS',
      solution: 'Use HTTPS in production for Google OAuth to work'
    });
  }
  
  return issues;
};

export const getGoogleSetupInstructions = () => {
  return `
🔧 QUICK GOOGLE OAUTH SETUP:

1️⃣ Go to: https://console.cloud.google.com/
2️⃣ Create/select project
3️⃣ Enable "Google Identity Services API"
4️⃣ Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5️⃣ Select "Web application"
6️⃣ Add authorized origins:
   • Development: http://localhost:4000
   • Production: https://yourdomain.com
7️⃣ Copy the Client ID
8️⃣ Update src/config/googleAuth.js:
   Replace YOUR_GOOGLE_CLIENT_ID_HERE with your actual Client ID

📋 TROUBLESHOOTING:
• "Client ID not found" → Check Client ID is correct
• "Origin not allowed" → Add your domain to authorized origins
• "Popup blocked" → Allow popups for your site

✅ After setup, restart your dev server and test the Google login button.
`;
};

export const testGoogleConfig = async () => {
  const issues = validateGoogleConfig();
  
  if (issues.length > 0) {
    console.group('🔍 Google OAuth Configuration Issues');
    issues.forEach(issue => {
      console[issue.type](`❌ ${issue.message}`);
      console.log(`💡 Solution: ${issue.solution}`);
    });
    console.groupEnd();
    
    if (issues.some(i => i.type === 'error')) {
      console.log('\n' + getGoogleSetupInstructions());
      return false;
    }
  } else {
    console.log('✅ Google OAuth configuration looks good!');
    return true;
  }
  
  return true;
};

// Auto-test on import in development
if (process.env.NODE_ENV === 'development') {
  setTimeout(() => {
    testGoogleConfig();
  }, 1000);
}
