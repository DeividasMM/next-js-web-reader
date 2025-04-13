"use client";

import { useUser } from "@clerk/nextjs";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf, faDownload } from "@fortawesome/free-solid-svg-icons";

export default function Upload() {
  const { user } = useUser();
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [selectedOption, setSelectedOption] = useState("");

  console.log(user);

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
    accept: { "application/pdf": [".pdf"] },
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

      console.log(formData);
      alert("File uploaded successfully!");
    } catch (error) {
      alert("Failed to upload file.");
    }
  };

  return (
    <>
    <div>
    <img src="/assets/images/greek.png" alt="greek" className="greek"></img>
    <img src="/assets/images/books.png" alt="books" className="books"></img>
    </div>
    <div className="main-container">
      {/* dropzone area */}
      <div {...getRootProps()} className="drop-zone">
        <h1 className="header">Upload your file!</h1>
        <input {...getInputProps()} />

        <FontAwesomeIcon icon={faDownload} className="white-icons" />

        <div className="drop-zone-content">
          <p>Format: PDF only</p>
          <p>File cannot exceed 10MB.</p>
        </div>

        {file && (
          <div className="drop-zone-upload">
            {/* uploaded file + pdf svg display*/}
            <FontAwesomeIcon icon={faFilePdf} className="white-icons" />
            <p>{file.name}</p>
          </div>
        )}
      </div>

      <div>
        {/* title input */}
        <input
          className="input-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
        />

        <div className="input-author-selection">
          {/* author input */}
          <input
            className="input-author"
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Author"
          />

          {/* Select dropdown */}
          <select
            className="input-selection"
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

        <div className="input-buttons">
          {/* submit button */}
          <button onClick={handleSubmit} className="input-button">
            Submit
          </button>
          {/* remove button */}
          <button onClick={removeFile}>
            Remove
          </button>
        </div>
      </div>
    </div>
    </>
  );
}
