#!/usr/bin/env node

/**
 * Script to automatically update PROJECT_OVERVIEW.md with current project state
 *
 * Updates:
 * - [LAST_UPDATE] timestamp
 * - Git status (current branch, recent commits)
 * - Package.json version
 * - Test count (if tests exist)
 *
 * Usage: node scripts/update-overview.js
 */

import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, '..');

// Helper to run git commands
function git(command) {
  try {
    return execSync(`git ${command}`, { cwd: ROOT_DIR, encoding: 'utf8' }).trim();
  } catch (error) {
    return null;
  }
}

// Helper to count tests
function countTests() {
  try {
    const output = execSync('npm test -- --run --reporter=json', {
      cwd: ROOT_DIR,
      encoding: 'utf8',
      stdio: 'pipe'
    });
    const result = JSON.parse(output);
    return {
      total: result.numTotalTests || 0,
      passed: result.numPassedTests || 0,
      failed: result.numFailedTests || 0
    };
  } catch (error) {
    return null;
  }
}

// Main update function
function updateOverview() {
  console.log('📝 Updating PROJECT_OVERVIEW.md...\n');

  const overviewPath = join(ROOT_DIR, 'PROJECT_OVERVIEW.md');
  let content = readFileSync(overviewPath, 'utf8');

  // 1. Update [LAST_UPDATE] date
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  content = content.replace(
    /\[LAST_UPDATE\]: \d{4}-\d{2}-\d{2}/,
    `[LAST_UPDATE]: ${today}`
  );
  console.log(`✅ Updated [LAST_UPDATE] to ${today}`);

  // 2. Update git branch info
  const currentBranch = git('branch --show-current');
  if (currentBranch) {
    console.log(`✅ Current branch: ${currentBranch}`);
  }

  // 3. Update package.json version
  const packageJson = JSON.parse(readFileSync(join(ROOT_DIR, 'package.json'), 'utf8'));
  const version = packageJson.version;
  console.log(`✅ Package version: ${version}`);

  // 4. Count dependencies
  const depCount = Object.keys(packageJson.dependencies || {}).length;
  const devDepCount = Object.keys(packageJson.devDependencies || {}).length;

  // Update dependency count in overview
  content = content.replace(
    /└── package\.json # \d+ deps, \d+ devDeps/,
    `└── package.json # ${depCount} deps, ${devDepCount} devDeps`
  );
  console.log(`✅ Updated dependency count: ${depCount} deps, ${devDepCount} devDeps`);

  // 5. Update test count (optional - can be slow)
  if (process.argv.includes('--update-tests')) {
    console.log('🧪 Counting tests (this may take a moment)...');
    const tests = countTests();
    if (tests) {
      content = content.replace(
        /102 automated tests \(100% passing\)/,
        `${tests.total} automated tests (${tests.passed} passing, ${tests.failed} failing)`
      );
      console.log(`✅ Updated test count: ${tests.total} tests`);
    }
  }

  // 6. Add auto-update timestamp comment
  const updateComment = `<!-- Auto-updated: ${new Date().toISOString()} -->`;
  if (!content.includes('Auto-updated:')) {
    content = updateComment + '\n' + content;
  } else {
    content = content.replace(/<!-- Auto-updated:.*?-->/, updateComment);
  }

  // Write updated content
  writeFileSync(overviewPath, content, 'utf8');
  console.log('\n✨ PROJECT_OVERVIEW.md updated successfully!\n');

  // Show what changed
  if (git('status --porcelain PROJECT_OVERVIEW.md')) {
    console.log('📋 Changes made:');
    console.log(git('diff PROJECT_OVERVIEW.md') || 'No git diff available');
  }
}

// Run the update
try {
  updateOverview();
} catch (error) {
  console.error('❌ Error updating overview:', error.message);
  process.exit(1);
}
