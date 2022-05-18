// dependencies
const fs = require("fs")
const path = require("path")
const express = require("express")
const app = express()

let PORT = process.env.PORT || 3000
let dbJson = require("./db/db.json")

// server up and running
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static("public"))

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"))
})

app.post("/api/notes", (req, res) => {
  const newNote = createNewNote(req.body, dbJson)
  res.json(newNote)
})

app.get("/api/notes", (req, res) => {
  fs.readFile(__dirname + "/db/db.json", (err, data) => {
    if (err) throw err
    let notes = JSON.parse(data)
    return res.json(notes)
  })
})

// writes note to dbjson
app.listen(PORT, () => {
  console.log("Application is listening on PORT " + PORT)
})

function createNewNote(body, notes) {
  const newNote = body
  console.log(body)
  if (notes.length === 0) notes.push({ ...body, id: 1 })
  else {
    if (!notes[0].id) notes[0].id = 1
    body.id = notes[notes.length - 1].id + 1
    notes.push(body)
  }
  fs.writeFileSync(
    path.join(__dirname, "./db/db.json"),
    JSON.stringify(notes, null, 1)
  )
  return newNote
}

// deletes note from dbjson
app.delete('/api/notes/:id', (req, res) => {
    deleteNote(req.params.id, dbJson);
    res.json(true);
});

function deleteNote(id, notes) {
    for (let i = 0; i < notes.length; i++) {
        let note = notes[i];

        if (note.id == id) {
            notes.splice(i, 1);
            fs.writeFileSync(
                path.join(__dirname, './db/db.json'),
                JSON.stringify(notes, null, 1)
            );

            break;
        }
    }
}
