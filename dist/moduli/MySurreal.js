const { default: Surreal } = require('surrealdb.js');
const _ = require('./_');

const DEFAULT = {
	host: '127.0.0.1',
	port: 8000,
	path: 'rpc',
	username: null,
	password: null,
	namespace: null,
	database: null,
	debug: true,
	debugLevel: 0,
}

class MySurreal {
	constructor (options={}) {
		this.username = (Object.keys(options).includes('username')) ? options.username : DEFAULT.username;
		this.password = (Object.keys(options).includes('password')) ? options.password : DEFAULT.password;
		this.namespace = (Object.keys(options).includes('namespace')) ? options.namespace : DEFAULT.namespace;
		this.database = (Object.keys(options).includes('database')) ? options.database : DEFAULT.database;

		this.host = (Object.keys(options).includes('host')) ? options.host : DEFAULT.host;
		this.port = (Object.keys(options).includes('port')) ? options.port : DEFAULT.port,
		this.path = (Object.keys(options).includes('path')) ? options.path : DEFAULT.path;
		this.#_debugMessage({
			username: this.username,
			password: this.password,
			namespace: this.namespace,
			database: this.database,
			host: this.host,
			port: this.port,
			path: this.path
		}, 'MySurreal', 2, 'setup');
		this.ready = false;
		this.url = `http://${this.host}:${this.port}/${this.path}`;

		this.#_connect().catch((err) => { this.#_errorHandler(err, '#_connect')});
	}	

	isReady() {
		return this.ready;
	}

	setUser(username, password) {
		this.username = username;
		this.password = password;
		this.#_debugMessage({ username, password }, 'MySurreal.setUser', 2, 'user');
		this.#_connect().catch((err) => { this.#_errorHandler(err, '#_connect')});
	}	

	setNamespace(namespace) {
		this.namespace = namespace;
		this.#_debugMessage({ namespace }, 'MySurreal.setNamespace', 2, 'namespace');
		this.#_connect().catch((err) => { this.#_errorHandler(err, '#_connect')});
	}	

	setDatabase(database) {
		this.database = database;
		this.#_debugMessage({ database }, 'MySurreal.setDatabase', 2, 'database');
		this.#_connect().catch((err) => { this.#_errorHandler(err, '#_connect')});
	}	

	/**
     * Runs a set of SurrealQL statements against the database.
     * @param query - Specifies the SurrealQL statements.
     */
	async query(query) {
		return new Promise(async (resolve) => {
			if (this.db) {
				this.#_debugMessage('query', 'MySurreal.query', 2, 'query')
				resolve((await this.db.query(query))[0].result);
			}
		});
	}

	/**
     * Creates a record in the database.
     * @param thing - The table name or the specific record ID to create.
     * @param data - The document / record data to insert.
     */
	async create(thing, data) {
		return new Promise(async (resolve) => {
			if (this.db) {
				this.#_debugMessage('create query', 'MySurreal.create', 2, 'create')
				resolve((await this.#_dbDataFromThing('create', thing, data))[0].result)
			}
		})
	}
	
	/**
     * Inserts one or multiple records in the database.
     * @param thing - The table name or the specific record ID to create.
     * @param data - The document(s) / record(s) to insert.
     */
	async insert(thing, data) {
		return new Promise(async (resolve) => {
			if (this.db) {
				this.#_debugMessage('insert query', 'MySurreal.insert', 2, 'insert')
				resolve((await this.#_dbDataFromThing('insert', thing, data))[0].result)
			}
		})
	}

	/**
     * Applies JSON Patch changes to all records, or a specific record, in the database.
     *
     * ***NOTE: This function patches the current document / record data with the specified JSON Patch data.***
     * @param thing - The table name or the specific record ID to modify.
     * @param data - The JSON Patch data with which to modify the records.
     */
	async patch(thing, data) {
		return new Promise(async (resolve) => {
			if (this.db) {
				this.#_debugMessage('patch query', 'MySurreal.patch', 2, 'patch')
				resolve((await this.#_dbDataFromThing('patch', thing, data))[0].result)
			}
		})
	}

	/**
     * Modifies all records in a table, or a specific record, in the database.
     *
     * ***NOTE: This function merges the current document / record data with the specified data.***
     * @param thing - The table name or the specific record ID to change.
     * @param data - The document / record data to insert.
     */
	async merge(thing, data) {
		return new Promise(async (resolve) => {
			if (this.db) {
				this.#_debugMessage('merge query', 'MySurreal.merge', 2, 'merge')
				resolve((await this.#_dbDataFromThing('patch', thing, data))[0].result)
			}
		})
	}
	
	/**
     * Deletes all records in a table, or a specific record, from the database.
     * @param thing - The table name or a record ID to select.
     */
	async delete(thing) {
		return new Promise(async (resolve) => {
			if (this.db) {
				this.#_debugMessage('delete query', 'MySurreal.delete', 2, 'delete')
				resolve((await this.db.delete(thing)));
			}
		})
	}

	/**
     * Start a live query and listen for the responses
     * @param table - The table that you want to receive live results for.
     * @param callback - Callback function that receives updates.
     * @param diff - If set to true, will return a set of patches instead of complete records
     */
	async live(table, callback=null) {
		return new Promise(async (resolve) => {
			if (this.db) {
				this.#_debugMessage('live', 'MySurreal.live', 2, 'live')
				resolve(await this.db.live(table, callback));
			}
		});
	}

	/**
     * Kill a live query
     * @param uuid - The query that you want to kill.
     */
	async kill(queryUuid) {
		return new Promise(async(resolve) => {
			if (this.db) {
				this.#_debugMessage('kill', 'MySurreal.kill', 2, 'kill')
				resolve(await this.db.kill(queryUuid));
			}
		})
	}

	/**
     * Modifies all records in a table, or a specific record, in the database.
     *
     * ***NOTE: This function merges the current document / record data with the specified data.***
     * @param thing - The table name or the specific record ID to change.
     * @param data - The document / record data to insert.
     */
	async update(thing, data) {
		return new Promise(async (resolve) => {
			if (this.db) {
				this.#_debugMessage('update', 'MySurreal.update', 2, 'update')
				resolve((await this.#_dbDataFromThing('update', thing, data))[0].result)
			}
		})
	}

	/**
	 * @param operation Type of operation to execute within the database
	 * @param thing  - The table name or the specific record ID to change.
	 * @param data - The document / record data to insert.
	 * @returns 
	 */
	async #_dbDataFromThing(operation, thing, data) {
		return this.db[operation](thing, data);
	}

	/**
     * Disconnect the socket to the database
     */
	async close() {
		return this.db.close();
	}

	#_errorHandler(err, fn=null, lv=1) {
		sendLog(`SURREAL-CONNECTION:error`, err, fn, lv)
	}

	async #_connect() {
		return new Promise(async(resolve, reject) => {
			if (this.username !== null && this.password !== null && this.namespace !== null && this.database !== null) {
				this.db = new Surreal(this.url)
				this.db.signin({ user: this.username, pass: this.password});
				this.db.use({ ns: this.namespace, db: this.database })
				this.ready = true;
				this.#_debugMessage(`Connessione con il database avvenuta con successo all\'indirizzo: ${this.url.brightGreen}`, 'MySurreal.#_connect', 0, 'success')
				resolve(this.ready);
			}
			else {
				let missing = {
					username: (this.username !== null), password: (this.password !== null),
					namespace: (this.namespace !== null), database: (this.database !== null),
				};
				let keys = Object.keys(missing).filter((item) => { return !missing[item] });
				reject(`Missing values: ${keys.join(', ')}`);
			}
		})
	}

	#_debugMessage(d, fn=null, lv=1, sub=null) {
		if (typeof d == 'object') {
			Object.keys(d).forEach((k) => {
				if (d[k] !== null) {
					sendLog(`SURREAL-CONNECTION${(sub !== null) ? `:${sub}` : ''}`, `Settato il valore di ${k.brightGreen}: "${`${d[k]}`.brightGreen}"`, fn, lv);
				}
			})
		} else if (typeof d == 'string') {
			sendLog(`SURREAL-CONNECTION${(sub !== null) ? `:${sub}` : ''}}`, d, fn, lv)
		}
	}
}

function sendLog(...args) {
	_.writeLog(DEFAULT.debug, DEFAULT.debugLevel, ...args);
}


module.exports = MySurreal;