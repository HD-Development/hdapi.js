const HDRequest = require('./HDRequest.js');

/**
* HDDev Client
*/

module.exports = class HDDev {
  
  /**
  * Create new HDDev Wrapper Client
  */
  constructor(clientID, ownerID){
    this.baseURL = 'hd-development.glitch.me';
    this.baseAPIURL = this.baseURL + '/api';
    const request = new HDRequest(this.baseURL);
    if (isNaN(clientID)) throw new Error('[HDAPI] Invalid clientID options');
    if (!ownerID) throw new Error('[HDAPI] no ownerID options provided');
    if (isNaN(ownerID)) return new Error('[HDAPI] Invalid ownerID options');
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
    if (bodyRaw.error === "bot_not_found")  return new Error('[HDAPI] Bot not found');
      return bodyRaw;
    }
  }
}
