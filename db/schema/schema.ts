import { pgTable, integer, varchar } from "drizzle-orm/pg-core"

export const adminTable = pgTable("admin", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
})
