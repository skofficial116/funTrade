import crypto from 'crypto';

// Generate secure random secrets for JWT
const generateSecret = () => crypto.randomBytes(64).toString('hex');

console.log('🔐 Generated JWT Secrets:');
console.log('');
console.log('Add these to your .env file:');
console.log('');
console.log(`JWT_SECRET=${generateSecret()}`);
console.log(`REFRESH_SECRET=${generateSecret()}`);
console.log('');
console.log('⚠️  Keep these secrets secure and never commit them to version control!');
console.log('💡 Copy the above lines to your .env file to fix the authentication issue.');
