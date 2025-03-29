import { auth } from "@clerk/nextjs";

export default function handler(req, res) {
  const { userId } = auth();

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  res.json({ userId });
}
