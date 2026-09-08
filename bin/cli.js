#!/usr/bin/env node

const { spawnSync, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const projectName = process.argv[2];

if (!projectName || projectName.startsWith('-')) {
  console.error('\n❌ Please specify the project name:\n');
  console.error('   npx create-neoera-app <ProjectName>\n');
  console.error('Example:');
  console.error('   npx create-neoera-app MyAwesomeApp\n');
  process.exit(1);
}

// Forward any additional arguments (e.g. --skip-install, etc.)
const extraArgs = process.argv.slice(3);

const templatePackageRoot = path.resolve(__dirname, '..');
const isRunningFromRepo = fs.existsSync(path.join(templatePackageRoot, 'template.config.js')) &&
  fs.existsSync(path.join(templatePackageRoot, 'template'));

const templateSpecifier = isRunningFromRepo ? templatePackageRoot : 'react-native-template-neoera';

console.log(`\n🚀 Initializing React Native project "${projectName}" with Neoera Template...\n`);

const initArgs = [
  '@react-native-community/cli@latest',
  'init',
  projectName,
  '--template',
  templateSpecifier,
];

// If no package manager flag is passed, default to yarn if available (template uses yarn workspaces)
const hasPmFlag = extraArgs.some((arg) => arg === '--pm' || arg.startsWith('--pm='));
if (!hasPmFlag) {
  try {
    execSync('yarn --version', { stdio: 'ignore' });
    initArgs.push('--pm', 'yarn');
  } catch {
    // Yarn not installed, CLI will use default npm
  }
}

initArgs.push(...extraArgs);

const result = spawnSync('npx', initArgs, {
  stdio: 'inherit',
  shell: true,
});

process.exit(result.status ?? 0);
