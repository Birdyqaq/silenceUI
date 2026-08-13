import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tempDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'silenceui-package-'));

const requiredFiles = [
  'package/dist/index.js',
  'package/dist/index.cjs',
  'package/dist/index.d.ts',
  'package/dist/style.css',
  'package/README.md',
];

const forbiddenFragments = ['/docs/', '/node_modules/', '.test.', '.stories.'];

try {
  const packOutput = execFileSync('pnpm', ['pack', '--pack-destination', tempDirectory], {
    cwd: packageRoot,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'inherit'],
  });
  const tarball = fs.readdirSync(tempDirectory).find((file) => file.endsWith('.tgz'));

  if (!tarball) throw new Error(`pnpm pack did not create an archive. Output: ${packOutput}`);

  const entries = execFileSync('tar', ['-tzf', path.join(tempDirectory, tarball)], {
    encoding: 'utf8',
  })
    .split('\n')
    .filter(Boolean);

  const missing = requiredFiles.filter((file) => !entries.includes(file));
  const forbidden = entries.filter(
    (entry) =>
      forbiddenFragments.some((fragment) => entry.includes(fragment)) ||
      (entry.startsWith('package/dist/components/') && !entry.endsWith('.d.ts'))
  );

  if (missing.length > 0 || forbidden.length > 0) {
    if (missing.length > 0) console.error(`Missing package files: ${missing.join(', ')}`);
    if (forbidden.length > 0) console.error(`Unexpected package files: ${forbidden.join(', ')}`);
    process.exitCode = 1;
  } else {
    console.log(`Package verification passed: ${tarball}`);
  }
} finally {
  fs.rmSync(tempDirectory, { recursive: true, force: true });
}
