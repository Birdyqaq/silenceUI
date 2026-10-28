import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const walk = (directory) =>
  fs
    .readdirSync(path.join(root, directory), { withFileTypes: true })
    .flatMap((entry) =>
      entry.isDirectory() ? walk(`${directory}/${entry.name}`) : [`${directory}/${entry.name}`]
    );
const errors = [];
const pages = walk('docs/components').filter(
  (file) =>
    file.endsWith('.md') && !file.endsWith('/index.md') && !file.endsWith('/table-design.md')
);
const stripCode = (text) => text.replace(/```[\s\S]*?```/g, '');
/** 只统计文档主题真正导入的 Vue 文件，避免废弃示例导致覆盖率虚高。 */
const reachable = new Set();
function collectDemos(file) {
  if (reachable.has(file)) return;
  reachable.add(file);
  const text = read(file);
  const script = file.endsWith('.vue')
    ? [...text.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)].map((match) => match[1]).join('\n')
    : text;
  const ast = ts.createSourceFile(file, script, ts.ScriptTarget.Latest, true);
  for (const node of ast.statements) {
    if (!ts.isImportDeclaration(node) || !ts.isStringLiteral(node.moduleSpecifier)) continue;
    const specifier = node.moduleSpecifier.text;
    if (!specifier.startsWith('.') || !specifier.endsWith('.vue')) continue;
    const resolved = path.posix.normalize(path.posix.join(path.posix.dirname(file), specifier));
    if (resolved.startsWith('docs/.vitepress/theme/')) collectDemos(resolved);
  }
}
collectDemos('docs/.vitepress/theme/index.ts');
const demoSources = [...reachable]
  .filter((file) => file.endsWith('.vue'))
  .map(read)
  .join('\n');
const liveSources = pages.map((file) => stripCode(read(file))).join('\n') + demoSources;
for (const page of pages) {
  if (!/<ClientOnly[\s>]/.test(read(page)))
    errors.push(`${page}: missing client-side demonstration`);
  if (/(?:src|thumbnail|placeholder)="https?:\/\//.test(stripCode(read(page))))
    errors.push(`${page}: live demonstration relies on a remote resource`);
}
const readme = read('README.md');
const tags = walk('components')
  .filter((file) => file.endsWith('.ts') && !file.endsWith('.test.ts'))
  .flatMap((file) =>
    [...read(file).matchAll(/@customElement\('([^']+)'\)/g)].map((match) => match[1])
  );
for (const tag of tags) {
  if (!readme.includes('`' + tag + '`')) errors.push(`README.md: missing ${tag}`);
  // The preview is opened by se-image, rather than mounted as a persistent modal.
  const imperativeDemo =
    tag === 'su-message' ? 'api.message' : tag === 'su-notification' ? 'api.notification' : '';
  if (
    tag !== 'se-image-preview' &&
    !liveSources.includes('<' + tag) &&
    !(imperativeDemo && demoSources.includes(imperativeDemo))
  )
    errors.push(`Missing live example: ${tag}`);
}
const button = read('docs/components/button.md');
for (const file of walk('components').filter((file) => file.endsWith('/index.ts'))) {
  const source = read(file);
  if (!source.includes('static formAssociated = true')) continue;
  if (!/@property\(\{[^}]*reflect:\s*true[^}]*\}\)\s+name\s*=/.test(source))
    errors.push(`${file}: form name must reflect to attribute`);
  if (!source.includes('formDisabledCallback'))
    errors.push(`${file}: missing inherited-disabled integration`);
}
for (const wrong of ['ripple-color', 'icon-class', 'icon-position'])
  if (button.includes(wrong)) errors.push(`Button docs contain unsupported attribute ${wrong}`);
for (const attribute of ['ripplecolor', 'iconclass', 'iconposition'])
  if (!button.includes(attribute)) errors.push(`Button docs omit ${attribute}`);
const quickstart = read('docs/guide/getting-started.md');
if (quickstart.includes('pagination={false}') || !quickstart.includes('table.pagination = false'))
  errors.push('React example must assign pagination as a DOM property');
for (const file of ['docs/guide/compatibility.md', 'docs/guide/docs-validation.md'])
  if (!fs.existsSync(path.join(root, file))) errors.push(`Missing ${file}`);
const resources = walk('docs/public/demo');
if (!resources.some((file) => file.endsWith('.svg')))
  errors.push('Missing local demonstration image');
if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else
  console.log(
    `Documentation verification passed: ${pages.length} component pages, ${tags.length} elements, local demo resources and framework conventions.`
  );
