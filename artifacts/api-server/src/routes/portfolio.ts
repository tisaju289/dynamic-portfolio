import { Router } from "express";
import { getAuth } from "@clerk/express";
import { db } from "@workspace/db";
import {
  profilesTable, heroContentTable, heroIconsTable, aboutContentTable,
  skillsTable, servicesTable, projectsTable, testimonialsTable,
  contactMessagesTable, socialLinksTable, siteSettingsTable, statsTable, blogPostsTable
} from "@workspace/db";
import { eq, and } from "drizzle-orm";

const router = Router();

const requireAuth = (req: any, res: any, next: any) => {
  const auth = getAuth(req);
  const userId = auth?.userId;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  req.userId = userId;
  next();
};

// Convert camelCase keys to snake_case for frontend compatibility
function toSnake(obj: any): any {
  if (Array.isArray(obj)) return obj.map(toSnake);
  if (obj === null || typeof obj !== "object") return obj;
  const out: any = {};
  for (const [k, v] of Object.entries(obj)) {
    const snakeKey = k.replace(/([A-Z])/g, "_$1").toLowerCase();
    out[snakeKey] = toSnake(v);
  }
  return out;
}

// Convert snake_case request body keys to camelCase for Drizzle
function toCamel(obj: any): any {
  if (Array.isArray(obj)) return obj.map(toCamel);
  if (obj === null || typeof obj !== "object") return obj;
  const out: any = {};
  for (const [k, v] of Object.entries(obj)) {
    const camelKey = k.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
    out[camelKey] = toCamel(v);
  }
  return out;
}

function sj(res: any, data: any) {
  return res.json(toSnake(data));
}

// ---- Profiles ----
router.get("/profiles/username/:username", async (req, res) => {
  const [profile] = await db.select().from(profilesTable).where(eq(profilesTable.username, req.params.username));
  if (!profile) return res.status(404).json({ error: "Not found" });
  return sj(res, profile);
});

router.get("/profiles/all", async (_req, res) => {
  const profiles = await db.select().from(profilesTable).orderBy(profilesTable.createdAt);
  return sj(res, profiles);
});

router.get("/profiles/me", requireAuth, async (req: any, res) => {
  const [profile] = await db.select().from(profilesTable).where(eq(profilesTable.userId, req.userId));
  return sj(res, profile || null);
});

router.post("/profiles/me", requireAuth, async (req: any, res) => {
  const body = toCamel(req.body);
  const { username, displayName } = body;
  const [existing] = await db.select().from(profilesTable).where(eq(profilesTable.userId, req.userId));
  if (existing) {
    const [updated] = await db.update(profilesTable).set({ username, displayName, updatedAt: new Date() }).where(eq(profilesTable.userId, req.userId)).returning();
    return sj(res, updated);
  }
  const [created] = await db.insert(profilesTable).values({ userId: req.userId, username, displayName }).returning();
  return sj(res, created);
});

// ---- Generic CRUD helpers ----
function makeSimpleRoutes(table: any, orderBy?: any) {
  const r = Router();

  r.get("/:userId", async (req, res) => {
    try {
      let q = db.select().from(table).where(eq(table.userId, req.params.userId));
      if (orderBy) (q as any).orderBy(orderBy);
      const rows = await q;
      return sj(res, rows);
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  r.post("/", requireAuth, async (req: any, res) => {
    try {
      const body = toCamel(req.body);
      const [row] = await db.insert(table).values({ ...body, userId: req.userId }).returning();
      return sj(res, row);
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  r.patch("/:id", requireAuth, async (req: any, res) => {
    try {
      const body = toCamel(req.body);
      const [row] = await db.update(table).set({ ...body, updatedAt: new Date() }).where(and(eq(table.id, req.params.id), eq(table.userId, req.userId))).returning();
      if (!row) return res.status(404).json({ error: "Not found" });
      return sj(res, row);
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  r.delete("/:id", requireAuth, async (req: any, res) => {
    try {
      await db.delete(table).where(and(eq(table.id, req.params.id), eq(table.userId, req.userId)));
      res.json({ success: true });
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  return r;
}

// ---- Hero Content ----
router.get("/hero_content/:userId", async (req, res) => {
  const [row] = await db.select().from(heroContentTable).where(eq(heroContentTable.userId, req.params.userId)).limit(1);
  return sj(res, row || null);
});

router.post("/hero_content", requireAuth, async (req: any, res) => {
  const body = toCamel(req.body);
  const [existing] = await db.select().from(heroContentTable).where(eq(heroContentTable.userId, req.userId)).limit(1);
  if (existing) {
    const [updated] = await db.update(heroContentTable).set({ ...body, updatedAt: new Date() }).where(eq(heroContentTable.id, existing.id)).returning();
    return sj(res, updated);
  }
  const [created] = await db.insert(heroContentTable).values({ ...body, userId: req.userId }).returning();
  return sj(res, created);
});

// ---- Hero Icons ----
router.get("/hero_icons/:userId", async (req, res) => {
  const rows = await db.select().from(heroIconsTable).where(eq(heroIconsTable.userId, req.params.userId)).orderBy(heroIconsTable.sortOrder);
  return sj(res, rows);
});
router.post("/hero_icons", requireAuth, async (req: any, res) => {
  const body = toCamel(req.body);
  const [row] = await db.insert(heroIconsTable).values({ ...body, userId: req.userId }).returning();
  return sj(res, row);
});
router.patch("/hero_icons/:id", requireAuth, async (req: any, res) => {
  const body = toCamel(req.body);
  const [row] = await db.update(heroIconsTable).set({ ...body, updatedAt: new Date() }).where(and(eq(heroIconsTable.id, req.params.id), eq(heroIconsTable.userId, req.userId))).returning();
  return sj(res, row);
});
router.delete("/hero_icons/:id", requireAuth, async (req: any, res) => {
  await db.delete(heroIconsTable).where(and(eq(heroIconsTable.id, req.params.id), eq(heroIconsTable.userId, req.userId)));
  res.json({ success: true });
});

// ---- About Content ----
router.get("/about_content/:userId", async (req, res) => {
  const [row] = await db.select().from(aboutContentTable).where(eq(aboutContentTable.userId, req.params.userId)).limit(1);
  return sj(res, row || null);
});
router.post("/about_content", requireAuth, async (req: any, res) => {
  const body = toCamel(req.body);
  const [existing] = await db.select().from(aboutContentTable).where(eq(aboutContentTable.userId, req.userId)).limit(1);
  if (existing) {
    const [updated] = await db.update(aboutContentTable).set({ ...body, updatedAt: new Date() }).where(eq(aboutContentTable.id, existing.id)).returning();
    return sj(res, updated);
  }
  const [created] = await db.insert(aboutContentTable).values({ ...body, userId: req.userId }).returning();
  return sj(res, created);
});

// ---- Skills ----
router.get("/skills/:userId", async (req, res) => {
  const rows = await db.select().from(skillsTable).where(eq(skillsTable.userId, req.params.userId)).orderBy(skillsTable.sortOrder);
  return sj(res, rows);
});
router.use("/skills", makeSimpleRoutes(skillsTable));

// ---- Services ----
router.get("/services/:userId", async (req, res) => {
  const rows = await db.select().from(servicesTable).where(eq(servicesTable.userId, req.params.userId)).orderBy(servicesTable.sortOrder);
  return sj(res, rows);
});
router.use("/services", makeSimpleRoutes(servicesTable));

// ---- Projects ----
router.get("/projects/:userId", async (req, res) => {
  const rows = await db.select().from(projectsTable).where(eq(projectsTable.userId, req.params.userId)).orderBy(projectsTable.sortOrder);
  return sj(res, rows);
});
router.use("/projects", makeSimpleRoutes(projectsTable));

// ---- Testimonials ----
router.get("/testimonials/:userId", async (req, res) => {
  const rows = await db.select().from(testimonialsTable).where(eq(testimonialsTable.userId, req.params.userId)).orderBy(testimonialsTable.sortOrder);
  return sj(res, rows);
});
router.use("/testimonials", makeSimpleRoutes(testimonialsTable));

// ---- Contact Messages ----
router.get("/contact_messages/:userId", requireAuth, async (req: any, res) => {
  // Only allow authenticated user to read their own messages (prevent IDOR)
  if (req.params.userId !== req.userId) {
    return res.status(403).json({ error: "Forbidden" });
  }
  const rows = await db.select().from(contactMessagesTable).where(eq(contactMessagesTable.userId, req.userId)).orderBy(contactMessagesTable.createdAt);
  return sj(res, rows);
});

router.post("/contact_messages", async (req, res) => {
  const { name, email, message, user_id } = req.body;
  if (!name || !email || !message) return res.status(400).json({ error: "Missing fields" });
  const [row] = await db.insert(contactMessagesTable).values({ name, email, message, userId: user_id }).returning();
  return sj(res, row);
});

router.delete("/contact_messages/:id", requireAuth, async (req: any, res) => {
  await db.delete(contactMessagesTable).where(and(eq(contactMessagesTable.id, req.params.id), eq(contactMessagesTable.userId, req.userId)));
  res.json({ success: true });
});

// ---- Social Links ----
router.get("/social_links/:userId", async (req, res) => {
  const rows = await db.select().from(socialLinksTable).where(eq(socialLinksTable.userId, req.params.userId)).orderBy(socialLinksTable.sortOrder);
  return sj(res, rows);
});
router.use("/social_links", makeSimpleRoutes(socialLinksTable));

// ---- Site Settings ----
router.get("/site_settings/:userId", async (req, res) => {
  const [row] = await db.select().from(siteSettingsTable).where(eq(siteSettingsTable.userId, req.params.userId)).limit(1);
  return sj(res, row || null);
});
router.post("/site_settings", requireAuth, async (req: any, res) => {
  const body = toCamel(req.body);
  const [existing] = await db.select().from(siteSettingsTable).where(eq(siteSettingsTable.userId, req.userId)).limit(1);
  if (existing) {
    const [updated] = await db.update(siteSettingsTable).set({ ...body, updatedAt: new Date() }).where(eq(siteSettingsTable.id, existing.id)).returning();
    return sj(res, updated);
  }
  const [created] = await db.insert(siteSettingsTable).values({ ...body, userId: req.userId }).returning();
  return sj(res, created);
});

// ---- Stats ----
router.get("/stats/:userId", async (req, res) => {
  const rows = await db.select().from(statsTable).where(eq(statsTable.userId, req.params.userId)).orderBy(statsTable.sortOrder);
  return sj(res, rows);
});
router.use("/stats", makeSimpleRoutes(statsTable));

// ---- Blog Posts ----
router.get("/blog_posts/:userId", async (req: any, res) => {
  const requestingDrafts = req.query.all === "true";
  // Only the authenticated owner can request drafts; everyone else gets published only
  const isOwner = requestingDrafts && req.auth?.userId === req.params.userId;
  let rows = await db.select().from(blogPostsTable).where(eq(blogPostsTable.userId, req.params.userId)).orderBy(blogPostsTable.createdAt);
  if (!isOwner) rows = rows.filter((r: any) => r.isPublished);
  return sj(res, rows);
});
router.use("/blog_posts", makeSimpleRoutes(blogPostsTable));

// ---- Upload (presigned URL for object storage) ----
router.post("/upload/request-url", requireAuth, async (req: any, res) => {
  try {
    const { ObjectStorageService } = await import("../lib/objectStorage");
    const svc = new ObjectStorageService();
    const uploadURL = await svc.getObjectEntityUploadURL();
    const objectPath = svc.normalizeObjectEntityPath(uploadURL);
    res.json({ uploadURL, objectPath });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// ---- Translate ----
router.post("/translate", requireAuth, async (req: any, res) => {
  const { text, targetLang } = req.body;
  if (!text?.trim()) return res.status(400).json({ error: "No text provided" });
  try {
    const from = targetLang === "en" ? "bn" : "en";
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${targetLang}`;
    const r = await fetch(url);
    const json = await r.json() as any;
    const translated = json?.responseData?.translatedText;
    if (!translated) throw new Error("Translation failed");
    res.json({ translated });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
