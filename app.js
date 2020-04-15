const config = require('./utils/config');
const express = require('express');
// const morgan = require('morgan');
const cors = require('cors');
const contactsRouter = require('./controllers/contacts');
const infoRouter = require('./controllers/info');
const middleware = require('./utils/middleware');
const logger = require('./utils/logger');
const mongoose = require('mongoose');

//server setup
const app = express();

logger.info('connecting to', config.MONGODB_URL);

mongoose
  .connect(config.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => logger.info('connected to MongoDB'))
  .catch(error => logger.error('error connecting to MongoDB', error.message));

// morgan.token('data', function (req, _res) {
//   return JSON.stringify(req.body);
// });

app.use(cors());
app.disable('x-powered-by');
app.use(express.static('build'));
app.use(express.json());
app.use(middleware.requestLogger);

app.use('/api/persons', contactsRouter);
app.use('/info', infoRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
// app.use(
//   morgan(':method :url :status :response-time ms - :res[content-length] :data'),
// );

// app.get('/info', async (_req, res) => {
//   //const info = persons.length;
//   const contacts = await Contact.find({});

//   res.setHeader('Content-Type', 'text/html');
//   if (!contacts) {
//     res.write('<p>Phonebook has no contact</p>');
//     res.end(`<p>${new Date()}</p>`);
//   }
//   res.write(`<p>Phonebook has info for ${contacts.length} people</p>`);
//   res.end(`<p>${new Date()}</p>`);
// });
