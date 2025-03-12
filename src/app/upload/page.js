"use client";

import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf, faFileWord } from "@fortawesome/free-regular-svg-icons";

export default function Upload() {
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState("");
  const [textInput1, setTextInput1] = useState("");
  const [textInput2, setTextInput2] = useState("");

  const onDrop = (acceptedFiles) => {
    const uploadedFile = acceptedFiles[0];

    if (
      uploadedFile.type === "application/pdf" ||
      uploadedFile.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      setFileName(uploadedFile.name);
      setFileType(uploadedFile.type);
    } else {
      alert("Only PDF or DOCX files are allowed.");
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: [".pdf", ".docx"],
    multiple: false,
  });

  const getFileIcon = (fileType) => {
    if (fileType === "application/pdf") {
      return //<FontAwesomeIcon icon={faFilePdf} style={{ width: "35px", height: "35px" }} />;
    } else if (fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      return //<FontAwesomeIcon icon={faFileWord} style={{ width: "35px", height: "35px" }} />;
    }
    return null;
  };

  const removeFile = () => {
    setFileName("");
    setFileType("");
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

        .remove-button {
          margin-top: 10px;
          padding: 10px 20px;
          background-color: red;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }

        .remove-button:hover {
          background-color: darkred;
        }
      `}</style>

      <div className="dropzone-container">
        <div {...getRootProps({ className: "dropzone" })}>
          <input {...getInputProps()} />
          <p>Format: docx, pdf</p>
        </div>

        {fileName && (
          <div className="file-info">
            {getFileIcon(fileType)}
            <p>{fileName}</p>
            <button className="remove-button" onClick={removeFile}>
              Remove File
            </button>
          </div>
        )}
      </div>

      <div className="input-container">
        <input
          type="text"
          value={textInput1}
          onChange={(e) => setTextInput1(e.target.value)}
          className="input"
        />
        <input
          type="text"
          value={textInput2}
          onChange={(e) => setTextInput2(e.target.value)}
          className="input"
        />
      </div>
    </div>
  );
}
