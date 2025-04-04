import { db } from "@/db/db";

export class WithTransaction {
  static async run<T>(callback: (tx: typeof db) => Promise<T>): Promise<T> {
    return await db.transaction(async (tx) => {
      return await callback(tx);
    });
  }
}
