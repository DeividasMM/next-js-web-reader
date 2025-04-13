"use client";
import { useState, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function Reading() {
  const [isEditable, setIsEditable] = useState(false);
  const [title, setTitle] = useState(
    "Research suggests that timed tests cause math anxiety"
  );
  const [author, setAuthor] = useState("Jo Boaler");
  const [zenMode, setZenMode] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [annotations, setAnnotations] = useState([]);
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const annotationInputRef = useRef(null);

  useEffect(() => {
    const storedDarkMode = localStorage.getItem("darkMode");
    if (storedDarkMode !== null) {
      setDarkMode(JSON.parse(storedDarkMode));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleEdit = () => setIsEditable((prev) => !prev);
  const handleTitleChange = (e) => setTitle(e.target.innerText);
  const handleAuthorChange = (e) => setAuthor(e.target.innerText);

  const toggleZenMode = () => {
    setZenMode((prev) => !prev);
    setIsEditable(false);
  };

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const saveChanges = () => {
    alert("Changes saved successfully!");
  };

  const addAnnotation = (event) => {
    if (
      event.type === "click" ||
      (event.type === "keydown" && event.key === "Enter")
    ) {
      const text = annotationInputRef.current.value;
      if (text.trim()) {
        setAnnotations([
          ...annotations,
          { text, isEditable: true, isEditing: false },
        ]);
        annotationInputRef.current.value = "";
      }
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
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    if (selectedText) {
      setAnnotations([
        ...annotations,
        { text: selectedText, isEditable: false, isEditing: false },
      ]);
      selection.removeAllRanges();
    }
  };

  const goToPrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, numPages || prev));
  };

  return (
    <main
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        flexDirection: "row",
        background: darkMode ? "#121212" : "white",
        color: darkMode ? "white" : "black",
      }}
    >
      <section
        style={{
          border: "1px solid red",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <header
          style={{
            border: "1px solid red",
            width: "1000px",
            margin: "30px 0",
            display: "flex",
            justifyContent: "space-between",
            gap: "20px",
          }}
        >
          <div>
            <h1
              contentEditable={isEditable}
              suppressContentEditableWarning={true}
              onInput={handleTitleChange}
              style={{ margin: "0" }}
            >
              {title}
            </h1>
            <h4
              contentEditable={isEditable}
              suppressContentEditableWarning={true}
              onInput={handleAuthorChange}
              style={{ margin: "0" }}
            >
              {author}
            </h4>
          </div>
          {zenMode ? (
            <button onClick={toggleZenMode}>Exit Zen</button>
          ) : (
            <>
              <button onClick={toggleEdit}>🔓</button>
              <button onClick={saveChanges}>📤</button>
              <button onClick={toggleZenMode}>Zen Mode</button>
              <button onClick={toggleDarkMode}>
                {darkMode ? "Light Mode" : "Dark Mode"}
              </button>
              <button onClick={extractSelectedText}>Extract Selection</button>
            </>
          )}
        </header>

        <div
          style={{
            width: "1000px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "20px",
            marginBottom: "10px",
          }}
        >
          <button
            onClick={goToPrevPage}
            disabled={currentPage === 1}
            style={{ padding: "5px 10px" }}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {numPages || "?"}
          </span>
          <button
            onClick={goToNextPage}
            disabled={currentPage === numPages}
            style={{ padding: "5px 10px" }}
          >
            Next
          </button>
        </div>

        <div style={{ width: "1000px", height: "1100px", overflowY: "auto" }}>
          <Document
            file="./assets/videos/test.pdf"
            onLoadSuccess={onDocumentLoadSuccess}
          >
            <Page
              pageNumber={currentPage}
              width={1000}
              renderTextLayer={true}
              renderAnnotationLayer={true}
            />
          </Document>
        </div>
      </section>

      {!zenMode && (
        <section
          style={{
            border: "1px solid red",
            height: "1159px",
            margin: "0 10px",
            overflowY: "scroll",
            padding: "10px",
            width: "300px",
            marginTop: "50px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            background: darkMode ? "#1e1e1e" : "white",
          }}
        >
          <h2 style={{ marginBottom: "15px" }}>Annotations</h2>
          <ul
            style={{
              paddingLeft: "0",
              listStyleType: "none",
              overflowY: "auto",
              flexGrow: 1,
            }}
          >
            {annotations.map((annotation, index) => (
              <li
                key={index}
                style={{
                  marginBottom: "15px",
                  padding: "10px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  border: "1px solid #ccc",
                  position: "relative",
                  maxWidth: "250px",
                  backgroundColor: annotation.isEditable
                    ? darkMode
                      ? "#8b6f47"
                      : "#d2b48c"
                    : darkMode
                    ? "#b3b300"
                    : "#ffff99",
                }}
              >
                <div
                  style={{
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                    whiteSpace: "pre-wrap",
                    flex: 1,
                    paddingRight: "40px",
                  }}
                >
                  {annotation.isEditing && annotation.isEditable ? (
                    <input
                      type="text"
                      value={annotation.text}
                      onChange={(e) => updateAnnotation(index, e.target.value)}
                      style={{
                        padding: "5px",
                        width: "100%",
                        boxSizing: "border-box",
                        background: darkMode ? "#333" : "white",
                        color: darkMode ? "white" : "black",
                        border: "1px solid #ccc",
                      }}
                    />
                  ) : (
                    annotation.text
                  )}
                </div>
                <div
                  style={{
                    position: "absolute",
                    top: "5px",
                    right: "5px",
                    display: "flex",
                    gap: "5px",
                  }}
                >
                  {annotation.isEditable && (
                    <button
                      onClick={() => toggleEditAnnotation(index)}
                      style={{
                        background: darkMode ? "#444" : "white",
                        color: darkMode ? "white" : "black",
                        border: "1px solid #ccc",
                        padding: "2px 5px",
                        cursor: "pointer",
                      }}
                    >
                      ✏️
                    </button>
                  )}
                  <button
                    onClick={() => deleteAnnotation(index)}
                    style={{
                      background: darkMode ? "#444" : "white",
                      color: darkMode ? "white" : "black",
                      border: "1px solid #ccc",
                      padding: "2px 5px",
                      cursor: "pointer",
                    }}
                  >
                    🗑️
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div style={{ position: "relative" }}>
            <textarea
              ref={annotationInputRef}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                width: "100%",
                height: "80px",
                marginBottom: "15px",
                marginTop: "10px",
                resize: "none",
                background: darkMode ? "#333" : "white",
                color: darkMode ? "white" : "black",
              }}
              placeholder="Write annotation"
              onKeyDown={addAnnotation}
            />
            <button
              onClick={addAnnotation}
              style={{
                position: "absolute",
                bottom: "20px",
                right: "0px",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "20px",
                color: darkMode ? "white" : "black",
              }}
            >
              ➡️
            </button>
          </div>
        </section>
      )}
    </main>
  );
}
