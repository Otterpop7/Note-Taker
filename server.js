const fs = require("fs")
const path = require("path")
const express = require("express")
const app = express()

let PORT = process.env.PORT || 3000
let dbJson = require("./db/db.json")

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

app.listen(PORT, () => {
  console.log("Application is listening on PORT " + PORT)
})
