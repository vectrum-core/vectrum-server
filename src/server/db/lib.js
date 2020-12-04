function getAnswerShortObj() {
  const answer = {
    result: {},
    error: {},
  };
  return answer;
}

function getAnswerObj(params = { limit: 0, skip: 0, }) {
  const answer = {
    params: {
      count: 0,
      limit: parseInt(params.limit) || 0,
      skip: parseInt(params.skip) || 0,
    },
    ...getAnswerShortObj(),
  };
  return answer;
}


module.exports = {
  getAnswerObj,
  getAnswerShortObj,
};
