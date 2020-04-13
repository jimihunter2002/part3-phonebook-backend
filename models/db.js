require('dotenv').config();
const mongoose = require('mongoose');

const url = process.env.MONGODB_URL;

mongoose.set('useFindAndModify', false);

mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('connected to MongoDB'))
  .catch(err => console.log('error connecting to MongoDB', err.message));

const contactSchema = new mongoose.Schema({
  name: String,
  phone: String,
});

//transform response from mongo
contactSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Contact', contactSchema);
