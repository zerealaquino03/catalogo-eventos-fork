import { Request, Response } from "express";
import { CriarEventoController } from "./controllers/criar-eventos-controller";

const express = require('express');
const cors = require('./middlewares/cors');
const contentType = require('./middlewares/content-type');
const bodyParser = require('./middlewares/body-parser');

const app = express();
const port = 3000;

app.use(cors);
app.use(contentType);
app.use(bodyParser);

let eventos = [
    {
        id: crypto.randomUUID(),
        titulo: "Festival Gastronômico do Centro",
        cat: "Gastronomia",
        data: "2025-09-20",
        hora: "18:00",
        local: "Rua Ponciano, Centro",
        preco: "Gratuito",
        img: "https://douradosagora.com.br/media/posts/390241/dourados-tera-neste-sabado-balaio-festival-com-musica-arte-gastronomia-e-cultura-17522582977313.jpg",
        desc: "Barracas, food trucks e música ao vivo com artistas locais."
    }
];

let cidades = [
    {
        id: crypto.randomUUID(),
        nome: "Dourados",
        uf: "MS",
        desc: "Segunda maior cidade de MS, polo universitário e cultural."
    },
    {
        id: crypto.randomUUID(),
        nome: "Itaporã",
        uf: "MS",
        desc: "Cidade vizinha com tradições culturais marcantes."
    }
];

let pontoTuristico = []


// Endpoint para criação de eventos
app.post('/eventos', (req: Request, res: Response) => {
    const criarEventoController = new CriarEventoController();
    return criarEventoController.handle(req, res);
});

// Endpoint para listagem de eventos
app.get('/eventos', (req: Request, res: Response) => {
    res.json(eventos);
});

// Endpoint para atualização de evento
app.put('/eventos/:id', (req: Request, res: Response) => {
    const id = req.params.id;
    const updatedEvento = req.body;
    eventos = eventos.map((evento) => (evento.id === id ? updatedEvento : evento));
    res.send('Evento atualizado com sucesso!');
});

// Endpoint para deletar evento
app.delete('/evento/:id', (req: Request, res: Response) => {
    const id = req.params.id;
    eventos = eventos.filter((evento) => evento.id !== id);
    res.send('Evento deletado com sucesso!');
});

app.post('/cidade', (req: Request, res: Response) => {
    const { nome, uf, desc } = req.body;
    const novaCidade = {
        id: crypto.randomUUID(),
        nome, 
        uf, 
        desc
    }
    cidades.push(novaCidade);

    res.status(201).send('Cidade criado com sucesso!');
})

app.get('/cidade', (req: Request, res: Response) => {
    res.json(cidades);
})

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});