$(document).ready(function() {
  // 1. Go to the editing page
  $("#editBtn").click(function() {
    // Можно взять fileId из заголовка, из скрытого поля или data-атрибута
    const fileId = $("h1").text().replace("Reading: ", "");
    window.location.href = /edit/${fileId};
  });

  // 2. Switching theme
  $("#themeSelect").change(function() {
    const selectedTheme = $(this).val(); // light, sepia, dark
    $("body")
      .removeClass("theme-light theme-sepia theme-dark")
      .addClass(theme-${selectedTheme});
  });

  // 3. Loading (or displaying) existing notes
// (Let's say we can load them via AJAX if we have an API)
// Below is a simplified example of "hardcoded" notes
  const mockNotes = [
    { text: "Interesting fact on page 10" },
    { text: "Check references for more info" }
  ];
  renderNotes(mockNotes);

  function renderNotes(notes) {
    $("#notesList").empty();
    notes.forEach(note => {
      $("#notesList").append(<li>${note.text}</li>);
    });
  }

  // 4. Saving a new note
  $("#saveNoteBtn").click(function() {
    const newText = $("#newNoteText").val().trim();
    if (!newText) return;

   // In a real application, we will send a request to the server (AJAX POST)
// Here we will add it to mockNotes in a simplified way
    mockNotes.push({ text: newText });
    renderNotes(mockNotes);

    // Clear field
    $("#newNoteText").val("");

    // show a success notification
    alert("Note saved (mock)!");
  });
});
