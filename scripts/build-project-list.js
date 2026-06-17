#!/usr/bin/env node
/**
 * 自动扫描 content/projects/ 目录，生成 assets/js/project-list.js
 * 在 GitHub Actions 构建时运行，也可本地手动执行：node scripts/build-project-list.js
 */

const fs = require('fs');
const path = require('path');

const projectsDir = path.join(__dirname, '..', 'content', 'projects');
const outputFile = path.join(__dirname, '..', 'assets', 'js', 'project-list.js');

// 扫描目录，取所有 .md 文件（排除 README.md），按文件名排序
const files = fs.readdirSync(projectsDir)
  .filter(f => f.endsWith('.md') && f.toLowerCase() !== 'readme.md')
  .sort();

const content = `// 自动生成 — 请勿手动编辑，由 scripts/build-project-list.js 生成
// 生成时间: ${new Date().toISOString()}
window.projectFiles = ${JSON.stringify(files, null, 2)};
`;

fs.writeFileSync(outputFile, content, 'utf-8');
console.log(`✅ project-list.js 已生成，共 ${files.length} 个项目：`);
files.forEach(f => console.log(`   - ${f}`));
