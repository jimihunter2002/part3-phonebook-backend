const contactsRouter = require('express').Router();
const Contact = require('../models/contact');

contactsRouter.get('/', (request, response) => {
  Contact.find({}).then(contacts => {
    response.json(contacts.map(contact => contact.toJSON()));
  });
});

contactsRouter.get('/:id', (request, response, next) => {
  Contact.findById(request.params.id)
    .then(person => {
      if (person) {
        response.status(200).json(person.toJSON());
      } else {
        response.status(404).end('Contact not found');
      }
    })
    .catch(error => next(error));
});

contactsRouter.post('/', (request, response, next) => {
  const body = request.body;

  const person = new Contact({
    name: body.name,
    phone: body.phone,
  });

  person
    .save()
    .then(savedPerson => {
      response.status(201).json(savedPerson.toJSON());
    })
    .catch(error => next(error));
});

contactsRouter.delete('/:id', (request, response, next) => {
  Contact.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch(err => next(err));
});

contactsRouter.put('/:id', (request, response, next) => {
  const body = request.body;

  const contact = {
    name: body.name,
    phone: body.phone,
  };

  Contact.findByIdAndUpdate(request.params.id, contact, { new: true })
    .then(updatedContact => {
      response.json(updatedContact.toJSON());
    })
    .catch(err => next(err));
});

module.exports = contactsRouter;
