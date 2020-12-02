const redis = require('redis');
const connectRedis = require('connect-redis');
const cfg = require('../config');
const log = require('../logger').getLogger('SESSION_STORE');



module.exports = (session) => {
  const RedisStore = connectRedis(session);
  const redisClientOtions = {
    password: cfg.get('session.password'),
  };
  const redisClient = redis.createClient(redisClientOtions)
    .on('ready', (sessionId) => log.info('ready'))
    .on('connect', (sessionId) => log.info('connect'))
    .on('reconnecting', (sessionId) => log.info('reconnecting', sessionId))
    .on('error', (sessionId) => log.info('error', sessionId))
    .on('end', (sessionId) => log.info('end', sessionId))
    .on('warning', (sessionId) => log.info('warning', sessionId));

  return new RedisStore({
    client: redisClient,
    // Key prefix in Redis(default: sess:). This prefix appends to whatever prefix you may have set on the client itself.
    prefix: cfg.get('session.prefix'),
    // If the session cookie has a expires date, connect - redis will use it as the TTL. Otherwise, it will expire the session using the ttl option(default: 86400 seconds or one day).
    ttl: 86400,
    // Disables re-saving and resetting the TTL when using touch (default: false)
    disableTouch: false,
    // The encoder/decoder to use when storing and retrieving session data from Redis (default: JSON).
    serializer: JSON,
    // Value used for count parameter in Redis SCAN command. Used for ids() and all() methods (default: 100).
    scanCount: 100,
  });
}
