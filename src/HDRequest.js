const https = require('https');
const version = require('../package.json').version;
console.log(version);
class HDRequest {
    /**
     * Creates HDRequest Client
     * @param {String} baseAPIUrl BaseAPIURL to use
     * @private
     */
    constructor(baseURL) {
        this.baseURL = baseURL;
        this.baseAPIURL = baseURL + '/api';
        this.version = '1.3.0-hdrequest';

        /**
         * Creates a GET request
         * @param {String} endpoint API Endpoint to use.
         * @private
         * @returns {Promise<Object>} A Promise containing response
         */
        this.get = (endpoint) => {
            return new Promise((resolve, reject) => {
                const response = {
                    method: 'GET',
                    version: '1.3.0-hdrequest',
                    raw: '',
                    body: null,
                    status: null,
                    headers: null
                };
                const options = {
                    hostname: baseURL,
                    path: `/api/${endpoint}`,
                    method: 'GET',
                    headers: {}
                };
                options.headers['user-agent'] = `hdapi.js/${version}`;
                options.headers['content-type'] = 'application/json';
                const request = https.request(options, res => {
                    response.status = res.statusCode;
                    response.headers = res.headers;
                    response.ok = res.statusCode >= 200 && res.statusCode < 300;
                    res.on('data', chunk => {
                        response.raw += chunk;
                    });
                    res.on('end', () => {
                        response.body = res.headers['content-type'].includes('application/json') ? JSON.parse(response.raw) : response.raw;
                        if (response.ok) {
                            resolve(response);
                        } else {
                            const err = new Error(`[HDAPI] ${res.statusCode} ${res.statusMessage}`);
                            Object.assign(err, response);
                            reject(err);
                        }
                    });
                });

                request.on('error', err => {
                    reject(err);
                });

                request.end();
            });
        };

        /**
         * Creates a POST request
         * @param {String} endpoint API Endpoint to use.
         * @param {String} data Data to send
         * @private
         * @returns {Promise<Object>} A Promise containing response
         */
        this.post = (endpoint, data) => {
            return new Promise((resolve, reject) => {
                const response = {
                    method: 'POST',
                    version: '1.3.0-hdrequest',
                    raw: '',
                    body: null,
                    status: null,
                    headers: null
                };
                const options = {
                    hostname: baseURL,
                    path: `/api/${endpoint}`,
                    method: 'POST',
                    headers: {}
                };
                options.headers['user-agent'] = `hdapi.js/${version}`;
                options.headers['content-type'] = 'application/json';
                const request = https.request(options, res => {
                    response.status = res.statusCode;
                    response.headers = res.headers;
                    response.ok = res.statusCode >= 200 && res.statusCode < 300;
                    res.on('data', chunk => {
                        response.raw += chunk;
                    });
                    res.on('end', () => {
                        response.body = res.headers['content-type'].includes('application/json') ? JSON.parse(response.raw) : response.raw;
                        if (response.ok) {
                            resolve(response);
                        } else {
                            const err = new Error(`[HDAPI] ${res.statusCode} ${res.statusMessage}`);
                            Object.assign(err, response);
                            reject(err);
                        }
                    });
                });
                request.on('error', err => {
                    reject(err);
                });

                request.write(JSON.stringify(data));
                request.end();
            });
        };
    }
}

module.exports = HDRequest;
