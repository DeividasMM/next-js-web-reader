import { turso } from "@/lib/turso";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(req) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const note_id = searchParams.get("note_id");

    if (!note_id) {
      return NextResponse.json({ error: "Missing note_id" }, { status: 400 });
    }

    const result = await turso.execute({
      sql: `DELETE FROM notes WHERE note_id = ? AND pdf_id IN (SELECT pdf_id FROM pdfs WHERE user_id = ?)`,
      args: [note_id, userId],
    });

    if (result.rowsAffected === 0) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Note deleted" }, { status: 200 });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to delete note" },
      { status: 500 }
    );
  }
}
