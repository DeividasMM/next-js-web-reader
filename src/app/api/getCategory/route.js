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

    const result = await turso.execute({
      sql: `SELECT genre FROM pdfs WHERE user_id = ? AND pdf_id = ?`,
      args: [userId, pdf_id],
    });

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "PDF not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to fetch genre" },
      { status: 500 }
    );
  }
}
