import express from 'express';
import session from 'express-session';
import memoryStore from 'memorystore';
import passport from 'passport';

// ============================================================
// FULLY SELF-CONTAINED VERCEL SERVERLESS FUNCTION
// No imports from server/ to avoid bundler issues with pg, drizzle, etc.
// ============================================================

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('trust proxy', 1);

// --- In-memory storage for Vercel (no DB) ---
const memUsers = new Map<string, any>();
const memProperties = new Map<number, any>();
const memLeads = new Map<number, any>();
let propertyIdCounter = 1;
let leadIdCounter = 1;

// --- Session setup ---
const MemStore = memoryStore(session);
app.use(session({
  secret: process.env.SESSION_SECRET || 'propanalyzed-vercel-secret',
  store: new MemStore({ checkPeriod: 86400000 }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: true,
    sameSite: 'lax' as const,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
}));

// --- Passport setup (minimal) ---
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user: any, done) => done(null, user.id));
passport.deserializeUser(async (id: string, done) => {
  const user = memUsers.get(id);
  done(null, user || null);
});

// --- Auth routes ---
app.get("/api/auth/user", (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
});

app.post("/api/auth/admin-bypass", (req, res) => {
  const adminUser = {
    id: "admin_dev_user",
    email: "admin@dev.local",
    firstName: "Admin",
    lastName: "User",
    profileImageUrl: null,
    authProvider: "local",
    createdAt: new Date(),
    updatedAt: new Date(),
    passwordHash: null,
  };
  memUsers.set(adminUser.id, adminUser);

  req.logIn(adminUser, (err) => {
    if (err) {
      console.error("Admin bypass login error:", err);
      return res.status(500).json({ message: "Admin bypass login failed", error: String(err) });
    }
    res.json({ success: true, user: adminUser });
  });
});

app.get("/api/auth/google", (_req, res) => {
  res.status(501).json({ message: "Google auth not configured on Vercel. Use Admin Bypass." });
});

app.get("/api/auth/apple", (_req, res) => {
  res.status(501).json({ message: "Apple auth not configured on Vercel. Use Admin Bypass." });
});

app.get("/api/logout", (req, res) => {
  req.logout((err) => {
    res.redirect("/");
  });
});

app.post("/api/auth/logout", (req, res) => {
  req.logout((err) => {
    res.json({ message: "Logged out" });
  });
});

// --- Auth middleware ---
function requireAuth(req: any, res: any, next: any) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: "Unauthorized" });
}

// --- Property search (mock) ---
app.post("/api/properties/search", requireAuth, (req, res) => {
  try {
    const { address, city, state, zipCode } = req.body;
    const id = propertyIdCounter++;
    const property = {
      id,
      address: address || "123 Main St",
      city: city || "Dallas",
      state: state || "TX",
      zipCode: zipCode || "75001",
      beds: 4,
      baths: "3.0",
      sqft: 2450,
      yearBuilt: 2018,
      propertyType: "Single Family",
      lotSize: "0.5 acres",
      parking: "2-car garage",
      hasPool: true,
      hoaFees: "150.00",
      listPrice: "650000",
      listingStatus: "Active",
      daysOnMarket: 14,
      pricePerSqft: "265",
      lastSalePrice: "500000",
      lastSaleDate: "2019-06-15",
      ownerName: "Demo Owner",
      ownerOccupied: true,
      investorType: "Individual",
      equity: "150000",
      equityPercent: 23,
      estimatedValue: "650000",
      liens: "0.00",
      isListed: true,
      listingHistory: [],
      currentLead: null,
      comparables: [
        { id: 1, propertyId: id, address: `${city} Neighbor St 1`, salePrice: "640000", beds: 4, baths: "3.0", sqft: 2400, pricePerSqft: "266", saleDate: "Oct 2023" },
        { id: 2, propertyId: id, address: `${city} Neighbor St 2`, salePrice: "660000", beds: 4, baths: "3.5", sqft: 2500, pricePerSqft: "264", saleDate: "Sep 2023" },
      ],
      marketMetrics: {
        id: 1, propertyId: id, avgDaysOnMarket: 22, medianSalePrice: "625000", avgPricePerSqft: "260", priceAppreciation: "4.5",
      },
    };
    memProperties.set(id, property);
    res.json(property);
  } catch (error: any) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Search failed", error: String(error) });
  }
});

// --- Get property by ID ---
app.get("/api/properties/:id", requireAuth, (req, res) => {
  const id = parseInt(req.params.id);
  const property = memProperties.get(id);
  if (!property) return res.status(404).json({ message: "Property not found" });
  res.json(property);
});

// --- Leads ---
app.get("/api/leads", requireAuth, (req, res) => {
  const userId = (req.user as any)?.id;
  const userLeads: any[] = [];
  memLeads.forEach((lead) => {
    if (lead.userId === userId) {
      const property = memProperties.get(lead.propertyId);
      if (property) {
        userLeads.push({ ...property, currentLead: lead });
      }
    }
  });
  res.json(userLeads);
});

app.post("/api/leads/claim", requireAuth, (req, res) => {
  try {
    const { propertyId } = req.body;
    const userId = (req.user as any)?.id;
    const id = leadIdCounter++;
    const lead = {
      id,
      userId,
      propertyId,
      status: "new",
      notes: "",
      claimedAt: new Date(),
    };
    memLeads.set(id, lead);

    // Update the property's currentLead
    const property = memProperties.get(propertyId);
    if (property) {
      property.currentLead = lead;
      memProperties.set(propertyId, property);
    }

    res.json(lead);
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to claim lead" });
  }
});

// --- Health check ---
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", env: process.env.NODE_ENV, timestamp: new Date().toISOString() });
});

export default app;
