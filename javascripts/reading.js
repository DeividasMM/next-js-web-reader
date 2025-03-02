$(document).ready(function () {
      $("#editBtn").click(function () {
        const fileId = $("editBtn").data("file-id");
        window.location.href = `/edit/${fileId}`;
      });

      $("#themeSelect").change(function () {
        const selectedTheme = $(this).val() || "light";
        $("body")
          .attr("class", "")
          .addClass(`theme-${selectedTheme}`);
      });

      function saveNotesToStorage(notes) {
        localStorage.setItem("notes", JSON.stringify(notes));
      }

      function loadNotesFromStorage() {
        return JSON.parse(localStorage.getItem("notes")) || [];
      }

      function renderNotes(notes) {
        $("#noteList").empty();
        notes.forEach(note => {
          $("#notesList").append(`<li>${note.text}</li>`);
        });
      }

      let mockNotes = loadNotesFromStorage();
      renderNotes(mockNotes);

      function showNotification(message) {
        $("#notification").text(message).fadeIn().delay(2000).fadeOut();
      }

      $("#saveNoteBtn").click(function () {
        const newText = $("#newNoteText").val().trim();
        if (!newText) return;

        mockNotes.push({ text: newText });
        renderNotes(mockNotes);
        saveNotesToStorage(mockNotes);

        $("#newNoteText").val("");
        showNotification("Note saved!");
      });
    });
