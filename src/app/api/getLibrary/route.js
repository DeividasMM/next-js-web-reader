import { turso } from "@/lib/turso";
import { NextResponse } from "next/server";

import { auth } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const { userId } = await auth();

    const result = await turso.execute({
      sql: `SELECT * FROM pdfs WHERE user_id = ?`,
      args: [userId],
    });
    if (!result || !result.rows) {
      return NextResponse.json(
        { error: "No data returned from database" },
        { status: 500 }
      );
    }
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to fetch test" },
      { status: 500 }
    );
  }
}
