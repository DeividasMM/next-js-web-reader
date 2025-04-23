import Link from "next/link";

export default function Card({ id, title, author }) {
  return (
    <>
      <div className="card">
        <div className="content-box">
          <h3>{title}</h3>
          <p>{author}</p>
        </div>
        <Link href={`/library/${id}/reading`} className="reading-link">
          Start to read!
        </Link>
      </div>
    </>
  );
}
