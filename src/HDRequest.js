"use strict";

const https = require('https');
const version = require('../package.json').version;

class HDRequest {
    /**
     * Creates HDRequest Client
     * @type {string}
     * @private
     */
    constructor(baseURL) {
        this.baseURL = baseURL;
        this.baseAPIURL = baseURL + '/api';
        this.version = version;

        /**
         * Creates a GET request
         * @type {string}
         * @private
         * @returns {Promise<object>}
         */
        this.get = (endpoint) => {
            return new Promise((resolve, reject) => {
                const response = {
                    method: 'GET',
                    version: version,
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
         * Creates a POST request to sending a data
         * @param {string} endpoint 
         * @param {string} data
         * @private
         * @returns {Promise<object>}
         */
        this.post = (endpoint, data) => {
            return new Promise((resolve, reject) => {
                const response = {
                    method: 'POST',
                    version: version,
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
