import { turso } from "@/lib/turso";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function PUT(req) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, title, author, genre } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Missing pdf_id" }, { status: 400 });
    }

    if (!title || !author || !genre) {
      return NextResponse.json(
        { error: "Missing title, author, or genre" },
        { status: 400 }
      );
    }

    const result = await turso.execute({
      sql: `UPDATE pdfs SET title = ?, author = ?, genre = ? WHERE user_id = ? AND pdf_id = ?`,
      args: [title, author, genre, userId, id],
    });

    if (result.rowsAffected === 0) {
      return NextResponse.json(
        { error: "PDF not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "PDF updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to update PDF" },
      { status: 500 }
    );
  }
}
