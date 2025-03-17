"use client";

import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from "@fortawesome/free-regular-svg-icons";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [Title, setTitle] = useState("");
  const [Author, setAuthor] = useState("");
  const [selectedOption, setSelectedOption] = useState("");

  const onDrop = (acceptedFiles) => {
    const uploadedFile = acceptedFiles[0];

    // Checks if file is pdf
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

  // displays svg when correct file type is detected
  const getFileIcon = (fileType) => {
    if (fileType === "application/pdf") {
      return //<FontAwesomeIcon icon={faFilePdf} style={{ width: "35px", height: "35px" }} />;
    }
    return null;
  };

  // removes uploaded file
  const removeFile = () => {
    setFile(null);
  };

  // check if pdf file uploaded
  const handleSubmit = async () => {
    if (!file) {
      alert("Please upload a PDF file.");
      return;
    }
    // check if title is written
    if (!Title.trim()) {
      alert("Please enter a Title.");
      return;
    }
    // check if author is written
    if (!Author.trim()) {
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
    formData.append("title", Title);
    formData.append("author", Author);
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
    <div className="container">
      <style>{`
        .container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
        }

        .dropzone-container {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .dropzone {
          border: 2px solid black;
          padding: 40px;
          width: 350px;
          height: 500px;
          text-align: center;
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 10px;
        }

        .file-info {
          margin-top: 20px;
          text-align: center;
          font-size: 20px;
          word-wrap: break-word;
          word-break: break-word;
          max-width: 75%;
        }

        .input-container {
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          margin-left: 50px;
          position: relative;
          top: -205px;
        }

        .input {
          margin-bottom: 10px;
          padding: 5px;
          font-size: 16px;
          width: 200px;
          border: 2px solid black;
          border-radius: 16px;
        }

        .select-box {
          margin-top: 10px;
          padding: 5px;
          font-size: 16px;
          width: 200px;
          border: 2px solid black;
          border-radius: 16px;
          background-color: white;
          cursor: pointer;
        }

        .remove-button, .submit-button {
          margin-top: 10px;
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }

        .remove-button {
          background-color: red;
          color: white;
        }

        .remove-button:hover {
          background-color: darkred;
        }

        .submit-button {
          background-color: blue;
          color: white;
          font-size: 16px;
        }

        .submit-button:hover {
          background-color: darkblue;
        }
      `}</style>

      {/* dropzone area */}
      <div className="dropzone-container">
        <div {...getRootProps({ className: "dropzone" })}>
          <input {...getInputProps()} />
          <p>Format: PDF only</p>
        </div>

        {/* uploaded file display + remove file button/function */}
        {file && (
          <div className="file-info">
            {getFileIcon(file.type)}
            <p>{file.name}</p>
            <button className="remove-button" onClick={removeFile}>
              Remove File
            </button>
          </div>
        )}
      </div>

      {/* text input fields */}
      <div className="input-container">
        <input
          type="text"
          value={Title}
          onChange={(e) => setTitle(e.target.value)}
          className="input"
          placeholder="Title"
        />
        <input
          type="text"
          value={Author}
          onChange={(e) => setAuthor(e.target.value)}
          className="input"
          placeholder="Author"
        />

        {/* Select dropdown */}
        <select
          className="select-box"
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

        {/* Submit button */}
        <button className="submit-button" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
}
