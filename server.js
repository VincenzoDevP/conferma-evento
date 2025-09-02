const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// serve la pagina HTML
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// salva la conferma
app.post("/submit", (req, res) => {
  const { nome, email, presenza } = req.body;
  const entry = { nome, email, presenza };

  // legge i dati esistenti
  let data = [];
  if (fs.existsSync("data.json")) {
    data = JSON.parse(fs.readFileSync("data.json"));
  }

  // aggiunge la nuova conferma
  data.push(entry);
  fs.writeFileSync("data.json", JSON.stringify(data, null, 2));

  res.send("<h2>Grazie per la conferma!</h2><a href='/'>Torna al form</a>");
});

// mostra la lista dei partecipanti
app.get("/partecipanti", (req, res) => {
  let data = [];
  if (fs.existsSync("data.json")) {
    data = JSON.parse(fs.readFileSync("data.json"));
  }

  let html = `
  <!DOCTYPE html>
  <html lang="it">
  <head>
    <meta charset="UTF-8">
    <title>Lista Partecipanti</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  </head>
  <body class="bg-light">
    <div class="container py-5">
      <div class="card shadow-lg border-0 rounded-3">
        <div class="card-body p-4">
          <h1 class="text-center mb-4">👥 Lista Partecipanti</h1>
          <ul class="list-group">`;

  data.forEach(p => {
    html += `<li class="list-group-item d-flex justify-content-between align-items-center">
               <span><strong>${p.nome}</strong> (${p.email})</span>
               <span class="badge ${p.presenza === "si" ? "bg-success" : "bg-danger"}">
                 ${p.presenza.toUpperCase()}
               </span>
             </li>`;
  });

  html += `</ul>
          <div class="text-center mt-4">
            <a href="/" class="btn btn-outline-primary">⬅️ Torna al form</a>
          </div>
        </div>
      </div>
    </div>
  </body>
  </html>`;

  res.send(html);
});


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server avviato su http://localhost:${port}`));
