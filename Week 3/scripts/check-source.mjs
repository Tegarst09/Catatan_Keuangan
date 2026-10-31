import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { parse } from '@babel/parser';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
let count = 0;
async function scan(dir) {
  for (const item of await readdir(dir, { withFileTypes: true })) {
    if (['node_modules', 'dist', 'dist-native', '.expo', '.git'].includes(item.name)) continue;
    const path = join(dir, item.name);
    if (item.isDirectory()) await scan(path);
    else if (/\.(mjs|js|jsx)$/.test(item.name)) {
      parse(await readFile(path, 'utf8'), { sourceType: 'module', plugins: ['jsx'] }); count++;
    }
  }
}
await scan(root);
console.log(`${count} file JavaScript/JSX lolos pemeriksaan sintaks.`);
