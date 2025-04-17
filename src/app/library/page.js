"use client";

import React, { useState, useEffect } from "react";
import Card from "../card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

export default function Library() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    async function getData() {
      try {
        const response = await fetch("http://localhost:3000/api/getLibrary");
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setBooks(data);
        }
      } catch (e) {
        console.log(e, "LIBRARY FAILS");
      }
    }
    getData();
  }, []);

  return (
    <>
      <img
        src="/assets/images/greek2.png"
        alt="greek2"
        className="greek2"
      ></img>
      <img
        src="/assets/images/greek3.png"
        alt="greek3"
        className="greek3"
      ></img>
      <img
        src="/assets/images/greek4.png"
        alt="greek4"
        className="greek4"
      ></img>
      <div className="container">
        <div className="header-container">
          <h1>Your Library</h1>
          <FontAwesomeIcon icon={faChevronDown} className="scroll-icon" />
          <img src="/assets/images/banner8.png" alt=""></img>
        </div>

        <select className="input-selection-library">
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

        <div className="books-container">
          {books.map((item) => (
            <Card key={item.pdf_id} title={item.title} author={item.author} />
          ))}
          {/* <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card /> */}
        </div>
      </div>
    </>
  );
}
