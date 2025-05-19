import { turso } from "@/lib/turso";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PUT(req) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { pdf_id, page } = await req.json();

    if (!pdf_id || typeof page !== "number") {
      return NextResponse.json(
        { error: "Missing pdf_id or page" },
        { status: 400 }
      );
    }

    const result = await turso.execute({
      sql: `
        UPDATE pdfs
        SET bookmark_page = ?
        WHERE pdf_id = ? AND user_id = ?
      `,
      args: [page, pdf_id, userId],
    });

    if (result.rowsAffected === 0) {
      return NextResponse.json(
        { error: "PDF not found or not owned" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Bookmark saved" }, { status: 200 });
  } catch (error) {
    console.error("Error saving bookmark:", error);
    return NextResponse.json(
      { error: "Failed to save bookmark" },
      { status: 500 }
    );
  }
}
