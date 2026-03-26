import express from 'express';
import session from 'express-session';
import memoryStore from 'memorystore';
import passport from 'passport';
import { storage } from '../server/storage';
import { propertySearchSchema } from '../shared/schema';
import { z } from 'zod';
import { setupOAuth, requireAuth } from '../server/auth';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Trust Vercel's reverse proxy
app.set('trust proxy', 1);

// Session configuration
const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
const MemoryStore = memoryStore(session);
const sessionStore = new MemoryStore({
  checkPeriod: 86400000
});

app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-secret-key-change-in-production',
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: true,
    sameSite: 'lax' as const,
    maxAge: sessionTtl,
  },
}));

// Setup OAuth authentication (passport + routes)
setupOAuth(app);

// ---- API Routes ----

// Property search
app.post("/api/properties/search", requireAuth, async (req, res) => {
  try {
    const searchData = propertySearchSchema.parse(req.body);
    const userId = (req.user as any)?.id;

    if (userId === "admin_dev_user") {
      let property = await storage.searchProperty(searchData, userId);
      if (!property) {
        return res.status(404).json({ message: "Failed to create mock property" });
      }
      property = {
        ...property,
        beds: 4, baths: "3.0" as any, sqft: 2450, yearBuilt: 2018,
        propertyType: "Single Family", lotSize: "0.5 acres", parking: "2-car garage",
        hasPool: true, hoaFees: "150.00", listPrice: "650000", listingStatus: "Active",
        daysOnMarket: 14, pricePerSqft: "265", lastSalePrice: "500000", lastSaleDate: "2019-06-15",
        ownerName: "Admin Test Owner", ownerOccupied: true, investorType: "Individual",
        equity: "150000", equityPercent: 23, estimatedValue: "650000", liens: "0.00",
        isListed: true, listingHistory: [],
        comparables: [
          { id: 1, propertyId: property.id, address: `${searchData.city} Neighbor St 1`, salePrice: "640000", beds: 4, baths: "3.0" as any, sqft: 2400, pricePerSqft: "266", saleDate: "Oct 2023" },
          { id: 2, propertyId: property.id, address: `${searchData.city} Neighbor St 2`, salePrice: "660000", beds: 4, baths: "3.5" as any, sqft: 2500, pricePerSqft: "264", saleDate: "Sep 2023" }
        ] as any,
        marketMetrics: {
          id: 1, propertyId: property.id, avgDaysOnMarket: 22, medianSalePrice: "625000", avgPricePerSqft: "260", priceAppreciation: "4.5"
        } as any,
      };
      return res.json(property);
    }

    const property = await storage.searchProperty(searchData, userId);
    if (!property) return res.status(404).json({ message: "Property not found" });
    res.json(property);
  } catch (error) {
    if (error instanceof z.ZodError) return res.status(400).json({ message: "Invalid search data", errors: error.errors });
    console.error("Search error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get property by ID
app.get("/api/properties/:id", requireAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid property ID" });
    const property = await storage.getPropertyById(id, (req.user as any)?.id);
    if (!property) return res.status(404).json({ message: "Property not found" });
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get all leads for current user
app.get("/api/leads", requireAuth, async (req, res) => {
  try {
    const userId = (req.user as any)?.id;
    const leads = await storage.getLeadsByUser(userId);
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Claim a lead
app.post("/api/leads/claim", requireAuth, async (req, res) => {
  try {
    const { propertyId } = req.body;
    const userId = (req.user as any)?.id;
    if (!propertyId) return res.status(400).json({ message: "Property ID is required" });
    const lead = await storage.claimLead(propertyId, userId);
    res.json(lead);
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to claim lead" });
  }
});

// Catch-all health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

export default app;
