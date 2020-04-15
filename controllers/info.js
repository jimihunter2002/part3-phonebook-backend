const infoRouter = require('express').Router();
const Contact = require('../models/contact');

infoRouter.get('/', (request, response, next) => {
  Contact.find({})
    .then(results => {
      if (results.length === 0) {
        response
          .json({ message: 'phonebook has no contact', date: new Date() })
          .end();
      } else {
        response
          .json({
            message: `phonebook has info for ${results.length} people`,
            date: new Date(),
          })
          .end();
      }
    })
    .catch(error => next(error));
});

module.exports = infoRouter;
