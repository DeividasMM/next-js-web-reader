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

    // INSERT ... SELECT so the note is only written when the PDF belongs to the user.
    const result = await turso.execute({
      sql: `
        INSERT INTO notes (pdf_id, content, isExtraction, bookmark_page, created_at)
        SELECT pdf_id, ?, ?, ?, datetime('now')
        FROM pdfs
        WHERE pdf_id = ? AND user_id = ?
      `,
      args: [
        content,
        isExtraction ? 1 : 0,
        bookmark_page ?? null,
        pdf_id,
        userId,
      ],
    });

    if (result.rowsAffected === 0) {
      return NextResponse.json({ error: "PDF not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Note saved" }, { status: 201 });
  } catch (error) {
    console.error("Post error:", error);
    return NextResponse.json({ error: "Failed to save note" }, { status: 500 });
  }
}
