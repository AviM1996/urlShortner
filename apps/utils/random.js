const { v4: uuidv4 } = require('uuid');

const generateUniqueId = () => {
  return uuidv4().substring(0, 12);
}

module.exports= generateUniqueId