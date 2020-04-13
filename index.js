require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Contact = require('./models/db');

//server setup
const app = express();
const PORT = process.env.PORT;
app.listen(PORT);
console.log(`Server running on ${PORT}`);

// const persons = [
//   {
//     name: 'Felix Duke',
//     phone: '666-777-8888',
//     id: 8,
//   },
//   {
//     name: 'Bolu Folu',
//     phone: '555-666-7777',
//     id: 9,
//   },
//   {
//     name: 'Danny Rose',
//     phone: '444-555-6666',
//     id: 10,
//   },
//   {
//     name: 'Jose Aaaaa',
//     phone: '333-444-5555',
//     id: 11,
//   },
//   {
//     name: 'Kamala Hhhhhh',
//     phone: '222-333-4444',
//     id: 12,
//   },
//   {
//     name: 'Aaaaa Perry',
//     phone: '111-222-3333',
//     id: 13,
//   },
// ];

morgan.token('data', function (req, res) {
  return JSON.stringify(req.body);
});

app.use(express.static('build'));
app.use(express.json());
app.use(requestLogger);
app.use(cors());
app.disable('x-powered-by');

app.use(errorHandler);
app.use(
  morgan(':method :url :status :response-time ms - :res[content-length] :data'),
);

app.get('/', (req, res) => {
  res.send('<h2>Shoko</h2>');
});

app.get('/api/persons', (req, res) => {
  Contact.find({}).then(contacts => {
    res.json(contacts.map(contact => contact.toJSON()));
  });
});

app.get('/info', async (req, res) => {
  //const info = persons.length;
  const contacts = await Contact.find({});

  res.setHeader('Content-Type', 'text/html');
  if (!contacts) {
    res.write('<p>Phonebook has no contact</p>');
    res.end(`<p>${new Date()}</p>`);
  }
  res.write(`<p>Phonebook has info for ${contacts.length} people</p>`);
  res.end(`<p>${new Date()}</p>`);
});

app.get('/api/persons/:id', (req, res, next) => {
  //   const id = Number(req.params.id);
  //   const person = persons.find(p => p.id === id);

  //   if (person) {
  //     res.json(person);
  //   } else {
  //     res.status(404).end('No person found');
  //   }

  Contact.findById(req.params.id)
    .then(person => {
      if (person) {
        res.status(200).json(person.toJSON());
      } else {
        res.status(404).end('Contact not found');
      }
    })
    .catch(error => next(error));
});

app.delete('/api/persons/:id', (req, res, next) => {
  const id = Number(req.params.id);
  //const person = persons.find(p => p.id === id);
  //const results = persons.filter(p => p.id !== id);
  Contact.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end();
    })
    .catch(err => next(err));

  //   if (person) {
  //     return res.status(204).end();
  //   } else {
  //     return res.status(404).send('No contact with request id found');
  //   }
});

// const generateId = () => {
//   const maxId = Math.max(...persons.map(p => p.id));
//   return maxId + 1;
// };

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body;

  const contact = {
    name: body.name,
    phone: body.phone,
  };

  Contact.findByIdAndUpdate(req.params.id, contact, { new: true })
    .then(updatedContact => {
      res.json(updatedContact.toJSON());
    })
    .catch(err => next(err));
});

app.post('/api/persons', (req, res) => {
  const body = req.body;

  //const isNameExist = persons.find(p => p.name === body.name);

  if (body.name === undefined || body.phone === undefined) {
    return res.status(400).json({
      error: 'bad request name or phone is missing!',
    });
  }

  const person = new Contact({
    name: body.name,
    phone: body.phone,
    //id: generateId(),
  });

  //   if (isNameExist) {
  //     return res.status(400).json({
  //       error: 'name must be unique',
  //     });
  //   } else {
  //     res.status(200).json(person);
  //   }
  person.save().then(savedPerson => {
    res.status(201).json(savedPerson.toJSON());
  });
});

app.use(unknownEndpoint);
function unknownEndpoint(req, res) {
  res.status(404).send({ error: 'unknown endpoint' });
}
app.use(errorHandler);
function requestLogger(req, res, next) {
  console.log('Method: ', req.method);
  console.log('Path: ', req.path);
  console.log('Body: ', req.body);
  console.log('---');
  next();
}

function errorHandler(err, req, res, next) {
  console.log(err.message);

  if (err.name === 'CastError' && err.kind === 'Objectid') {
    return res.status(400).send({ error: 'malformatted id' });
  }
  next(err);
}
