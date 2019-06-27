"use strict";

const HDRequest = require('./HDRequest.js');
const FetchError = require('./structures/FetchError.js');

/**
* @class HDDevelopment
* @classdesc hdapi.js - An API wrapper for https://hd-development.glitch.me
*/
class HDDevelopment {
	constructor(options = {}) {
		/**
		* The token will be used for authorization
		* @type {string}
		*/
		this.token = options.token;
		
		/**
		* Your bot ID
		* @type {string}
		*/
		this.clientID = options.clientID;
		
		/**
		* Website URL
		* @type {string}
		* @private
		*/
		this.baseURL = 'hd-development.glitch.me';
		
		/**
		* Base Api URL 
		* @type {string}
		* @private
		*/
		this.baseAPIURL = this.baseURL + '/api';
		
		/**
		* A version of this module
		*/
		this.version = require('../package.json').version;
		
		const request = new HDRequest(this.baseURL);
		if (!this.token) throw new ReferenceError('[HDAPI] token options must be supplied');
        if (typeof this.token !== 'string') throw new TypeError('[HDAPI] token must be a string');
        if (!this.clientID) throw new ReferenceError('[HDAPI] clientID options must be supplied');
        if (typeof this.clientID !== 'string') throw new TypeError('[HDAPI] clientID must be a string');
        if (this.token || this.token !== undefined || this.token !== '') {
          tokenValidator(this.token, request).then(isValid => {
            if (isValid === "false") throw new Error('[HDAPI] 401 Unauthorized invalid token.');
          });
        }
        
        /**
        * HDRequest Client for creating requests
        * @private
        */
        this._request = request;
}

    /**
    * Get any specified bot data using bot ID
    * @param {string} ID
    * @returns {Promise<object>}
    */
    async getBot(ID) {
      if (!ID || !this.clientID) throw new ReferenceError('[HDAPI:getBot] The bot ID must be supplied.');
      var userID = ID || this.clientID;
      const response = await request.get(`bots/${userID}`);
      const bodyRaw = await response.body;
      if (bodyRaw.error === "bot_not_found")  throw new FetchError('[HDAPI] Bot not found');
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

  /**
  * API access token validator
  * @param {string} token
  * @param {object} request
  * @private 
  * @returns {Promise<boolean>}
  */
async function tokenValidator(token, request) { //eslint-disable-line no-unused-vars
    var response = await request.post('authorize', { token: token });
    var body = await response.body;
    if (body.valid === false) return "false";
    else return "true";
}

 /**
 * Fetching the user - using to fetching the owner of the bot
 * @param {string} userID
 * @param {object} request 
 * @private 
 * @returns {Promise<object>}
 */
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

module.exports = HDDevelopment;