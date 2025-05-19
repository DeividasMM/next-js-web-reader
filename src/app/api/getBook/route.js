import { turso } from "@/lib/turso";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET(req) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const pdf_id = searchParams.get("id");

    if (!pdf_id) {
      return NextResponse.json({ error: "Missing pdf_id" }, { status: 400 });
    }

    const pdfResult = await turso.execute({
      sql: `SELECT title, author, genre, pdf_file, bookmark_page FROM pdfs WHERE user_id = ? AND pdf_id = ?`,
      args: [userId, pdf_id],
    });

    if (!pdfResult || !pdfResult.rows || pdfResult.rows.length === 0) {
      return NextResponse.json({ error: "PDF not found" }, { status: 404 });
    }

    const notesResult = await turso.execute({
      sql: `
        SELECT note_id, content, isExtraction, bookmark_page, created_at
        FROM notes
        WHERE pdf_id = ?
        ORDER BY created_at ASC
      `,
      args: [pdf_id],
    });

    const response = {
      ...pdfResult.rows[0],
      notes: notesResult.rows || [],
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to fetch book" },
      { status: 500 }
    );
  }
}
