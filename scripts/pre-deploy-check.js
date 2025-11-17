#!/usr/bin/env node

/**
 * Pre-deployment verification script
 * Checks that all required files and configurations are in place
 */

import { existsSync, statSync, readdirSync } from 'fs';
import { join } from 'path';

const checks = [];
let passed = 0;
let failed = 0;

function check(name, condition, errorMsg) {
  checks.push({ name, condition, errorMsg });
  if (condition) {
    console.log(`✓ ${name}`);
    passed++;
  } else {
    console.error(`✗ ${name}: ${errorMsg}`);
    failed++;
  }
}

console.log('\n🚀 Pre-Deployment Verification\n');
console.log('================================\n');

// Check 1: Build directory exists
check(
  'Build directory exists',
  existsSync('dist'),
  'Run "npm run build" first'
);

// Check 2: Index.html exists
check(
  'index.html exists',
  existsSync('dist/index.html'),
  'Build may have failed'
);

// Check 3: Assets directory exists
check(
  'Assets directory exists',
  existsSync('dist/assets'),
  'Build may have failed'
);

// Check 4: Check bundle size
if (existsSync('dist/assets')) {
  const assets = readdirSync('dist/assets');
  const jsFiles = assets.filter(f => f.endsWith('.js'));
  const totalSize = jsFiles.reduce((sum, file) => {
    const stats = statSync(join('dist/assets', file));
    return sum + stats.size;
  }, 0);
  
  const totalSizeMB = (totalSize / 1024 / 1024).toFixed(2);
  check(
    `Bundle size (${totalSizeMB} MB)`,
    totalSize < 1024 * 1024 * 2, // Less than 2MB
    `Bundle is too large (${totalSizeMB} MB). Consider code splitting.`
  );
}

// Check 5: Environment example exists
check(
  '.env.example exists',
  existsSync('.env.example'),
  'Create .env.example for deployment reference'
);

// Check 6: Deployment configs exist
check(
  'Vercel config exists',
  existsSync('vercel.json'),
  'Create vercel.json for Vercel deployment'
);

check(
  'Netlify config exists',
  existsSync('netlify.toml'),
  'Create netlify.toml for Netlify deployment'
);

// Check 7: Documentation exists
check(
  'Deployment guide exists',
  existsSync('DEPLOYMENT.md'),
  'Create DEPLOYMENT.md with deployment instructions'
);

check(
  'README exists',
  existsSync('README.md'),
  'Create README.md with project documentation'
);

// Check 8: Supabase setup files exist
check(
  'Supabase schema exists',
  existsSync('supabase-setup.sql'),
  'Create supabase-setup.sql with database schema'
);

check(
  'Supabase storage setup exists',
  existsSync('supabase-storage-setup.sql'),
  'Create supabase-storage-setup.sql with storage configuration'
);

// Check 9: Package.json has required scripts
import { readFileSync } from 'fs';
const packageJson = JSON.parse(
  readFileSync('package.json', 'utf8')
);

check(
  'Build script exists',
  packageJson.scripts && packageJson.scripts.build,
  'Add "build" script to package.json'
);

check(
  'Preview script exists',
  packageJson.scripts && packageJson.scripts.preview,
  'Add "preview" script to package.json'
);

// Check 10: TypeScript config exists
check(
  'TypeScript config exists',
  existsSync('tsconfig.json'),
  'Create tsconfig.json'
);

// Summary
console.log('\n================================\n');
console.log(`Results: ${passed} passed, ${failed} failed\n`);

if (failed === 0) {
  console.log('✅ All checks passed! Ready for deployment.\n');
  console.log('Next steps:');
  console.log('1. Test locally: npm run preview');
  console.log('2. Set environment variables in hosting platform');
  console.log('3. Deploy to Vercel or Netlify');
  console.log('4. Run post-deployment tests\n');
  process.exit(0);
} else {
  console.log('❌ Some checks failed. Please fix the issues above.\n');
  process.exit(1);
}
