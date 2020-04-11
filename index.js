const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const app = express();

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server running on ${PORT}`);

const persons = [
  {
    name: 'Felix Duke',
    phone: '666-777-8888',
    id: 8,
  },
  {
    name: 'Bolu Folu',
    phone: '555-666-7777',
    id: 9,
  },
  {
    name: 'Danny Rose',
    phone: '444-555-6666',
    id: 10,
  },
  {
    name: 'Jose Aaaaa',
    phone: '333-444-5555',
    id: 11,
  },
  {
    name: 'Kamala Hhhhhh',
    phone: '222-333-4444',
    id: 12,
  },
  {
    name: 'Aaaaa Perry',
    phone: '111-222-3333',
    id: 13,
  },
];

morgan.token('data', function (req, res) {
  return JSON.stringify(req.body);
});

app.use(cors());
app.disable('x-powered-by');
app.use(express.json());
app.use(requestLogger);
app.use(
  morgan(':method :url :status :response-time ms - :res[content-length] :data'),
);

app.get('/', (req, res) => {
  res.send('<h2>Shoko</h2>');
});

app.get('/api/persons', (req, res) => {
  res.json(persons);
});

app.get('/info', (req, res) => {
  const info = persons.length;
  res.setHeader('Content-Type', 'text/html');
  if (!info) {
    res.write('<p>Phonebook has no contact</p>');
    res.end(`<p>${new Date()}</p>`);
  }
  res.write(`<p>Phonebook has info for ${persons.length} people</p>`);
  res.end(`<p>${new Date()}</p>`);
});

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find(p => p.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end('No person found');
  }
});

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find(p => p.id === id);
  const results = persons.filter(p => p.id !== id);

  if (person) {
    return res.status(204).end();
  } else {
    return res.status(404).send('No contact with request id found');
  }
});

const generateId = () => {
  const maxId = Math.max(...persons.map(p => p.id));
  return maxId + 1;
};
app.post('/api/persons', (req, res) => {
  const body = req.body;
  const person = {
    name: body.name,
    phone: body.phone,
    id: generateId(),
  };

  const isNameExist = persons.find(p => p.name === body.name);

  if (!body.name || !body.phone) {
    return res.status(400).json({
      error: 'bad request name or phone is missing!',
    });
  }
  if (isNameExist) {
    return res.status(400).json({
      error: 'name must be unique',
    });
  } else {
    res.status(200).json(person);
  }
});

app.use(unknownEndpoint);

function unknownEndpoint(req, res) {
  res.status(404).send({ error: 'unknown endpoint' });
}

function requestLogger(req, res, next) {
  console.log('Method: ', req.method);
  console.log('Path: ', req.path);
  console.log('Body: ', req.body);
  console.log('---');
  next();
}
