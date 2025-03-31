// import "dotenv/config";
// import { usersTable } from "@/db/schema";
// import { db } from "@/db/db";

// async function main() {
//   const user: typeof usersTable.$inferInsert = {
//     name: "리슨업",
//     email: "john@example.com",
//     password: "$2b$10$jXyj8bJG7ht/V7eLZHtsgeIDDDJfk9GaG0IqsKl15J5gJbBep90H.",
//     role: "admin",
//   };

//   await db.insert(usersTable).values(user);
//   console.log("New user created!");

//   const users = await db.select().from(usersTable);
//   console.log("Getting all users from the database: ", users);
// }

// main();
