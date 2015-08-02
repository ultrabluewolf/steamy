
var ld = require('lodash');
var fs = require('fs-extra');

var config = {

  port: '3000',

  steam_url: 'http://api.steampowered.com/',
  steam_community_url: 'http://steamcommunity.com/id/',
  steam_store_url: {
    games: 'http://store.steampowered.com/app/',
    search: 'http://store.steampowered.com/search/'
  },
  steam_media_url: {
    games: 'http://media.steampowered.com/steamcommunity/public/images/apps/{appid}/{hash}.jpg'
  }

};

ld.extend(config, grabSecrets());

function grabSecrets() {
  var steamApiKey = process.env.STEAM_API_KEY;
  var redisUrl    = process.env.REDIS_URL;
  var secrets = {
    steam_api: {
      api_key: steamApiKey
    },
    redis: redisUrl
  };

  if (!steamApiKey || !redisUrl) {
    var contents = fs.readFileSync(global.ROOT_DIR + '/config/secret', 'utf-8');
    contents = JSON.parse(contents);
    secrets.steam_api.api_key = steamApiKey || contents.steam_api.api_key;
    secrets.redis = redisUrl || contents.redis;
  }

  return secrets;
}

module.exports = config;
