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
  const [bookmarkPage, setBookmarkPage] = useState(null);
  const [isBookDataLoaded, setIsBookDataLoaded] = useState(false);
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
      if (data.genre) setCategory(data.genre);
      if (data.pdf_file) {
        const formattedPdf = data.pdf_file.startsWith(
          "data:application/pdf;base64,"
        )
          ? data.pdf_file
          : `data:application/pdf;base64,${data.pdf_file}`;
        setPdf(formattedPdf);
      }
      if (data.bookmark_page) {
        const bookmark = parseInt(data.bookmark_page, 10);
        setBookmarkPage(bookmark);
        setCurrentPage(bookmark);
      } else {
        console.log("No bookmark page found, defaulting to page 1");
      }

      if (data.notes) {
        const formattedNotes = data.notes.map((note) => ({
          note_id: note.note_id,
          text: note.content,
          isEditable: !note.isExtraction,
          isEditing: false,
          lightBg: note.isExtraction ? "#fff9a0" : "#e0e0e0",
          darkBg: note.isExtraction ? "#BA8E23" : "#555555",
        }));
        setAnnotations(formattedNotes);
      }

      setIsBookDataLoaded(true);
    }

    if (id) {
      getBook();
    }
  }, [id]);

  const toggleEdit = () => setIsEditable((prev) => !prev);
  const handleTitleChange = (e) => setTitle(e.target.innerText);
  const handleAuthorChange = (e) => setAuthor(e.target.innerText);
  const handleCategoryChange = (e) => setCategory(e.target.value);

  const toggleZenMode = () => {
    setZenMode((prev) => !prev);
    setIsEditable(false);
  };

  const saveChanges = async () => {
    try {
      const response = await fetch(`/api/updateBook`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          title,
          author,
          genre: category,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update book");
      }

      setIsEditable(false);
      const data = await response.json();
    } catch (error) {
      console.error("Error updating book:", error);
    }
  };

  const addAnnotation = async (event) => {
    if (
      event.type === "click" ||
      (event.type === "keydown" && event.key === "Enter")
    ) {
      const text = annotationInputRef.current.value.trim();
      if (!text) return;

      const lightBg = "#e0e0e0";
      const darkBg = "#555555";

      const newAnnotation = {
        text,
        isEditable: true,
        isEditing: false,
        lightBg,
        darkBg,
      };

      setAnnotations((prev) => [...prev, newAnnotation]);
      annotationInputRef.current.value = "";

      await postAnnotationToDB(text, false);
    }
  };

  const deleteAnnotation = async (index) => {
    const annotation = annotations[index];
    if (!annotation.note_id) {
      setAnnotations(annotations.filter((_, i) => i !== index));
      return;
    }

    try {
      const res = await fetch(
        `/api/deleteComment?note_id=${annotation.note_id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        console.error("Failed to delete annotation from DB");
        return;
      }

      setAnnotations(annotations.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Error deleting annotation:", error);
    }
  };

  const toggleEditAnnotation = async (index) => {
    const annotation = annotations[index];

    if (!annotation.isEditable) return;

    if (annotation.isEditing) {
      if (annotation.text === annotation.originalText) {
        setAnnotations(
          annotations.map((a, i) =>
            i === index ? { ...a, isEditing: false } : a
          )
        );
        return;
      }

      try {
        const res = await fetch("/api/updateComment", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            note_id: annotation.note_id,
            content: annotation.text,
          }),
        });

        if (!res.ok) {
          console.error("Failed to update annotation");
          return;
        }
      } catch (error) {
        console.error("Update error:", error);
        return;
      }
    }

    setAnnotations(
      annotations.map((a, i) =>
        i === index
          ? { ...a, isEditing: !a.isEditing, originalText: a.text }
          : a
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
    if (bookmarkPage && bookmarkPage <= numPages) {
      setCurrentPage(bookmarkPage);
    }
  };

  const extractSelectedText = async () => {
    const selection = window.getSelection().toString().trim();
    if (!selection) return;

    const lightYellow = "#fff9a0";
    const darkYellow = "#BA8E23";

    const newExtraction = {
      text: selection,
      isEditable: false,
      isEditing: false,
      lightBg: lightYellow,
      darkBg: darkYellow,
    };

    setAnnotations((prev) => [...prev, newExtraction]);
    window.getSelection().removeAllRanges();

    await postAnnotationToDB(selection, true);
  };

  const goToPrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, numPages || prev));
  };

  const [theme, setTheme] = useState("light");

  const postAnnotationToDB = async (
    text,
    isExtraction,
    pageNumber = currentPage
  ) => {
    try {
      const res = await fetch("/api/postComment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pdf_id: id,
          content: text,
          isExtraction,
          bookmark_page: pageNumber,
        }),
      });

      if (!res.ok) throw new Error("Failed to post annotation");
    } catch (error) {
      console.error("Post error:", error);
    }
  };

  const handleBookmark = async () => {
    try {
      const res = await fetch("/api/bookmark", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pdf_id: id,
          page: currentPage,
        }),
      });

      if (!res.ok) {
        console.error("Failed to bookmark page");
        return;
      }

      setBookmarkPage(currentPage);
      console.log(`Bookmarked page ${currentPage}`);
    } catch (err) {
      console.error("Bookmark error:", err);
    }
  };

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
                  onBlur={handleTitleChange}
                  style={
                    isEditable
                      ? {
                          border: "2px solid #4a90e2",
                          background: "rgba(255, 255, 255, 0.1)",
                          backdropFilter: "blur(5px)",
                          WebkitBackdropFilter: "blur(5px)",
                          padding: "5px",
                          borderRadius: "5px",
                        }
                      : {}
                  }
                >
                  {title}
                </h1>
                <h4
                  contentEditable={isEditable}
                  suppressContentEditableWarning={true}
                  onBlur={handleAuthorChange}
                  style={
                    isEditable
                      ? {
                          border: "2px solid #4a90e2",
                          background: "rgba(255, 255, 255, 0.1)",
                          backdropFilter: "blur(5px)",
                          WebkitBackdropFilter: "blur(5px)",
                          padding: "5px",
                          borderRadius: "5px",
                        }
                      : {}
                  }
                >
                  {author}
                </h4>
                {isEditable ? (
                  <select
                    value={category}
                    onChange={handleCategoryChange}
                    style={{ paddingLeft: "10px", width: "max-content" }}
                  >
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
                    {category && category.length > 0
                      ? category[0].toLocaleUpperCase() + category.slice(1)
                      : "No category"}
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
                <button onClick={handleBookmark}>Bookmark</button>
                <button
                  onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                >
                  {theme === "light" ? "Dark Mode" : "Light Mode"}
                </button>
                <button onClick={extractSelectedText}>Extract Selection</button>
              </>
            )}
          </div>
        </header>

        <div className="document">
          {pdf && isBookDataLoaded && currentPage ? (
            <Document
              file={pdf}
              key={pdf}
              onLoadSuccess={onDocumentLoadSuccess}
            >
              <Page
                key={`page-${currentPage}`}
                pageNumber={currentPage}
                width={1000}
                renderTextLayer={true}
                renderAnnotationLayer={false}
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
                    <textarea
                      value={annotation.text}
                      onChange={(e) => updateAnnotation(index, e.target.value)}
                      rows={Math.max(
                        4,
                        Math.max(
                          annotation.text.split("\n").length,
                          Math.ceil(annotation.text.length / 44)
                        )
                      )}
                      style={{ width: "100%", resize: "vertical" }}
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
