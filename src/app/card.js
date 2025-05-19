import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export default function Card({ id, title, author, genre, onDelete }) {
  return (
    <>
      <div className="card">
        <div className="content-box">
          <h3>{title}</h3>
          <p>{author}</p>
          <p>{genre}</p>
        </div>
        <Link href={`/library/${id}/reading`} className="reading-link">
          Start to read!
        </Link>
        <button className="delete-button" onClick={() => onDelete(id)}>
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
    </>
  );
}
