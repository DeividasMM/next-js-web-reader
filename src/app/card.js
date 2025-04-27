import Link from "next/link";

export default function Card({ id, title, author, onDelete }) {
  return (
    <>
      <div className="card" style={{ position: "relative" }}>
        <div className="content-box">
          <h3>{title}</h3>
          <p>{author}</p>
        </div>
        <Link href={`/library/${id}/reading`} className="reading-link">
          Start to read!
        </Link>
        <button
          onClick={() => onDelete(id)}
          style={{
            position: "absolute",
            top: "10px",
            padding: "5px",
            cursor: "pointer"
          }}
        >
          Delete
        </button>
      </div>
    </>
  );
}