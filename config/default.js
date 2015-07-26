
var ld = require('lodash');
var fs = require('fs-extra');

var config = {

  port: '3000',

  steam_url: 'http://api.steampowered.com/',
  steam_community_url: 'http://steamcommunity.com/id/',
  steam_media_url: {
    games: 'http://media.steampowered.com/steamcommunity/public/images/apps/{appid}/{hash}.jpg'
  }

};

ld.extend(config, grabSecrets());

function grabSecrets() {
  var steamApiKey = process.env.STEAM_API_KEY;
  var contents;
  if (!steamApiKey) {
    contents = fs.readFileSync(global.ROOT_DIR + '/config/secret', 'utf-8');
    contents = JSON.parse(contents);
  } else {
    contents = {
      steam_api: {
        api_key: steamApiKey
      }
    };
  }
  return contents;
}

module.exports = config;
