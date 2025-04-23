import { promises as fs } from 'fs';
import path from 'path';
import { DatabaseUserList } from "@/types/types";

const usersDbPath = path.join(process.cwd(), 'db', 'users.json');

export async function readUsersDb(): Promise<DatabaseUserList> {
  const dbContents = await fs.readFile(usersDbPath, 'utf8');
  return JSON.parse(dbContents) as DatabaseUserList;
}

export async function writeUsersDb(db: DatabaseUserList): Promise<void> {
  await fs.writeFile(usersDbPath, JSON.stringify(db, null, 2));
}

export async function initUsersDb(): Promise<DatabaseUserList> {
  try {
    return await readUsersDb();
  } catch {
    const emptyDb: DatabaseUserList = { users: [] };
    await writeUsersDb(emptyDb);
    return emptyDb;
  }
}
