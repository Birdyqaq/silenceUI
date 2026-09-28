import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tempDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'silenceui-package-'));

/** 统计源码中的组件入口，避免“一个入口注册多个标签”导致硬编码数量失真。 */
function countComponentEntries(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).reduce((count, item) => {
    const absolutePath = path.join(directory, item.name);
    if (item.isDirectory()) return count + countComponentEntries(absolutePath);
    return count + (item.isFile() && item.name === 'index.ts' ? 1 : 0);
  }, 0);
}

const expectedComponentEntries = countComponentEntries(path.join(packageRoot, 'components'));

const requiredFiles = [
  'package/dist/index.js',
  'package/dist/index.cjs',
  'package/dist/index.d.ts',
  'package/dist/style.css',
  'package/dist/components/button/index.js',
  'package/dist/components/form/select/index.js',
  'package/dist/components/data/tree/index.js',
  'package/dist/components/feedback/modal/index.js',
  'package/dist/components/navigation/menu/index.js',
  'package/dist/components/layout/container/index.js',
  'package/dist/components/theme/index.js',
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
  const forbidden = entries.filter((entry) =>
    forbiddenFragments.some((fragment) => entry.includes(fragment))
  );

  const componentEntries = entries.filter(
    (entry) =>
      entry.startsWith('package/dist/components/') &&
      entry.endsWith('/index.js') &&
      entry !== 'package/dist/components/theme/index.js'
  );
  const oversizedEntries = componentEntries.filter((entry) => {
    const archivePath = entry.replace(/^package\//, '');
    return fs.statSync(path.join(packageRoot, archivePath)).size > 80 * 1024;
  });

  if (
    missing.length > 0 ||
    forbidden.length > 0 ||
    componentEntries.length !== expectedComponentEntries ||
    oversizedEntries.length > 0
  ) {
    if (missing.length > 0) console.error(`Missing package files: ${missing.join(', ')}`);
    if (forbidden.length > 0) console.error(`Unexpected package files: ${forbidden.join(', ')}`);
    if (componentEntries.length !== expectedComponentEntries) {
      console.error(
        `Expected ${expectedComponentEntries} component entries, found ${componentEntries.length}`
      );
    }
    if (oversizedEntries.length > 0) {
      console.error(`Component entries exceed 80 KiB: ${oversizedEntries.join(', ')}`);
    }
    process.exitCode = 1;
  } else {
    console.log(`Package verification passed: ${tarball} (${componentEntries.length} entries)`);
  }
} finally {
  fs.rmSync(tempDirectory, { recursive: true, force: true });
}
