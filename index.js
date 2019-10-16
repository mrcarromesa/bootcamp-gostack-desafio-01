const express = require('express');

const server = express();
server.use(express.json());
server.listen(3000);

var projectsArr = [];

var qtd = 0;

server.use((req, res, next) => {
    next();
    qtd++;
    console.log(qtd);
});

function middlewareCheckId(req, res, next) {
    const { id } = req.params;

    const index = projectsArr.findIndex(i =>  i.id == id);

    req.index = index;

    if (index > -1) {
        return next();
    } else {
        return res.status(404).json({error: 'Register not found.'});
    }

}

function middlewareCheckIdPost(req, res, next) {
    const { id } = req.body;
    const index = projectsArr.findIndex(i =>  i.id == id);

    if (index > -1) {
        return res.status(400).json({error: 'Registro já existe.'});
    } else {
        return next();
    }
}


server.get('/', (req, res) => {
    res.json({msg: 'Hello World! '+ req.ab });
});

server.post('/projects', middlewareCheckIdPost, (req, res) => {
    const { id, title } = req.body;
    const project = {id, title};
    //console.log(project);
    //projectsArr = [...project];
    projectsArr.push(project);
    res.json(projectsArr);
});

server.get('/projects', (req, res) => {

    res.json(projectsArr);
});

server.put('/projects/:id', middlewareCheckId, (req, res) => {
    const { title } = req.body;
    const index = req.index;
    projectsArr[index].title = title;

    res.json(projectsArr);
});


server.delete('/projects/:id', middlewareCheckId, (req, res) => {
    const index = req.index;

    projectsArr.splice(index, 1);

    res.json(projectsArr);
});

server.post('/projects/:id/task', middlewareCheckId, (req, res) => {
    const { title } = req.body;

    const index = req.index;
    
    if (typeof projectsArr[index].task != 'undefined') {
        projectsArr[index].task.push(title);
    } else {
        projectsArr[index].task = [title];
    }
    
    
    res.json(projectsArr);
});