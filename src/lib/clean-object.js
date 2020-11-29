const cleanObject = (obj) => {
  return JSON.parse(JSON.stringify(obj));
}

module.exports = cleanObject;
