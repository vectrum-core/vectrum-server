const users = require('./users');



module.exports = () => {
  return {
    ...users,
  };
};
