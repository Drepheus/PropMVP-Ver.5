import { pgTable, text, serial, integer, boolean, decimal, timestamp, varchar, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zipCode: text("zip_code").notNull(),
  beds: integer("beds"),
  baths: decimal("baths", { precision: 3, scale: 1 }),
  sqft: integer("sqft"),
  yearBuilt: integer("year_built"),
  propertyType: text("property_type"),
  lotSize: text("lot_size"),
  parking: text("parking"),
  hasPool: boolean("has_pool"),
  hoaFees: decimal("hoa_fees", { precision: 10, scale: 2 }),
  listPrice: decimal("list_price", { precision: 12, scale: 2 }),
  listingStatus: text("listing_status"),
  daysOnMarket: integer("days_on_market"),
  pricePerSqft: decimal("price_per_sqft", { precision: 8, scale: 2 }),
  lastSalePrice: decimal("last_sale_price", { precision: 12, scale: 2 }),
  lastSaleDate: text("last_sale_date"),
  // New "Intelligence" fields
  ownerName: text("owner_name"),
  ownerOccupied: boolean("owner_occupied"),
  investorType: text("investor_type"), // 'Individual', 'LLC', 'Corp', etc.
  equity: decimal("equity", { precision: 12, scale: 2 }),
  equityPercent: integer("equity_percent"),
  estimatedValue: decimal("estimated_value", { precision: 12, scale: 2 }),
  liens: decimal("liens", { precision: 12, scale: 2 }),
  isListed: boolean("is_listed"),
  listingHistory: jsonb("listing_history"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  propertyId: integer("property_id").notNull().references(() => properties.id),
  status: text("status").notNull().default("New"), // 'New', 'Follow Up', 'Hot', 'Dead', 'Closed'
  notes: text("notes"),
  claimedAt: timestamp("claimed_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const comparableSales = pgTable("comparable_sales", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id").references(() => properties.id),
  address: text("address").notNull(),
  salePrice: decimal("sale_price", { precision: 12, scale: 2 }).notNull(),
  beds: integer("beds"),
  baths: decimal("baths", { precision: 3, scale: 1 }),
  sqft: integer("sqft"),
  pricePerSqft: decimal("price_per_sqft", { precision: 8, scale: 2 }),
  saleDate: text("sale_date").notNull(),
});

export const marketMetrics = pgTable("market_metrics", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id").references(() => properties.id),
  avgDaysOnMarket: integer("avg_days_on_market"),
  medianSalePrice: decimal("median_sale_price", { precision: 12, scale: 2 }),
  avgPricePerSqft: decimal("avg_price_per_sqft", { precision: 8, scale: 2 }),
  priceAppreciation: decimal("price_appreciation", { precision: 5, scale: 2 }),
});

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for OAuth and local authentication
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  passwordHash: varchar("password_hash"), // For local authentication
  authProvider: varchar("auth_provider").default("local"), // 'local', 'google', 'apple'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const propertySearchSchema = createInsertSchema(properties).pick({
  address: true,
  city: true,
  state: true,
  zipCode: true,
}).extend({
  address: z.string().min(1, "Street address is required for accurate property lookup"),
  city: z.string().min(1, "City is required for MLS data accuracy"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().optional(),
});

export type PropertySearch = z.infer<typeof propertySearchSchema>;
export type Property = typeof properties.$inferSelect;
export type ComparableSale = typeof comparableSales.$inferSelect;
export type MarketMetrics = typeof marketMetrics.$inferSelect;
export type Lead = typeof leads.$inferSelect;

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export type PropertyWithDetails = Property & {
  comparables: ComparableSale[];
  marketMetrics: MarketMetrics | null;
  currentLead?: Lead | null;
};
