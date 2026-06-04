import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import { clerkMiddleware } from "@clerk/express";
import { publishableKeyFromHost } from "@clerk/shared/keys";
import {
  CLERK_PROXY_PATH,
  clerkProxyMiddleware,
  getClerkProxyHost,
} from "./middlewares/clerkProxyMiddleware";
import router from "./routes";
import { logger } from "./lib/logger";
import { Readable } from "stream";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

app.use(CLERK_PROXY_PATH, clerkProxyMiddleware());

app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  clerkMiddleware((req) => ({
    publishableKey: publishableKeyFromHost(
      getClerkProxyHost(req) ?? "",
      process.env.CLERK_PUBLISHABLE_KEY,
    ),
  })),
);

// Object storage serving — must be prefix-matched to support nested paths
// like /api/objects/uploads/<uuid>. Express 5 path-to-regexp doesn't allow
// wildcard (*) in routes, so we use app.use() for prefix matching.
app.use("/api/objects", async (req: Request, res: Response) => {
  try {
    const { ObjectStorageService, ObjectNotFoundError } = await import("./lib/objectStorage");
    const svc = new ObjectStorageService();
    // req.path gives the remainder after /api/objects, e.g. /uploads/<uuid>
    const rawPath = "/objects" + req.path;
    const file = await svc.getObjectEntityFile(rawPath);
    const response = await svc.downloadObject(file);
    const headers = Object.fromEntries(response.headers.entries());
    Object.entries(headers).forEach(([k, v]) => res.setHeader(k, v as string));
    res.status(response.status);
    Readable.fromWeb(response.body as any).pipe(res);
  } catch {
    res.status(404).json({ error: "Not found" });
  }
});

app.use("/api", router);

export default app;
