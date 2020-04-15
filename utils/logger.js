const info = (...params) => {
  //this will take any number of arguments rest operator
  console.log(...params);
};

const error = (...params) => {
  console.log(...params);
};

module.exports = {
  info,
  error,
};
