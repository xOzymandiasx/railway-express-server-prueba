const notesRouter = require("express").Router();
const Note = require("../models/note");


notesRouter.get("/", (request, response) => {
  Note.find({}).then((res) => {
    response.status(200).json(res);
  });
});

notesRouter.get("/:id", (request, response, next) => {
  Note.findById(request.params.id)
   .then(res => res ? response.status(200).json(res) : response.status(404).end())
   .catch(error => next(error));
  //  .catch(error => {
  //   console.log(error);
  //   response.status(400).send({error: "Malformated id"});
  //  });
  // const id = Number(request.params.id);
  // const note = notes.find((item) => item.id === id);
  // note ? response.json(note) : response.status(404).end();
});

notesRouter.post("/", (request, response, next) => {
  const {body} = request;
  if (body.content === undefined) {
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

  note.save()
   .then((res) => response.json(res.toJSON()))
   .catch(error => next(error));
});

notesRouter.put("/:id", (request, response, next) => {
  const { body } = request;

  const note = {
    content: body.content,
    important: body.important
  };

  Note.findByIdAndUpdate(request.params.id, note, {new: true})
   .then(res => response.status(200).json(res))
   .catch(error => next(error))

  // notes = notes.map((item) => (item.id === body.id ? body : item));
  // response.status(200).json(body);
});

notesRouter.delete("/:id", (request, response, next) => {
  Note.findByIdAndRemove(request.params.id)
   .then(res => response.status(204).end())
   .catch(error => next(error));
  // const id = Number(request.params.id);
  // notes = notes.filter((item) => item.id !== id);
  // response.status(204).end();
});

module.exports = notesRouter;