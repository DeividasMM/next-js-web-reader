import { turso } from "@/lib/turso";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PUT(req) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { note_id, content } = await req.json();

    if (!note_id || !content) {
      return NextResponse.json(
        { error: "Missing note_id or content" },
        { status: 400 }
      );
    }

    const result = await turso.execute({
      sql: `
        UPDATE notes
        SET content = ?
        WHERE note_id = ?
        AND pdf_id IN (
          SELECT pdf_id FROM pdfs WHERE user_id = ?
        )
      `,
      args: [content, note_id, userId],
    });

    if (result.rowsAffected === 0) {
      return NextResponse.json(
        { error: "Note not found or not owned" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Note updated" }, { status: 200 });
  } catch (error) {
    console.error("Error updating note:", error);
    return NextResponse.json(
      { error: "Failed to update note" },
      { status: 500 }
    );
  }
}
