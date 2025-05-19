"use client";

import { useUser } from "@clerk/nextjs";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faFilePdf,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";

export default function Upload() {
  const { user } = useUser();
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const router = useRouter();

  const onDrop = (acceptedFiles) => {
    const uploadedFile = acceptedFiles[0];

    if (uploadedFile.type === "application/pdf") {
      setFile(uploadedFile);
    } else {
      alert("Only PDF files are allowed.");
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    multiple: false,
  });

  const removeFile = () => {
    setFile(null);
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async () => {
    if (!file || !title.trim() || !author.trim() || !selectedOption) {
      alert("Please fill all fields.");
      return;
    }

    try {
      const base64PDF = await convertToBase64(file);

      const payload = {
        pdf_file: base64PDF,
        title,
        author,
        genre: selectedOption,
      };

      const response = await fetch("http://localhost:3000/api/postUpload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const json = await response.json();
      console.log(response.status, json);

      if (response.ok) {
        router.push("/library");
      }
    } catch (e) {
      console.log(e, "BAD THINGS HAPPENING WHEN SUBMITTING");
    }
  };

  return (
    <>
      <div>
        <img src="/assets/images/greek.png" alt="greek" className="greek" />
        <img src="/assets/images/books.png" alt="books" className="books" />
      </div>

      <div className="header-container">
        <h1>Upload Your Files</h1>
        <a href="#main-container">
          <FontAwesomeIcon icon={faChevronDown} className="scroll-icon" />
        </a>
        <img src="/assets/images/banner8.png" alt="" />
      </div>

      <div className="main-container" id="main-container">
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
              <FontAwesomeIcon icon={faFilePdf} className="white-icons" />
              <p>{file.name}</p>
            </div>
          )}
        </div>

        <div>
          <input
            className="input-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
          />
          <div className="input-author-selection">
            <input
              className="input-author"
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Author"
            />
            <select
              className="input-selection"
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}
            >
              <option value="">Select Category</option>
              <option value="adventure">Adventure</option>
              <option value="biography">Biography</option>
              <option value="business">Business & Finance</option>
              <option value="fantasy">Fantasy</option>
              <option value="health">Health & Wellness</option>
              <option value="historical-fiction">Historical Fiction</option>
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
              <option value="science">Science & Technology</option>
              <option value="science-fiction">Science Fiction</option>
              <option value="scientific-work">Scientific Work</option>
              <option value="summary">Summary</option>
              <option value="thriller">Thriller</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="input-buttons">
            <button onClick={handleSubmit} className="input-button">
              Submit
            </button>
            <button onClick={removeFile} className="input-button">
              Remove
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
