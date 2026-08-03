import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import prettier from 'prettier';
import ts from 'typescript';

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const componentsRoot = path.join(packageRoot, 'components');
const outputFile = path.join(packageRoot, 'docs/guide/component-inventory.md');

const categoryNames = {
  data: '数据展示',
  feedback: '反馈',
  form: '表单',
  layout: '布局',
  navigation: '导航',
};

function walk(directory, predicate) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) return walk(file, predicate);
    return predicate(file) ? [file] : [];
  });
}

function decoratorsOf(node) {
  return ts.canHaveDecorators(node) ? (ts.getDecorators(node) ?? []) : [];
}

function decoratorCall(node, name) {
  for (const decorator of decoratorsOf(node)) {
    if (
      ts.isCallExpression(decorator.expression) &&
      ts.isIdentifier(decorator.expression.expression) &&
      decorator.expression.expression.text === name
    ) {
      return decorator.expression;
    }
  }
  return undefined;
}

function propertyApi(member) {
  const decorator = decoratorCall(member, 'property');
  if (!decorator || !member.name) return undefined;

  const name = member.name.getText().replace(/^['"]|['"]$/g, '');
  const options = decorator.arguments[0];
  if (!options || !ts.isObjectLiteralExpression(options)) return name;

  const attributeOption = options.properties.find(
    (property) =>
      ts.isPropertyAssignment(property) &&
      property.name.getText().replace(/^['"]|['"]$/g, '') === 'attribute'
  );
  if (!attributeOption || !ts.isPropertyAssignment(attributeOption)) return name;
  if (attributeOption.initializer.kind === ts.SyntaxKind.FalseKeyword)
    return `${name}（仅 property）`;
  if (ts.isStringLiteral(attributeOption.initializer)) {
    return `${name}（attribute: ${attributeOption.initializer.text}）`;
  }
  return name;
}

function dispatchedEvents(classNode) {
  const events = new Set();
  const visit = (node) => {
    if (
      ts.isCallExpression(node) &&
      ts.isPropertyAccessExpression(node.expression) &&
      node.expression.name.text === 'dispatchEvent'
    ) {
      const event = node.arguments[0];
      if (
        event &&
        ts.isNewExpression(event) &&
        ts.isIdentifier(event.expression) &&
        ['CustomEvent', 'Event'].includes(event.expression.text) &&
        event.arguments?.[0] &&
        ts.isStringLiteral(event.arguments[0])
      ) {
        events.add(event.arguments[0].text);
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(classNode);
  return [...events].sort();
}

function slotsOf(classNode) {
  const slots = new Set();
  const source = classNode.getText();
  const slotPattern = /<slot\b([^>]*)>/g;
  for (const match of source.matchAll(slotPattern)) {
    const attributes = match[1];
    const staticName = attributes.match(/\bname\s*=\s*['"]([^'"]+)['"]/);
    const dynamicName = attributes.match(/\bname\s*=\s*\$\{([^}]+)\}/);
    slots.add(staticName?.[1] ?? (dynamicName ? `动态: ${dynamicName[1].trim()}` : 'default'));
  }
  return [...slots].sort();
}

function partsOf(classNode) {
  const parts = new Set();
  const source = classNode.getText();
  const partPattern = /\bpart\s*=\s*['"]([^'"]+)['"]/g;
  for (const match of source.matchAll(partPattern)) {
    match[1]
      .split(/\s+/)
      .filter(Boolean)
      .forEach((part) => parts.add(part));
  }
  return [...parts].sort();
}

function categoryOf(file) {
  const [first] = path.relative(componentsRoot, file).split(path.sep);
  if (categoryNames[first]) return categoryNames[first];
  if (['pagination', 'table'].includes(first)) return '数据展示';
  return '基础';
}

function resolveImport(testFile, specifier) {
  if (!specifier.startsWith('.')) return undefined;
  const base = path.resolve(path.dirname(testFile), specifier);
  return [`${base}.ts`, path.join(base, 'index.ts')].find((candidate) => fs.existsSync(candidate));
}

function directTestMap() {
  const map = new Map();
  const tests = walk(componentsRoot, (file) => file.endsWith('.test.ts'));
  for (const testFile of tests) {
    const sourceFile = ts.createSourceFile(
      testFile,
      fs.readFileSync(testFile, 'utf8'),
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TS
    );
    sourceFile.statements.forEach((statement) => {
      if (!ts.isImportDeclaration(statement) || !ts.isStringLiteral(statement.moduleSpecifier))
        return;
      const importedFile = resolveImport(testFile, statement.moduleSpecifier.text);
      if (!importedFile) return;
      const existing = map.get(importedFile) ?? [];
      existing.push(path.relative(packageRoot, testFile));
      map.set(importedFile, existing);
    });
  }
  return map;
}

function cell(values) {
  if (!values.length) return '-';
  return values.map((value) => value.replaceAll('|', '\\|')).join('<br>');
}

const testsBySource = directTestMap();
const components = [];
const sourceFiles = walk(
  componentsRoot,
  (file) => file.endsWith('.ts') && !file.endsWith('.test.ts') && !file.endsWith('.stories.ts')
);

for (const file of sourceFiles) {
  const sourceFile = ts.createSourceFile(
    file,
    fs.readFileSync(file, 'utf8'),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS
  );

  sourceFile.forEachChild((node) => {
    if (!ts.isClassDeclaration(node)) return;
    const customElement = decoratorCall(node, 'customElement');
    const tagArgument = customElement?.arguments[0];
    if (!tagArgument || !ts.isStringLiteral(tagArgument)) return;

    components.push({
      tag: tagArgument.text,
      className: node.name?.text ?? '-',
      category: categoryOf(file),
      file: path.relative(packageRoot, file),
      properties: node.members.map(propertyApi).filter(Boolean),
      events: dispatchedEvents(node),
      slots: slotsOf(node),
      parts: partsOf(node),
      tests: [...new Set(testsBySource.get(file) ?? [])],
    });
  });
}

components.sort((left, right) =>
  left.category === right.category
    ? left.tag.localeCompare(right.tag)
    : left.category.localeCompare(right.category, 'zh-CN')
);

const legacyTags = components.filter((component) => !component.tag.startsWith('su-'));
const testedComponents = components.filter((component) => component.tests.length > 0);
const propertyCount = components.reduce(
  (total, component) => total + component.properties.length,
  0
);
const eventCount = components.reduce((total, component) => total + component.events.length, 0);
const partCount = components.reduce((total, component) => total + component.parts.length, 0);

const rows = components.map(
  (component) =>
    `| ${component.category} | \`${component.tag}\` | \`${component.className}\` | ${cell(component.properties)} | ${cell(component.events.map((event) => `\`${event}\``))} | ${cell(component.slots.map((slot) => `\`${slot}\``))} | ${cell(component.parts.map((part) => `\`${part}\``))} | ${component.tests.length ? `有（${component.tests.map((test) => `\`${test}\``).join('<br>')}）` : '无'} |`
);

const rawMarkdown = `<!-- 此文件由 scripts/generate-component-inventory.mjs 自动生成，请勿手工修改。 -->

# 组件 API 基线

本页记录当前源码公开面的可复现快照，用于后续统一命名、补测试和生成 Custom Elements Manifest。执行 \`pnpm docs:inventory\` 可重新生成。

## 概览

| 指标 | 当前值 |
| --- | ---: |
| 自定义元素 | ${components.length} |
| \`su-*\` 标签 | ${components.length - legacyTags.length} |
| 历史/非标准标签 | ${legacyTags.length} |
| Lit reactive properties | ${propertyCount} |
| 组件主动派发事件 | ${eventCount} |
| 暴露 CSS Parts | ${partCount} |
| 有直接测试的组件 | ${testedComponents.length} / ${components.length} |

“直接测试”表示测试文件直接 import 该组件源码，不包含通过整包入口产生的间接注册。属性后的“仅 property”表示该值不能通过 HTML attribute 设置。

## 组件清单

| 分类 | 标签 | 类名 | Reactive properties | 主动派发事件 | Slots | CSS Parts | 直接测试 |
| --- | --- | --- | --- | --- | --- | --- | --- |
${rows.join('\n')}

## 当前缺口

- 标签前缀未统一：${legacyTags.map((component) => `\`${component.tag}\``).join('、')} 仍需兼容迁移方案。
- 直接测试覆盖为 ${testedComponents.length}/${components.length}；“无”不等于组件不可用，但意味着修改时缺少组件级回归保护。
- 当前公开 CSS Parts 数量为 ${partCount}；主题主要依赖全局 CSS variables，组件内部结构尚不能通过 \`::part()\` 精细定制。
- 这份清单是 Day 3 的 API 基线；后续以 Custom Elements Manifest 替代自维护格式。
`;
const markdown = await prettier.format(rawMarkdown, { parser: 'markdown', printWidth: 100 });

const relativeOutput = path.relative(packageRoot, outputFile);
if (process.argv.includes('--check')) {
  const current = fs.existsSync(outputFile) ? fs.readFileSync(outputFile, 'utf8') : '';
  if (current !== markdown) {
    console.error(`${relativeOutput} is stale. Run pnpm docs:inventory.`);
    process.exitCode = 1;
  } else {
    console.log(`${relativeOutput} is up to date for ${components.length} components.`);
  }
} else {
  fs.writeFileSync(outputFile, markdown, 'utf8');
  console.log(`Generated ${relativeOutput} for ${components.length} components.`);
}
