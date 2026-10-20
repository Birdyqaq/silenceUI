import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tempDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'silenceui-package-'));

/** 统计源码中的组件入口，避免“一个入口注册多个标签”导致硬编码数量失真。 */
function collectComponentEntries(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((item) => {
    const absolutePath = path.join(directory, item.name);
    if (item.isDirectory()) return collectComponentEntries(absolutePath);
    return item.isFile() && item.name === 'index.ts'
      ? [
          path
            .relative(path.join(packageRoot, 'components'), path.dirname(absolutePath))
            .split(path.sep)
            .join('/'),
        ]
      : [];
  });
}

const sourceEntries = collectComponentEntries(path.join(packageRoot, 'components'));
const expectedComponentEntries = sourceEntries.length;

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
  'package/CHANGELOG.md',
  ...sourceEntries.flatMap((entry) => [
    `package/dist/components/${entry}/index.js`,
    `package/dist/components/${entry}/index.d.ts`,
  ]),
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

  // 从真实发布归档读取内容，验证压缩体积，而非只检查工作区文件。
  const oversizedCompressed = componentEntries.filter((entry) => {
    const content = execFileSync('tar', ['-xOzf', path.join(tempDirectory, tarball), entry]);
    return gzipSync(content).length > 20 * 1024;
  });

  if (
    missing.length > 0 ||
    forbidden.length > 0 ||
    componentEntries.length !== expectedComponentEntries ||
    oversizedEntries.length > 0 ||
    oversizedCompressed.length > 0
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
    if (oversizedCompressed.length > 0) {
      console.error(`Component entries exceed 20 KiB gzip: ${oversizedCompressed.join(', ')}`);
    }
    process.exitCode = 1;
  } else {
    console.log(`Package verification passed: ${tarball} (${componentEntries.length} entries)`);
  }
} finally {
  fs.rmSync(tempDirectory, { recursive: true, force: true });
}
