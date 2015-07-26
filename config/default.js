
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
  var contents = fs.readFileSync(global.ROOT_DIR + '/config/secret', 'utf-8');
  return JSON.parse(contents);
}

module.exports = config;
