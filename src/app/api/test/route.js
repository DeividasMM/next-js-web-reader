import { turso } from "../../../lib/turso";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await turso.execute("SELECT * FROM users");
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
