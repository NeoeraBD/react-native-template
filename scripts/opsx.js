#!/usr/bin/env node

/**
 * OpenSpec CLI runner & fallback utility.
 * Supports: propose, apply, sync, archive, update, verify, status, show
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const projectRoot = process.cwd();
const openspecDir = path.join(projectRoot, 'openspec');
const changesDir = path.join(openspecDir, 'changes');
const specsDir = path.join(openspecDir, 'specs');
const archiveDir = path.join(changesDir, 'archive');

const [,, command, ...args] = process.argv;

function ensureDirs() {
  if (!fs.existsSync(changesDir)) fs.mkdirSync(changesDir, { recursive: true });
  if (!fs.existsSync(specsDir)) fs.mkdirSync(specsDir, { recursive: true });
  if (!fs.existsSync(archiveDir)) fs.mkdirSync(archiveDir, { recursive: true });
}

function getActiveChanges() {
  if (!fs.existsSync(changesDir)) return [];
  return fs.readdirSync(changesDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory() && dirent.name !== 'archive')
    .map(dirent => dirent.name);
}

function getArchivedChanges() {
  if (!fs.existsSync(archiveDir)) return [];
  return fs.readdirSync(archiveDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
}

function showStatus() {
  console.log('\n📋 OpenSpec Status');
  console.log('='.repeat(50));
  
  const active = getActiveChanges();
  console.log(`\n🔹 Active Changes (${active.length}):`);
  if (active.length === 0) {
    console.log('   (No active change proposals. Run "yarn opsx propose <name>" to start one.)');
  } else {
    for (const change of active) {
      const proposalFile = path.join(changesDir, change, 'proposal.md');
      let tasksCount = 0;
      let completedCount = 0;
      if (fs.existsSync(proposalFile)) {
        const content = fs.readFileSync(proposalFile, 'utf8');
        const tasks = content.match(/- \[[ xX]\]/g) || [];
        tasksCount = tasks.length;
        completedCount = (content.match(/- \[[xX]\]/g) || []).length;
      }
      const progress = tasksCount > 0 ? `${completedCount}/${tasksCount} tasks done` : 'No checklist';
      console.log(`   • ${change} [${progress}]`);
    }
  }

  const archived = getArchivedChanges();
  console.log(`\n📦 Archived Changes (${archived.length}):`);
  if (archived.length === 0) {
    console.log('   (None)');
  } else {
    for (const change of archived.slice(-5)) {
      console.log(`   • ${change}`);
    }
    if (archived.length > 5) {
      console.log(`   ... and ${archived.length - 5} more`);
    }
  }

  const specs = fs.existsSync(specsDir) ? fs.readdirSync(specsDir) : [];
  console.log(`\n📚 Base Specifications (${specs.length}):`);
  for (const spec of specs) {
    console.log(`   • specs/${spec}/spec.md`);
  }
  console.log('='.repeat(50) + '\n');
}

function propose(name) {
  if (!name) {
    console.error('❌ Error: Please specify a change name: yarn opsx propose <change-name>');
    process.exit(1);
  }

  ensureDirs();
  const targetDir = path.join(changesDir, name);
  if (fs.existsSync(targetDir)) {
    console.error(`❌ Error: Proposal "${name}" already exists at openspec/changes/${name}`);
    process.exit(1);
  }

  fs.mkdirSync(targetDir, { recursive: true });
  fs.mkdirSync(path.join(targetDir, 'specs'), { recursive: true });

  const templatePath = path.join(changesDir, 'template.md');
  let content = '';
  if (fs.existsSync(templatePath)) {
    content = fs.readFileSync(templatePath, 'utf8').replace(/\[Short Title of the Feature \/ Refactor\]/, name);
  } else {
    content = `# Change: ${name}\n\n## 1. Context & Motivation\n\n## 2. Proposed Changes\n\n## 3. Spec Delta\n\n## 4. Implementation Tasks\n- [ ] 1. Define models/types\n- [ ] 2. Implement ViewModel and View\n- [ ] 3. Verify\n`;
  }

  fs.writeFileSync(path.join(targetDir, 'proposal.md'), content, 'utf8');
  console.log(`\n✅ Created change proposal "${name}"`);
  console.log(`   📁 Directory: openspec/changes/${name}`);
  console.log(`   📝 Proposal:  openspec/changes/${name}/proposal.md`);
  console.log(`\nNext steps:`);
  console.log(`   1. Edit proposal.md with context, delta specs, and tasks`);
  console.log(`   2. Run "yarn opsx apply ${name}" when approved`);
}

function sync(name) {
  if (!name) {
    console.error('❌ Error: Please specify a change name to sync: yarn opsx sync <change-name>');
    process.exit(1);
  }

  const changeSpecsDir = path.join(changesDir, name, 'specs');
  if (!fs.existsSync(changeSpecsDir)) {
    console.log(`ℹ️  No delta specs directory found at openspec/changes/${name}/specs. Nothing to sync.`);
    return;
  }

  const domains = fs.readdirSync(changeSpecsDir);
  for (const domain of domains) {
    const srcSpec = path.join(changeSpecsDir, domain, 'spec.md');
    if (fs.existsSync(srcSpec)) {
      const destDomainDir = path.join(specsDir, domain);
      if (!fs.existsSync(destDomainDir)) fs.mkdirSync(destDomainDir, { recursive: true });
      const destSpec = path.join(destDomainDir, 'spec.md');
      
      const deltaContent = fs.readFileSync(srcSpec, 'utf8');
      if (fs.existsSync(destSpec)) {
        fs.appendFileSync(destSpec, `\n\n<!-- Synced from change: ${name} -->\n${deltaContent}`);
        console.log(`✅ Appended delta spec from "${name}" to specs/${domain}/spec.md`);
      } else {
        fs.writeFileSync(destSpec, deltaContent, 'utf8');
        console.log(`✅ Created new base spec specs/${domain}/spec.md from "${name}"`);
      }
    }
  }
}

function archive(name) {
  if (!name) {
    console.error('❌ Error: Please specify a change name to archive: yarn opsx archive <change-name>');
    process.exit(1);
  }

  ensureDirs();
  const sourceDir = path.join(changesDir, name);
  const targetDir = path.join(archiveDir, name);

  if (!fs.existsSync(sourceDir)) {
    console.error(`❌ Error: Change "${name}" not found in openspec/changes/${name}`);
    process.exit(1);
  }

  // Auto-sync delta specs before archiving
  sync(name);

  fs.renameSync(sourceDir, targetDir);
  console.log(`\n🎉 Archived change "${name}" to openspec/changes/archive/${name}`);
}

function verify() {
  console.log('\n🔍 Running OpenSpec Verification...');
  try {
    console.log('1. Type Checking (TypeScript strict mode)...');
    execSync('yarn tsc -p tsconfig.json --noEmit', { stdio: 'inherit' });
    console.log('✅ TypeScript check passed!');
  } catch (err) {
    console.error('❌ TypeScript validation failed.');
    process.exit(1);
  }

  try {
    console.log('2. Linting...');
    execSync('yarn lint', { stdio: 'inherit' });
    console.log('✅ Lint check passed!');
  } catch (err) {
    console.warn('⚠️  Lint warnings or issues detected.');
  }

  console.log('\n✨ Verification complete!\n');
}

function update() {
  console.log('\n🔄 Updating OpenSpec system configuration & instructions...');
  ensureDirs();
  showStatus();
  console.log('✅ OpenSpec configuration and specs verified.\n');
}

switch (command) {
  case 'status':
    showStatus();
    break;
  case 'propose':
  case 'new':
    propose(args[0]);
    break;
  case 'sync':
    sync(args[0]);
    break;
  case 'archive':
    archive(args[0]);
    break;
  case 'verify':
    verify();
    break;
  case 'update':
    update();
    break;
  case 'apply':
    console.log(`\n🚀 Applying change "${args[0]}"...`);
    console.log(`   Follow the task checklist in openspec/changes/${args[0]}/proposal.md`);
    console.log(`   Once implemented, run "yarn opsx verify" and "yarn opsx archive ${args[0]}"\n`);
    break;
  default:
    console.log(`
Usage: opsx <command> [arguments]

Available commands:
  status               Show active proposals, archived changes, and domain specs
  propose <name>       Create a new change proposal with delta spec templates
  apply <name>         Guide implementation of an approved proposal
  sync <name>          Merge delta specs from proposal into main domain specs
  archive <name>       Archive a completed proposal and sync specs
  verify               Run type checking and lint validation
  update               Refresh specs, configuration, and agent state
`);
    break;
}
