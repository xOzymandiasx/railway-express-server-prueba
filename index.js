require('dotenv').config();
const express = require("express");
const cors = require("cors");
const Note = require('./models/note');
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("dist"));

// let notes = [
//   {
//     id: 1,
//     content: "HTML is easy",
//     date: "2019-05-30T17:30:31.098Z",
//     important: true,
//   },
//   {
//     id: 2,
//     content: "Browser can execute only Javascript",
//     date: "2019-05-30T18:39:34.091Z",
//     important: false,
//   },
//   {
//     id: 3,
//     content: "GET and POST are the most important methods of HTTP protocol",
//     date: "2019-05-30T19:20:14.298Z",
//     important: true,
//   },
// ];

// const generateId = () => {
//   const maxId =
//     notes.length > 0 ? Math.max(...notes.map((item) => item.id)) : 0;
//   return maxId + 1;
// };

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};

app.use(requestLogger);

// node.js puro
// const app = http.createServer((request, response) => {
//   response.writeHead(200, { "Content-Type": "application/json" });
//   response.end(JSON.stringify(notes));
// });

// Database
// connect(url);

// const noteSchema = new Schema({
//   content: String,
//   date: Date,
//   important: Boolean,
// });

// noteSchema.set("toJSON", {
//   transform: (document, returnedObject) => {
//     returnedObject.id = returnedObject._id.toString();
//     delete returnedObject._id;
//     delete returnedObject.__v;
//   },
// });

// const Note = model("Note", noteSchema);

// Express
app.get("/", (request, response) => {
  response.send("<h1>Hello world!</h1>");
});

app.get("/api/notes", (request, response) => {
  Note.find({}).then((res) => {
    response.status(200).json(res);
  });
});

app.get("/api/notes/:id", (request, response) => {
  Note.findById(request.params.id).then(res => response.json(res));
  // const id = Number(request.params.id);
  // const note = notes.find((item) => item.id === id);
  // note ? response.json(note) : response.status(404).end();
});

app.post("/api/notes", (request, response) => {
  const body = request.body;
  if (!body.content) {
    return response.status(400).json({
      error: "error missing",
    });
  }

  // const note = {
  //   content: body.content,
  //   important: body.important || false,
  //   date: new Date(),
  //   id: generateId(),
  // };

  // notes.concat(note);
  // response.json(note);

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  });

  note.save().then((res) => response.json(res));
});

app.put("/api/notes/:id", (request, response) => {
  const { body } = request;
  notes = notes.map((item) => (item.id === body.id ? body : item));
  response.status(200).json(body);
});

app.delete("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  notes = notes.filter((item) => item.id !== id);
  response.status(204).end();
});

const unknowEndpoint = (request, response) => {
  response.status(404).send({ error: "unknow endpoint" });
};

app.use(unknowEndpoint);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
