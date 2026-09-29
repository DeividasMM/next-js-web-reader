import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { turso } from "./lib/turso";

export default clerkMiddleware(async (auth, req) => {
  const db = turso;

  const isProtectedRoute = createRouteMatcher([
    "/upload(.*)",
    "/library(.*)",
    "/reading(.*)",
  ]);
  if (isProtectedRoute(req)) await auth.protect();

  const { userId, sessionClaims } = await auth();

  // console.log("🚩 Full sessionClaims:", sessionClaims);

  if (userId) {
    const email = sessionClaims?.email || "NO-VERIFIED@example.com";
    const name = sessionClaims?.firstName || "NO-NAME";
    const surname = sessionClaims?.lastName || "NO-SURNAME";

    const userExists = await db.execute({
      sql: "SELECT clerk_user_id FROM users WHERE clerk_user_id = ?",
      args: [userId],
    });
    // console.log("USER IS 👉:", userExists.rows);

    if (!userExists.rows.length) {
      await db.execute({
        sql: "INSERT INTO users (clerk_user_id, name, surname, email, user_type) VALUES (?, ?, ?, ?, ?)",
        args: [userId, name, surname, email, "consumer"],
      });
    }
  }
});

export const config = {
  // Node.js runtime (stable since Next 15.5) so the libSQL client can also use
  // the local file database; the Edge runtime only supports remote URLs.
  runtime: "nodejs",
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
