"use client";
import { useState, useRef, useEffect } from "react";

export default function Reading() {
  const [iseditable, setiseditable] = useState(false);
  const [title, settitle] = useState("Research suggests that timed tests cause math anxiety");
  const [author, setauthor] = useState("Jo Boaler");
  const [zenmode, setzenmode] = useState(false);
  const [darkmode, setdarkmode] = useState(false);
  const [annotations, setannotations] = useState([]);
  const annotationinputref = useRef(null);

  useEffect(() => {
    const storeddarkmode = localStorage.getItem("dark_mode");
    if (storeddarkmode !== null) {
      setdarkmode(JSON.parse(storeddarkmode));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("dark_mode", JSON.stringify(darkmode));
  }, [darkmode]);

  const toggleedit = () => setiseditable((prev) => !prev);
  const handletitlechange = (e) => settitle(e.target.innerText);
  const handleauthorchange = (e) => setauthor(e.target.innerText);

  const togglezenmode = () => {
    setzenmode((prev) => !prev);
    setiseditable(false);
  };

  const toggledarkmode = () => setdarkmode((prev) => !prev);

  const savechanges = () => {
    alert("Changes saved successfully!");
  };

  const addannotation = (event) => {
    if (
      event.type === "click" ||
      (event.type === "keydown" && event.key === "Enter")
    ) {
      const text = annotationinputref.current.value;
      if (text.trim()) {
        const now = new Date();

        const date =
          now.getFullYear() +
          "-" +
          String(now.getMonth() + 1).padStart(2, "0") +
          "-" +
          String(now.getDate()).padStart(2, "0");

        const time =
          String(now.getHours()).padStart(2, "0") +
          ":" +
          String(now.getMinutes()).padStart(2, "0");

        setannotations([
          ...annotations,
          { text, timestamp: `${date} ${time}`, isediting: false },
        ]);
        annotationinputref.current.value = "";
      }
    }
  };

  const deleteannotation = (index) => {
    setannotations(annotations.filter((_, i) => i !== index));
  };

  const toggleeditannotation = (index) => {
    setannotations(
      annotations.map((annotation, i) =>
        i === index
          ? { ...annotation, isediting: !annotation.isediting }
          : annotation
      )
    );
  };

  const updateannotation = (index, newtext) => {
    setannotations(
      annotations.map((annotation, i) =>
        i === index ? { ...annotation, text: newtext } : annotation
      )
    );
  };

  return (
    <>
      <main
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          flexDirection: "row",
          background: darkmode ? "#121212" : "white",
          color: darkmode ? "white" : "black",
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
                contentEditable={iseditable}
                suppressContentEditableWarning={true}
                onInput={handletitlechange}
                style={{ margin: "0" }}
              >
                {title}
              </h1>
              <h4
                contentEditable={iseditable}
                suppressContentEditableWarning={true}
                onInput={handleauthorchange}
                style={{ margin: "0" }}
              >
                {author}
              </h4>
            </div>
            {zenmode ? (
              <button onClick={togglezenmode}>Exit Zen</button>
            ) : (
              <>
                <button onClick={toggleedit}>🔓</button>
                <button onClick={savechanges}>📤</button>
                <button onClick={togglezenmode}>Zen Mode</button>
                <button onClick={toggledarkmode}>
                  {darkmode ? "Light Mode" : "Dark Mode"}
                </button>
              </>
            )}
          </header>

          <embed
            src="./assets/videos/test.pdf"
            width="1000px"
            height="1100px"
            type="application/pdf"
          />
        </section>

        {!zenmode && (
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
                    paddingLeft: "5px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    border: "1px solid #ccc",
                    padding: "10px",
                    position: "relative",
                    maxWidth: "250px",
                  }}
                >
                  {annotation.isediting ? (
                    <input
                      type="text"
                      value={annotation.text}
                      onChange={(e) => updateannotation(index, e.target.value)}
                      style={{
                        padding: "5px",
                        width: "100%",
                        marginRight: "10px",
                      }}
                    />
                  ) : (
                    annotation.text
                  )}
                  <div
                    style={{
                      position: "absolute",
                      top: "5px",
                      right: "5px",
                      display: "flex",
                      gap: "5px",
                    }}
                  >
                    <button onClick={() => toggleeditannotation(index)}>✏️</button>
                    <button onClick={() => deleteannotation(index)}>🗑️</button>
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      bottom: "-2px",
                      left: "0",
                      fontSize: "12px",
                      color: darkmode ? "#bbb" : "#555",
                    }}
                  >
                    {annotation.timestamp}
                  </div>
                </li>
              ))}
            </ul>
            <div style={{ position: "relative" }}>
              <textarea
                ref={annotationinputref}
                style={{
                  border: "1px solid #ccc",
                  padding: "10px",
                  width: "100%",
                  height: "80px",
                  marginBottom: "15px",
                  marginTop: "10px",
                  resize: "none",
                }}
                placeholder="Write annotation"
                onKeyDown={addannotation}
              />
              <button
                onClick={addannotation}
                style={{
                  position: "absolute",
                  bottom: "20px",
                  right: "0px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "20px",
                }}
              >
                ➡️
              </button>
            </div>
          </section>
        )}
      </main>
    </>
  );
}
