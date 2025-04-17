import { NextResponse } from "next/server";
import { turso } from "@/lib/turso";
import { auth } from "@clerk/nextjs/server";

export async function POST(req) {
  const db = turso;

  try {
    const { userId } = await auth();
    const formData = await req.formData();

    const title = formData.get("title");
    const author = formData.get("author");
    const genre = formData.get("genre");
    const pdf_file = formData.get("pdf_file");

    if (!title || !author || !genre || !pdf_file) {
      return NextResponse.json(
        { error: "Missing data fields" },
        { status: 400 }
      );
    }

    let pdfBuffer;
    if (pdf_file instanceof File) {
      const arrayBuffer = await pdf_file.arrayBuffer();
      pdfBuffer = Buffer.from(arrayBuffer);
    } else {
      return NextResponse.json({ error: "Invalid PDF file" }, { status: 400 });
    }

    await db.execute({
      sql: "INSERT INTO pdfs (user_id, title, author, genre, pdf_file) VALUES (?,?,?,?,?)",
      args: [userId, title, author, genre, pdfBuffer],
    });

    console.log({
      userId,
      title,
      author,
      genre,
      pdf_file: "PDF file uploaded 👌",
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
