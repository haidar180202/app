import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Create __filename and __dirname equivalents in ES module scope.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const token = process.argv[2];

if (!token) {
  console.error('❌ Usage: pnpm npmrc <YOUR_AUTH_TOKEN>');
  process.exit(1);
}

// Resolve the project root (assuming the script is in /app/scripts)
const rootDir = path.resolve(__dirname, '..');
const appsDir = path.join(rootDir, 'apps');

const npmrcContent = (isRoot = false) => {
  const lines = [];

  if (isRoot) {
    lines.push(
      'auto-install-peers = true',
      'link-workspace-packages = true'
    );
  }

  lines.push(
    '@cisea:registry=https://gitlab.bukitasam.co.id/api/v4/groups/84/-/packages/npm/',
    `//gitlab.bukitasam.co.id/api/v4/groups/84/-/packages/npm/:_authToken=${token}`,
    `registry=https://registry.npmjs.org/`
  );

  return lines.join('\n') + '\n';
};

const writeNpmrc = (targetDir, isRoot = false) => {
  const filePath = path.join(targetDir, '.npmrc');
  fs.writeFileSync(filePath, npmrcContent(isRoot), 'utf8');
  console.log(`✅ .npmrc written in: ${path.relative(rootDir, filePath)}`);
};

// Write .npmrc in each apps/* folder if exists.
if (fs.existsSync(appsDir)) {
  const apps = fs.readdirSync(appsDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  apps.forEach(app => {
    const appPath = path.join(appsDir, app);
    writeNpmrc(appPath);
  });
}

// Write .npmrc in the project root.
writeNpmrc(rootDir, true);
