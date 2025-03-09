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
          <iframe src="#" width="600" height="800"></iframe>
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
