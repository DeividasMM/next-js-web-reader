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

        <div className="books-container">
          {books.map((item) => (
            <Card
              key={item.pdf_id}
              id={item.pdf_id}
              title={item.title}
              author={item.author}
            />
          ))}
        </div>
      </div>
    </>
  );
}
