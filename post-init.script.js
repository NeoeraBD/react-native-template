#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const projectRoot = process.cwd();

// 1. Ensure .env exists by copying .env.example if missing
const envPath = path.join(projectRoot, '.env');
const envExamplePath = path.join(projectRoot, '.env.example');

if (!fs.existsSync(envPath) && fs.existsSync(envExamplePath)) {
  try {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ Created .env from .env.example');
  } catch (error) {
    console.warn('⚠️  Could not create .env from .env.example:', error.message);
  }
}

// 2. Display success message & next steps
console.log('\n' + '='.repeat(60));
console.log('🎉 Project initialized with Neoera React Native Template!');
console.log('='.repeat(60));
console.log('\n📦 Features included:');
console.log('  • MVVM Architecture with Repository Pattern');
console.log('  • State Management: MobX-State-Tree (MST)');
console.log('  • Local Storage: High-performance MMKV');
console.log('  • UI Kit: React Native Paper (MD3) + 31 Reusable Components');
console.log('  • Networking: Axios with token refresh & cache layer');
console.log('  • Forms: React Hook Form');
console.log('  • Localization: i18next (en / bn)');
console.log('  • Monorepo Workspaces: @app/core & @app/ui');
console.log('\n🚀 Next Steps:');
console.log('  1. cd into your new project directory');
console.log('  2. For iOS: cd ios && pod install && cd ..');
console.log('  3. Run Android: yarn android');
console.log('  4. Run iOS:     yarn ios');
console.log('='.repeat(60) + '\n');
