import { turso } from "@/lib/turso";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(req) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { pdf_id, content, isExtraction, bookmark_page } = await req.json();

    if (!pdf_id || !content) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const result = await turso.execute({
      sql: `
        INSERT INTO notes (pdf_id, content, isExtraction, bookmark_page, created_at)
        VALUES (?, ?, ?, ?, datetime('now'))
      `,
      args: [pdf_id, content, isExtraction ? 1 : 0, bookmark_page],
    });

    return NextResponse.json({ message: "Note saved" }, { status: 201 });
  } catch (error) {
    console.error("Post error:", error);
    return NextResponse.json({ error: "Failed to save note" }, { status: 500 });
  }
}
