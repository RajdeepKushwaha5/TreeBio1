const testUrls = [
  'https://github.com/username',
  'https://twitter.com/username',
  'https://linkedin.com/in/username',
  'https://instagram.com/username',
  'https://youtube.com/@username',
  'https://facebook.com/username',
  'https://discord.gg/server',
  'https://tiktok.com/@username',
  'https://spotify.com/user/username',
  'https://example.com/some-page',
  'mailto:test@email.com',
  'https://stackoverflow.com/users/123456/username',
  'https://dribbble.com/username',
  'https://behance.net/username'
];

console.log('Testing Platform Icon Detection');
console.log('================================');

// We'll test this in the browser console since we need to import the module
console.log('Copy and paste these URLs into the app to test:');
testUrls.forEach((url, index) => {
  console.log(`${index + 1}. ${url}`);
});

console.log('\nExpected platform detections:');
console.log('1. GitHub -> GitHub icon');
console.log('2. Twitter -> Twitter icon');
console.log('3. LinkedIn -> LinkedIn icon');
console.log('4. Instagram -> Instagram icon');
console.log('5. YouTube -> YouTube icon');
console.log('6. Facebook -> Facebook icon');
console.log('7. Discord -> Discord icon');
console.log('8. TikTok -> Video icon');
console.log('9. Spotify -> Music icon');
console.log('10. Generic website -> Globe icon');
console.log('11. Email -> Mail icon');
console.log('12. Stack Overflow -> Code icon');
console.log('13. Dribbble -> Heart icon');
console.log('14. Behance -> Briefcase icon');
