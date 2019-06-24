const express = require("express");

const server = express();

server.use(express.json());

count = 1;

server.use((req, res, next) => {
  console.time("Request");
  console.log(`Número de requisições ${count}`);
  next();
  count++;
  console.timeEnd("Request");
});

const projects = [{ id: 1, title: "Novo projeto", tasks: [] }];

function checkProjectInArray(req, res, next) {
  let project = null;

  for (let index in projects) {
    if (projects[index].id == req.params.id) {
      project = projects[index];
      break;
    }
  }

  if (!project) {
    return res.status(400).json("Project not exist!");
  }

  return next();
}

server.post("/projects", (req, res) => {
  const { id, title } = req.body;

  projects.push({ id: id, title: title, tasks: [] });

  return res.json(projects);
});

server.delete("/projects/:id", checkProjectInArray, (req, res) => {
  const { id } = req.params;

  for (let index in projects) {
    if (projects[index].id == id) {
      projects.splice(index, 1);
      break;
    }
  }

  return res.json(projects);
});

server.put("/projects/:id", checkProjectInArray, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  for (let index in projects) {
    if (projects[index].id == id) {
      projects[index].title = title;
      break;
    }
  }

  return res.json(projects);
});

server.post("/projects/:id/tasks", checkProjectInArray, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  for (let index in projects) {
    if (projects[index].id == id) {
      projects[index].tasks.push(title);
      break;
    }
  }

  return res.json(projects);
});

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.listen(3000);
