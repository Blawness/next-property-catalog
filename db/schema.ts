import {
  pgTable,
  text,
  integer,
  decimal,
  boolean,
  timestamp,
  pgEnum,
  uniqueIndex,
} from "drizzle-orm/pg-core"

export const roleEnum = pgEnum("role", ["buyer", "agent"])
export const propertyTypeEnum = pgEnum("property_type", [
  "rumah",
  "apartemen",
  "tanah",
  "ruko",
])
export const listingTypeEnum = pgEnum("listing_type", ["jual", "sewa"])
export const statusEnum = pgEnum("status", ["active", "sold", "rented"])

export const profiles = pgTable("profiles", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  fullName: text("full_name").notNull(),
  phone: text("phone"),
  role: roleEnum("role").default("buyer"),
  createdAt: timestamp("created_at").defaultNow(),
})

export const properties = pgTable("properties", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 15, scale: 0 }).notNull(),
  type: propertyTypeEnum("type").notNull(),
  listingType: listingTypeEnum("listing_type").notNull(),
  city: text("city").notNull(),
  address: text("address"),
  lat: decimal("lat", { precision: 10, scale: 7 }),
  lng: decimal("lng", { precision: 10, scale: 7 }),
  landArea: integer("land_area"),
  buildingArea: integer("building_area"),
  bedrooms: integer("bedrooms"),
  bathrooms: integer("bathrooms"),
  agentId: text("agent_id").references(() => profiles.id),
  status: statusEnum("status").default("active"),
  createdAt: timestamp("created_at").defaultNow(),
})

export const propertyImages = pgTable("property_images", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  propertyId: text("property_id").references(() => properties.id, {
    onDelete: "cascade",
  }),
  url: text("url").notNull(),
  isPrimary: boolean("is_primary").default(false),
  order: integer("order").default(0),
})

export const favorites = pgTable("favorites", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").references(() => profiles.id, {
    onDelete: "cascade",
  }),
  propertyId: text("property_id").references(() => properties.id, {
    onDelete: "cascade",
  }),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  uniqueUserProperty: uniqueIndex("unique_user_property").on(table.userId, table.propertyId),
}))
