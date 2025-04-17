export default function Card({ title, author }) {
  return (
    <>
      <div className="card">
        <div className="content-box">
          <h3>{title}</h3>
          <p>{author}</p>
        </div>
        <a href="/reading" className="reading-link">
          Start to read!
        </a>
      </div>
    </>
  );
}
