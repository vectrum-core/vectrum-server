const Stage = require('telegraf/stage');
const cfg = require('../../config');
const scenes = require('../scenes');



const options = {
  sessionName: 'session',
  ttl: cfg.get('session.store.ttl'),
};

const stage = new Stage(scenes, options);


module.exports = stage;
