// Add new note
document.getElementById("add-note").addEventListener("click", () => {
  // const title = document.getElementById("title").value;
  const content = document.getElementById("note-text").value;

  if (content) {
    const newNote = {content};
    console.log(newNote);

    fetch("/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newNote),
    })
    .then((response) => response.json())
    .then((data) => {
      fetchNotes(); // Fetch updated list
    });
  }
});

// Fetch and display all notes
const fetchNotes = () => {
  fetch("/notes")
    .then((response) => response.json())
    .then((data) => {
      const notesList = document.getElementById("notes-list");
      notesList.innerHTML = ""; // Clear current list

      data.forEach(note => {
        const li = document.createElement("li");
        li.innerHTML = `${note.content}
          <button onclick="deleteNote(${note.id})">Delete</button>
          <button onclick="editNote(${note.id})">Edit</button>`;
        notesList.appendChild(li);
      });
    });
};

// Delete a note
const deleteNote = (id) => {
  fetch(`/notes/${id}`, {
    method: "DELETE",
  }).then(() => {
    fetchNotes(); // Fetch updated list
  });
};

// Edit a note (in a real app, this would probably show an edit form)
const editNote = (id) => {
  const newContent = prompt("Enter new content for this note:");
  if (newContent) {
    fetch(`/notes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: newContent }),
    }).then(() => {
      fetchNotes(); // Fetch updated list
    });
  }
};

// Load notes on page load
fetchNotes();
