import { turso } from "../../../lib/turso";
import { NextResponse } from "next/server";

export async function GET() {
  console.log("GET /api/test called");
  try {
    console.log("Executing query...");
    const result = await turso.execute("SELECT * FROM test");
    console.log("Query result:", result);
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
