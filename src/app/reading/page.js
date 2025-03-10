import React from "react";
// /reading/:id
export default function Reading() {
  return (
    <>
      <div>
        <header>
          <h1>Reading:</h1>
          <button id="editBtn">Edit</button>
        </header>

        <div>
          <label for="themeSelect">Theme:</label>
          <select id="themeSelect">
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>

        <div>
          <embed
            src="./assets/videos/test.pdf"
            width="1000px"
            height="1100px"
            type="application/pdf"
          />
        </div>

        <div>
          <h2>My Notes</h2>
          <ul id="notesList">
            <li>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Cupiditate optio nesciunt blanditiis sunt alias rem deserunt,
              libero dolores eum vitae?
            </li>
          </ul>

          <textarea id="newNoteText"></textarea>
          <button id="saveNoteBtn">Save note</button>
        </div>

        <div>BLINK</div>
      </div>
    </>
  );
}
