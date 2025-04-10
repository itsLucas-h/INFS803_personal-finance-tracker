import fs from 'fs';
import path from 'path';

const SRC_DIR = './src';

function fixImportsInFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');

  const updated = content.replace(/from\s+['"](\.{1,2}\/[^'"]+)['"]/g, (match, importPath) => {
    if (importPath.startsWith('./') || importPath.startsWith('../')) {
      // Skip if already ends in .js or another extension
      if (/\.[a-z]+$/.test(importPath)) return match;

      // Special case: if importing ../models → use /index.js
      if (importPath.endsWith('/models')) {
        return `from '${importPath}/index.js'`;
      }

      return `from '${importPath}.js'`;
    }

    return match;
  });

  if (updated !== content) {
    fs.writeFileSync(filePath, updated, 'utf-8');
    console.log(`✔ Fixed: ${filePath}`);
  }
}

function walkDir(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath);
    } else if (entry.isFile() && fullPath.endsWith('.ts')) {
      fixImportsInFile(fullPath);
    }
  }
}

walkDir(SRC_DIR);
console.log('✅ ESM import paths fixed (added .js and /index.js where needed)');
