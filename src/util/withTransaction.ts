import { db } from "@/db/db";

export class WithTransaction {
  static async run<T>(
    callback: (
      tx: Parameters<Parameters<typeof db.transaction>[0]>[0]
    ) => Promise<T>
  ): Promise<T> {
    return await db.transaction(async (tx) => {
      return await callback(tx);
    });
  }
}
