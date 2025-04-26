import { promises as fs } from 'fs';
import path from 'path';
import { Order } from "@/types/types";

const ordersDbPath = path.join(process.cwd(), 'db', 'orders.json');

export async function readOrdersDb(): Promise<Order[]> {
  const dbContents = await fs.readFile(ordersDbPath, 'utf8');
  return JSON.parse(dbContents) as Order[];
}

export async function writeOrdersDb(db: Order[]): Promise<void> {
  await fs.writeFile(ordersDbPath, JSON.stringify(db, null, 2));
}

export async function initOrdersDb(): Promise<Order[]> {
  try {
    return await readOrdersDb();
  } catch {
    const emptyDb: Order[] = [];
    await writeOrdersDb(emptyDb);
    return emptyDb;
  }
}
