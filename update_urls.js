const fs = require('fs');
const files = [
  'apps/web/src/components/VoiceMatcher.tsx',
  'apps/web/src/components/FloatingChatbot.tsx',
  'apps/web/src/components/DocSimplifier.tsx',
  'apps/web/src/components/AuthModal.tsx'
];
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace(/const API_URL = process\.env\.NEXT_PUBLIC_API_URL \|\| ["']http:\/\/localhost:4000["'];/g, 'const API_URL = ""; // Handled by Next.js rewrites proxy');
  content = content.replace(/const apiUrl = process\.env\.NEXT_PUBLIC_API_URL \|\| ["']http:\/\/localhost:4000["'];/g, 'const apiUrl = ""; // Handled by Next.js rewrites proxy');
  fs.writeFileSync(f, content);
  console.log('Updated ' + f);
});
