import passport from "passport";
import { Strategy as GoogleStrategy, Profile as GoogleProfile } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import bcrypt from "bcryptjs";
import { storage } from "./storage";

export function setupOAuth(app: Express) {
  app.use(passport.initialize());
  app.use(passport.session());

  // Local Strategy for email/password authentication
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, async (email: string, password: string, done: any) => {
    try {
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return done(null, false, { message: 'Invalid email or password' });
      }

      const isValidPassword = await bcrypt.compare(password, user.passwordHash || '');
      if (!isValidPassword) {
        return done(null, false, { message: 'Invalid email or password' });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }));

  // Google OAuth Strategy
  const callbackURL = process.env.REPLIT_DEV_DOMAIN 
    ? `https://${process.env.REPLIT_DEV_DOMAIN}/api/auth/google/callback`
    : "/api/auth/google/callback";

  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || "demo-client-id",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "demo-client-secret",
    callbackURL: callbackURL
  }, async (accessToken: string, refreshToken: string, profile: GoogleProfile, done: any) => {
    try {
      const user = await storage.upsertUser({
        id: `google_${profile.id}`,
        email: profile.emails?.[0]?.value || null,
        firstName: profile.name?.givenName || null,
        lastName: profile.name?.familyName || null,
        profileImageUrl: profile.photos?.[0]?.value || null,
      });
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }));

  // Serialize/deserialize user for session
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });

  // Auth routes
  app.get("/api/auth/google", 
    passport.authenticate("google", { scope: ["profile", "email"] })
  );

  app.get("/api/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/?error=google_auth_failed" }),
    (req, res) => {
      res.redirect("/");
    }
  );

  // Local authentication routes
  app.post("/api/auth/login", 
    passport.authenticate("local", { failureRedirect: "/?error=invalid_credentials" }),
    (req, res) => {
      res.json({ success: true, user: req.user });
    }
  );

  app.post("/api/auth/register", async (req, res) => {
    try {
      const { email, password, firstName, lastName } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists with this email" });
      }

      // Hash password
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      // Create user
      const user = await storage.createLocalUser({
        email,
        passwordHash,
        firstName: firstName || null,
        lastName: lastName || null,
      });

      // Log user in
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ message: "Registration successful but login failed" });
        }
        res.json({ success: true, user });
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Registration failed" });
    }
  });

  // Apple auth placeholder - will be implemented when Apple credentials are provided
  app.get("/api/auth/apple", (req, res) => {
    res.status(501).json({ message: "Apple authentication not configured. Please provide Apple credentials." });
  });

  app.get("/api/auth/user", (req, res) => {
    if (req.isAuthenticated()) {
      res.json(req.user);
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  });

  app.get("/api/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.redirect("/?error=logout_failed");
      }
      res.redirect("/");
    });
  });

  app.post("/api/auth/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  // Development admin bypass route
  app.post("/api/auth/admin-bypass", async (req, res) => {
    if (process.env.NODE_ENV !== "development") {
      return res.status(403).json({ message: "Admin bypass only available in development" });
    }

    try {
      // Create or get admin user
      const adminUser = await storage.upsertUser({
        id: "admin_dev_user",
        email: "admin@dev.local",
        firstName: "Admin",
        lastName: "User",
        profileImageUrl: null,
      });

      req.logIn(adminUser, (err) => {
        if (err) {
          console.error("Admin bypass login error:", err);
          return res.status(500).json({ message: "Admin bypass login failed" });
        }
        res.json({ success: true, user: adminUser });
      });
    } catch (error) {
      console.error("Admin bypass error details:", error);
      res.status(500).json({ message: "Admin bypass failed" });
    }
  });
}

export const requireAuth = (req: any, res: any, next: any) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};