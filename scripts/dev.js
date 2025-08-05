import { execSync } from 'node:child_process';

const args = process.argv.slice(2);

if (args.length === 0) {
  console.error('Usage: pnpm dev:apps <app1,app2,...>');
  process.exit(1);
}

const filters = ['web-root', ...args]
  .map(app => `--filter=${app}`)
  .join(' ');
const cmd = `turbo dev ${filters}`;

console.log(`> Running: ${cmd}`);
execSync(cmd, { stdio: 'inherit' });