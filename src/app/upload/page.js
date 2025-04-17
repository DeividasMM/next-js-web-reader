"use client";

import { useUser } from "@clerk/nextjs";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { faFilePdf, faDownload } from "@fortawesome/free-solid-svg-icons";

export default function Upload() {
  const { user } = useUser();
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const router = useRouter();

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

  // submit handling
  const handleSubmit = async () => {
    if (!file || !title.trim() || !author.trim() || !selectedOption) {
      alert("Please fill all fields.");
      return;
    }

    const formData = new FormData();
    formData.append("pdf_file", file);
    formData.append("title", title);
    formData.append("author", author);
    formData.append("genre", selectedOption);

    try {
      const response = await fetch("http://localhost:3000/api/postUpload", {
        method: "POST",
        body: formData,
      });
      const json = await response.json();

      console.log(response.status, json);
      if (response.ok) {
        router.push("/library");
      }
    } catch (e) {
      console.log(e, "BAD THINGS HAPPENING WHEN SUBMITING");
    }
  };

  return (
    <>
      <div>
        <img src="/assets/images/greek.png" alt="greek" className="greek"></img>
        <img src="/assets/images/books.png" alt="books" className="books"></img>
      </div>

      <div className="header-container">
        <h1>Upload Your Files</h1>
        <FontAwesomeIcon icon={faChevronDown} className="scroll-icon" />
        <img src="/assets/images/banner8.png" alt=""></img>
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
            <button onClick={removeFile} className="input-button">
              Remove
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
