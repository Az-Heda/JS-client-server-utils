const expressListEndpoints = require('express-list-endpoints');
const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const _ = require('./_');

const DEFAULT = {
	host: 'localhost',
	port: 7788,
	debug: true,
	debugLevel: 0,
};


class WebServer {
	constructor(options={}) {
		this.host = (Object.keys(options).includes('host')) ? host : DEFAULT.host;
		this.port = (Object.keys(options).includes('port')) ? port : DEFAULT.port;
		this.debug = (Object.keys(options).includes('debug')) ? options.debug : DEFAULT.debug;
		this.url = `http://${this.host}:${this.port}`;

		this.started = false;
		this.app = express();
		this.app.use(cors());
		this.app.use(bodyParser.urlencoded({ extended: true }));
		this.app.listen(this.port, this.host, () => {
			this.#_serverStarted(this.url);
			this.started = true;
		});

		this.#_initConnections();
		this.#_handleOtherConnections();
		this.#_endpointList();
	}

	#_serverStarted(url) {
		sendLog('WEB-SERVER', `Server online a: ${url.brightGreen}`, 'WebServer.#_serverStarted', 2, )
	}

	#_initConnections() {
		this.app.get('/', this._page_homepage);
	}

	#_handleOtherConnections() {
		this.app.get('*', this._page_error);
		this.app.post('*', this._page_error);
	}

	async #_endpointList() {
		return new Promise((resolve) => {
			let eps = [];
			expressListEndpoints(this.app).forEach((endpoint) => {
				eps.push(`[${endpoint.methods.map((item) => { return item.brightGreen}).join(', ')}] ${this.url + (!endpoint.path.startsWith('/') ? '/' : '') + endpoint.path}`);
			});
			setTimeout(() => {
				eps.forEach((e) => {
					sendLog('WEB-SERVER:endpoint'.brightRed, e, 'WebServer.#_endpointList');
				});
				resolve(eps);
			}, 500)
		})
	}

	_page_homepage(req, res) {
		sendLog('WEB-SERVER:page', `200: Homepage`, 'WebServer._page_homepage', 0);
		res.json({ type: 'page', code: 200, desc: 'Homepage'})
	}

	_page_error(req, res) {
		sendLog('WEB-SERVER:error', `404: "${req.url}" not found`, 'WebServer._error_homepage', 1);
		res.json({ type: 'error', code: 404, desc: 'page not found'});
	}
}

function sendLog(...args) {
	_.writeLog(DEFAULT.debug, DEFAULT.debugLevel, ...args);
}

module.exports = WebServer;