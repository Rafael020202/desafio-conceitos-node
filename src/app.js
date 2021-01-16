const express = require("express");
const cors = require("cors");
const { v4: uuid, validate: isUuid } = require('uuid');
const { response } = require("express");

const app = express();

app.use(express.json());
app.use(cors());

function handleRequest(request, response, next) {
  const method = request.method;
  const url = request.url;

  console.log( `[${method}] ${url}` );

  return next();
}

app.use(handleRequest);

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }
  
  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;
  const repositoryIndex = repositories.findIndex(repository => id === repository.id);

  if ( repositoryIndex === -1 ) {
    return response.status(400).send();
  }

  repositories[repositoryIndex] = { id, title, url, techs }

  return response.status(204).send();
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex( repository => repository.id === id );

  if ( repositoryIndex === -1 ) {
    return response.status(404).send();
  }

  repositories.splice(repositoryIndex, 1);
  return response.status(204).send();
});

app.put("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex( repository => repository.id === id );

  if ( repositoryIndex === -1 ) {
    return response.status(404).send();
  }

  repositories[repositoryIndex].likes++;
  return response.json(repositories[repositoryIndex]);
});

module.exports = app;
