import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { turso } from "./lib/turso";

export default clerkMiddleware(async (auth, req) => {
  const db = turso;

  try {
    const isProtectedRoute = createRouteMatcher([
      "/upload(.*)",
      "/library(.*)",
    ]);
    if (isProtectedRoute(req)) await auth.protect();

    const { userId, sessionClaims } = await auth();

    if (userId) {
      const email = sessionClaims?.email || "FAIL@example.com";
      const name =
        sessionClaims?.firstName || sessionClaims?.username || "FAIL";

      console.log("USER DATA 👉:", { userId, email, name });

      const userExists = await db.execute({
        sql: "SELECT clerk_user_id FROM users WHERE clerk_user_id = ?",
        args: [userId],
      });
      // console.log("USER IS 👉:", userExists.rows);

      if (!userExists.rows.length) {
        const insertResult = await db.execute({
          sql: "INSERT INTO users (clerk_user_id, name, email, user_type) VALUES (?, ?, ?, ?)",
          args: [userId, name, email, "consumer"],
        });
      }
    }
  } catch (e) {
    console.error("MIDDLEWARE ERROR 👉:", e);
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
