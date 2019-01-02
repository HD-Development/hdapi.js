const HDRequest = require('./HDRequest.js');

/**
* HDDevelopment Client
*/

module.exports = class HDDevelopment {
  
  /**
  * Create new HDDevelopment Wrapper Client
  */
  constructor(clientID, ownerID){
    this.baseURL = 'hd-development.glitch.me';
    this.baseAPIURL = this.baseURL + '/api';
    const request = new HDRequest(this.baseURL);
    if (isNaN(clientID)) throw new Error('[HDAPI] Invalid clientID options');
    if (!ownerID) throw new Error('[HDAPI] no ownerID options provided');
    if (isNaN(ownerID)) throw new Error('[HDAPI] Invalid ownerID options');
    this.version = require('../package.json').version;
    
    /**
    * HDRequest Client for creating requests
    * @private
    */
    this._request = request;
    
    /**
    *  Get any specified bot data using bot id
    * @param {String} ID Bot's user ID
    * @returns {Promise<Object>} A promise that contains data of the bot
    */
    this.getBot = async (ID) => {
    if (!ID || !clientID) throw new Error('[HDAPI:getBot] No ID was Provided.');
    var userID = ID || clientID;
    const response = await request.get(`bots/${userID}`);
    const bodyRaw = await response.body;
    if (bodyRaw.error === "bot_not_found")  throw new Error('[HDAPI] Bot not found');
      const owner = await fetchUser(bodyRaw.ownerID, request);
            const botUser = await fetchUser(bodyRaw.botID, request);
            const body = {
                owner: {
                    id: owner.id,
                    username: owner.username,
                    discriminator: owner.discriminator,
                    tag: owner.tag,
                    avatar: owner.avatar,
                    avatarURL: owner.avatarURL,
                    displayAvatarURL: owner.displayAvatarURL,
                    bot: owner.bot,
                    createdAt: new Date(owner.createdTimestamp),
                    createdTimestamp: owner.createdTimestamp,
                    bots: owner.bots
                },
                bot: {
                    id: botUser.id,
                    username: botUser.username,
                    discriminator: botUser.discriminator,
                    tag: botUser.tag,
                    avatar: botUser.avatar,
                    avatarURL: botUser.avatarURL,
                    displayAvatarURL: botUser.displayAvatarURL,
                    bot: botUser.bot,
                    createdAt: new Date(botUser.createdTimestamp),
                    createdTimestamp: botUser.createdTimestamp
                },
                prefix: bodyRaw.prefix,
                accepted: bodyRaw.accepted
            };
            return body;
        };
    };
  };

async function fetchUser(userID, request) {
    let { body: user } = await request.get(`fetchUser?id=${userID}`);

    if (user.error === "unknown_user") return undefined;

    var userResolved = null;

    var body = user;

    userResolved = {
        id: body.id,
        username: body.username,
        discriminator: body.discriminator,
        tag: body.tag,
        avatar: body.avatar,
        avatarURL: body.avatarURL,
        displayAvatarURL: body.displayAvatarURL,
        bot: body.bot,
        createdAt: new Date(body.createdTimestamp),
        createdTimestamp: body.createdTimestamp
    };
    
       userResolved.bots = body.bots;

    return userResolved;
}