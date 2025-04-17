export default function Card() {
  return (
    <>
      <div className="card">
        <div className="content-box">
          <h3>title</h3>
          <p>Author</p>
        </div>
        <a href="/reading" className="reading-link">
          Start to read!
        </a>
      </div>
    </>
  );
}
