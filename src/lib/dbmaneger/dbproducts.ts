import { promises as fs } from 'fs';
import path from 'path';
import { DatabaseUser } from "@/types/types"; 

const productsDbPath = path.join(process.cwd(), 'db', 'products.json');

export async function readProductsDb(): Promise<DatabaseUser> {
  const dbContents = await fs.readFile(productsDbPath, 'utf8');
  return JSON.parse(dbContents) as DatabaseUser;
}

export async function writeProductsDb(db: DatabaseUser): Promise<void> {
  await fs.writeFile(productsDbPath, JSON.stringify(db, null, 2));
}

export async function initProductsDb(): Promise<DatabaseUser> {
  try {
    return await readProductsDb();
  } catch {
    const emptyDb: DatabaseUser = { products: [] };
    await writeProductsDb(emptyDb);
    return emptyDb;
  }
}
