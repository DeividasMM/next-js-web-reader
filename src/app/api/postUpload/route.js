import { NextResponse } from "next/server";
import { turso } from "@/lib/turso";
import { auth } from "@clerk/nextjs/server";

export async function POST(req) {
  const db = turso;

  try {
    const { userId } = await auth();

    const { pdf_file, title, author, genre } = await req.json();

    if (!pdf_file || !title || !author || !genre) {
      return NextResponse.json(
        { error: "Missing data fields" },
        { status: 400 }
      );
    }

    if (!pdf_file.startsWith("data:application/pdf;base64,")) {
      return NextResponse.json(
        { error: "Invalid PDF file format" },
        { status: 400 }
      );
    }

    const maxSize = 10 * 1024 * 1024 * 1.33;
    if (Buffer.byteLength(pdf_file, "utf8") > maxSize) {
      return NextResponse.json(
        { error: "File size exceeds 10MB limit" },
        { status: 400 }
      );
    }

    await db.execute({
      sql: "INSERT INTO pdfs (user_id, title, author, genre, pdf_file) VALUES (?,?,?,?,?)",
      args: [userId, title, author, genre, pdf_file],
    });

    console.log({
      userId,
      title,
      author,
      genre,
      pdf_file: "Base64 PDF uploaded 👌",
    });

    return NextResponse.json(
      { message: "PDF uploaded successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to upload PDF" },
      { status: 500 }
    );
  }
}
