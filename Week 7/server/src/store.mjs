import { mkdir, readFile, writeFile, rename, chmod } from 'node:fs/promises';
import { dirname } from 'node:path';
import { randomUUID } from 'node:crypto';
export async function openStore(file) {
  await mkdir(dirname(file), { recursive: true, mode: 0o700 });
  let data = { version: 1, users: [], sessions: [], transactions: [], budgets: [] };
  try { data = JSON.parse(await readFile(file, 'utf8')); }
  catch (e) { if (e.code !== 'ENOENT') throw new Error('Database tidak dapat dibaca. Periksa file data.'); }
  if (data.version !== 1 || !['users', 'sessions', 'transactions', 'budgets'].every(k => Array.isArray(data[k]))) throw new Error('Format database tidak sesuai.');
  let queue = Promise.resolve();
  return {
    read: () => structuredClone(data),
    mutate(fn) {
      const task = queue.then(async () => {
        const draft = structuredClone(data); const result = await fn(draft);
        const temp = `${file}.${randomUUID()}.tmp`;
        await writeFile(temp, JSON.stringify(draft, null, 2), { mode: 0o600 });
        await rename(temp, file); await chmod(file, 0o600); data = draft;
        return result;
      });
      queue = task.catch(() => {}); return task;
    }
  };
}
