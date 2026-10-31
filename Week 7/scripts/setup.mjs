import { randomBytes } from 'node:crypto';
import { readFile, writeFile, access } from 'node:fs/promises';
for (const app of ['server', 'mobile']) {
  const target = new URL(`../${app}/.env`, import.meta.url);
  try { await access(target); console.log(`${app}/.env sudah ada, dipertahankan.`); }
  catch {
    const example = await readFile(new URL(`../${app}/.env.example`, import.meta.url), 'utf8');
    await writeFile(target, example.replace('GENERATE_WITH_NPM_RUN_SETUP', randomBytes(48).toString('hex')), { mode: 0o600 });
    console.log(`${app}/.env dibuat. Sesuaikan IP API jika memakai HP fisik.`);
  }
}
