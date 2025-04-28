"use client";
import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faPenToSquare,
  faSquareCaretRight,
} from "@fortawesome/free-solid-svg-icons";
import { useParams } from "next/navigation";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function Reading() {
  const [title, setTitle] = useState("Title");
  const [author, setAuthor] = useState("Author");
  const [category, setCategory] = useState("");
  const [pdf, setPdf] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [zenMode, setZenMode] = useState(false);
  const [annotations, setAnnotations] = useState([]);
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const annotationInputRef = useRef(null);
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    async function getBook() {
      const res = await fetch(`/api/getBook?id=${id}`);
      const data = await res.json();
      setData(data);

      if (data.title) setTitle(data.title);
      if (data.author) setAuthor(data.author);
      if (data.category) setCategory(data.category);
      if (data.pdf_file) {
        setPdf(
          data.pdf_file.startsWith("data:application/pdf;base64,")
            ? data.pdf_file
            : `data:application/pdf;base64,${data.pdf_file}`
        );
      }
    }

    if (id) {
      getBook();
    }
  }, [id]);
  console.log(data);

  const toggleEdit = () => setIsEditable((prev) => !prev);
  const handleTitleChange = (e) => setTitle(e.target.innerText);
  const handleAuthorChange = (e) => setAuthor(e.target.innerText);
  const handleCategoryChange = (e) => setCategory(e.target.value);

  const toggleZenMode = () => {
    setZenMode((prev) => !prev);
    setIsEditable(false);
  };

  const saveChanges = () => {
    alert("Changes saved successfully!");
  };

  const addAnnotation = (event) => {
    if (
      event.type === "click" ||
      (event.type === "keydown" && event.key === "Enter")
    ) {
      const text = annotationInputRef.current.value.trim();
      if (!text) return;
      const lightBg = "#e0e0e0";
      const darkBg = "#555555";
      setAnnotations((prev) => [
        ...prev,
        {
          text,
          isEditable: true,
          isEditing: false,
          lightBg,
          darkBg,
        },
      ]);
      annotationInputRef.current.value = "";
    }
  };

  const deleteAnnotation = (index) => {
    setAnnotations(annotations.filter((_, i) => i !== index));
  };

  const toggleEditAnnotation = (index) => {
    setAnnotations(
      annotations.map((annotation, i) =>
        i === index && annotation.isEditable
          ? { ...annotation, isEditing: !annotation.isEditing }
          : annotation
      )
    );
  };

  const updateAnnotation = (index, newText) => {
    setAnnotations(
      annotations.map((annotation, i) =>
        i === index ? { ...annotation, text: newText } : annotation
      )
    );
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const extractSelectedText = () => {
    const selection = window.getSelection().toString().trim();
    if (!selection) return;
    const lightYellow = "#fff9a0";
    const darkYellow = "#BA8E23";
    setAnnotations((prev) => [
      ...prev,
      {
        text: selection,
        isEditable: false,
        isEditing: false,
        lightBg: lightYellow,
        darkBg: darkYellow,
      },
    ]);
    window.getSelection().removeAllRanges();
  };

  const goToPrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, numPages || prev));
  };

  const [theme, setTheme] = useState("light");

  return (
    <main className={theme} id="reading-main-container">
      <section id="main-section">
        <header className="reading-header-container">
          <div>
            {!zenMode && (
              <div className="header-text-container">
                <h1
                  contentEditable={isEditable}
                  suppressContentEditableWarning={true}
                  onInput={handleTitleChange}
                >
                  {title}
                </h1>
                <h4
                  contentEditable={isEditable}
                  suppressContentEditableWarning={true}
                  onInput={handleAuthorChange}
                >
                  {author}
                </h4>
                {isEditable ? (
                  <select value={category} onChange={handleCategoryChange}>
                    <option value="">Select Category</option>
                    <option value="adventure">Adventure</option>
                    <option value="biography">Biography</option>
                    <option value="business-finance">Business & Finance</option>
                    <option value="fantasy">Fantasy</option>
                    <option value="health-wellness">Health & Wellness</option>
                    <option value="historical-fiction">
                      Historical Fiction
                    </option>
                    <option value="history">History</option>
                    <option value="horror">Horror</option>
                    <option value="information-technology">
                      Information Technology
                    </option>
                    <option value="manga">Manga</option>
                    <option value="mystery">Mystery</option>
                    <option value="paper">Paper</option>
                    <option value="philosophy">Philosophy</option>
                    <option value="report">Report</option>
                    <option value="research">Research</option>
                    <option value="romance">Romance</option>
                    <option value="science-technology">
                      Science & Technology
                    </option>
                    <option value="science-fiction">Science Fiction</option>
                    <option value="scientific-work">Scientific Work</option>
                    <option value="summary">Summary</option>
                    <option value="thriller">Thriller</option>
                    <option value="other">Other</option>
                  </select>
                ) : (
                  <p>
                    {category === "science-technology"
                      ? "Science & Technology"
                      : category === "health-wellness"
                      ? "Health & Wellness"
                      : category === "business-finance"
                      ? "Business & Finance"
                      : category
                      ? category
                          .split("-")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          )
                          .join(" ")
                      : "No category selected"}
                  </p>
                )}
              </div>
            )}
          </div>
          <div className="reading-button-container">
            {zenMode ? (
              <button onClick={toggleZenMode}>Exit Zen</button>
            ) : (
              <>
                <button onClick={toggleEdit}>Edit</button>
                <button onClick={saveChanges}>Save Changes</button>
                <button onClick={toggleZenMode}>Zen Mode</button>
                <button>Bookmark</button>
                <button
                  onClick={() => setTheme(theme == "light" ? "dark" : "light")}
                >
                  {theme === "light" ? "Dark Mode" : "Light Mode"}
                </button>
                <button onClick={extractSelectedText}>Extract Selection</button>
              </>
            )}
          </div>
        </header>

        <div className="document">
          {pdf ? (
            <Document file={pdf} onLoadSuccess={onDocumentLoadSuccess}>
              <Page
                pageNumber={currentPage}
                width={1000}
                renderTextLayer={true}
                renderAnnotationLayer={true}
              />
            </Document>
          ) : (
            <p>Loading PDF...</p>
          )}
        </div>

        <div className="page-scroll-buttons">
          <button onClick={goToPrevPage} disabled={currentPage === 1}>
            Previous
          </button>
          <span>
            Page {currentPage} of {numPages || "?"}
          </span>
          <button onClick={goToNextPage} disabled={currentPage === numPages}>
            Next
          </button>
        </div>
      </section>

      {!zenMode && (
        <section className="annotations-container">
          <h2>Annotations</h2>
          <ul>
            {annotations.map((annotation, index) => (
              <li
                key={index}
                className="annotation-item"
                style={{
                  "--light-bg": annotation.lightBg,
                  "--dark-bg": annotation.darkBg,
                }}
              >
                <div className="annotation-text">
                  {annotation.isEditing && annotation.isEditable ? (
                    <input
                      type="text"
                      value={annotation.text}
                      onChange={(e) => updateAnnotation(index, e.target.value)}
                    />
                  ) : (
                    annotation.text
                  )}
                </div>
                <div className="reading-icon-buttons">
                  {annotation.isEditable && (
                    <button onClick={() => toggleEditAnnotation(index)}>
                      <FontAwesomeIcon
                        icon={faPenToSquare}
                        className="reading-icon"
                      />
                    </button>
                  )}
                  <button onClick={() => deleteAnnotation(index)}>
                    <FontAwesomeIcon icon={faTrash} className="reading-icon" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="textarea">
            <textarea
              ref={annotationInputRef}
              placeholder="Write annotation"
              onKeyDown={addAnnotation}
            />
            <button onClick={addAnnotation} className="textarea-button">
              <FontAwesomeIcon
                icon={faSquareCaretRight}
                className="textarea-icon"
              />
            </button>
          </div>
        </section>
      )}
    </main>
  );
}
