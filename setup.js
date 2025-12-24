#!/usr/bin/env node

/**
 * Setup Script for S K ASSOCIATES - CA Worker Backend
 * 
 * This script helps set up the development environment
 * Run with: node setup.js
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('🚀 Setting up S K ASSOCIATES - CA Worker Backend...\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, '.env.example');

if (!fs.existsSync(envPath)) {
  if (fs.existsSync(envExamplePath)) {
    // Copy .env.example to .env
    const envExample = fs.readFileSync(envExamplePath, 'utf8');
    
    // Generate a secure JWT secret
    const jwtSecret = crypto.randomBytes(32).toString('hex');
    
    // Replace the JWT secret in the env content
    const envContent = envExample.replace(
      'JWT_SECRET=your_jwt_secret_key_here_change_in_production_minimum_32_characters',
      `JWT_SECRET=${jwtSecret}`
    );
    
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Created .env file with secure JWT secret');
  } else {
    console.log('❌ .env.example file not found');
    process.exit(1);
  }
} else {
  console.log('ℹ️  .env file already exists');
}

// Check if node_modules exists
if (!fs.existsSync(path.join(__dirname, 'node_modules'))) {
  console.log('📦 Installing dependencies...');
  console.log('Please run: npm install');
} else {
  console.log('✅ Dependencies already installed');
}

// Check TypeScript compilation
console.log('\n🔧 Checking TypeScript compilation...');
try {
  const { execSync } = require('child_process');
  execSync('npx tsc --noEmit', { stdio: 'pipe' });
  console.log('✅ TypeScript compilation successful');
} catch (error) {
  console.log('❌ TypeScript compilation failed');
  console.log('Please check your TypeScript configuration');
}

console.log('\n🎉 Setup completed successfully!');
console.log('\n📋 Next steps:');
console.log('1. Review the .env file and update any necessary values');
console.log('2. Run: npm run dev (for development)');
console.log('3. Run: npm run build && npm start (for production)');
console.log('4. Test the API: node test-api.js');
console.log('\n📚 Documentation:');
console.log('- README.md - General information and setup');
console.log('- API_DOCUMENTATION.md - Complete API reference');
console.log('\n🌐 Default URLs:');
console.log('- Server: https://caworker-backend-1.onrender.com');
console.log('- Health Check: https://caworker-backend-1.onrender.com/health');
console.log('- API Info: https://caworker-backend-1.onrender.com/api');
console.log('\n🔐 Default Admin Account:');
console.log('- Username: admin');
console.log('- Email: admin@skassociates.com');
console.log('- Password: admin123');
console.log('\n⚠️  Remember to change the default admin password in production!');