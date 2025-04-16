import { auth } from "@clerk/nextjs";

export default function getUserId(req, res) {
  const { userId } = auth();

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  res.json({ userId });
}
