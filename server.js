const express = require("express");
const app = express();
const port = 3000;
const fs = require("fs");
const path = require("path");

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

app.use(express.json()); // for parsing JSON bodies
app.use(express.static(path.join(__dirname, "public"))); // serve static HTML, CSS, JS files from the /public directory

// Path to the notes data file
const notesFilePath = path.join(__dirname, "notes.json");

// Function to get the current notes from the file
const getNotes = () => {
  try {
    const data = fs.readFileSync(notesFilePath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

// Function to save notes to the file
const saveNotes = (notes) => {
  fs.writeFileSync(notesFilePath, JSON.stringify(notes, null, 2));
};
// Get all notes (Read)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.htm'));
});

// Get all notes (Read)
app.get("/notes", (req, res) => {
  const notes = getNotes();
  res.json(notes);
});

// Create a new note (Create)
app.post("/notes", (req, res) => {
  const newNote = req.body;
  // Log the incoming request body to the console
  console.log(req.body);
  // Add an ID to the new note
  newNote.id = Date.now(); // Use timestamp as unique ID
  // Get the current notes and add the new one
  const notes = getNotes();
  notes.push(newNote);
  // Save the updated notes to the file
  saveNotes(notes);
  // Return a response with the message and the created note
  res.status(201).json({
    message: "Note created successfully!",
    note: newNote
  });
});

// Delete a note by ID (Delete)
app.delete("/notes/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const notes = getNotes();
  const updatedNotes = notes.filter(note => note.id !== id);
  saveNotes(updatedNotes);
  res.status(204).end();
});

// Edit a note (Update)
app.put("/notes/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const updatedNote = req.body;
  const notes = getNotes();
  const noteIndex = notes.findIndex(note => note.id === id);

  if (noteIndex !== -1) {
    // Merge the old note with the new updated data
    notes[noteIndex] = { ...notes[noteIndex], ...updatedNote };
    saveNotes(notes);
    res.json(notes[noteIndex]);
  } else {
    res.status(404).send("Note not found");
  }
});

