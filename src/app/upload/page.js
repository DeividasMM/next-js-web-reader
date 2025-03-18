"use client";

import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf, faDownload } from "@fortawesome/free-solid-svg-icons";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [selectedOption, setSelectedOption] = useState("");

  const onDrop = (acceptedFiles) => {
    const uploadedFile = acceptedFiles[0];

    // checks if file is pdf
    if (uploadedFile.type === "application/pdf") {
      setFile(uploadedFile);
    } else {
      alert("Only PDF files are allowed.");
    }
  };

  // react-dropzone accepting only a single pdf file at a time
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: [".pdf"],
    multiple: false,
  });

  const removeFile = () => {
    setFile(null);
  };

  const handleSubmit = async () => {
    // check if pdf file uploaded
    if (!file) {
      alert("Please upload a PDF file.");
      return;
    }
    // check if title is written
    if (!title.trim()) {
      alert("Please enter a Title.");
      return;
    }
    // check if author is written
    if (!author.trim()) {
      alert("Please enter an Author.");
      return;
    }
    // check if category selected
    if (!selectedOption) {
      alert("Please select a valid category.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("author", author);
    formData.append("category", selectedOption);

    // send file to db
    try {
      const response = await fetch("", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      alert("File uploaded successfully!");
    } catch (error) {
      alert("Failed to upload file.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <h1 style={{ position: "absolute", top: "20px", textAlign: "center" }}>
        Upload your file!
      </h1>

      {/* dropzone area */}
      <div
        {...getRootProps()}
        style={{
          border: "3px dotted black",
          padding: "40px",
          width: "550px",
          height: "300px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          position: "relative",
        }}
      >
        <input {...getInputProps()} />

        <FontAwesomeIcon
          icon={faDownload}
          style={{ fontSize: "40px", marginBottom: "10px" }}
        />

        <div style={{ textAlign: "center" }}>
          <p style={{ marginBottom: "10px" }}>Format: PDF only</p>
          <p style={{ fontSize: "12px" }}>File cannot exceed 10MB.</p>
        </div>

        {file && (
          <div
            style={{
              position: "absolute",
              bottom: "10px",
              textAlign: "center",
              width: "540px",
            }}
          >
            {/* uploaded file + pdf svg display*/}
            <FontAwesomeIcon
              icon={faFilePdf}
              style={{ fontSize: "35px", marginBottom: "5px" }}
            />
            <p style={{ fontSize: "16px" }}>{file.name}</p>
          </div>
        )}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "550px",
        }}
      >
        {/* title input */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            marginTop: "10px",
            marginBottom: "15px",
            padding: "12px",
            width: "550px",
            height: "46px",
          }}
          placeholder="Title"
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "20px",
            width: "550px",
          }}
        >
          {/* author input */}
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            style={{
              flex: "1",
              padding: "12px",
              height: "46px",
            }}
            placeholder="Author"
          />

          {/* Select dropdown */}
          <select
            style={{
              flex: "1",
              padding: "12px",
              height: "46px",
            }}
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
          >
            <option value="">Select Category</option>
            <option value="fantasy">Fantasy</option>
            <option value="science-fiction">Science Fiction</option>
            <option value="mystery">Mystery</option>
            <option value="romance">Romance</option>
            <option value="historical-fiction">Historical Fiction</option>
            <option value="thriller">Thriller</option>
            <option value="horror">Horror</option>
            <option value="adventure">Adventure</option>
            <option value="biography">Biography</option>
            <option value="business">Business & Finance</option>
            <option value="health">Health & Wellness</option>
            <option value="history">History</option>
            <option value="science">Science & Technology</option>
            <option value="philosophy">Philosophy</option>
          </select>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "550px",
            marginTop: "15px",
          }}
        >
          {/* submit button */}
          <button
            style={{
              padding: "10px 15px",
              textAlign: "center",
              width: "130px",
            }}
            onClick={handleSubmit}
          >
            Submit
          </button>
          {/* remove button */}
          <button
            style={{
              padding: "10px 15px",
              textAlign: "center",
              width: "130px",
            }}
            onClick={removeFile}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
