const express = require('express');
const fs = require('fs');
const app = express();

const PORT = 3000;


app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/canciones', (req, res) => {
  fs.readFile('repertorio.json', 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error al leer el archivo JSON');
      return;
    }
    res.json(JSON.parse(data));
  });
});

app.post('/canciones', (req, res) => {
  const nuevaCancion = req.body;

  fs.readFile('repertorio.json', 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error al leer el archivo JSON');
      return;
    }

    const canciones = JSON.parse(data);
    canciones.push(nuevaCancion);

    fs.writeFile('repertorio.json', JSON.stringify(canciones, null, 2), 'utf8', (err) => {
      if (err) {
        res.status(500).send('Error al guardar la canción');
        return;
      }
      res.status(201).send('Canción agregada correctamente');
    });
  });
});


app.put('/canciones/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const datosActualizados = req.body;

  fs.readFile('repertorio.json', 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error al leer el archivo JSON');
      return;
    }

    const canciones = JSON.parse(data);
    const indice = canciones.findIndex((cancion) => cancion.id === id);

    if (indice === -1) {
      res.status(404).send('Canción no encontrada');
      return;
    }

    canciones[indice] = { ...canciones[indice], ...datosActualizados };

    fs.writeFile('repertorio.json', JSON.stringify(canciones, null, 2), 'utf8', (err) => {
      if (err) {
        res.status(500).send('Error al actualizar la canción');
        return;
      }
      res.send('Canción actualizada correctamente');
    });
  });
});

app.delete('/canciones/:id', (req, res) => {
  const id = parseInt(req.params.id);

  fs.readFile('repertorio.json', 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error al leer el archivo JSON');
      return;
    }

    const canciones = JSON.parse(data);
    const nuevasCanciones = canciones.filter((cancion) => cancion.id !== id);

    fs.writeFile('repertorio.json', JSON.stringify(nuevasCanciones, null, 2), 'utf8', (err) => {
      if (err) {
        res.status(500).send('Error al eliminar la canción');
        return;
      }
      res.send('Canción eliminada correctamente');
    });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
